'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PhotoIcon,
  XMarkIcon,
  MapPinIcon,
  TagIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { GUARAPUAVA_NEIGHBORHOODS, searchNeighborhoods } from '@/lib/data/neighborhoods';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export default function AnunciarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [showNeighborhoodSuggestions, setShowNeighborhoodSuggestions] = useState(false);
  const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    type: '',
    categoryId: '',
    neighborhood: '',
    images: [] as string[]
  });

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          // Fallback categories if API fails
          const fallbackCategories: Category[] = [
            { id: 'roupas', name: 'Roupas e Acessórios', slug: 'roupas' },
            { id: 'eletronicos', name: 'Eletrônicos', slug: 'eletronicos' },
            { id: 'moveis', name: 'Móveis e Decoração', slug: 'moveis' },
            { id: 'livros', name: 'Livros e Material Escolar', slug: 'livros' },
            { id: 'esportes', name: 'Esportes e Lazer', slug: 'esportes' },
            { id: 'casa', name: 'Casa e Jardim', slug: 'casa' },
            { id: 'bebes', name: 'Bebês e Crianças', slug: 'bebes' },
            { id: 'veiculos', name: 'Veículos e Peças', slug: 'veiculos' },
          ];
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Use fallback categories on error
        const fallbackCategories: Category[] = [
          { id: 'roupas', name: 'Roupas e Acessórios', slug: 'roupas' },
          { id: 'eletronicos', name: 'Eletrônicos', slug: 'eletronicos' },
          { id: 'moveis', name: 'Móveis e Decoração', slug: 'moveis' },
          { id: 'livros', name: 'Livros e Material Escolar', slug: 'livros' },
          { id: 'esportes', name: 'Esportes e Lazer', slug: 'esportes' },
          { id: 'casa', name: 'Casa e Jardim', slug: 'casa' },
          { id: 'bebes', name: 'Bebês e Crianças', slug: 'bebes' },
          { id: 'veiculos', name: 'Veículos e Peças', slug: 'veiculos' },
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Sincronizar neighborhoodSearch com formData.neighborhood
  useEffect(() => {
    setNeighborhoodSearch(formData.neighborhood);
  }, [formData.neighborhood]);

  const conditions = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'SEMINOVO', label: 'Seminovo' },
    { value: 'USADO', label: 'Usado' },
    { value: 'PARA_REPARO', label: 'Para Reparo' },
  ];

  const types = [
    { value: 'VENDA', label: 'Venda', icon: '💰' },
    { value: 'TROCA', label: 'Troca', icon: '🔄' },
    { value: 'DOACAO', label: 'Doação', icon: '❤️' },
  ];

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Login Necessário
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para criar um anúncio.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/anunciar"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo aspect ratio - tamanhos menores
        const maxWidth = 600;
        const maxHeight = 400;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converter para base64 com qualidade mais baixa e ajuste progressivo
        let quality = 0.5;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Se o resultado for muito grande (>400KB), reduzir qualidade progressivamente
        while (compressedDataUrl.length > 500000 && quality > 0.1) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const compressedImageUrl = await compressImage(file);
          setImages(prev => [...prev, compressedImageUrl]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, compressedImageUrl]
          }));
        } catch (error) {
          console.warn('Erro ao processar imagem:', error instanceof Error ? error.message : 'Erro desconhecido');
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: images.join(',') // Convert array to comma-separated string for SQLite
        }),
      });

      if (response.ok) {
        setSuccess('Anúncio criado com sucesso!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          condition: '',
          type: '',
          categoryId: '',
          neighborhood: '',
          images: []
        });
        setImages([]);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao criar anúncio');
      }
    } catch (error) {
      setError('Erro ao criar anúncio. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                GuaraBrechó
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <span className="text-gray-700">Olá, {session.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Criar Novo Anúncio
            </h1>
            <p className="text-gray-600 mt-1">
              Preencha as informações do seu produto para criar um anúncio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título do Anúncio *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: iPhone 13 em ótimo estado"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos do Produto
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Adicionar Fotos
                    </span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG até 10MB cada
                </p>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Descreva o produto, estado de conservação, motivo da venda, etc."
              />
            </div>

            {/* Type and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transação *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecione</option>
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço {formData.type === 'VENDA' ? '*' : '(opcional)'}
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required={formData.type === 'VENDA'}
                    disabled={formData.type === 'DOACAO'}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingCategories ? 'Carregando categorias...' : 'Selecione uma categoria'}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Conservação *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecione</option>
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                Bairro *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <div className="relative">
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    required
                    value={neighborhoodSearch}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNeighborhoodSearch(value);
                      setFormData(prev => ({ ...prev, neighborhood: value }));
                      
                      if (value.length > 0) {
                        const suggestions = searchNeighborhoods(value, 8);
                        setNeighborhoodSuggestions(suggestions);
                        setShowNeighborhoodSuggestions(true);
                      } else {
                        setShowNeighborhoodSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (neighborhoodSearch.length > 0) {
                        const suggestions = searchNeighborhoods(neighborhoodSearch, 8);
                        setNeighborhoodSuggestions(suggestions);
                        setShowNeighborhoodSuggestions(true);
                      } else {
                        setNeighborhoodSuggestions(GUARAPUAVA_NEIGHBORHOODS.slice(0, 8));
                        setShowNeighborhoodSuggestions(true);
                      }
                    }}
                    onBlur={(e) => {
                      // Delay para permitir click nas sugestões
                      setTimeout(() => setShowNeighborhoodSuggestions(false), 150);
                    }}
                    placeholder="Digite seu bairro em Guarapuava"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  
                  {/* Sugestões de bairros */}
                  {showNeighborhoodSuggestions && neighborhoodSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {neighborhoodSuggestions.map((neighborhood) => (
                        <button
                          key={neighborhood}
                          type="button"
                          onClick={() => {
                            setNeighborhoodSearch(neighborhood);
                            setFormData(prev => ({ ...prev, neighborhood }));
                            setShowNeighborhoodSuggestions(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-md last:rounded-b-md"
                        >
                          {neighborhood}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando...
                  </div>
                ) : (
                  'Criar Anúncio'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
