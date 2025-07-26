const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 uploads por IP
  message: 'Muitos uploads. Tente novamente em 15 minutos.'
});

// Configuração do banco de dados
const db = new sqlite3.Database('./ubs_content.db');

// Criar tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    filename TEXT NOT NULL,
    duration INTEGER,
    size INTEGER,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    target_units TEXT,
    priority INTEGER DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    last_sync DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sync_log (
    id TEXT PRIMARY KEY,
    unit_id TEXT,
    video_id TEXT,
    action TEXT,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(unit_id) REFERENCES units(id),
    FOREIGN KEY(video_id) REFERENCES videos(id)
  )`);
});

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'videos');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Use MP4, AVI, MOV ou WMV.'));
    }
  }
});

// ===== ROTAS DA API =====

// 1. Upload de vídeo
app.post('/api/videos/upload', uploadLimit, upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { title, description, category, targetUnits, priority } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ error: 'Título e categoria são obrigatórios' });
    }

    const videoId = uuidv4();
    const videoData = {
      id: videoId,
      title,
      description: description || '',
      category,
      filename: req.file.filename,
      size: req.file.size,
      target_units: targetUnits || 'all',
      priority: parseInt(priority) || 1
    };

    db.run(
      `INSERT INTO videos (id, title, description, category, filename, size, target_units, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [videoData.id, videoData.title, videoData.description, videoData.category, 
       videoData.filename, videoData.size, videoData.target_units, videoData.priority],
      function(err) {
        if (err) {
          console.error('Erro ao salvar vídeo:', err);
          return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
        }

        res.json({
          message: 'Vídeo enviado com sucesso!',
          video: videoData
        });
      }
    );

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 2. Listar vídeos
app.get('/api/videos', (req, res) => {
  const { category, status } = req.query;
  
  let query = 'SELECT * FROM videos WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY priority DESC, upload_date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar vídeos' });
    }
    res.json(rows);
  });
});

// 3. Excluir vídeo
app.delete('/api/videos/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT filename FROM videos WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Excluir arquivo físico
    const filePath = path.join(__dirname, 'uploads', 'videos', row.filename);
    fs.remove(filePath, (fsErr) => {
      if (fsErr) console.error('Erro ao excluir arquivo:', fsErr);
    });

    // Excluir do banco
    db.run('DELETE FROM videos WHERE id = ?', [id], function(dbErr) {
      if (dbErr) {
        return res.status(500).json({ error: 'Erro ao excluir do banco' });
      }
      res.json({ message: 'Vídeo excluído com sucesso' });
    });
  });
});

// 4. API para TV Box - Listar vídeos para sincronização
app.get('/api/sync/videos/:unitId?', (req, res) => {
  const { unitId } = req.params;
  
  let query = `SELECT id, title, description, category, filename, priority, upload_date 
               FROM videos 
               WHERE status = 'active'`;
  
  if (unitId) {
    query += ` AND (target_units = 'all' OR target_units LIKE '%${unitId}%')`;
  }
  
  query += ' ORDER BY priority DESC, upload_date DESC';

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao sincronizar' });
    }

    // Log da sincronização
    if (unitId) {
      const logId = uuidv4();
      db.run(
        'INSERT INTO sync_log (id, unit_id, action, status) VALUES (?, ?, ?, ?)',
        [logId, unitId, 'sync_request', 'success']
      );
    }

    res.json({
      videos: rows,
      sync_time: new Date().toISOString(),
      total: rows.length
    });
  });
});

// 5. Download de vídeo para TV Box
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', 'videos', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// 6. Gerenciar unidades de saúde
app.post('/api/units', (req, res) => {
  const { name, address, phone } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Nome da unidade é obrigatório' });
  }

  const unitId = uuidv4();
  
  db.run(
    'INSERT INTO units (id, name, address, phone) VALUES (?, ?, ?, ?)',
    [unitId, name, address || '', phone || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao cadastrar unidade' });
      }
      res.json({ 
        message: 'Unidade cadastrada com sucesso',
        unit: { id: unitId, name, address, phone }
      });
    }
  );
});

// 7. Listar unidades
app.get('/api/units', (req, res) => {
  db.all('SELECT * FROM units ORDER BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar unidades' });
    }
    res.json(rows);
  });
});

// 8. Dashboard - Estatísticas
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  // Total de vídeos
  db.get('SELECT COUNT(*) as total FROM videos WHERE status = "active"', (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro nas estatísticas' });
    
    stats.totalVideos = result.total;
    
    // Total de unidades
    db.get('SELECT COUNT(*) as total FROM units WHERE status = "active"', (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro nas estatísticas' });
      
      stats.totalUnits = result.total;
      
      // Vídeos por categoria
      db.all('SELECT category, COUNT(*) as count FROM videos WHERE status = "active" GROUP BY category', (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro nas estatísticas' });
        
        stats.videosByCategory = rows;
        
        // Últimas sincronizações
        db.all(`SELECT u.name, s.timestamp FROM sync_log s 
                JOIN units u ON s.unit_id = u.id 
                WHERE s.action = 'sync_request' 
                ORDER BY s.timestamp DESC LIMIT 5`, (err, rows) => {
          if (err) return res.status(500).json({ error: 'Erro nas estatísticas' });
          
          stats.recentSyncs = rows;
          res.json(stats);
        });
      });
    });
  });
});

// Servir arquivos estáticos (painel web)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal do painel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🏥 Servidor do Painel UBS rodando em http://localhost:${PORT}`);
  console.log('📊 Dashboard disponível em: http://localhost:${PORT}');
  console.log('📡 API de sincronização: http://localhost:${PORT}/api/sync/videos');
});

module.exports = app;
