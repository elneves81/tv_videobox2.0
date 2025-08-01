@extends('layouts.app')

@section('title', 'Novo Ativo')

@section('content')
<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-0 text-gray-800">
                <i class="fas fa-plus text-primary me-2"></i>
                Novo Ativo
            </h1>
            <nav aria-label="breadcrumb" class="mt-2">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="{{ route('admin.assets.index') }}">Ativos</a></li>
                    <li class="breadcrumb-item active">Novo</li>
                </ol>
            </nav>
        </div>
        <div>
            <a href="{{ route('admin.assets.index') }}" class="btn btn-secondary">
                <i class="fas fa-arrow-left me-1"></i>
                Voltar
            </a>
        </div>
    </div>

    <div class="row justify-content-center">
        <div class="col-lg-10">
            <form action="{{ route('admin.assets.store') }}" method="POST" enctype="multipart/form-data" id="assetForm">
                @csrf
                
                <!-- Informações Básicas -->
                <div class="card shadow mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-info-circle me-2"></i>
                            Informações Básicas
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="asset_tag" class="form-label required">Patrimônio</label>
                                    <input type="text" 
                                           class="form-control @error('asset_tag') is-invalid @enderror" 
                                           id="asset_tag" 
                                           name="asset_tag" 
                                           value="{{ old('asset_tag') }}" 
                                           required
                                           placeholder="Ex: PC001, NB002">
                                    @error('asset_tag')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <small class="text-muted">Identificação única do ativo</small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="name" class="form-label required">Nome do Ativo</label>
                                    <input type="text" 
                                           class="form-control @error('name') is-invalid @enderror" 
                                           id="name" 
                                           name="name" 
                                           value="{{ old('name') }}" 
                                           required
                                           placeholder="Ex: Notebook Dell Inspiron">
                                    @error('name')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="asset_type_id" class="form-label required">Tipo de Ativo</label>
                                    <select class="form-select @error('asset_type_id') is-invalid @enderror" 
                                            id="asset_type_id" 
                                            name="asset_type_id" 
                                            required>
                                        <option value="">Selecione um tipo</option>
                                        @foreach($assetTypes as $type)
                                            <option value="{{ $type->id }}" {{ old('asset_type_id') == $type->id ? 'selected' : '' }}>
                                                {{ $type->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('asset_type_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="manufacturer_id" class="form-label required">Fabricante</label>
                                    <select class="form-select @error('manufacturer_id') is-invalid @enderror" 
                                            id="manufacturer_id" 
                                            name="manufacturer_id" 
                                            required>
                                        <option value="">Selecione um fabricante</option>
                                        @foreach($manufacturers as $manufacturer)
                                            <option value="{{ $manufacturer->id }}" {{ old('manufacturer_id') == $manufacturer->id ? 'selected' : '' }}>
                                                {{ $manufacturer->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('manufacturer_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="status" class="form-label required">Status</label>
                                    <select class="form-select @error('status') is-invalid @enderror" 
                                            id="status" 
                                            name="status" 
                                            required>
                                        <option value="">Selecione um status</option>
                                        <option value="inactive" {{ old('status') == 'inactive' ? 'selected' : '' }}>Disponível</option>
                                        <option value="active" {{ old('status') == 'active' ? 'selected' : '' }}>Ativo</option>
                                        <option value="maintenance" {{ old('status') == 'maintenance' ? 'selected' : '' }}>Manutenção</option>
                                        <option value="retired" {{ old('status') == 'retired' ? 'selected' : '' }}>Descartado</option>
                                    </select>
                                    @error('status')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="model" class="form-label">Modelo</label>
                                    <input type="text" 
                                           class="form-control @error('model') is-invalid @enderror" 
                                           id="model" 
                                           name="model" 
                                           value="{{ old('model') }}"
                                           placeholder="Ex: Inspiron 15 3000">
                                    @error('model')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="serial_number" class="form-label">Número de Série</label>
                                    <input type="text" 
                                           class="form-control @error('serial_number') is-invalid @enderror" 
                                           id="serial_number" 
                                           name="serial_number" 
                                           value="{{ old('serial_number') }}"
                                           placeholder="Ex: ABC123456789">
                                    @error('serial_number')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Localização e Atribuição -->
                <div class="card shadow mb-4">
                    <div class="card-header bg-info text-white">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-map-marker-alt me-2"></i>
                            Localização e Atribuição
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="location_id" class="form-label">Localização</label>
                                    <select class="form-select @error('location_id') is-invalid @enderror" 
                                            id="location_id" 
                                            name="location_id">
                                        <option value="">Selecione uma localização</option>
                                        @foreach($locations as $location)
                                            <option value="{{ $location->id }}" {{ old('location_id') == $location->id ? 'selected' : '' }}>
                                                {{ $location->name }} - {{ $location->address }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('location_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="assigned_to" class="form-label">Atribuído a</label>
                                    <select class="form-select @error('assigned_to') is-invalid @enderror" 
                                            id="assigned_to" 
                                            name="assigned_to">
                                        <option value="">Não atribuído</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('assigned_to') == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} - {{ $user->email }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('assigned_to')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Especificações Técnicas -->
                <div class="card shadow mb-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-cogs me-2"></i>
                            Especificações Técnicas
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="specifications" class="form-label">Especificações</label>
                            <textarea class="form-control @error('specifications') is-invalid @enderror" 
                                      id="specifications" 
                                      name="specifications" 
                                      rows="4"
                                      placeholder="Ex: Processador Intel i5, 8GB RAM, SSD 256GB, Windows 11">{{ old('specifications') }}</textarea>
                            @error('specifications')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Informações Financeiras -->
                <div class="card shadow mb-4">
                    <div class="card-header bg-warning text-white">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-dollar-sign me-2"></i>
                            Informações Financeiras
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="purchase_date" class="form-label">Data de Compra</label>
                                    <input type="date" 
                                           class="form-control @error('purchase_date') is-invalid @enderror" 
                                           id="purchase_date" 
                                           name="purchase_date" 
                                           value="{{ old('purchase_date') }}">
                                    @error('purchase_date')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="purchase_cost" class="form-label">Valor de Compra</label>
                                    <div class="input-group">
                                        <span class="input-group-text">R$</span>
                                        <input type="number" 
                                               class="form-control @error('purchase_cost') is-invalid @enderror" 
                                               id="purchase_cost" 
                                               name="purchase_cost" 
                                               value="{{ old('purchase_cost') }}"
                                               step="0.01"
                                               placeholder="0,00">
                                    </div>
                                    @error('purchase_cost')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="warranty_end" class="form-label">Garantia até</label>
                                    <input type="date" 
                                           class="form-control @error('warranty_end') is-invalid @enderror" 
                                           id="warranty_end" 
                                           name="warranty_end" 
                                           value="{{ old('warranty_end') }}">
                                    @error('warranty_end')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Imagem e Observações -->
                <div class="card shadow mb-4">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-image me-2"></i>
                            Imagem e Observações
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="image" class="form-label">Imagem do Ativo</label>
                                    <input type="file" 
                                           class="form-control @error('image') is-invalid @enderror" 
                                           id="image" 
                                           name="image" 
                                           accept="image/*">
                                    @error('image')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <small class="text-muted">Formatos aceitos: JPG, PNG, GIF. Máximo: 2MB</small>
                                    
                                    <!-- Preview da imagem -->
                                    <div id="imagePreview" class="mt-3" style="display: none;">
                                        <img id="preview" src="" alt="Preview" class="img-thumbnail" style="max-width: 200px;">
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="notes" class="form-label">Observações</label>
                                    <textarea class="form-control @error('notes') is-invalid @enderror" 
                                              id="notes" 
                                              name="notes" 
                                              rows="4"
                                              placeholder="Informações adicionais sobre o ativo">{{ old('notes') }}</textarea>
                                    @error('notes')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botões de Ação -->
                <div class="card shadow">
                    <div class="card-body">
                        <div class="d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-outline-secondary" onclick="window.history.back()">
                                <i class="fas fa-times me-1"></i>
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary" id="submitBtn">
                                <i class="fas fa-save me-1"></i>
                                Salvar Ativo
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
.required::after {
    content: " *";
    color: red;
}

.card {
    border: none;
    border-radius: 10px;
}

.card-header {
    border-radius: 10px 10px 0 0 !important;
}

.form-control:focus, .form-select:focus {
    border-color: #4e73df;
    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

.btn {
    border-radius: 5px;
    font-weight: 500;
}

.breadcrumb {
    background: none;
    padding: 0;
}

.breadcrumb-item a {
    color: #6c757d;
    text-decoration: none;
}

.breadcrumb-item a:hover {
    color: #4e73df;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assetForm');
    const submitBtn = document.getElementById('submitBtn');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    const preview = document.getElementById('preview');
    
    // Preview da imagem
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    });
    
    // Loading no submit
    form.addEventListener('submit', function() {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Salvando...';
        submitBtn.disabled = true;
    });

    // Auto-preenchimento quando o status for alterado para "ativo"
    const statusSelect = document.getElementById('status');
    const assignedSelect = document.getElementById('assigned_to');
    
    statusSelect.addEventListener('change', function() {
        if (this.value === 'active' && assignedSelect.value === '') {
            // Sugerir atribuição quando o status for ativo
            assignedSelect.focus();
        }
    });

    // Calcular garantia automaticamente
    const purchaseDateInput = document.getElementById('purchase_date');
    const warrantyInput = document.getElementById('warranty_end');
    
    purchaseDateInput.addEventListener('change', function() {
        if (this.value && !warrantyInput.value) {
            // Adicionar 1 ano à data de compra como padrão
            const purchaseDate = new Date(this.value);
            purchaseDate.setFullYear(purchaseDate.getFullYear() + 1);
            warrantyInput.value = purchaseDate.toISOString().split('T')[0];
        }
    });
});
</script>
@endsection
