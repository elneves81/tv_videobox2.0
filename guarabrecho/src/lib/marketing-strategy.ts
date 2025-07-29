/**
 * Estratégia de Marketing Digital para GuaraBrechó
 * Sistema completo de divulgação online
 */

export interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  platforms: Platform[];
  content: ContentPiece[];
  schedule: {
    startDate: string;
    endDate: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
  };
}

export interface Platform {
  name: 'facebook' | 'instagram' | 'whatsapp' | 'google' | 'linkedin' | 'tiktok' | 'youtube';
  enabled: boolean;
  config: {
    apiKey?: string;
    accessToken?: string;
    accountId?: string;
    settings: Record<string, any>;
  };
  automationLevel: 'manual' | 'semi-auto' | 'full-auto';
}

export interface ContentPiece {
  type: 'post' | 'story' | 'video' | 'article' | 'ad';
  title: string;
  content: string;
  media?: string[];
  hashtags: string[];
  callToAction: string;
  targetAudience: string[];
}

// 🎯 ESTRATÉGIA COMPLETA DE DIVULGAÇÃO
export const GUARABRECHO_MARKETING_STRATEGY = {
  
  // 📱 REDES SOCIAIS - Presença orgânica
  socialMedia: {
    instagram: {
      strategy: "Visual storytelling + Stories diários",
      content: [
        "Posts de produtos em destaque",
        "Stories de vendas realizadas",
        "Reels de transformações (antes/depois)",
        "IGTV explicando sustentabilidade",
        "Lives semanais tirando dúvidas"
      ],
      hashtags: [
        "#GuaraBrechó", "#BrechóGuarapuava", "#ModaSustentável",
        "#VendaSegunda", "#EconomiaCircular", "#ReuseReduce",
        "#GuarapuavaConsciente", "#ModaCircular", "#CompraSustentável"
      ],
      frequency: "2-3 posts/dia + 5-8 stories/dia"
    },
    
    facebook: {
      strategy: "Comunidade + Grupos + Anúncios direcionados",
      content: [
        "Grupo 'Brechó Guarapuava - Compra e Venda'",
        "Página oficial com dicas sustentáveis",
        "Posts em grupos locais de classificados",
        "Eventos virtuais de liquidação",
        "Depoimentos de usuários satisfeitos"
      ],
      targeting: "Pessoas 25-55 anos, Guarapuava + região",
      frequency: "1-2 posts/dia + participação ativa em grupos"
    },
    
    whatsapp: {
      strategy: "Marketing direto + Status + Grupos",
      content: [
        "Status com produtos novos",
        "Grupos de categorias (roupas, eletrônicos, etc)",
        "Broadcast lists para ofertas especiais",
        "Atendimento personalizado",
        "Indicações entre amigos"
      ],
      automation: "Chatbot para FAQ + atendimento humano"
    },
    
    tiktok: {
      strategy: "Viral content + Tendências",
      content: [
        "Transformações de looks",
        "Dicas de styling com peças usadas",
        "Challenges de sustentabilidade",
        "Day in the life de um brechó",
        "Antes e depois de produtos restaurados"
      ],
      hashtags: ["#brechó", "#sustentavel", "#modaconsciente", "#thrift"]
    }
  },

  // 🔍 SEO & CONTEÚDO - Aparecer no Google
  seoStrategy: {
    keywords: [
      "brechó guarapuava", "roupa usada guarapuava",
      "marketplace guarapuava", "venda online guarapuava",
      "móveis usados guarapuava", "eletrônicos seminovos",
      "economia circular PR", "moda sustentável paraná"
    ],
    
    contentMarketing: [
      "Blog com dicas de styling",
      "Guias de cuidados com roupas",
      "Histórias de sustentabilidade",
      "Tutoriais de upcycling",
      "Artigos sobre economia circular"
    ],
    
    localSEO: [
      "Google My Business otimizado",
      "Avaliações de clientes",
      "Fotos do negócio",
      "Posts regulares no GMB",
      "Parcerias com negócios locais"
    ]
  },

  // 💰 ANÚNCIOS PAGOS - Investimento estratégico
  paidAdvertising: {
    googleAds: {
      budget: "R$ 300-500/mês",
      campaigns: [
        "Busca: 'brechó guarapuava'",
        "Display: sites de moda/sustentabilidade",
        "Shopping: produtos em destaque",
        "YouTube: vídeos relacionados"
      ],
      targeting: "Raio 50km de Guarapuava"
    },
    
    facebookAds: {
      budget: "R$ 200-400/mês",
      campaigns: [
        "Awareness: conhecer a marca",
        "Traffic: visitas ao site",
        "Conversions: cadastros/vendas",
        "Retargeting: visitantes que não compraram"
      ],
      audiences: [
        "Interessados em sustentabilidade",
        "Seguidores de brechós concorrentes",
        "Pessoas que compraram online recentemente"
      ]
    },
    
    instagramAds: {
      budget: "R$ 150-300/mês",
      focus: "Stories ads + Reels ads + Shopping tags",
      creative: "UGC (User Generated Content) + produtos"
    }
  },

  // 🤝 PARCERIAS & NETWORKING
  partnerships: {
    local: [
      "Influencers de Guarapuava",
      "Blogs de moda local",
      "Canais do YouTube regionais",
      "Podcasts paranaenses",
      "Eventos de sustentabilidade"
    ],
    
    online: [
      "Outros marketplaces (cross-promotion)",
      "Canais de sustentabilidade",
      "Grupos de empreendedores",
      "Comunidades de brechó",
      "Fóruns de economia circular"
    ]
  },

  // 📧 EMAIL MARKETING
  emailStrategy: {
    newsletters: [
      "Semanal: produtos novos + dicas",
      "Mensal: histórias de sustentabilidade",
      "Promocional: ofertas especiais",
      "Educacional: cuidados com produtos"
    ],
    
    automation: [
      "Boas-vindas para novos usuários",
      "Abandono de carrinho",
      "Pós-venda + avaliação",
      "Reativação de usuários inativos"
    ]
  }
};

