'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Éviter l'erreur d'hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pendant le SSR, ne rien rendre de spécial
  if (!mounted) {
    return <>{children}</>
  }
  
  // Après hydration, appliquer la logique
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}