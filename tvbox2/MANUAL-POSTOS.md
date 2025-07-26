# 📺 Manual TV UBS Guarapuava - Para Postos de Saúde

## Como assistir os vídeos no posto

### Para PACIENTES e VISITANTES:

#### Opção 1: TV Box dedicada (Recomendado)
1. Ligue a TV e o Android TV Box
2. Abra o navegador Chrome ou Firefox
3. Digite: `http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-DO-POSTO`
4. Deixe rodando automático - os vídeos vão tocar sozinjos!

**Exemplo de códigos dos postos:**
- Centro: `?posto=ubs-centro-guarapuava`
- Bom Jesus: `?posto=ubs-bom-jesus`
- Primavera: `?posto=ubs-primavera`

#### Opção 2: Computador ou Tablet
1. Abra qualquer navegador (Chrome, Edge, Firefox)
2. Acesse: `http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-DO-POSTO`
3. Coloque em tela cheia (F11)
4. Deixe rodando automático

#### Opção 3: QR Code (Mais fácil!)
**Para funcionários do posto:**
1. Acesse `http://SEU-SERVIDOR:3001/qr-codes.html` no admin
2. Imprima os QR codes do seu posto
3. Cole na parede da sala de espera
4. Pacientes podem escanear com o celular e assistir

---

## O que os pacientes vão ver:

### 1. Tela de Boas-vindas (3 segundos)
```
🏥 UBS Guarapuava
TV Educativa - Vídeos de Saúde
⏳ Carregando vídeos...
3... 2... 1...
```

### 2. Reprodução Automática
- ✅ Vídeos passam sozinhos a cada 15 segundos
- ✅ Depois do último vídeo, volta para o primeiro
- ✅ Funciona 24h sem precisar tocar em nada
- ✅ Mostra nome do posto e quantos vídeos tem

### 3. Informações na Tela
```
📍 Nome do Posto
📹 Vídeo 1 de 5
🎬 Título do vídeo atual
📝 Descrição do vídeo
```

---

## Para Funcionários do Posto:

### Como configurar pela primeira vez:

1. **Descubra o código do seu posto:**
   - Pergunte para o admin do sistema
   - Ou veja na lista: Centro, Bom Jesus, Primavera, etc.

2. **Configure a URL:**
   ```
   http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-DO-SEU-POSTO
   ```

3. **Teste se está funcionando:**
   - Deve aparecer a tela de boas-vindas
   - Depois deve carregar os vídeos do seu posto
   - Se der erro, chame o suporte técnico

### Problemas comuns:

❌ **"Não foi possível carregar os vídeos"**
- Verifique se o servidor está ligado
- Teste abrir `http://SEU-SERVIDOR:3001` primeiro
- Chame o suporte se não funcionar

❌ **"Nenhum vídeo disponível"**
- Significa que ainda não enviaram vídeos para seu posto
- Entre em contato com o admin para enviar vídeos
- A tela recarrega sozinha a cada 30 segundos

❌ **Vídeos não carregam**
- Verifique a conexão com internet
- Teste em outro navegador
- Reinicie o TV Box/computador

### Dicas importantes:

✅ **Deixe sempre rodando** - o sistema é feito para ficar ligado 24h
✅ **Não precisa tocar em nada** - tudo é automático
✅ **Para parar:** pressione ESC ou feche a aba
✅ **Para recomeçar:** recarregue a página (F5)

---

## Configuração Técnica (Para TI):

### Requisitos mínimos:
- TV com entrada HDMI
- Android TV Box OU computador OU tablet
- Conexão com internet/rede local
- Navegador Chrome/Firefox/Edge

### URLs importantes:
```bash
# Para assistir vídeos (pacientes)
http://SEU-SERVIDOR:3001/tv-posto.html?posto=CODIGO-POSTO

# Admin (funcionários)
http://SEU-SERVIDOR:3001/tv-monitor.html

# Testes
http://SEU-SERVIDOR:3001/test-apis.html
```

### Instalação em TV Box:
1. Conecte TV Box na TV via HDMI
2. Configure WiFi/Ethernet
3. Baixe Chrome ou Firefox da Play Store
4. Configure a URL como página inicial
5. Configure para ligar automaticamente

### Modo Quiosque (Opcional):
Para bloquear outras funções do TV Box:
1. Use um launcher dedicado (como "Kiosk Browser")
2. Configure apenas a URL do sistema
3. Desabilite botões home/menu
4. Configure reinicialização automática

---

## Contato e Suporte:

**Para problemas técnicos:**
- Primeiro: tente recarregar a página (F5)
- Se não resolver: chame o suporte de TI

**Para adicionar/remover vídeos:**
- Entre no painel admin: `tv-monitor.html`
- Ou entre em contato com o responsável pelo sistema

**Emergências:**
- SAMU: 192
- Bombeiros: 193
- (sempre mostrado na tela)

---

*Sistema TV UBS Guarapuava - Vídeos Educativos*
*Versão 1.0 - Desenvolvido para Android TV Box*
