import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../auth/[...nextauth]/route';
// import { prisma } from '@/lib/prisma';
import { createPaymentPreference, SUBSCRIPTION_PLANS, type PlanId } from '@/lib/mercadopago';

export async function POST(request: Request) {
  try {
    // TODO: Uncomment when auth is configured
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { planId, userEmail, userName } = await request.json();

    if (!planId || !SUBSCRIPTION_PLANS[planId as PlanId]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = SUBSCRIPTION_PLANS[planId as PlanId];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create Mercado Pago preference
    const preferenceData = {
      items: [{
        id: plan.id,
        title: `Plano ${plan.name} - GuaraBrechó`,
        description: `Assinatura mensal do plano ${plan.name}`,
        quantity: 1,
        unit_price: plan.price,
        currency_id: 'BRL' as const
      }],
      payer: {
        name: userName || 'Usuário',
        email: userEmail || 'user@example.com'
      },
      back_urls: {
        success: `${baseUrl}/checkout/success?plan=${planId}`,
        failure: `${baseUrl}/checkout/failure?plan=${planId}`,
        pending: `${baseUrl}/checkout/pending?plan=${planId}`
      },
      auto_return: 'approved' as const,
      external_reference: `${planId}_${Date.now()}`,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      metadata: {
        user_id: 'temp_user', // TODO: Use real user ID
        plan_id: planId
      }
    };

    const result = await createPaymentPreference(preferenceData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      );
    }

    // TODO: Save subscription record in database
    // const subscription = await prisma.subscription.create({
    //   data: {
    //     userId: session.user.id,
    //     planName: plan.id.toUpperCase(),
    //     status: 'PENDING',
    //     amount: plan.price,
    //     currency: 'BRL',
    //     mercadoPagoId: result.preference_id,
    //     startDate: new Date(),
    //     endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    //     nextPaymentAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    //   }
    // });

    return NextResponse.json({ 
      checkoutUrl: result.init_point,
      preferenceId: result.preference_id,
      planName: plan.name,
      price: plan.price
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
