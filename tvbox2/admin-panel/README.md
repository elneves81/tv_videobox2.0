# Sistema de Gestão de Conteúdo Educativo - UBS Guarapuava

## Configuração e Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Navegar para o diretório do painel administrativo
cd admin-panel

# Instalar dependências
npm install

# Iniciar o servidor
npm start
```

O servidor estará disponível em: http://localhost:3001

## Funcionalidades

### 1. Painel Administrativo Web
- **Dashboard**: Estatísticas gerais, vídeos por categoria, sincronizações recentes
- **Upload de Vídeos**: Interface para envio de conteúdo educativo
- **Gerenciamento**: Listar, visualizar e excluir vídeos
- **Unidades**: Cadastro e gerenciamento das UBS

### 2. API para TV Box
- **Sincronização**: `/api/sync/videos/:unitId` - Lista vídeos para download
- **Download**: `/api/download/:filename` - Download de arquivos de vídeo
- **Filtragem**: Conteúdo direcionado por unidade e categoria

### 3. Categorias Disponíveis
- Vacinação
- Prevenção
- Diabetes
- Hipertensão
- Saúde Mental
- Nutrição
- Exercícios
- Medicamentos
- Emergência
- Geral

## Como Enviar Vídeos

### Via Interface Web
1. Acesse http://localhost:3001
2. Vá para a aba "Enviar Vídeos"
3. Preencha:
   - **Título**: Nome descritivo do vídeo
   - **Descrição**: Detalhes do conteúdo educativo
   - **Categoria**: Selecione a categoria apropriada
   - **Prioridade**: Normal, Alta ou Urgente
   - **Unidades Alvo**: Selecione UBS específicas ou "Todas"
   - **Arquivo**: Vídeo (MP4, AVI, MOV, WMV - máx. 500MB)
4. Clique em "Enviar Vídeo"

### Via API (para integrações)
```bash
curl -X POST http://localhost:3001/api/videos/upload \
  -F "video=@caminho/para/video.mp4" \
  -F "title=Título do Vídeo" \
  -F "description=Descrição do conteúdo" \
  -F "category=vacinacao" \
  -F "priority=2" \
  -F "targetUnits=all"
```

## Estrutura do Banco de Dados

### Tabela: videos
- `id`: Identificador único
- `title`: Título do vídeo
- `description`: Descrição
- `category`: Categoria
- `filename`: Nome do arquivo
- `size`: Tamanho em bytes
- `target_units`: Unidades alvo ("all" ou IDs específicos)
- `priority`: Prioridade (1=Normal, 2=Alta, 3=Urgente)
- `upload_date`: Data de upload
- `status`: Status (active/inactive)

### Tabela: units
- `id`: Identificador único da UBS
- `name`: Nome da unidade
- `address`: Endereço
- `phone`: Telefone
- `last_sync`: Última sincronização
- `status`: Status da unidade

### Tabela: sync_log
- `id`: Identificador do log
- `unit_id`: ID da unidade
- `video_id`: ID do vídeo (opcional)
- `action`: Ação realizada
- `status`: Status da operação
- `timestamp`: Data/hora

## Integração com TV Box

### 1. Sincronização Automática
O TV Box deve fazer requisições periódicas para:
```
GET /api/sync/videos/[ID_DA_UBS]
```

### 2. Download de Conteúdo
Para baixar vídeos:
```
GET /api/download/[NOME_DO_ARQUIVO]
```

### 3. Exemplo de Integração
```javascript
// No TV Box - sincronização
async function syncContent() {
  try {
    const response = await fetch(`${SERVER_URL}/api/sync/videos/${UBS_ID}`);
    const data = await response.json();
    
    for (const video of data.videos) {
      // Verificar se já existe localmente
      if (!hasVideoLocally(video.filename)) {
        await downloadVideo(video.filename);
      }
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Download de vídeo
async function downloadVideo(filename) {
  const response = await fetch(`${SERVER_URL}/api/download/${filename}`);
  const blob = await response.blob();
  // Salvar localmente...
}
```

## Configuração de Rede MPLS

### 1. Configuração do Servidor
Para usar na rede MPLS municipal, configure o servidor para aceitar conexões externas:

```javascript
// No server.js, adicionar:
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em todas as interfaces na porta ${PORT}`);
});
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env`:
```
PORT=3001
DB_PATH=./ubs_content.db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=524288000
ALLOWED_ORIGINS=*
```

### 3. Configuração no TV Box
```javascript
// Configurar URL do servidor central
const SERVER_URL = 'http://[IP_SERVIDOR_MUNICIPAL]:3001';
const UBS_ID = '[ID_UNICO_DA_UBS]';
```

## Segurança e Backup

### 1. Backup do Banco
```bash
# Backup automático diário
cp ubs_content.db backup/ubs_content_$(date +%Y%m%d).db
```

### 2. Backup de Vídeos
```bash
# Sincronizar pasta de uploads
rsync -av uploads/ backup/uploads/
```

### 3. Monitoramento
- Logs de sincronização disponíveis na tabela `sync_log`
- Estatísticas em tempo real no dashboard
- Alertas para falhas de sincronização

## Troubleshooting

### Problemas Comuns

1. **Erro de upload "Arquivo muito grande"**
   - Verificar se o arquivo é menor que 500MB
   - Aumentar limite no servidor se necessário

2. **TV Box não sincroniza**
   - Verificar conectividade de rede
   - Validar URL do servidor e ID da UBS
   - Verificar logs no servidor

3. **Vídeos não reproduzem**
   - Verificar formato (usar MP4 preferencialmente)
   - Validar codecs suportados no TV Box

### Logs do Servidor
```bash
# Ver logs em tempo real
npm start | tee server.log

# Filtrar erros
grep -i error server.log
```

## Desenvolvimento e Customização

### Adicionar Nova Categoria
1. Editar `server.js` - adicionar na validação
2. Editar `index.html` - adicionar no select
3. Editar `script.js` - adicionar no mapeamento

### Personalizar Interface
- Editar `styles.css` para mudanças visuais
- Editar `script.js` para nova funcionalidade
- Editar `index.html` para estrutura

### API Endpoints
- `POST /api/videos/upload` - Upload de vídeo
- `GET /api/videos` - Listar vídeos
- `DELETE /api/videos/:id` - Excluir vídeo
- `GET /api/sync/videos/:unitId` - Sincronização
- `GET /api/download/:filename` - Download
- `POST /api/units` - Cadastrar UBS
- `GET /api/units` - Listar UBS
- `GET /api/dashboard/stats` - Estatísticas
