@echo off
echo ====================================
echo GuaraBrechó - Gerenciador de Banco
echo ====================================
echo.

:MENU
echo Escolha uma opção:
echo 1. Iniciar banco de dados (Docker)
echo 2. Parar banco de dados
echo 3. Ver logs do banco
echo 4. Aplicar migrações do Prisma
echo 5. Executar seed (popular categorias)
echo 6. Abrir Prisma Studio
echo 7. Abrir PgAdmin (interface web)
echo 8. Sair
echo.
set /p choice=Digite sua escolha (1-8): 

if "%choice%"=="1" goto START_DB
if "%choice%"=="2" goto STOP_DB
if "%choice%"=="3" goto LOGS_DB
if "%choice%"=="4" goto MIGRATE_DB
if "%choice%"=="5" goto SEED_DB
if "%choice%"=="6" goto STUDIO_DB
if "%choice%"=="7" goto PGADMIN
if "%choice%"=="8" goto EXIT
goto MENU

:START_DB
echo Iniciando banco de dados PostgreSQL...
docker-compose up -d postgres
echo Banco de dados iniciado!
echo Aguardando 5 segundos para o banco ficar pronto...
timeout /t 5 /nobreak >nul
goto MENU

:STOP_DB
echo Parando banco de dados...
docker-compose down
echo Banco de dados parado!
goto MENU

:LOGS_DB
echo Mostrando logs do banco...
docker-compose logs -f postgres
goto MENU

:MIGRATE_DB
echo Aplicando migrações do Prisma...
npx prisma db push
echo Migrações aplicadas!
goto MENU

:SEED_DB
echo Executando seed (populando categorias)...
npm run db:seed
echo Seed executado!
goto MENU

:STUDIO_DB
echo Abrindo Prisma Studio...
echo Acesse: http://localhost:5555
start npx prisma studio
goto MENU

:PGADMIN
echo Iniciando PgAdmin...
docker-compose up -d pgadmin
echo PgAdmin disponível em: http://localhost:5050
echo Email: admin@guarabrecho.com
echo Senha: admin123
start http://localhost:5050
goto MENU

:EXIT
echo Saindo...
exit
