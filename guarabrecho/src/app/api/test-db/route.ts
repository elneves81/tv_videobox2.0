import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testando conexão com o banco...')
    
    // Verificar se a DATABASE_URL está definida
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({
        ok: false,
        error: 'DATABASE_URL não está definida nas variáveis de ambiente',
        env: process.env.NODE_ENV
      }, { status: 500 })
    }

    console.log('✅ DATABASE_URL encontrada')
    
    // Testar conexão simples
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Conexão raw bem-sucedida')

    // Testar busca de categorias
    const categories = await prisma.category.findMany({ take: 1 })
    console.log('✅ Busca de categorias bem-sucedida')

    return NextResponse.json({
      ok: true,
      message: 'Conexão com o banco bem-sucedida!',
      rawTest: result,
      categoriesCount: categories.length,
      env: process.env.NODE_ENV,
      hasUrl: !!databaseUrl
    })
  } catch (error: any) {
    console.error('❌ Erro na conexão:', error)
    
    return NextResponse.json({
      ok: false,
      error: error?.message || 'Erro desconhecido',
      code: error?.code,
      meta: error?.meta,
      env: process.env.NODE_ENV,
      hasUrl: !!process.env.DATABASE_URL,
      stack: error?.stack?.slice(0, 500)
    }, { status: 500 })
  }
}
