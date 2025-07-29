# INSTRUÇÕES PARA RESETAR SENHA DO POSTGRESQL

## Método 1: Via pg_hba.conf (Mais Simples)

1. **Pare o serviço PostgreSQL:**
   ```
   net stop postgresql-x64-17
   ```

2. **Edite o arquivo pg_hba.conf:**
   - Abra: `C:\Program Files\PostgreSQL\17\data\pg_hba.conf`
   - Encontre a linha: `host all all 127.0.0.1/32 scram-sha-256`
   - Altere para: `host all all 127.0.0.1/32 trust`

3. **Reinicie o serviço:**
   ```
   net start postgresql-x64-17
   ```

4. **Conecte sem senha e altere:**
   ```
   psql -U postgres -h localhost
   ALTER USER postgres PASSWORD 'elber2025';
   \q
   ```

5. **Desfaça a alteração no pg_hba.conf** (volte para `scram-sha-256`)

6. **Reinicie novamente:** `net start postgresql-x64-17`

## Método 2: Usar SQLite temporariamente

Se for complexo, podemos usar SQLite por enquanto e PostgreSQL depois.
