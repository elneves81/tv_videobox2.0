// Ferramentas de automação de marketing
export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';
  content: string;
  hashtags: string[];
  image?: string;
  scheduledFor: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  targetAudience: {
    ageRange: string;
    location: string[];
    interests: string[];
  };
  posts: SocialMediaPost[];
  metrics: {
    totalReach: number;
    totalEngagement: number;
    conversionRate: number;
    roi: number;
  };
}

// Templates de conteúdo viral para Guarapuava
export const VIRAL_CONTENT_TEMPLATES = {
  productSpotlight: [
    "🔥 OFERTA IMPERDÍVEL no GuaraBrechó! {productName} por apenas R$ {price}! Localizado em {neighborhood}. Chama no WhatsApp! 📱",
    "✨ ACHADO DO DIA: {productName} em perfeito estado! R$ {price} apenas. Vila Carli, Guarapuava 🏠",
    "💝 SUPER PROMOÇÃO: {productName} com desconto especial! De R$ {originalPrice} por R$ {price}. Corre que é por tempo limitado! ⏰"
  ],
  
  tips: [
    "💡 DICA: Como fotografar seus produtos para vender 3x mais rápido no GuaraBrechó",
    "🎯 SEGREDO: Os 3 melhores horários para postar no brechó online de Guarapuava",
    "📈 ESTRATÉGIA: Como precificar corretamente no GuaraBrechó e vender em 24h",
    "✅ TUTORIAL: Passo a passo para sua primeira venda no brechó online"
  ],
  
  community: [
    "🏙️ GUARAPUAVA SUSTENTÁVEL: Cada compra no GuaraBrechó é um voto por uma cidade mais verde! 🌱",
    "👥 NOSSA COMUNIDADE: Mais de {userCount} pessoas já fazem parte do movimento brechó em Guarapuava!",
    "💚 ECONOMIA CIRCULAR: Dê uma segunda chance para produtos incríveis e economize dinheiro!",
    "🤝 CONECTANDO VIZINHOS: Do Vila Carli ao Centro, conectamos toda Guarapuava!"
  ],
  
  neighborhoods: [
    "📍 VILA CARLI em destaque! Veja os produtos incríveis disponíveis no seu bairro",
    "🏘️ CENTRO de Guarapuava: Descubra tesouros no coração da cidade",
    "🌳 BAIRRO BONSUCESSO: Produtos únicos esperando por você",
    "🏡 BATEL: A sustentabilidade chegou no seu bairro favorito"
  ],
  
  success_stories: [
    "🎉 SUCESSO: Maria vendeu sua geladeira em 2 horas no GuaraBrechó! Seu produto também pode ser o próximo 🚀",
    "⭐ DEPOIMENTO: 'Nunca imaginei que seria tão fácil vender online em Guarapuava!' - João, Vila Carli",
    "💫 TRANSFORMAÇÃO: De produto parado em casa para renda extra em 1 dia! Essa é a magia do GuaraBrechó ✨"
  ]
};

// Função para gerar conteúdo automaticamente
export function generateAutoContent(type: keyof typeof VIRAL_CONTENT_TEMPLATES, data?: any): SocialMediaPost {
  const templates = VIRAL_CONTENT_TEMPLATES[type];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  let content = template;
  
  // Substituir variáveis no template
  if (data) {
    Object.keys(data).forEach(key => {
      content = content.replace(`{${key}}`, data[key]);
    });
  }
  
  // Hashtags específicas para cada tipo
  const hashtagsByType = {
    productSpotlight: ['#GuaraBrechó', '#Guarapuava', '#BrechóOnline', '#SaldãoGuarapuava', '#Oportunidade'],
    tips: ['#DicasGuaraBrechó', '#VenderOnline', '#Guarapuava', '#BrechóDicas', '#VendaMais'],
    community: ['#GuarapuavaSustentável', '#ComunidadeGuarapuava', '#EconomiaCircular', '#GuaraBrechó'],
    neighborhoods: ['#GuarapuavaBairros', '#VizinhançaGuarapuava', '#LocalGuarapuava', '#GuaraBrechó'],
    success_stories: ['#SucessoGuaraBrechó', '#DepoimentoReal', '#VendaRápida', '#Guarapuava']
  };
  
  return {
    id: `auto-${Date.now()}`,
    platform: 'instagram', // Default, pode ser alterado
    content,
    hashtags: hashtagsByType[type] || ['#GuaraBrechó', '#Guarapuava'],
    scheduledFor: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Próximos 7 dias
    status: 'draft'
  };
}

// Função para criar calendário de conteúdo mensal
export function generateMonthlyContentCalendar(): SocialMediaPost[] {
  const posts: SocialMediaPost[] = [];
  const contentTypes = Object.keys(VIRAL_CONTENT_TEMPLATES) as (keyof typeof VIRAL_CONTENT_TEMPLATES)[];
  
  // Gerar conteúdo para 30 dias
  for (let day = 0; day < 30; day++) {
    const postsPerDay = Math.floor(Math.random() * 3) + 1; // 1-3 posts por dia
    
    for (let post = 0; post < postsPerDay; post++) {
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      const autoPost = generateAutoContent(contentType);
      
      // Definir horário específico
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + day);
      
      // Horários otimizados para engajamento
      const optimizedHours = [9, 12, 15, 18, 20]; // 9h, 12h, 15h, 18h, 20h
      const hour = optimizedHours[Math.floor(Math.random() * optimizedHours.length)];
      scheduledDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      
      autoPost.scheduledFor = scheduledDate;
      autoPost.platform = ['instagram', 'facebook', 'tiktok'][Math.floor(Math.random() * 3)] as any;
      
      posts.push(autoPost);
    }
  }
  
  return posts.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
}

