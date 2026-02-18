'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Code, Database, GitGraph, Zap, Shield, CheckCircle2, ArrowRight, Terminal, FileCode, Layers } from 'lucide-react'

export default function DocsPage() {
  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'agents', title: 'Agent Types' },
    { id: 'api', title: 'API Reference' },
    { id: 'examples', title: 'Examples' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm font-bold">BACK TO HOME</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center p-1">
              <Image src="/circles.svg" alt="Relay Logo" width={24} height={24} className="w-full h-full dark:invert" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tighter">RELAY DOCS</span>
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 border-r border-border bg-card/50 overflow-y-auto">
          <nav className="p-6 space-y-2">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Contents</p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm hover:text-primary transition-colors py-2 px-3 rounded hover:bg-accent/50"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 px-6 py-12 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary glow-dot"></span>
              <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Documentation v1.0</span>
            </div>
            <h1 className="font-mono text-5xl font-bold mb-4">RELAY DOCUMENTATION</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Complete guide to building and deploying multi-agent AI customer support systems with Relay.
            </p>
          </motion.div>

          {/* Getting Started */}
          <section id="getting-started" className="mb-20 scroll-mt-20">
            <h2 className="font-mono text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Getting Started
            </h2>
            <div className="space-y-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h3 className="font-mono text-xl font-bold mb-3">Prerequisites</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Node.js 18+ and npm/pnpm installed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Supabase account with PostgreSQL database</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Google AI API key (Gemini)</span>
                  </li>
                </ul>

                <h3 className="font-mono text-xl font-bold mb-3 mt-8">Installation</h3>
                <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs uppercase">Terminal</span>
                  </div>
                  <pre className="text-foreground">
{`# Clone the repository
git clone https://github.com/NirmanPatel036/relay.git
cd relay

# Install frontend dependencies
cd relay
npm install

# Install backend dependencies
cd ../backend
npm install

# Setup environment variables
cp .env.example .env`}
                  </pre>
                </div>

                <h3 className="font-mono text-xl font-bold mb-3 mt-8">Environment Configuration</h3>
                <p className="text-muted-foreground mb-3">Create a <code className="bg-muted px-2 py-1 rounded">.env</code> file in the backend directory:</p>
                <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm">
                  <pre className="text-foreground">
{`DATABASE_URL="postgresql://..."
GOOGLE_API_KEY="your-gemini-api-key"
PORT=8000`}
                  </pre>
                </div>

                <h3 className="font-mono text-xl font-bold mb-3 mt-8">Running the Application</h3>
                <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm">
                  <pre className="text-foreground">
{`# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd relay
npm run dev

# Terminal 3 - Database seeding (optional)
cd backend
npm run db:seed`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="mb-20 scroll-mt-20">
            <h2 className="font-mono text-3xl font-bold mb-6 flex items-center gap-3">
              <GitGraph className="w-8 h-8 text-primary" />
              Architecture Overview
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Relay uses a <strong className="text-foreground">Router-Agent pattern</strong> where a central Router Agent analyzes incoming queries and intelligently routes them to specialized sub-agents.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-mono text-lg font-bold mb-4">System Flow</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 text-primary font-bold">1</div>
                    <div>
                      <p className="font-semibold text-foreground">User Query</p>
                      <p>Customer submits a query through the chat interface</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 text-primary font-bold">2</div>
                    <div>
                      <p className="font-semibold text-foreground">Router Analysis</p>
                      <p>Router Agent analyzes intent and calculates confidence scores</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 text-primary font-bold">3</div>
                    <div>
                      <p className="font-semibold text-foreground">Agent Delegation</p>
                      <p>Query routed to specialized agent (Order, Billing, or Support)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 text-primary font-bold">4</div>
                    <div>
                      <p className="font-semibold text-foreground">Tool Execution</p>
                      <p>Agent executes relevant tools (database queries, API calls)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 text-primary font-bold">5</div>
                    <div>
                      <p className="font-semibold text-foreground">Response Generation</p>
                      <p>AI generates natural language response with retrieved data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Agent Types */}
          <section id="agents" className="mb-20 scroll-mt-20">
            <h2 className="font-mono text-3xl font-bold mb-6 flex items-center gap-3">
              <Layers className="w-8 h-8 text-primary" />
              Agent Types
            </h2>
            <div className="space-y-6">
              {/* Router Agent */}
              <div className="border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <GitGraph className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-bold">Router Agent</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Central Orchestrator</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Analyzes incoming queries using semantic understanding to determine user intent and route to the appropriate specialist agent.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs">
                  <p className="text-muted-foreground mb-2">Example routing logic:</p>
                  <pre className="text-foreground">
{`"Where is my order #ORD-2026-1001?"
→ Intent: ORDER_TRACKING
→ Confidence: 0.95
→ Route to: OrderAgent`}
                  </pre>
                </div>
              </div>

              {/* Order Agent */}
              <div className="border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-bold">Order Agent</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Order & Logistics</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Handles order tracking, delivery status, modifications, and shipping updates with direct database access.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Available Tools:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">fetch_order_details(orderNumber)</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">check_delivery_status(orderNumber)</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">get_user_orders(userId, limit)</code>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Billing Agent */}
              <div className="border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-bold">Billing Agent</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Payments & Invoices</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Manages invoices, refund requests, payment history, and financial inquiries with precision and empathy.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Available Tools:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">get_invoice_details(invoiceNumber)</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">check_refund_status(invoiceNumber)</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">get_payment_history(userId, limit)</code>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support Agent */}
              <div className="border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-bold">Support Agent</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">General Assistance</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Handles general inquiries, account management, troubleshooting, and provides conversational support.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Available Tools:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">query_conversation_history(userId)</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="mb-20 scroll-mt-20">
            <h2 className="font-mono text-3xl font-bold mb-6 flex items-center gap-3">
              <Code className="w-8 h-8 text-primary" />
              API Reference
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                The backend exposes RESTful endpoints for interacting with the multi-agent system.
              </p>

              {/* Chat Endpoint */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-1 rounded">POST</span>
                    <code className="font-mono text-sm">/api/chat</code>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Description</p>
                    <p className="text-sm text-muted-foreground">Send a chat message and receive AI-generated response from appropriate agent.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Request Body</p>
                    <div className="bg-card border border-border rounded-lg p-3 font-mono text-xs">
                      <pre className="text-foreground">
{`{
  "message": "Where is my order #ORD-2026-1001?",
  "userId": "user_123",
  "conversationId": "conv_456"
}`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Response</p>
                    <div className="bg-card border border-border rounded-lg p-3 font-mono text-xs">
                      <pre className="text-foreground">
{`{
  "response": "Your order #ORD-2026-1001 is currently...",
  "agent": "order",
  "confidence": 0.95,
  "conversationId": "conv_456"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Endpoint */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-1 rounded">GET</span>
                    <code className="font-mono text-sm">/api/orders/:orderNumber</code>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Description</p>
                    <p className="text-sm text-muted-foreground">Retrieve detailed information about a specific order.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Response</p>
                    <div className="bg-card border border-border rounded-lg p-3 font-mono text-xs">
                      <pre className="text-foreground">
{`{
  "order_number": "ORD-2026-1001",
  "status": "shipped",
  "items": [...],
  "tracking_number": "TRK123456",
  "estimated_delivery": "2026-02-16"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Examples */}
          <section id="examples" className="mb-20 scroll-mt-20">
            <h2 className="font-mono text-3xl font-bold mb-6 flex items-center gap-3">
              <Terminal className="w-8 h-8 text-primary" />
              Usage Examples
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-mono text-lg font-bold mb-4">Order Tracking Query</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-2">User Input</p>
                    <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                      "Where is my order #ORD-2026-1004?"
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-2">Agent Response</p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                      Your order #ORD-2026-1004 (Dell XPS 15 laptop) is currently being shipped and is expected to arrive in Mumbai on February 16, 2026. You can track it using tracking number TRK789012.
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-2">System Flow</p>
                    <div className="bg-card rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                      <p>1. Router Agent → Intent: ORDER_TRACKING (0.96 confidence)</p>
                      <p>2. Delegated to Order Agent</p>
                      <p>3. Tool: fetch_order_details("ORD-2026-1004")</p>
                      <p>4. Tool: check_delivery_status("ORD-2026-1004")</p>
                      <p>5. Response generated with retrieved data</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-mono text-lg font-bold mb-4">Refund Status Query</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-2">User Input</p>
                    <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                      "What's the status of my refund for invoice INV-2026-1006?"
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-2">Agent Response</p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                      Your refund of ₹134,900 for invoice INV-2026-1006 has been successfully processed and credited back to your original payment method on February 12, 2026.
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-2">System Flow</p>
                    <div className="bg-card rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                      <p>1. Router Agent → Intent: REFUND_INQUIRY (0.93 confidence)</p>
                      <p>2. Delegated to Billing Agent</p>
                      <p>3. Tool: get_invoice_details("INV-2026-1006")</p>
                      <p>4. Tool: check_refund_status("INV-2026-1006")</p>
                      <p>5. Response generated with empathy and precision</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center">
            <h3 className="font-mono text-2xl font-bold mb-3">Ready to Build?</h3>
            <p className="text-muted-foreground mb-6">
              Start implementing your own multi-agent AI system with Relay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all inline-flex items-center justify-center">
                Try Live Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/" className="border border-border px-8 py-3 rounded-lg font-bold hover:bg-accent transition-all">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
