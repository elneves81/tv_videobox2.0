'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FeaturedProductCard from '@/components/FeaturedProductCard';
import {
  ShoppingBagIcon,
  ArrowsRightLeftIcon,
  GiftIcon,
  HeartIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Limit to 8 products for the featured section
        const response = await fetch('/api/products?limit=12');
        if (response.ok) {
          const data = await response.json();
          
          // Filtragem no cliente para mostrar apenas produtos com imagens
          // e ordenar por data de criação (mais recentes primeiro)
          const filteredProducts = data
            .filter((product: Product) => {
              // Verificar se o produto tem pelo menos uma imagem
              return product.images && 
                     product.images.trim() !== '' && 
                     product.images.split(',').some(img => img.trim() !== '');
            })
            .sort((a: Product, b: Product) => {
              // Ordenar por data de criação (mais recentes primeiro)
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, 8); // Limitar a 8 produtos após filtragem
          
          setFeaturedProducts(filteredProducts);
        }
      } catch (error) {
        console.warn('Erro ao carregar produtos em destaque:', error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-400 via-red-400 to-green-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">GuaraBrechó</h1>
            <p className="text-xl md:text-2xl text-white mb-4 font-semibold drop-shadow-md">O Brechó Digital da Nossa Cidade</p>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              Marketplace local para compra, venda, troca e doação de produtos usados em Guarapuava.
              Conecte-se com a comunidade de forma sustentável e consciente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produtos">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Explorar Produtos
                </Button>
              </Link>
              <Link href="/anunciar">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 border-2 border-white shadow-lg transform hover:scale-105 transition-all duration-200">
                  Anunciar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Produtos em Destaque</h2>
              <p className="text-gray-600 max-w-2xl">
                Confira os itens mais recentes disponíveis no GuaraBrechó
              </p>
            </div>
            <Link href="/produtos" className="flex items-center bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition-colors">
              Ver todos
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg h-80 animate-pulse shadow"></div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">Nenhum produto disponível no momento.</p>
              <Link href="/anunciar" className="mt-4 inline-block text-red-600 hover:text-red-800 font-semibold">
                Seja o primeiro a anunciar!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-white via-red-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma simples e segura para dar nova vida aos seus produtos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200 bg-gradient-to-b from-white to-green-50">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <ShoppingBagIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-700">Venda</h3>
                <p className="text-gray-600">
                  Transforme seus produtos parados em dinheiro. Anuncie grátis e venda diretamente para vizinhos.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-red-200 bg-gradient-to-b from-white to-red-50">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <ArrowsRightLeftIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-red-700">Troca</h3>
                <p className="text-gray-600">
                  Troque produtos que não usa mais por itens que precisa. Economia circular na prática.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200 bg-gradient-to-b from-white to-green-50">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <GiftIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-700">Doação</h3>
                <p className="text-gray-600">
                  Doe produtos em bom estado e ajude quem precisa. Solidariedade que transforma vidas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher o GuaraBrechó?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Local</h3>
              <p className="text-gray-600">
                Focado exclusivamente em Guarapuava. Encontre e venda para pessoas da sua cidade.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustentável</h3>
              <p className="text-gray-600">
                Contribua para um mundo mais sustentável dando nova vida a produtos usados.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
              <p className="text-gray-600">
                Conecte-se com sua comunidade e fortaleça os laços locais através do comércio consciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-xl text-green-100 mb-8">
            Junte-se à comunidade GuaraBrechó e faça parte da economia circular de Guarapuava
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="outline" className="bg-white text-green-600 hover:bg-gray-100">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/anunciar">
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Fazer Primeiro Anúncio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
