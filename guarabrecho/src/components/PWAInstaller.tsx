'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed/standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay (only if not already dismissed)
      const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!hasBeenDismissed && !standalone) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 10000); // Show after 10 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or no prompt available
  if (isStandalone || (!deferredPrompt && !isIOS)) {
    return null;
  }

  // iOS install instructions
  if (isIOS && !isStandalone) {
    if (!showInstallPrompt) return null;

    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Instalar App
            </h3>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Instale o GuaraBrechó na sua tela inicial para uma experiência melhor!
        </p>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>1. Toque no botão <strong>Compartilhar</strong> ⬆️</p>
          <p>2. Selecione <strong>Adicionar à Tela Inicial</strong></p>
          <p>3. Toque em <strong>Adicionar</strong></p>
        </div>
      </div>
    );
  }

  // Android/Desktop install prompt
  if (!showInstallPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <ArrowDownTrayIcon className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Instalar App
          </h3>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Instale o GuaraBrechó para acesso rápido, notificações e experiência offline!
      </p>
      
      <div className="flex space-x-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm transition-colors"
        >
          Mais tarde
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Funciona offline • Atualizações automáticas • Notificações
        </div>
      </div>
    </div>
  );
}
