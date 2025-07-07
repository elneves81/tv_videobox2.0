<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Buscar o artigo
$article = \App\Models\KnowledgeArticle::where('slug', 'como-resolver-problemas-de-impressora')->first();

if ($article) {
    echo "Article found: " . $article->title . PHP_EOL;
    echo "Category ID: " . ($article->category_id ?? 'NULL') . PHP_EOL;
    
    if ($article->category_id) {
        // Verificar se a categoria existe
        $category = \App\Models\KnowledgeCategory::find($article->category_id);
        echo "Category exists: " . ($category ? 'YES' : 'NO') . PHP_EOL;
        if ($category) {
            echo "Category name: " . $category->name . PHP_EOL;
            echo "Category slug: " . $category->slug . PHP_EOL;
        }
    }
    
    // Tentar carregar via relationship
    $article->load('category');
    echo "Category via relationship: " . ($article->category ? $article->category->name : 'NULL') . PHP_EOL;
} else {
    echo "Article not found!" . PHP_EOL;
}
