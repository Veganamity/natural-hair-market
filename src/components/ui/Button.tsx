import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const styles = {
  base: 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    primary: 'bg-[#e6621f] text-white hover:bg-[#c94e14] focus:ring-[#e6621f] shadow-sm',
    secondary: 'bg-[#8b5a37] text-white hover:bg-[#74492d] focus:ring-[#8b5a37] shadow-sm',
    outline: 'border border-[#e6621f] text-[#e6621f] hover:bg-[#fdf4ef] focus:ring-[#e6621f]',
    ghost: 'text-[#57534e] hover:bg-[#f5f5f4] focus:ring-[#78716c]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444] shadow-sm',
  },
  sizes: {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  },
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${styles.variants[variant]} ${styles.sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="spinner" />}
      {children}
    </button>
  )
}
