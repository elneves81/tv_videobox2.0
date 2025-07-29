import Link from 'next/link';

export default function PrivacidadePage() {
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
              Política de Privacidade
            </h1>
            <p className="text-lg text-gray-600">
              Última atualização: 21 de julho de 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Esta Política de Privacidade descreve como o GuaraBrechó coleta, usa, armazena e 
                protege suas informações pessoais. Respeitamos sua privacidade e estamos comprometidos 
                em proteger seus dados pessoais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1. Informações Fornecidas por Você</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li><strong>Dados de cadastro:</strong> nome, email, telefone, WhatsApp, bairro</li>
                    <li><strong>Informações de anúncios:</strong> títulos, descrições, fotos, preços</li>
                    <li><strong>Comunicações:</strong> mensagens enviadas através da plataforma</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2. Informações Coletadas Automaticamente</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li><strong>Dados de navegação:</strong> IP, tipo de dispositivo, navegador</li>
                    <li><strong>Cookies:</strong> para melhorar sua experiência</li>
                    <li><strong>Logs de acesso:</strong> horários e páginas visitadas</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3. Informações de Terceiros</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li><strong>Login social:</strong> dados do Google quando usar login social</li>
                    <li><strong>Analytics:</strong> estatísticas de uso (dados anonimizados)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Como Usamos suas Informações</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1. Finalidades Principais</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Criar e gerenciar sua conta de usuário</li>
                    <li>Exibir seus anúncios para outros usuários</li>
                    <li>Facilitar contato entre compradores e vendedores</li>
                    <li>Melhorar nossos serviços e experiência do usuário</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2. Comunicações</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Enviar notificações sobre seus anúncios</li>
                    <li>Responder suas dúvidas e solicitações</li>
                    <li>Enviar atualizações importantes sobre o serviço</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3. Segurança e Conformidade</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Detectar e prevenir fraudes ou atividades suspeitas</li>
                    <li>Cumprir obrigações legais e regulamentares</li>
                    <li>Proteger direitos e segurança dos usuários</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>4.1. Não vendemos seus dados pessoais.</strong> Suas informações são compartilhadas apenas nas seguintes situações:
                </p>
                
                <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
                  <li><strong>Anúncios públicos:</strong> informações dos anúncios são visíveis a todos os usuários</li>
                  <li><strong>Contato entre usuários:</strong> telefone/WhatsApp quando alguém demonstra interesse</li>
                  <li><strong>Prestadores de serviço:</strong> empresas que nos ajudam a operar a plataforma</li>
                  <li><strong>Obrigações legais:</strong> quando exigido por lei ou autoridades</li>
                  <li><strong>Proteção de direitos:</strong> para proteger nossos direitos ou de terceiros</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed mb-4">
                  De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem os seguintes direitos:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-900">🔍 Acesso:</strong>
                      <p className="text-gray-600 text-sm">Saber quais dados temos sobre você</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">✏️ Retificação:</strong>
                      <p className="text-gray-600 text-sm">Corrigir dados incorretos</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">🗑️ Exclusão:</strong>
                      <p className="text-gray-600 text-sm">Deletar seus dados</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-900">📤 Portabilidade:</strong>
                      <p className="text-gray-600 text-sm">Exportar seus dados</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">🚫 Oposição:</strong>
                      <p className="text-gray-600 text-sm">Opor-se ao processamento</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">ℹ️ Informação:</strong>
                      <p className="text-gray-600 text-sm">Saber como usamos seus dados</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Segurança dos Dados</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Implementamos medidas técnicas e organizacionais para proteger seus dados:
                </p>
                
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Criptografia:</strong> dados sensíveis são criptografados</li>
                  <li><strong>Acesso restrito:</strong> apenas pessoal autorizado acessa dados</li>
                  <li><strong>Monitoramento:</strong> sistemas monitorados 24/7</li>
                  <li><strong>Backups seguros:</strong> cópias de segurança protegidas</li>
                  <li><strong>Atualizações:</strong> sistemas sempre atualizados</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Mantemos seus dados pelo tempo necessário para:
                </p>
                
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Conta ativa:</strong> enquanto sua conta estiver ativa</li>
                  <li><strong>Obrigações legais:</strong> conforme exigido por lei</li>
                  <li><strong>Disputas:</strong> até resolução de possíveis disputas</li>
                  <li><strong>Logs de segurança:</strong> até 6 meses para investigações</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies e Tecnologias Similares</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Usamos cookies para melhorar sua experiência:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-900">🍪 Cookies Essenciais:</strong>
                    <p className="text-gray-600">Necessários para funcionamento básico</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">📊 Cookies de Analytics:</strong>
                    <p className="text-gray-600">Para entender como você usa o site</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">⚙️ Cookies de Preferências:</strong>
                    <p className="text-gray-600">Para lembrar suas configurações</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Idade</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nossos serviços não são direcionados a menores de 16 anos. Se tivermos conhecimento 
                de que coletamos dados de menores sem autorização, deletaremos essas informações.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Alterações nesta Política</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podemos atualizar esta política periodicamente. Mudanças significativas serão 
                comunicadas através da plataforma ou por email. Recomendamos revisar regularmente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>📧 Email:</strong> privacidade@guarabrecho.com.br</li>
                  <li><strong>🏢 Endereço:</strong> Guarapuava - PR</li>
                  <li><strong>⏰ Prazo de resposta:</strong> até 15 dias úteis</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/termos" className="text-green-600 hover:text-green-700 font-medium">
                Termos de Uso
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
