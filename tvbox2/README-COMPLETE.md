# 📺 TV Box UBS Guarapuava - Sistema Completo

## 🏥 Visão Geral

Sistema completo para distribuição de conteúdo educativo nas Unidades Básicas de Saúde (UBS) de Guarapuava através da rede MPLS municipal. Inclui aplicativo TV Box para reprodução automática e painel administrativo web para gestão de conteúdo.

## 🎯 Objetivo

Centralizar e automatizar a distribuição de vídeos educativos sobre saúde pública nas UBS de Guarapuava, permitindo que cada unidade reproduza automaticamente conteúdo relevante para a população atendida.

## 🏗️ Arquitetura do Sistema

```
Servidor Central (MPLS) ←→ Painel Web Admin ←→ TV Boxes (UBS)
         ↓                        ↓                  ↓
   Banco de Dados          Upload/Gestão      Reprodução
   Armazenamento          de Conteúdo         Automática
```

## 📁 Estrutura do Projeto

```
tvbox2/
├── 📱 TV Box App (React Native + Expo)
│   ├── App.tsx                    # App principal
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Tela inicial com categorias
│   │   ├── KioskModeScreen.tsx    # Modo automático para UBS
│   │   ├── PlayerScreen.tsx       # Player de vídeo
│   │   └── SettingsScreen.tsx     # Configurações
│   └── utils/
│       └── ContentSync.js         # Sincronização com servidor
│
└── 🌐 Admin Panel (Node.js + Express)
    ├── server-simple.js           # Servidor principal
    ├── public/                    # Interface web
    │   ├── index.html            # Dashboard admin
    │   ├── styles.css            # Estilos
    │   └── script.js             # JavaScript frontend
    └── data/                     # Dados em JSON
        ├── videos.json           # Lista de vídeos
        ├── units.json            # UBS cadastradas
        └── sync_log.json         # Log de sincronizações
```

## 🚀 Como Funciona

### 1. TV Box (React Native)
- **App de reprodução** para TVs nas UBS
- **Modo Kiosk** com reprodução automática
- **Sincronização automática** via MPLS
- **Interface touch** para navegação manual

### 2. Painel Administrativo (Web)
- **Dashboard** com estatísticas
- **Upload de vídeos** educativos
- **Gerenciamento** de UBS
- **API** para sincronização

### 3. Sincronização MPLS
- **Download automático** de conteúdo
- **Filtragem por UBS** específica  
- **Cache local** nos TV Boxes
- **Logs de sincronização**

## 📋 Como Enviar Vídeos

### Via Painel Web (Recomendado)
1. Acesse: **http://[IP_SERVIDOR]:3001**
2. Vá para aba **"Enviar Vídeos"**
3. Preencha as informações:
   - **Título**: Nome descritivo
   - **Categoria**: Vacinação, Prevenção, Diabetes, etc.
   - **Prioridade**: Normal, Alta ou Urgente
   - **Unidades**: Específicas ou todas as UBS
   - **Arquivo**: Vídeo (MP4, AVI, MOV - máx. 500MB)
4. Clique **"Enviar Vídeo"**

### Categorias Disponíveis
- 💉 **Vacinação** - Calendário vacinal, campanhas
- 🛡️ **Prevenção** - Dengue, COVID-19, gripe
- 🩺 **Diabetes** - Cuidados, alimentação, medicação
- ❤️ **Hipertensão** - Controle da pressão arterial
- 🧠 **Saúde Mental** - Bem-estar, depressão, ansiedade
- 🥗 **Nutrição** - Alimentação saudável
- 🏃 **Exercícios** - Atividade física, alongamento
- 💊 **Medicamentos** - Uso correto, efeitos colaterais
- 🚨 **Emergência** - Primeiros socorros, SAMU
- 📋 **Geral** - Informações gerais de saúde

## ⚙️ Configuração e Instalação

### TV Box (React Native)
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Gerar APK para produção
npx expo build:android
```

### Servidor Administrativo
```bash
# Navegar para pasta admin
cd admin-panel

# Instalar dependências
npm install

