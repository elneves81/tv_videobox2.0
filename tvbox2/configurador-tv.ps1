# TV UBS Guarapuava - Configurador PowerShell
# Executa com: PowerShell -ExecutionPolicy Bypass -File configurador-tv.ps1

param(
    [string]$ServerIP = "",
    [string]$PostoCode = "",
    [switch]$AutoStart = $false,
    [switch]$Kiosk = $false
)

# Configurações
$PortaServidor = 3001
$PostosDisponiveis = @{
    "1" = @{ Nome = "UBS Centro Guarapuava"; Codigo = "ubs-centro-guarapuava" }
    "2" = @{ Nome = "UBS Bom Jesus"; Codigo = "ubs-bom-jesus" }
    "3" = @{ Nome = "UBS Primavera"; Codigo = "ubs-primavera" }
    "4" = @{ Nome = "UBS Jardim América"; Codigo = "ubs-jardim-america" }
    "5" = @{ Nome = "UBS Santa Cruz"; Codigo = "ubs-santa-cruz" }
    "6" = @{ Nome = "UBS Vila Esperança"; Codigo = "ubs-vila-esperanca" }
    "7" = @{ Nome = "UBS Coroados"; Codigo = "ubs-coroados" }
}

function Show-Header {
    Clear-Host
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║            🏥 TV UBS GUARAPUAVA - CONFIGURADOR 🏥          ║" -ForegroundColor Cyan
    Write-Host "║                 Instalacao Automatica v2.0                ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Get-ServerIP {
    if ($ServerIP -eq "") {
        Write-Host "📡 CONFIGURAÇÃO DO SERVIDOR" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
        Write-Host ""
        
        # Tentar detectar IP local
        $LocalIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"})[0].IPAddress
        
        if ($LocalIP) {
            Write-Host "🔍 IP local detectado: $LocalIP" -ForegroundColor Green
            $UseLocal = Read-Host "Usar este IP? (S/N) [S]"
            if ($UseLocal -eq "" -or $UseLocal -eq "S" -or $UseLocal -eq "s") {
                return $LocalIP
            }
        }
        
        Write-Host "💡 Exemplos de IP:"
        Write-Host "   • localhost (para testes)"
        Write-Host "   • 192.168.1.100 (rede local)"
        Write-Host "   • servidor.ubs.gov.br (domínio)"
        Write-Host ""
        
        do {
            $IP = Read-Host "Digite o IP/domínio do servidor"
            if ($IP -eq "") { $IP = "localhost" }
        } while ($IP -eq "")
        
        return $IP
    }
    return $ServerIP
}

function Get-PostoCode {
    if ($PostoCode -eq "") {
        Write-Host ""
        Write-Host "🏥 SELEÇÃO DO POSTO DE SAÚDE" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
        Write-Host ""
        
        foreach ($key in $PostosDisponiveis.Keys | Sort-Object) {
            $posto = $PostosDisponiveis[$key]
            Write-Host "[$key] $($posto.Nome)" -ForegroundColor White
        }
        Write-Host "[8] 📝 Código personalizado" -ForegroundColor White
        Write-Host ""
        
        do {
            $opcao = Read-Host "Escolha uma opção (1-8)"
        } while ($opcao -notin @("1","2","3","4","5","6","7","8"))
        
        if ($opcao -eq "8") {
            do {
                $codigo = Read-Host "Digite o código do posto (ex: ubs-novo-posto)"
            } while ($codigo -eq "")
            return $codigo
        } else {
            return $PostosDisponiveis[$opcao].Codigo
        }
    }
    return $PostoCode
}

function Test-ServerConnection {
    param([string]$IP, [string]$Posto)
    
    $URL = "http://${IP}:${PortaServidor}/tv-posto.html?posto=${Posto}"
    
    Write-Host "🔍 Testando conexão com servidor..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://${IP}:${PortaServidor}" -TimeoutSec 5 -UseBasicParsing
        Write-Host "✅ Servidor acessível!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "⚠️  Não foi possível conectar ao servidor" -ForegroundColor Red
        Write-Host "   Verifique se o servidor está rodando em ${IP}:${PortaServidor}" -ForegroundColor Red
        return $false
    }
}

