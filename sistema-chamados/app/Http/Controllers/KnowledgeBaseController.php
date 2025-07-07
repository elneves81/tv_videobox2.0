<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KnowledgeBaseController extends Controller
{
    public function index()
    {
        $categories = KnowledgeCategory::active()
            ->with(['publishedArticles' => function($query) {
                $query->take(3);
            }])
            ->ordered()
            ->get();
            
        $featuredArticles = KnowledgeArticle::published()
            ->public()
            ->featured()
            ->with(['category', 'author'])
            ->take(3)
            ->get();
            
        $popularArticles = KnowledgeArticle::published()
            ->public()
            ->popular()
            ->with(['category', 'author'])
            ->take(5)
            ->get();
            
        return view('knowledge.index', compact('categories', 'featuredArticles', 'popularArticles'));
    }

    public function category(KnowledgeCategory $category)
    {
        $articles = $category->publishedArticles()
            ->with(['author'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return view('knowledge.category', compact('category', 'articles'));
    }

    public function create()
    {
        $categories = KnowledgeCategory::active()->ordered()->get();
        return view('knowledge.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'category_id' => 'required|exists:knowledge_categories,id',
            'tags' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'is_public' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Processar tags
        if (!empty($validated['tags'])) {
            $tags = explode(',', $validated['tags']);
            $tags = array_map('trim', $tags);
            $validated['tags'] = $tags;
        } else {
            $validated['tags'] = [];
        }

        // Gerar excerpt se não fornecido
        if (empty($validated['excerpt'])) {
            $validated['excerpt'] = Str::limit(strip_tags($validated['content']), 200);
        }

        $validated['author_id'] = auth()->id();
        
        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $article = KnowledgeArticle::create($validated);

        return redirect()->route('knowledge.show', $article)
            ->with('success', 'Artigo criado com sucesso.');
    }

    public function show(KnowledgeArticle $article)
    {
        // Incrementar contador de visualizações
        $article->incrementViews();
        
        // Carregar relacionamentos
        $article->load('category', 'author');
        
        // Carregar artigos relacionados
        $relatedArticles = KnowledgeArticle::published()
            ->public()
            ->where('id', '!=', $article->id)
            ->where('category_id', $article->category_id)
            ->popular()
            ->take(3)
            ->get();
            
        return view('knowledge.show', compact('article', 'relatedArticles'));
    }

    public function edit(KnowledgeArticle $article)
    {
        $categories = KnowledgeCategory::active()->ordered()->get();
        
        // Formatar tags para exibição no formulário
        if ($article->tags) {
            $article->tags_string = implode(', ', $article->tags);
        }
        
        return view('knowledge.edit', compact('article', 'categories'));
    }

    public function update(Request $request, KnowledgeArticle $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'category_id' => 'required|exists:knowledge_categories,id',
            'tags' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'is_public' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Processar tags
        if (!empty($validated['tags'])) {
            $tags = explode(',', $validated['tags']);
            $tags = array_map('trim', $tags);
            $validated['tags'] = $tags;
        } else {
            $validated['tags'] = [];
        }

        // Gerar excerpt se não fornecido
        if (empty($validated['excerpt'])) {
            $validated['excerpt'] = Str::limit(strip_tags($validated['content']), 200);
        }

        // Definir published_at se mudou para published
        if ($validated['status'] === 'published' && $article->status !== 'published') {
            $validated['published_at'] = now();
        }

        $article->update($validated);

        return redirect()->route('knowledge.show', $article)
            ->with('success', 'Artigo atualizado com sucesso.');
    }

    public function destroy(KnowledgeArticle $article)
    {
        $article->delete();
        return redirect()->route('knowledge.index')
            ->with('success', 'Artigo excluído com sucesso.');
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $articles = KnowledgeArticle::published()
            ->public()
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('content', 'like', "%{$query}%")
                  ->orWhere('excerpt', 'like', "%{$query}%");
            })
            ->with(['category', 'author'])
            ->orderBy('views', 'desc')
            ->paginate(10);
            
        return view('knowledge.search', compact('articles', 'query'));
    }
}
