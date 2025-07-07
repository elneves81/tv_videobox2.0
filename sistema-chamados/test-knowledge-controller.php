<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\KnowledgeBaseController;
use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use App\Models\User;

echo "=== TESTE DO CONTROLLER KNOWLEDGE ===" . PHP_EOL;

try {
    $controller = new KnowledgeBaseController();
    
    echo "1. Testando método index..." . PHP_EOL;
    $response = $controller->index();
    echo "   ✓ Método index executado com sucesso" . PHP_EOL;
    
    echo "2. Testando método show..." . PHP_EOL;
    $article = KnowledgeArticle::first();
    if ($article) {
        $response = $controller->show($article);
        echo "   ✓ Método show executado com sucesso" . PHP_EOL;
    } else {
        echo "   ✗ Nenhum artigo encontrado" . PHP_EOL;
    }
    
    echo "3. Testando método category..." . PHP_EOL;
    $category = KnowledgeCategory::first();
    if ($category) {
        $response = $controller->category($category);
        echo "   ✓ Método category executado com sucesso" . PHP_EOL;
    } else {
        echo "   ✗ Nenhuma categoria encontrada" . PHP_EOL;
    }
    
    echo "4. Testando método search..." . PHP_EOL;
    $request = new \Illuminate\Http\Request(['q' => 'teste']);
    $response = $controller->search($request);
    echo "   ✓ Método search executado com sucesso" . PHP_EOL;
    
} catch (Exception $e) {
    echo "   ✗ ERRO: " . $e->getMessage() . PHP_EOL;
    echo "   Stack trace: " . $e->getTraceAsString() . PHP_EOL;
}

echo PHP_EOL . "=== FIM DO TESTE ===" . PHP_EOL;
