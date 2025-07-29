/**
 * Sistema de Comissões do GuaraBrechó
 * Calcula taxas e comissões sobre vendas realizadas na plataforma
 */

export interface CommissionConfig {
  platformRate: number; // Taxa da plataforma (10%)
  paymentProcessingRate: number; // Taxa do processamento de pagamento
  minimumCommission: number; // Comissão mínima
  maximumCommission?: number; // Comissão máxima (opcional)
}

export interface CommissionCalculation {
  salePrice: number;
  platformCommission: number;
  paymentProcessingFee: number;
  totalFees: number;
  sellerAmount: number;
  platformRevenue: number;
}

// Configuração padrão das comissões
export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  platformRate: 0.10, // 10%
  paymentProcessingRate: 0.0299, // ~3% (taxa típica do Mercado Pago)
  minimumCommission: 2.00, // R$ 2,00 mínimo
  maximumCommission: 50.00, // R$ 50,00 máximo (opcional)
};

/**
 * Calcula a comissão e valores para uma venda
 */
export function calculateCommission(
  salePrice: number,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): CommissionCalculation {
  if (salePrice <= 0) {
    throw new Error('Preço de venda deve ser maior que zero');
  }

  // Calcula a comissão da plataforma
  let platformCommission = salePrice * config.platformRate;
  
  // Aplica comissão mínima e máxima
  if (platformCommission < config.minimumCommission) {
    platformCommission = config.minimumCommission;
  }
  
  if (config.maximumCommission && platformCommission > config.maximumCommission) {
    platformCommission = config.maximumCommission;
  }

  // Calcula taxa de processamento de pagamento
  const paymentProcessingFee = salePrice * config.paymentProcessingRate;
  
  // Total de taxas
  const totalFees = platformCommission + paymentProcessingFee;
  
  // Valor que o vendedor recebe
  const sellerAmount = salePrice - totalFees;
  
  // Receita da plataforma (comissão menos custos de processamento)
  const platformRevenue = platformCommission;

  return {
    salePrice,
    platformCommission,
    paymentProcessingFee,
    totalFees,
    sellerAmount,
    platformRevenue,
  };
}

/**
 * Formata valores monetários para exibição
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Calcula o percentual de comissão efetivo
 */
export function getEffectiveCommissionRate(
  salePrice: number,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): number {
  const calculation = calculateCommission(salePrice, config);
  return (calculation.platformCommission / salePrice) * 100;
}

/**
 * Valida se um preço é válido para venda
 */
export function validateSalePrice(price: number): { valid: boolean; message?: string } {
  if (price <= 0) {
    return { valid: false, message: 'Preço deve ser maior que zero' };
  }
  
  if (price < 5.00) {
    return { 
      valid: false, 
      message: 'Preço mínimo para venda é R$ 5,00 (devido às taxas de processamento)' 
    };
  }
  
  if (price > 50000.00) {
    return { 
      valid: false, 
      message: 'Preço máximo para venda é R$ 50.000,00' 
    };
  }
  
  return { valid: true };
}

/**
 * Gera breakdown detalhado da comissão para exibir ao usuário
 */
export function getCommissionBreakdown(salePrice: number): {
  breakdown: Array<{ label: string; amount: number; percentage: number }>;
  calculation: CommissionCalculation;
} {
  const calculation = calculateCommission(salePrice);
  
  const breakdown = [
    {
      label: 'Preço de Venda',
      amount: calculation.salePrice,
      percentage: 100,
    },
    {
      label: 'Comissão GuaraBrechó (10%)',
      amount: -calculation.platformCommission,
      percentage: (calculation.platformCommission / calculation.salePrice) * 100,
    },
    {
      label: 'Taxa de Processamento (~3%)',
      amount: -calculation.paymentProcessingFee,
      percentage: (calculation.paymentProcessingFee / calculation.salePrice) * 100,
    },
    {
      label: 'Valor a Receber',
      amount: calculation.sellerAmount,
      percentage: (calculation.sellerAmount / calculation.salePrice) * 100,
    },
  ];
  
  return { breakdown, calculation };
}

/**
 * Calcula comissões para diferentes faixas de preço (para exibir em tabelas)
 */
export function getCommissionTable(): Array<{
  priceRange: string;
  commission: number;
  sellerReceives: number;
  effectiveRate: number;
}> {
  const prices = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000];
  
  return prices.map(price => {
    const calculation = calculateCommission(price);
    const effectiveRate = getEffectiveCommissionRate(price);
    
    return {
      priceRange: formatCurrency(price),
      commission: calculation.platformCommission,
      sellerReceives: calculation.sellerAmount,
      effectiveRate: Math.round(effectiveRate * 100) / 100,
    };
  });
}
