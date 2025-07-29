@echo off
echo ===================================
echo   RESET MySQL - XAMPP
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
    pause
    exit /b 1
)

echo.
echo ⚠️  ATENÇÃO: Este script irá APAGAR e RECRIAR o banco 'salas_ag'
echo Todos os dados existentes serão perdidos!
echo.
set /p confirm="Deseja continuar? (S/N): "
if /i not "%confirm%"=="S" if /i not "%confirm%"=="s" (
    echo Operação cancelada
    pause
    exit /b 0
)

echo.
echo Apagando banco existente...
"%MYSQL_PATH%\mysql.exe" -u root -e "DROP DATABASE IF EXISTS salas_ag;"

echo Criando novo banco...
"%MYSQL_PATH%\mysql.exe" -u root -e "CREATE DATABASE salas_ag CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo Importando schema...
"%MYSQL_PATH%\mysql.exe" -u root salas_ag < "..\database\schema.sql"

if %errorlevel% neq 0 (
    echo ❌ Erro ao importar schema!
    pause
    exit /b 1
)

echo ✅ Banco recriado com sucesso!

echo.
echo Verificando tabelas criadas...
"%MYSQL_PATH%\mysql.exe" -u root -e "USE salas_ag; SHOW TABLES;"

echo.
echo ===================================
echo   Banco configurado com sucesso!
echo ===================================
pause
