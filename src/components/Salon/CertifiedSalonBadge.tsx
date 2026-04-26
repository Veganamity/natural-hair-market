import { Shield } from 'lucide-react';

interface CertifiedSalonBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function CertifiedSalonBadge({
  size = 'medium',
  showText = true
}: CertifiedSalonBadgeProps) {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-300`}>
      <Shield className={`${iconSizes[size]} ${showText ? 'mr-1' : ''}`} />
      {showText && 'Salon certifié'}
    </span>
  );
}
