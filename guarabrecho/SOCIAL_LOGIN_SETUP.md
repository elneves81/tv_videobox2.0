# 🔐 Configuração de Login Social - GuaraBrechó

## 📋 Instruções para Ativar Login com Google e Facebook

### 🟢 **Google OAuth Setup**

1. **Acesse o Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Faça login com sua conta Google

2. **Criar/Selecionar Projeto:**
   - Crie um novo projeto ou selecione um existente
   - Nome sugerido: "GuaraBrechó Auth"

3. **Ativar APIs:**
   - Vá para "APIs & Services" > "Library"
   - Busque e ative: "Google+ API" e "People API"

4. **Configurar OAuth Consent Screen:**
   - Vá para "APIs & Services" > "OAuth consent screen"
   - Tipo: External
   - Nome do app: "GuaraBrechó"
   - Email do usuário: seu-email@gmail.com
   - Domínios autorizados: `guarabrecho.vercel.app`

5. **Criar Credenciais:**
   - Vá para "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
   - Tipo: Web application
   - Nome: "GuaraBrechó Web Client"
   - Authorized redirect URIs:
     - `https://guarabrecho.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (para desenvolvimento)

6. **Copiar Credenciais:**
   - Copie o `Client ID` e `Client Secret`

### 🔵 **Facebook OAuth Setup**

1. **Acesse Facebook Developers:**
   - Vá para: https://developers.facebook.com/
   - Faça login com sua conta Facebook

2. **Criar App:**
   - Clique em "Meus Apps" > "Criar App"
   - Tipo: "Consumidor"
   - Nome: "GuaraBrechó"
   - Email de contato: seu-email@email.com

3. **Adicionar Facebook Login:**
   - No dashboard do app, clique em "Adicionar um produto"
   - Selecione "Facebook Login" > "Configurar"

4. **Configurar URLs:**
   - Vá para "Facebook Login" > "Configurações"
   - URIs de redirecionamento OAuth válidos:
     - `https://guarabrecho.vercel.app/api/auth/callback/facebook`
     - `http://localhost:3000/api/auth/callback/facebook`

5. **Obter Credenciais:**
   - Vá para "Configurações" > "Básico"
   - Copie "ID do App" e "Chave Secreta do App"

### ⚙️ **Configurar Variáveis de Ambiente**

Adicione no arquivo `.env.local` (desenvolvimento) e no Vercel (produção):

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=sua_google_client_secret_aqui

# Facebook OAuth  
FACEBOOK_CLIENT_ID=seu_facebook_app_id_aqui
FACEBOOK_CLIENT_SECRET=sua_facebook_app_secret_aqui

# NextAuth
NEXTAUTH_URL=https://guarabrecho.vercel.app
NEXTAUTH_SECRET=uma_string_secreta_longa_e_aleatoria
```

### 🚀 **Configurar no Vercel**

1. **Acesse o Dashboard do Vercel:**
   - Vá para: https://vercel.com/dashboard
   - Selecione o projeto "guarabrecho"

2. **Adicionar Environment Variables:**
   - Vá para "Settings" > "Environment Variables"
   - Adicione cada variável acima individualmente
   - Marque todas as ambientes: Production, Preview, Development

3. **Redeploy:**
   - Vá para "Deployments"
   - Clique nos três pontos do último deploy
   - Selecione "Redeploy"

### ✅ **Testar Login Social**

Após configurar tudo:

1. Acesse: https://guarabrecho.vercel.app/auth/signin
2. Clique em "Continuar com Google" ou "Continuar com Facebook"
3. Complete o processo de autorização
4. Você deve ser redirecionado para a homepage logado

### 🛠️ **Troubleshooting**

**Erro "Invalid Client":**
- Verifique se as URLs de callback estão corretas
- Confirme que as credenciais estão corretas no Vercel

**Erro "Access Denied":**
- Verifique se as APIs estão ativadas no Google Cloud
- Confirme que o OAuth Consent Screen está configurado

**Login não funciona localmente:**
- Adicione as URLs localhost nas configurações OAuth
- Verifique se as variáveis estão no `.env.local`

### 📱 **URLs de Callback Necessárias**

**Google:**
- `https://guarabrecho.vercel.app/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google`

**Facebook:**
- `https://guarabrecho.vercel.app/api/auth/callback/facebook`  
- `http://localhost:3000/api/auth/callback/facebook`

---

## 🎯 **Resultado Final**

Após a configuração, os usuários poderão:
- ✅ Fazer login/cadastro com Google em 1 clique
- ✅ Fazer login/cadastro com Facebook em 1 clique  
- ✅ Dados do perfil preenchidos automaticamente
- ✅ Experiência de usuário muito mais rápida e fácil

**Tempo estimado de configuração: 15-20 minutos**
