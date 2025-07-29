-- Criar banco GuaraBrechó
CREATE DATABASE guarabrecho;

-- Criar usuário para o projeto
CREATE USER guarabrecho_user WITH ENCRYPTED PASSWORD 'guarabrecho_pass';

-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE guarabrecho TO guarabrecho_user;

-- Conectar ao banco guarabrecho e dar permissões no schema public
\c guarabrecho;
GRANT ALL ON SCHEMA public TO guarabrecho_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO guarabrecho_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO guarabrecho_user;
