<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\KnowledgeBaseController;
use App\Models\KnowledgeArticle;

echo "=== DEBUG DO ERRO DE ROTA ===" . PHP_EOL;

try {
    echo "1. Buscando artigo por slug..." . PHP_EOL;
    $article = KnowledgeArticle::where('slug', 'como-resolver-problemas-de-impressora')->first();
    
    if (!$article) {
        echo "   ✗ Artigo não encontrado por slug!" . PHP_EOL;
        exit;
    }
    
    echo "   ✓ Artigo encontrado: ID {$article->id}" . PHP_EOL;
    
    echo "2. Testando controller show..." . PHP_EOL;
    $controller = new KnowledgeBaseController();
    $response = $controller->show($article);
    
    echo "   ✓ Controller show executado com sucesso" . PHP_EOL;
    
    echo "3. Testando model binding..." . PHP_EOL;
    
    // Simular o model binding do Laravel
    $routeKeyName = $article->getRouteKeyName();
    echo "   Route key name: $routeKeyName" . PHP_EOL;
    
    // Tentar encontrar usando o route key name
    $found = KnowledgeArticle::where($routeKeyName, 'como-resolver-problemas-de-impressora')->first();
    
    if ($found) {
        echo "   ✓ Model binding funcionando" . PHP_EOL;
    } else {
        echo "   ✗ Model binding falhou!" . PHP_EOL;
    }
    
} catch (Exception $e) {
    echo "   ✗ ERRO: " . $e->getMessage() . PHP_EOL;
    echo "   Arquivo: " . $e->getFile() . ":" . $e->getLine() . PHP_EOL;
    echo "   Stack trace: " . $e->getTraceAsString() . PHP_EOL;
}

echo PHP_EOL . "=== FIM DO DEBUG ===" . PHP_EOL;
