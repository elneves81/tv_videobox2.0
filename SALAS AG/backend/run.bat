@echo off
echo ===================================
echo   Sistema de Agendamento de Salas
echo   Iniciando Servidor Backend...
echo ===================================

REM Verifica se o executável existe
if not exist "build\salasag.exe" (
    echo ERRO: Executavel nao encontrado!
    echo Execute primeiro: build.bat
    pause
    exit /b 1
)

REM Verifica se o arquivo de configuração existe
if not exist "config\database.conf" (
    echo AVISO: Arquivo de configuracao nao encontrado!
    echo Criando config\database.conf com valores padrao...
    
    if not exist "config" mkdir config
    echo host=localhost > config\database.conf
    echo port=3306 >> config\database.conf
    echo user=root >> config\database.conf
    echo password= >> config\database.conf
    echo database=salasag >> config\database.conf
    
    echo.
    echo Configure o banco de dados em: config\database.conf
    echo.
)

echo Configuracao do servidor:
echo - Host: localhost
echo - Porta: 8080
echo - API: http://localhost:8080/api/
echo.
echo Endpoints principais:
echo - POST /api/auth/login
echo - GET  /api/usuarios
echo - GET  /api/salas
echo - GET  /api/agendamentos
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

REM Executa o servidor
build\salasag.exe
