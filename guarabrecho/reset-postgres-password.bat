@echo off
echo ========================================
echo RESETANDO SENHA DO POSTGRESQL
echo ========================================

echo.
echo 1. Parando o servico PostgreSQL...
net stop postgresql-x64-17

echo.
echo 2. Iniciando PostgreSQL em modo de recuperacao...
echo Aguarde alguns segundos...

echo.
echo 3. Para alterar a senha, execute estes comandos:
echo    ALTER USER postgres PASSWORD 'nova_senha_aqui';
echo.

echo 4. Iniciando PostgreSQL em modo single-user...
"C:\Program Files\PostgreSQL\17\bin\postgres.exe" --single -D "C:\Program Files\PostgreSQL\17\data" postgres

echo.
echo 5. Reiniciando servico normal...
net start postgresql-x64-17

echo.
echo Concluido! Agora use a nova senha.
pause
