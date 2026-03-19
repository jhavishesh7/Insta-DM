import React from 'react'

type SpinnerProps = {
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = ({ color, size = 'md' }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
      {/* Outer ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-white/10 animate-[pulse_2s_infinite]" 
      />
      
      {/* Spinning gradient ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4a7dff] animate-spin shadow-[0_0_15px_rgba(74,125,255,0.3)]"
        style={{ borderColor: `transparent transparent transparent ${color || '#4a7dff'}` }}
      />
      
      {/* Inner pulsing dot */}
      <div 
        className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

