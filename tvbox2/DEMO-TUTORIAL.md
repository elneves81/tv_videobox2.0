# 🎬 DEMONSTRAÇÃO COMPLETA - TV Box UBS Guarapuava

## 🚀 Como Usar o Sistema - Tutorial Passo a Passo

### 📋 **PARTE 1: Acesso ao Painel Administrativo**

#### 1.1 Abrindo o Painel
1. **Abra seu navegador** (Chrome, Firefox, Edge)
2. **Digite na barra de endereço**: `http://localhost:3001`
3. **Pressione Enter**

Você verá uma tela azul e branca com o logo da UBS Guarapuva e 4 abas principais:
- 📊 **Dashboard** - Estatísticas e visão geral
- ☁️ **Enviar Vídeos** - Upload de conteúdo
- 🎥 **Gerenciar Vídeos** - Lista e exclusão
- 🏥 **Unidades UBS** - Cadastro das unidades

---

### 📊 **PARTE 2: Explorando o Dashboard**

#### 2.1 Tela Principal (Dashboard)
- **Total de Vídeos**: Mostra quantos vídeos estão cadastrados
- **Total de UBS**: Quantas unidades estão cadastradas
- **Vídeos por Categoria**: Gráfico mostrando distribuição
- **Últimas Sincronizações**: Log das UBS que fizeram download

**🎯 Objetivo**: Monitorar o sistema em tempo real

---

### 🏥 **PARTE 3: Cadastrando uma UBS**

#### 3.1 Ir para Aba "Unidades UBS"
1. **Clique na aba** "Unidades UBS"
2. **Preencha o formulário**:
   - **Nome da UBS**: "UBS Centro Guarapuava"
   - **Endereço**: "Rua XV de Novembro 123"
   - **Telefone**: "(42) 3623-1234"
3. **Clique em "Adicionar"**

#### 3.2 Resultado
- A UBS aparecerá na lista abaixo
- Status de sincronização: "Nunca" (ainda não sincronizou)

---

### 📤 **PARTE 4: Enviando um Vídeo (PRINCIPAL)**

#### 4.1 Ir para Aba "Enviar Vídeos"
1. **Clique na aba** "Enviar Vídeos"
2. **Preencha as informações**:

**Exemplo 1 - Vídeo sobre Vacinação:**
```
Título: Importância da Vacinação Infantil
Descrição: Vídeo educativo sobre a importância de manter o calendário vacinal das crianças em dia
Categoria: Vacinação
Prioridade: Alta
Unidades Alvo: Todas as Unidades (deixar selecionado)
```

#### 4.2 Selecionando o Arquivo
1. **Na área "Arquivo de Vídeo"**:
   - Clique na área pontilhada OU
   - Arraste um arquivo de vídeo para a área
2. **Formatos aceitos**: MP4, AVI, MOV, WMV
3. **Tamanho máximo**: 500MB

#### 4.3 Enviando
1. **Clique em "Enviar Vídeo"**
2. **Aguarde a barra de progresso** completar
3. **Mensagem de sucesso** aparecerá no canto superior direito

---

### 🎥 **PARTE 5: Gerenciando Vídeos**

#### 5.1 Ver Vídeos Cadastrados
1. **Clique na aba** "Gerenciar Vídeos"
2. **Use o filtro** para ver por categoria
3. **Cada vídeo mostra**:
   - Título e descrição
   - Categoria e prioridade
   - Tamanho do arquivo
   - Data de upload
   - Botão para excluir

#### 5.2 Excluindo um Vídeo
1. **Clique no botão vermelho** "Excluir"
2. **Confirme a exclusão** no popup
3. **O vídeo será removido** do servidor

---

### 📱 **PARTE 6: Usando o TV Box**

#### 6.1 Acessando o App do TV Box
1. **Abra outro navegador ou aba**
2. **Digite**: `http://localhost:8083`
3. **Aguarde carregar** o app React Native

#### 6.2 Navegação no TV Box
**Tela Inicial (HomeScreen):**
- Logo da UBS Guarapuava
- Categorias de saúde (Vacinação, Prevenção, etc.)
- Botão "Configurações" no canto

