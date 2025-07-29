'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  StarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewType: 'BUYER_TO_SELLER' | 'SELLER_TO_BUYER';
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    image?: string;
  };
  reviewee: {
    id: string;
    name: string;
    image?: string;
  };
  product?: {
    id: string;
    title: string;
    images: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalRatings: number;
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ReviewSystemProps {
  userId: string;
  showCreateReview?: boolean;
  productId?: string;
  revieweeId?: string;
  reviewType?: 'BUYER_TO_SELLER' | 'SELLER_TO_BUYER';
}

export default function ReviewSystem({ 
  userId,
  showCreateReview = false,
  productId,
  revieweeId,
  reviewType
}: ReviewSystemProps) {
  const { data: session } = useSession();
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(showCreateReview);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Carregar avaliações
  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?userId=${userId}&type=received`);
      if (response.ok) {
        const data = await response.json();
        setReviewStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!session || !revieweeId || !reviewType || newReview.rating === 0) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          revieweeId,
          productId,
          rating: newReview.rating,
          comment: newReview.comment,
          reviewType
        }),
      });

      if (response.ok) {
        setNewReview({ rating: 0, comment: '' });
        setShowReviewForm(false);
        fetchReviews(); // Recarregar avaliações
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao enviar avaliação');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <StarSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getReviewTypeLabel = (type: string) => {
    return type === 'BUYER_TO_SELLER' ? 'Como Comprador' : 'Como Vendedor';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header com Estatísticas */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliações</h3>
          {reviewStats && reviewStats.totalRatings > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(reviewStats.averageRating))}
                <span className="text-lg font-medium text-gray-900 ml-2">
                  {reviewStats.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600">
                ({reviewStats.totalRatings} avaliação{reviewStats.totalRatings !== 1 ? 'ões' : ''})
              </span>
            </div>
          ) : (
            <p className="text-gray-600">Ainda não há avaliações</p>
          )}
        </div>

        {/* Botão para Nova Avaliação */}
        {session && revieweeId && revieweeId !== (session as any)?.user?.id && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {showReviewForm ? 'Cancelar' : 'Avaliar'}
          </button>
        )}
      </div>

      {/* Formulário de Nova Avaliação */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Nova Avaliação</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua avaliação
              </label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentário (opcional)
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Compartilhe sua experiência..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReview}
                disabled={newReview.rating === 0 || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Avaliações */}
      {reviewStats && reviewStats.reviews.length > 0 ? (
        <div className="space-y-4">
          {reviewStats.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                {/* Avatar do Avaliador */}
                <div className="flex-shrink-0">
                  {review.reviewer.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Conteúdo da Avaliação */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{review.reviewer.name}</h4>
                    <span className="text-xs text-gray-500">
                      {getReviewTypeLabel(review.reviewType)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarDaysIcon className="h-4 w-4" />
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {review.comment}
                    </p>
                  )}

                  {review.product && (
                    <div className="text-xs text-blue-600">
                      Produto: {review.product.title}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-8 text-gray-500">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Ainda não há avaliações para este usuário.</p>
            {session && revieweeId && revieweeId !== (session as any)?.user?.id && (
              <p className="text-sm mt-1">Seja o primeiro a avaliar!</p>
            )}
          </div>
        )
      )}
    </div>
  );
}
