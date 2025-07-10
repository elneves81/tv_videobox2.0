/**
 * Dashboard JavaScript - Sistema de Chamados
 * Funcionalidades: Gráficos, Dark Mode, Filtros, Carregamento Assíncrono
 */

class Dashboard {
    constructor() {
        this.charts = {};
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        this.initDarkMode();
        this.initCharts();
        this.initFilters();
        this.initExportButtons();
        this.initQuickActions();
        this.initAutoRefresh();
    }

    /**
     * Inicializa o modo escuro
     */
    initDarkMode() {
        const toggleBtn = document.getElementById('toggle-dark');
        const body = document.body;

        // Aplicar modo escuro salvo
        if (this.darkMode) {
            body.classList.add('dark-mode');
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="bi bi-sun"></i> Light Mode';
            }
        }

        // Event listener para toggle
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.darkMode = !this.darkMode;
                body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', this.darkMode);
                
                toggleBtn.innerHTML = this.darkMode 
                    ? '<i class="bi bi-sun"></i> Light Mode'
                    : '<i class="bi bi-moon"></i> Dark Mode';
                
                // Recriar gráficos com nova paleta de cores
                this.updateChartsTheme();
            });
        }
    }

    /**
     * Inicializa os gráficos
     */
    initCharts() {
        this.createCategoryChart();
        this.createPriorityChart();
        this.createEvolutionChart();
        this.initMap();
    }

    /**
     * Cria gráfico de categorias
     */
    createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        
        this.charts.category = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: window.dashboardData?.categories?.map(c => c.name) || [],
                datasets: [{
                    data: window.dashboardData?.categories?.map(c => c.tickets_count ?? 0) || [],
                    backgroundColor: colors.pie,
                    borderWidth: 2,
                    borderColor: this.darkMode ? '#374151' : '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.darkMode ? '#e5e7eb' : '#374151',
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: this.darkMode ? '#374151' : '#fff',
                        titleColor: this.darkMode ? '#e5e7eb' : '#374151',
                        bodyColor: this.darkMode ? '#e5e7eb' : '#374151',
                        borderColor: this.darkMode ? '#6b7280' : '#e5e7eb',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    /**
     * Cria gráfico de prioridades
     */
    createPriorityChart() {
        const ctx = document.getElementById('priorityChart');
        if (!ctx) return;

        const priorityData = window.dashboardData?.priorityCount || { high: 0, medium: 0, low: 0 };
        
        this.charts.priority = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Alta', 'Média', 'Baixa'],
                datasets: [{
                    data: [priorityData.high, priorityData.medium, priorityData.low],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.darkMode ? '#374151' : '#fff',
                        titleColor: this.darkMode ? '#e5e7eb' : '#374151',
                        bodyColor: this.darkMode ? '#e5e7eb' : '#374151',
                        borderColor: this.darkMode ? '#6b7280' : '#e5e7eb',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.darkMode ? '#374151' : '#f3f4f6'
                        },
                        ticks: {
                            color: this.darkMode ? '#e5e7eb' : '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: this.darkMode ? '#e5e7eb' : '#6b7280'
                        }
                    }
                }
            }
        });
    }

    /**
     * Cria gráfico de evolução
     */
    createEvolutionChart() {
        const ctx = document.getElementById('evolutionChart');
        if (!ctx) return;

        const evolutionData = window.dashboardData?.evolution || { labels: [], data: [] };
        
        this.charts.evolution = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: evolutionData.labels,
                datasets: [{
                    label: 'Chamados',
                    data: evolutionData.data,
                    borderColor: '#6366f1',
                    backgroundColor: this.darkMode ? '#6366f133' : '#6366f122',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.darkMode ? '#374151' : '#fff',
                        titleColor: this.darkMode ? '#e5e7eb' : '#374151',
                        bodyColor: this.darkMode ? '#e5e7eb' : '#374151',
                        borderColor: this.darkMode ? '#6b7280' : '#e5e7eb',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.darkMode ? '#374151' : '#f3f4f6'
                        },
                        ticks: {
                            color: this.darkMode ? '#e5e7eb' : '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            color: this.darkMode ? '#374151' : '#f3f4f6'
                        },
                        ticks: {
                            color: this.darkMode ? '#e5e7eb' : '#6b7280'
                        }
                    }
                }
            }
        });
    }

    /**
     * Inicializa o mapa
     */
    initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // Placeholder para mapa real
        mapContainer.innerHTML = `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6366f1;font-size:1.5rem;text-align:center;">
                <div>
                    <i class="bi bi-geo-alt-fill" style="font-size:3rem;margin-bottom:1rem;display:block;"></i>
                    Mapa de Chamados<br>
                    <small style="font-size:0.9rem;opacity:0.7;">Integração em desenvolvimento</small>
                </div>
            </div>
        `;
    }

    /**
     * Retorna cores para gráficos baseado no tema
     */
    getChartColors() {
        return {
            pie: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'],
            primary: '#6366f1',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444'
        };
    }

    /**
     * Atualiza tema dos gráficos
     */
    updateChartsTheme() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
        setTimeout(() => this.initCharts(), 100);
    }

    /**
     * Inicializa filtros
     */
    initFilters() {
        const filterBar = document.querySelector('.filter-bar');
        if (!filterBar) return;

        const selects = filterBar.querySelectorAll('select');
        const inputs = filterBar.querySelectorAll('input');

        // Event listeners para filtros
        selects.forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });

        inputs.forEach(input => {
            if (input.type === 'text') {
                input.addEventListener('input', this.debounce(() => this.applyFilters(), 500));
            } else {
                input.addEventListener('change', () => this.applyFilters());
            }
        });
    }

    /**
     * Aplica filtros (placeholder para implementação futura)
     */
    applyFilters() {
        console.log('Aplicando filtros...');
        // Implementar lógica de filtros aqui
        // Pode fazer requisições AJAX para atualizar dados
    }

    /**
     * Inicializa botões de exportação
     */
    initExportButtons() {
        const exportButtons = document.querySelectorAll('.export-btn');
        
        exportButtons.forEach(btn => {
            if (btn.id === 'toggle-dark') return; // Skip dark mode button
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoadingState(btn);
                
                const isExcel = btn.textContent.includes('Excel');
                const isPDF = btn.textContent.includes('PDF');
                
                if (isExcel) {
                    this.exportToExcel();
                } else if (isPDF) {
                    this.exportToPDF();
                }
                
                setTimeout(() => this.hideLoadingState(btn), 2000);
            });
        });
    }

    /**
     * Exporta para Excel (placeholder)
     */
    exportToExcel() {
        console.log('Exportando para Excel...');
        // Implementar exportação real aqui
        this.showNotification('Exportação para Excel iniciada!', 'success');
    }

    /**
     * Exporta para PDF (placeholder)
     */
    exportToPDF() {
        console.log('Exportando para PDF...');
        // Implementar exportação real aqui
        this.showNotification('Exportação para PDF iniciada!', 'success');
    }

    /**
     * Inicializa ações rápidas
     */
    initQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action-btn');
        
        quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Adicionar efeito visual
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
    }

    /**
     * Inicializa auto-refresh
     */
    initAutoRefresh() {
        // Atualizar KPIs a cada 30 segundos
        setInterval(() => {
            this.refreshKPIs();
        }, 30000);
    }

    /**
     * Atualiza KPIs
     */
    async refreshKPIs() {
        try {
            // Implementar requisição para atualizar dados
            console.log('Atualizando KPIs...');
        } catch (error) {
            console.error('Erro ao atualizar KPIs:', error);
        }
    }

    /**
     * Mostra estado de carregamento
     */
    showLoadingState(element) {
        const originalText = element.innerHTML;
        element.dataset.originalText = originalText;
        element.innerHTML = '<i class="bi bi-hourglass-split"></i> Processando...';
        element.disabled = true;
    }

    /**
     * Esconde estado de carregamento
     */
    hideLoadingState(element) {
        element.innerHTML = element.dataset.originalText;
        element.disabled = false;
    }

    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Inicializar dashboard quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está carregado
    if (typeof Chart !== 'undefined') {
        window.dashboard = new Dashboard();
    } else {
        console.error('Chart.js não foi carregado');
    }
});

// Exportar para uso global se necessário
window.Dashboard = Dashboard;
