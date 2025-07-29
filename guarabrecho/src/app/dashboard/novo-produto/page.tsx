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
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { GUARAPUAVA_NEIGHBORHOODS } from '@/lib/data/neighborhoods';
import { canCreateListing, canUploadImages, getUpgradeSuggestions } from '@/lib/plan-restrictions';
import { PlanLimitNotification } from '@/components/PlanLimitNotification';
import { CommissionSummary } from '@/components/CommissionCalculator';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export default function NovoAnuncioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showPlanLimitNotification, setShowPlanLimitNotification] = useState(false);
  const [planLimitMessage, setPlanLimitMessage] = useState('');

  // Para simulação, vamos considerar que o usuário tem plano FREE
  const userPlan: 'FREE' | 'PREMIUM' | 'PRO' = 'FREE';
  const userProductCount = 2; // Simula que o usuário já tem 2 produtos

  // Mock user objects for plan validation
  const mockUser = {
    id: 'mock-user-id',
    currentPlan: userPlan,
    planExpiresAt: null
  };

  const mockUserWithProducts = {
    ...mockUser,
    products: Array.from({ length: userProductCount }, (_, i) => ({ id: `product-${i}` }))
  };

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

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Define o tamanho máximo
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        // Calcula as novas dimensões mantendo a proporção
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
        
        // Desenha a imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converte para base64 com qualidade reduzida
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Verificar restrições do plano
    const canUpload = canUploadImages(mockUser, images.length, files.length);
    if (!canUpload.allowed) {
      setPlanLimitMessage(canUpload.reason || 'Limite de imagens atingido');
      setShowPlanLimitNotification(true);
      return;
    }

    if (images.length + files.length > 5) {
      setError('Máximo de 5 imagens permitidas');
      return;
    }

    setError('');
    const newImages: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Cada imagem deve ter no máximo 5MB');
        return;
      }

      try {
        const compressedImage = await compressImage(file);
        newImages.push(compressedImage);
      } catch (error) {
        console.error('Erro ao comprimir imagem:', error);
        setError('Erro ao processar imagem');
        return;
      }
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o usuário pode criar novos anúncios
    const canCreate = canCreateListing(mockUserWithProducts);
    if (!canCreate.allowed) {
      setPlanLimitMessage(canCreate.reason || 'Limite de anúncios atingido');
      setShowPlanLimitNotification(true);
      return;
    }
    
    if (!formData.title || !formData.description || !formData.categoryId || !formData.neighborhood) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.type === 'VENDA' && !formData.price) {
      setError('Por favor, informe o preço para vendas');
      return;
    }

    if (images.length === 0) {
      setError('Por favor, adicione pelo menos uma imagem');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: formData.type === 'DOACAO' ? 0 : parseFloat(formData.price) || 0,
        images: images.join(',')
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const product = await response.json();
        setSuccess('Anúncio criado com sucesso!');
        
        // Redirecionar para o dashboard após sucesso
        setTimeout(() => {
          router.push('/dashboard/vendedor');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar anúncio');
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard/vendedor"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar ao Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Anúncio</h1>
          <p className="text-gray-600 mt-2">
            Adicione as informações do seu produto para criar um novo anúncio
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: iPhone 12 Pro Max 256GB"
                  maxLength={100}
                />
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva o produto, suas condições, características especiais..."
                  maxLength={1000}
                />
              </div>

              {/* Categoria e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="h-4 w-4 inline mr-1" />
                    Categoria *
                  </label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Transação *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="VENDA">Venda</option>
                    <option value="TROCA">Troca</option>
                    <option value="DOACAO">Doação</option>
                  </select>
                </div>
              </div>

              {/* Preço e Condição */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                    Preço {formData.type !== 'DOACAO' && '*'}
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    disabled={formData.type === 'DOACAO'}
                  />
                  
                  {/* Calculadora de Comissão */}
                  {formData.type === 'VENDA' && formData.price && parseFloat(formData.price) > 0 && (
                    <div className="mt-3">
                      <CommissionSummary price={parseFloat(formData.price)} />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Condição *
                  </label>
                  <select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione a condição</option>
                    <option value="NOVO">Novo</option>
                    <option value="SEMINOVO">Seminovo</option>
                    <option value="USADO">Usado</option>
                    <option value="PARA_REPARO">Para Reparo</option>
                  </select>
                </div>
              </div>

              {/* Bairro */}
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Bairro *
                </label>
                <select
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o bairro</option>
                  {GUARAPUAVA_NEIGHBORHOODS.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload de Imagens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PhotoIcon className="h-4 w-4 inline mr-1" />
                  Fotos do Produto * (máximo 5)
                </label>
                
                {/* Preview das imagens */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input de upload */}
                {images.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Clique para adicionar fotos
                      </span>
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      PNG, JPG até 5MB cada (máximo 5 fotos)
                    </p>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Link
                  href="/dashboard/vendedor"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {isLoading ? 'Criando Anúncio...' : 'Criar Anúncio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Notificação de Limite do Plano */}
      {showPlanLimitNotification && (
        <PlanLimitNotification
          message={planLimitMessage}
          suggestions={['Fazer upgrade para PREMIUM', 'Remover anúncios antigos']}
          onClose={() => setShowPlanLimitNotification(false)}
        />
      )}
    </div>
  );
}
