import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida ou sugestão? Estamos aqui para ajudar a tornar sua experiência no GuaraBrechó ainda melhor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Informações de Contato */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Informações de Contato
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contato@guarabrecho.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">WhatsApp</h3>
                    <p className="text-gray-600">(42) 99999-9999</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Localização</h3>
                    <p className="text-gray-600">Guarapuava, Paraná</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Atendimento</h3>
                    <p className="text-gray-600">24 horas por dia, 7 dias por semana</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Contato */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Envie uma Mensagem
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Assunto da mensagem"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Sua mensagem"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Como anuncio um produto?
                </h3>
                <p className="text-gray-600">
                  É muito simples! Clique em "Anunciar Produto" no topo da página, preencha as informações do seu produto, adicione fotos e publique. É totalmente gratuito.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Como entro em contato com o vendedor?
                </h3>
                <p className="text-gray-600">
                  Cada produto tem um botão "Entrar em Contato" que abre o WhatsApp do vendedor com uma mensagem pré-definida sobre o produto.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  O GuaraBrechó cobra taxas?
                </h3>
                <p className="text-gray-600">
                  Não! Nossa plataforma é gratuita para anunciar e comprar produtos. Queremos facilitar o comércio local em Guarapuava.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Como posso destacar meu produto?
                </h3>
                <p className="text-gray-600">
                  Oferecemos um recurso de destaque por uma pequena taxa que coloca seu produto em evidência na plataforma, aumentando as chances de venda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
