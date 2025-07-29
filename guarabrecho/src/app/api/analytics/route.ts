import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../auth/[...nextauth]/route';
// import { prisma } from '@/lib/prisma';
import { canAccessAnalytics } from '@/lib/plan-restrictions';

export async function GET(request: Request) {
  try {
    // TODO: Uncomment when auth is configured
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock user for testing
    const mockUser = {
      id: 'test-user',
      currentPlan: 'PRO' as const,
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    // Check if user can access analytics
    const canAccess = canAccessAnalytics(mockUser);
    if (!canAccess.allowed) {
      return NextResponse.json({ 
        error: canAccess.reason,
        needsUpgrade: true 
      }, { status: 403 });
    }

    // TODO: Get real user and analytics data
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email }
    // });

    // Calculate date range
    const endDateObj = endDate ? new Date(endDate) : new Date();
    const startDateObj = startDate 
      ? new Date(startDate) 
      : new Date(endDateObj.getTime() - parseInt(period) * 24 * 60 * 60 * 1000);

    // TODO: Fetch real analytics data
    // const analytics = await prisma.analytics.findMany({
    //   where: {
    //     userId: user.id,
    //     date: {
    //       gte: startDateObj,
    //       lte: endDateObj
    //     }
    //   },
    //   orderBy: { date: 'asc' }
    // });

    // Mock analytics data for demonstration
    const mockAnalytics = generateMockAnalytics(startDateObj, endDateObj);

    // Calculate totals and trends
    const totals = mockAnalytics.reduce((acc, day) => ({
      productViews: acc.productViews + day.productViews,
      productClicks: acc.productClicks + day.productClicks,
      whatsappClicks: acc.whatsappClicks + day.whatsappClicks,
      profileViews: acc.profileViews + day.profileViews,
      searchAppearances: acc.searchAppearances + day.searchAppearances
    }), {
      productViews: 0,
      productClicks: 0,
      whatsappClicks: 0,
      profileViews: 0,
      searchAppearances: 0
    });

    // Calculate conversion rates
    const clickRate = totals.productViews > 0 
      ? (totals.productClicks / totals.productViews * 100).toFixed(2)
      : '0.00';
    
    const whatsappRate = totals.productClicks > 0
      ? (totals.whatsappClicks / totals.productClicks * 100).toFixed(2)
      : '0.00';

    return NextResponse.json({
      success: true,
      period: {
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
        days: parseInt(period)
      },
      totals,
      metrics: {
        clickRate: parseFloat(clickRate),
        whatsappRate: parseFloat(whatsappRate),
        avgViewsPerDay: (totals.productViews / parseInt(period)).toFixed(1),
        avgClicksPerDay: (totals.productClicks / parseInt(period)).toFixed(1)
      },
      dailyData: mockAnalytics,
      insights: generateInsights(mockAnalytics, totals)
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Track analytics event
export async function POST(request: Request) {
  try {
    const { eventType, productId, userId } = await request.json();
    
    if (!eventType || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Record analytics event
    // const today = new Date().toISOString().split('T')[0];
    // 
    // await prisma.analytics.upsert({
    //   where: {
    //     userId_date: {
    //       userId,
    //       date: new Date(today)
    //     }
    //   },
    //   update: {
    //     [eventType]: {
    //       increment: 1
    //     }
    //   },
    //   create: {
    //     userId,
    //     date: new Date(today),
    //     [eventType]: 1
    //   }
    // });

    console.log('Analytics event recorded:', { eventType, productId, userId });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error recording analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

function generateMockAnalytics(startDate: Date, endDate: Date) {
  const analytics = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    analytics.push({
      date: currentDate.toISOString().split('T')[0],
      productViews: Math.floor(Math.random() * 50) + 10,
      productClicks: Math.floor(Math.random() * 15) + 2,
      whatsappClicks: Math.floor(Math.random() * 8) + 1,
      profileViews: Math.floor(Math.random() * 20) + 5,
      searchAppearances: Math.floor(Math.random() * 100) + 20
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return analytics;
}

function generateInsights(dailyData: any[], totals: any) {
  const insights = [];

  // Best performing day
  const bestDay = dailyData.reduce((best, day) => 
    day.productViews > best.productViews ? day : best
  );
  
  insights.push({
    type: 'best_day',
    title: 'Melhor Dia',
    description: `${bestDay.date} teve ${bestDay.productViews} visualizações`,
    value: bestDay.productViews,
    trend: 'positive'
  });

  // Conversion insights
  const avgClickRate = totals.productViews > 0 
    ? (totals.productClicks / totals.productViews * 100) 
    : 0;
  
  if (avgClickRate > 15) {
    insights.push({
      type: 'high_engagement',
      title: 'Alto Engajamento',
      description: `Taxa de clique de ${avgClickRate.toFixed(1)}% está acima da média`,
      value: avgClickRate,
      trend: 'positive'
    });
  } else if (avgClickRate < 5) {
    insights.push({
      type: 'low_engagement',
      title: 'Engajamento Baixo',
      description: 'Considere melhorar títulos e fotos dos produtos',
      value: avgClickRate,
      trend: 'negative'
    });
  }

  // WhatsApp conversion
  const whatsappRate = totals.productClicks > 0
    ? (totals.whatsappClicks / totals.productClicks * 100)
    : 0;

  if (whatsappRate > 50) {
    insights.push({
      type: 'high_conversion',
      title: 'Alta Conversão',
      description: `${whatsappRate.toFixed(1)}% dos cliques viram contatos`,
      value: whatsappRate,
      trend: 'positive'
    });
  }

  return insights;
}
