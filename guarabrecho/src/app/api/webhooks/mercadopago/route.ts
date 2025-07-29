import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
// import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('x-signature');
    
    // TODO: Validate webhook signature
    // const isValid = validateMercadoPagoSignature(body, signature);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const data = JSON.parse(body);
    
    console.log('Mercado Pago webhook received:', data);

    // Handle different notification types
    switch (data.type) {
      case 'payment':
        await handlePaymentNotification(data);
        break;
      case 'subscription':
        await handleSubscriptionNotification(data);
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    );
  }
}

async function handlePaymentNotification(data: any) {
  const paymentId = data.data?.id;
  
  if (!paymentId) {
    console.error('No payment ID in notification');
    return;
  }

  try {
    // TODO: Fetch payment details from Mercado Pago API
    // const payment = await mercadopago.payment.findById(paymentId);
    
    // TODO: Update subscription or highlight purchase status
    // if (payment.status === 'approved') {
    //   if (payment.metadata?.plan_id) {
    //     // Update subscription
    //     await prisma.subscription.updateMany({
    //       where: {
    //         mercadoPagoId: payment.external_reference
    //       },
    //       data: {
    //         status: 'ACTIVE',
    //         lastPaymentAt: new Date(),
    //         nextPaymentAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    //       }
    //     });
    //     
    //     // Update user plan
    //     await prisma.user.update({
    //       where: { id: payment.metadata.user_id },
    //       data: {
    //         currentPlan: payment.metadata.plan_id.toUpperCase(),
    //         planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    //       }
    //     });
    //   } else {
    //     // Update highlight purchase
    //     await prisma.highlightPurchase.update({
    //       where: { mercadoPagoPaymentId: paymentId },
    //       data: {
    //         status: 'APPROVED',
    //         startDate: new Date(),
    //         endDate: new Date(Date.now() + purchase.duration * 24 * 60 * 60 * 1000)
    //       }
    //     });
    //     
    //     // Update product highlight
    //     await prisma.product.update({
    //       where: { id: purchase.productId },
    //       data: {
    //         isHighlighted: true,
    //         highlightType: purchase.highlightType,
    //         highlightExpiresAt: new Date(Date.now() + purchase.duration * 24 * 60 * 60 * 1000)
    //       }
    //     });
    //   }
    // }

    console.log('Payment notification processed:', paymentId);
  } catch (error) {
    console.error('Error processing payment notification:', error);
  }
}

async function handleSubscriptionNotification(data: any) {
  // Handle subscription-specific notifications
  console.log('Subscription notification:', data);
  
  // TODO: Implement subscription handling logic
}
