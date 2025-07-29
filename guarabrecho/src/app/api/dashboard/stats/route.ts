import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'

// GET - Estatísticas do dashboard do vendedor
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id

    // Buscar produtos do usuário para estatísticas básicas
    const userProducts = await prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        createdAt: true
      }
    });

    // Calcular estatísticas básicas
    const totalProducts = userProducts.length;
    const activeProducts = userProducts.filter(p => p.status === 'ACTIVE').length;
    const soldProducts = userProducts.filter(p => p.status === 'SOLD').length;

    // Simular outras estatísticas por enquanto
    const stats = {
      totalProducts,
      activeProducts,
      soldProducts,
      totalViews: Math.floor(Math.random() * 1000) + 100,
      totalMessages: Math.floor(Math.random() * 50) + 5,
      averageRating: Number((Math.random() * 2 + 3).toFixed(1)), // Between 3.0 and 5.0
      totalRatings: Math.floor(Math.random() * 20) + 1,
      recentActivity: [
        {
          type: 'view' as const,
          description: 'Novo produto visualizado',
          date: new Date().toISOString()
        },
        {
          type: 'message' as const,
          description: 'Nova mensagem recebida',
          date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]
    };

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
