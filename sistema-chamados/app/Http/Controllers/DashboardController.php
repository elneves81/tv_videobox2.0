<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        
        // KPIs baseados no role do usuário
        $data = $this->getKPIs($user);
        
        // Gráficos e estatísticas
        $data['chartData'] = $this->getChartData($user);
        
        // Tickets recentes
        $data['recentTickets'] = $this->getRecentTickets($user);
        
        return view('dashboard.index', $data);
    }

    private function getKPIs($user)
    {
        $data = [];
        
        if ($user->role === 'customer') {
            // KPIs para cliente
            $data['totalTickets'] = Ticket::where('user_id', $user->id)->count();
            $data['openTickets'] = Ticket::where('user_id', $user->id)
                ->whereIn('status', ['open', 'in_progress'])->count();
            $data['resolvedTickets'] = Ticket::where('user_id', $user->id)
                ->where('status', 'resolved')->count();
            $data['avgResponseTime'] = $this->getAvgResponseTime($user->id);
            
        } elseif ($user->role === 'technician') {
            // KPIs para técnico
            $data['assignedTickets'] = Ticket::where('assigned_to', $user->id)->count();
            $data['openTickets'] = Ticket::where('assigned_to', $user->id)
                ->whereIn('status', ['open', 'in_progress'])->count();
            $data['resolvedThisMonth'] = Ticket::where('assigned_to', $user->id)
                ->where('status', 'resolved')
                ->whereMonth('updated_at', now()->month)->count();
            $data['avgResolutionTime'] = $this->getAvgResolutionTime($user->id);
            
        } else { // admin
            // KPIs para admin
            $data['totalTickets'] = Ticket::count();
            $data['openTickets'] = Ticket::whereIn('status', ['open', 'in_progress'])->count();
            $data['totalUsers'] = User::where('role', '!=', 'admin')->count();
            $data['totalCategories'] = Category::where('active', true)->count();
            $data['urgentTickets'] = Ticket::where('priority', 'urgent')
                ->whereIn('status', ['open', 'in_progress'])->count();
        }
        
        return $data;
    }

    private function getChartData($user)
    {
        $data = [];
        
        // Tickets por status
        if ($user->role === 'customer') {
            $statusData = Ticket::where('user_id', $user->id)
                ->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status');
        } elseif ($user->role === 'technician') {
            $statusData = Ticket::where('assigned_to', $user->id)
                ->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status');
        } else {
            $statusData = Ticket::select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status');
        }
        
        $data['statusChart'] = [
            'labels' => $statusData->keys()->map(function($status) {
                return ucfirst(str_replace('_', ' ', $status));
            }),
            'data' => $statusData->values()
        ];
        
        // Tickets por prioridade
        if ($user->role === 'admin') {
            $priorityData = Ticket::select('priority', DB::raw('count(*) as total'))
                ->groupBy('priority')
                ->pluck('total', 'priority');
                
            $data['priorityChart'] = [
                'labels' => $priorityData->keys()->map(function($priority) {
                    return ucfirst($priority);
                }),
                'data' => $priorityData->values()
            ];
        }
        
        // Tickets criados nos últimos 7 dias
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = Ticket::whereDate('created_at', $date);
            
            if ($user->role === 'customer') {
                $count = $count->where('user_id', $user->id);
            } elseif ($user->role === 'technician') {
                $count = $count->where('assigned_to', $user->id);
            }
            
            $last7Days[$date] = $count->count();
        }
        
        $data['weeklyChart'] = [
            'labels' => array_keys($last7Days),
            'data' => array_values($last7Days)
        ];
        
        return $data;
    }

    private function getRecentTickets($user)
    {
        $query = Ticket::with(['user', 'category', 'assignedUser'])
            ->orderBy('created_at', 'desc')
            ->limit(5);
            
        if ($user->role === 'customer') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'technician') {
            $query->where('assigned_to', $user->id);
        }
        
        return $query->get();
    }

    private function getAvgResponseTime($userId)
    {
        // Tempo médio de primeira resposta (em horas)
        $avg = Ticket::where('user_id', $userId)
            ->whereNotNull('assigned_to')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_hours')
            ->value('avg_hours');
            
        return $avg ? round($avg, 1) : 0;
    }

    private function getAvgResolutionTime($technicianId)
    {
        // Tempo médio de resolução (em horas)
        $avg = Ticket::where('assigned_to', $technicianId)
            ->where('status', 'resolved')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_hours')
            ->value('avg_hours');
            
        return $avg ? round($avg, 1) : 0;
    }

    /**
     * Painel de monitoramento em tempo real
     */
    public function monitoring()
    {
        // Verificar se é admin
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $data = [
            'totalTickets' => Ticket::count(),
            'openTickets' => Ticket::where('status', 'open')->count(),
            'urgentTickets' => Ticket::where('priority', 'urgent')->count(),
            'overdueTickets' => Ticket::whereDate('due_date', '<', now())
                                   ->whereNotIn('status', ['resolved', 'closed'])
                                   ->count(),
            'totalUsers' => User::count(),
            'onlineUsers' => User::where('updated_at', '>', now()->subMinutes(5))->count(),
        ];

        return view('admin.monitoring', compact('data'));
    }

    /**
     * API para dados em tempo real
     */
    public function realtimeTickets()
    {
        // Verificar se é admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $lastTicketId = request('last_ticket_id', 0);
        
        // Buscar novos tickets
        $newTickets = Ticket::with(['user', 'category'])
                           ->where('id', '>', $lastTicketId)
                           ->orderBy('created_at', 'desc')
                           ->get();

        $data = [
            'new_tickets' => $newTickets->map(function($ticket) {
                return [
                    'id' => $ticket->id,
                    'title' => $ticket->title,
                    'user_name' => $ticket->user->name,
                    'category' => $ticket->category->name,
                    'priority' => $ticket->priority,
                    'priority_label' => $ticket->priority_label,
                    'status' => $ticket->status,
                    'status_label' => $ticket->status_label,
                    'created_at' => $ticket->created_at->format('d/m/Y H:i'),
                    'url' => route('tickets.show', $ticket)
                ];
            }),
            'stats' => [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'open')->count(),
                'urgent' => Ticket::where('priority', 'urgent')->count(),
                'overdue' => Ticket::whereDate('due_date', '<', now())
                                  ->whereNotIn('status', ['resolved', 'closed'])
                                  ->count(),
            ],
            'last_ticket_id' => $newTickets->first()->id ?? $lastTicketId
        ];

        return response()->json($data);
    }
}
