// Variáveis globais
let currentTab = 'dashboard';
let videos = [];
let units = [];
let stats = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboard();
});

// Inicializar aplicação
function initializeApp() {
    // Configurar tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Configurar formulários
    setupForms();
    
    // Carregar dados iniciais
    loadUnits();
}

// Configurar event listeners
function setupEventListeners() {
    // Upload de arquivo
    const fileInput = document.getElementById('videoFile');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#1e3c72';
        fileUploadArea.style.background = 'rgba(42, 82, 152, 0.1)';
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#2a5298';
        fileUploadArea.style.background = 'rgba(42, 82, 152, 0.02)';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#2a5298';
        fileUploadArea.style.background = 'rgba(42, 82, 152, 0.02)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: fileInput });
        }
    });

    // Filtro de categoria
    document.getElementById('filterCategory').addEventListener('change', loadVideos);
}

// Configurar formulários
function setupForms() {
    // Formulário de upload
    document.getElementById('uploadForm').addEventListener('submit', handleVideoUpload);
    
    // Formulário de unidade
    document.getElementById('unitForm').addEventListener('submit', handleUnitSubmit);
}

// Alternar tabs
function switchTab(tabName) {
    // Atualizar botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
    
    // Carregar dados específicos da tab
    switch(tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'videos':
            loadVideos();
            break;
        case 'units':
            loadUnits();
            break;
        case 'upload':
            populateTargetUnits();
            break;
    }
}

// ===== DASHBOARD =====

async function loadDashboard() {
    try {
        const response = await fetch('/api/dashboard/stats');
        stats = await response.json();
        
        updateDashboardStats();
        updateCategoryChart();
        updateSyncList();
        updateHeaderStats();
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification('Erro ao carregar estatísticas', 'error');
    }
}

function updateDashboardStats() {
    document.getElementById('dashTotalVideos').textContent = stats.totalVideos || 0;
    document.getElementById('dashTotalUnits').textContent = stats.totalUnits || 0;
}

function updateHeaderStats() {
    document.getElementById('totalVideos').textContent = stats.totalVideos || 0;
    document.getElementById('totalUnits').textContent = stats.totalUnits || 0;
}

function updateCategoryChart() {
    const chartContainer = document.getElementById('categoryChart');
    const categories = stats.videosByCategory || [];
    
    if (categories.length === 0) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #666;">Nenhum vídeo cadastrado</p>';
        return;
    }
    
    const categoryNames = {
        'vacinacao': 'Vacinação',
        'prevencao': 'Prevenção',
        'diabetes': 'Diabetes',
        'hipertensao': 'Hipertensão',
        'saude-mental': 'Saúde Mental',
        'nutricao': 'Nutrição',
        'exercicios': 'Exercícios',
        'medicamentos': 'Medicamentos',
        'emergencia': 'Emergência',
        'geral': 'Geral'
    };
    
    chartContainer.innerHTML = categories.map(cat => `
        <div class="category-item">
            <span>${categoryNames[cat.category] || cat.category}</span>
            <strong>${cat.count}</strong>
        </div>
    `).join('');
}

function updateSyncList() {
    const syncContainer = document.getElementById('syncList');
    const syncs = stats.recentSyncs || [];
    
    if (syncs.length === 0) {
        syncContainer.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma sincronização recente</p>';
        return;
    }
    
    syncContainer.innerHTML = syncs.map(sync => `
        <div class="sync-item">
            <span>${sync.name}</span>
            <span class="sync-time">${formatDateTime(sync.timestamp)}</span>
        </div>
    `).join('');
}

// ===== UPLOAD =====

function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('fileInfo');
    
    if (!file) {
        fileInfo.style.display = 'none';
        return;
    }
    
    // Verificar tipo de arquivo
    if (!file.type.startsWith('video/')) {
        showNotification('Por favor, selecione um arquivo de vídeo válido', 'error');
        event.target.value = '';
        return;
    }
    
    // Verificar tamanho (500MB)
    if (file.size > 500 * 1024 * 1024) {
        showNotification('Arquivo muito grande. Máximo 500MB permitido', 'error');
        event.target.value = '';
        return;
    }
    
    // Mostrar informações do arquivo
    fileInfo.innerHTML = `
        <strong>Arquivo selecionado:</strong><br>
        <strong>Nome:</strong> ${file.name}<br>
        <strong>Tamanho:</strong> ${formatFileSize(file.size)}<br>
        <strong>Tipo:</strong> ${file.type}
    `;
    fileInfo.style.display = 'block';
}

async function handleVideoUpload(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const uploadBtn = document.getElementById('uploadBtn');
    const progress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Verificar se há arquivo
    if (!formData.get('video') || formData.get('video').size === 0) {
        showNotification('Por favor, selecione um arquivo de vídeo', 'error');
        return;
    }
    
    try {
        // Mostrar progresso
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<div class="loading"></div> Enviando...';
        progress.style.display = 'block';
        
        // Upload com progresso
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                progressFill.style.width = percent + '%';
                progressText.textContent = `Enviando... ${Math.round(percent)}%`;
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                showNotification('Vídeo enviado com sucesso!', 'success');
                resetForm();
                loadDashboard(); // Atualizar estatísticas
            } else {
                const error = JSON.parse(xhr.responseText);
                showNotification(error.error || 'Erro ao enviar vídeo', 'error');
            }
            
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Enviar Vídeo';
            progress.style.display = 'none';
        });
        
        xhr.addEventListener('error', () => {
            showNotification('Erro de conexão durante o upload', 'error');
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Enviar Vídeo';
            progress.style.display = 'none';
        });
        
        xhr.open('POST', '/api/videos/upload');
        xhr.send(formData);
        
    } catch (error) {
        console.error('Erro no upload:', error);
        showNotification('Erro durante o upload', 'error');
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Enviar Vídeo';
        progress.style.display = 'none';
    }
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'none';
}

