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
      <section className="py-20 bg-gradient-to-br from-green-400 via-red-400 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-pulse">GuaraBrechó</h1>
            <p className="text-xl md:text-2xl text-white mb-4 font-semibold drop-shadow-lg">O Brechó Digital da Nossa Cidade</p>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">
              Marketplace local para compra, venda, troca e doação de produtos usados em Guarapuava.
              Conecte-se com a comunidade de forma sustentável e consciente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produtos">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 font-bold">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Explorar Produtos
                </Button>
              </Link>
              <Link href="/anunciar">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-green-500 font-bold">
                  Anunciar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-white via-red-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma simples e segura para dar nova vida aos seus produtos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border-4 border-green-200 bg-gradient-to-b from-white to-green-50 hover:border-green-400">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <ShoppingBagIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-700">Venda</h3>
                <p className="text-gray-600 font-medium">
                  Transforme seus produtos parados em dinheiro. Anuncie grátis e venda diretamente para vizinhos.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border-4 border-red-200 bg-gradient-to-b from-white to-red-50 hover:border-red-400">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce" style={{animationDelay: '0.2s'}}>
                  <ArrowsRightLeftIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-red-700">Troca</h3>
                <p className="text-gray-600 font-medium">
                  Troque produtos que não usa mais por itens que precisa. Economia circular na prática.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border-4 border-green-200 bg-gradient-to-b from-white to-green-50 hover:border-green-400">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce" style={{animationDelay: '0.4s'}}>
                  <GiftIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-700">Doação</h3>
                <p className="text-gray-600 font-medium">
                  Doe produtos em bom estado e ajude quem precisa. Solidariedade que transforma vidas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-r from-red-100 via-white to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent mb-4">Por que escolher o GuaraBrechó?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 border-4 border-green-300 hover:border-green-500">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl pulse">
                <MapPinIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-700">100% Local</h3>
              <p className="text-gray-600 font-medium">
                Focado exclusivamente em Guarapuava. Encontre e venda para pessoas da sua cidade.
              </p>
            </div>
            <div className="text-center p-8 rounded-xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 border-4 border-red-300 hover:border-red-500">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl pulse" style={{animationDelay: '0.3s'}}>
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-700">Sustentável</h3>
              <p className="text-gray-600 font-medium">
                Contribua para um mundo mais sustentável dando nova vida a produtos usados.
              </p>
            </div>
            <div className="text-center p-8 rounded-xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 border-4 border-green-300 hover:border-green-500">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl pulse" style={{animationDelay: '0.6s'}}>
                <UserGroupIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-700">Comunidade</h3>
              <p className="text-gray-600 font-medium">
                Conecte-se com sua comunidade e fortaleça os laços locais através do comércio consciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-2xl">Pronto para começar?</h2>
          <p className="text-xl text-white mb-10 drop-shadow-lg font-medium">
            Junte-se à comunidade GuaraBrechó e faça parte da economia circular de Guarapuava
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white font-bold text-lg px-8 py-4">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/anunciar">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-green-600 font-bold text-lg px-8 py-4">
                Fazer Primeiro Anúncio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
