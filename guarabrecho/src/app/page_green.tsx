"use client";
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
        <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Como Funciona</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Uma plataforma simples e segura para dar nova vida aos seus produtos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover-lift gradient-card-green">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{animation: 'pulse 3s ease-in-out infinite'}}>
                    <ShoppingBagIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">Venda</h3>
                  <p className="text-gray-600 font-medium">
                    Transforme seus produtos parados em dinheiro. Anuncie grátis e venda diretamente para vizinhos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover-lift gradient-card-green">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{animation: 'pulse 3s ease-in-out infinite', animationDelay: '0.5s'}}>
                    <ArrowsRightLeftIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">Troca</h3>
                  <p className="text-gray-600 font-medium">
                    Troque produtos que não usa mais por itens que precisa. Economia circular na prática.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover-lift gradient-card-green">
                <CardContent className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{animation: 'pulse 3s ease-in-out infinite', animationDelay: '1s'}}>
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
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Por que escolher o GuaraBrechó?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl hover-lift" style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #10b981, 0 10px 30px rgba(16, 185, 129, 0.1)'
              }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{animation: 'float 4s ease-in-out infinite'}}>
                  <MapPinIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700">100% Local</h3>
                <p className="text-gray-600 font-medium">
                  Focado exclusivamente em Guarapuava. Encontre e venda para pessoas da sua cidade.
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl hover-lift" style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #059669, 0 10px 30px rgba(5, 150, 105, 0.1)'
              }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{animation: 'float 4s ease-in-out infinite', animationDelay: '1s'}}>
                  <HeartIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700">Sustentável</h3>
                <p className="text-gray-600 font-medium">
                  Contribua para um mundo mais sustentável dando nova vida a produtos usados.
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl hover-lift" style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #34d399, 0 10px 30px rgba(52, 211, 153, 0.1)'
              }}>
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{animation: 'float 4s ease-in-out infinite', animationDelay: '2s'}}>
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
              <Link href="/cadastro">
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
