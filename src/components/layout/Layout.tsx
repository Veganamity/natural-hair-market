import { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}
