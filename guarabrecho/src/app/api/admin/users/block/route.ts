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

    const { userId, reason } = await request.json();

    if (!userId || !reason) {
      return NextResponse.json(
        { message: 'ID do usuário e motivo são obrigatórios' },
        { status: 400 }
      );
    }

    // Por enquanto, apenas retornar sucesso até regenerar Prisma
    // TODO: Implementar bloqueio real quando Prisma for regenerado
    /*
    await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason
      }
    });
    */

    return NextResponse.json({
      message: 'Usuário bloqueado com sucesso (simulado - aguardando regeneração do Prisma)'
    });

  } catch (error) {
    console.error('Erro ao bloquear usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
