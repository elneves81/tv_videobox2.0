# 🎬 Como Assistir os Vídeos - TV UBS Guarapuava

## Para PACIENTES e VISITANTES nos Postos

### 📺 Onde assistir os vídeos:

#### 1. **Na TV da Sala de Espera** (Mais Comum)
- **O que é:** TV grande na parede da sala de espera
- **Como funciona:** Liga sozinha e fica passando vídeos automático
- **O que você vê:** Vídeos educativos sobre saúde passam sozinhos a cada 15 segundos
- **Precisa fazer algo?** NÃO! Só sentar e assistir

#### 2. **Pelo Celular com QR Code** (Mais Prático)
- **Como usar:**
  1. Veja se tem um QR Code colado na parede
  2. Abra a câmera do seu celular
  3. Aponte para o QR Code
  4. Toque no link que aparecer
  5. Assista os vídeos no seu celular!

#### 3. **No Computador/Tablet do Posto**
- **Para funcionários:** Podem abrir no computador para mostrar aos pacientes
- **URL:** `http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-DO-POSTO`

---

## 🎯 O que você vai ver:

### **Tela de Boas-vindas (3 segundos)**
```
🏥 UBS Guarapuava
TV Educativa - Vídeos de Saúde

⏳ Carregando vídeos educativos...
Aguarde enquanto buscamos os vídeos mais recentes
para este posto de saúde

3... 2... 1...
```

### **Reprodução dos Vídeos**
- ✅ **Automático:** Vídeos passam sozinhos, não precisa tocar em nada
- ✅ **Contínuo:** Depois do último vídeo, volta para o primeiro
- ✅ **Informativo:** Mostra qual vídeo está passando (ex: "Vídeo 2 de 5")
- ✅ **Identificado:** Mostra nome do posto e tipo de vídeo

### **Informações na Tela**
```
📍 UBS Centro Guarapuava          🚨 Emergência: SAMU 192
📹 Vídeo 1 de 3                      Bombeiros 193
🎬 "Prevenção da Dengue"
📝 Como evitar focos do mosquito
```

---

## 🏥 Por Posto de Saúde:

### **UBS Centro**
- **TV:** Sala de espera principal
- **QR Code:** Colado na parede próximo à TV
- **Vídeos:** Específicos para esta unidade

### **UBS Bom Jesus**
- **TV:** Recepção
- **QR Code:** Na mesa da recepção
- **Vídeos:** Adaptados para este bairro

### **UBS Primavera**
- **TV:** Corredor principal
- **QR Code:** Próximo ao bebedouro
- **Vídeos:** Focados na comunidade local

*(E assim por diante para todos os postos)*

---

## 📱 Como usar no celular:

### **Método 1: QR Code (Mais Fácil)**
1. **Encontre o QR Code** colado na parede do posto
2. **Abra a câmera** do seu celular
3. **Aponte para o QR Code** - não precisa tirar foto
4. **Toque no link** que aparecer na tela
5. **Assista!** Os vídeos vão começar automaticamente

### **Método 2: URL Direta**
1. Abra o navegador do celular (Chrome, Safari, etc.)
2. Digite: `http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-DO-POSTO`
3. Os vídeos começam automaticamente

---

## ❓ Dúvidas Frequentes:

### **"Não tem vídeo passando"**
- O sistema pode estar carregando - aguarde 30 segundos
- Se não carregar, chame um funcionário do posto

### **"O QR Code não funciona"**
- Certifique-se de que o WiFi do posto está funcionando
- Tente usar outro celular
- Chame um funcionário para ajudar

### **"Quero ver um vídeo específico"**
- O sistema passa todos os vídeos automaticamente
- Aguarde alguns minutos que o vídeo vai aparecer
- Não é possível escolher vídeos específicos

### **"Posso baixar os vídeos?"**
- Não, os vídeos ficam só no sistema do posto
- São sempre os mais atualizados
- Para informações específicas, converse com os profissionais de saúde

---

## 🔧 Para Funcionários dos Postos:

### **Como configurar a TV (MÉTODO FÁCIL):**

#### **🚀 Opção 1: Usar o Configurador Automático (.bat)**
1. Baixe o arquivo `instalar-tv-posto.bat`
2. Clique duplo no arquivo
3. Digite o IP do servidor (ex: 192.168.1.100)
4. Escolha o código do seu posto
5. O programa cria tudo automático!
6. Clique duplo no atalho criado na área de trabalho

#### **💻 Opção 2: Configurador com Interface Gráfica**
1. Execute `configurador-tv.py` ou `TV-UBS-Configurador.exe`
2. Digite IP do servidor
3. Selecione seu posto na lista
4. Clique "Instalar na TV"
5. Use o atalho criado!

#### **⚙️ Opção 3: PowerShell Avançado**
1. Clique direito no `configurador-tv.ps1`
2. "Executar com PowerShell"
3. Siga as instruções na tela
4. Escolha modo normal ou quiosque

#### **📱 Opção 4: Manual (Método Antigo)**
1. Ligue a TV e conecte um TV Box Android ou computador
2. Conecte na internet/WiFi do posto
3. Abra o navegador Chrome ou Firefox
4. Digite: `http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-DO-SEU-POSTO`
5. Coloque em tela cheia (F11)
6. Deixe rodando - funciona 24h automático!

### **QR Codes:**
1. Acesse: `http://SEU-SERVIDOR:3001/qr-codes.html`
2. Imprima o QR Code do seu posto
3. Cole na parede, próximo à TV
4. Pacientes podem escanear e assistir no celular

### **Problemas:**
- **Não carrega:** Verifique internet e servidor
- **Sem vídeos:** Entre em contato com o admin para enviar conteúdo
- **TV travou:** Recarregue a página (F5) ou reinicie o TV Box

---

## 📞 Contato e Suporte:

**Emergências Médicas:**
- SAMU: 192
- Bombeiros: 193
- Polícia: 190

**Suporte Técnico da TV:**
- Tente recarregar a página primeiro (F5)
- Se não resolver, chame o responsável de TI
- Para adicionar vídeos: acesse o painel administrativo

**Sistema UBS Guarapuava:**
- Desenvolvido para melhorar a educação em saúde
- Vídeos atualizados regularmente
- Funciona em Android TV Box, computadores e celulares

---

*🏥 Sistema TV UBS Guarapuava - Educação em Saúde*
*📺 Vídeos Educativos para Toda a Comunidade*
*💡 Simples, Automático e Acessível*
