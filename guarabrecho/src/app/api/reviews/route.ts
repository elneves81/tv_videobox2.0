import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'

// GET - Listar avaliações de um usuário
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // 'received' or 'given'
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 }
      )
    }

    const where = type === 'given' 
      ? { reviewerId: userId }
      : { revieweeId: userId }

    const [reviews, total, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          product: {
            select: {
              id: true,
              title: true,
              images: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: {
          rating: true
        },
        _count: {
          rating: true
        }
      })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      averageRating: averageRating._avg.rating || 0,
      totalRatings: averageRating._count.rating || 0
    })
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar nova avaliação
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string } }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const { revieweeId, productId, rating, comment, reviewType } = await req.json()

    // Validações
    if (!revieweeId || !rating || !reviewType) {
      return NextResponse.json(
        { error: "Campos obrigatórios: revieweeId, rating, reviewType" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Avaliação deve ser entre 1 e 5 estrelas" },
        { status: 400 }
      )
    }

    if (session.user.id === revieweeId) {
      return NextResponse.json(
        { error: "Não é possível avaliar a si mesmo" },
        { status: 400 }
      )
    }

    // Verificar se já existe uma avaliação para esta transação
    if (productId) {
      const existingReview = await prisma.review.findUnique({
        where: {
          reviewerId_revieweeId_productId: {
            reviewerId: session.user.id,
            revieweeId,
            productId
          }
        }
      })

      if (existingReview) {
        return NextResponse.json(
          { error: "Você já avaliou esta transação" },
          { status: 400 }
        )
      }
    }

    // Criar avaliação
    const review = await prisma.review.create({
      data: {
        reviewerId: session.user.id,
        revieweeId,
        productId: productId || null,
        rating,
        comment: comment || null,
        reviewType
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Erro ao criar avaliação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
