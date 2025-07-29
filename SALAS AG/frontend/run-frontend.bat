@echo off
echo ===================================
echo   Sistema de Agendamento de Salas
echo   Iniciando Frontend (Angular)...
echo ===================================

REM Verifica se as dependências estão instaladas
if not exist "node_modules" (
    echo ERRO: Dependencias nao instaladas!
    echo Execute primeiro: setup.bat
    pause
    exit /b 1
)

echo Configuracao do frontend:
echo - Host: localhost
echo - Porta: 4200
echo - URL: http://localhost:4200
echo.
echo O navegador sera aberto automaticamente
echo Pressione Ctrl+C para parar o servidor
echo.

REM Executa o servidor de desenvolvimento
ng serve --open
