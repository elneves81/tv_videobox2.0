import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
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

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Não permitir que o admin exclua a si mesmo
    if (user.email === session.user.email) {
      return NextResponse.json(
        { message: 'Você não pode excluir sua própria conta' },
        { status: 400 }
      );
    }

    // Excluir usuário (cascade irá cuidar dos relacionamentos)
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      message: 'Usuário excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
