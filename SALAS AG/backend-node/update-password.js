const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  try {
    // Conecta ao banco
    const db = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'salas_ag'
    });

    // Gera hash da senha
    const senha = 'admin123';
    const hash = await bcrypt.hash(senha, 10);
    
    console.log('Hash gerado:', hash);

    // Atualiza no banco
    await db.execute(
      'UPDATE usuarios SET senha_hash = ? WHERE email = ?',
      [hash, 'admin@salasag.com']
    );

    console.log('✅ Senha atualizada com sucesso!');

    // Verifica se foi atualizada
    const [rows] = await db.execute(
      'SELECT id, nome, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ?',
      ['admin@salasag.com']
    );

    console.log('Usuário no banco:', rows[0]);

    await db.end();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

updatePassword();