function Create-TVShortcut {
    param([string]$URL, [string]$PostoCode)
    
    Write-Host "🖥️ Criando atalho na área de trabalho..." -ForegroundColor Yellow
    
    # Criar HTML de redirecionamento
    $HTMLContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>TV UBS - $PostoCode</title>
    <meta http-equiv="refresh" content="2;url=$URL">
    <style>
        body {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            text-align: center;
            padding: 50px;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .logo { font-size: 120px; margin-bottom: 30px; animation: pulse 2s infinite; }
        h1 { font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        h2 { color: #3498db; margin-bottom: 30px; font-size: 24px; }
        .loading { margin: 30px 0; font-size: 20px; }
        .countdown { font-size: 72px; color: #e74c3c; font-weight: bold; margin: 20px 0; }
        a { color: #3498db; text-decoration: none; font-size: 18px; padding: 10px 20px; border: 2px solid #3498db; border-radius: 5px; }
        a:hover { background: #3498db; color: white; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    </style>
    <script>
        let countdown = 2;
        setInterval(() => {
            if (countdown > 0) {
                document.getElementById('countdown').innerText = countdown;
                countdown--;
            }
        }, 1000);
    </script>
</head>
<body>
    <div class="logo">🏥</div>
    <h1>TV UBS Guarapuava</h1>
    <h2>Posto: $PostoCode</h2>
    <div class="loading">⏳ Iniciando em <span id="countdown" class="countdown">2</span> segundos...</div>
    <p><a href="$URL" onclick="window.location.href='$URL'">🚀 Clique aqui para iniciar agora</a></p>
</body>
</html>
"@

    # Salvar arquivo HTML
    $DesktopPath = [Environment]::GetFolderPath("Desktop")
    $HTMLFile = Join-Path $DesktopPath "TV-UBS-$PostoCode.html"
    $HTMLContent | Out-File -FilePath $HTMLFile -Encoding UTF8
    
    # Criar arquivo BAT para modo quiosque
    $BATContent = @"
@echo off
echo Iniciando TV UBS $PostoCode em modo quiosque...
start chrome --kiosk "$URL" --disable-web-security --disable-features=VizDisplayCompositor
if %errorlevel% neq 0 (
    echo Chrome nao encontrado, tentando Firefox...
    start firefox -private-window "$URL"
    if %errorlevel% neq 0 (
        echo Abrindo no navegador padrao...
        start "$URL"
    )
)
"@
    
    $BATFile = Join-Path $DesktopPath "TV-UBS-$PostoCode-KIOSK.bat"
    $BATContent | Out-File -FilePath $BATFile -Encoding ASCII
    
    Write-Host "✅ Arquivos criados na área de trabalho:" -ForegroundColor Green
    Write-Host "   📄 TV-UBS-$PostoCode.html (modo normal)" -ForegroundColor White
    Write-Host "   🖥️ TV-UBS-$PostoCode-KIOSK.bat (modo quiosque)" -ForegroundColor White
    
    return $HTMLFile, $BATFile
}

function Show-Instructions {
    param([string]$URL, [string]$PostoCode)
    
    Write-Host ""
    Write-Host "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 COMO USAR NA TV:" -ForegroundColor Yellow
    Write-Host "1. 🖱️  Clique duplo no atalho 'TV-UBS-$PostoCode' na área de trabalho" -ForegroundColor White
    Write-Host "2. 🌐 O navegador abrirá automaticamente" -ForegroundColor White
    Write-Host "3. 📺 Pressione F11 para tela cheia" -ForegroundColor White
    Write-Host "4. ✅ Deixe rodando - funciona 24h automático!" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 MODO QUIOSQUE (Recomendado para TV Box):" -ForegroundColor Yellow
    Write-Host "• Clique duplo em 'TV-UBS-$PostoCode-KIOSK.bat'" -ForegroundColor White
    Write-Host "• Abre em tela cheia, sem barras do navegador" -ForegroundColor White
    Write-Host "• Pressione Alt+F4 para sair" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 URL GERADA:" -ForegroundColor Yellow
    Write-Host "$URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📞 SUPORTE:" -ForegroundColor Yellow
    Write-Host "• Problemas de conexão: verifique IP e porta 3001" -ForegroundColor White
    Write-Host "• Sem vídeos: contate o administrador do sistema" -ForegroundColor White
    Write-Host "• TV travou: pressione F5 para recarregar" -ForegroundColor White
}

function Start-TVNow {
    param([string]$URL, [switch]$KioskMode)
    
    Write-Host "🚀 Iniciando TV UBS agora..." -ForegroundColor Green
    
    if ($KioskMode) {
        try {
            Start-Process "chrome" "--kiosk `"$URL`" --disable-web-security" -ErrorAction Stop
            Write-Host "✅ Chrome iniciado em modo quiosque" -ForegroundColor Green
        } catch {
            try {
                Start-Process "firefox" "-private-window `"$URL`"" -ErrorAction Stop
                Write-Host "✅ Firefox iniciado" -ForegroundColor Green
            } catch {
                Start-Process $URL
                Write-Host "✅ Navegador padrão iniciado" -ForegroundColor Green
            }
        }
    } else {
        Start-Process $URL
        Write-Host "✅ Navegador iniciado" -ForegroundColor Green
    }
}

# ===== EXECUÇÃO PRINCIPAL =====

Show-Header

# Se parâmetros foram fornecidos, usar modo automático
if ($ServerIP -ne "" -and $PostoCode -ne "") {
    $IP = $ServerIP
    $Posto = $PostoCode
    Write-Host "🤖 Modo automático detectado" -ForegroundColor Green
    Write-Host "📡 Servidor: $IP" -ForegroundColor White
    Write-Host "🏥 Posto: $Posto" -ForegroundColor White
} else {
    # Modo interativo
    $IP = Get-ServerIP
    $Posto = Get-PostoCode
}

$URL = "http://${IP}:${PortaServidor}/tv-posto.html?posto=${Posto}"

Write-Host ""
Write-Host "⚙️ CONFIGURAÇÃO FINAL:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "📡 Servidor: $IP" -ForegroundColor White
Write-Host "🏥 Posto: $Posto" -ForegroundColor White
Write-Host "🔗 URL: $URL" -ForegroundColor Cyan

# Testar conexão (opcional)
$TestarConexao = Read-Host "`n🔍 Testar conexão com servidor? (S/N) [N]"
if ($TestarConexao -eq "S" -or $TestarConexao -eq "s") {
    Test-ServerConnection -IP $IP -Posto $Posto
}

# Criar atalhos
$HTMLFile, $BATFile = Create-TVShortcut -URL $URL -PostoCode $Posto

# Mostrar instruções
Show-Instructions -URL $URL -PostoCode $Posto

# Perguntar se quer iniciar agora
if (-not $AutoStart) {
    $IniciarAgora = Read-Host "🚀 Iniciar TV agora? (S/N/K para modo quiosque) [N]"
    if ($IniciarAgora -eq "S" -or $IniciarAgora -eq "s") {
        Start-TVNow -URL $URL
    } elseif ($IniciarAgora -eq "K" -or $IniciarAgora -eq "k") {
        Start-TVNow -URL $URL -KioskMode
    }
} else {
    Start-TVNow -URL $URL -KioskMode:$Kiosk
}

Write-Host ""
Write-Host "✨ Configuração concluída! Pressione qualquer tecla para sair..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