async function populateTargetUnits() {
    try {
        const response = await fetch('/api/units');
        units = await response.json();
        
        const select = document.getElementById('targetUnits');
        
        // Limpar opções existentes (exceto "Todas")
        const allOption = select.querySelector('option[value="all"]');
        select.innerHTML = '';
        select.appendChild(allOption);
        
        // Adicionar unidades
        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit.id;
            option.textContent = unit.name;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erro ao carregar unidades:', error);
    }
}

// ===== VÍDEOS =====

async function loadVideos() {
    try {
        const category = document.getElementById('filterCategory').value;
        const url = category ? `/api/videos?category=${category}` : '/api/videos';
        
        const response = await fetch(url);
        videos = await response.json();
        
        displayVideos();
        
    } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        showNotification('Erro ao carregar vídeos', 'error');
    }
}

function displayVideos() {
    const container = document.getElementById('videosGrid');
    
    if (videos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">Nenhum vídeo encontrado</p>';
        return;
    }
    
    const categoryNames = {
        'vacinacao': 'Vacinação',
        'prevencao': 'Prevenção',
        'diabetes': 'Diabetes',
        'hipertensao': 'Hipertensão',
        'saude-mental': 'Saúde Mental',
        'nutricao': 'Nutrição',
        'exercicios': 'Exercícios',
        'medicamentos': 'Medicamentos',
        'emergencia': 'Emergência',
        'geral': 'Geral'
    };
    
    const priorityNames = {
        1: 'Normal',
        2: 'Alta',
        3: 'Urgente'
    };
    
    container.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">
                <span class="video-tag">${categoryNames[video.category] || video.category}</span>
                <span class="video-tag">Prioridade: ${priorityNames[video.priority] || 'Normal'}</span>
                <span class="video-tag">${formatFileSize(video.size)}</span>
            </div>
            <div class="video-description">${video.description || 'Sem descrição'}</div>
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 15px;">
                Enviado em: ${formatDateTime(video.upload_date)}
            </div>
            <div class="video-actions">
                <button class="btn-danger" onclick="deleteVideo('${video.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function deleteVideo(videoId) {
    if (!confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/videos/${videoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Vídeo excluído com sucesso', 'success');
            loadVideos();
            loadDashboard(); // Atualizar estatísticas
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao excluir vídeo', 'error');
        }
        
    } catch (error) {
        console.error('Erro ao excluir vídeo:', error);
        showNotification('Erro de conexão', 'error');
    }
}

// ===== UNIDADES =====

async function loadUnits() {
    try {
        const response = await fetch('/api/units');
        units = await response.json();
        
        displayUnits();
        
    } catch (error) {
        console.error('Erro ao carregar unidades:', error);
        showNotification('Erro ao carregar unidades', 'error');
    }
}

function displayUnits() {
    const container = document.getElementById('unitsList');
    
    if (units.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma unidade cadastrada</p>';
        return;
    }
    
    container.innerHTML = units.map(unit => `
        <div class="unit-card">
            <div class="unit-name">${unit.name}</div>
            <div class="unit-info"><i class="fas fa-map-marker-alt"></i> ${unit.address || 'Endereço não informado'}</div>
            <div class="unit-info"><i class="fas fa-phone"></i> ${unit.phone || 'Telefone não informado'}</div>
            <div class="unit-info"><i class="fas fa-clock"></i> Última sincronização: ${unit.last_sync ? formatDateTime(unit.last_sync) : 'Nunca'}</div>
        </div>
    `).join('');
}

async function handleUnitSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const unitData = {
        name: formData.get('name'),
        address: formData.get('address'),
        phone: formData.get('phone')
    };
    
    try {
        const response = await fetch('/api/units', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(unitData)
        });
        
        if (response.ok) {
            showNotification('Unidade cadastrada com sucesso', 'success');
            form.reset();
            loadUnits();
            loadDashboard(); // Atualizar estatísticas
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao cadastrar unidade', 'error');
        }
        
    } catch (error) {
        console.error('Erro ao cadastrar unidade:', error);
        showNotification('Erro de conexão', 'error');
    }
}

// ===== UTILIDADES =====

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDateTime(dateString) {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Event listener para o formulário de unidade usando IDs corretos
document.addEventListener('DOMContentLoaded', function() {
    const unitForm = document.getElementById('unitForm');
    if (unitForm) {
        unitForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const name = document.getElementById('unitName').value;
            const address = document.getElementById('unitAddress').value;
            const phone = document.getElementById('unitPhone').value;
            
            if (!name.trim()) {
                showNotification('Nome da UBS é obrigatório', 'error');
                return;
            }
            
            const unitData = { name, address, phone };
            
            try {
                const response = await fetch('/api/units', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(unitData)
                });
                
                if (response.ok) {
                    showNotification('UBS cadastrada com sucesso!', 'success');
                    document.getElementById('unitName').value = '';
                    document.getElementById('unitAddress').value = '';
                    document.getElementById('unitPhone').value = '';
                    loadUnits();
                    loadDashboard();
                } else {
                    const error = await response.json();
                    showNotification(error.error || 'Erro ao cadastrar UBS', 'error');
                }
                
            } catch (error) {
                console.error('Erro ao cadastrar UBS:', error);
                showNotification('Erro de conexão', 'error');
            }
        });
    }
});
