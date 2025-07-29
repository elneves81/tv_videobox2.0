'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { SimpleThemeToggle } from '@/components/ui/ThemeToggle'
import { PlusIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              GuaraBrechó
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/produtos" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Produtos
            </Link>
            <Link 
              href="/planos" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
            >
              Planos
            </Link>
            <Link 
              href="/como-funciona" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Como Funciona
            </Link>
            <Link 
              href="/contato" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <SimpleThemeToggle />
            {status === 'loading' ? (
              // Loading state
              <div className="flex items-center space-x-4">
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
            ) : session ? (
              // User is logged in
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">
                    <UserCircleIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/anunciar">
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Anunciar
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              // User is not logged in
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline">
                    Entrar
                  </Button>
                </Link>
                <Link href="/anunciar">
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Anunciar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <SimpleThemeToggle className="mr-2" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/produtos"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link
                href="/planos"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                href="/como-funciona"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </Link>
              <Link
                href="/contato"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <div className="flex flex-col space-y-2 px-3 py-2">
                {status === 'loading' ? (
                  // Loading state
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </div>
                ) : session ? (
                  // User is logged in
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/anunciar" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Anunciar
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleSignOut()
                      }}
                      className="w-full text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  // User is not logged in
                  <>
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link href="/anunciar" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Anunciar
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
