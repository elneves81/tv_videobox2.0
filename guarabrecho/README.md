# GuaraBrechó — O Brechó Digital da Nossa Cidade

![GuaraBrechó](https://img.shields.io/badge/GuaraBrechó-Marketplace_Local-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue)

## 🌟 O que é?

O **GuaraBrechó** é um marketplace digital focado em Guarapuava para compra, venda, troca e doação de produtos usados. Nossa missão é conectar a comunidade local de forma sustentável, promovendo a economia circular e fortalecendo os laços comunitários.

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Cadastro e login de usuários
- [x] Perfil de usuário
- [ ] Recuperação de senha

### 📦 Gestão de Produtos
- [x] Cadastro de produtos com fotos
- [x] Descrição detalhada e categorização
- [x] Definição de bairro e tipo de transação
- [x] Três modalidades: Venda, Troca e Doação
- [ ] Upload de múltiplas imagens
- [ ] Edição de anúncios

### 🔍 Busca e Filtros
- [ ] Busca por texto
- [ ] Filtros por bairro
- [ ] Filtros por categoria
- [ ] Filtros por tipo de transação
- [ ] Ordenação por preço e data

### 📱 Contato e Comunicação
- [x] Integração com WhatsApp
- [x] Página de detalhes do produto
- [ ] Sistema de mensagens interno
- [ ] Avaliações e comentários

### 👤 Dashboard do Usuário
- [ ] Gestão de anúncios pessoais
- [ ] Histórico de transações
- [ ] Favoritos
- [ ] Estatísticas pessoais

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Heroicons** - Ícones
- **Lucide React** - Ícones adicionais

### Backend (Planejado)
- **Next.js API Routes** - Endpoints da API
- **NextAuth.js** - Autenticação
- **Prisma ORM** - Mapeamento objeto-relacional
- **PostgreSQL** - Banco de dados

### Hospedagem
- **Frontend**: Vercel
- **Backend**: Railway
- **Domínio**: guarabrecho.com.br

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+ 
- npm, yarn ou pnpm

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/guarabrecho.git
   cd guarabrecho
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
guarabrecho/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicial
│   │   ├── produtos/          # Listagem de produtos
│   │   ├── anunciar/          # Criar anúncios
│   │   └── produto/[id]/      # Detalhes do produto
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes de UI base
│   │   ├── Header.tsx        # Cabeçalho
│   │   ├── Footer.tsx        # Rodapé
│   │   └── ProductCard.tsx   # Card de produto
│   ├── lib/                  # Utilitários e configurações
│   ├── types/                # Definições TypeScript
│   └── styles/               # Estilos adicionais
├── public/                   # Arquivos estáticos
├── .github/                  # Configurações do GitHub
└── docs/                     # Documentação
```

## 🎨 Design System

### Cores Principais
- **Verde Principal**: `#059669` (green-600)
- **Verde Secundário**: `#047857` (green-700)
- **Azul**: `#2563eb` (blue-600)
- **Roxo**: `#7c3aed` (purple-600)

### Categorias de Produtos
- 👕 Roupas & Acessórios
- 📱 Eletrônicos
- 🪑 Móveis & Decoração
- 📚 Livros & Revistas
- ⚽ Esportes & Lazer
- 🏡 Casa & Jardim
- 🧸 Brinquedos & Jogos
- 📦 Outros

### Bairros de Guarapuava
- Centro, Trianon, Batel, Santana, Primavera
- Carli, Boqueirão, Paz, Morro Alto, Campo Belo
- Industrial, Xarquinho, Jardim América, São Cristóvão
- Virmond, Vila Carli, Parque das Américas, Santa Cruz

## 🤝 Como contribuir

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
3. **Commit suas mudanças**
4. **Push para a branch**
5. **Abra um Pull Request**

## 📞 Contato e Suporte

- **Email**: contato@guarabrecho.com.br
- **WhatsApp**: [(42) 99999-9999](https://wa.me/5542999999999)
- **Instagram**: [@guarabrecho](https://instagram.com/guarabrecho)
- **Facebook**: [GuaraBrechó](https://facebook.com/guarabrecho)

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para a comunidade de Guarapuava**

*Juntos, construímos uma cidade mais sustentável e conectada!*
