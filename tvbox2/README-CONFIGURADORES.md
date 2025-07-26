# 🚀 Configuradores Automáticos - TV UBS Guarapuava

## 📋 Visão Geral

Criamos **4 formas diferentes** de facilitar a instalação da TV nos postos, desde a mais simples até a mais avançada:

### **🎯 Para quem quer MÁXIMA FACILIDADE:**
- `instalar-tv-posto.bat` - **Clica e funciona!**

### **🎯 Para quem quer INTERFACE GRÁFICA:**
- `configurador-tv.py` - **Aplicativo com janelas**
- `TV-UBS-Configurador.exe` - **Executável standalone**

### **🎯 Para quem quer CONTROLE TOTAL:**
- `configurador-tv.ps1` - **PowerShell avançado**

---

## 🚀 Método 1: Instalador BAT (Mais Simples)

### **📁 Arquivo:** `instalar-tv-posto.bat`

### **Como usar:**
1. **Clique duplo** no arquivo `.bat`
2. **Digite o IP** do servidor (ex: 192.168.1.100)
3. **Escolha o posto** da lista numerada
4. **Pronto!** Atalho criado na área de trabalho

### **O que faz:**
- ✅ Cria arquivo HTML de redirecionamento
- ✅ Cria atalho na área de trabalho  
- ✅ Testa a conexão automaticamente
- ✅ Abre direto no navegador se quiser

### **Exemplo de uso:**
```
📡 Digite o IP do servidor: 192.168.1.100
🏥 Escolha o posto: 1 (UBS Centro)
✅ Atalho "TV UBS ubs-centro-guarapuava" criado!
```

---

## 💻 Método 2: Interface Gráfica Python

### **📁 Arquivo:** `configurador-tv.py`

### **Pré-requisitos:**
```bash
# Instalar Python 3.x
pip install tkinter
```

### **Como usar:**
1. **Execute:** `python configurador-tv.py`
2. **Interface gráfica** abre automaticamente
3. **Preencha os campos:** Servidor e Posto
4. **Clique "Instalar na TV"**
5. **Teste com "Testar no Navegador"**

### **Recursos avançados:**
- 🖥️ **Preview da URL** em tempo real
- 🧪 **Teste no navegador** antes de instalar
- 📺 **Modo quiosque** direto
- 💾 **Salva configurações** para próxima vez
- 📱 **Lista de postos** predefinida

---

## ⚙️ Método 3: PowerShell Avançado

### **📁 Arquivo:** `configurador-tv.ps1`

### **Como executar:**
```powershell
# Método 1: Clique direito > "Executar com PowerShell"

# Método 2: Linha de comando
PowerShell -ExecutionPolicy Bypass -File configurador-tv.ps1

# Método 3: Com parâmetros (automático)
PowerShell -ExecutionPolicy Bypass -File configurador-tv.ps1 -ServerIP "192.168.1.100" -PostoCode "ubs-centro-guarapuava" -AutoStart -Kiosk
```

### **Recursos únicos:**
- 🔍 **Detecta IP local** automaticamente
- 🌐 **Testa conexão** com servidor
- 🖥️ **Modo quiosque** integrado (Chrome/Firefox)
- 📊 **Modo não-interativo** (com parâmetros)
- 💾 **Cria 2 arquivos:** normal + quiosque

---

## 🔧 Método 4: Executável Standalone

### **📁 Arquivo:** `TV-UBS-Configurador.exe`

### **Como criar o executável:**
```bash
# 1. Instalar PyInstaller
pip install pyinstaller tkinter

# 2. Executar o build automático
PowerShell -ExecutionPolicy Bypass -File build-exe.ps1 -Install

# 3. Executável será criado em dist/TV-UBS-Configurador.exe
```

### **Vantagens:**
- ✅ **Não precisa instalar Python**
- ✅ **Funciona em qualquer Windows**
- ✅ **Interface gráfica completa**
- ✅ **Um só arquivo .exe**

---

## 📂 Arquivos Criados na Área de Trabalho

Todos os métodos criam os seguintes arquivos:

### **🌐 TV-UBS-[POSTO].html**
- Página de redirecionamento automático
- Carrega em 2 segundos
- Visual bonito com countdown
- Fallback manual se não redirecionar

### **🖥️ TV-UBS-[POSTO]-KIOSK.bat** (PowerShell)
- Abre direto em modo quiosque
- Tenta Chrome primeiro, depois Firefox
- Sem barras do navegador
- Ideal para TV Box

---

## 🎯 Guia de Escolha

### **👴 Para usuários básicos:**
```
USE: instalar-tv-posto.bat
POR QUE: Clica e funciona, sem complicação
```

### **👨‍💼 Para técnicos/administradores:**
```
USE: configurador-tv.py ou .exe
POR QUE: Interface completa, testes, preview
```

### **👨‍💻 Para profissionais de TI:**
```
USE: configurador-tv.ps1
POR QUE: Controle total, automação, modo quiosque
```

### **🏢 Para instalação em massa:**
```
USE: PowerShell com parâmetros
EXEMPLO: 
ForEach ($posto in $listaPostos) {
    .\configurador-tv.ps1 -ServerIP "192.168.1.100" -PostoCode $posto -AutoStart
}
```

---

## 🔗 URLs Geradas

Todos os métodos geram URLs no formato:
```
http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-POSTO
```

### **Exemplos práticos:**
```
# UBS Centro
http://192.168.1.100:3001/tv-posto.html?posto=ubs-centro-guarapuava

# UBS Bom Jesus  
http://192.168.1.100:3001/tv-posto.html?posto=ubs-bom-jesus

# Posto personalizado
http://192.168.1.100:3001/tv-posto.html?posto=meu-posto-customizado
```

---

## ❓ Solução de Problemas

### **"Arquivo .bat não executa"**
- Clique direito > "Executar como administrador"
- Ou altere as configurações de segurança do Windows

### **"PowerShell não executa"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **"Python não encontrado"**
- Baixe Python 3.x de python.org
- Marque "Add to PATH" na instalação

### **"Erro ao criar executável"**
```bash
pip install --upgrade pyinstaller
pip install --upgrade tkinter
```

### **"TV não carrega"**
- Verifique se o servidor está rodando
- Teste a URL manualmente no navegador
- Confirme o IP e código do posto

---

## 📞 Suporte Técnico

### **Para problemas com configuradores:**
1. Verifique se o servidor está rodando na porta 3001
2. Teste a URL manualmente: `http://SEU-IP:3001`
3. Confirme o código do posto no arquivo `units.json`
4. Use o `test-apis.html` para diagnóstico

### **Para instalação em TV Box:**
1. Use o modo quiosque (arquivo .bat ou PowerShell)
2. Configure para iniciar automaticamente na inicialização
3. Desabilite atualizações automáticas do navegador
4. Configure IP fixo na rede

---

*🏥 Sistema TV UBS Guarapuava - Configuradores Automáticos*
*🚀 4 formas diferentes, 1 objetivo: Facilitar sua vida!*
