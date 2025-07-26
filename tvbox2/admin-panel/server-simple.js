const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Arquivos de dados JSON
const DATA_DIR = path.join(__dirname, 'data');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');
const UNITS_FILE = path.join(DATA_DIR, 'units.json');
const SYNC_LOG_FILE = path.join(DATA_DIR, 'sync_log.json');

// Garantir que os diretórios existam
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(path.join(__dirname, 'uploads', 'videos'));

// Inicializar arquivos JSON se não existirem
if (!fs.existsSync(VIDEOS_FILE)) {
    fs.writeJsonSync(VIDEOS_FILE, []);
}
if (!fs.existsSync(UNITS_FILE)) {
    fs.writeJsonSync(UNITS_FILE, []);
}
if (!fs.existsSync(SYNC_LOG_FILE)) {
    fs.writeJsonSync(SYNC_LOG_FILE, []);
}

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

// Funções utilitárias para JSON
function readVideos() {
    try {
        return fs.readJsonSync(VIDEOS_FILE);
    } catch (error) {
        return [];
    }
}

function writeVideos(videos) {
    fs.writeJsonSync(VIDEOS_FILE, videos, { spaces: 2 });
}

function readUnits() {
    try {
        return fs.readJsonSync(UNITS_FILE);
    } catch (error) {
        return [];
    }
}

function writeUnits(units) {
    fs.writeJsonSync(UNITS_FILE, units, { spaces: 2 });
}

function readSyncLog() {
    try {
        return fs.readJsonSync(SYNC_LOG_FILE);
    } catch (error) {
        return [];
    }
}

function writeSyncLog(logs) {
    fs.writeJsonSync(SYNC_LOG_FILE, logs, { spaces: 2 });
}

function addSyncLog(unitId, videoId, action, status) {
    const logs = readSyncLog();
    const logEntry = {
        id: uuidv4(),
        unit_id: unitId,
        video_id: videoId,
        action: action,
        status: status,
        timestamp: new Date().toISOString()
    };
    logs.push(logEntry);
    writeSyncLog(logs);
}

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
      priority: parseInt(priority) || 1,
      upload_date: new Date().toISOString(),
      status: 'active'
    };

    const videos = readVideos();
    videos.push(videoData);
    writeVideos(videos);

    res.json({
      message: 'Vídeo enviado com sucesso!',
      video: videoData
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 2. Listar vídeos
app.get('/api/videos', (req, res) => {
  try {
    const { category, status } = req.query;
    let videos = readVideos();

    if (category) {
      videos = videos.filter(video => video.category === category);
    }

    if (status) {
      videos = videos.filter(video => video.status === status);
    }

    // Ordenar por prioridade e data
    videos.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.upload_date) - new Date(a.upload_date);
    });

    res.json(videos);
  } catch (error) {
    console.error('Erro ao listar vídeos:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeos' });
  }
});

// 3. Excluir vídeo
app.delete('/api/videos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const videos = readVideos();
    const videoIndex = videos.findIndex(video => video.id === id);

    if (videoIndex === -1) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = videos[videoIndex];
    
    // Excluir arquivo físico
    const filePath = path.join(__dirname, 'uploads', 'videos', video.filename);
    fs.remove(filePath, (fsErr) => {
      if (fsErr) console.error('Erro ao excluir arquivo:', fsErr);
    });

    // Excluir do array
    videos.splice(videoIndex, 1);
    writeVideos(videos);

    res.json({ message: 'Vídeo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    res.status(500).json({ error: 'Erro ao excluir vídeo' });
  }
});

// 4. API para TV Box - Listar vídeos para sincronização
app.get('/api/sync/videos/:unitId?', (req, res) => {
  try {
    const { unitId } = req.params;
    let videos = readVideos();
    
    // Filtrar apenas vídeos ativos
    videos = videos.filter(video => video.status === 'active');
    
    // Filtrar por unidade se especificada
    if (unitId) {
      videos = videos.filter(video => 
        video.target_units === 'all' || 
        video.target_units.includes(unitId)
      );
      
      // Log da sincronização
      addSyncLog(unitId, null, 'sync_request', 'success');
    }

    // Ordenar por prioridade e data
    videos.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.upload_date) - new Date(a.upload_date);
    });

    res.json({
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        category: video.category,
        filename: video.filename,
        priority: video.priority,
        upload_date: video.upload_date
      })),
      sync_time: new Date().toISOString(),
      total: videos.length
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro ao sincronizar' });
  }
});

// 5. Download de vídeo para TV Box
app.get('/api/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'videos', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('Erro no download:', error);
    res.status(500).json({ error: 'Erro no download' });
  }
});

// 6. Gerenciar unidades de saúde
app.post('/api/units', (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome da unidade é obrigatório' });
    }

    const unitId = uuidv4();
    const unitData = {
      id: unitId,
      name,
      address: address || '',
      phone: phone || '',
      status: 'active',
      last_sync: null,
      created_at: new Date().toISOString()
    };

    const units = readUnits();
    units.push(unitData);
    writeUnits(units);

    res.json({ 
      message: 'Unidade cadastrada com sucesso',
      unit: unitData
    });
  } catch (error) {
    console.error('Erro ao cadastrar unidade:', error);
    res.status(500).json({ error: 'Erro ao cadastrar unidade' });
  }
});

