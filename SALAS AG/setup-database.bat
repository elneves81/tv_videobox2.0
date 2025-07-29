@echo off
echo ===================================
echo   Configuracao do MySQL - SALAS AG
echo ===================================

REM Verifica se o MySQL está instalado
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: MySQL nao encontrado no PATH!
    echo.
    echo Para instalar o MySQL:
    echo 1. Baixe em: https://dev.mysql.com/downloads/installer/
    echo 2. Execute o MySQL Installer
    echo 3. Escolha "Server only" ou "Full"
    echo 4. Configure a senha do root
    echo.
    echo Ou use XAMPP/WAMP que incluem MySQL:
    echo - XAMPP: https://www.apachefriends.org/
    echo - WAMP: https://www.wampserver.com/
    echo.
    echo Depois que instalar, execute este script novamente.
    pause
    exit /b 1
)

echo MySQL detectado:
mysql --version
echo.

echo ===================================
echo   Criando banco de dados...
echo ===================================

echo Digite a senha do root do MySQL quando solicitado.
echo.

REM Cria o banco de dados
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS salas_ag CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar banco de dados!
    echo Verifique se:
    echo 1. O MySQL esta rodando
    echo 2. A senha do root esta correta
    echo 3. Voce tem permissoes para criar bancos
    pause
    exit /b 1
)

echo.
echo Importando schema...
mysql -u root -p salas_ag < ..\database\schema.sql

if %errorlevel% neq 0 (
    echo ERRO: Falha ao importar schema!
    echo Verifique se o arquivo schema.sql existe em: ..\database\schema.sql
    pause
    exit /b 1
)

echo.
echo ===================================
echo   Banco configurado com sucesso!
echo   
echo   Banco: salas_ag
echo   Tabelas: usuarios, salas, agendamentos
echo   Usuario admin: admin@salasag.com
echo   Senha admin: admin123
echo ===================================
pause
