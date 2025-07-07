<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketBoardController extends Controller
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
        
        // Organizar tickets por status
        $ticketsByStatus = [
            'open' => $tickets->where('status', 'open'),
            'in_progress' => $tickets->where('status', 'in_progress'),
            'resolved' => $tickets->where('status', 'resolved'),
            'closed' => $tickets->where('status', 'closed'),
        ];
        
        return view('tickets.board-tv', compact('ticketsByStatus'));
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
}
