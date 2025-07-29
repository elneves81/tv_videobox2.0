"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SafeImage, getFirstValidImage } from '@/lib/safe-image';
import {
  ShoppingBagIcon,
  ArrowsRightLeftIcon,
  GiftIcon,
  HeartIcon,
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  condition: string;
  category: {
    name: string;
  };
  neighborhood: string;
  images: string;
  user: {
    name: string;
  };
}

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=3');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.warn('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleWhatsAppContact = (product: Product) => {
    const action = product.type === 'VENDA' ? 'comprar' : 
                  product.type === 'TROCA' ? 'trocar' : 'solicitar';
    
    const message = `Olá! Tenho interesse em ${action} o produto "${product.title}" que você anunciou no GuaraBrechó.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <TagIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Nenhum produto disponível no momento.</p>
        <Link href="/anunciar" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors">
          Seja o primeiro a anunciar!
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/produtos/${product.id}`}>
            <div className="h-48 relative overflow-hidden rounded-lg">
              <SafeImage
                src={product.images}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300 product-card-image mobile-image-fix"
                fallbackIcon={
                  <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-700">
                    <TagIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Imagem indisponível</p>
                  </div>
                }
              />
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/produtos/${product.id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="space-y-2">
              {/* Price */}
              {product.type === 'VENDA' && (
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatPrice(product.price)}
                </div>
              )}
              {product.type === 'TROCA' && (
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  Aceita Trocas
                </div>
              )}
              {product.type === 'DOACAO' && (
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  Gratuito
                </div>
              )}
              
              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {product.neighborhood}
              </div>
              
              {/* Contact Button */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleWhatsAppContact(product)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  {product.type === 'VENDA' ? 'Comprar' : 
                   product.type === 'TROCA' ? 'Trocar' : 'Solicitar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <style jsx global>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .gradient-hero {
          background: linear-gradient(135deg, #064e3b 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%);
          background-size: 400% 400%;
          animation: gradientFlow 10s ease infinite;
        }
        
        .gradient-card-green {
          background: linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
          border: 3px solid transparent;
          background-clip: padding-box;
          box-shadow: 0 0 0 3px linear-gradient(145deg, #059669, #10b981);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="gradient-hero py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/10 animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-64 h-64 rounded-full bg-white/10 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl" style={{animation: 'float 6s ease-in-out infinite'}}>
                GuaraBrechó
              </h1>
              <p className="text-xl md:text-2xl text-white mb-4 font-semibold drop-shadow-lg">
                O Brechó Digital da Nossa Cidade
              </p>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">
                Marketplace local para compra, venda, troca e doação de produtos usados em Guarapuava.
                Conecte-se com a comunidade de forma sustentável e consciente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/produtos">
                  <Button size="lg" className="glass-effect text-white hover:bg-white/30 shadow-2xl hover-lift border-2 border-white/30 font-bold backdrop-blur-sm">
                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                    Explorar Produtos
                  </Button>
                </Link>
                <Link href="/anunciar">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-2xl hover-lift border-2 border-green-500 font-bold">
                    Anunciar Grátis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Como Funciona</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Uma plataforma simples e segura para dar nova vida aos seus produtos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover-lift gradient-card-green dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{animation: 'pulse 3s ease-in-out infinite'}}>
                    <ShoppingBagIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Venda</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Transforme seus produtos parados em dinheiro. Anuncie grátis e venda diretamente para vizinhos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover-lift gradient-card-green dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{animation: 'pulse 3s ease-in-out infinite', animationDelay: '0.5s'}}>
                    <ArrowsRightLeftIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Troca</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Troque produtos que não usa mais por itens que precisa. Economia circular na prática.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover-lift gradient-card-green dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{animation: 'pulse 3s ease-in-out infinite', animationDelay: '1s'}}>
                    <GiftIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Doação</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Doe produtos em bom estado e ajude quem precisa. Solidariedade que transforma vidas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Por que escolher o GuaraBrechó?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl hover-lift dark:bg-gray-800" style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #10b981, 0 10px 30px rgba(16, 185, 129, 0.1)'
              }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{animation: 'float 4s ease-in-out infinite'}}>
                  <MapPinIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">100% Local</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Focado exclusivamente em Guarapuava. Encontre e venda para pessoas da sua cidade.
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl hover-lift dark:bg-gray-800" style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #059669, 0 10px 30px rgba(5, 150, 105, 0.1)'
              }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{animation: 'float 4s ease-in-out infinite', animationDelay: '1s'}}>
                  <HeartIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Sustentável</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Contribua para um mundo mais sustentável dando nova vida a produtos usados.
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl hover-lift dark:bg-gray-800" style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #34d399, 0 10px 30px rgba(52, 211, 153, 0.1)'
              }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{animation: 'float 4s ease-in-out infinite', animationDelay: '2s'}}>
                  <UserGroupIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Comunidade</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Conecte-se com sua comunidade e fortaleça os laços locais através do comércio consciente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Produtos em Destaque</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Confira alguns dos produtos mais recentes em nossa comunidade
              </p>
            </div>
            <FeaturedProducts />
            <div className="text-center mt-12">
              <Link href="/produtos">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-xl hover-lift font-bold">
                  Ver Todos os Produtos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Teaser Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Turbine suas vendas com nossos planos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Destaque seus produtos, chegue a mais compradores e venda mais rápido
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBagIcon className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">R$ 0</div>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>✓ Até 3 anúncios</li>
                  <li>✓ 3 fotos por produto</li>
                  <li>✓ Suporte básico</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-green-500 relative transform scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">R$ 19,90</div>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>✓ Até 15 anúncios</li>
                  <li>✓ 10 fotos por produto</li>
                  <li>✓ Destaque nos anúncios</li>
                  <li>✓ Analytics básico</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Escolher Premium
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TagIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">R$ 39,90</div>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>✓ Anúncios ilimitados</li>
                  <li>✓ Fotos ilimitadas</li>
                  <li>✓ Destaque OURO</li>
                  <li>✓ Analytics avançado</li>
                </ul>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  Escolher Pro
                </Button>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/planos">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-xl hover-lift font-bold">
                  Ver Todos os Planos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientFlow 12s ease infinite'
        }}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-2xl" style={{animation: 'float 5s ease-in-out infinite'}}>
              Pronto para começar?
            </h2>
            <p className="text-xl text-white mb-10 drop-shadow-lg font-medium">
              Junte-se à comunidade GuaraBrechó e faça parte da economia circular de Guarapuava
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-2xl hover-lift border-4 border-white font-bold text-lg px-8 py-4">
                  Criar Conta Grátis
                </Button>
              </Link>
              <Link href="/anunciar">
                <Button size="lg" className="glass-effect text-white hover:bg-white/20 shadow-2xl hover-lift border-4 border-white/30 font-bold text-lg px-8 py-4 backdrop-blur-sm">
                  Fazer Primeiro Anúncio
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
