'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from './layout-wrapper'
import { 
  Menu, 
  LogOut, 
  Settings, 
  MessageSquare, 
  LayoutDashboard, 
  MessageCircle,
  ALargeSmall,
  ChevronLeft,
  ChevronRight,
  Package,
  BookOpen
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from './theme-toggle'

export default function NavSidebar() {
  const { collapsed, setCollapsed } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/chat',
      label: 'Chat',
      icon: MessageSquare,
    },
    {
      href: '/orders',
      label: 'Orders',
      icon: Package,
    },
    {
      href: '/conversations',
      label: 'History',
      icon: MessageCircle,
    },
  ]

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col z-50`}>
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Image src="/circles.svg" alt="Relay Logo" width={32} height={32} className="w-full h-full dark:invert" />
            </div>
            <span className="font-mono font-bold text-xl">RELAY</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Image src="/circles.svg" alt="Relay Logo" width={32} height={32} className="w-full h-full dark:invert" />
            </div>
          </Link>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-card border border-border rounded-semilarge p-1.5 hover:bg-accent hover:scale-110 transition-all shadow-md z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-foreground" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                isActive
                  ? 'bg-primary/20 border-l-2 border-primary text-primary font-bold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} py-3 text-muted-foreground rounded-lg transition-all font-mono text-sm`}>
          {!collapsed && <span>THEME</span>}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
        
        <Link
          href="/docs"
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-all font-mono text-sm`}
          title={collapsed ? 'Documentation' : undefined}
        >
          <BookOpen className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>DOCS</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-all font-mono text-sm`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>LOGOUT</span>}
        </button>
      </div>
    </aside>
  )
}
