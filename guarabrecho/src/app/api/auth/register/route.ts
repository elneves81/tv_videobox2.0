import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Iniciando criação de usuário...')
    
    const body = await req.json()
    console.log('📝 Dados recebidos:', { ...body, password: '[HIDDEN]' })
    
    const { name, email, password, phone, whatsapp, neighborhood } = body

    // Validações básicas
    if (!name || !email || !password) {
      console.log('❌ Validação falhou - campos obrigatórios')
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    console.log('✅ Validação passou')

    // Verificar se o usuário já existe
    console.log('🔍 Verificando se usuário existe...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ Usuário já existe')
      return NextResponse.json(
        { error: "Usuário já existe com este email" },
        { status: 400 }
      )
    }

    console.log('✅ Email disponível')

    // Hash da senha
    console.log('🔒 Fazendo hash da senha...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Hash criado')

    // Criar usuário
    console.log('👤 Criando usuário no banco...')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        whatsapp,
        neighborhood
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsapp: true,
        neighborhood: true,
        createdAt: true
      }
    })

    console.log('✅ Usuário criado com sucesso!', user.id)

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("❌ ERRO DETALHADO:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack?.slice(0, 500) // Limitar stack trace
    })

    // Tratar erros específicos do Prisma
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "Este email já está sendo usado por outro usuário" },
        { status: 400 }
      )
    }

    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: "Erro de conexão com o banco de dados" },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor", details: process.env.NODE_ENV === 'development' ? error?.message : 'Tente novamente mais tarde' },
      { status: 500 }
    )
  }
}
