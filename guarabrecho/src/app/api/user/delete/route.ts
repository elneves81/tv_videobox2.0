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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' }, 
        { status: 404 }
      );
    }

    // Delete user - cascade relationships will handle related data
    await prisma.user.delete({
      where: { id: user.id }
    });

    return NextResponse.json({ 
      message: 'Conta excluída com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
