<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use App\Models\User;

echo "=== VERIFICAÇÃO DA BASE DE CONHECIMENTO ===" . PHP_EOL;

echo PHP_EOL . "Usuários:" . PHP_EOL;
$users = User::all();
foreach ($users as $user) {
    echo "ID: {$user->id}, Nome: {$user->name}, Email: {$user->email}" . PHP_EOL;
}

echo PHP_EOL . "Categorias:" . PHP_EOL;
$categories = KnowledgeCategory::all();
foreach ($categories as $category) {
    echo "ID: {$category->id}, Nome: {$category->name}, Slug: " . ($category->slug ?? 'NULL') . PHP_EOL;
}

echo PHP_EOL . "Artigos:" . PHP_EOL;
$articles = KnowledgeArticle::with(['author', 'category'])->get();
foreach ($articles as $article) {
    echo "ID: {$article->id}, Título: {$article->title}, Slug: " . ($article->slug ?? 'NULL') . PHP_EOL;
    echo "   Autor: " . ($article->author ? $article->author->name : 'NULL') . PHP_EOL;
    echo "   Categoria: " . ($article->category ? $article->category->name : 'NULL') . PHP_EOL;
}

echo PHP_EOL . "Teste de rota model binding:" . PHP_EOL;
$firstArticle = KnowledgeArticle::first();
if ($firstArticle) {
    echo "Primeiro artigo - ID: {$firstArticle->id}, Slug: " . ($firstArticle->slug ?? 'NULL') . PHP_EOL;
    
    // Teste se consegue encontrar por slug
    if ($firstArticle->slug) {
        $found = KnowledgeArticle::where('slug', $firstArticle->slug)->first();
        echo "Encontrado por slug: " . ($found ? "SIM" : "NÃO") . PHP_EOL;
    }
}

echo PHP_EOL . "=== FIM DA VERIFICAÇÃO ===" . PHP_EOL;
