/**
 * Gera uma mensagem pré-formatada para WhatsApp
 */
export function generateWhatsAppMessage(product: {
  title: string;
  price?: number | null;
  type: string;
  user: {
    name?: string | null;
  };
}) {
  const typeText = {
    VENDA: "venda",
    TROCA: "troca", 
    DOACAO: "doação"
  }[product.type] || "produto";

  const priceText = product.price && product.type === "VENDA" 
    ? ` por R$ ${product.price.toFixed(2).replace('.', ',')}` 
    : '';

  return encodeURIComponent(
    `Olá ${product.user.name || ''}! Vi seu anúncio no GuaraBrechó sobre "${product.title}"${priceText} para ${typeText}. Tenho interesse!`
  );
}

/**
 * Gera link completo para WhatsApp
 */
export function generateWhatsAppLink(phone: string, message: string) {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não tiver
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

/**
 * Formata valor monetário para exibição
 */
export function formatPrice(price: number | null) {
  if (!price) return "Gratuito";
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

/**
 * Traduz condição do produto
 */
export function translateCondition(condition: string) {
  const translations = {
    NOVO: "Novo",
    SEMINOVO: "Semi-novo",
    USADO: "Usado",
    PARA_REPARO: "Para reparo"
  };
  
  return translations[condition as keyof typeof translations] || condition;
}

/**
 * Traduz tipo do produto
 */
export function translateType(type: string) {
  const translations = {
    VENDA: "Venda",
    TROCA: "Troca", 
    DOACAO: "Doação"
  };
  
  return translations[type as keyof typeof translations] || type;
}
