# 🔥 Deploy no Firebase Hosting (Google)

## 📋 **Passos para produção:**

### 1. **Instalar Firebase CLI:**
```bash
npm install -g firebase-tools
```

### 2. **Login no Google:**
```bash
firebase login
```

### 3. **Inicializar projeto:**
```bash
firebase init hosting
```

### 4. **Configurar:**
- **What do you want to use as your public directory?** → `.` (diretório atual)
- **Configure as a single-page app?** → `N` (não)
- **Set up automatic builds?** → `N` (não)

### 5. **Deploy:**
```bash
firebase deploy
```

## 🌐 **Resultado:**
Seu sistema ficará em: `https://seu-projeto.web.app`

## ✅ **Vantagens Firebase:**
- ✅ **Gratuito** até 10GB/mês
- ✅ **HTTPS automático**
- ✅ **CDN global** (super rápido)
- ✅ **Domínio personalizado** (opcional)
- ✅ **100% confiável** (Google)

## 📱 **URLs finais:**
- `https://seu-projeto.web.app/tv-educativo.html`
- `https://seu-projeto.web.app/tv-posto.html`
- `https://seu-projeto.web.app/admin-panel/`
