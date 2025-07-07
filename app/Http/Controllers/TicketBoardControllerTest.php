<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketBoardControllerTest extends Controller
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
}
