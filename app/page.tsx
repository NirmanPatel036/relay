'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Rocket, GitGraph, Users, Database, BarChart3, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Marquee, MarqueeItem } from '@/components/marquee'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserNav } from '@/components/user-nav'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const techStack = [
    { name: 'HONO.DEV', icon: '/hono.png' },
    { name: 'VERCEL AI SDK', icon: '/vercel.svg' },
    { name: 'POSTGRESQL', icon: '/postgresql.svg' },
    { name: 'SUPABASE', icon: '/supabase.png' },
    { name: 'PRISMA ORM', icon: '/prisma.svg' },
    { name: 'TYPESCRIPT', icon: '/typescript.svg' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center p-1.5">
              <Image src="/circles.svg" alt="Relay Logo" width={32} height={32} className="w-full h-full dark:invert" />
            </div>
            <span className="font-mono font-bold text-2xl tracking-tighter">RELAY</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <motion.a whileHover={{ y: -2 }} href="#tech" className="hover:text-primary transition-colors">TECH</motion.a>
            <motion.a whileHover={{ y: -2 }} href="#features" className="hover:text-primary transition-colors">FEATURES</motion.a>
            <motion.a whileHover={{ y: -2 }} href="#architecture" className="hover:text-primary transition-colors">ARCHITECTURE</motion.a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                    LOG IN
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/chat" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                    GET STARTED
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 hero-gradient min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Grid Lines Background */}
        <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }} />
        </div>
        {/* Blinking Dots at Grid Intersections */}
        <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15] pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 2px, transparent 2px)`,
              backgroundSize: '80px 80px',
              backgroundPosition: '-40px -40px',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
          <motion.div 
            className="absolute inset-0 bg-primary blur-[120px] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto z-10">
          <motion.div 
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-8"
            {...fadeIn}
          >
            <span className="flex h-2 w-2 rounded-full bg-primary glow-dot"></span>
            <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Multi-Agent AI Ready</span>
          </motion.div>
          <motion.h1 
            className="font-mono text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Future Of <br/>
            <span className="text-primary">CUSTOMER SUPPORT</span> <br/>
            Is Multi-Agent
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Relay orchestrates specialized AI agents through a Router-Agent architecture to handle complex queries with precision, context, and unprecedented speed.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/chat" className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center">
                TRY IT NOW
                <Rocket className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/docs" className="w-full sm:w-auto bg-secondary/10 border border-secondary/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary/20 transition-all flex items-center justify-center">
                VIEW DOCS
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Tech Stack Marquee */}
      <section className="py-16 border-y border-border bg-muted/30" id="tech">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <p className="font-mono text-center text-xs text-muted-foreground uppercase tracking-[0.3em]">Powered By Industry Standards</p>
        </div>
        <Marquee speed={30} className="py-4">
          {techStack.map((tech, i) => (
            <MarqueeItem key={i} className="px-8">
              <motion.div 
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-8 h-8 relative">
                  <Image 
                    src={tech.icon} 
                    alt={tech.name} 
                    width={32} 
                    height={32} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-mono font-bold text-xl group-hover:text-primary transition-colors">{tech.name}</span>
              </motion.div>
            </MarqueeItem>
          ))}
        </Marquee>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase">Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Advanced capabilities that power the next generation of customer support.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="feature-card p-8 rounded-xl flex flex-col">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <GitGraph className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-mono text-xl font-bold text-foreground mb-4 uppercase">Router Agent</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intelligent semantic routing that analyzes intent in real-time to dispatch requests to the most qualified agent in the cluster.
              </p>
            </div>
            {/* Card 2 */}
            <div className="feature-card p-8 rounded-xl flex flex-col">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-mono text-xl font-bold text-foreground mb-4 uppercase">Context Preservation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Shared memory fabric ensures that every agent in the chain understands the full history of the user's interaction.
              </p>
            </div>
            {/* Card 3 */}
            <div className="feature-card p-8 rounded-xl flex flex-col">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-mono text-xl font-bold text-foreground mb-4 uppercase">Specialized Agents</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dedicated sub-agents for Billing, Technical Support, and Logistics, each fine-tuned on specific operational domains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Visualization */}
      <section className="py-24 px-6 bg-primary/5 relative overflow-hidden" id="architecture">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl font-bold text-foreground mb-4 uppercase">Multi-Agent Architecture</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">How Relay processes a single complex query through our decentralized agent network.</p>
          </div>
          <div className="relative flex flex-col items-center">
            {/* User Entry */}
            <div className="z-10 bg-card/50 border border-border p-4 rounded-lg font-mono text-sm flex items-center mb-12 max-w-lg">
              <Users className="w-5 h-5 text-primary mr-3" />
              "Why was my subscription billed twice last Tuesday?"
            </div>

            {/* Router */}
            <div className="relative w-full flex justify-center mb-12">
              <div className="diag-line absolute top-1/2 left-0 w-full -z-0"></div>
              <div className="z-10 bg-card border-2 border-primary p-6 rounded-xl flex flex-col items-center shadow-[0_0_30px_rgba(13,242,89,0.2)]">
                <GitGraph className="w-8 h-8 text-primary mb-2" />
                <span className="font-mono font-bold text-sm tracking-widest text-foreground uppercase">ROUTER AGENT</span>
                <span className="text-[10px] text-primary/70 mt-1 uppercase">Intent Detected: [Billing]</span>
              </div>
            </div>

            {/* Agents Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="flex flex-col items-center opacity-40">
                <div className="h-12 w-[1px] bg-primary/20 mb-4"></div>
                <div className="bg-card/50 border border-border p-6 rounded-xl w-full text-center">
                  <Users className="w-6 h-6 mb-2 mx-auto" />
                  <div className="font-mono text-xs uppercase text-foreground">General Support</div>
                </div>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="h-12 w-[1px] bg-primary mb-4"></div>
                <div className="bg-card border border-primary p-6 rounded-xl w-full text-center shadow-[0_0_15px_rgba(13,242,89,0.1)]">
                  <BarChart3 className="w-6 h-6 text-primary mb-2 mx-auto" />
                  <div className="font-mono text-xs uppercase text-foreground">Billing Expert</div>
                  <div className="mt-2 text-[10px] text-primary bg-primary/10 rounded-full px-2 py-0.5">ACTIVE</div>
                </div>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="h-12 w-[1px] bg-primary/20 mb-4"></div>
                <div className="bg-card/50 border border-border p-6 rounded-xl w-full text-center">
                  <Database className="w-6 h-6 mb-2 mx-auto" />
                  <div className="font-mono text-xs uppercase text-foreground">Logistics Agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-6 border-t border-border relative overflow-hidden">
        <div className="max-w-4xl mx-auto bg-primary/10 rounded-[2rem] p-12 md:p-20 text-center border border-primary/20 relative">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h2 className="font-mono text-4xl md:text-5xl font-bold text-foreground mb-8">EXPERIENCE RELAY IN ACTION</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Test our multi-agent system with real order and billing queries. See how intelligent routing and specialized agents work together seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/chat" className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all">
                TRY DEMO CHAT
              </Link>
              <Link href="/orders" className="bg-transparent border border-border text-foreground px-10 py-4 rounded-xl font-bold text-lg hover:bg-accent transition-all">
                VIEW SAMPLE DATA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-8 md:mb-0">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center p-1">
              <Image src="/circles.svg" alt="Relay Logo" width={24} height={24} className="w-full h-full dark:invert" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tighter text-foreground uppercase">RELAY SYSTEMS</span>
          </div>
          <div className="flex space-x-12 font-mono text-[10px] tracking-widest text-muted-foreground">
            <a className="hover:text-primary" href="#">GITHUB</a>
            <a className="hover:text-primary" href="#">TWITTER</a>
            <a className="hover:text-primary" href="#">STATUS</a>
            <a className="hover:text-primary" href="#">PRIVACY</a>
          </div>
          <div className="mt-8 md:mt-0 text-[10px] font-mono text-muted-foreground">
            BUILT WITH ❤️ FOR MODERN CUSTOMER SUPPORT
          </div>
        </div>
      </footer>
    </div>
  )
}
