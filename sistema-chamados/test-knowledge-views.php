<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;

echo "=== TESTE DAS VIEWS KNOWLEDGE ===" . PHP_EOL;

// Teste das views
$views = [
    'knowledge.index',
    'knowledge.show',
    'knowledge.category',
    'knowledge.search',
    'knowledge.create',
    'knowledge.edit'
];

foreach ($views as $view) {
    echo "Testando view: $view" . PHP_EOL;
    try {
        if (view()->exists($view)) {
            echo "   ✓ View $view existe" . PHP_EOL;
        } else {
            echo "   ✗ View $view NÃO existe" . PHP_EOL;
        }
    } catch (Exception $e) {
        echo "   ✗ ERRO ao verificar view $view: " . $e->getMessage() . PHP_EOL;
    }
}

echo PHP_EOL . "=== FIM DO TESTE ===" . PHP_EOL;
