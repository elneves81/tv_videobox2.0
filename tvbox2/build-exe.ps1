# Instruções para criar executável
# 1. Instalar Python e PyInstaller:
#    pip install pyinstaller tkinter

# 2. Criar executável:
#    pyinstaller --onefile --windowed --icon=tv-icon.ico configurador-tv.py

# 3. O executável será criado em dist/configurador-tv.exe

# Script para build automático
param(
    [switch]$Install = $false
)

if ($Install) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    pip install pyinstaller tkinter pillow
}

Write-Host "🔨 Criando executável..." -ForegroundColor Yellow

# Verificar se o Python está instalado
try {
    python --version
} catch {
    Write-Host "❌ Python não encontrado! Instale Python primeiro." -ForegroundColor Red
    exit 1
}

# Criar executável
pyinstaller --onefile --windowed --name "TV-UBS-Configurador" configurador-tv.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Executável criado com sucesso!" -ForegroundColor Green
    Write-Host "📂 Localização: dist/TV-UBS-Configurador.exe" -ForegroundColor Cyan
    
    # Copiar para área de trabalho
    $DesktopPath = [Environment]::GetFolderPath("Desktop")
    Copy-Item "dist/TV-UBS-Configurador.exe" "$DesktopPath/TV-UBS-Configurador.exe" -Force
    Write-Host "📋 Copiado para área de trabalho!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao criar executável!" -ForegroundColor Red
}
