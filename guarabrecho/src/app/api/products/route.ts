import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Condition, ProductType } from "@prisma/client"
import { prisma } from '@/lib/prisma'

// GET - Listar produtos com filtros avançados
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
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

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

    // Filtro de preço
    if (priceMin || priceMax) {
      where.price = {}
      if (priceMin) {
        where.price.gte = parseFloat(priceMin)
      }
      if (priceMax) {
        where.price.lte = parseFloat(priceMax)
      }
    }

    // Filtro de data
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999) // Final do dia
        where.createdAt.lte = toDate
      }
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

    // Ordenação dinâmica
    const orderBy: any = {}
    if (sortBy === "price") {
      orderBy.price = sortOrder
    } else if (sortBy === "title") {
      orderBy.title = sortOrder
    } else {
      orderBy.createdAt = sortOrder
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
        orderBy,
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

    let requestData;
    try {
      requestData = await req.json()
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json(
        { error: "Dados inválidos no corpo da requisição" },
        { status: 400 }
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
    } = requestData

    // Validações básicas
    if (!title || !description || !condition || !type || !neighborhood || !categoryId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: título, descrição, condição, tipo, bairro e categoria" },
        { status: 400 }
      )
    }

    // Validar enums
    const validConditions = Object.values(Condition);
    const validTypes = Object.values(ProductType);

    if (!validConditions.includes(condition as Condition)) {
      return NextResponse.json(
        { error: `Condição inválida. Valores aceitos: ${validConditions.join(', ')}` },
        { status: 400 }
      )
    }

    if (!validTypes.includes(type as ProductType)) {
      return NextResponse.json(
        { error: `Tipo inválido. Valores aceitos: ${validTypes.join(', ')}` },
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

    // Processar imagens de forma mais segura
    let processedImages = '';
    try {
      if (images) {
        // Importar função de compressão de forma mais segura
        const { compressMultipleImages } = await import('@/lib/image-utils');
        
        // Comprimir imagens antes de salvar no banco
        let imageString = Array.isArray(images) ? images.join(',') : String(images);
        processedImages = await compressMultipleImages(imageString);
      }
    } catch (imageError) {
      console.warn("Erro ao processar imagens, salvando sem compressão:", imageError)
      // Se falhar na compressão, salva as imagens originais
      processedImages = Array.isArray(images) ? images.join(',') : String(images || '');
    }
    
    // Criar produto
    const product = await prisma.product.create({
      data: {
        title: String(title),
        description: String(description),
        price: price ? parseFloat(String(price)) : null,
        condition: condition as Condition,
        type: type as ProductType,
        images: processedImages,
        neighborhood: String(neighborhood),
        userId: session.user.id,
        categoryId: String(categoryId)
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
    console.error("Erro detalhado ao criar produto:", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}
