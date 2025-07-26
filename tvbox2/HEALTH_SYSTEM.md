# 🏥 Sistema de Mídia para Postos de Saúde - Guarapuava

Este é um sistema completo para exibição de conteúdo audiovisual nas TVs das Unidades Básicas de Saúde (UBS) de Guarapuava.

## 📋 Características do Sistema

### 🎯 **Objetivo**
- Exibir vídeos educativos e informativos nas TVs dos postos de saúde
- Gestão centralizada de conteúdo
- Reprodução automática e contínua
- Integração com rede MPLS existente

### 🏗️ **Arquitetura**
```
[Painel Admin Web] ← → [Servidor Central] ← → [Apps TV nos Postos]
                              ↕
                        [Rede MPLS Guarapuava]
```

### 📺 **Funcionalidades para TVs dos Postos**
- **Reprodução automática** de playlist
- **Modo kiosk** (sem interação do usuário)
- **Atualizações automáticas** de conteúdo
- **Exibição contínua** sem interrupções
- **Interface minimalista** para ambiente hospitalar

### 💻 **Painel Administrativo**
- **Upload de vídeos** (.mp4, .avi, .mov)
- **Gestão de playlist** por unidade
- **Agendamento** de conteúdo
- **Monitoramento** de status das TVs
- **Relatórios** de reprodução

## 🎥 **Tipos de Conteúdo Sugeridos**

### 🏥 **Saúde Pública**
- Campanhas de vacinação
- Prevenção de doenças
- Cuidados básicos de saúde
- Orientações sobre medicamentos

### 📢 **Informativos**
- Horários de funcionamento
- Serviços disponíveis
- Procedimentos da unidade
- Informações da Secretaria de Saúde

### 🎭 **Entretenimento Educativo**
- Vídeos sobre alimentação saudável
- Exercícios físicos
- Saúde mental
- Cuidados com idosos e crianças

## 🔧 **Especificações Técnicas**

### 📱 **App para TV Box/Android TV**
- **React Native** + **Expo**
- **Modo offline** para conteúdo baixado
- **Sincronização automática** via MPLS
- **Interface otimizada** para visualização à distância
- **Controle remoto** desabilitado (modo kiosk)

### 🌐 **Painel Web Administrativo**
- **React** + **Node.js**
- **Upload de arquivos** com validação
- **Banco de dados** para gestão de conteúdo
- **API REST** para comunicação
- **Dashboard** com métricas

### 🔒 **Segurança e Rede**
- **Integração MPLS** existente
- **Autenticação** de administradores
- **Backup automático** de conteúdo
- **Logs** de atividade

## 📊 **Benefícios para os Postos**

- ✅ **Educação contínua** dos pacientes
- ✅ **Redução de ansiedade** na espera
- ✅ **Informação padronizada** em todas as unidades
- ✅ **Gestão centralizada** pela Secretaria de Saúde
- ✅ **Baixo custo** de manutenção
- ✅ **Fácil atualização** de conteúdo

## 🏗️ **Implementação Sugerida**

### **Fase 1: Piloto** (1-2 meses)
- Implementar em 2-3 postos de saúde
- Desenvolver painel básico
- Testar integração com rede MPLS

### **Fase 2: Expansão** (3-6 meses)
- Implementar em todas as UBS
- Adicionar funcionalidades avançadas
- Treinamento da equipe

### **Fase 3: Otimização** (6+ meses)
- Análise de métricas
- Melhorias baseadas no uso
- Integração com outros sistemas

## 🎯 **Próximos Passos**

1. **Adaptar interface** para ambiente hospitalar
2. **Criar painel administrativo** web
3. **Implementar sincronização** via MPLS
4. **Desenvolver modo kiosk**
5. **Testes em ambiente real**
