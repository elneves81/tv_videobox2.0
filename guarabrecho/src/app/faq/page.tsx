'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Sobre o GuaraBrechó",
      questions: [
        {
          question: "O que é o GuaraBrechó?",
          answer: "O GuaraBrechó é uma plataforma digital que conecta pessoas de Guarapuava interessadas em comprar, vender, trocar ou doar produtos usados. Nosso foco é facilitar o comércio local e sustentável na nossa cidade."
        },
        {
          question: "O GuaraBrechó é gratuito?",
          answer: "Sim! O GuaraBrechó é completamente gratuito para usar. Não cobramos taxas para anunciar produtos, fazer buscas ou entrar em contato com outros usuários."
        },
        {
          question: "Posso usar o GuaraBrechó se não moro em Guarapuava?",
          answer: "Nossa plataforma é focada na comunidade de Guarapuava para facilitar encontros presenciais e reduzir custos de frete. Usuários de outras cidades são bem-vindos, mas recomendamos considerar os custos de transporte."
        }
      ]
    },
    {
      category: "Criando uma Conta",
      questions: [
        {
          question: "Como criar uma conta no GuaraBrechó?",
          answer: "É simples! Clique em 'Cadastre-se', preencha seus dados básicos (nome, email, telefone, bairro) e confirme seu email. Você também pode se cadastrar usando sua conta do Google."
        },
        {
          question: "Preciso fornecer meu número de WhatsApp?",
          answer: "O WhatsApp é opcional, mas altamente recomendado! É a principal forma de contato entre compradores e vendedores, facilitando a negociação."
        },
        {
          question: "Posso alterar meus dados depois de cadastrado?",
          answer: "Sim, você pode atualizar suas informações pessoais a qualquer momento através do seu dashboard, na seção 'Configurações'."
        }
      ]
    },
    {
      category: "Anunciando Produtos",
      questions: [
        {
          question: "Como criar um anúncio?",
          answer: "Após fazer login, clique em 'Anunciar', preencha as informações do produto (título, descrição, fotos, preço, categoria, estado), escolha se é venda/troca/doação e publique!"
        },
        {
          question: "Quantas fotos posso adicionar?",
          answer: "Você pode adicionar várias fotos do seu produto. Recomendamos pelo menos 2-3 fotos de ângulos diferentes para mostrar melhor o produto aos interessados."
        },
        {
          question: "Posso anunciar produtos novos?",
          answer: "O GuaraBrechó é focado em produtos usados. Se você tem produtos novos em excesso (presentes não usados, por exemplo), pode anunciar, mas evite uso comercial em larga escala."
        },
        {
          question: "Como funciona a doação de produtos?",
          answer: "Para doar, selecione 'Doação' no tipo de transação. O campo preço será desabilitado automaticamente. Descreva bem o produto e o motivo da doação."
        }
      ]
    },
    {
      category: "Comprando e Negociando",
      questions: [
        {
          question: "Como entrar em contato com um vendedor?",
          answer: "Clique no anúncio de interesse e use o botão 'Contactar via WhatsApp'. Isso abrirá uma conversa com uma mensagem pré-definida sobre o produto."
        },
        {
          question: "Como negociar o preço?",
          answer: "Entre em contato com o vendedor via WhatsApp e negocie diretamente. Seja respeitoso e justo nas propostas. Lembre-se que muitos vendedores já consideraram o valor justo."
        },
        {
          question: "Onde e como fazer a troca do produto?",
          answer: "Combinem um local público e seguro em Guarapuava, como shoppings, praças movimentadas ou estacionamentos de supermercados. Sempre se encontrem durante o dia e, se possível, levem acompanhantes."
        },
        {
          question: "Posso devolver um produto comprado?",
          answer: "As condições de devolução devem ser acordadas diretamente entre comprador e vendedor antes da compra. O GuaraBrechó não media devoluções, então esclareçam tudo antes de finalizar."
        }
      ]
    },
    {
      category: "Segurança",
      questions: [
        {
          question: "O GuaraBrechó é seguro?",
          answer: "Sim! Mas a segurança também depende dos usuários. Sempre se encontrem em locais públicos, confiram o produto antes do pagamento e confiem nos seus instintos."
        },
        {
          question: "Como identificar possíveis golpes?",
          answer: "Desconfie de: preços muito baixos, vendedores que pedem pagamento antecipado, produtos 'novos' por preços suspeitos, ou quem evita encontro presencial."
        },
        {
          question: "O que fazer se encontrar um anúncio suspeito?",
          answer: "Entre em contato conosco através da Central de Ajuda. Analisaremos e, se necessário, removeremos anúncios que violem nossos termos de uso."
        },
        {
          question: "Meus dados pessoais estão protegidos?",
          answer: "Sim! Seguimos a LGPD e não compartilhamos seus dados pessoais. Apenas as informações dos anúncios e seu contato ficam visíveis para interessados."
        }
      ]
    },
    {
      category: "Problemas Técnicos",
      questions: [
        {
          question: "Não consigo fazer login na minha conta",
          answer: "Tente redefinir sua senha na página de login. Se usar login social (Google), verifique se está usando a mesma conta. Se persistir, entre em contato conosco."
        },
        {
          question: "Meu anúncio não aparece nas buscas",
          answer: "Aguarde alguns minutos após publicar. Se ainda não aparecer, verifique se todas as informações obrigatórias foram preenchidas. Entre em contato se o problema persistir."
        },
        {
          question: "As fotos do meu anúncio não carregam",
          answer: "Verifique se as imagens têm menos de 10MB e estão em formato JPG ou PNG. Tente usar uma conexão de internet mais estável."
        },
        {
          question: "Como deletar meu anúncio?",
          answer: "Acesse seu dashboard, encontre o anúncio na lista 'Meus Anúncios' e clique em deletar. Anúncios vendidos devem ser marcados como 'vendido' para ajudar outros usuários."
        }
      ]
    }
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o GuaraBrechó. 
            Se não encontrar o que procura, visite nossa Central de Ajuda.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Busque por uma pergunta..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={questionIndex}>
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <div className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Não encontrou sua resposta?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nossa Central de Ajuda tem mais informações detalhadas e você pode entrar em contato 
            diretamente conosco para esclarecimentos específicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ajuda"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Ir para Central de Ajuda
            </Link>
            <Link
              href="/como-funciona"
              className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
            >
              Como Funciona
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/termos" className="text-green-600 hover:text-green-700 font-medium">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-green-600 hover:text-green-700 font-medium">
              Política de Privacidade
            </Link>
            <Link href="/ajuda" className="text-green-600 hover:text-green-700 font-medium">
              Central de Ajuda
            </Link>
            <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
