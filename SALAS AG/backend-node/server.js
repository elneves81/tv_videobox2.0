const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'salasag_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'salas_ag'
};

// Conexão com o banco
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao MySQL');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    process.exit(1);
  }
}

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas de autenticação
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const [rows] = await db.execute(
      'SELECT id, nome, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ? AND ativo = 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: usuario.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo = 'comum' } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verifica se o email já existe
    const [existing] = await db.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, ativo, data_criacao) VALUES (?, ?, ?, ?, 1, NOW())',
      [nome, email, senhaHash, tipo]
    );

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de usuários
app.get('/api/usuarios', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, nome, email, tipo_usuario, ativo, data_criacao FROM usuarios ORDER BY nome'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de salas
app.get('/api/salas', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, nome, descricao, capacidade, recursos, ativa, data_criacao FROM salas ORDER BY nome'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/salas', authenticateToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem criar salas' });
    }

    const { nome, descricao, capacidade, recursos } = req.body;

    if (!nome || !capacidade) {
      return res.status(400).json({ error: 'Nome e capacidade são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO salas (nome, descricao, capacidade, recursos, ativa, data_criacao) VALUES (?, ?, ?, ?, 1, NOW())',
      [nome, descricao || '', capacidade, recursos || '']
    );

    res.status(201).json({
      success: true,
      message: 'Sala criada com sucesso',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de agendamentos
app.get('/api/agendamentos', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.id, a.titulo, a.descricao, a.data_inicio, a.data_fim, a.status,
             s.nome as sala_nome, u.nome as usuario_nome
      FROM agendamentos a
      JOIN salas s ON a.sala_id = s.id
      JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.data_inicio DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/agendamentos', authenticateToken, async (req, res) => {
  try {
    const { sala_id, titulo, descricao, data_inicio, data_fim } = req.body;

    if (!sala_id || !titulo || !data_inicio || !data_fim) {
      return res.status(400).json({ error: 'Dados obrigatórios: sala_id, titulo, data_inicio, data_fim' });
    }

    // Verifica conflitos
    const [conflicts] = await db.execute(`
      SELECT id FROM agendamentos 
      WHERE sala_id = ? AND status = 'confirmado'
      AND ((data_inicio <= ? AND data_fim > ?) OR (data_inicio < ? AND data_fim >= ?))
    `, [sala_id, data_inicio, data_inicio, data_fim, data_fim]);

    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'Horário já ocupado para esta sala' });
    }

    const [result] = await db.execute(
      'INSERT INTO agendamentos (usuario_id, sala_id, titulo, descricao, data_inicio, data_fim, status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, "confirmado", NOW())',
      [req.user.id, sala_id, titulo, descricao || '', data_inicio, data_fim]
    );

    res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'API SALAS AG funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Inicialização do servidor
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`
    ===================================
      🚀 SALAS AG API (Node.js)
      Servidor rodando na porta ${PORT}
      http://localhost:${PORT}/api/status
    ===================================
    `);
  });
}

startServer().catch(console.error);
