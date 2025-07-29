'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  KeyIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { GUARAPUAVA_NEIGHBORHOODS } from '@/lib/data/neighborhoods';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  neighborhood: string;
}

export default function ConfiguracoesPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    neighborhood: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load user data
    setProfileData({
      name: session.user?.name || '',
      email: session.user?.email || '',
      phone: (session.user as any)?.phone || '',
      whatsapp: (session.user as any)?.whatsapp || '',
      neighborhood: (session.user as any)?.neighborhood || '',
    });
  }, [session, status, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        await update(); // Update session data
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro interno do servidor' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao alterar senha' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro interno do servidor' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmation !== 'EXCLUIR') {
      setMessage({ type: 'error', text: 'Digite "EXCLUIR" para confirmar' });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Sign out and redirect to home
        await signOut({ callbackUrl: '/' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao excluir conta' });
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro interno do servidor' });
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas informações pessoais e configurações de conta.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <CheckIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Informações do Perfil</h2>
              <p className="text-sm text-gray-600">
                Atualize suas informações pessoais e de contato.
              </p>
            </div>
            <form onSubmit={handleProfileSubmit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    <UserIcon className="inline h-4 w-4 mr-1" />
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    <EnvelopeIcon className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    <PhoneIcon className="inline h-4 w-4 mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="(42) 99999-9999"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    value={profileData.whatsapp}
                    onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                    placeholder="(42) 99999-9999"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                    <MapPinIcon className="inline h-4 w-4 mr-1" />
                    Bairro
                  </label>
                  <select
                    id="neighborhood"
                    value={profileData.neighborhood}
                    onChange={(e) => setProfileData({ ...profileData, neighborhood: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione seu bairro</option>
                    {GUARAPUAVA_NEIGHBORHOODS.map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Alterar Senha</h2>
              <p className="text-sm text-gray-600">
                Mantenha sua conta segura com uma senha forte.
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  <KeyIcon className="inline h-4 w-4 mr-1" />
                  Senha atual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Alterando...' : 'Alterar senha'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white shadow rounded-lg border border-red-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-red-900">Zona de Perigo</h2>
              <p className="text-sm text-red-600">
                Ações irreversíveis que afetam permanentemente sua conta.
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Excluir conta</h3>
                  <p className="text-sm text-gray-500">
                    Remove permanentemente sua conta e todos os seus dados.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Excluir conta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-red-900">Excluir Conta</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-start space-x-3 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 font-medium mb-2">
                      Esta ação não pode ser desfeita!
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo:
                    </p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
                      <li>Todos os seus anúncios</li>
                      <li>Histórico de conversas</li>
                      <li>Avaliações recebidas</li>
                      <li>Informações do perfil</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="deleteConfirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Para confirmar, digite <strong>EXCLUIR</strong> no campo abaixo:
                  </label>
                  <input
                    type="text"
                    id="deleteConfirmation"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Digite EXCLUIR"
                    disabled={isDeleting}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  onClick={cancelDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== 'EXCLUIR'}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir Conta Definitivamente'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
