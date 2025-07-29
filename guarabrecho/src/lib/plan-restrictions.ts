// Utility functions for plan restrictions and features

export type UserPlan = 'FREE' | 'PREMIUM' | 'PRO';

export interface PlanLimits {
  maxListings: number;
  maxImages: number;
  canHighlight: boolean;
  hasAnalytics: boolean;
  priority: number;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  FREE: {
    maxListings: 3,
    maxImages: 3,
    canHighlight: false,
    hasAnalytics: false,
    priority: 0
  },
  PREMIUM: {
    maxListings: 15,
    maxImages: 10,
    canHighlight: true,
    hasAnalytics: true,
    priority: 1
  },
  PRO: {
    maxListings: -1, // Unlimited
    maxImages: -1,   // Unlimited
    canHighlight: true,
    hasAnalytics: true,
    priority: 2
  }
};

export interface User {
  id: string;
  currentPlan: UserPlan;
  planExpiresAt?: Date | null;
}

export interface UserWithProducts extends User {
  products: { id: string }[];
}

// Check if user can create new listing
export function canCreateListing(user: UserWithProducts): {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
} {
  const limits = PLAN_LIMITS[user.currentPlan];
  const currentListings = user.products.length;

  // Check if plan is expired
  if (user.planExpiresAt && new Date() > user.planExpiresAt) {
    return {
      allowed: false,
      reason: 'Plano expirado. Renove sua assinatura para continuar criando anúncios.'
    };
  }

  // Unlimited listings for PRO
  if (limits.maxListings === -1) {
    return { allowed: true };
  }

  // Check listing limit
  if (currentListings >= limits.maxListings) {
    return {
      allowed: false,
      reason: `Limite de ${limits.maxListings} anúncios atingido. Upgrade seu plano para criar mais anúncios.`,
      limit: limits.maxListings,
      current: currentListings
    };
  }

  return { 
    allowed: true,
    limit: limits.maxListings,
    current: currentListings
  };
}

// Check if user can upload more images
export function canUploadImages(user: User, currentImageCount: number, newImageCount: number): {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
} {
  const limits = PLAN_LIMITS[user.currentPlan];
  const totalImages = currentImageCount + newImageCount;

  // Check if plan is expired
  if (user.planExpiresAt && new Date() > user.planExpiresAt) {
    return {
      allowed: false,
      reason: 'Plano expirado. Renove sua assinatura para adicionar imagens.'
    };
  }

  // Unlimited images for PRO
  if (limits.maxImages === -1) {
    return { allowed: true };
  }

  // Check image limit
  if (totalImages > limits.maxImages) {
    return {
      allowed: false,
      reason: `Limite de ${limits.maxImages} imagens por produto atingido. Upgrade seu plano para adicionar mais imagens.`,
      limit: limits.maxImages,
      current: currentImageCount
    };
  }

  return { 
    allowed: true,
    limit: limits.maxImages,
    current: currentImageCount
  };
}

// Check if user can highlight products
export function canHighlightProduct(user: User): {
  allowed: boolean;
  reason?: string;
} {
  const limits = PLAN_LIMITS[user.currentPlan];

  // Check if plan is expired
  if (user.planExpiresAt && new Date() > user.planExpiresAt) {
    return {
      allowed: false,
      reason: 'Plano expirado. Renove sua assinatura para destacar produtos.'
    };
  }

  if (!limits.canHighlight) {
    return {
      allowed: false,
      reason: 'Recurso de destaque disponível apenas para planos Premium e Pro.'
    };
  }

  return { allowed: true };
}

// Check if user can access analytics
export function canAccessAnalytics(user: User): {
  allowed: boolean;
  reason?: string;
} {
  const limits = PLAN_LIMITS[user.currentPlan];

  // Check if plan is expired
  if (user.planExpiresAt && new Date() > user.planExpiresAt) {
    return {
      allowed: false,
      reason: 'Plano expirado. Renove sua assinatura para acessar analytics.'
    };
  }

  if (!limits.hasAnalytics) {
    return {
      allowed: false,
      reason: 'Analytics disponível apenas para planos Premium e Pro.'
    };
  }

  return { allowed: true };
}

// Get available highlight types for user
export function getAvailableHighlightTypes(user: User): string[] {
  const limits = PLAN_LIMITS[user.currentPlan];

  if (!limits.canHighlight) {
    return [];
  }

  switch (user.currentPlan) {
    case 'PREMIUM':
      return ['BASIC', 'PREMIUM'];
    case 'PRO':
      return ['BASIC', 'PREMIUM', 'GOLD'];
    default:
      return [];
  }
}

// Check if user plan is expired
export function isPlanExpired(user: User): boolean {
  if (!user.planExpiresAt) return false;
  return new Date() > user.planExpiresAt;
}

// Get days until plan expires
export function getDaysUntilExpiry(user: User): number | null {
  if (!user.planExpiresAt) return null;
  
  const now = new Date();
  const expiry = new Date(user.planExpiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Get upgrade suggestions
export function getUpgradeSuggestions(user: User, context: 'listings' | 'images' | 'highlight' | 'analytics'): {
  suggestedPlan: UserPlan;
  benefits: string[];
  price: number;
} | null {
  const currentPlan = user.currentPlan;

  if (currentPlan === 'PRO') {
    return null; // Already on highest plan
  }

  const suggestions = {
    listings: {
      plan: (currentPlan === 'FREE' ? 'PREMIUM' : 'PRO') as UserPlan,
      benefits: currentPlan === 'FREE' 
        ? ['Até 15 anúncios ativos', 'Destaque nos produtos', 'Analytics básico']
        : ['Anúncios ILIMITADOS', 'Destaque OURO', 'Analytics avançado'],
      price: currentPlan === 'FREE' ? 19.90 : 39.90
    },
    images: {
      plan: (currentPlan === 'FREE' ? 'PREMIUM' : 'PRO') as UserPlan,
      benefits: currentPlan === 'FREE'
        ? ['Até 10 fotos por produto', 'Destaque nos produtos', 'Analytics básico']
        : ['Fotos ILIMITADAS', 'Destaque OURO', 'Analytics avançado'],
      price: currentPlan === 'FREE' ? 19.90 : 39.90
    },
    highlight: {
      plan: 'PREMIUM' as UserPlan,
      benefits: ['Destaque nos produtos', 'Até 15 anúncios', 'Analytics básico'],
      price: 19.90
    },
    analytics: {
      plan: 'PREMIUM' as UserPlan,
      benefits: ['Analytics básico', 'Destaque nos produtos', 'Até 15 anúncios'],
      price: 19.90
    }
  };

  const suggestion = suggestions[context];
  
  return {
    suggestedPlan: suggestion.plan,
    benefits: suggestion.benefits,
    price: suggestion.price
  };
}
