@extends('layouts.app')

@section('styles')
<style>
    /* Reset e base */
    body {
        background-color: #f4f6f9;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .container-fluid {
        padding: 0 2rem;
    }
    
    /* Header do Dashboard */
    .dashboard-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
    }
    
    .dashboard-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .dashboard-subtitle {
        opacity: 0.9;
        font-size: 1.1rem;
        margin: 0;
    }
    
    /* Cards Modernos */
    .modern-card {
        background: white;
        border-radius: 16px;
        border: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        transition: all 0.3s ease;
        margin-bottom: 1.5rem;
        overflow: hidden;
    }
    
    .modern-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    }
    
    .modern-card-header {
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        padding: 1.25rem 1.5rem;
        font-weight: 600;
        font-size: 0.95rem;
        color: #495057;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .modern-card-body {
        padding: 1.5rem;
    }
    
    /* KPI Cards */
    .kpi-card {
        background: white;
        border-radius: 20px;
        padding: 2rem 1.5rem;
        text-align: center;
        border: none;
        position: relative;
        overflow: hidden;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--card-color);
    }
    
    .kpi-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .kpi-number {
        font-size: 3rem;
        font-weight: 800;
        margin: 0;
        color: var(--card-color);
        line-height: 1;
    }
    
    .kpi-label {
        font-size: 0.9rem;
        color: #6c757d;
        font-weight: 500;
        margin: 0.5rem 0 0 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .kpi-icon {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        font-size: 2rem;
        opacity: 0.1;
        color: var(--card-color);
    }
    
    /* Variações de cores dos KPIs */
    .kpi-total { --card-color: #6366f1; }
    .kpi-new { --card-color: #f59e0b; }
    .kpi-progress { --card-color: #3b82f6; }
    .kpi-pending { --card-color: #8b5cf6; }
    .kpi-resolved { --card-color: #10b981; }
    .kpi-overdue { --card-color: #ef4444; }
    
    /* Charts containers */
    .chart-container {
        position: relative;
        height: 280px;
        padding: 1rem;
    }
    
    .chart-small {
        height: 200px;
    }
    
    /* Lista moderna */
    .modern-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .modern-list-item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #f1f3f4;
        transition: all 0.2s ease;
    }
    
    .modern-list-item:hover {
        background: #f8f9fa;
        border-radius: 8px;
        margin: 0 -1rem;
        padding: 1rem;
    }
    
    .modern-list-item:last-child {
        border-bottom: none;
    }
    
    .modern-avatar {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 1rem;
        font-size: 1.1rem;
    }
    
    .modern-content {
        flex: 1;
        min-width: 0;
    }
    
    .modern-title {
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: #1f2937;
        font-size: 0.95rem;
    }
    
    .modern-subtitle {
        color: #6b7280;
        margin: 0;
        font-size: 0.85rem;
    }
    
    .modern-badge {
        background: #e5e7eb;
        color: #374151;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    /* Status badges */
    .badge-new { background: #fef3c7; color: #92400e; }
    .badge-progress { background: #dbeafe; color: #1e40af; }
    .badge-resolved { background: #d1fae5; color: #065f46; }
    .badge-pending { background: #e0e7ff; color: #4338ca; }
    
    /* Métricas de performance */
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 1rem;
    }
    
    .metric-item {
        text-align: center;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 12px;
        border-left: 4px solid var(--metric-color);
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: var(--metric-color);
    }
    
    .metric-label {
        font-size: 0.85rem;
        color: #6b7280;
        margin: 0.5rem 0 0 0;
        font-weight: 500;
    }
    
    .metric-time { --metric-color: #3b82f6; }
    .metric-sla { --metric-color: #10b981; }
    .metric-response { --metric-color: #f59e0b; }
    .metric-satisfaction { --metric-color: #8b5cf6; }
    
    /* Responsive */
    @media (max-width: 768px) {
        .container-fluid {
            padding: 0 1rem;
        }
        
        .dashboard-title {
            font-size: 2rem;
        }
        
        .kpi-number {
            font-size: 2.5rem;
        }
        
        .metric-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .chart-container {
            height: 200px;
        }
    }
    
    /* Animações */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out;
    }
    
    /* Loading states */
    .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
</style>
@endsection

@section('content')
@php
use Illuminate\Support\Str;
@endphp
<div class="container-fluid">
                        </div>
    <!-- KPIs Principais -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0 text-dark font-weight-bold">Dashboard do Sistema</h3>
                <div class="text-muted">
                    <i class="fas fa-calendar-alt mr-1"></i>
                    {{ now()->format('d/m/Y H:i') }}
                </div>
            </div>
        </div>
        <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div class="stat-card bg-gradient-info position-relative">
                <h3>{{ $ticketStats['total'] }}</h3>
                <p>Total de Chamados</p>
                <i class="fas fa-ticket-alt position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 1.5rem;"></i>
            </div>
        </div>
        <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div class="stat-card bg-gradient-warning position-relative">
                <h3>{{ $ticketStats['new'] }}</h3>
                <p>Novos</p>
                <i class="fas fa-plus-circle position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 1.5rem;"></i>
            </div>
        </div>
        <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div class="stat-card bg-gradient-primary position-relative">
                <h3>{{ $ticketStats['in_progress'] }}</h3>
                <p>Em Andamento</p>
                <i class="fas fa-cog position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 1.5rem;"></i>
            </div>
        </div>
        <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div class="stat-card bg-gradient-secondary position-relative">
                <h3>{{ $ticketStats['pending'] }}</h3>
                <p>Pendentes</p>
                <i class="fas fa-clock position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 1.5rem;"></i>
            </div>
        </div>
        <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div class="stat-card bg-gradient-success position-relative">
                <h3>{{ $ticketStats['resolved'] }}</h3>
                <p>Resolvidos</p>
                <i class="fas fa-check-circle position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 1.5rem;"></i>
            </div>
        </div>
        <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div class="stat-card bg-gradient-danger position-relative">
                <h3>{{ $overdueSLA ?? $ticketStats['closed'] }}</h3>
                <p>SLA Vencido</p>
                <i class="fas fa-exclamation-triangle position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 1.5rem;"></i>
            </div>
        </div>
    </div>

    <div class="row mb-4">
        <!-- Chamados por Categoria -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Chamados por Categoria</h5>
                </div>
                <div class="card-body">
                    <canvas id="ticketsByCategory"></canvas>
                </div>
            </div>
        </div>

        <!-- Chamados por Prioridade -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Chamados por Prioridade</h5>
                </div>
                <div class="card-body">
                    <canvas id="ticketsByPriority"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Resumo de Ativos -->
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Visão Geral de Ativos</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <h3>{{ $assetStats['total'] }}</h3>
                                    <p class="mb-0">Total de Ativos</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-success text-white">
                                <div class="card-body">
                                    <h3>{{ $assetStats['active'] }}</h3>
                                    <p class="mb-0">Em Uso</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-warning text-white">
                                <div class="card-body">
                                    <h3>{{ $assetStats['maintenance'] }}</h3>
                                    <p class="mb-0">Em Manutenção</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-info text-white">
                                <div class="card-body">
                                    <h3>{{ $assetStats['stock'] }}</h3>
                                    <p class="mb-0">Em Estoque</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Gráficos e Análises -->
    <div class="row mb-4">
        <!-- Gráfico de Chamados por Status -->
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-chart-pie mr-2"></i>Chamados por Status
                    </h6>
                </div>
                <div class="card-body p-3">
                    <canvas id="ticketsByStatus" height="200"></canvas>
                </div>
            </div>
        </div>

        <!-- Gráfico de Chamados por Prioridade -->
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-chart-bar mr-2"></i>Chamados por Prioridade
                    </h6>
                </div>
                <div class="card-body p-3">
                    <canvas id="ticketsByPriority" height="200"></canvas>
                </div>
            </div>
        </div>

        <!-- Métricas de Performance -->
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-tachometer-alt mr-2"></i>Métricas de Performance
                    </h6>
                </div>
                <div class="card-body p-3">
                    <div class="row text-center">
                        <div class="col-6 border-right">
                            <div class="mb-3">
                                <h4 class="text-primary mb-0">2.5h</h4>
                                <small class="text-muted">Tempo Médio</small>
                            </div>
                            <div>
                                <h4 class="text-success mb-0">95%</h4>
                                <small class="text-muted">SLA</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="mb-3">
                                <h4 class="text-warning mb-0">1.2h</h4>
                                <small class="text-muted">Primeira Resposta</small>
                            </div>
                            <div>
                                <h4 class="text-info mb-0">4.8</h4>
                                <small class="text-muted">Satisfação</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Seção de Ativos -->
    <div class="row mb-4">
        <!-- Ativos por Localização -->
        <div class="col-md-6">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-map-marker-alt mr-2"></i>Ativos por Localização
                    </h6>
                </div>
                <div class="card-body p-3">
                    <canvas id="assetsByLocation" height="180"></canvas>
                </div>
            </div>
        </div>

        <!-- Ativos por Departamento -->
        <div class="col-md-6">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-building mr-2"></i>Ativos por Departamento
                    </h6>
                </div>
                <div class="card-body p-3">
                    <canvas id="assetsByDepartment" height="180"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Informações Detalhadas -->
    <div class="row mb-4">
        <!-- Top Técnicos -->
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-user-cog mr-2"></i>Top Técnicos
                    </h6>
                </div>
                <div class="card-body p-3">
                    @if(isset($topTechnicians) && $topTechnicians->count() > 0)
                        <div class="list-group list-group-flush">
                            @foreach($topTechnicians->take(5) as $tech)
                            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style="width: 35px; height: 35px;">
                                        {{ substr($tech->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <h6 class="mb-0">{{ $tech->name }}</h6>
                                        <small class="text-muted">{{ $tech->total }} chamados</small>
                                    </div>
                                </div>
                                <span class="badge badge-primary badge-pill">{{ $tech->total }}</span>
                            </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-3">
                            <i class="fas fa-user-cog fa-2x text-muted mb-2"></i>
                            <p class="text-muted mb-0">Nenhum técnico encontrado</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Ativos com Problemas -->
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-exclamation-triangle mr-2"></i>Ativos com Atenção
                    </h6>
                </div>
                <div class="card-body p-3">
                    @if(isset($warningAssets) && $warningAssets->count() > 0)
                        <div class="list-group list-group-flush">
                            @foreach($warningAssets->take(5) as $asset)
                            <div class="list-group-item px-0 py-2 border-0">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">{{ $asset->name }}</h6>
                                        <small class="text-muted">{{ $asset->assetModel->name ?? 'N/A' }}</small>
                                    </div>
                                    <span class="badge badge-warning badge-pill">
                                        {{ $asset->warranty_expires ? $asset->warranty_expires->diffForHumans() : 'N/A' }}
                                    </span>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-3">
                            <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                            <p class="text-muted mb-0">Todos os ativos estão em ordem</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Atividade Recente -->
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-header bg-light">
                    <h6 class="mb-0 text-secondary">
                        <i class="fas fa-clock mr-2"></i>Atividade Recente
                    </h6>
                </div>
                <div class="card-body p-3">
                    @if(isset($recentTickets) && $recentTickets->count() > 0)
                        <div class="list-group list-group-flush">
                            @foreach($recentTickets->take(5) as $ticket)
                            <div class="list-group-item px-0 py-2 border-0">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <h6 class="mb-1">{{ Str::limit($ticket->title, 25) }}</h6>
                                        <small class="text-muted">{{ $ticket->created_at->diffForHumans() }}</small>
                                    </div>
                                    <span class="badge badge-{{ $ticket->status == 'resolved' ? 'success' : ($ticket->status == 'in_progress' ? 'primary' : 'warning') }} badge-pill ml-2">
                                        {{ ucfirst($ticket->status) }}
                                    </span>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-3">
                            <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                            <p class="text-muted mb-0">Nenhum chamado recente</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Base de Conhecimento -->
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="fas fa-book mr-2"></i>Base de Conhecimento
                    </h5>
                    <a href="{{ route('knowledge.index') }}" class="btn btn-light btn-sm">
                        Ver Todos
                    </a>
                </div>
                <div class="card-body">
                    @if(isset($knowledgeStats))
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <div class="card bg-info text-white">
                                <div class="card-body text-center">
                                    <h4>{{ $knowledgeStats['total_articles'] ?? 0 }}</h4>
                                    <p class="mb-0">Total de Artigos</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <h4>{{ $knowledgeStats['published_articles'] ?? 0 }}</h4>
                                    <p class="mb-0">Publicados</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-warning text-white">
                                <div class="card-body text-center">
                                    <h4>{{ $knowledgeStats['total_categories'] ?? 0 }}</h4>
                                    <p class="mb-0">Categorias</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <h4>{{ $knowledgeStats['total_views'] ?? 0 }}</h4>
                                    <p class="mb-0">Visualizações</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endif

                    @if(isset($popularKnowledgeArticles) && $popularKnowledgeArticles->count() > 0)
                    <h6 class="mb-3">Artigos Mais Populares</h6>
                    <div class="row">
                        @foreach($popularKnowledgeArticles as $article)
                        <div class="col-md-4 mb-3">
                            <div class="card border-left-success">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <a href="{{ route('knowledge.show', $article) }}" class="text-decoration-none">
                                            {{ Str::limit($article->title, 50) }}
                                        </a>
                                    </h6>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge badge-info">{{ $article->category->name }}</span>
                                        <small class="text-muted">
                                            <i class="fas fa-eye mr-1"></i>{{ $article->views }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                    @else
                    <div class="text-center py-4">
                        <i class="fas fa-book fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Base de Conhecimento</h5>
                        <p class="text-muted">Ainda não há artigos na base de conhecimento.</p>
                        <a href="{{ route('knowledge.create') }}" class="btn btn-success">
                            <i class="fas fa-plus mr-2"></i>Criar Primeiro Artigo
                        </a>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Configurações globais para gráficos menores e mais profissionais
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    // Cores profissionais
    const colors = {
        primary: '#007bff',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
        secondary: '#6c757d'
    };

    // Gráfico de Chamados por Status
    new Chart(document.getElementById('ticketsByStatus'), {
        type: 'doughnut',
        data: {
            labels: ['Novos', 'Em Andamento', 'Pendentes', 'Resolvidos', 'Fechados'],
            datasets: [{
                data: [
                    {{ $ticketStats['new'] }},
                    {{ $ticketStats['in_progress'] }},
                    {{ $ticketStats['pending'] }},
                    {{ $ticketStats['resolved'] }},
                    {{ $ticketStats['closed'] }}
                ],
                backgroundColor: [
                    colors.warning,
                    colors.primary,
                    colors.secondary,
                    colors.success,
                    colors.dark
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 8,
                        usePointStyle: true
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Gráfico de Chamados por Prioridade
    new Chart(document.getElementById('ticketsByPriority'), {
        type: 'bar',
        data: {
            labels: {!! json_encode(array_keys($ticketsByPriority)) !!},
            datasets: [{
                label: 'Quantidade',
                data: {!! json_encode(array_values($ticketsByPriority)) !!},
                backgroundColor: [
                    colors.info,
                    colors.warning,
                    colors.danger
                ],
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Gráfico de Assets por Localização
    new Chart(document.getElementById('assetsByLocation'), {
        type: 'doughnut',
        data: {
            labels: {!! json_encode(array_keys($assetsByLocation)) !!},
            datasets: [{
                data: {!! json_encode(array_values($assetsByLocation)) !!},
                backgroundColor: [
                    colors.primary,
                    colors.success,
                    colors.warning,
                    colors.info,
                    colors.secondary
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 8,
                        usePointStyle: true
                    }
                }
            },
            cutout: '50%'
        }
    });

    // Gráfico de Assets por Departamento
    new Chart(document.getElementById('assetsByDepartment'), {
        type: 'horizontalBar',
        data: {
            labels: {!! json_encode(array_keys($assetsByDepartment)) !!},
            datasets: [{
                label: 'Quantidade',
                data: {!! json_encode(array_values($assetsByDepartment)) !!},
                backgroundColor: colors.primary,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
});
</script>
@endpush
