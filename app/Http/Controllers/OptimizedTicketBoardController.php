<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class OptimizedTicketBoardController extends TicketBoardController
{
    public function getAllTickets()
    {
        // Cache por 30 segundos
        $tickets = Cache::remember('tickets_board_data', 30, function () {
            return Ticket::with(['user', 'category', 'assignedTo'])
                ->orderBy('created_at', 'desc')
                ->get();
        });
        
        // Organizar tickets por status com cache separado
        $ticketsByStatus = Cache::remember('tickets_by_status', 30, function () use ($tickets) {
            return [
                'open' => $tickets->where('status', 'open')->values(),
                'in_progress' => $tickets->where('status', 'in_progress')->values(),
                'resolved' => $tickets->where('status', 'resolved')->values(),
                'closed' => $tickets->where('status', 'closed')->values(),
            ];
        });
        
        return response()->json([
            'tickets' => $this->transformTicketsForJson($ticketsByStatus),
            'last_check' => now()->toISOString(),
            'cached_at' => Cache::get('tickets_board_data_timestamp', now())
        ]);
    }
    
    public function invalidateCache()
    {
        Cache::forget('tickets_board_data');
        Cache::forget('tickets_by_status');
        
        // Notificar via WebSocket que o cache foi limpo
        Redis::publish('tickets-cache-cleared', json_encode([
            'event' => 'cache.cleared',
            'timestamp' => now()
        ]));
        
        return response()->json(['success' => true]);
    }
}
