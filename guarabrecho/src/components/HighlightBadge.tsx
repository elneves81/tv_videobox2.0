'use client';

import { 
  StarIcon,
  TrophyIcon,
  SparklesIcon 
} from '@heroicons/react/24/solid';

interface HighlightBadgeProps {
  type?: 'basic' | 'premium' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

export default function HighlightBadge({ 
  type = 'basic', 
  size = 'md' 
}: HighlightBadgeProps) {
  const sizeClasses = {
    sm: 'h-3 w-3 text-xs px-1.5 py-0.5',
    md: 'h-4 w-4 text-sm px-2 py-1',
    lg: 'h-5 w-5 text-base px-3 py-1.5'
  };

  if (type === 'basic') {
    return (
      <div className={`inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 rounded-full ${sizeClasses[size]}`}>
        <StarIcon className={`h-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} w-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} text-yellow-600`} />
        <span className="font-medium">Destaque</span>
      </div>
    );
  }

  if (type === 'premium') {
    return (
      <div className={`inline-flex items-center gap-1 bg-green-100 text-green-800 rounded-full ${sizeClasses[size]}`}>
        <SparklesIcon className={`h-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} w-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} text-green-600`} />
        <span className="font-medium">Premium</span>
      </div>
    );
  }

  if (type === 'gold') {
    return (
      <div className={`inline-flex items-center gap-1 bg-amber-100 text-amber-800 rounded-full ${sizeClasses[size]} animate-pulse`}>
        <TrophyIcon className={`h-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} w-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} text-amber-600`} />
        <span className="font-medium">OURO</span>
      </div>
    );
  }

  return null;
}
