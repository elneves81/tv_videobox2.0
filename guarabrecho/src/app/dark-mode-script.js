// Script de modo escuro que funciona independente do React
// Inserir este código no <head> da página

(function() {
  console.log('🔥 SCRIPT MODO ESCURO - Iniciando...');
  
  // Aplicar tema inicial imediatamente
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
  
  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
    console.log('🔥 SCRIPT - Aplicado tema escuro inicial');
  }
  
  // Aguardar DOM carregar
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 SCRIPT - DOM carregado, criando botão...');
    
    // Criar botão de teste
    const button = document.createElement('button');
    button.innerHTML = '🌙 TOGGLE TEMA';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 15px 20px;
      background: #ef4444;
      color: white;
      border: 3px solid #fbbf24;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    // Adicionar evento de clique
    button.addEventListener('click', function() {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      
      console.log('🔥 SCRIPT - Botão clicado! Atual:', isDark ? 'ESCURO' : 'CLARO');
      
      if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        button.innerHTML = '🌙 MODO ESCURO';
        button.style.background = '#ef4444';
        console.log('🔥 SCRIPT - Mudou para CLARO');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        button.innerHTML = '☀️ MODO CLARO';
        button.style.background = '#10b981';
        console.log('🔥 SCRIPT - Mudou para ESCURO');
      }
      
      console.log('🔥 SCRIPT - Classes HTML:', html.className);
    });
    
    // Adicionar ao DOM
    document.body.appendChild(button);
    
    // Atualizar botão baseado no tema atual
    const currentDark = document.documentElement.classList.contains('dark');
    if (currentDark) {
      button.innerHTML = '☀️ MODO CLARO';
      button.style.background = '#10b981';
    }
    
    console.log('🔥 SCRIPT - Botão criado e adicionado!');
  });
  
  console.log('🔥 SCRIPT MODO ESCURO - Configurado!');
})();
