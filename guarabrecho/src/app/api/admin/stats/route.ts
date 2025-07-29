import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se é admin
    const adminEmails = ['admin@guarabrecho.com', 'elber@guarabrecho.com'];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json(
        { message: 'Acesso negado - Apenas administradores' },
        { status: 403 }
      );
    }

    // Buscar estatísticas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalProducts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      }),
      prisma.product.count()
    ]);

    return NextResponse.json({
      totalUsers,
      blockedUsers: 0, // Por enquanto, até regenerar Prisma
      newUsersToday,
      totalProducts
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
