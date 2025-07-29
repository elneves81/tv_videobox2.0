@echo off
echo ===================================
echo   Sistema de Agendamento de Salas
echo   Configurando Frontend (Angular)...
echo ===================================

REM Verifica se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Baixe e instale em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verifica se o Angular CLI está instalado
ng version >nul 2>&1
if %errorlevel% neq 0 (
    echo Angular CLI nao encontrado. Instalando...
    npm install -g @angular/cli
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar Angular CLI!
        pause
        exit /b 1
    )
)

echo Instalando dependencias do projeto...
npm install

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo ===================================
echo   Frontend configurado com sucesso!
echo   Execute: run-frontend.bat
echo ===================================
pause
