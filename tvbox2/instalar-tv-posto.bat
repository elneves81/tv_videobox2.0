@echo off
cls
color 0A
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║            🏥 INSTALADOR TV UBS GUARAPUAVA 🏥              ║
echo  ║                 Configuracao Automatica                   ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

:: Solicitar informações
set /p SERVER_IP="📡 Digite o IP do servidor (ex: 192.168.1.100): "
if "%SERVER_IP%"=="" set SERVER_IP=localhost

echo.
echo 🏥 Escolha o codigo do seu posto:
echo.
echo [1] ubs-centro-guarapuava
echo [2] ubs-bom-jesus  
echo [3] ubs-primavera
echo [4] ubs-jardim-america
echo [5] ubs-santa-cruz
echo [6] Digitar codigo personalizado
echo.
set /p OPCAO="Digite o numero da opcao (1-6): "

if "%OPCAO%"=="1" set POSTO_CODE=ubs-centro-guarapuava
if "%OPCAO%"=="2" set POSTO_CODE=ubs-bom-jesus
if "%OPCAO%"=="3" set POSTO_CODE=ubs-primavera
if "%OPCAO%"=="4" set POSTO_CODE=ubs-jardim-america
if "%OPCAO%"=="5" set POSTO_CODE=ubs-santa-cruz
if "%OPCAO%"=="6" (
    set /p POSTO_CODE="📍 Digite o codigo do posto: "
)

:: Construir URL completa
set URL_COMPLETA=http://%SERVER_IP%:3001/tv-posto.html?posto=%POSTO_CODE%

echo.
echo ⚙️ CONFIGURANDO TV DO POSTO...
echo.
echo 📡 Servidor: %SERVER_IP%
echo 🏥 Posto: %POSTO_CODE%
echo 🔗 URL: %URL_COMPLETA%
echo.

:: Criar arquivo HTML de redirecionamento local
echo ^<html^> > tv-local.html
echo ^<head^> >> tv-local.html
echo ^<title^>TV %POSTO_CODE%^</title^> >> tv-local.html
echo ^<meta http-equiv="refresh" content="1;url=%URL_COMPLETA%"^> >> tv-local.html
echo ^</head^> >> tv-local.html
echo ^<body style="background: #2c3e50; color: white; font-family: Arial; text-align: center; padding: 50px;"^> >> tv-local.html
echo ^<h1^>🏥 Carregando TV UBS Guarapuava^</h1^> >> tv-local.html
echo ^<h2^>Posto: %POSTO_CODE%^</h2^> >> tv-local.html
echo ^<p^>Redirecionando automaticamente...^</p^> >> tv-local.html
echo ^<p^>^<a href="%URL_COMPLETA%" style="color: #3498db;"^>Clique aqui se nao redirecionar^</a^>^</p^> >> tv-local.html
echo ^</body^> >> tv-local.html
echo ^</html^> >> tv-local.html

:: Criar atalho na área de trabalho
echo.
echo 🖥️ Criando atalho na area de trabalho...

:: Criar script VBS para criar atalho
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = oWS.ExpandEnvironmentStrings("%%USERPROFILE%%\Desktop\TV UBS %POSTO_CODE%.lnk") >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%CD%\tv-local.html" >> CreateShortcut.vbs
echo oLink.Description = "TV UBS Guarapuava - %POSTO_CODE%" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

:: Executar script VBS
cscript CreateShortcut.vbs >nul 2>&1
del CreateShortcut.vbs

echo.
echo ✅ INSTALACAO CONCLUIDA!
echo.
echo 📋 O que foi criado:
echo    • Arquivo tv-local.html (redirecionamento)
echo    • Atalho na area de trabalho
echo.
echo 🚀 COMO USAR:
echo    1. Clique duplo no atalho "TV UBS %POSTO_CODE%" na area de trabalho
echo    2. O navegador abrira automaticamente
echo    3. Deixe em tela cheia (F11)
echo    4. A TV ficara rodando automaticamente!
echo.
echo 🔧 CONFIGURACOES AVANCADAS:
echo    • Para abrir direto no Chrome: chrome.exe --kiosk "%URL_COMPLETA%"
echo    • Para abrir direto no Firefox: firefox.exe -private-window "%URL_COMPLETA%"
echo.

:: Perguntar se quer abrir agora
echo.
set /p ABRIR="🚀 Quer abrir a TV agora? (S/N): "
if /i "%ABRIR%"=="S" (
    echo.
    echo 📺 Abrindo TV UBS %POSTO_CODE%...
    start "" "%URL_COMPLETA%"
)

echo.
echo 📞 SUPORTE: Se houver problemas, verifique:
echo    • Conexao com internet
echo    • Servidor %SERVER_IP% funcionando na porta 3001
echo    • Codigo do posto correto: %POSTO_CODE%
echo.
echo Pressione qualquer tecla para sair...
pause >nul
