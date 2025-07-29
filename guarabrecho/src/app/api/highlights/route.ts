import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../auth/[...nextauth]/route';
// import { prisma } from '@/lib/prisma';
import { createPaymentPreference } from '@/lib/mercadopago';
import { canHighlightProduct, getAvailableHighlightTypes } from '@/lib/plan-restrictions';

const HIGHLIGHT_PRICES = {
  BASIC: 5.00,    // 3 days
  PREMIUM: 15.00, // 7 days  
  GOLD: 35.00     // 15 days
};

const HIGHLIGHT_DURATION = {
  BASIC: 3,
  PREMIUM: 7,
  GOLD: 15
};

export async function POST(request: Request) {
  try {
    // TODO: Uncomment when auth is configured
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { productId, highlightType, userEmail, userName } = await request.json();

    if (!productId || !highlightType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!HIGHLIGHT_PRICES[highlightType as keyof typeof HIGHLIGHT_PRICES]) {
      return NextResponse.json({ error: 'Invalid highlight type' }, { status: 400 });
    }

    // Mock user for testing
    const mockUser = {
      id: 'test-user',
      currentPlan: 'PREMIUM' as const,
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    // Check if user can highlight products
    const canHighlight = canHighlightProduct(mockUser);
    if (!canHighlight.allowed) {
      return NextResponse.json({ 
        error: canHighlight.reason,
        needsUpgrade: true 
      }, { status: 403 });
    }

    // Check if highlight type is available for user's plan
    const availableTypes = getAvailableHighlightTypes(mockUser);
    if (!availableTypes.includes(highlightType)) {
      return NextResponse.json({ 
        error: `Destaque ${highlightType} não disponível no seu plano`,
        availableTypes 
      }, { status: 403 });
    }

    // TODO: Check if product exists and belongs to user
    // const product = await prisma.product.findFirst({
    //   where: {
    //     id: productId,
    //     userId: session.user.id
    //   }
    // });
    // 
    // if (!product) {
    //   return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    // }

    const price = HIGHLIGHT_PRICES[highlightType as keyof typeof HIGHLIGHT_PRICES];
    const duration = HIGHLIGHT_DURATION[highlightType as keyof typeof HIGHLIGHT_DURATION];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create Mercado Pago preference
    const preferenceData = {
      items: [{
        id: `highlight_${highlightType}`,
        title: `Destaque ${highlightType} - ${duration} dias`,
        description: `Destaque ${highlightType} para produto por ${duration} dias`,
        quantity: 1,
        unit_price: price,
        currency_id: 'BRL' as const
      }],
      payer: {
        name: userName || 'Usuário',
        email: userEmail || 'user@example.com'
      },
      back_urls: {
        success: `${baseUrl}/dashboard/meus-anuncios?highlight_success=true&product=${productId}`,
        failure: `${baseUrl}/dashboard/meus-anuncios?highlight_error=true`,
        pending: `${baseUrl}/dashboard/meus-anuncios?highlight_pending=true`
      },
      auto_return: 'approved' as const,
      external_reference: `highlight_${productId}_${Date.now()}`,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      metadata: {
        user_id: mockUser.id,
        product_id: productId,
        highlight_type: highlightType,
        duration: duration.toString(),
        type: 'highlight'
      }
    };

    const result = await createPaymentPreference(preferenceData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      );
    }

    // TODO: Create highlight purchase record
    // const highlightPurchase = await prisma.highlightPurchase.create({
    //   data: {
    //     userId: session.user.id,
    //     productId,
    //     highlightType,
    //     amount: price,
    //     currency: 'BRL',
    //     status: 'PENDING',
    //     duration,
    //     mercadoPagoPaymentId: result.preference_id
    //   }
    // });

    return NextResponse.json({ 
      checkoutUrl: result.init_point,
      preferenceId: result.preference_id,
      highlightType,
      price,
      duration
    });

  } catch (error) {
    console.error('Error creating highlight purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Get available highlight options
export async function GET(request: Request) {
  try {
    // TODO: Uncomment when auth is configured
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user for testing
    const mockUser = {
      id: 'test-user',
      currentPlan: 'PREMIUM' as const,
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const canHighlight = canHighlightProduct(mockUser);
    if (!canHighlight.allowed) {
      return NextResponse.json({ 
        error: canHighlight.reason,
        canHighlight: false
      });
    }

    const availableTypes = getAvailableHighlightTypes(mockUser);
    
    const highlightOptions = availableTypes.map(type => ({
      type,
      price: HIGHLIGHT_PRICES[type as keyof typeof HIGHLIGHT_PRICES],
      duration: HIGHLIGHT_DURATION[type as keyof typeof HIGHLIGHT_DURATION],
      name: type === 'BASIC' ? 'Básico' : type === 'PREMIUM' ? 'Premium' : 'Ouro',
      description: type === 'BASIC' 
        ? 'Destaque por 3 dias' 
        : type === 'PREMIUM' 
          ? 'Destaque premium por 7 dias'
          : 'Destaque ouro por 15 dias com prioridade máxima'
    }));

    return NextResponse.json({
      canHighlight: true,
      userPlan: mockUser.currentPlan,
      highlightOptions
    });

  } catch (error) {
    console.error('Error fetching highlight options:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