// 📊 MÉTRICAS DE ACOMPANHAMENTO
export const MARKETING_METRICS = {
  awareness: [
    "Alcance nas redes sociais",
    "Impressões dos anúncios",
    "Menções da marca",
    "Tráfego orgânico do site"
  ],
  
  engagement: [
    "Taxa de engajamento",
    "Comentários e compartilhamentos",
    "Tempo no site",
    "Páginas por sessão"
  ],
  
  conversion: [
    "Cadastros de novos usuários",
    "Produtos anunciados",
    "Vendas realizadas",
    "ROI dos anúncios"
  ],
  
  retention: [
    "Usuários recorrentes",
    "Taxa de churn",
    "Lifetime value",
    "Net Promoter Score (NPS)"
  ]
};

// 🚀 PLANO DE LANÇAMENTO (30-60-90 dias)
export const LAUNCH_PLAN = {
  first30Days: [
    "✅ Criação de todas as contas sociais",
    "✅ Setup do Google My Business",
    "✅ Primeiro batch de conteúdo (30 posts)",
    "✅ Lançamento com desconto especial",
    "✅ Campanha de awareness local"
  ],
  
  days31to60: [
    "📈 Início dos anúncios pagos",
    "🤝 Primeira rodada de parcerias",
    "📝 Lançamento do blog",
    "📧 Setup do email marketing",
    "📊 Análise dos primeiros resultados"
  ],
  
  days61to90: [
    "🎯 Otimização baseada em dados",
    "🔄 Expansão para novas plataformas",
    "💪 Aumento do budget de anúncios",
    "🌟 Programa de referência/indicação",
    "📈 Estratégias de retenção"
  ]
};

// 💡 AUTOMAÇÃO & FERRAMENTAS
export const AUTOMATION_TOOLS = {
  scheduling: [
    "Buffer/Hootsuite para redes sociais",
    "Later para Stories automáticos",
    "Zapier para integrações",
    "Google Scheduler para posts"
  ],
  
  analytics: [
    "Google Analytics 4",
    "Facebook Pixel",
    "Instagram Insights",
    "Google Search Console"
  ],
  
  content: [
    "Canva para designs",
    "CapCut para vídeos",
    "Unsplash para fotos",
    "ChatGPT para textos"
  ],
  
  crm: [
    "HubSpot (gratuito)",
    "Mailchimp para emails",
    "WhatsApp Business API",
    "Google Sheets para tracking"
  ]
};

// 🎨 TEMPLATES DE CONTEÚDO VIRAL
export const VIRAL_CONTENT_TEMPLATES = {
  beforeAfter: {
    title: "Transformação incrível! 🔥",
    structure: "Antes ➡️ Depois + story da peça + preço",
    hashtags: "#transformacao #brechó #sustentavel"
  },
  
  styling: {
    title: "3 looks com 1 peça 👗",
    structure: "Mesma roupa + 3 combinações diferentes",
    hashtags: "#styling #modaconsciente #versatilidade"
  },
  
  savings: {
    title: "Economia real! 💰",
    structure: "Preço novo vs brechó + cálculo da economia",
    hashtags: "#economia #inteligentefinanceira #sustentavel"
  },
  
  stories: {
    title: "História por trás da peça ❤️",
    structure: "Dona anterior + nova vida + impacto ambiental",
    hashtags: "#historias #sustentabilidade #reutilizar"
  }
};

// 🎯 CALL-TO-ACTIONS EFICAZES
export const EFFECTIVE_CTAS = [
  "🛍️ Descubra seu próximo tesouro no GuaraBrechó!",
  "💚 Moda sustentável que não pesa no bolso!",
  "🔄 Dê uma nova vida para suas roupas!",
  "🌱 Seja parte da revolução sustentável!",
  "💰 Ganhe dinheiro com o que não usa mais!",
  "🎁 Encontre peças únicas e especiais!",
  "🏠 O brechó online de Guarapuava!",
  "✨ Estilo consciente, preço justo!"
];

// Função para gerar cronograma de posts
export function generateContentCalendar(days: number = 30) {
  const calendar = [];
  const contentTypes = ['produto', 'dica', 'depoimento', 'educativo', 'promocional'];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const type = contentTypes[i % contentTypes.length];
    calendar.push({
      date: date.toISOString().split('T')[0],
      type,
      platforms: ['instagram', 'facebook'],
      content: generateContentByType(type)
    });
  }
  
  return calendar;
}

function generateContentByType(type: string) {
  const templates = {
    produto: "🔥 PRODUTO EM DESTAQUE\n[Foto do produto]\nDescrição + preço + como adquirir",
    dica: "💡 DICA SUSTENTÁVEL\nComo cuidar melhor das suas roupas + link para blog",
    depoimento: "❤️ DEPOIMENTO\nHistória real de cliente satisfeito + foto",
    educativo: "🌱 VOCÊ SABIA?\nFato sobre sustentabilidade + impacto do brechó",
    promocional: "🎉 OFERTA ESPECIAL\nPromoção + urgência + CTA forte"
  };
  
  return templates[type as keyof typeof templates] || templates.produto;
}
