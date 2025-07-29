import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

export const preference = new Preference(client);

// Tipos para o Mercado Pago
export interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  currency_id: 'BRL';
}

export interface CreatePreferenceData {
  items: PreferenceItem[];
  payer: {
    name: string;
    email: string;
    phone?: {
      area_code: string;
      number: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved' | 'all';
  external_reference: string;
  notification_url: string;
  metadata: {
    user_id: string;
    plan_id?: string;
    product_id?: string;
    highlight_type?: string;
    duration?: string;
    type?: string;
  };
}

// Função para criar preferência de pagamento
export async function createPaymentPreference(data: CreatePreferenceData) {
  try {
    const response = await preference.create({
      body: data
    });
    
    return {
      success: true,
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    };
  } catch (error) {
    console.error('Erro ao criar preferência MP:', error);
    return {
      success: false,
      error: 'Erro ao processar pagamento'
    };
  }
}

// Planos disponíveis
export const SUBSCRIPTION_PLANS = {
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 19.90,
    maxListings: 15,
    maxImages: 10,
    canHighlight: true,
    hasAnalytics: true,
    priority: 1
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 39.90,
    maxListings: -1, // Ilimitado
    maxImages: -1,   // Ilimitado
    canHighlight: true,
    hasAnalytics: true,
    priority: 2
  }
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;
