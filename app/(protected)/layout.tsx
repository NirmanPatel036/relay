'use client'

import AuthGuard from '@/components/auth-guard'
import NavSidebar from '@/components/nav-sidebar'
import { SidebarProvider, useSidebar } from '@/components/layout-wrapper'

function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  
  return (
    <main className={`${collapsed ? 'ml-20' : 'ml-64'} min-h-screen overflow-auto transition-all duration-300`}>
      {children}
    </main>
  )
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <NavSidebar />
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
