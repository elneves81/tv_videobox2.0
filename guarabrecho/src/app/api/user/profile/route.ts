import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const body = await request.json();
    const { name, email, phone, whatsapp, neighborhood } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    if (email !== userEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Este email já está em uso' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        neighborhood: neighborhood || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsapp: true,
        neighborhood: true,
      },
    });

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
