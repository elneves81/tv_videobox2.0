import Link from 'next/link';
import {
  UserPlusIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline';

export default function ComoFuncionaPage() {
  const steps = [
    {
      id: 1,
      title: 'Cadastre-se Grátis',
      description: 'Crie sua conta em poucos minutos com email ou Google. É totalmente gratuito!',
      icon: UserPlusIcon,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Anuncie seu Produto',
      description: 'Tire fotos, adicione descrição, defina o preço e escolha se quer vender, trocar ou doar.',
      icon: CameraIcon,
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Seja Encontrado',
      description: 'Pessoas da sua região encontram seu anúncio através da busca por bairro e categoria.',
      icon: MagnifyingGlassIcon,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Negocie Diretamente',
      description: 'Interessados entram em contato via WhatsApp para negociar e combinar a transação.',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-yellow-500',
    },
    {
      id: 5,
      title: 'Finalize a Transação',
      description: 'Encontrem-se pessoalmente em local seguro para concluir a venda, troca ou doação.',
      icon: ShieldCheckIcon,
      color: 'bg-red-500',
    },
  ];

  const features = [
    {
      title: 'Focado em Guarapuava',
      description: 'Conectamos vizinhos e pessoas da mesma cidade, facilitando encontros e reduzindo custos de entrega.',
      icon: GlobeAmericasIcon,
    },
    {
      title: 'Totalmente Gratuito',
      description: 'Sem taxas, sem comissões. 100% gratuito para anunciar e comprar produtos usados.',
      icon: HeartIcon,
    },
    {
      title: 'Seguro e Confiável',
      description: 'Perfis verificados e comunicação direta via WhatsApp para maior segurança nas transações.',
      icon: ShieldCheckIcon,
    },
  ];

  const categories = [
    'Roupas e Acessórios',
    'Eletrônicos',
    'Móveis e Decoração',
    'Livros e Material Escolar',
    'Esportes e Lazer',
    'Casa e Jardim',
    'Bebês e Crianças',
    'Veículos e Peças',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                GuaraBrechó
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/produtos"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Produtos
              </Link>
              <Link
                href="/anunciar"
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Anunciar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Como Funciona o{' '}
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              GuaraBrechó
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            O marketplace local de Guarapuava para comprar, vender, trocar e doar produtos usados.
            Simples, seguro e totalmente gratuito!
          </p>
        </div>
      </section>

      {/* How it Works Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona em 5 Passos
            </h2>
            <p className="text-lg text-gray-600">
              Processo simples e rápido para começar a usar o GuaraBrechó
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <div
                      className={`${step.color} text-white rounded-full p-3 mr-4`}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">
                      {step.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                    <step.icon className={`h-24 w-24 text-gray-400`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que Escolher o GuaraBrechó?
            </h2>
            <p className="text-lg text-gray-600">
              Vantagens exclusivas para a comunidade de Guarapuava
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-green-600 mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Categorias Disponíveis
            </h2>
            <p className="text-lg text-gray-600">
              Encontre ou anuncie produtos em diversas categorias
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center hover:from-green-100 hover:to-green-200 transition-colors cursor-pointer"
              >
                <h3 className="font-medium text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction Types */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tipos de Transação
            </h2>
            <p className="text-lg text-gray-600">
              Flexibilidade total para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Venda</h3>
              <p className="text-gray-600">
                Defina o preço e venda seus produtos usados para quem precisa.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Troca</h3>
              <p className="text-gray-600">
                Troque produtos que não usa mais por algo que realmente precisa.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Doação</h3>
              <p className="text-gray-600">
                Doe produtos em bom estado para quem mais precisa na sua comunidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se à comunidade do GuaraBrechó e descubra como é fácil dar nova vida aos seus produtos!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/produtos"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">GuaraBrechó</h3>
              <p className="text-gray-400">
                O marketplace local de Guarapuava para produtos usados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/produtos" className="hover:text-white">Produtos</Link></li>
                <li><Link href="/anunciar" className="hover:text-white">Anunciar</Link></li>
                <li><Link href="/como-funciona" className="hover:text-white">Como Funciona</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                <li><Link href="/ajuda" className="hover:text-white">Ajuda</Link></li>
                <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Guarapuava</h4>
              <p className="text-gray-400">
                Conectando nossa comunidade através do comércio sustentável.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GuaraBrechó. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
