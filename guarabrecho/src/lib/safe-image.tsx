'use client';

/**
 * Utilitário global para gerenciar imagens na aplicação
 * Resolve problemas de base64 malformado e garante exibição segura
 */

import { getMobileImageConfig } from './mobile-utils';

export interface ImageValidationResult {
  isValid: boolean;
  url: string | null;
  error?: string;
}

/**
 * Valida se uma data URL de imagem é válida e segura
 */
export function validateImageDataUrl(dataUrl: string): ImageValidationResult {
  try {
    if (!dataUrl || typeof dataUrl !== 'string') {
      return { isValid: false, url: null, error: 'URL vazia ou inválida' };
    }

    if (!dataUrl.startsWith('data:image/')) {
      return { isValid: false, url: null, error: 'Não é uma data URL de imagem' };
    }

    // Verificar formato base64
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) {
      return { isValid: false, url: null, error: 'Formato base64 inválido' };
    }

    const base64Data = matches[2];
    
    // Verificar se o base64 não está vazio ou muito pequeno
    if (!base64Data || base64Data.length < 50) {
      return { isValid: false, url: null, error: 'Dados base64 insuficientes' };
    }

    // Verificar se é base64 válido
    try {
      atob(base64Data);
    } catch {
      return { isValid: false, url: null, error: 'Base64 corrompido' };
    }

    // Verificar tamanho (máximo 1MB em base64 ≈ 1.4MB)
    if (base64Data.length > 1400000) {
      return { isValid: false, url: null, error: 'Imagem muito grande' };
    }

    return { isValid: true, url: dataUrl };
  } catch (error) {
    return { 
      isValid: false, 
      url: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

/**
 * Extrai a primeira imagem válida de uma string de imagens
 */
export function getFirstValidImage(imagesString: string | null | undefined): ImageValidationResult {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [getFirstValidImage] Entrada:', typeof imagesString, imagesString?.length);
  }
  
  if (!imagesString) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ [getFirstValidImage] Nenhuma imagem fornecida');
    }
    return { isValid: false, url: null, error: 'Nenhuma imagem fornecida' };
  }

  // PRIMEIRO verificar se tem vírgulas (múltiplas imagens)
  // Se tem vírgulas, NÃO é uma imagem única, mesmo que comece com data:image/
  if (imagesString.includes(',')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 [getFirstValidImage] Múltiplas imagens detectadas (tem vírgulas)');
    }
    
    // Tentar primeiro como JSON array
    try {
      const parsed = JSON.parse(imagesString);
      if (Array.isArray(parsed)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('📋 [getFirstValidImage] JSON array válido com', parsed.length, 'imagens');
        }
        for (let i = 0; i < parsed.length; i++) {
          const image = parsed[i];
          if (image && image.startsWith('data:image/')) {
            const validation = validateImageDataUrl(image);
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ [getFirstValidImage] JSON Imagem ${i} validação:`, validation.isValid);
            }
            if (validation.isValid) {
              return validation;
            }
          }
        }
      }
    } catch {
      if (process.env.NODE_ENV === 'development') {
        console.log('📋 [getFirstValidImage] JSON parse falhou, tentando CSV inteligente');
      }
    }
    
    // Se JSON falhou, usar parsing CSV inteligente
    // As vírgulas podem estar dentro dos dados base64, então precisamos reconstruir
    const parts = imagesString.split(',');
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 [getFirstValidImage] CSV tem', parts.length, 'partes');
    }
    
    // Tentar reconstruir as imagens
    const reconstructedImages: string[] = [];
    let currentImage = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      
      if (part.startsWith('data:image/')) {
        // Se já temos uma imagem sendo construída, salvá-la
        if (currentImage) {
          reconstructedImages.push(currentImage);
        }
        // Iniciar nova imagem
        currentImage = part;
      } else if (currentImage) {
        // Continuar construindo a imagem atual
        currentImage += ',' + part;
      }
    }
    
    // Adicionar a última imagem
    if (currentImage) {
      reconstructedImages.push(currentImage);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 [getFirstValidImage] Reconstruídas', reconstructedImages.length, 'imagens');
    }
    
    // Testar as imagens reconstruídas
    for (let i = 0; i < reconstructedImages.length; i++) {
      const image = reconstructedImages[i];
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 [getFirstValidImage] Testando imagem reconstruída ${i}:`, image.substring(0, 50) + '...');
      }
      
      if (image.startsWith('data:image/')) {
        const validation = validateImageDataUrl(image);
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [getFirstValidImage] Imagem reconstruída ${i} validação:`, validation.isValid);
        }
        if (validation.isValid) {
          return validation;
        }
      }
    }
    
  } else if (imagesString.startsWith('data:image/')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ [getFirstValidImage] Imagem única detectada');
    }
    const result = validateImageDataUrl(imagesString);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [getFirstValidImage] Validação imagem única:', result.isValid);
    }
    return result;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('❌ [getFirstValidImage] Nenhuma imagem válida encontrada');
  }
  return { isValid: false, url: null, error: 'Nenhuma imagem válida encontrada' };
}

/**
 * Extrai uma imagem específica por índice
 */
export function getImageByIndex(imagesString: string | null | undefined, index: number): ImageValidationResult {
  if (!imagesString || index < 0) {
    return { isValid: false, url: null, error: 'Nenhuma imagem fornecida ou índice inválido' };
  }

  // Se é uma única imagem e index é 0
  if (!imagesString.includes(',') && imagesString.startsWith('data:image/') && index === 0) {
    return validateImageDataUrl(imagesString);
  }

  // Usar a mesma lógica de reconstrução da getFirstValidImage
  let images: string[] = [];
  
  // Tentar primeiro como JSON array
  try {
    const parsed = JSON.parse(imagesString);
    if (Array.isArray(parsed)) {
      images = parsed;
    }
  } catch {
    // Parsing CSV inteligente para reconstruir imagens
    const parts = imagesString.split(',');
    let currentImage = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      
      if (part.startsWith('data:image/')) {
        if (currentImage) {
          images.push(currentImage);
        }
        currentImage = part;
      } else if (currentImage) {
        currentImage += ',' + part;
      }
    }
    
    if (currentImage) {
      images.push(currentImage);
    }
  }

  if (index >= images.length) {
    return { isValid: false, url: null, error: 'Índice fora do alcance' };
  }

  const image = images[index];
  if (image && image.startsWith('data:image/')) {
    return validateImageDataUrl(image);
  }

  return { isValid: false, url: null, error: 'Imagem não encontrada ou inválida' };
}

/**
 * Conta quantas imagens válidas existem na string
 */
export function countValidImages(imagesString: string | null | undefined): number {
  if (!imagesString) {
    return 0;
  }

  // Se é uma única imagem (sem vírgulas)
  if (!imagesString.includes(',') && imagesString.startsWith('data:image/')) {
    const validation = validateImageDataUrl(imagesString);
    return validation.isValid ? 1 : 0;
  }

  // Usar a mesma lógica de reconstrução inteligente
  let images: string[] = [];
  
  // Tentar primeiro como JSON array
  try {
    const parsed = JSON.parse(imagesString);
    if (Array.isArray(parsed)) {
      images = parsed;
    }
  } catch {
    // Parsing CSV inteligente para reconstruir imagens
    const parts = imagesString.split(',');
    let currentImage = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      
      if (part.startsWith('data:image/')) {
        if (currentImage) {
          images.push(currentImage);
        }
        currentImage = part;
      } else if (currentImage) {
        currentImage += ',' + part;
      }
    }
    
    if (currentImage) {
      images.push(currentImage);
    }
  }

  let validCount = 0;
  for (const image of images) {
    if (image && image.startsWith('data:image/')) {
      const validation = validateImageDataUrl(image);
      if (validation.isValid) {
        validCount++;
      }
    }
  }

  return validCount;
}

/**
 * Componente React para exibir imagens com fallback seguro
 */
interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imageIndex?: number; // For selecting specific image from array
  fallbackIcon?: React.ReactNode;
  onError?: (error: string) => void;
}

export function SafeImage({ 
  src, 
  alt, 
  className = '', 
  imageIndex = 0,
  fallbackIcon,
  onError 
}: SafeImageProps) {
  // Debug logs apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 [SafeImage] Iniciando com:', {
      srcType: typeof src,
      srcLength: src?.length,
      imageIndex,
      alt,
      hasCommas: src?.includes(','),
      startsWithData: src?.startsWith('data:image/'),
      preview: src?.substring(0, 100) + '...'
    });
  }

  // Get specific image by index or first image if index is 0
  const validation = imageIndex > 0 
    ? getImageByIndex(src, imageIndex)
    : getFirstValidImage(src);

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 [SafeImage] Resultado da validação:', {
      isValid: validation.isValid,
      hasUrl: !!validation.url,
      error: validation.error,
      imageIndex
    });
  }

  // Log de erro apenas em desenvolvimento
  if (!validation.isValid && process.env.NODE_ENV === 'development') {
    console.warn(`❌ [SafeImage] Falha na validação: ${validation.error}`, { 
      src: src?.substring(0, 100), 
      alt, 
      imageIndex 
    });
    onError?.(validation.error || 'Erro desconhecido');
  }

  if (!validation.isValid || !validation.url) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ [SafeImage] Mostrando fallback');
    }
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        {fallbackIcon || (
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded mx-auto mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Imagem indisponível</p>
          </div>
        )}
      </div>
    );
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ [SafeImage] Renderizando imagem válida');
  }

  const mobileConfig = getMobileImageConfig();
  
  return (
    <div className={`safe-image-container ${className}`}>
      <img
        src={validation.url}
        alt={alt}
        className="mobile-image-fix ios-image-fix"
        loading={mobileConfig.loading}
        decoding={mobileConfig.decoding}
        sizes={mobileConfig.sizes}
        onError={(e) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('💥 [SafeImage] Erro no onError da imagem:', { src, alt });
          }
          onError?.('Erro ao carregar imagem');
          // Substituir por placeholder
          const target = e.target as HTMLImageElement;
          const container = target.parentElement;
          if (container) {
            container.innerHTML = `
              <div class="flex items-center justify-center h-full w-full bg-gray-100">
                <div class="text-center">
                  <div class="w-8 h-8 bg-gray-400 rounded mx-auto mb-2"></div>
                  <p class="text-gray-500 text-xs">Imagem indisponível</p>
                </div>
              </div>
            `;
          }
        }}
        onLoad={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('🎉 [SafeImage] Imagem carregada com sucesso');
          }
        }}
      />
    </div>
  );
}

/**
 * Hook para usar imagens com validação
 */
export function useValidatedImage(src: string | null | undefined) {
  const validation = getFirstValidImage(src);
  
  return {
    isValid: validation.isValid,
    url: validation.url,
    error: validation.error
  };
}
