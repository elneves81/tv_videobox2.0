<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Events\TicketCreated;
use App\Events\TicketUpdated;

class NotificationController extends Controller
{
    public function subscribeToNotifications(Request $request)
    {
        // Implementar Web Push Notifications
        $subscription = $request->validate([
            'endpoint' => 'required|string',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string'
        ]);
        
        // Salvar subscription no banco
        auth()->user()->updatePushSubscription(
            $subscription['endpoint'],
            $subscription['keys']['p256dh'],
            $subscription['keys']['auth']
        );
        
        return response()->json(['success' => true]);
    }
    
    public function sendNotification($ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);
        
        $payload = [
            'title' => 'Novo Ticket #' . $ticket->id,
            'body' => $ticket->title,
            'icon' => '/favicon.ico',
            'badge' => '/favicon.ico',
            'data' => [
                'ticket_id' => $ticket->id,
                'url' => route('tickets.show', $ticket->id)
            ]
        ];
        
        // Enviar para todos os usuários subscritos
        foreach (User::whereNotNull('push_subscription')->get() as $user) {
            $user->notify(new TicketNotification($payload));
        }
    }
}
