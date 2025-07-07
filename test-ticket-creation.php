<?php

use App\Models\User;
use App\Models\Category;
use App\Models\Ticket;

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = User::first();
    $category = Category::first();
    
    $ticket = Ticket::create([
        'title' => 'Teste Priority Fix',
        'description' => 'Testando se o problema de priority foi resolvido',
        'user_id' => $user->id,
        'category_id' => $category->id,
        'priority' => 'medium',
        'status' => 'open'
    ]);
    
    echo "✅ Ticket criado com sucesso!\n";
    echo "ID: {$ticket->id}\n";
    echo "Title: {$ticket->title}\n";
    echo "Priority: {$ticket->priority}\n";
    echo "Status: {$ticket->status}\n";
    
} catch (Exception $e) {
    echo "❌ Erro ao criar ticket: {$e->getMessage()}\n";
}
