@echo off
echo ===================================
echo   Backend Node.js - SALAS AG
echo   Configurando dependencias...
echo ===================================

REM Verifica se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Baixe e instale em: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detectado:
node --version
echo.

echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo ===================================
echo   Dependencias instaladas!
echo   Execute: run-node.bat
echo ===================================
pause
