# Sistema de Chamados

Este é um sistema completo para gestão de chamados, com integração LDAP/Active Directory, painel TV, dashboard moderno, autenticação, e recursos avançados para equipes de suporte.

## Funcionalidades
- Login moderno e responsivo
- Dashboard com métricas, gráficos, ranking, timeline, exportação e dark mode
- Painel TV para exibição de chamados abertos, com tela cheia, som e animações
- Importação de usuários via LDAP/AD, evitando duplicidade
- Rotas protegidas e públicas para API
- Documentação interna em `DOCUMENTACAO.md`

## Instalação
1. Clone o repositório:
   ```sh
   git clone https://github.com/elneves81/sistema-de-chamados.git
   cd sistema-de-chamados
   ```
2. Instale as dependências PHP:
   ```sh
   composer install
   ```
3. Instale as dependências JS:
   ```sh
   npm install
   ```
4. Configure o `.env` com dados do banco e LDAP/AD.
5. Execute as migrations:
   ```sh
   php artisan migrate
   ```
6. Inicie o servidor:
   ```sh
   php artisan serve
   ```

## LDAP/AD
- Configure os dados de conexão no menu lateral (apenas admin).
- Importe usuários facilmente pelo painel.

## Painel TV
- Exibe apenas chamados abertos.
- Botão para tela cheia.
- Som e animação para chamados recém-chegados.

## Dashboard
- Cards, gráficos, exportação, dark mode e visual profissional.

## Contribuição
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro.

## Licença
 ELN

---

Para mais detalhes, consulte o arquivo `DOCUMENTACAO.md`.
