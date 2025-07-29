'use client';

import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface SimpleThemeToggleProps {
  className?: string;
}

export const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  
  // Tentar usar o contexto, mas ter fallback se não estiver disponível
  let theme, actualTheme, setTheme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    actualTheme = themeContext.actualTheme;
    setTheme = themeContext.setTheme;
  } catch {
    // Fallback para quando não há ThemeProvider
    theme = 'light';
    actualTheme = 'light';
    setTheme = () => {};
  }
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    // Alternar entre light e dark (pular system para simplicidade)
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}>
        <SunIcon className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        p-2 rounded-lg transition-colors duration-200
        bg-gray-100 dark:bg-gray-800 
        hover:bg-gray-200 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-400
        border border-gray-200 dark:border-gray-600
        ${className}
      `}
      title={actualTheme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      {actualTheme === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
};

// Componente mais avançado para páginas internas
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    setMounted(true);
    
    // Detectar tema salvo
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const theme = savedTheme || 'system';
    setCurrentTheme(theme);
    
    // Calcular tema atual
    const getActualTheme = (themeMode: 'light' | 'dark' | 'system') => {
      if (themeMode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return themeMode;
    };
    
    const actual = getActualTheme(theme);
    setActualTheme(actual);
    
    // Aplicar no DOM
    if (actual === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const actual = newTheme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    
    setActualTheme(actual);
    
    if (actual === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={`p-2 rounded-lg bg-gray-100 ${className}`}>
        <SunIcon className="w-4 h-4 text-gray-400" />
      </div>
    );
  }

  const themes = [
    { key: 'light' as const, label: 'Claro', icon: SunIcon },
    { key: 'dark' as const, label: 'Escuro', icon: MoonIcon },
    { key: 'system' as const, label: 'Sistema', icon: ComputerDesktopIcon }
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {themes.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${currentTheme === key 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title={label}
          >
            <Icon className="w-4 h-4" />
            {showLabel && <span className="ml-2">{label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
