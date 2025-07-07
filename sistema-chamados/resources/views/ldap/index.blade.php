@extends('layouts.app')

@section('title', 'Gerenciar LDAP/Active Directory')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h4 class="card-title mb-0">
                        <i class="fas fa-network-wired me-2"></i>
                        Integração LDAP/Active Directory
                    </h4>
                </div>
                <div class="card-body">
                    <!-- Status da Conexão -->
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="card border-info">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">Status da Conexão</h5>
                                </div>
                                <div class="card-body">
                                    <div id="connection-status" class="alert alert-secondary">
                                        <i class="fas fa-question-circle"></i> Status desconhecido
                                    </div>
                                    <button id="test-connection" class="btn btn-info">
                                        <i class="fas fa-plug"></i> Testar Conexão
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card border-success">
                                <div class="card-header bg-success text-white">
                                    <h5 class="mb-0">Sincronização</h5>
                                </div>
                                <div class="card-body">
                                    <div id="sync-status" class="alert alert-secondary">
                                        <i class="fas fa-info-circle"></i> Clique em sincronizar para importar usuários
                                    </div>
                                    <button id="sync-users" class="btn btn-success">
                                        <i class="fas fa-sync"></i> Sincronizar Usuários
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Buscar Usuário -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card border-warning">
                                <div class="card-header bg-warning text-dark">
                                    <h5 class="mb-0">Buscar Usuário no LDAP</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <input type="text" id="search-username" class="form-control" 
                                                   placeholder="Digite o nome de usuário (ex: joao.silva)">
                                        </div>
                                        <div class="col-md-4">
                                            <button id="search-user" class="btn btn-warning">
                                                <i class="fas fa-search"></i> Buscar
                                            </button>
                                        </div>
                                    </div>
                                    <div id="user-data" class="mt-3" style="display: none;">
                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <tbody id="user-data-table">
                                                    <!-- Dados do usuário serão inseridos aqui -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Testar Autenticação -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card border-danger">
                                <div class="card-header bg-danger text-white">
                                    <h5 class="mb-0">Testar Autenticação</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <input type="text" id="auth-username" class="form-control" 
                                                   placeholder="Nome de usuário">
                                        </div>
                                        <div class="col-md-4">
                                            <input type="password" id="auth-password" class="form-control" 
                                                   placeholder="Senha">
                                        </div>
                                        <div class="col-md-4">
                                            <button id="test-auth" class="btn btn-danger">
                                                <i class="fas fa-key"></i> Testar Login
                                            </button>
                                        </div>
                                    </div>
                                    <div id="auth-result" class="mt-3" style="display: none;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Configurações Atuais -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-secondary">
                                <div class="card-header bg-secondary text-white">
                                    <h5 class="mb-0">Configurações Atuais</h5>
                                </div>
                                <div class="card-body">
                                    <form id="ldap-config-form">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <h6>Conexão</h6>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>LDAP Habilitado:</strong></label>
                                                    <select name="LDAP_ENABLED" class="form-select">
                                                        <option value="true" {{ config('ldap_custom.enabled') ? 'selected' : '' }}>Sim</option>
                                                        <option value="false" {{ !config('ldap_custom.enabled') ? 'selected' : '' }}>Não</option>
                                                    </select>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>Servidor:</strong></label>
                                                    <input type="text" name="LDAP_HOSTS" class="form-control" value="{{ config('ldap_custom.connections.default.hosts.0') }}">
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>Porta:</strong></label>
                                                    <input type="number" name="LDAP_PORT" class="form-control" value="{{ config('ldap_custom.connections.default.port') }}">
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>Base DN:</strong></label>
                                                    <input type="text" name="LDAP_BASE_DN" class="form-control" value="{{ config('ldap_custom.connections.default.base_dn') }}">
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>Usuário:</strong></label>
                                                    <input type="text" name="LDAP_USERNAME" class="form-control" value="{{ config('ldap_custom.connections.default.username') }}">
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>Senha:</strong></label>
                                                    <input type="password" name="LDAP_PASSWORD" class="form-control" value="{{ config('ldap_custom.connections.default.password') }}">
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label"><strong>Usar TLS:</strong></label>
                                                    <select name="LDAP_USE_TLS" class="form-select">
                                                        <option value="true" {{ config('ldap_custom.connections.default.use_tls') ? 'selected' : '' }}>Sim</option>
                                                        <option value="false" {{ !config('ldap_custom.connections.default.use_tls') ? 'selected' : '' }}>Não</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <h6>Sincronização</h6>
                                                <ul class="list-unstyled">
                                                    <li><strong>Sincronização Habilitada:</strong> 
                                                        <span class="badge {{ config('ldap_custom.sync.enabled') ? 'bg-success' : 'bg-danger' }}">
                                                            {{ config('ldap_custom.sync.enabled') ? 'Sim' : 'Não' }}
                                                        </span>
                                                    </li>
                                                    <li><strong>Importação Automática:</strong> 
                                                        <span class="badge {{ config('ldap_custom.sync.auto_import') ? 'bg-success' : 'bg-secondary' }}">
                                                            {{ config('ldap_custom.sync.auto_import') ? 'Sim' : 'Não' }}
                                                        </span>
                                                    </li>
                                                    <li><strong>Atualização Automática:</strong> 
                                                        <span class="badge {{ config('ldap_custom.sync.auto_update') ? 'bg-success' : 'bg-secondary' }}">
                                                            {{ config('ldap_custom.sync.auto_update') ? 'Sim' : 'Não' }}
                                                        </span>
                                                    </li>
                                                    <li><strong>Papel Padrão:</strong> {{ config('ldap_custom.sync.default_role') }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="mt-3 d-flex gap-2">
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save"></i> Salvar Configurações
                                            </button>
                                            <button id="clear-cache" type="button" class="btn btn-outline-secondary">
                                                <i class="fas fa-trash"></i> Limpar Cache LDAP
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Loading Modal -->
<div class="modal fade" id="loadingModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2 mb-0">Processando...</p>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));

    // Testar Conexão
    document.getElementById('test-connection').addEventListener('click', function() {
        loadingModal.show();
        fetch('{{ route("ldap.test-connection") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            }
        })
        .then(response => response.json())
        .then(data => {
            loadingModal.hide();
            const statusDiv = document.getElementById('connection-status');
            if (data.success) {
                statusDiv.className = 'alert alert-success';
                statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;
                if (data.details) {
                    statusDiv.innerHTML += `<br><small>Servidor: ${data.details.server}:${data.details.port}</small>`;
                }
            } else {
                statusDiv.className = 'alert alert-danger';
                statusDiv.innerHTML = `<i class="fas fa-times-circle"></i> ${data.message}`;
                if (data.details) {
                    statusDiv.innerHTML += `<br><small>${data.details}</small>`;
                }
            }
        })
        .catch(error => {
            loadingModal.hide();
            console.error('Erro:', error);
            const statusDiv = document.getElementById('connection-status');
            statusDiv.className = 'alert alert-danger';
            statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> Erro ao testar conexão';
        });
    });

    // Salvar Configurações LDAP
    document.getElementById('ldap-config-form').addEventListener('submit', function(e) {
        e.preventDefault();
        loadingModal.show();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        fetch('{{ route('ldap.update-config') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            loadingModal.hide();
            if (data.success) {
                alert('Configurações salvas com sucesso! A página será recarregada.');
                window.location.reload();
            } else {
                alert(data.message || 'Erro ao salvar configurações.');
            }
        })
        .catch(error => {
            loadingModal.hide();
            alert('Erro ao salvar configurações.');
            console.error('Erro:', error);
        });
    });

    // Sincronizar Usuários
    document.getElementById('sync-users').addEventListener('click', function() {
        if (!confirm('Deseja sincronizar os usuários do LDAP? Esta operação pode demorar alguns minutos.')) {
            return;
        }
        loadingModal.show();
        fetch('{{ route("ldap.sync-users") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            }
        })
        .then(response => response.json())
        .then(data => {
            loadingModal.hide();
            const statusDiv = document.getElementById('sync-status');
            if (data.success) {
                statusDiv.className = 'alert alert-success';
                statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> Sincronização concluída!<br>
                    <small>Criados: ${data.created} | Atualizados: ${data.updated} | Erros: ${data.errors}</small>`;
            } else {
                statusDiv.className = 'alert alert-danger';
                statusDiv.innerHTML = `<i class="fas fa-times-circle"></i> Erro na sincronização`;
            }
        })
        .catch(error => {
            loadingModal.hide();
            console.error('Erro:', error);
        });
    });

    // Buscar Usuário
    document.getElementById('search-user').addEventListener('click', function() {
        const username = document.getElementById('search-username').value.trim();
        if (!username) {
            alert('Digite um nome de usuário');
            return;
        }
        loadingModal.show();
        fetch('{{ route("ldap.get-user-data") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ username: username })
        })
        .then(response => response.json())
        .then(data => {
            loadingModal.hide();
            const userDataDiv = document.getElementById('user-data');
            const tableBody = document.getElementById('user-data-table');
            if (data.success) {
                let html = '';
                for (const [key, value] of Object.entries(data.data)) {
                    if (value) {
                        html += `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`;
                    }
                }
                tableBody.innerHTML = html;
                userDataDiv.style.display = 'block';
            } else {
                userDataDiv.style.display = 'none';
                alert(data.message);
            }
        })
        .catch(error => {
            loadingModal.hide();
            console.error('Erro:', error);
        });
    });

    // Testar Autenticação
    document.getElementById('test-auth').addEventListener('click', function() {
        const username = document.getElementById('auth-username').value.trim();
        const password = document.getElementById('auth-password').value;
        if (!username || !password) {
            alert('Digite nome de usuário e senha');
            return;
        }
        loadingModal.show();
        fetch('{{ route("ldap.authenticate") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            loadingModal.hide();
            const resultDiv = document.getElementById('auth-result');
            if (data.success) {
                resultDiv.className = 'alert alert-success';
                resultDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;
            } else {
                resultDiv.className = 'alert alert-danger';
                resultDiv.innerHTML = `<i class="fas fa-times-circle"></i> ${data.message}`;
            }
            resultDiv.style.display = 'block';
            document.getElementById('auth-password').value = '';
        })
        .catch(error => {
            loadingModal.hide();
            console.error('Erro:', error);
        });
    });

    // Limpar Cache
    document.getElementById('clear-cache').addEventListener('click', function() {
        fetch('{{ route("ldap.clear-cache") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cache LDAP limpo com sucesso!');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});
</script>
@endsection
