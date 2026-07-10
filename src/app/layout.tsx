import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TripMatch AI Dashboard',
  description: 'Sistem Padanan Trip Balik Lori Pintar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body className={`${inter.className} bg-slate-900 text-slate-100`}>
        {children}
      </body>
    </html>
  )
}
