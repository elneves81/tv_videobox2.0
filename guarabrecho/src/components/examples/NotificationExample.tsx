'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { LoadingButton } from '@/components/ui/Loading';
import { useState } from 'react';

export default function NotificationExample() {
  const { success, error, warning, info } = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleSuccessNotification = () => {
    success('Produto salvo com sucesso!', 'Seu anúncio já está disponível para outros usuários.');
  };

  const handleErrorNotification = () => {
    error('Erro ao salvar produto', 'Verifique os dados e tente novamente.');
  };

  const handleWarningNotification = () => {
    warning('Atenção', 'Você tem produtos próximos do vencimento.');
  };

  const handleInfoNotification = () => {
    info('Nova atualização disponível', 'Veja as novas funcionalidades do GuaraBrechó.');
  };

  const handleAsyncAction = async () => {
    setLoading(true);
    try {
      // Simular uma ação async
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Ação concluída!', 'A operação foi executada com sucesso.');
    } catch (err) {
      error('Erro na operação', 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sistema de Notificações
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <button
          onClick={handleSuccessNotification}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Sucesso
        </button>
        
        <button
          onClick={handleErrorNotification}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Erro
        </button>
        
        <button
          onClick={handleWarningNotification}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Aviso
        </button>
        
        <button
          onClick={handleInfoNotification}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Info
        </button>
      </div>

      <LoadingButton
        onClick={handleAsyncAction}
        loading={loading}
        className="w-full"
      >
        Ação com Loading
      </LoadingButton>
    </div>
  );
}
