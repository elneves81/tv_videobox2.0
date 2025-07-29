@echo off
echo ===================================
echo   Instalacao Automatica do MinGW
echo   Sistema de Agendamento de Salas
echo ===================================

set MINGW_URL=https://github.com/niXman/mingw-builds-binaries/releases/download/13.2.0-rt_v11-rev1/x86_64-13.2.0-release-posix-seh-msvcrt-rt_v11-rev1.7z
set MINGW_DIR=C:\mingw64
set TEMP_DIR=%TEMP%\mingw_installer

echo Criando diretorio temporario...
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

echo.
echo AVISO: Este script ira:
echo 1. Baixar MinGW-w64 (cerca de 200MB)
echo 2. Extrair para C:\mingw64
echo 3. Adicionar ao PATH do sistema
echo.
echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

echo.
echo Verificando se MinGW ja esta instalado...
gcc --version >nul 2>&1
if %errorlevel%==0 (
    echo MinGW ja esta instalado!
    gcc --version
    pause
    exit /b 0
)

echo.
echo Baixando MinGW-w64...
echo Isso pode demorar alguns minutos dependendo da sua conexao...

REM Verifica se o PowerShell pode baixar
powershell -Command "try { Invoke-WebRequest -Uri '%MINGW_URL%' -OutFile '%TEMP_DIR%\mingw.7z' -UseBasicParsing; Write-Host 'Download concluido!' } catch { Write-Host 'Erro no download:' $_.Exception.Message; exit 1 }"

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha no download automatico!
    echo.
    echo SOLUCAO MANUAL:
    echo 1. Baixe manualmente: %MINGW_URL%
    echo 2. Extraia para: C:\mingw64
    echo 3. Adicione C:\mingw64\bin ao PATH do sistema
    echo.
    pause
    exit /b 1
)

echo.
echo Extraindo MinGW...

REM Tenta extrair com 7zip se estiver disponivel
where 7z >nul 2>&1
if %errorlevel%==0 (
    7z x "%TEMP_DIR%\mingw.7z" -o"C:\" -y
) else (
    REM Tenta com PowerShell (para arquivos zip)
    echo Tentando extrair com PowerShell...
    powershell -Command "try { Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('%TEMP_DIR%\mingw.7z', 'C:\'); Write-Host 'Extracao concluida!' } catch { Write-Host 'Erro na extracao. Use 7-Zip manualmente.'; exit 1 }"
)

if not exist "%MINGW_DIR%\bin\gcc.exe" (
    echo.
    echo ERRO: Extracao falhou!
    echo.
    echo SOLUCAO MANUAL:
    echo 1. Baixe 7-Zip: https://www.7-zip.org/
    echo 2. Extraia o arquivo: %TEMP_DIR%\mingw.7z
    echo 3. Mova a pasta para: C:\mingw64
    echo.
    pause
    exit /b 1
)

echo.
echo Adicionando ao PATH...

REM Adiciona ao PATH do usuario atual
for /f "usebackq tokens=2,*" %%A in (`reg query HKCU\Environment /v PATH 2^>nul`) do set current_path=%%B
if not defined current_path set current_path=
echo %current_path% | findstr /i "mingw64" >nul
if %errorlevel% neq 0 (
    setx PATH "%current_path%;%MINGW_DIR%\bin"
    echo PATH atualizado! Feche e reabra o terminal.
) else (
    echo MinGW ja esta no PATH!
)

echo.
echo Limpando arquivos temporarios...
rmdir /s /q "%TEMP_DIR%" 2>nul

echo.
echo ===================================
echo   MinGW instalado com sucesso!
echo ===================================
echo.
echo Versao instalada:
"%MINGW_DIR%\bin\gcc.exe" --version

echo.
echo IMPORTANTE: Feche e reabra o terminal para usar o GCC
echo Depois execute: build.bat
echo.
pause