# Iniciar servidor
npm start
```

## 🔧 Configuração da Rede MPLS

### 1. Servidor Central
```javascript
// Configurar IP fixo na rede municipal
const SERVER_CONFIG = {
  baseUrl: 'http://192.168.1.100:3001', // IP na rede MPLS
  port: 3001
};
```

### 2. TV Box - Configuração
```javascript
// No arquivo ContentSync.js
const SERVER_CONFIG = {
  baseUrl: 'http://192.168.1.100:3001', // IP do servidor
  ubsId: 'ubs-centro-guarapuava',       // ID único da UBS
  syncInterval: 30 * 60 * 1000          // Sync a cada 30min
};
```

### 3. Cadastro das UBS
No painel admin, cadastre cada unidade:
- **UBS Centro** → ID: `ubs-centro-guarapuava`
- **UBS Bonsucesso** → ID: `ubs-bonsucesso-guarapuava`
- **UBS Primavera** → ID: `ubs-primavera-guarapuava`
- E assim por diante...

## 📊 Funcionalidades do Painel

### Dashboard
- 📈 **Estatísticas gerais** (total de vídeos, UBS ativas)
- 📊 **Vídeos por categoria** (gráfico)
- 🔄 **Sincronizações recentes** (log das UBS)

### Gestão de Vídeos
- ⬆️ **Upload** com informações detalhadas
- 📝 **Listagem** com filtros por categoria
- 🗑️ **Exclusão** de conteúdo desatualizado
- 🎯 **Direcionamento** para UBS específicas

### Controle de UBS
- ➕ **Cadastro** de novas unidades
- 📋 **Lista** com status de sincronização
- 📞 **Informações** de contato

## 🔄 API de Sincronização

### Endpoints Principais
```
GET  /api/sync/videos/:ubsId    # Lista vídeos para sync
GET  /api/download/:filename    # Download de arquivo
POST /api/videos/upload         # Upload de vídeo
GET  /api/units                 # Lista UBS
GET  /api/dashboard/stats       # Estatísticas
```

### Exemplo de Resposta - Sync
```json
{
  "videos": [
    {
      "id": "video-123",
      "title": "Prevenção da Dengue",
      "category": "prevencao",
      "filename": "dengue-prevencao.mp4",
      "priority": 2
    }
  ],
  "sync_time": "2025-01-26T12:00:00Z",
  "total": 1
}
```

## 📱 Uso do TV Box

### Modo Manual
1. **Tela inicial** com categorias de saúde
2. **Seleção** da categoria desejada
3. **Escolha** do vídeo específico
4. **Reprodução** com controles

### Modo Automático (Kiosk)
1. **Ativação** automática nas UBS
2. **Playlist** contínua de vídeos educativos
3. **Rodízio** automático de conteúdo
4. **Priorização** por categoria/urgência

### Tela de Configurações
- 🔄 **Status da sincronização** MPLS
- 📊 **Estatísticas** de armazenamento local
- ⚙️ **Configurações** de rede
- 🏥 **Informações** da UBS

## 🔐 Segurança e Backup

### Backup Automático
```bash
# Backup diário dos dados
cp data/videos.json backup/videos_$(date +%Y%m%d).json
tar -czf backup/uploads_$(date +%Y%m%d).tar.gz uploads/
```

### Logs de Auditoria
- 📝 **Uploads** registrados com usuário e timestamp
- 🔄 **Sincronizações** logadas por UBS
- ❌ **Erros** salvos para troubleshooting

## 🛠️ Troubleshooting

### Problemas Comuns

**TV Box não sincroniza:**
```bash
# Verificar conectividade
ping 192.168.1.100

# Verificar API
curl http://192.168.1.100:3001/api/sync/videos/ubs-test
```

**Vídeos não reproduzem:**
- Verificar formato (MP4 recomendado)
- Confirmar download completo
- Validar espaço em disco

**Upload falha:**
- Verificar tamanho do arquivo (max 500MB)
- Confirmar formato suportado
- Checar conexão de rede

### Monitoramento
```bash
# Ver logs do servidor
tail -f server.log

# Monitorar sincronizações
curl http://localhost:3001/api/dashboard/stats
```

## 📞 Suporte Técnico

### Contatos de Emergência
- **SAMU**: 192
- **Bombeiros**: 193
- **Suporte TI Municipal**: (42) 3623-xxxx

### Informações Técnicas
- **Servidor**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Mobile**: React Native + Expo
- **Banco**: JSON (produção: migrar para PostgreSQL)
- **Rede**: MPLS Municipal Guarapuava

## 🚀 Roadmap Futuro

### Versão 2.0
- [ ] 🗄️ **Banco PostgreSQL** para produção
- [ ] 👥 **Sistema de usuários** com permissões
- [ ] 📊 **Analytics** de visualização por UBS
- [ ] 🔔 **Notificações** push para atualizações
- [ ] 📱 **App mobile** para gestores de UBS
- [ ] 🎨 **Temas** personalizáveis por unidade

### Integrações
- [ ] 🏥 **Sistema e-SUS** municipal
- [ ] 📧 **Email** para relatórios automáticos
- [ ] 💬 **WhatsApp** para alertas
- [ ] 📺 **Streaming** ao vivo para campanhas

---

## 🎉 Status Atual

✅ **TV Box App**: Funcional com modo kiosk e sincronização  
✅ **Painel Admin**: Interface web completa para gestão  
✅ **API**: Endpoints para sync e upload implementados  
🔄 **Sincronização**: Sistema funcional com logs  
📋 **Documentação**: Completa para implantação  

**Sistema pronto para deploy na rede MPLS de Guarapuva!** 🏥📺✨
