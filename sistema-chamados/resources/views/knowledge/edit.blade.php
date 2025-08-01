@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-3">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="{{ route('knowledge.index') }}">Base de Conhecimento</a></li>
                    <li class="breadcrumb-item"><a href="{{ route('knowledge.category', $article->category) }}">{{ $article->category->name }}</a></li>
                    <li class="breadcrumb-item"><a href="{{ route('knowledge.show', $article) }}">{{ $article->title }}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Editar</li>
                </ol>
            </nav>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-edit mr-2"></i>Editar Artigo
                    </h3>
                </div>

                <form action="{{ route('admin.knowledge.update', $article) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="card-body">
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <div class="row">
                            <div class="col-md-8">
                                <!-- Título -->
                                <div class="form-group">
                                    <label for="title">Título <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control @error('title') is-invalid @enderror" 
                                           id="title" name="title" value="{{ old('title', $article->title) }}" required>
                                    @error('title')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <!-- Resumo -->
                                <div class="form-group">
                                    <label for="excerpt">Resumo</label>
                                    <textarea class="form-control @error('excerpt') is-invalid @enderror" 
                                              id="excerpt" name="excerpt" rows="3" 
                                              placeholder="Resumo opcional do artigo">{{ old('excerpt', $article->excerpt) }}</textarea>
                                    @error('excerpt')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <small class="form-text text-muted">Se não preenchido, será gerado automaticamente.</small>
                                </div>

                                <!-- Conteúdo -->
                                <div class="form-group">
                                    <label for="content">Conteúdo <span class="text-danger">*</span></label>
                                    <textarea class="form-control @error('content') is-invalid @enderror" 
                                              id="content" name="content" rows="15" required>{{ old('content', $article->content) }}</textarea>
                                    @error('content')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <!-- Tags -->
                                <div class="form-group">
                                    <label for="tags">Tags</label>
                                    <input type="text" class="form-control @error('tags') is-invalid @enderror" 
                                           id="tags" name="tags" value="{{ old('tags', $article->tags_string ?? '') }}" 
                                           placeholder="Separe as tags com vírgula">
                                    @error('tags')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <small class="form-text text-muted">Exemplo: tutorial, windows, rede</small>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <!-- Categoria -->
                                <div class="form-group">
                                    <label for="category_id">Categoria <span class="text-danger">*</span></label>
                                    <select class="form-control @error('category_id') is-invalid @enderror" 
                                            id="category_id" name="category_id" required>
                                        <option value="">Selecione uma categoria</option>
                                        @foreach($categories as $category)
                                            <option value="{{ $category->id }}" 
                                                    {{ old('category_id', $article->category_id) == $category->id ? 'selected' : '' }}>
                                                {{ $category->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('category_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <!-- Status -->
                                <div class="form-group">
                                    <label for="status">Status <span class="text-danger">*</span></label>
                                    <select class="form-control @error('status') is-invalid @enderror" 
                                            id="status" name="status" required>
                                        <option value="draft" {{ old('status', $article->status) == 'draft' ? 'selected' : '' }}>
                                            Rascunho
                                        </option>
                                        <option value="published" {{ old('status', $article->status) == 'published' ? 'selected' : '' }}>
                                            Publicado
                                        </option>
                                    </select>
                                    @error('status')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <!-- Visibilidade -->
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" 
                                               id="is_public" name="is_public" value="1" 
                                               {{ old('is_public', $article->is_public) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="is_public">
                                            Artigo Público
                                        </label>
                                    </div>
                                    <small class="form-text text-muted">
                                        Artigos públicos ficam visíveis para todos os usuários.
                                    </small>
                                </div>

                                <!-- Destaque -->
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" 
                                               id="is_featured" name="is_featured" value="1" 
                                               {{ old('is_featured', $article->is_featured) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="is_featured">
                                            Artigo em Destaque
                                        </label>
                                    </div>
                                    <small class="form-text text-muted">
                                        Artigos em destaque aparecem na página inicial.
                                    </small>
                                </div>

                                <!-- Informações do Artigo -->
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="card-title">Informações do Artigo</h6>
                                        <small class="text-muted">
                                            <strong>Criado:</strong> {{ $article->created_at->format('d/m/Y H:i') }}<br>
                                            <strong>Modificado:</strong> {{ $article->updated_at->format('d/m/Y H:i') }}<br>
                                            <strong>Autor:</strong> {{ $article->author->name }}<br>
                                            <strong>Visualizações:</strong> {{ $article->views }}<br>
                                            @if($article->published_at)
                                                <strong>Publicado:</strong> {{ $article->published_at->format('d/m/Y H:i') }}
                                            @endif
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-2"></i>Salvar Alterações
                        </button>
                        <a href="{{ route('knowledge.show', $article) }}" class="btn btn-secondary">
                            <i class="fas fa-times mr-2"></i>Cancelar
                        </a>
                        <a href="{{ route('knowledge.index') }}" class="btn btn-outline-secondary">
                            <i class="fas fa-list mr-2"></i>Voltar à Lista
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
// Inicializar editor rico se disponível
if (typeof tinymce !== 'undefined') {
    tinymce.init({
        selector: '#content',
        height: 400,
        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste',
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview code',
        content_css: '//www.tiny.cloud/css/codepen.min.css'
    });
}
</script>
@endsection
