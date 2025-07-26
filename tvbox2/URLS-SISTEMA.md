# 🔗 URLs do Sistema TV UBS Guarapuava

## 👨‍⚕️ Para ADMINISTRADORES:

### **Painel Principal de Administração**
```
http://localhost:3001/tv-monitor.html
```
- Monitorar status das TVs
- Enviar vídeos para postos específicos  
- Ver histórico de envios
- Gerenciar conteúdo

### **Gerar QR Codes dos Postos**
```
http://localhost:3001/qr-codes.html
```
- Gerar QR codes para imprimir
- Baixar códigos QR individuais
- Ver URLs de cada posto

### **Testes e Diagnósticos**
```
http://localhost:3001/test-apis.html
```
- Testar conexão com servidor
- Verificar APIs funcionando
- Diagnosticar problemas

---

## 🏥 Para FUNCIONÁRIOS DOS POSTOS:

### **TV da Sala de Espera - UBS Centro**
```
http://localhost:3001/tv-posto.html?posto=ubs-centro-guarapuava
```

### **TV da Sala de Espera - UBS Bom Jesus**
```
http://localhost:3001/tv-posto.html?posto=ubs-bom-jesus
```

### **TV da Sala de Espera - UBS Primavera**
```
http://localhost:3001/tv-posto.html?posto=ubs-primavera
```

### **Formato Geral para Qualquer Posto**
```
http://localhost:3001/tv-posto.html?posto=CODIGO-DO-POSTO
```

---

## 📱 Para PACIENTES E VISITANTES:

### **Mesmas URLs dos Funcionários**
- Use os QR Codes colados na parede
- Ou digite as URLs acima no celular
- Funciona em qualquer navegador

---

## 🔧 URLs Técnicas (Para TI):

### **API Status das TVs**
```
http://localhost:3001/api/tv-status
```

### **API Listar Unidades**
```
http://localhost:3001/api/units
```

### **API Sincronização de Vídeos**
```
http://localhost:3001/api/sync/videos?unit_id=CODIGO-POSTO
```

### **Servidor Principal**
```
http://localhost:3001
```

---

## 📋 Como Usar Cada URL:

### **Para Administradores:**
1. **tv-monitor.html** - Use diariamente para gerenciar o sistema
2. **qr-codes.html** - Use para imprimir códigos QR novos
3. **test-apis.html** - Use quando algo não estiver funcionando

### **Para Funcionários dos Postos:**
1. Abra a URL do seu posto no TV Box/computador
2. Coloque em tela cheia (F11)
3. Deixe rodando 24h
4. Imprima o QR Code para os pacientes

### **Para Pacientes:**
1. Escaneie o QR Code com o celular
2. Ou digite a URL do posto no navegador
3. Assista os vídeos automaticamente

---

## 🌐 Substituir "localhost" por IP Real:

Quando instalar em servidor real, substitua `localhost` pelo IP/domínio:

```
http://SEU-SERVIDOR:3001/tv-posto.html?posto=ubs-centro-guarapuava
```

Exemplo com IP:
```
http://192.168.1.100:3001/tv-posto.html?posto=ubs-centro-guarapuava
```

---

## 📞 Configurações Importantes:

### **Porta do Servidor:** 3001
### **Códigos dos Postos:**
- `ubs-centro-guarapuava`
- `ubs-bom-jesus`  
- `ubs-primavera`
- *(Adicione outros conforme necessário)*

### **Navegadores Suportados:**
- ✅ Chrome (Recomendado)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (iOS)

### **Dispositivos Suportados:**
- ✅ Android TV Box
- ✅ Computadores/Laptops
- ✅ Tablets
- ✅ Smartphones
- ✅ Smart TVs com navegador

---

*🏥 Sistema TV UBS Guarapuava - Guia de URLs*
*📺 Todas as páginas em um só lugar*
