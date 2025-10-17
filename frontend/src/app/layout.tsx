import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '../components/layout/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BEL Institut de Beauté - Maquillage Permanent & Beauté du Regard',
  description: 'Spécialiste du maquillage permanent, extensions de cils et soins du regard à Paris. Formations professionnelles disponibles.',
  keywords: 'maquillage permanent, extensions cils, beauté regard, institut beauté Paris, formations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}