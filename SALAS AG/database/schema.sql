-- Sistema de Agendamento de Salas - Schema do Banco de Dados
-- MySQL 8.0+

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS salas_ag CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE salas_ag;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    departamento VARCHAR(100),
    tipo_usuario ENUM('admin', 'comum') DEFAULT 'comum',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_tipo (tipo_usuario),
    INDEX idx_ativo (ativo)
);

-- Tabela de salas
CREATE TABLE salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    capacidade INT NOT NULL,
    localizacao VARCHAR(200),
    recursos JSON, -- Ex: {"projetor": true, "tv": true, "quadro": false}
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nome (nome),
    INDEX idx_capacidade (capacidade),
    INDEX idx_ativa (ativa)
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sala_id INT NOT NULL,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    status ENUM('agendado', 'confirmado', 'cancelado', 'realizado') DEFAULT 'agendado',
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    INDEX idx_sala_data (sala_id, data_inicio, data_fim),
    INDEX idx_usuario (usuario_id),
    INDEX idx_status (status),
    INDEX idx_data_inicio (data_inicio),
    INDEX idx_data_fim (data_fim)
);

-- Tabela de participantes dos agendamentos
CREATE TABLE agendamento_participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agendamento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    confirmado BOOLEAN DEFAULT FALSE,
    data_confirmacao TIMESTAMP NULL,
    
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_agendamento_usuario (agendamento_id, usuario_id),
    INDEX idx_agendamento (agendamento_id),
    INDEX idx_usuario (usuario_id)
);

-- Tabela de sessões de usuário
CREATE TABLE sessoes (
    id VARCHAR(64) PRIMARY KEY,
    usuario_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
    ativa BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_expiracao (data_expiracao),
    INDEX idx_ativa (ativa)
);

-- Tabela de logs de auditoria
CREATE TABLE logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(50) NOT NULL,
    tabela_afetada VARCHAR(50),
    registro_id INT,
    dados_anteriores JSON,
    dados_novos JSON,
    ip_address VARCHAR(45),
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_acao (acao),
    INDEX idx_tabela (tabela_afetada),
    INDEX idx_data (data_acao)
);

-- Inserção de dados iniciais
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) VALUES 
('Administrador', 'admin@salasag.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('João Silva', 'joao@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'comum'),
('Maria Santos', 'maria@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'comum');

INSERT INTO salas (nome, descricao, capacidade, localizacao, recursos) VALUES 
('Sala de Reunião A', 'Sala principal para reuniões executivas', 12, 'Térreo - Ala Norte', '{"projetor": true, "tv": true, "quadro": true, "ac": true}'),
('Sala de Reunião B', 'Sala média para reuniões de equipe', 8, 'Primeiro Andar - Ala Sul', '{"projetor": true, "tv": false, "quadro": true, "ac": true}'),
('Auditório', 'Espaço amplo para apresentações', 50, 'Térreo - Centro', '{"projetor": true, "tv": true, "quadro": false, "ac": true, "microfone": true}'),
('Sala de Treinamento', 'Sala para cursos e capacitações', 20, 'Segundo Andar - Ala Norte', '{"projetor": true, "tv": false, "quadro": true, "ac": true}');

-- Criação de views úteis
CREATE VIEW view_agendamentos_detalhados AS
SELECT 
    a.id,
    a.titulo,
    a.descricao,
    a.data_inicio,
    a.data_fim,
    a.status,
    s.nome as sala_nome,
    s.capacidade as sala_capacidade,
    u.nome as usuario_nome,
    u.email as usuario_email,
    (SELECT COUNT(*) FROM agendamento_participantes ap WHERE ap.agendamento_id = a.id) as total_participantes
FROM agendamentos a
JOIN salas s ON a.sala_id = s.id
JOIN usuarios u ON a.usuario_id = u.id
WHERE a.status != 'cancelado'
ORDER BY a.data_inicio;

-- Trigger para atualizar data_atualizacao automaticamente
DELIMITER //

CREATE TRIGGER tr_usuarios_updated
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
BEGIN
    SET NEW.data_atualizacao = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER tr_salas_updated
    BEFORE UPDATE ON salas
    FOR EACH ROW
BEGIN
    SET NEW.data_atualizacao = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER tr_agendamentos_updated
    BEFORE UPDATE ON agendamentos
    FOR EACH ROW
BEGIN
    SET NEW.data_atualizacao = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- Procedura para verificar conflitos de agendamento
DELIMITER //

CREATE PROCEDURE sp_verificar_conflito_agendamento(
    IN p_sala_id INT,
    IN p_data_inicio DATETIME,
    IN p_data_fim DATETIME,
    IN p_agendamento_id INT,
    OUT p_conflito BOOLEAN
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_count
    FROM agendamentos
    WHERE sala_id = p_sala_id
    AND status IN ('agendado', 'confirmado')
    AND (p_agendamento_id IS NULL OR id != p_agendamento_id)
    AND (
        (data_inicio <= p_data_inicio AND data_fim > p_data_inicio) OR
        (data_inicio < p_data_fim AND data_fim >= p_data_fim) OR
        (data_inicio >= p_data_inicio AND data_fim <= p_data_fim)
    );
    
    SET p_conflito = (v_count > 0);
END//

DELIMITER ;
