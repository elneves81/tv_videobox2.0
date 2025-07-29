import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log("🔍 Buscando categorias do banco...")
    
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    console.log(`✅ ${categories.length} categorias encontradas`)
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error)
    
    // Fallback para categorias estáticas se o banco não estiver disponível
    const staticCategories = [
      { id: '1', name: 'Roupas', slug: 'roupas', _count: { products: 0 } },
      { id: '2', name: 'Eletrônicos', slug: 'eletronicos', _count: { products: 0 } },
      { id: '3', name: 'Móveis', slug: 'moveis', _count: { products: 0 } },
      { id: '4', name: 'Livros', slug: 'livros', _count: { products: 0 } },
      { id: '5', name: 'Esportes', slug: 'esportes', _count: { products: 0 } },
      { id: '6', name: 'Casa e Jardim', slug: 'casa-jardim', _count: { products: 0 } },
      { id: '7', name: 'Beleza', slug: 'beleza', _count: { products: 0 } },
      { id: '8', name: 'Instrumentos Musicais', slug: 'instrumentos-musicais', _count: { products: 0 } },
      { id: '9', name: 'Brinquedos', slug: 'brinquedos', _count: { products: 0 } },
      { id: '10', name: 'Outros', slug: 'outros', _count: { products: 0 } }
    ]

    console.log("⚠️ Usando categorias de fallback")
    return NextResponse.json(staticCategories)
  } finally {
    await prisma.$disconnect()
  }
}
