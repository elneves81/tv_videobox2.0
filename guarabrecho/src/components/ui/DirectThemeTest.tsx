"use client";

import { useEffect, useState } from 'react';

export default function DirectThemeTest() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    console.log('🔥 DirectThemeTest - Mounted!');
    
    // Aplicar CSS diretamente
    const applyDirectCSS = () => {
      const existingStyle = document.getElementById('direct-dark-mode-css');
      if (existingStyle) existingStyle.remove();

      const style = document.createElement('style');
      style.id = 'direct-dark-mode-css';
      style.innerHTML = `
        .dark-mode-test {
          background-color: ${isDark ? '#1f2937' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#000000'};
          transition: all 0.3s ease;
        }
        
        .dark-mode-test-card {
          background-color: ${isDark ? '#374151' : '#f9fafb'};
          color: ${isDark ? '#e5e7eb' : '#374151'};
          border: 2px solid ${isDark ? '#10b981' : '#ef4444'};
          transition: all 0.3s ease;
        }
        
        html.dark body {
          background-color: #111827 !important;
          color: #ffffff !important;
        }
        
        html.dark .bg-white {
          background-color: #1f2937 !important;
        }
        
        html.dark .text-gray-900 {
          color: #ffffff !important;
        }
        
        html.dark .text-gray-600 {
          color: #d1d5db !important;
        }
        
        html.dark .bg-gray-50 {
          background-color: #111827 !important;
        }
      `;
      document.head.appendChild(style);
    };

    applyDirectCSS();

    // Função global
    (window as any).directToggle = () => {
      const html = document.documentElement;
      const newIsDark = !html.classList.contains('dark');
      
      console.log('🔧 DIRECT TOGGLE - Setting to:', newIsDark ? 'DARK' : 'LIGHT');
      
      if (newIsDark) {
        html.classList.add('dark');
        html.style.backgroundColor = '#111827';
        html.style.color = '#ffffff';
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        html.style.backgroundColor = '#ffffff';
        html.style.color = '#000000';
        localStorage.setItem('theme', 'light');
      }
      
      setIsDark(newIsDark);
      
      console.log('🔧 DIRECT TOGGLE - Applied. DOM classes:', html.className);
      console.log('🔧 DIRECT TOGGLE - Background color:', html.style.backgroundColor);
    };

    // Aplicar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#111827';
      document.documentElement.style.color = '#ffffff';
      setIsDark(true);
    }

  }, [isDark]);

  const handleClick = () => {
    console.log('🔥 DirectThemeTest - Button clicked!');
    
    const html = document.documentElement;
    const newIsDark = !isDark;
    
    console.log('🔥 DirectThemeTest - Toggling to:', newIsDark ? 'DARK' : 'LIGHT');
    
    if (newIsDark) {
      html.classList.add('dark');
      html.style.backgroundColor = '#111827';
      html.style.color = '#ffffff';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.style.backgroundColor = '#ffffff';
      html.style.color = '#000000';
      localStorage.setItem('theme', 'light');
    }
    
    setIsDark(newIsDark);
    
    console.log('🔥 DirectThemeTest - Applied! isDark:', newIsDark);
    console.log('🔥 DirectThemeTest - HTML classes:', html.className);
  };

  return (
    <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 9999 }}>
      <button
        onClick={handleClick}
        style={{
          padding: '15px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: isDark ? '#10b981' : '#ef4444',
          color: 'white',
          border: '3px solid #fbbf24',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
      >
        {isDark ? '🌞 MODO CLARO' : '🌙 MODO ESCURO'}
      </button>
      
      <div 
        className="dark-mode-test-card"
        style={{
          marginTop: '10px',
          padding: '15px',
          borderRadius: '8px',
          maxWidth: '250px'
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
          TESTE DE TEMA
        </h3>
        <p style={{ margin: '0', fontSize: '14px' }}>
          Modo atual: <strong>{isDark ? 'ESCURO 🌙' : 'CLARO ☀️'}</strong>
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
          Se as cores mudaram, o tema está funcionando!
        </p>
      </div>
      
      <div 
        className="dark-mode-test"
        style={{
          marginTop: '10px',
          padding: '10px',
          borderRadius: '8px',
          border: '2px dashed #6b7280',
          fontSize: '12px',
          maxWidth: '250px'
        }}
      >
        <p style={{ margin: '0' }}>
          Console: <code style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>
            directToggle()
          </code>
        </p>
      </div>
    </div>
  );
}
