import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user products
    const products = await prisma.product.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to include simulated stats for now
    const productsWithStats = products.map(product => ({
      id: product.id,
      title: product.title,
      images: product.images || '',
      price: product.price || 0,
      type: product.type,
      status: product.status,
      views: Math.floor(Math.random() * 100) + 1, // Simulated views
      messages: Math.floor(Math.random() * 10), // Simulated messages
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }));

    return NextResponse.json(productsWithStats);
  } catch (error) {
    console.error('Dashboard products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
