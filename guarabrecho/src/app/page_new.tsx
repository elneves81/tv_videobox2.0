import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingBagIcon,
  ArrowsRightLeftIcon,
  GiftIcon,
  HeartIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">GuaraBrechó</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">O Brechó Digital da Nossa Cidade</p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Marketplace local para compra, venda, troca e doação de produtos usados em Guarapuava.
              Conecte-se com a comunidade de forma sustentável e consciente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produtos">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Explorar Produtos
                </Button>
              </Link>
              <Link href="/anunciar">
                <Button size="lg" variant="outline">
                  Anunciar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma simples e segura para dar nova vida aos seus produtos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBagIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Venda</h3>
                <p className="text-gray-600">
                  Transforme seus produtos parados em dinheiro. Anuncie grátis e venda diretamente para vizinhos.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <ArrowsRightLeftIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Troca</h3>
                <p className="text-gray-600">
                  Troque produtos que não usa mais por itens que precisa. Economia circular na prática.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <GiftIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Doação</h3>
                <p className="text-gray-600">
                  Doe produtos em bom estado e ajude quem precisa. Solidariedade que transforma vidas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gray-50">
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
