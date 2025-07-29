import Link from 'next/link';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function AjudaPage() {
  const helpCategories = [
    {
      title: "Começando",
      description: "Primeiros passos no GuaraBrechó",
      icon: UserGroupIcon,
      color: "bg-blue-500",
      links: [
        { text: "Como criar uma conta", href: "/faq#conta" },
        { text: "Como funciona a plataforma", href: "/como-funciona" },
        { text: "Primeiro anúncio", href: "/faq#anunciar" },
        { text: "Dicas de segurança", href: "/faq#seguranca" }
      ]
    },
    {
      title: "Anúncios",
      description: "Criar e gerenciar seus anúncios",
      icon: DocumentTextIcon,
      color: "bg-green-500",
      links: [
        { text: "Como criar um anúncio", href: "/faq#anunciar" },
        { text: "Adicionar fotos", href: "/faq#fotos" },
        { text: "Definir preços", href: "/faq#precos" },
        { text: "Gerenciar anúncios", href: "/faq#gerenciar" }
      ]
    },
    {
      title: "Compras e Vendas",
      description: "Negociar e finalizar transações",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500",
      links: [
        { text: "Como contactar vendedores", href: "/faq#contato" },
        { text: "Negociar preços", href: "/faq#negociar" },
        { text: "Locais seguros para encontro", href: "/faq#seguranca" },
        { text: "Finalizar compra", href: "/faq#finalizar" }
      ]
    },
    {
      title: "Segurança",
      description: "Manter-se seguro na plataforma",
      icon: ShieldCheckIcon,
      color: "bg-red-500",
      links: [
        { text: "Dicas de segurança", href: "/faq#seguranca" },
        { text: "Identificar golpes", href: "/faq#golpes" },
        { text: "Denunciar problemas", href: "#contato" },
        { text: "Proteção de dados", href: "/privacidade" }
      ]
    }
  ];

  const supportStats = [
    { label: "Tempo médio de resposta", value: "2 horas", icon: ClockIcon },
    { label: "Usuários atendidos", value: "500+", icon: UserGroupIcon },
    { label: "Satisfação", value: "98%", icon: ShieldCheckIcon },
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
            Central de{' '}
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Ajuda
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Estamos aqui para ajudar! Encontre respostas rápidas ou entre em contato conosco.
          </p>
          
          {/* Quick Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="O que você precisa saber?"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/faq" className="group">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-green-600 mb-4">
                  <QuestionMarkCircleIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                  Perguntas Frequentes
                </h3>
                <p className="text-gray-600">
                  Respostas para as dúvidas mais comuns dos usuários.
                </p>
              </div>
            </Link>

            <Link href="/como-funciona" className="group">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Como Funciona
                </h3>
                <p className="text-gray-600">
                  Guia completo sobre como usar o GuaraBrechó.
                </p>
              </div>
            </Link>

            <div className="group cursor-pointer">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-purple-600 mb-4">
                  <ChatBubbleLeftRightIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                  Fale Conosco
                </h3>
                <p className="text-gray-600">
                  Entre em contato direto com nossa equipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore por Categoria
            </h2>
            <p className="text-lg text-gray-600">
              Encontre ajuda específica para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className={`${category.color} text-white rounded-lg p-3 w-fit mb-4`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href}
                          className="text-sm text-green-600 hover:text-green-700 hover:underline"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nosso Compromisso com Você
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-green-600 mb-4 flex justify-center">
                  <stat.icon className="h-12 w-12" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-12 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Entre em Contato
            </h2>
            <p className="text-lg text-gray-600">
              Não encontrou o que procurava? Fale diretamente conosco!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-green-600 mb-4 flex justify-center">
                <EnvelopeIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">
                Resposta em até 24 horas
              </p>
              <a 
                href="mailto:ajuda@guarabrecho.com.br"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                ajuda@guarabrecho.com.br
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">
                Atendimento rápido
              </p>
              <a 
                href="https://wa.me/5542999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                (42) 99999-9999
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center md:col-span-2 lg:col-span-1">
              <div className="text-purple-600 mb-4 flex justify-center">
                <ClockIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Horário</h3>
              <p className="text-gray-600 mb-2">
                Segunda a Sexta: 8h às 18h
              </p>
              <p className="text-gray-600">
                Sábado: 8h às 12h
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Envie sua Mensagem
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre a plataforma</option>
                    <option value="problema">Problema técnico</option>
                    <option value="denuncia">Denunciar anúncio</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Descreva sua dúvida ou problema..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/termos" className="text-green-600 hover:text-green-700 font-medium">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-green-600 hover:text-green-700 font-medium">
              Política de Privacidade
            </Link>
            <Link href="/faq" className="text-green-600 hover:text-green-700 font-medium">
              Perguntas Frequentes
            </Link>
            <Link href="/como-funciona" className="text-green-600 hover:text-green-700 font-medium">
              Como Funciona
            </Link>
            <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
