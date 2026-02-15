'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Sync user to backend database (for existing users or first login)
        try {
          await fetch(`${API_BASE_URL}/user/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name,
            }),
          })
        } catch (syncError) {
          console.error('Failed to sync user to backend:', syncError)
          // Continue anyway - the conversation service will create the user if needed
        }

        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary blur-[120px] opacity-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Image src="/circles.svg" alt="Relay Logo" width={32} height={32} className="w-full h-full dark:invert" />
            </div>
            <span className="font-mono font-bold text-2xl">RELAY</span>
          </Link>
          <h1 className="text-4xl font-mono font-bold mb-3 text-foreground">WELCOME BACK</h1>
          <p className="text-muted-foreground font-mono text-sm">SIGN IN TO YOUR RELAY ACCOUNT</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6 bg-card/30 border border-border rounded-xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground/50 font-mono text-sm"
              placeholder="admin@relay.ai"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground/50 font-mono text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-secondary border border-border checked:bg-primary checked:border-primary" />
              <span className="text-sm text-muted-foreground font-mono">REMEMBER ME</span>
            </label>
            <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-mono font-bold">
              FORGOT?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold font-mono uppercase tracking-wider hover:brightness-110 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8 font-mono">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-bold">
            SIGN UP
          </Link>
        </p>

        {/* Bottom Info */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-mono">SECURED BY RELAY</p>
        </div>
      </div>
    </div>
  )
}
