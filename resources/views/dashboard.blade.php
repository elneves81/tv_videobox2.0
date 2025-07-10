@extends('layouts.app')

@section('styles')
@vite('resources/css/dashboard.css')
@endsection

@section('content')
<div class="container-fluid py-4">
    <div class="dashboard-header text-center" style="background: linear-gradient(90deg, #1976f2 0%, #6366f1 100%); box-shadow: 0 8px 32px #1976f244;">
        <div class="dashboard-title" style="font-size:3.2rem; font-weight:900; color:#fff; letter-spacing:0.03em; text-shadow:0 4px 24px #1976f299, 0 1px 0 #6366f1; filter: drop-shadow(0 2px 16px #6366f1cc);">
            Painel de Administração
        </div>
    </div>
    <div class="filter-bar">
        <label>Status
            <select>
                <option>Todos</option>
                <option>Aberto</option>
                <option>Em Andamento</option>
                <option>Resolvido</option>
            </select>
        </label>
        <label>Prioridade
            <select>
                <option>Todos</option>
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
            </select>
        </label>
        <label>Categoria
            <select>
                <option>Todos</option>
                @foreach($categories as $cat)
                <option>{{ $cat->name }}</option>
                @endforeach
            </select>
        </label>
        <label>Data
            <input type="date">
        </label>
        <label>Buscar
            <input type="text" placeholder="Título, solicitante, técnico...">
        </label>
        <button class="export-btn">
            <i class="bi bi-file-earmark-excel"></i> Exportar Excel
        </button>
        <button class="export-btn">
            <i class="bi bi-file-earmark-pdf"></i> Exportar PDF
        </button>
        <button class="export-btn" id="toggle-dark">
            <i class="bi bi-moon"></i> Dark Mode
        </button>
    </div>
    <div class="quick-actions">
        <a href="{{ route('tickets.create') }}" class="quick-action-btn">
            <i class="bi bi-plus-circle"></i> Novo Chamado
        </a>
        <a href="{{ route('tickets.index', ['status' => 'waiting']) }}" class="quick-action-btn">
            <i class="bi bi-reply"></i> Responder
        </a>
        <a href="{{ route('tickets.index', ['assigned' => 'none']) }}" class="quick-action-btn">
            <i class="bi bi-person-plus"></i> Atribuir
        </a>
        <a href="{{ route('tickets.index', ['status' => 'in_progress']) }}" class="quick-action-btn">
            <i class="bi bi-check2-circle"></i> Fechar
        </a>
    </div>
    <!-- KPIs Principais -->
    <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
            <x-kpi-card type="total" :value="$totalTickets" label="Total" icon="collection" />
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
            <x-kpi-card type="new" :value="$openTickets" label="Abertos" icon="lightning-charge" />
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
            <x-kpi-card type="progress" :value="$inProgressTickets" label="Em Andamento" icon="arrow-repeat" />
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
            <x-kpi-card type="resolved" :value="$resolvedTickets" label="Resolvidos" icon="check-circle" />
        </div>
    </div>
    
    <!-- KPIs Secundários -->
    <div class="row mb-4">
        <div class="col-lg-4 mb-3">
            <x-kpi-card type="overdue" :value="$overdueTickets ?? 0" label="Vencidos" icon="exclamation-triangle" />
        </div>
        <div class="col-lg-4 mb-3">
            <x-kpi-card type="sla" value="-" label="% SLA Cumprido" icon="clock-history" />
        </div>
        <div class="col-lg-4 mb-3">
            <x-kpi-card type="reopened" :value="$reopenedTickets ?? 0" label="Reabertos" icon="arrow-counterclockwise" />
        </div>
    </div>
    <!-- Gráficos -->
    <div class="row mb-4">
        <div class="col-lg-4 mb-3">
            <x-chart-card title="Chamados por Categoria" icon="pie-chart" chart-id="categoryChart" bg-color="primary" />
        </div>
        <div class="col-lg-4 mb-3">
            <x-chart-card title="Chamados por Prioridade" icon="bar-chart" chart-id="priorityChart" bg-color="warning" />
        </div>
        <div class="col-lg-4 mb-3">
            <x-chart-card title="Evolução dos Chamados" icon="activity" chart-id="evolutionChart" bg-color="info" />
        </div>
    </div>
    <div class="row mb-4">
        <div class="col-lg-6 mb-3">
            <div class="card h-100">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i> Mapa de Chamados</h5>
                </div>
                <div class="card-body">
                    <div class="map-container" id="map"></div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 mb-3">
            <div class="card h-100">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-trophy me-2"></i> Ranking de Técnicos</h5>
                </div>
                <div class="card-body" style="max-height:220px;overflow:auto;">
                    <ul class="ranking-list mb-0">
                        @foreach($ranking as $user)
                        <li>
                            <span class="ranking-avatar">{{ strtoupper(mb_substr($user->name,0,1)) }}</span>
                            {{ $user->name }}
                            <span class="ranking-score">{{ $user->score }}</span>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-3 mb-3">
            <div class="card h-100">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i> Atividades Recentes</h5>
                </div>
                <div class="card-body" style="max-height:220px;overflow:auto;">
                    <div class="timeline mb-0">
                        @foreach($activities as $act)
                        <div class="timeline-event">
                            <span class="timeline-title">{{ $act->title }}</span>
                            <span class="timeline-date">{{ $act->created_at->diffForHumans() }}</span>
                            <div>{{ $act->description }}</div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="dashboard-section-title">Satisfação dos Usuários</div>
    <div class="row mb-4">
        <div class="col-lg-6 mb-3">
            <div class="kpi-card kpi-satisfaction">
                <div class="kpi-icon">
                    <i class="bi bi-emoji-smile"></i>
                </div>
                <div class="kpi-number">{{ $satisfaction ?? '9.2' }}</div>
                <div class="kpi-label">NPS</div>
            </div>
        </div>
        <div class="col-lg-6 mb-3">
            <div class="kpi-card kpi-user">
                <div class="kpi-icon">
                    <i class="bi bi-people"></i>
                </div>
                <div class="kpi-number">{{ $feedbacks ?? 0 }}</div>
                <div class="kpi-label">Avaliações</div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
@vite(['resources/js/app.js', 'resources/js/dashboard.js'])
@endpush