**Modo Manual:**
1. **Clique em uma categoria** (ex: Vacinação)
2. **Escolha um vídeo** da lista
3. **O player abrirá** automaticamente

**Modo Automático (Kiosk):**
1. **Clique em "Configurações"**
2. **Ative o "Modo Automático"**
3. **O sistema reproduz** vídeos continuamente

---

### 🔄 **PARTE 7: Sincronização MPLS**

#### 7.1 Como Funciona
1. **TV Box faz requisição** a cada 30 minutos
2. **Servidor envia lista** de vídeos disponíveis
3. **TV Box baixa** vídeos novos automaticamente
4. **Log é registrado** no painel admin

#### 7.2 Testando a API
**No navegador, digite:**
```
http://localhost:3001/api/sync/videos
```

**Resultado:** JSON com lista de vídeos disponíveis para download

---

## 🎯 **DEMONSTRAÇÃO PRÁTICA - Cenário Real**

### 📅 **Cenário: Campanha de Vacinação Contra Gripe**

#### Passo 1: Administrador da Secretaria de Saúde
```
1. Acessa http://localhost:3001
2. Vai para "Enviar Vídeos"
3. Preenche:
   - Título: "Campanha Vacinação Gripe 2025"
   - Categoria: Vacinação
   - Prioridade: Urgente
   - Unidades: Todas as UBS
4. Faz upload do vídeo
5. Clica "Enviar Vídeo"
```

#### Passo 2: Sistema Distribui Automaticamente
```
- Vídeo fica disponível na API
- Todas as UBS sincronizam automaticamente
- Em 30 minutos, todos os TV Boxes terão o vídeo
```

#### Passo 3: UBS Reproduz o Conteúdo
```
- TV Box na sala de espera reproduz automaticamente
- Pacientes assistem enquanto aguardam
- Informação chega a centenas de pessoas por dia
```

---

## 🎮 **TESTE RÁPIDO - 5 Minutos**

### ✅ **Checklist para Testar Agora:**

1. **[ ] Abrir Painel Admin** → `http://localhost:3001`
2. **[ ] Cadastrar uma UBS** → Aba "Unidades UBS"
3. **[ ] Fazer upload de um vídeo** → Aba "Enviar Vídeos"
4. **[ ] Ver no Dashboard** → Estatísticas atualizadas
5. **[ ] Abrir TV Box** → `http://localhost:8083`
6. **[ ] Testar reprodução** → Escolher categoria/vídeo
7. **[ ] Verificar API** → `http://localhost:3001/api/sync/videos`

---

## 🚨 **Solução de Problemas Rápidos**

### ❌ **Problema: Painel não abre**
```bash
# Verificar se servidor está rodando
curl http://localhost:3001
```
**Solução:** Reiniciar servidor na pasta admin-panel

### ❌ **Problema: Upload falha**
- Verificar se arquivo é menor que 500MB
- Usar formato MP4 preferencialmente
- Verificar se há espaço em disco

### ❌ **Problema: TV Box não conecta**
- Verificar se ambos serviços estão rodando
- Verificar ports 3001 e 8083

---

## 🎊 **Recursos Avançados**

### 🎯 **Direcionamento por UBS**
- Enviar vídeos específicos para UBS específicas
- Ex: "UBS Centro" → vídeos de zona urbana
- Ex: "UBS Rural" → vídeos de zona rural

### ⚡ **Prioridades**
- **Urgente**: Campanhas de emergência
- **Alta**: Informações importantes
- **Normal**: Conteúdo educativo geral

### 📊 **Analytics**
- Dashboard mostra estatísticas em tempo real
- Log de sincronizações por UBS
- Controle de espaço utilizado

---

## 🏆 **Vantagens do Sistema**

✅ **Centralizado**: Um local para enviar para todas as UBS  
✅ **Automático**: Distribuição sem intervenção manual  
✅ **Inteligente**: Priorização e filtragem de conteúdo  
✅ **Econômico**: Usa rede MPLS existente  
✅ **Escalável**: Fácil adicionar novas UBS  
✅ **Auditável**: Logs de todas as operações  

**Sistema completo e profissional para a Secretaria de Saúde de Guarapuava!** 🏥✨
