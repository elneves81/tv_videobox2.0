<?php

use App\Models\User;
use App\Models\Category;
use App\Models\Ticket;

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$priorities = ['low', 'medium', 'high', 'urgent'];
$statuses = ['open', 'in_progress', 'waiting', 'resolved', 'closed'];

$user = User::first();
$category = Category::first();

foreach ($priorities as $priority) {
    try {
        $ticket = Ticket::create([
            'title' => "Teste Priority {$priority}",
            'description' => "Testando prioridade {$priority}",
            'user_id' => $user->id,
            'category_id' => $category->id,
            'priority' => $priority,
            'status' => 'open'
        ]);
        
        echo "✅ Ticket criado - Priority: {$priority}, ID: {$ticket->id}\n";
    } catch (Exception $e) {
        echo "❌ Erro na priority {$priority}: {$e->getMessage()}\n";
    }
}

foreach ($statuses as $status) {
    try {
        $ticket = Ticket::create([
            'title' => "Teste Status {$status}",
            'description' => "Testando status {$status}",
            'user_id' => $user->id,
            'category_id' => $category->id,
            'priority' => 'medium',
            'status' => $status
        ]);
        
        echo "✅ Ticket criado - Status: {$status}, ID: {$ticket->id}\n";
    } catch (Exception $e) {
        echo "❌ Erro no status {$status}: {$e->getMessage()}\n";
    }
}

echo "\n🎉 Todos os testes concluídos!\n";
