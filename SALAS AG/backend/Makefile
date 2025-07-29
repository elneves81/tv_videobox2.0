# Makefile para Sistema de Agendamento de Salas (Backend C)

# Configurações do compilador
CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -D_GNU_SOURCE
LDFLAGS = -lmicrohttpd -lmysqlclient -ljson-c

# Diretórios
SRCDIR = src
INCDIR = include
BUILDDIR = build
BINDIR = bin

# Arquivos fonte
SOURCES = $(wildcard $(SRCDIR)/*.c)
OBJECTS = $(SOURCES:$(SRCDIR)/%.c=$(BUILDDIR)/%.o)
TARGET = $(BINDIR)/salas_ag_server

# Configurações de debug e release
DEBUG_FLAGS = -g -DDEBUG
RELEASE_FLAGS = -O2 -DNDEBUG

# Configuração padrão (debug)
CFLAGS += $(DEBUG_FLAGS)

.PHONY: all clean install deps test run help

# Target principal
all: $(TARGET)

# Compilação do executável
$(TARGET): $(OBJECTS) | $(BINDIR)
	$(CC) $(OBJECTS) -o $@ $(LDFLAGS)
	@echo "Build concluído: $(TARGET)"

# Compilação dos objetos
$(BUILDDIR)/%.o: $(SRCDIR)/%.c | $(BUILDDIR)
	$(CC) $(CFLAGS) -I$(INCDIR) -c $< -o $@

# Criação dos diretórios
$(BUILDDIR):
	mkdir -p $(BUILDDIR)

$(BINDIR):
	mkdir -p $(BINDIR)

# Target para release
release: CFLAGS = -Wall -Wextra -std=c99 -D_GNU_SOURCE $(RELEASE_FLAGS)
release: clean $(TARGET)
	@echo "Build release concluído"

# Instalação de dependências (Ubuntu/Debian)
deps:
	@echo "Instalando dependências..."
	sudo apt-get update
	sudo apt-get install -y build-essential
	sudo apt-get install -y libmicrohttpd-dev
	sudo apt-get install -y libmysqlclient-dev
	sudo apt-get install -y libjson-c-dev
	sudo apt-get install -y uuid-dev
	sudo apt-get install -y libbcrypt-dev
	@echo "Dependências instaladas!"

# Instalação de dependências (CentOS/RHEL/Fedora)
deps-rpm:
	@echo "Instalando dependências (RPM)..."
	sudo yum groupinstall -y "Development Tools"
	sudo yum install -y libmicrohttpd-devel
	sudo yum install -y mysql-devel
	sudo yum install -y json-c-devel
	sudo yum install -y libuuid-devel
	sudo yum install -y bcrypt-devel
	@echo "Dependências instaladas!"

# Instalação de dependências (macOS)
deps-mac:
	@echo "Instalando dependências (macOS)..."
	brew install libmicrohttpd
	brew install mysql-client
	brew install json-c
	brew install ossp-uuid
	brew install bcrypt
	@echo "Dependências instaladas!"

# Instalação de dependências (Windows - MSYS2)
deps-win:
	@echo "Instalando dependências (Windows/MSYS2)..."
	pacman -S --noconfirm mingw-w64-x86_64-gcc
	pacman -S --noconfirm mingw-w64-x86_64-libmicrohttpd
	pacman -S --noconfirm mingw-w64-x86_64-libmariadbclient
	pacman -S --noconfirm mingw-w64-x86_64-json-c
	@echo "Dependências instaladas!"

# Configuração do banco de dados
db-setup:
	@echo "Configurando banco de dados..."
	mysql -u root -p < ../database/schema.sql
	@echo "Banco de dados configurado!"

# Teste de compilação
test: $(TARGET)
	@echo "Executando testes básicos..."
	@echo "Build OK - Sem testes unitários implementados ainda"

# Execução do servidor
run: $(TARGET)
	@echo "Iniciando servidor SALAS AG..."
	./$(TARGET)

# Execução em modo daemon (background)
daemon: $(TARGET)
	@echo "Iniciando servidor em modo daemon..."
	nohup ./$(TARGET) > server.log 2>&1 &
	@echo "Servidor iniciado em background. Log: server.log"

# Parar servidor daemon
stop:
	@echo "Parando servidor..."
	pkill -f salas_ag_server
	@echo "Servidor parado."

# Verificação de dependências
check-deps:
	@echo "Verificando dependências..."
	@pkg-config --exists libmicrohttpd || echo "ERRO: libmicrohttpd não encontrada"
	@pkg-config --exists mysqlclient || echo "ERRO: mysqlclient não encontrada"
	@pkg-config --exists json-c || echo "ERRO: json-c não encontrada"
	@echo "Verificação concluída."

# Instalação do sistema
install: $(TARGET)
	@echo "Instalando sistema..."
	sudo cp $(TARGET) /usr/local/bin/
	sudo mkdir -p /etc/salas-ag
	sudo cp ../config/database.conf /etc/salas-ag/ 2>/dev/null || true
	sudo chmod +x /usr/local/bin/salas_ag_server
	@echo "Sistema instalado em /usr/local/bin/"

# Desinstalação
uninstall:
	@echo "Desinstalando sistema..."
	sudo rm -f /usr/local/bin/salas_ag_server
	sudo rm -rf /etc/salas-ag
	@echo "Sistema desinstalado."

# Limpeza dos arquivos compilados
clean:
	@echo "Limpando arquivos compilados..."
	rm -rf $(BUILDDIR)
	rm -rf $(BINDIR)
	rm -f server.log
	@echo "Limpeza concluída."

# Limpeza completa (incluindo configurações)
distclean: clean
	rm -f config.log
	rm -f *.core

# Documentação
docs:
	@echo "Gerando documentação..."
	doxygen Doxyfile 2>/dev/null || echo "Doxygen não instalado"

# Análise estática do código
analyze:
	@echo "Executando análise estática..."
	cppcheck --enable=all $(SRCDIR)/ 2>/dev/null || echo "cppcheck não instalado"
	splint $(SRCDIR)/*.c 2>/dev/null || echo "splint não instalado"

# Formatação do código
format:
	@echo "Formatando código..."
	find $(SRCDIR) -name "*.c" -exec clang-format -i {} \; 2>/dev/null || echo "clang-format não instalado"
	find $(INCDIR) -name "*.h" -exec clang-format -i {} \; 2>/dev/null || echo "clang-format não instalado"

# Informações de sistema
sysinfo:
	@echo "=== Informações do Sistema ==="
	@echo "Sistema Operacional: $(shell uname -s)"
	@echo "Arquitetura: $(shell uname -m)"
	@echo "Compilador: $(CC) $(shell $(CC) --version | head -n1)"
	@echo "Make: $(shell make --version | head -n1)"
	@echo "=========================="

# Backup do código
backup:
	@echo "Criando backup..."
	tar -czf backup_$(shell date +%Y%m%d_%H%M%S).tar.gz $(SRCDIR) $(INCDIR) Makefile
	@echo "Backup criado!"

# Help/Ajuda
help:
	@echo "=== Sistema de Agendamento de Salas - Backend C ==="
	@echo ""
	@echo "Targets disponíveis:"
	@echo "  all          - Compila o projeto (debug)"
	@echo "  release      - Compila versão otimizada"
	@echo "  clean        - Remove arquivos compilados"
	@echo "  run          - Executa o servidor"
	@echo "  daemon       - Executa em background"
	@echo "  stop         - Para o servidor daemon"
	@echo ""
	@echo "Dependências:"
	@echo "  deps         - Instala deps (Ubuntu/Debian)"
	@echo "  deps-rpm     - Instala deps (CentOS/RHEL/Fedora)"
	@echo "  deps-mac     - Instala deps (macOS)"
	@echo "  deps-win     - Instala deps (Windows/MSYS2)"
	@echo "  check-deps   - Verifica dependências"
	@echo ""
	@echo "Banco de dados:"
	@echo "  db-setup     - Configura banco MySQL"
	@echo ""
	@echo "Sistema:"
	@echo "  install      - Instala sistema"
	@echo "  uninstall    - Remove sistema"
	@echo "  test         - Executa testes"
	@echo ""
	@echo "Desenvolvimento:"
	@echo "  analyze      - Análise estática"
	@echo "  format       - Formata código"
	@echo "  docs         - Gera documentação"
	@echo "  backup       - Backup do código"
	@echo "  sysinfo      - Info do sistema"
	@echo ""
	@echo "Exemplo de uso:"
	@echo "  make deps && make db-setup && make run"
	@echo "============================================="
