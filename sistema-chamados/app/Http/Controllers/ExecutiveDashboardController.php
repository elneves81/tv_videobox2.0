<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExecutiveDashboardController extends Controller
{
    public function index()
    {
        $data = [
            'kpis' => $this->getKPIs(),
            'trends' => $this->getTrends(),
            'performance' => $this->getPerformanceMetrics(),
            'sla_compliance' => $this->getSLACompliance()
        ];
        
        return view('dashboard.executive', $data);
    }
    
    private function getKPIs()
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        
        return [
            'total_tickets' => [
                'value' => Ticket::count(),
                'change' => $this->getPercentageChange(
                    Ticket::whereDate('created_at', $today)->count(),
                    Ticket::whereDate('created_at', $yesterday)->count()
                )
            ],
            'open_tickets' => [
                'value' => Ticket::where('status', 'open')->count(),
                'critical' => Ticket::where('status', 'open')->where('priority', 'high')->count()
            ],
            'avg_resolution_time' => [
                'value' => $this->getAverageResolutionTime(),
                'target' => 24 // horas
            ],
            'first_response_time' => [
                'value' => $this->getAverageFirstResponseTime(),
                'target' => 2 // horas
            ]
        ];
    }
    
    private function getTrends()
    {
        $last30Days = collect(range(0, 29))->map(function ($days) {
            $date = Carbon::now()->subDays($days);
            return [
                'date' => $date->format('Y-m-d'),
                'created' => Ticket::whereDate('created_at', $date)->count(),
                'resolved' => Ticket::whereDate('resolved_at', $date)->count()
            ];
        })->reverse()->values();
        
        return $last30Days;
    }
    
    private function getPerformanceMetrics()
    {
        return [
            'by_agent' => User::withCount(['assignedTickets', 'resolvedTickets'])
                ->having('assigned_tickets_count', '>', 0)
                ->orderBy('resolved_tickets_count', 'desc')
                ->take(10)
                ->get(),
            'by_category' => Ticket::selectRaw('category_id, count(*) as total')
                ->with('category')
                ->groupBy('category_id')
                ->orderBy('total', 'desc')
                ->get()
        ];
    }
    
    private function getSLACompliance()
    {
        $totalTickets = Ticket::whereNotNull('resolved_at')->count();
        $slaCompliant = Ticket::whereNotNull('resolved_at')
            ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, resolved_at) <= 24')
            ->count();
            
        return [
            'percentage' => $totalTickets > 0 ? round(($slaCompliant / $totalTickets) * 100, 2) : 0,
            'total' => $totalTickets,
            'compliant' => $slaCompliant,
            'breached' => $totalTickets - $slaCompliant
        ];
    }
    
    private function getAverageResolutionTime()
    {
        return Ticket::whereNotNull('resolved_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
            ->value('avg_hours') ?? 0;
    }
    
    private function getAverageFirstResponseTime()
    {
        // Implementar baseado nos comentários dos tickets
        return 1.5; // placeholder
    }
    
    private function getPercentageChange($current, $previous)
    {
        if ($previous == 0) return $current > 0 ? 100 : 0;
        return round((($current - $previous) / $previous) * 100, 2);
    }
}
