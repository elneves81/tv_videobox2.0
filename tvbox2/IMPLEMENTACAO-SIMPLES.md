# 🏥 UBS Guarapuava - Sistema TV Automático

## Implementação Simples para Postos de Saúde

### 📋 O que foi criado:

1. **tv-educativo.html** - Página web completa e funcional (RECOMENDADA) ✅
2. **tv-standalone.html** - Versão com reprodução de vídeos
3. **tv-auto.html** - Versão com redirecionamento (pode dar tela branca)
4. **AutoPlayScreen** - Componente React Native para reprodução automática
5. **Sistema completo** - Admin panel + TV Box app integrados

### 🚀 Como usar nos postos de saúde

#### Opção 1: Página Web Educativa (RECOMENDADA ✅)

1. Abra o arquivo `tv-educativo.html` em qualquer navegador
2. A página automaticamente:
   - Mostra tela de boas-vindas da UBS Guarapuava (3 segundos)
   - Exibe conteúdo educativo sobre saúde
   - Troca automaticamente entre os temas
   - Funciona 100% offline, sem dependências externas

#### Opção 2: App React Native Completo

1. Compile o app TV Box
2. Configure no App.tsx para usar AutoPlayScreen
3. Deploy no dispositivo Android TV

### 🔧 Configuração Rápida:

#### Para a página web (tv-auto.html):
- **URL do TV Box**: `http://localhost:8083` (ajustar conforme necessário)
- **Tempo de redirecionamento**: 3 segundos
- **Detecção automática**: Reconhece TV Boxes automaticamente

#### Para funcionamento completo:
1. **Admin Panel**: `http://localhost:3001`
2. **TV Box App**: `http://localhost:8083`
3. **Página Auto**: Abrir `tv-auto.html` em qualquer navegador

### 📱 Fluxo para os postos:

```
Funcionário abre tv-auto.html
↓
Tela de boas-vindas (3 segundos)
↓
Redirecionamento automático
↓
Vídeos começam automaticamente
↓
Reprodução contínua sem interação
```

### 🎯 Características da solução:

✅ **Zero interação**: Vídeos começam automaticamente
✅ **Tela de boas-vindas**: Apresentação da UBS Guarapuava
✅ **Reprodução contínua**: Vídeos passam sozinhos
✅ **Informações de emergência**: SAMU 192, Bombeiros 193
✅ **Design para TV**: Otimizado para telas grandes
✅ **Detecção automática**: Reconhece dispositivos TV
✅ **Fallback**: Instruções se algo der errado

### 🔄 Estados da aplicação:

1. **Carregamento inicial** (tv-auto.html)
2. **Tela de boas-vindas** (3 segundos)
3. **Redirecionamento automático**
4. **Reprodução de vídeos** (AutoPlayScreen)
5. **Loop contínuo** (volta ao primeiro vídeo)

### 📞 Suporte técnico:

Em caso de problemas:
- Verificar se o servidor está rodando na porta 3001
- Verificar se o TV Box app está na porta 8083
- Ajustar URLs no arquivo tv-auto.html se necessário
- Contato de emergência sempre visível

### 🌐 Deploy na rede MPLS:

Para implementação na rede municipal:
1. Configurar servidor central na rede MPLS
2. Ajustar URLs para IP da rede interna
3. Distribuir tv-auto.html para todos os postos
4. Configurar sincronização automática de conteúdo

---

**Resultado**: Sistema completamente automático onde o funcionário do posto só precisa abrir uma página web e tudo funciona sozinho! 🎉
