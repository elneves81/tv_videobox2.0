'use client';

import { 
  SparklesIcon, 
  RocketLaunchIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/solid';

interface UserBadgeProps {
  plan?: 'FREE' | 'PREMIUM' | 'PRO';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function UserBadge({ 
  plan = 'FREE', 
  size = 'md', 
  showText = true 
}: UserBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (plan === 'FREE') {
    return null; // Não mostra badge para plano gratuito
  }

  if (plan === 'PREMIUM') {
    return (
      <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
        <SparklesIcon className={`${sizeClasses[size]} text-green-600`} />
        {showText && (
          <span className={`font-medium ${textSizeClasses[size]}`}>
            Premium
          </span>
        )}
      </div>
    );
  }

  if (plan === 'PRO') {
    return (
      <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        <CheckBadgeIcon className={`${sizeClasses[size]} text-blue-600`} />
        {showText && (
          <span className={`font-medium ${textSizeClasses[size]}`}>
            Verificado
          </span>
        )}
      </div>
    );
  }

  return null;
}
