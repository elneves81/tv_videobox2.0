# 📺 TV Box App

Um aplicativo de entretenimento otimizado para TV Box/Android TV, desenvolvido com React Native e Expo.

## 🚀 Características

- **Interface otimizada para TV**: Design especial para controle remoto e navegação por D-pad
- **Player de vídeo nativo**: Reprodução fluida de vídeos com controles customizados
- **Layout responsivo**: Otimizado para telas grandes (1080p/4K)
- **Performance leve**: Bundle otimizado para dispositivos TV Box
- **Navegação intuitiva**: Fácil navegação com controle remoto

## 🛠️ Tecnologias

- **React Native** + **Expo**
- **TypeScript** para type safety
- **React Navigation** para navegação
- **Expo AV** para reprodução de mídia
- **Linear Gradient** para efeitos visuais

## 📱 Funcionalidades

### 🏠 Tela Principal
- Categorias de conteúdo (Filmes, Séries, Canais ao Vivo)
- Navegação horizontal por categorias
- Cards de mídia com preview
- Indicador visual de foco para controle remoto

### 🎬 Player de Vídeo
- Reprodução em tela cheia
- Controles customizados para TV
- Barra de progresso
- Navegação temporal (±10s)
- Informações do conteúdo

### 🎮 Controles
- **D-pad**: Navegação entre itens
- **OK/Enter**: Selecionar/Reproduzir
- **Voltar**: Retornar à tela anterior
- **Controles do Player**: Play/Pause, Avançar/Retroceder

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Expo CLI
- Android Studio (para emulação Android TV)

### Instalação
```bash
npm install
```

### Executar
```bash
# Web (para desenvolvimento)
npm run web

# Android (TV Box/Android TV)
npm run android
```

### Executar no Android TV
1. Conectar TV Box via ADB ou usar emulador Android TV
2. Executar: `npm run android`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── TVButton.tsx    # Botão otimizado para TV
├── screens/            # Telas da aplicação
│   ├── HomeScreen.tsx  # Tela principal
│   └── PlayerScreen.tsx # Player de vídeo
└── utils/              # Utilitários
    └── tvUtils.ts      # Funções para TV

.github/
└── copilot-instructions.md # Instruções para desenvolvimento
```

## 🎨 Design System

### Cores
- **Primary**: `#00d4ff` (Azul TV)
- **Background**: `#0f0f23` (Escuro)
- **Text**: `#ffffff` (Branco)
- **Focus**: `#00d4ff` (Destaque de foco)

### Tipografia
- Tamanhos escalados para visualização em TV
- Fontes Bold para melhor legibilidade
- Alto contraste para facilitar leitura

## 🔧 Configurações para TV Box

### Android TV Manifest
- Orientação forçada para landscape
- Permissões de internet e storage
- Categoria Android TV
- Suporte a controle remoto

### Performance
- Bundle otimizado
- Lazy loading de componentes
- Renderização eficiente de listas
- Imagens otimizadas

## 📺 Compatibilidade

- **Android TV** 7.0+
- **TV Box** com Android 7.0+
- **Resoluções**: 720p, 1080p, 4K
- **Controles**: D-pad, controle remoto padrão

## 🚀 Deploy

### APK para TV Box
```bash
# Build para produção
expo build:android --type apk

# Instalar no TV Box via ADB
adb install app.apk
```

### Google Play Store (Android TV)
```bash
# Build para publicação
expo build:android --type app-bundle
```

## 🔗 URLs de Teste

O app inclui URLs de vídeo de exemplo para demonstração:
- BigBuckBunny
- Elephants Dream
- Outros vídeos de teste do Google

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contato através do email do projeto

---

**Desenvolvido especialmente para TV Box - Entretenimento na sua TV! 📺🚀**
