"use client";

import { useEffect } from 'react';

export default function TestThemeToggle() {
  useEffect(() => {
    console.log('🔥 TestThemeToggle - Mounted!');
    
    // Função global para testar
    (window as any).forceToggleTheme = () => {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      
      console.log('🔧 FORCE TOGGLE - Current dark:', isDark);
      
      if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        console.log('🔧 FORCE TOGGLE - Set to LIGHT');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        console.log('🔧 FORCE TOGGLE - Set to DARK');
      }
      
      console.log('🔧 FORCE TOGGLE - DOM dark class:', html.classList.contains('dark'));
      console.log('🔧 FORCE TOGGLE - All classes:', html.className);
    };
    
    // Auto-aplicar tema se salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('🔥 TestThemeToggle - Applied saved dark theme');
    }
    
  }, []);

  const handleClick = () => {
    console.log('🔥 TestThemeToggle - Button clicked!');
    
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    console.log('🔥 TestThemeToggle - Current dark:', isDark);
    
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('🔥 TestThemeToggle - Changed to LIGHT');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('🔥 TestThemeToggle - Changed to DARK');
    }
    
    console.log('🔥 TestThemeToggle - Final DOM dark class:', html.classList.contains('dark'));
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded shadow-lg border-4 border-yellow-400"
        style={{ minWidth: '120px', minHeight: '50px' }}
      >
        TESTE TEMA
      </button>
      <div className="mt-2 p-2 bg-white dark:bg-gray-900 text-black dark:text-white border-2 border-blue-500 rounded">
        <p className="text-xs">
          Modo: <span className="dark:hidden">CLARO</span><span className="hidden dark:inline">ESCURO</span>
        </p>
      </div>
    </div>
  );
}
