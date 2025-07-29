'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'PRODUCT_LINK';
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    image?: string;
  };
}

interface Conversation {
  id: string;
  unreadCount: number;
  otherParticipant: {
    id: string;
    name: string;
    image?: string;
  };
  lastMessage?: Message;
  product?: {
    id: string;
    title: string;
    images: string;
    price: number;
    type: string;
  };
}

interface ChatProps {
  productId?: string;
  sellerId?: string;
  initialMessage?: string;
}

export default function Chat({ productId, sellerId, initialMessage }: ChatProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Cast da sessão para incluir ID
  const userId = (session as any)?.user?.id;

  // Carregar conversas
  useEffect(() => {
    if (session?.user && isOpen) {
      fetchConversations();
    }
  }, [session, isOpen]);

  // Scroll automático para última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async () => {
    if (!session?.user || !sellerId) return;

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: sellerId,
          productId,
          initialMessage
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversation(conversation.id);
        fetchConversations();
        fetchMessages(conversation.id);
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const otherParticipant = conversations.find(c => c.id === selectedConversation)?.otherParticipant;
    if (!otherParticipant) return;

    try {
      const response = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: otherParticipant.id
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        fetchConversations(); // Atualizar lista de conversas
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const totalUnreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  if (!session?.user) {
    return null;
  }

  return (
    <>
      {/* Botão de Chat Flutuante */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            if (productId && sellerId && !isOpen) {
              startConversation();
            }
            setIsOpen(!isOpen);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          {totalUnreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* Modal do Chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-semibold">
              {selectedConversation ? 'Chat' : 'Conversas'}
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedConversation(null);
              }}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 flex flex-col min-h-0">
            {!selectedConversation ? (
              /* Lista de Conversas */
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mb-2" />
                    <p className="text-sm text-center">
                      Nenhuma conversa ainda.
                      <br />
                      Inicie uma conversa com um vendedor!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation.id);
                          fetchMessages(conversation.id);
                        }}
                        className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                      >
                        {/* Avatar */}
                        <div className="relative">
                          {conversation.otherParticipant.image ? (
                            <Image
                              src={conversation.otherParticipant.image}
                              alt={conversation.otherParticipant.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>

                        {/* Conteúdo da Conversa */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.otherParticipant.name}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          {conversation.product && (
                            <p className="text-xs text-blue-600 truncate">
                              {conversation.product.title}
                            </p>
                          )}
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Chat Individual */
              <>
                {/* Header da Conversa */}
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ← Voltar
                  </button>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {conversations.find(c => c.id === selectedConversation)?.otherParticipant.name}
                    </p>
                  </div>
                  <div></div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender.id === userId ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-2xl ${
                              message.sender.id === userId
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender.id === userId
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input de Mensagem */}
                <div className="border-t p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
