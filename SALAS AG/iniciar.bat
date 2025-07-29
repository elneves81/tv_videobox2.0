@echo off
title Sistema de Agendamento de Salas - Inicializacao
color 0A

:menu
cls
echo.
echo ===================================================
echo           SISTEMA DE AGENDAMENTO DE SALAS
echo                    SALAS AG
echo ===================================================
echo.
echo [1] Configurar e iniciar BACKEND (C)
echo [2] Configurar e iniciar BACKEND (Node.js - Alternativo)
echo [3] Configurar e iniciar FRONTEND (Angular)
echo [4] Configurar BANCO DE DADOS (MySQL)
echo [5] Iniciar TUDO (Backend + Frontend)
echo [6] Instalar MinGW/GCC para backend C
echo [7] Status dos servicos
echo [8] Documentacao da API
echo [0] Sair
echo.
set /p opcao="Escolha uma opcao: "

if "%opcao%"=="1" goto backend
if "%opcao%"=="2" goto backend_node
if "%opcao%"=="3" goto frontend
if "%opcao%"=="4" goto database
if "%opcao%"=="5" goto todos
if "%opcao%"=="6" goto install_mingw
if "%opcao%"=="7" goto status
if "%opcao%"=="8" goto docs
if "%opcao%"=="0" goto sair
goto menu

:backend
cls
echo Iniciando Backend...
cd backend
call build.bat
if %errorlevel%==0 (
    echo.
    echo Pressione qualquer tecla para executar o servidor...
    pause >nul
    call run.bat
)
cd ..
pause
goto menu

:backend_node
cls
echo Iniciando Backend Node.js...
cd backend-node
call setup-node.bat
if %errorlevel%==0 (
    echo.
    echo Pressione qualquer tecla para executar o servidor...
    pause >nul
    call run-node.bat
)
cd ..
pause
goto menu

:frontend
cls
echo Configurando Frontend...
cd frontend
call setup.bat
if %errorlevel%==0 (
    echo.
    echo Pressione qualquer tecla para executar o frontend...
    pause >nul
    call run-frontend.bat
)
cd ..
pause
goto menu

:database
cls
echo ===================================
echo   Configuracao do Banco de Dados
echo ===================================
echo.
echo 1. Certifique-se de que o MySQL esta instalado e rodando
echo 2. Execute os comandos abaixo no MySQL:
echo.
echo    mysql -u root -p
echo    CREATE DATABASE salasag;
echo    USE salasag;
echo    SOURCE database/schema.sql;
echo.
echo 3. Configure as credenciais em: backend/config/database.conf
echo.
echo Arquivo schema.sql: database/schema.sql
echo.
pause
goto menu

:todos
cls
echo Iniciando todos os servicos...
echo.
echo 1. Compilando backend...
cd backend
call build.bat >nul 2>&1
cd ..

echo 2. Configurando frontend...
cd frontend
if not exist "node_modules" (
    call setup.bat >nul 2>&1
)
cd ..

echo 3. Iniciando backend em segundo plano...
start "Backend Server" cmd /k "cd backend && run.bat"

timeout /t 3 >nul

echo 4. Iniciando frontend...
cd frontend
start "Frontend Server" cmd /k "run-frontend.bat"
cd ..

echo.
echo ===================================
echo   Todos os servicos foram iniciados!
echo   
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:4200
echo ===================================
echo.
pause
goto menu

:install_mingw
cls
echo ===================================
echo   Instalacao do MinGW/GCC
echo ===================================
echo.
echo Este processo ira baixar e instalar o MinGW-w64
echo para compilar o backend em C.
echo.
call instalar-mingw.bat
pause
goto menu

:status
cls
echo ===================================
echo        Status dos Servicos
echo ===================================
echo.

echo Verificando Backend (porta 8080)...
netstat -an | findstr ":8080" >nul
if %errorlevel%==0 (
    echo [OK] Backend rodando na porta 8080
) else (
    echo [--] Backend nao esta rodando
)

echo.
echo Verificando Frontend (porta 4200)...
netstat -an | findstr ":4200" >nul
if %errorlevel%==0 (
    echo [OK] Frontend rodando na porta 4200
) else (
    echo [--] Frontend nao esta rodando
)

echo.
echo Verificando MySQL (porta 3306)...
netstat -an | findstr ":3306" >nul
if %errorlevel%==0 (
    echo [OK] MySQL rodando na porta 3306
) else (
    echo [--] MySQL nao esta rodando
)

echo.
pause
goto menu

:docs
cls
echo ===================================
echo     Documentacao da API
echo ===================================
echo.
echo Documentacao completa: docs/api.md
echo.
echo URLs de teste:
echo - GET  http://localhost:8080/api/status
echo - POST http://localhost:8080/api/auth/login
echo - GET  http://localhost:8080/api/usuarios
echo - GET  http://localhost:8080/api/salas
echo.
echo Credenciais de teste:
echo - Usuario: admin@salasag.com
echo - Senha: admin123
echo.
echo Use Postman ou curl para testar a API
echo.
pause
goto menu

:sair
cls
echo.
echo Encerrando o sistema...
echo Obrigado por usar o SALAS AG!
echo.
timeout /t 2 >nul
exit
