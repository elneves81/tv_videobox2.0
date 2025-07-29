import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'

// GET - Listar conversas do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string } }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            type: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Calcular mensagens não lidas para cada conversa
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            receiverId: session.user.id,
            isRead: false
          }
        })

        // Encontrar o outro participante da conversa
        const otherParticipant = conversation.participants.find(
          p => p.userId !== session.user.id
        )

        return {
          ...conversation,
          unreadCount,
          otherParticipant: otherParticipant?.user || null,
          lastMessage: conversation.messages[0] || null
        }
      })
    )

    return NextResponse.json(conversationsWithUnread)
  } catch (error) {
    console.error("Erro ao buscar conversas:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar nova conversa
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string } }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const { participantId, productId, initialMessage } = await req.json()

    if (!participantId) {
      return NextResponse.json(
        { error: "ID do participante é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se já existe uma conversa entre os usuários para este produto
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        productId: productId || null,
        participants: {
          every: {
            userId: {
              in: [session.user.id, participantId]
            }
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }

    // Criar nova conversa
    const conversation = await prisma.conversation.create({
      data: {
        productId: productId || null,
        participants: {
          create: [
            { userId: session.user.id },
            { userId: participantId }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    // Enviar mensagem inicial se fornecida
    if (initialMessage) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.user.id,
          receiverId: participantId,
          content: initialMessage
        }
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Erro ao criar conversa:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
