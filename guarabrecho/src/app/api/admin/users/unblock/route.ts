import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Por enquanto, apenas retornar sucesso até regenerar Prisma
    // TODO: Implementar desbloqueio real quando Prisma for regenerado
    /*
    await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: false,
        blockedAt: null,
        blockedReason: null
      }
    });
    */

    return NextResponse.json({
      message: 'Usuário desbloqueado com sucesso (simulado - aguardando regeneração do Prisma)'
    });

  } catch (error) {
    console.error('Erro ao desbloquear usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
