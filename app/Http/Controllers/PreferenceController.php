<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserPreference;

class PreferenceController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $preferences = $user->preferences;
        
        // Definir preferências padrão se não existirem
        if (!$preferences) {
            $preferences = new UserPreference([
                'user_id' => $user->id,
                'theme' => 'light',
                'sidebar_collapsed' => false,
                'notifications_enabled' => true,
                'email_notifications' => true,
                'language' => 'pt-BR',
                'items_per_page' => 10,
                'dashboard_widgets' => json_encode([
                    'recent_tickets' => true,
                    'tickets_by_status' => true,
                    'tickets_by_priority' => true,
                    'overdue_tickets' => true,
                    'assets_status' => true
                ])
            ]);
            $preferences->save();
        }
        
        return view('preferences.edit', compact('preferences'));
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $preferences = $user->preferences;

        if (!$preferences) {
            $preferences = new UserPreference([
                'user_id' => $user->id
            ]);
        }

        $validated = $request->validate([
            'theme' => 'required|string|in:light,dark,auto',
            'sidebar_collapsed' => 'boolean',
            'notifications_enabled' => 'boolean',
            'email_notifications' => 'boolean',
            'language' => 'required|string|in:pt-BR,en-US,es-ES',
            'items_per_page' => 'required|integer|min:5|max:100',
        ]);

        // Atualizar preferências do usuário
        $preferences->theme = $validated['theme'];
        $preferences->sidebar_collapsed = $validated['sidebar_collapsed'] ?? false;
        $preferences->notifications_enabled = $validated['notifications_enabled'] ?? false;
        $preferences->email_notifications = $validated['email_notifications'] ?? false;
        $preferences->language = $validated['language'];
        $preferences->items_per_page = $validated['items_per_page'];

        // Processar preferências dos widgets do dashboard
        $dashboardWidgets = [];
        foreach (['recent_tickets', 'tickets_by_status', 'tickets_by_priority', 'overdue_tickets', 'assets_status'] as $widget) {
            $dashboardWidgets[$widget] = $request->has("widget_$widget");
        }
        $preferences->dashboard_widgets = json_encode($dashboardWidgets);

        $preferences->save();

        return redirect()->route('preferences.edit')
            ->with('success', 'Preferências atualizadas com sucesso.');
    }
}
