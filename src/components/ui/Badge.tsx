import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'background:#f5f5f4;color:#57534e',
  success: 'background:#dcfce7;color:#166534',
  warning: 'background:#fef3c7;color:#92400e',
  error: 'background:#fee2e2;color:#991b1b',
  info: 'background:#dbeafe;color:#1e40af',
  secondary: 'background:#fbe5d5;color:#c94e14',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styleStr = variants[variant]
  const styleObj = Object.fromEntries(styleStr.split(';').filter(Boolean).map(s => {
    const [k, v] = s.split(':')
    return [k.trim(), v.trim()]
  }))

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        ...styleObj,
      }}
      className={className}
    >
      {children}
    </span>
  )
}
