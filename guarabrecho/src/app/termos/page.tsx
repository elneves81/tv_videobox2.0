import Link from 'next/link';

export default function TermosPage() {
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
        <div className="bg-white">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Termos de Uso
            </h1>
            <p className="text-lg text-gray-600">
              Última atualização: 21 de julho de 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ao acessar e usar o GuaraBrechó, você aceita e concorda em cumprir estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O GuaraBrechó é uma plataforma digital que conecta pessoas da cidade de Guarapuava 
                interessadas em comprar, vender, trocar ou doar produtos usados. Facilitamos o contato 
                entre usuários, mas não participamos diretamente das transações.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta do Usuário</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>3.1.</strong> Para usar certas funcionalidades, você deve criar uma conta fornecendo 
                  informações precisas e atualizadas.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>3.2.</strong> Você é responsável por manter a confidencialidade de sua senha e 
                  por todas as atividades que ocorrem em sua conta.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>3.3.</strong> Deve ter pelo menos 16 anos para usar nossos serviços. Menores de 18 anos 
                  devem ter autorização dos responsáveis.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso da Plataforma</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>4.1. Uso Permitido:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Anunciar produtos usados para venda, troca ou doação</li>
                  <li>Buscar e contactar vendedores de produtos de interesse</li>
                  <li>Usar informações de contato apenas para fins relacionados aos anúncios</li>
                </ul>
                
                <p className="text-gray-600 leading-relaxed mt-6">
                  <strong>4.2. Uso Proibido:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Anunciar produtos novos ou comerciais em larga escala</li>
                  <li>Publicar conteúdo falso, enganoso ou ilegal</li>
                  <li>Usar a plataforma para spam ou marketing não solicitado</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Assediar, ameaçar ou prejudicar outros usuários</li>
                  <li>Tentar burlar sistemas de segurança</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Anúncios e Conteúdo</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>5.1.</strong> Você é totalmente responsável pelo conteúdo que publica, 
                  incluindo descrições, fotos e informações de contato.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>5.2.</strong> Reservamo-nos o direito de remover anúncios que violem estes termos 
                  ou sejam considerados inadequados.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>5.3.</strong> Fotos devem ser reais do produto anunciado e não podem violar 
                  direitos autorais.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Transações</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>6.1.</strong> O GuaraBrechó é apenas um facilitador. Não participamos nas transações 
                  entre usuários e não somos responsáveis por elas.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>6.2.</strong> Todas as negociações, pagamentos e entregas são de responsabilidade 
                  exclusiva dos usuários envolvidos.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>6.3.</strong> Recomendamos encontros em locais públicos e seguros.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O GuaraBrechó, sua marca, design e funcionalidades são propriedade nossa e protegidos 
                por leis de propriedade intelectual. Você não pode usar nossos elementos sem autorização.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>8.1.</strong> Não garantimos a veracidade das informações nos anúncios.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>8.2.</strong> Não somos responsáveis por prejuízos decorrentes de transações 
                  entre usuários.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>8.3.</strong> Nossa responsabilidade é limitada ao máximo permitido por lei.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificações</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podemos modificar estes termos a qualquer momento. Mudanças significativas serão 
                comunicadas através da plataforma. O uso continuado após as mudanças constitui aceitação.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Encerramento</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podemos suspender ou encerrar sua conta caso você viole estes termos. 
                Você também pode encerrar sua conta a qualquer momento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Lei Aplicável</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Estes termos são regidos pelas leis brasileiras. Disputas serão resolvidas no 
                foro da comarca de Guarapuava-PR.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contato</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Para dúvidas sobre estes termos, entre em contato através da nossa 
                <Link href="/ajuda" className="text-green-600 hover:text-green-700 font-medium"> Central de Ajuda</Link>.
              </p>
            </section>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacidade" className="text-green-600 hover:text-green-700 font-medium">
                Política de Privacidade
              </Link>
              <Link href="/faq" className="text-green-600 hover:text-green-700 font-medium">
                Perguntas Frequentes
              </Link>
              <Link href="/ajuda" className="text-green-600 hover:text-green-700 font-medium">
                Central de Ajuda
              </Link>
              <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
