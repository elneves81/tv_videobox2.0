'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SafeImage, countValidImages } from '@/lib/safe-image';
import { 
  MapPinIcon, 
  TagIcon, 
  UserIcon, 
  ClockIcon,
  HeartIcon as HeartOutline,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Chat from '@/components/Chat';
import ReviewSystem from '@/components/ReviewSystem';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  condition: string;
  category: {
    id: string;
    name: string;
  };
  neighborhood: string;
  images: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params.id as string);
    }
  }, [params?.id]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!product) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          // Fechar modal se implementado no futuro
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  // Touch/Swipe support para mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (event: Event) => {
      const touchEvent = event as TouchEvent;
      touchStartX = touchEvent.changedTouches[0].screenX;
    };

    const handleTouchEnd = (event: Event) => {
      const touchEvent = event as TouchEvent;
      touchEndX = touchEvent.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50; // Mínimo de pixels para considerar swipe
      const diffX = touchStartX - touchEndX;

      if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
          // Swipe left -> próxima imagem
          nextImage();
        } else {
          // Swipe right -> imagem anterior
          prevImage();
        }
      }
    };

    // Adicionar listeners apenas na área da galeria
    const imageContainer = document.querySelector('.image-gallery-container');
    if (imageContainer) {
      imageContainer.addEventListener('touchstart', handleTouchStart);
      imageContainer.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (imageContainer) {
        imageContainer.removeEventListener('touchstart', handleTouchStart);
        imageContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [product]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const text = await response.text();
        if (text.trim() === '') {
          console.warn('Resposta vazia da API');
          router.push('/produtos');
          return;
        }
        try {
          const data = JSON.parse(text);
          setProduct(data);
        } catch (parseError) {
          console.warn('Erro ao fazer parse da resposta JSON');
          router.push('/produtos');
        }
      } else {
        console.warn(`Erro na resposta da API: ${response.status}`);
        router.push('/produtos');
      }
    } catch (error) {
      console.warn('Erro ao carregar produto');
      router.push('/produtos');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTransactionBadge = (type: string) => {
    const badges = {
      'VENDA': { bg: 'bg-green-100', text: 'text-green-800', label: 'Venda' },
      'TROCA': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Troca' },
      'DOACAO': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Doação' }
    };
    return badges[type as keyof typeof badges] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
  };

  const getConditionBadge = (condition: string) => {
    const badges = {
      'NOVO': { bg: 'bg-green-100', text: 'text-green-800', label: 'Novo' },
      'SEMINOVO': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Seminovo' },
      'USADO': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Usado' }
    };
    return badges[condition as keyof typeof badges] || { bg: 'bg-gray-100', text: 'text-gray-800', label: condition };
  };

  const handleWhatsAppContact = () => {
    if (!product) return;
    
    const message = `Olá! Tenho interesse no produto "${product.title}" que você anunciou no GuaraBrechó.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.warn('Erro ao compartilhar');
      }
    } else {
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };
  
  // Helper para verificar se é uma URL externa válida (http/https)
  const isExternalUrl = (url: string): boolean => {
    // Verificar se é um URL válido começando com http ou https
    return /^https?:\/\//i.test(url);
  };

  // Helper para validar data URLs
  const isValidDataUrl = (dataUrl: string): boolean => {
    if (!dataUrl || typeof dataUrl !== 'string') return false;
    if (!dataUrl.startsWith('data:image/')) return false;
    
    try {
      // Verificar se tem o formato correto
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches) return false;
      
      // Verificar se o base64 não está vazio
      const base64Data = matches[2];
      if (!base64Data || base64Data.length < 100) return false;
      
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erro ao validar data URL:', error);
      }
      return false;
    }
  };

  // Helper para processar a string de imagens
  const getImageArray = (imagesString: string): string[] => {
    if (!imagesString) return [];
    
    try {
      // Se já é uma data URL completa, retornar diretamente
      if (imagesString.startsWith('data:image/')) {
        return isValidDataUrl(imagesString) ? [imagesString] : [];
      }
      
      // Se é uma string com múltiplas imagens separadas por vírgula
      const images = imagesString.split(',').map(img => img.trim()).filter(img => img);
      
      // Filtrar apenas imagens válidas
      const validImages = images.filter(img => {
        if (isValidDataUrl(img)) return true;
        if (isExternalUrl(img)) return true;
        return false;
      });
      
      return validImages;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erro ao processar imagens do produto:', error);
      }
      return [];
    }
  };

  const nextImage = () => {
    if (product && product.images) {
      const totalImages = countValidImages(product.images);
      if (totalImages > 1) {
        setCurrentImageIndex((prev) => 
          prev === totalImages - 1 ? 0 : prev + 1
        );
      }
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      const totalImages = countValidImages(product.images);
      if (totalImages > 1) {
        setCurrentImageIndex((prev) => 
          prev === 0 ? totalImages - 1 : prev - 1
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 h-6 bg-gray-300 rounded w-32"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Produto não encontrado
          </h2>
          <Link 
            href="/produtos"
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  const transactionBadge = getTransactionBadge(product.type);
  const conditionBadge = getConditionBadge(product.condition);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            href="/produtos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Voltar para produtos
          </Link>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Images Gallery - Takes 2/3 width on large screens */}
          <div className="xl:col-span-2 space-y-4 image-gallery-container">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-96 md:h-[500px] lg:h-[600px]">
                <SafeImage
                  src={product.images}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  imageIndex={currentImageIndex}
                  fallbackIcon={
                    <div className="text-center">
                      <TagIcon className="h-20 w-20 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Imagem indisponível</p>
                    </div>
                  }
                />
                
                {/* Navigation arrows */}
                {(() => {
                  const totalImages = countValidImages(product.images);
                  return totalImages > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </>
                  );
                })()}

                {/* Image counter */}
                {(() => {
                  const totalImages = countValidImages(product.images);
                  return totalImages > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      {currentImageIndex + 1} / {totalImages}
                    </div>
                  );
                })()}

                {/* Zoom indicator */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-2 rounded-full text-xs backdrop-blur-sm">
                  📷 Clique para ampliar
                </div>
              </div>
            </div>

            {/* Thumbnail gallery */}
            {(() => {
              const totalImages = countValidImages(product.images);
              return totalImages > 1 && (
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Todas as fotos ({totalImages})
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {Array.from({ length: totalImages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'ring-4 ring-green-500 shadow-lg transform scale-105' 
                            : 'ring-2 ring-gray-200 hover:ring-gray-300 hover:shadow-md'
                        }`}
                      >
                        <SafeImage
                          src={product.images}
                          alt={`${product.title} ${index + 1}`}
                          className="h-full w-full object-cover"
                          imageIndex={index}
                          fallbackIcon={
                            <TagIcon className="h-8 w-8 text-gray-400" />
                          }
                        />
                        {/* Selected indicator */}
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <div className="bg-green-500 text-white rounded-full p-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${transactionBadge.bg} ${transactionBadge.text}`}>
                  {transactionBadge.label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${conditionBadge.bg} ${conditionBadge.text}`}>
                  {conditionBadge.label}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShareIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {product.type === 'VENDA' && (
              <div className="text-3xl font-bold text-green-600 mb-6">
                {formatPrice(product.price)}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{product.neighborhood}, Guarapuava - PR</span>
              </div>

              <div className="flex items-center text-gray-600">
                <TagIcon className="h-5 w-5 mr-2" />
                <span>{product.category.name}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>Anunciado por {product.user.name}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>Publicado em {formatDate(product.createdAt)}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Descrição
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleWhatsAppContact}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </button>

              {session && session.user && (session as any).user.id !== product.user.id && (
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Chat Interno
                </button>
              )}
            </div>
          </div>

          {/* Sistema de Avaliações do Vendedor */}
          <div className="mt-8">
            <ReviewSystem
              userId={product.user.id}
              showCreateReview={Boolean(session && (session as any).user.id !== product.user.id)}
              productId={product.id}
              revieweeId={product.user.id}
              reviewType="BUYER_TO_SELLER"
            />
          </div>
        </div>

        {/* Chat Component */}
        {session && product && (session as any).user.id !== product.user.id && (
          <Chat
            productId={product.id}
            sellerId={product.user.id}
            initialMessage={`Olá! Tenho interesse no produto "${product.title}".`}
          />
        )}
      </div>
    </div>
  );
}
