@echo off
echo ===================================
echo   Sistema de Agendamento de Salas
echo   Compilando Backend (C)...
echo ===================================

REM Verifica se o GCC está instalado
gcc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: GCC nao encontrado! Instale o MinGW ou Visual Studio Build Tools.
    echo Baixe em: https://www.mingw-w64.org/downloads/
    pause
    exit /b 1
)

REM Cria diretório de build se não existir
if not exist "build" mkdir build

REM Compila todos os arquivos .c
echo Compilando arquivos fonte...
gcc -std=c99 -Wall -Wextra -Iinclude -Llib ^
    src/main.c ^
    src/database.c ^
    src/auth.c ^
    src/api_usuarios_salas.c ^
    src/api_agendamentos.c ^
    -o build/salasag.exe ^
    -lmicrohttpd -ljson-c -lmysqlclient

if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao!
    echo.
    echo Verifique se as bibliotecas estao instaladas:
    echo - libmicrohttpd
    echo - json-c
    echo - MySQL Connector/C
    echo.
    echo Para instalar no Windows com vcpkg:
    echo vcpkg install libmicrohttpd json-c libmysql
    pause
    exit /b 1
)

echo.
echo ===================================
echo   Compilacao concluida com sucesso!
echo   Executavel: build/salasag.exe
echo ===================================
pause
