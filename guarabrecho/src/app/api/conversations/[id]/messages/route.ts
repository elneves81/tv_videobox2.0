import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'

// GET - Buscar mensagens de uma conversa
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string } }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const conversationId = params.id
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Verificar se o usuário é participante da conversa
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id
        }
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    // Buscar mensagens
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      skip,
      take: limit
    })

    // Marcar mensagens como lidas
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    // Atualizar lastReadAt do participante
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id
        }
      },
      data: {
        lastReadAt: new Date()
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Enviar nova mensagem
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string } }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const conversationId = params.id
    const { content, messageType = 'TEXT', receiverId } = await req.json()

    if (!content || !receiverId) {
      return NextResponse.json(
        { error: "Conteúdo e destinatário são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o usuário é participante da conversa
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id
        }
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    // Criar mensagem
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        receiverId,
        content,
        messageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Atualizar timestamp da conversa
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
