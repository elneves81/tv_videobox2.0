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

    // Buscar usuários com contagem de produtos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        whatsapp: true,
        neighborhood: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Adicionar campos de bloqueio e contagens como valores padrão por enquanto
    const usersWithAdminInfo = users.map(user => ({
      ...user,
      isBlocked: false,
      blockedAt: null,
      blockedReason: null,
      lastLoginAt: null,
      _count: {
        products: user._count.products,
        givenReviews: 0,
        receivedReviews: 0
      }
    }));

    return NextResponse.json(usersWithAdminInfo);

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
