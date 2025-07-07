<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Asset;
use App\Models\Category;
use App\Models\Department;
use App\Models\User;
use App\Models\SLA;
use App\Exports\AssetsExport;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index()
    {
        return view('reports.index');
    }

    public function tickets(Request $request)
    {
        $users = User::orderBy('name')->get();
        $categories = Category::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        $dateRange = $request->get('date_range', 'last30');
        $startDate = null;
        $endDate = Carbon::now();

        switch ($dateRange) {
            case 'last7':
                $startDate = Carbon::now()->subDays(7);
                break;
            case 'last30':
                $startDate = Carbon::now()->subDays(30);
                break;
            case 'last90':
                $startDate = Carbon::now()->subDays(90);
                break;
            case 'last365':
                $startDate = Carbon::now()->subDays(365);
                break;
            case 'custom':
                $startDate = $request->get('start_date') ? Carbon::parse($request->get('start_date')) : null;
                $endDate = $request->get('end_date') ? Carbon::parse($request->get('end_date')) : Carbon::now();
                break;
        }

        $query = Ticket::query();

        if ($startDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority != '') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('user_id') && $request->user_id != '') {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('assigned_to') && $request->assigned_to != '') {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('department_id') && $request->department_id != '') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        $ticketsCount = $query->count();
        
        // Estatísticas por status
        $statusStats = $query->clone()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
            
        // Estatísticas por prioridade
        $priorityStats = $query->clone()
            ->select('priority', DB::raw('count(*) as total'))
            ->groupBy('priority')
            ->pluck('total', 'priority')
            ->toArray();
            
        // Estatísticas por categoria
        $categoryStats = $query->clone()
            ->select('category_id', DB::raw('count(*) as total'))
            ->groupBy('category_id')
            ->get()
            ->mapWithKeys(function ($item) {
                $categoryName = Category::find($item->category_id)->name ?? 'Desconhecido';
                return [$categoryName => $item->total];
            })
            ->toArray();
            
        // Tempo médio de resolução
        $avgResolutionTime = $query->clone()
            ->whereNotNull('resolved_at')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, resolved_at)) as avg_time'))
            ->first()->avg_time ?? 0;

        // Conformidade com SLA
        $slaQuery = $query->clone()->whereNotNull('resolved_at');
        $totalResolved = $slaQuery->count();
        $slaCompliant = 0;
        
        if ($totalResolved > 0) {
            // Suponha que temos um cálculo de SLA (simplificado para este exemplo)
            $slaCompliant = $slaQuery
                ->whereRaw('TIMESTAMPDIFF(MINUTE, created_at, resolved_at) <= 
                           (CASE 
                              WHEN priority = "low" THEN 4320 
                              WHEN priority = "normal" THEN 1440 
                              WHEN priority = "high" THEN 480 
                              WHEN priority = "critical" THEN 240 
                            END)')
                ->count();
        }
        
        $slaComplianceRate = $totalResolved > 0 ? round(($slaCompliant / $totalResolved) * 100) : 0;

        // Resultados paginados para tabela
        $tickets = $query->with(['user', 'category', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('reports.tickets', compact(
            'tickets', 
            'users', 
            'categories', 
            'departments',
            'dateRange',
            'ticketsCount',
            'statusStats',
            'priorityStats',
            'categoryStats',
            'avgResolutionTime',
            'slaComplianceRate'
        ));
    }

    public function assets(Request $request)
    {
        $departments = Department::orderBy('name')->get();
        $manufacturers = \App\Models\Manufacturer::orderBy('name')->get();
        $assetTypes = \App\Models\AssetType::orderBy('name')->get();
        $locations = \App\Models\Location::orderBy('name')->get();

        $query = Asset::query();

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        if ($request->has('department_id') && $request->department_id != '') {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('manufacturer_id') && $request->manufacturer_id != '') {
            $query->where('manufacturer_id', $request->manufacturer_id);
        }

        if ($request->has('asset_type_id') && $request->asset_type_id != '') {
            $query->where('asset_type_id', $request->asset_type_id);
        }

        if ($request->has('location_id') && $request->location_id != '') {
            $query->where('location_id', $request->location_id);
        }

        if ($request->has('under_warranty') && $request->under_warranty === '1') {
            $query->whereNotNull('warranty_expires')
                  ->where('warranty_expires', '>=', now());
        } elseif ($request->has('under_warranty') && $request->under_warranty === '0') {
            $query->where(function($q) {
                $q->whereNull('warranty_expires')
                  ->orWhere('warranty_expires', '<', now());
            });
        }

        $assetsCount = $query->count();
        
        // Estatísticas por status
        $statusStats = $query->clone()
            ->join('asset_statuses', 'assets.status_id', '=', 'asset_statuses.id')
            ->select('asset_statuses.name as status', DB::raw('count(*) as total'))
            ->groupBy('asset_statuses.name')
            ->pluck('total', 'status')
            ->toArray();
            
        // Estatísticas por tipo de ativo
        $typeStats = $query->clone()
            ->join('asset_models', 'assets.model_id', '=', 'asset_models.id')
            ->select('asset_models.name as model', DB::raw('count(*) as total'))
            ->groupBy('asset_models.name')
            ->pluck('total', 'model')
            ->toArray();
            
        // Estatísticas por fabricante
        $manufacturerStats = $query->clone()
            ->join('asset_models', 'assets.model_id', '=', 'asset_models.id')
            ->join('manufacturers', 'asset_models.manufacturer_id', '=', 'manufacturers.id')
            ->select('manufacturers.name as manufacturer', DB::raw('count(*) as total'))
            ->groupBy('manufacturers.name')
            ->pluck('total', 'manufacturer')
            ->toArray();
            
        // Valor total dos ativos
        $totalValue = $query->clone()
            ->sum('purchase_cost');
            
        // Ativos com garantia expirada
        $expiredWarrantyCount = $query->clone()
            ->whereNotNull('warranty_expires')
            ->where('warranty_expires', '<', now())
            ->count();

        // Resultados paginados para tabela
        $assets = $query->with(['assetModel', 'manufacturer', 'location', 'status'])
            ->orderBy('name', 'asc')
            ->paginate(10);

        return view('reports.assets', compact(
            'assets', 
            'departments', 
            'manufacturers', 
            'locations',
            'assetsCount',
            'statusStats',
            'typeStats',
            'manufacturerStats',
            'totalValue',
            'expiredWarrantyCount'
        ));
    }

    public function sla(Request $request)
    {
        $categories = Category::orderBy('name')->get();
        $slas = SLA::orderBy('name')->get();

        $dateRange = $request->get('date_range', 'last30');
        $startDate = null;
        $endDate = Carbon::now();

        switch ($dateRange) {
            case 'last7':
                $startDate = Carbon::now()->subDays(7);
                break;
            case 'last30':
                $startDate = Carbon::now()->subDays(30);
                break;
            case 'last90':
                $startDate = Carbon::now()->subDays(90);
                break;
            case 'last365':
                $startDate = Carbon::now()->subDays(365);
                break;
            case 'custom':
                $startDate = $request->get('start_date') ? Carbon::parse($request->get('start_date')) : null;
                $endDate = $request->get('end_date') ? Carbon::parse($request->get('end_date')) : Carbon::now();
                break;
        }

        $query = Ticket::query()->whereNotNull('resolved_at');

        if ($startDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('category_id', $request->category_id);
        }

        $totalTickets = $query->count();
        $resolvedOnTime = 0;
        $slaPerformance = [];

        // Calcular estatísticas de SLA
        foreach ($slas as $sla) {
            $categories = Category::where('sla_id', $sla->id)->pluck('id')->toArray();
            
            if (empty($categories)) continue;
            
            $ticketsForSla = $query->clone()
                ->whereIn('category_id', $categories)
                ->count();
                
            if ($ticketsForSla == 0) continue;
            
            $resolvedOnTimeForSla = $query->clone()
                ->whereIn('category_id', $categories)
                ->whereRaw('TIMESTAMPDIFF(MINUTE, created_at, resolved_at) <= ?', [$sla->resolution_time])
                ->count();
                
            $complianceRate = round(($resolvedOnTimeForSla / $ticketsForSla) * 100);
            
            $slaPerformance[$sla->name] = [
                'total' => $ticketsForSla,
                'on_time' => $resolvedOnTimeForSla,
                'rate' => $complianceRate
            ];
            
            $resolvedOnTime += $resolvedOnTimeForSla;
        }
        
        $overallComplianceRate = $totalTickets > 0 ? round(($resolvedOnTime / $totalTickets) * 100) : 0;

        // Estatísticas por prioridade
        $priorityStats = [];
        $priorities = ['low', 'normal', 'high', 'critical'];
        
        foreach ($priorities as $priority) {
            $ticketsForPriority = $query->clone()->where('priority', $priority)->count();
            
            if ($ticketsForPriority == 0) continue;
            
            $resolvedOnTimeForPriority = $query->clone()
                ->where('priority', $priority)
                ->whereRaw('TIMESTAMPDIFF(MINUTE, created_at, resolved_at) <= 
                           (CASE 
                              WHEN priority = "low" THEN 4320 
                              WHEN priority = "normal" THEN 1440 
                              WHEN priority = "high" THEN 480 
                              WHEN priority = "critical" THEN 240 
                            END)')
                ->count();
                
            $complianceRate = round(($resolvedOnTimeForPriority / $ticketsForPriority) * 100);
            
            $priorityStats[$priority] = [
                'total' => $ticketsForPriority,
                'on_time' => $resolvedOnTimeForPriority,
                'rate' => $complianceRate
            ];
        }

        // Tempo médio de resposta e resolução
        $avgResponseTime = $query->clone()
            ->whereNotNull('assigned_to')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)) as avg_time'))
            ->first()->avg_time ?? 0;
            
        $avgResolutionTime = $query->clone()
            ->select(DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, resolved_at)) as avg_time'))
            ->first()->avg_time ?? 0;

        return view('reports.sla', compact(
            'categories', 
            'slas',
            'dateRange',
            'totalTickets',
            'resolvedOnTime',
            'overallComplianceRate',
            'slaPerformance',
            'priorityStats',
            'avgResponseTime',
            'avgResolutionTime'
        ));
    }

    public function generate(Request $request)
    {
        $reportType = $request->get('report_type');
        $format = $request->get('format', 'view');
        
        switch ($reportType) {
            case 'tickets':
                return $this->tickets($request);
                
            case 'assets':
                return $this->assets($request);
                
            case 'sla':
                return $this->sla($request);
                
            default:
                return redirect()->route('reports.index')
                    ->with('error', 'Tipo de relatório inválido.');
        }
    }

    public function performance(Request $request)
    {
        // Estatísticas de Performance SLA
        $totalTickets = Ticket::count();
        $ticketsOnTime = Ticket::whereNotNull('resolved_at')
            ->whereRaw('resolved_at <= due_date')
            ->count();
            
        $slaPerformance = $totalTickets > 0 ? ($ticketsOnTime / $totalTickets) * 100 : 0;
        
        // Tempo médio de resolução
        $avgResolutionTime = Ticket::whereNotNull('resolved_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
            ->value('avg_hours') ?? 0;
            
        // Tickets por mês (últimos 12 meses)
        $monthlyTickets = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = Ticket::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $monthlyTickets[$date->format('M/Y')] = $count;
        }
        
        // Top usuários que mais abrem chamados
        $topUsers = Ticket::select('users.name', DB::raw('count(*) as total'))
            ->join('users', 'tickets.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();
            
        // Top categorias mais utilizadas
        $topCategories = Ticket::select('categories.name', DB::raw('count(*) as total'))
            ->join('categories', 'tickets.category_id', '=', 'categories.id')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        return view('reports.performance', compact(
            'slaPerformance',
            'avgResolutionTime', 
            'monthlyTickets',
            'topUsers',
            'topCategories',
            'totalTickets',
            'ticketsOnTime'
        ));
    }

    public function export($type, Request $request)
    {
        switch ($type) {
            case 'assets':
                $filename = 'assets_report_' . date('Y-m-d') . '.xlsx';
                return Excel::download(new AssetsExport($request), $filename);
                
            // Adicione outros tipos de exportação conforme necessário
                
            default:
                return redirect()->back()->with('error', 'Formato de exportação não suportado.');
        }
    }
}
