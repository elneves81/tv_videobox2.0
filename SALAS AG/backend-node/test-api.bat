@echo off
echo ===================================
echo   Testando API - SALAS AG
echo ===================================

echo.
echo 1. Testando status da API...
curl -s http://localhost:8080/api/status
echo.
echo.

echo 2. Testando login do admin...
curl -s -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@salasag.com\",\"senha\":\"admin123\"}" > temp_login.json

echo.
echo Resposta do login:
type temp_login.json
echo.
echo.

echo 3. Extraindo token para testes...
for /f "tokens=2 delims=:" %%a in ('findstr /C:"token" temp_login.json') do (
    set "TOKEN_PART=%%a"
)

REM Remove aspas e vírgula do token
set TOKEN=%TOKEN_PART:"=%
set TOKEN=%TOKEN:,=%
set TOKEN=%TOKEN: =%

echo Token extraído: %TOKEN%
echo.

if "%TOKEN%"=="" (
    echo ❌ Falha no login! Verifique as credenciais.
    del temp_login.json
    pause
    exit /b 1
)

echo 4. Testando lista de usuários (com autenticação)...
curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/usuarios
echo.
echo.

echo 5. Testando lista de salas...
curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/salas
echo.
echo.

echo 6. Testando lista de agendamentos...
curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/agendamentos
echo.
echo.

del temp_login.json

echo ===================================
echo   Testes concluídos!
echo ===================================
pause
