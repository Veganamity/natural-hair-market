import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} style={{ fontSize: '0.875rem', fontWeight: 500, color: '#44403c' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: `1px solid ${error ? '#ef4444' : '#d6d3d1'}`,
            fontSize: '0.875rem',
            color: '#1c1917',
            background: '#fff',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = error ? '#ef4444' : '#e6621f'; e.target.style.boxShadow = `0 0 0 3px ${error ? '#fee2e2' : '#fdf4ef'}` }}
          onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#d6d3d1'; e.target.style.boxShadow = 'none' }}
          className={className}
          {...props}
        />
        {error && <p style={{ fontSize: '0.75rem', color: '#ef4444' }}>{error}</p>}
        {hint && !error && <p style={{ fontSize: '0.75rem', color: '#78716c' }}>{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
