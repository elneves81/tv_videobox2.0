<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketBoardControllerSimple extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $tickets = Ticket::with(['user', 'category', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        $categories = Category::all();
        $users = User::all();
        
        // Organizar tickets por status
        $ticketsByStatus = [
            'open' => $tickets->where('status', 'open'),
            'in_progress' => $tickets->where('status', 'in_progress'),
            'resolved' => $tickets->where('status', 'resolved'),
            'closed' => $tickets->where('status', 'closed'),
        ];
        
        return view('tickets.board', compact('ticketsByStatus', 'categories', 'users'));
    }
    
    public function tvMode()
    {
        $tickets = Ticket::with(['user', 'category', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        $categories = Category::all();
        $users = User::all();
        
        // Organizar tickets por status
        $ticketsByStatus = [
            'open' => $tickets->where('status', 'open'),
            'in_progress' => $tickets->where('status', 'in_progress'),
            'resolved' => $tickets->where('status', 'resolved'),
            'closed' => $tickets->where('status', 'closed'),
        ];
        
        return view('tickets.board-tv', compact('ticketsByStatus', 'categories', 'users'));
    }
    
    public function getNewTickets(Request $request)
    {
        $lastCheck = $request->get('last_check');
        
        $newTickets = Ticket::with(['user', 'category', 'assignedTo'])
            ->where('created_at', '>', $lastCheck)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'tickets' => $this->transformTicketsForJson($newTickets),
            'count' => $newTickets->count(),
            'last_check' => now()->toISOString()
        ]);
    }
    
    public function getAllTickets()
    {
        $tickets = Ticket::with(['user', 'category', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Organizar tickets por status
        $ticketsByStatus = [
            'open' => $tickets->where('status', 'open')->values(),
            'in_progress' => $tickets->where('status', 'in_progress')->values(),
            'resolved' => $tickets->where('status', 'resolved')->values(),
            'closed' => $tickets->where('status', 'closed')->values(),
        ];
        
        return response()->json([
            'tickets' => $this->transformTicketsForJson($ticketsByStatus),
            'last_check' => now()->toISOString()
        ]);
    }
    
    public function exportMetricsPdf()
    {
        $metrics = $this->getMetricsData();
        
        // Aqui você pode usar uma biblioteca como DomPDF ou mPDF para gerar o PDF
        // Por exemplo, com DomPDF:
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('tickets.metrics-pdf', compact('metrics'));
        
        return $pdf->download('metricas-chamados-' . now()->format('Y-m-d') . '.pdf');
    }
    
    private function getMetricsData()
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $lastWeek = now()->subWeek()->startOfWeek();
        
        return [
            'today' => [
                'created' => Ticket::whereDate('created_at', $today)->count(),
                'resolved' => Ticket::whereDate('resolved_at', $today)->count(),
                'closed' => Ticket::whereDate('closed_at', $today)->count()
            ],
            'yesterday' => [
                'created' => Ticket::whereDate('created_at', $yesterday)->count(),
                'resolved' => Ticket::whereDate('resolved_at', $yesterday)->count(),
                'closed' => Ticket::whereDate('closed_at', $yesterday)->count()
            ],
            'week' => [
                'created' => Ticket::where('created_at', '>=', $thisWeek)->count(),
                'resolved' => Ticket::where('resolved_at', '>=', $thisWeek)->count(),
                'closed' => Ticket::where('closed_at', '>=', $thisWeek)->count()
            ],
            'last_week' => [
                'created' => Ticket::whereBetween('created_at', [$lastWeek, $thisWeek])->count(),
                'resolved' => Ticket::whereBetween('resolved_at', [$lastWeek, $thisWeek])->count(),
                'closed' => Ticket::whereBetween('closed_at', [$lastWeek, $thisWeek])->count()
            ],
            'priority_distribution' => [
                'high' => Ticket::where('priority', 'high')->where('status', '!=', 'closed')->count(),
                'medium' => Ticket::where('priority', 'medium')->where('status', '!=', 'closed')->count(),
                'low' => Ticket::where('priority', 'low')->where('status', '!=', 'closed')->count()
            ],
            'avg_resolution_time' => $this->getAverageResolutionTime(),
            'sla_compliance' => $this->getSLACompliance(),
            'generated_at' => now()->format('d/m/Y H:i:s')
        ];
    }
    
    public function getMetrics()
    {
        return response()->json($this->getMetricsData());
    }
    
    private function transformTicketsForJson($tickets)
    {
        if ($tickets instanceof \Illuminate\Support\Collection) {
            // Se for uma coleção simples de tickets
            return $tickets->map(function($ticket) {
                return $this->transformTicket($ticket);
            });
        } else {
            // Se for um array de status com tickets
            $transformed = [];
            foreach ($tickets as $status => $ticketCollection) {
                $transformed[$status] = $ticketCollection->map(function($ticket) {
                    return $this->transformTicket($ticket);
                });
            }
            return $transformed;
        }
    }
    
    private function transformTicket($ticket)
    {
        return [
            'id' => $ticket->id,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'status' => $ticket->status,
            'priority' => $ticket->priority,
            'created_at' => $ticket->created_at,
            'updated_at' => $ticket->updated_at,
            'due_date' => $ticket->due_date,
            'resolved_at' => $ticket->resolved_at,
            'closed_at' => $ticket->closed_at,
            'user' => $ticket->user,
            'category' => $ticket->category,
            'assigned_to' => $ticket->assignedTo
        ];
    }
    
    private function getAverageResolutionTime()
    {
        $avgHours = Ticket::whereNotNull('resolved_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
            ->value('avg_hours');
            
        return round($avgHours ?? 0, 1);
    }
    
    private function getSLACompliance()
    {
        $totalResolved = Ticket::whereNotNull('resolved_at')->count();
        $withinSLA = Ticket::whereNotNull('resolved_at')
            ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, resolved_at) <= 24')
            ->count();
            
        return $totalResolved > 0 ? round(($withinSLA / $totalResolved) * 100, 1) : 0;
    }
    
    public function updateTicketStatus(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'status' => 'required|in:open,in_progress,resolved,closed'
        ]);
        
        try {
            $ticket = Ticket::findOrFail($request->ticket_id);
            $oldStatus = $ticket->status;
            
            $ticket->status = $request->status;
            
            // Se o ticket foi resolvido, marcar o tempo de resolução
            if ($request->status === 'resolved' && $oldStatus !== 'resolved') {
                $ticket->resolved_at = now();
            }
            
            // Se o ticket foi fechado, marcar o tempo de fechamento
            if ($request->status === 'closed' && $oldStatus !== 'closed') {
                $ticket->closed_at = now();
            }
            
            $ticket->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Status do ticket atualizado com sucesso',
                'ticket' => $this->transformTicket($ticket)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar status do ticket'
            ], 500);
        }
    }
    
    public function getDashboardData()
    {
        try {
            // Contadores básicos
            $totalTickets = Ticket::count();
            $openTickets = Ticket::where('status', 'open')->count();
            $resolvedToday = Ticket::whereDate('resolved_at', today())->count();
            $avgResolutionTime = $this->getAverageResolutionTime();
            
            // Dados para gráficos
            $categories = Category::withCount(['tickets' => function($query) {
                $query->whereIn('status', ['open', 'in_progress']);
            }])->get()->map(function($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->tickets_count
                ];
            });
            
            $priorities = [
                'high' => Ticket::where('priority', 'high')
                    ->whereIn('status', ['open', 'in_progress'])->count(),
                'medium' => Ticket::where('priority', 'medium')
                    ->whereIn('status', ['open', 'in_progress'])->count(),
                'low' => Ticket::where('priority', 'low')
                    ->whereIn('status', ['open', 'in_progress'])->count(),
            ];
            
            // Tendências dos últimos 7 dias
            $trends = [
                'labels' => [],
                'created' => [],
                'resolved' => []
            ];
            
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $trends['labels'][] = $date->format('d/m');
                $trends['created'][] = Ticket::whereDate('created_at', $date)->count();
                $trends['resolved'][] = Ticket::whereDate('resolved_at', $date)->count();
            }
            
            // Desempenho dos atendentes
            $agentPerformance = User::withCount(['assignedTickets' => function($query) {
                $query->where('status', 'resolved')
                    ->whereBetween('resolved_at', [now()->subDays(30), now()]);
            }])->whereHas('assignedTickets')->get()->map(function($user) {
                $avgTime = Ticket::where('assigned_to', $user->id)
                    ->where('status', 'resolved')
                    ->whereBetween('resolved_at', [now()->subDays(30), now()])
                    ->whereNotNull('resolved_at')
                    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
                    ->value('avg_hours');
                    
                return [
                    'name' => $user->name,
                    'resolved' => $user->assigned_tickets_count,
                    'avg_time' => round($avgTime ?? 0, 1)
                ];
            })->sortByDesc('resolved')->take(10)->values();
            
            return response()->json([
                'total_tickets' => $totalTickets,
                'open_tickets' => $openTickets,
                'resolved_today' => $resolvedToday,
                'avg_resolution_time' => $avgResolutionTime,
                'categories' => $categories,
                'priorities' => $priorities,
                'trends' => $trends,
                'agent_performance' => $agentPerformance
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar dados do dashboard'
            ], 500);
        }
    }
    
    public function exportDashboardPdf()
    {
        try {
            $data = $this->getDashboardData()->getData();
            
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('tickets.dashboard-pdf', [
                'data' => $data,
                'generatedAt' => now()->format('d/m/Y H:i:s')
            ]);
            
            return $pdf->download('dashboard-executivo-' . now()->format('Y-m-d-H-i') . '.pdf');
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao gerar relatório PDF'
            ], 500);
        }
    }
}
