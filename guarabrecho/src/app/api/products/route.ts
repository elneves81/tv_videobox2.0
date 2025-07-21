import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar produtos com filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const neighborhood = searchParams.get("neighborhood")
    const type = searchParams.get("type")
    const condition = searchParams.get("condition")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: "ACTIVE"
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (neighborhood) {
      where.neighborhood = {
        contains: neighborhood,
        mode: "insensitive"
      }
    }

    if (type) {
      where.type = type
    }

    if (condition) {
      where.condition = condition
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          },
          user: {
            select: {
              name: true,
              neighborhood: true,
              whatsapp: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar novo produto
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string } }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      price,
      condition,
      type,
      images,
      neighborhood,
      categoryId
    } = await req.json()

    // Validações básicas
    if (!title || !description || !condition || !type || !neighborhood || !categoryId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: título, descrição, condição, tipo, bairro e categoria" },
        { status: 400 }
      )
    }

    // Verificar se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        condition,
        type,
        images: images || [],
        neighborhood,
        userId: session.user.id,
        categoryId
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        user: {
          select: {
            name: true,
            neighborhood: true,
            whatsapp: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: "Produto criado com sucesso", product },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
