@echo off
echo ===================================
echo   Configuracao MySQL - XAMPP
echo   Sistema de Agendamento de Salas
echo ===================================

REM Verifica se o XAMPP está instalado
set XAMPP_PATH=C:\xampp
if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin
    echo ✅ XAMPP encontrado em: C:\xampp
) else if exist "D:\xampp\mysql\bin\mysql.exe" (
    set XAMPP_PATH=D:\xampp
    set MYSQL_PATH=D:\xampp\mysql\bin
    echo ✅ XAMPP encontrado em: D:\xampp
) else (
    echo ❌ XAMPP não encontrado!
    echo.
    echo Por favor:
    echo 1. Instale o XAMPP em C:\xampp ou D:\xampp
    echo 2. Inicie o Apache e MySQL no painel do XAMPP
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo.
echo Verificando se o MySQL está rodando...
netstat -an | findstr ":3306" >nul
if %errorlevel% neq 0 (
    echo ❌ MySQL não está rodando!
    echo.
    echo Por favor:
    echo 1. Abra o XAMPP Control Panel
    echo 2. Clique em "Start" no MySQL
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo ✅ MySQL está rodando na porta 3306

echo.
echo Criando banco de dados...
echo.

REM Cria o banco de dados
"%MYSQL_PATH%\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS salas_ag CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %errorlevel% neq 0 (
    echo ❌ Erro ao criar banco de dados!
    echo Verifique se o MySQL está rodando no XAMPP
    pause
    exit /b 1
)

echo ✅ Banco 'salas_ag' criado/verificado

echo.
echo Importando schema...
"%MYSQL_PATH%\mysql.exe" -u root salas_ag < "..\database\schema.sql"

if %errorlevel% neq 0 (
    echo ❌ Erro ao importar schema!
    echo Verifique se o arquivo schema.sql existe
    pause
    exit /b 1
)

echo ✅ Schema importado com sucesso

echo.
echo Verificando tabelas criadas...
"%MYSQL_PATH%\mysql.exe" -u root -e "USE salas_ag; SHOW TABLES;"

echo.
echo ===================================
echo   Banco configurado com sucesso!
echo ===================================
echo.
echo Configurações:
echo - Host: localhost
echo - Porta: 3306
echo - Usuário: root
echo - Senha: (vazia)
echo - Banco: salas_ag
echo.
echo Usuário admin padrão:
echo - Email: admin@salasag.com
echo - Senha: admin123
echo.
echo Agora você pode executar: npm start
echo.
pause