// 7. Listar unidades
app.get('/api/units', (req, res) => {
  try {
    const units = readUnits();
    res.json(units);
  } catch (error) {
    console.error('Erro ao listar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});

// 8. Dashboard - Estatísticas
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const videos = readVideos();
    const units = readUnits();
    const syncLogs = readSyncLog();

    const stats = {
      totalVideos: videos.filter(v => v.status === 'active').length,
      totalUnits: units.filter(u => u.status === 'active').length,
      videosByCategory: [],
      recentSyncs: []
    };

    // Vídeos por categoria
    const categoryCounts = {};
    videos.filter(v => v.status === 'active').forEach(video => {
      categoryCounts[video.category] = (categoryCounts[video.category] || 0) + 1;
    });

    stats.videosByCategory = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }));

    // Últimas sincronizações
    const recentSyncs = syncLogs
      .filter(log => log.action === 'sync_request')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    stats.recentSyncs = recentSyncs.map(sync => {
      const unit = units.find(u => u.id === sync.unit_id);
      return {
        name: unit ? unit.name : 'Unidade desconhecida',
        timestamp: sync.timestamp
      };
    });

    res.json(stats);
  } catch (error) {
    console.error('Erro nas estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// 9. Monitoramento das TVs dos postos
app.get('/api/tv-status', (req, res) => {
  try {
    const units = readUnits();
    const videos = readVideos();
    const syncLogs = readSyncLog();

    const tvStatus = units.map(unit => {
      // Encontrar o último sync desta unidade
      const lastSync = syncLogs
        .filter(log => log.unit_id === unit.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      // Vídeos ativos para esta unidade
      const activeVideos = videos.filter(v => 
        v.status === 'active' && 
        (v.targetUnits === 'all' || (v.targetUnits || []).includes(unit.id))
      );

      // Calcular status online/offline baseado no último ping
      const lastPing = lastSync ? new Date(lastSync.timestamp) : null;
      const isOnline = lastPing && (Date.now() - lastPing.getTime()) < 5 * 60 * 1000; // 5 minutos

      return {
        id: unit.id,
        name: unit.name,
        location: unit.location,
        status: isOnline ? 'online' : 'offline',
        lastSync: lastPing ? lastPing.toISOString() : null,
        currentVideos: activeVideos.map(v => ({
          id: v.id,
          title: v.title,
          category: v.category,
          duration: v.duration
        })),
        totalVideos: activeVideos.length,
        lastActivity: lastPing
      };
    });

    res.json(tvStatus);
  } catch (error) {
    console.error('Erro ao buscar status das TVs:', error);
    res.status(500).json({ error: 'Erro ao buscar status das TVs' });
  }
});

// 10. Enviar vídeos específicos para postos selecionados
app.post('/api/send-videos', (req, res) => {
  try {
    const { videoIds, targetUnits, action = 'send' } = req.body;

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({ error: 'IDs de vídeos são obrigatórios' });
    }

    if (!targetUnits || !Array.isArray(targetUnits) || targetUnits.length === 0) {
      return res.status(400).json({ error: 'Unidades de destino são obrigatórias' });
    }

    const videos = readVideos();
    const units = readUnits();

    // Verificar se os vídeos existem
    const selectedVideos = videos.filter(v => videoIds.includes(v.id));
    if (selectedVideos.length !== videoIds.length) {
      return res.status(400).json({ error: 'Alguns vídeos não foram encontrados' });
    }

    // Verificar se as unidades existem
    const selectedUnits = units.filter(u => targetUnits.includes(u.id));
    if (selectedUnits.length !== targetUnits.length) {
      return res.status(400).json({ error: 'Algumas unidades não foram encontradas' });
    }

    // Registrar a ação no log
    const syncLogs = readSyncLog();
    const logEntry = {
      id: uuidv4(),
      action: 'video_send',
      videoIds: videoIds,
      targetUnits: targetUnits,
      videosCount: selectedVideos.length,
      unitsCount: selectedUnits.length,
      timestamp: new Date().toISOString(),
      admin_user: req.headers['x-admin-user'] || 'admin',
      details: {
        videos: selectedVideos.map(v => ({ id: v.id, title: v.title })),
        units: selectedUnits.map(u => ({ id: u.id, name: u.name }))
      }
    };

    syncLogs.push(logEntry);
    writeSyncLog(syncLogs);

    // Atualizar os vídeos com as novas unidades de destino
    const updatedVideos = videos.map(video => {
      if (videoIds.includes(video.id)) {
        return {
          ...video,
          targetUnits: action === 'send' ? 
            [...new Set([...(video.targetUnits || []), ...targetUnits])] :
            targetUnits,
          lastUpdated: new Date().toISOString()
        };
      }
      return video;
    });

    writeVideos(updatedVideos);

    res.json({
      success: true,
      message: `${selectedVideos.length} vídeo(s) enviado(s) para ${selectedUnits.length} posto(s)`,
      logId: logEntry.id,
      details: {
        videos: selectedVideos.map(v => v.title),
        units: selectedUnits.map(u => u.name)
      }
    });

  } catch (error) {
    console.error('Erro ao enviar vídeos:', error);
    res.status(500).json({ error: 'Erro ao enviar vídeos' });
  }
});

// 11. Log de envios de vídeos
app.get('/api/send-log', (req, res) => {
  try {
    const syncLogs = readSyncLog();
    const sendLogs = syncLogs
      .filter(log => log.action === 'video_send')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50); // Últimos 50 envios

    res.json(sendLogs);
  } catch (error) {
    console.error('Erro ao buscar log de envios:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de envios' });
  }
});
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal do painel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🏥 Servidor do Painel UBS rodando em http://localhost:${PORT}`);
  console.log('📊 Dashboard disponível em: http://localhost:' + PORT);
  console.log('📡 API de sincronização: http://localhost:' + PORT + '/api/sync/videos');
  console.log('💾 Dados salvos em arquivos JSON no diretório: ' + DATA_DIR);
});

module.exports = app;
