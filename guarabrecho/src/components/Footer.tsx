import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-green-400 mb-4">
              GuaraBrechó
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              O marketplace digital de Guarapuava para compra, venda, troca e doação 
              de produtos usados. Conectando a comunidade local de forma sustentável.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/guarabrecho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://facebook.com/guarabrecho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://wa.me/5542999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/produtos" className="text-gray-400 hover:text-green-400 transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-400 hover:text-green-400 transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/anunciar" className="text-gray-400 hover:text-green-400 transition-colors">
                  Anunciar
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-green-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-green-400 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-green-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="text-gray-400 hover:text-green-400 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} GuaraBrechó. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Desenvolvido com ❤️ para a comunidade de Guarapuava
          </p>
        </div>
      </div>
    </footer>
  )
}
