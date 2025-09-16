'use client'

import { useState, useEffect } from 'react'

interface LogoTransitionProps {
  pageName: string
  onComplete: () => void
}

export default function LogoTransition({ pageName, onComplete }: LogoTransitionProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo qui grandit et s'estompe - rendu blanc */}
        <div className="animate-pulse">
          <img 
            src="/images/Logo .svg" 
            alt="BEL Institut" 
            className="w-32 md:w-48 lg:w-64 h-auto mx-auto drop-shadow-2xl animate-[fadeInScale_2s_ease-in-out] filter brightness-0 invert"
          />
        </div>
        
        {/* Texte qui apparaît après */}
        <div className="mt-6 opacity-0 animate-[fadeIn_1s_ease-in_1s_forwards]">
          <p className="text-white text-lg font-light tracking-[0.3em] uppercase">
            {pageName}
          </p>
        </div>
      </div>

      {/* Animations CSS personnalisées */}
      <style jsx>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}