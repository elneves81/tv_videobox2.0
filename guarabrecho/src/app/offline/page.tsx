'use client';

import { Metadata } from 'next';
import { WifiIcon } from '@heroicons/react/24/outline';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <WifiIcon className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Você está offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Parece que você perdeu a conexão com a internet. 
          Verifique sua conexão e tente novamente.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Tentar novamente
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Dicas para reconectar:</p>
            <ul className="mt-2 space-y-1">
              <li>• Verifique se o WiFi está ativado</li>
              <li>• Confirme se os dados móveis estão funcionando</li>
              <li>• Tente se aproximar do roteador</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Funcionalidades offline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Navegação básica
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Você pode navegar pelas páginas já visitadas
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Rascunhos salvos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seus rascunhos ficam salvos até você se conectar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
