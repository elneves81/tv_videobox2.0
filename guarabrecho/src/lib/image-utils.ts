/**
 * Utilitários para compressão de imagens no servidor
 */
import sharp from 'sharp';

/**
 * Comprime uma imagem base64 no servidor com qualidade progressiva
 * @param dataUrl String da imagem em base64 data URL
 * @param maxSizeKB Tamanho máximo em KB permitido para a imagem
 * @returns String comprimida da imagem em base64 data URL
 */
export async function compressImageServer(dataUrl: string, maxSizeKB = 200): Promise<string> {
  // Se não for uma data URL, retorna a mesma string
  if (!dataUrl.startsWith('data:image')) {
    return dataUrl;
  }

  // Se já estiver abaixo do tamanho máximo, retorna a mesma string
  const initialSizeKB = Math.round(dataUrl.length / 1024);
  if (initialSizeKB <= maxSizeKB) {
    return dataUrl;
  }

  try {
    // Extrai o MIME type e os dados binários da data URL
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return dataUrl; // Formato inválido, retorna original
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    const binaryData = Buffer.from(base64Data, 'base64');
    
    // Calcula a qualidade baseada no tamanho atual vs desejado
    // Quanto maior a imagem original, menor a qualidade
    const quality = Math.max(10, Math.min(80, Math.floor(maxSizeKB / initialSizeKB * 100)));
    
    // Redimensionar e comprimir usando Sharp
    const resizedImageBuffer = await sharp(binaryData)
      .resize(600, 400, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, progressive: true })
      .toBuffer();
    
    // Convertemos de volta para base64
    const resizedBase64 = resizedImageBuffer.toString('base64');
    
    // Reconstruir a data URL
    return `data:image/jpeg;base64,${resizedBase64}`;
  } catch (error) {
    console.warn('Erro ao comprimir imagem no servidor:', 
      error instanceof Error ? error.message : 'Erro desconhecido');
    return dataUrl; // Em caso de erro, retorna a imagem original
  }
}

/**
 * Processa um array de imagens em data URL e comprime cada uma
 * @param imageUrls Array de URLs de imagens ou string única com URLs separadas por vírgula
 * @returns String com URLs de imagens comprimidas separadas por vírgula
 */
export async function compressMultipleImages(imageUrls: string | string[]): Promise<string> {
  try {
    // Se for uma string única, divide por vírgula
    const images = typeof imageUrls === 'string' 
      ? imageUrls.split(',').filter(img => img.trim() !== '') 
      : imageUrls;
    
    // Comprime cada imagem individualmente
    const compressedImages = await Promise.all(
      images.map(img => compressImageServer(img.trim()))
    );
    
    // Junta novamente as URLs em uma única string
    return compressedImages.join(',');
  } catch (error) {
    console.warn('Erro ao processar múltiplas imagens:', 
      error instanceof Error ? error.message : 'Erro desconhecido');
    return typeof imageUrls === 'string' ? imageUrls : imageUrls.join(',');
  }
}