// Função para otimizar horários de posting
export function getOptimalPostingTimes(): { [key: string]: string[] } {
  return {
    instagram: ['09:00', '12:00', '15:00', '18:00', '20:00'],
    facebook: ['09:00', '13:00', '15:00', '17:00', '19:00'],
    tiktok: ['06:00', '10:00', '16:00', '19:00', '21:00'],
    whatsapp: ['08:00', '12:00', '18:00'] // Para status/stories
  };
}

// Função para análise de performance
export function analyzePostPerformance(posts: SocialMediaPost[]): {
  bestPerformingContent: string;
  optimalTimes: { [platform: string]: string };
  engagementTrends: { date: string; engagement: number }[];
  recommendations: string[];
} {
  const publishedPosts = posts.filter(p => p.status === 'published' && p.engagement);
  
  if (publishedPosts.length === 0) {
    return {
      bestPerformingContent: 'Dados insuficientes',
      optimalTimes: {},
      engagementTrends: [],
      recommendations: ['Publique mais conteúdo para gerar análises']
    };
  }
  
  // Encontrar melhor tipo de conteúdo
  const contentTypeEngagement: { [key: string]: number[] } = {};
  publishedPosts.forEach(post => {
    const type = Object.keys(VIRAL_CONTENT_TEMPLATES).find(t => 
      VIRAL_CONTENT_TEMPLATES[t as keyof typeof VIRAL_CONTENT_TEMPLATES]
        .some(template => post.content.includes(template.split(' ')[0]))
    ) || 'other';
    
    if (!contentTypeEngagement[type]) contentTypeEngagement[type] = [];
    if (post.engagement) {
      const totalEngagement = post.engagement.likes + post.engagement.comments + post.engagement.shares;
      contentTypeEngagement[type].push(totalEngagement);
    }
  });
  
  const bestContentType = Object.entries(contentTypeEngagement)
    .map(([type, engagements]) => ({
      type,
      avgEngagement: engagements.reduce((a, b) => a + b, 0) / engagements.length
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)[0]?.type || 'productSpotlight';
  
  // Horários otimizados por plataforma
  const platformTimes: { [platform: string]: { [hour: string]: number } } = {};
  publishedPosts.forEach(post => {
    if (!platformTimes[post.platform]) platformTimes[post.platform] = {};
    const hour = post.scheduledFor.getHours().toString().padStart(2, '0') + ':00';
    if (!platformTimes[post.platform][hour]) platformTimes[post.platform][hour] = 0;
    if (post.engagement) {
      const totalEngagement = post.engagement.likes + post.engagement.comments + post.engagement.shares;
      platformTimes[post.platform][hour] += totalEngagement;
    }
  });
  
  const optimalTimes: { [platform: string]: string } = {};
  Object.entries(platformTimes).forEach(([platform, times]) => {
    const bestTime = Object.entries(times)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '12:00';
    optimalTimes[platform] = bestTime;
  });
  
  return {
    bestPerformingContent: bestContentType,
    optimalTimes,
    engagementTrends: publishedPosts.map(post => ({
      date: post.scheduledFor.toISOString().split('T')[0],
      engagement: post.engagement ? 
        post.engagement.likes + post.engagement.comments + post.engagement.shares : 0
    })),
    recommendations: [
      `Foque mais em conteúdo do tipo: ${bestContentType}`,
      'Mantenha consistência na publicação diária',
      'Use sempre hashtags locais de Guarapuava',
      'Responda rapidamente aos comentários para aumentar engajamento'
    ]
  };
}

// Função para criar campanha publicitária
export function createAdCampaign(productData: any): MarketingCampaign {
  const campaign: MarketingCampaign = {
    id: `campaign-${Date.now()}`,
    name: `Promoção ${productData.category} - ${productData.neighborhood}`,
    description: `Campanha promocional para ${productData.name} em ${productData.neighborhood}, Guarapuava`,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    budget: 50, // R$ 50 para teste
    targetAudience: {
      ageRange: '18-65',
      location: ['Guarapuava', productData.neighborhood],
      interests: [productData.category, 'brechó', 'sustentabilidade', 'economia']
    },
    posts: [
      generateAutoContent('productSpotlight', productData),
      generateAutoContent('community'),
      generateAutoContent('tips')
    ],
    metrics: {
      totalReach: 0,
      totalEngagement: 0,
      conversionRate: 0,
      roi: 0
    }
  };
  
  return campaign;
}

// Função para automação completa
export function startMarketingAutomation(userProducts: any[]) {
  const automation = {
    contentCalendar: generateMonthlyContentCalendar(),
    campaigns: userProducts.map(product => createAdCampaign(product)),
    optimalTimes: getOptimalPostingTimes(),
    autoPosting: true,
    analytics: {
      trackingEnabled: true,
      reportFrequency: 'weekly',
      kpis: ['reach', 'engagement', 'conversions', 'roi']
    }
  };
  
  return automation;
}

export default {
  generateAutoContent,
  generateMonthlyContentCalendar,
  getOptimalPostingTimes,
  analyzePostPerformance,
  createAdCampaign,
  startMarketingAutomation,
  VIRAL_CONTENT_TEMPLATES
};
