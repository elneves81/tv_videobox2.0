@echo off
set PGPASSWORD=elber@2025
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE guarabrecho;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE USER guarabrecho_user WITH PASSWORD 'guarabrecho_pass';"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -c "GRANT ALL PRIVILEGES ON DATABASE guarabrecho TO guarabrecho_user;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -d guarabrecho -c "GRANT ALL ON SCHEMA public TO guarabrecho_user;"
echo Banco e usuario criados com sucesso!
pause
