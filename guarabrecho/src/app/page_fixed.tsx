'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FeaturedProductCard from '@/components/FeaturedProductCard';
import {
  ShoppingBagIcon,
  ArrowsRightLeftIcon,
  GiftIcon,
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
        // Buscar mais produtos para ter uma seleção melhor
        const response = await fetch('/api/products?limit=16');
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
            .slice(0, 12); // Mostrar até 12 produtos
          
          setFeaturedProducts(filteredProducts);
        }
      } catch (error) {
        console.warn('Erro ao carregar produtos:', error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Clean and Simple */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">GuaraBrechó</h1>
            <p className="text-xl text-gray-600 mb-6">
              Marketplace de Guarapuava - Produtos usados com qualidade
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/produtos">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
                  Ver Todos os Produtos
                </Button>
              </Link>
              <Link href="/anunciar">
                <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 px-8">
                  Anunciar Produto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2 text-green-600">
              <ShoppingBagIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Venda</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <ArrowsRightLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Troca</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <GiftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Doação</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Section - Like Car Dealership */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Produtos Disponíveis</h2>
              <p className="text-gray-600 mt-1">
                {!loading && featuredProducts.length > 0 && (
                  `${featuredProducts.length} produtos encontrados`
                )}
              </p>
            </div>
            <Link href="/produtos">
              <Button variant="outline" className="hidden sm:flex items-center">
                Ver mais
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg h-96 animate-pulse shadow-sm border"></div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border p-8">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto disponível</h3>
                <p className="text-gray-500 mb-6">Seja o primeiro a anunciar um produto em nossa plataforma!</p>
                <Link href="/anunciar">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Anunciar Primeiro Produto
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <FeaturedProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Show more button */}
              <div className="text-center">
                <Link href="/produtos">
                  <Button size="lg" variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                    Ver Todos os Produtos
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 py-12 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quer anunciar seu produto?</h2>
          <p className="text-gray-300 mb-6">
            Cadastre-se gratuitamente e comece a vender, trocar ou doar hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/anunciar">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Anunciar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
