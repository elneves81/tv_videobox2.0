@echo off
echo ===================================
echo   Backend Node.js - SALAS AG
echo   Iniciando servidor...
echo ===================================

REM Verifica se as dependências estão instaladas
if not exist "node_modules" (
    echo ERRO: Dependencias nao instaladas!
    echo Execute primeiro: setup-node.bat
    pause
    exit /b 1
)

echo Configuracao:
echo - Host: localhost
echo - Porta: 8080
echo - Database: salas_ag
echo.
echo Endpoints disponiveis:
echo - GET  http://localhost:8080/api/status
echo - POST http://localhost:8080/api/auth/login
echo - GET  http://localhost:8080/api/usuarios
echo - GET  http://localhost:8080/api/salas
echo - GET  http://localhost:8080/api/agendamentos
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

REM Executa o servidor
npm start
