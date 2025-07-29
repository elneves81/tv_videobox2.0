'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ShareIcon, 
  UsersIcon, 
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { GUARABRECHO_MARKETING_STRATEGY, generateContentCalendar } from '@/lib/marketing-strategy';
import { generateAutoContent, VIRAL_CONTENT_TEMPLATES } from '@/lib/marketing-automation';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  progress: number;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  type: 'post' | 'story' | 'video' | 'ad';
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'draft';
  engagement: number;
}

// Componentes UI Simples
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline' }) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

const Progress = ({ value, className = '' }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

export default function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contentCalendar, setContentCalendar] = useState<ContentItem[]>([]);
  const [isAutoPostingEnabled, setIsAutoPostingEnabled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [lastCreatedContent, setLastCreatedContent] = useState<string | null>(null);

  // Simular dados iniciais
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Lançamento GuaraBrechó',
        platform: 'Facebook + Instagram',
        status: 'active',
        progress: 65,
        impressions: 15420,
        clicks: 892,
        cost: 145.50,
        conversions: 23,
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      {
        id: '2',
        name: 'Promoção Primeira Venda',
        platform: 'Google Ads',
        status: 'active',
        progress: 40,
        impressions: 8934,
        clicks: 567,
        cost: 234.80,
        conversions: 18,
        startDate: '2024-01-20',
        endDate: '2024-02-20'
      },
      {
        id: '3',
        name: 'Influenciadores Locais',
        platform: 'TikTok + Instagram',
        status: 'draft',
        progress: 0,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        startDate: '2024-02-01',
        endDate: '2024-02-28'
      }
    ];

    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Dica: Como vender mais rápido no GuaraBrechó',
        platform: 'Instagram',
        type: 'post',
        scheduledFor: '2024-01-25 14:00',
        status: 'scheduled',
        engagement: 0
      },
      {
        id: '2',
        title: 'Stories: Produtos em destaque hoje',
        platform: 'Instagram',
        type: 'story',
        scheduledFor: '2024-01-25 18:00',
        status: 'scheduled',
        engagement: 0
      },
      {
        id: '3',
        title: 'Vídeo: Tour pelo bairro Vila Carli',
        platform: 'TikTok',
        type: 'video',
        scheduledFor: '2024-01-26 10:00',
        status: 'draft',
        engagement: 0
      }
    ];

    setCampaigns(mockCampaigns);
    setContentCalendar(mockContent);
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalCost = campaigns.reduce((acc, c) => acc + c.cost, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0';
  const cpc = totalClicks > 0 ? (totalCost / totalClicks).toFixed(2) : '0';

  const handleCreateViralContent = () => {
    try {
      // Verificar se os templates estão disponíveis
      if (!VIRAL_CONTENT_TEMPLATES || Object.keys(VIRAL_CONTENT_TEMPLATES).length === 0) {
        setLastCreatedContent('❌ Erro: Templates não encontrados');
        return;
      }
      
      // Tipos de conteúdo disponíveis
      const contentTypes = Object.keys(VIRAL_CONTENT_TEMPLATES) as (keyof typeof VIRAL_CONTENT_TEMPLATES)[];
      
      // Selecionar tipo aleatório
      const selectedType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      // Dados simulados para substituição de variáveis
      const mockData = {
        productName: ['iPhone 12', 'Notebook Dell', 'Sofá 3 lugares', 'Geladeira Brastemp', 'Mesa de jantar'][Math.floor(Math.random() * 5)],
        price: (Math.random() * 1000 + 50).toFixed(0),
        originalPrice: (Math.random() * 1500 + 100).toFixed(0),
        neighborhood: ['Vila Carli', 'Centro', 'Bonsucesso', 'Batel', 'Primavera'][Math.floor(Math.random() * 5)],
        userCount: (Math.random() * 5000 + 1000).toFixed(0)
      };
      
      // Gerar conteúdo usando o sistema avançado
      const viralPost = generateAutoContent(selectedType, mockData);
      
      // Plataformas com peso diferente (Instagram tem mais chance)
      const platforms = ['Instagram', 'Instagram', 'Facebook', 'TikTok', 'WhatsApp'];
      const selectedPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      
      // Horários otimizados por plataforma
      const optimalTimes = {
        Instagram: [9, 12, 15, 18, 20],
        Facebook: [9, 13, 15, 17, 19],
        TikTok: [6, 10, 16, 19, 21],
        WhatsApp: [8, 12, 18]
      };
      
      const platformTimes = optimalTimes[selectedPlatform as keyof typeof optimalTimes] || [12, 18];
      const selectedHour = platformTimes[Math.floor(Math.random() * platformTimes.length)];
      
      // Criar data otimizada
      const scheduledDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Próximos 7 dias
      scheduledDate.setHours(selectedHour, Math.floor(Math.random() * 60), 0, 0);
      
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: viralPost.content,
        platform: selectedPlatform,
        type: 'post',
        scheduledFor: scheduledDate.toISOString(),
        status: 'draft',
        engagement: 0
      };
      
      setContentCalendar(prev => [newContent, ...prev]);
      
      // Mostrar feedback visual
      setLastCreatedContent(`🎉 CONTEÚDO VIRAL CRIADO! 
🎯 ${selectedType.replace('_', ' ').toUpperCase()} para ${selectedPlatform}
⏰ ${scheduledDate.toLocaleDateString('pt-BR')} às ${scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
      
      // Limpar feedback após 5 segundos
      setTimeout(() => setLastCreatedContent(null), 5000);
      
    } catch (error) {
      setLastCreatedContent(`❌ Erro ao criar conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setTimeout(() => setLastCreatedContent(null), 8000);
    }
  };

  const handleGenerateCalendar = () => {
    try {
      const calendar = generateContentCalendar(30);
      
      const newContent: ContentItem[] = calendar.map((item, index) => ({
        id: `generated-${Date.now()}-${index}`,
        title: item.content,
        platform: item.platforms[0] || 'Instagram',
        type: 'post',
        scheduledFor: item.date,
        status: 'draft',
        engagement: 0
      }));
      
      setContentCalendar(prev => [...prev, ...newContent]);
      
      setLastCreatedContent(`�️ CALENDÁRIO GERADO! ${newContent.length} posts criados para os próximos 30 dias.`);
      setTimeout(() => setLastCreatedContent(null), 5000);
      
    } catch (error) {
      setLastCreatedContent(`❌ Erro ao gerar calendário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setTimeout(() => setLastCreatedContent(null), 8000);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600">Gerencie suas campanhas e conteúdo automatizado</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCreateViralContent} className="flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            Criar Conteúdo Viral
          </Button>
          <Button onClick={handleGenerateCalendar} variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Gerar Calendário
          </Button>
          <Button 
            onClick={() => setActiveTab('viral-types')} 
            variant="outline" 
            className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <ShareIcon className="w-4 h-4" />
            Ver Templates
          </Button>
        </div>
      </div>

      {/* Feedback de Conteúdo Criado */}
      {lastCreatedContent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-green-800 font-medium">
              {lastCreatedContent}
            </div>
          </div>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impressões</p>
              <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
            </div>
            <EyeIcon className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cliques</p>
              <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              <p className="text-xs text-gray-500">CTR: {ctr}%</p>
            </div>
            <CursorArrowRaysIcon className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investimento</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalCost.toFixed(2)}</p>
              <p className="text-xs text-gray-500">CPC: R$ {cpc}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
              <p className="text-xs text-gray-500">Taxa: {totalImpressions > 0 ? (totalConversions / totalImpressions * 100).toFixed(2) : 0}%</p>
            </div>
            <UsersIcon className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Configuração de Automação */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Automação de Marketing</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Configure a publicação automática e campanhas inteligentes
          </p>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Publicação Automática</h4>
              <p className="text-sm text-gray-600">
                Publique conteúdo automaticamente baseado no calendário
              </p>
            </div>
            <Button
              onClick={() => setIsAutoPostingEnabled(!isAutoPostingEnabled)}
              variant={isAutoPostingEnabled ? "primary" : "outline"}
              className="flex items-center gap-2"
            >
              {isAutoPostingEnabled ? (
                <>
                  <PauseIcon className="w-4 h-4" />
                  Pausar
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Ativar
                </>
              )}
            </Button>
          </div>
          {isAutoPostingEnabled && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✅ Automação ativada! Próxima publicação em 2 horas.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="w-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'campaigns', label: 'Campanhas' },
              { id: 'content', label: 'Calendário de Conteúdo' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'viral-types', label: 'Templates Virais' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Campanhas */}
        {activeTab === 'campaigns' && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Campanhas Ativas</h3>
              <Button>Nova Campanha</Button>
            </div>
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.platform}</p>
                    </div>
                    <Badge 
                      variant={campaign.status === 'active' ? 'default' : 
                              campaign.status === 'paused' ? 'secondary' : 'outline'}
                    >
                      {campaign.status === 'active' ? 'Ativo' :
                       campaign.status === 'paused' ? 'Pausado' :
                       campaign.status === 'completed' ? 'Concluído' : 'Rascunho'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} className="w-full" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Impressões</p>
                      <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cliques</p>
                      <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Custo</p>
                      <p className="font-semibold">R$ {campaign.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Conversões</p>
                      <p className="font-semibold">{campaign.conversions}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Calendário de Conteúdo */}
        {activeTab === 'content' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h3 className="text-lg font-semibold">Calendário de Conteúdo</h3>
              <div className="flex gap-2">
                <select 
                  value={selectedPlatform} 
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todas as plataformas</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
                <Button variant="outline">Novo Conteúdo</Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {contentCalendar
                .filter(item => selectedPlatform === 'all' || item.platform === selectedPlatform)
                .map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{item.platform}</span>
                        <span className="capitalize">{item.type}</span>
                        <span>{new Date(item.scheduledFor).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={item.status === 'published' ? 'default' : 
                                item.status === 'scheduled' ? 'secondary' : 'outline'}
                      >
                        {item.status === 'published' ? 'Publicado' :
                         item.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                      </Badge>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Templates Virais */}
        {activeTab === 'viral-types' && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Templates de Conteúdo Viral</h3>
              <div className="text-sm text-gray-500">
                {Object.keys(VIRAL_CONTENT_TEMPLATES).length} categorias disponíveis
              </div>
            </div>
            
            <div className="grid gap-6">
              {Object.entries(VIRAL_CONTENT_TEMPLATES).map(([category, templates]) => (
                <Card key={category} className="p-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold capitalize flex items-center gap-2">
                      {category === 'productSpotlight' && '🔥 Spotlight de Produtos'}
                      {category === 'tips' && '💡 Dicas e Tutoriais'}
                      {category === 'community' && '🌱 Comunidade'}
                      {category === 'neighborhoods' && '🏘️ Bairros'}
                      {category === 'success_stories' && '🎉 Cases de Sucesso'}
                      <Badge variant="outline">
                        {templates.length} templates
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {category === 'productSpotlight' && 'Posts promocionais para destacar produtos específicos'}
                      {category === 'tips' && 'Conteúdo educativo para engajar e ajudar usuários'}
                      {category === 'community' && 'Posts para fortalecer a comunidade local'}
                      {category === 'neighborhoods' && 'Conteúdo focado nos bairros de Guarapuava'}
                      {category === 'success_stories' && 'Depoimentos e cases de vendas bem-sucedidas'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {templates.map((template, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-800">
                          {template}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {template.includes('{productName}') && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              📦 Produto
                            </span>
                          )}
                          {template.includes('{price}') && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              💰 Preço
                            </span>
                          )}
                          {template.includes('{neighborhood}') && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              📍 Bairro
                            </span>
                          )}
                          {template.includes('{userCount}') && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                              👥 Usuários
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Hashtags Automáticas:</h5>
                    <div className="flex flex-wrap gap-1">
                      {category === 'productSpotlight' && 
                        ['#GuaraBrechó', '#Guarapuava', '#BrechóOnline', '#SaldãoGuarapuava', '#Oportunidade'].map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))
                      }
                      {category === 'tips' && 
                        ['#DicasGuaraBrechó', '#VenderOnline', '#Guarapuava', '#BrechóDicas', '#VendaMais'].map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))
                      }
                      {category === 'community' && 
                        ['#GuarapuavaSustentável', '#ComunidadeGuarapuava', '#EconomiaCircular', '#GuaraBrechó'].map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))
                      }
                      {category === 'neighborhoods' && 
                        ['#GuarapuavaBairros', '#VizinhançaGuarapuava', '#LocalGuarapuava', '#GuaraBrechó'].map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))
                      }
                      {category === 'success_stories' && 
                        ['#SucessoGuaraBrechó', '#DepoimentoReal', '#VendaRápida', '#Guarapuava'].map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">🚀 Como Funciona o Gerador de Conteúdo Viral</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-purple-800">1. Seleção Inteligente</div>
                  <p className="text-purple-700">Escolhe automaticamente entre 5 categorias de conteúdo</p>
                </div>
                <div>
                  <div className="font-medium text-purple-800">2. Personalização</div>
                  <p className="text-purple-700">Substitui variáveis com dados reais (produto, preço, bairro)</p>
                </div>
                <div>
                  <div className="font-medium text-purple-800">3. Otimização</div>
                  <p className="text-purple-700">Agenda no horário ideal para cada plataforma</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-4">
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChartBarIcon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Estratégia de Marketing</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Canais Principais</h4>
                    <div className="space-y-2">
                      {Object.entries(GUARABRECHO_MARKETING_STRATEGY.socialMedia).map(([platform, config]) => (
                        <div key={platform} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="capitalize">{platform}</span>
                          <Badge variant="outline">Ativo</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Orçamento Mensal</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Google Ads</span>
                        <span>R$ 300-500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Facebook/Instagram</span>
                        <span>R$ 200-400</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Influenciadores</span>
                        <span>R$ 500-800</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total</span>
                        <span>R$ 1.000-1.700</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🚀 Plano de Lançamento</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>✅ Primeiros 30 dias: Foco em redes sociais e conteúdo viral</p>
                    <p>🎯 60 dias: Campanhas pagas + parcerias com influenciadores</p>
                    <p>📈 90 dias: Expansão e otimização baseada em dados</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
