/**
 * Utilitários para detectar e otimizar para dispositivos móveis
 */

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'mobile'
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isSafari = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('safari') && !userAgent.includes('chrome');
};

export const getTouchSupport = () => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Retorna classes CSS otimizadas para o dispositivo atual
 */
export const getMobileOptimizedClasses = () => {
  const classes = [];
  
  if (isMobile()) {
    classes.push('mobile-optimized');
  }
  
  if (isIOS()) {
    classes.push('ios-optimized');
  }
  
  if (isSafari()) {
    classes.push('safari-optimized');
  }
  
  if (getTouchSupport()) {
    classes.push('touch-optimized');
  }
  
  return classes.join(' ');
};

/**
 * Configurações de imagem otimizadas para mobile
 */
export const getMobileImageConfig = () => {
  const config = {
    loading: 'lazy' as const,
    decoding: 'async' as const,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  };
  
  if (isMobile()) {
    config.sizes = '100vw';
  }
  
  return config;
};

/**
 * Hook para detectar se está em um dispositivo móvel
 */
export const useMobileDetection = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isIOS: false,
      isSafari: false,
      hasTouch: false,
      optimizedClasses: ''
    };
  }
  
  return {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isSafari: isSafari(),
    hasTouch: getTouchSupport(),
    optimizedClasses: getMobileOptimizedClasses()
  };
};
