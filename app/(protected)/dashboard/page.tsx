'use client'

import { useState, useEffect } from 'react'
import { GitGraph, Users, ShoppingCart, CreditCard, Copy } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AgentStats {
  totalRequests: number
  avgResponseTime: number
  successRate: number
  lastUsed: string | null
}

export default function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState('router')
  const [stats, setStats] = useState<Record<string, AgentStats>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgentStats()
  }, [])

  const fetchAgentStats = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group by agent type
      const statsByAgent: Record<string, AgentStats> = {
        router: { totalRequests: 0, avgResponseTime: 0, successRate: 0, lastUsed: null },
        support: { totalRequests: 0, avgResponseTime: 0, successRate: 0, lastUsed: null },
        order: { totalRequests: 0, avgResponseTime: 0, successRate: 0, lastUsed: null },
        billing: { totalRequests: 0, avgResponseTime: 0, successRate: 0, lastUsed: null },
      }

      data?.forEach((metric: any) => {
        const agentType = metric.agent_type
        if (statsByAgent[agentType]) {
          statsByAgent[agentType].totalRequests++
          statsByAgent[agentType].avgResponseTime += metric.response_time
          if (metric.successful) {
            statsByAgent[agentType].successRate++
          }
          if (!statsByAgent[agentType].lastUsed || metric.created_at > statsByAgent[agentType].lastUsed) {
            statsByAgent[agentType].lastUsed = metric.created_at
          }
        }
      })

      // Calculate averages
      Object.keys(statsByAgent).forEach((agent) => {
        const count = statsByAgent[agent].totalRequests
        if (count > 0) {
          statsByAgent[agent].avgResponseTime = Math.round(statsByAgent[agent].avgResponseTime / count)
          statsByAgent[agent].successRate = Math.round((statsByAgent[agent].successRate / count) * 100)
        }
      })

      setStats(statsByAgent)
    } catch (error) {
      console.error('Error fetching agent stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const agents = [
    {
      id: 'router',
      name: 'Router Agent',
      uuid: 'AG-000-ROUTER',
      role: 'Central Intent Classifier',
      description: 'Intelligent semantic routing that analyzes intent in real-time',
      icon: GitGraph,
    },
    {
      id: 'support',
      name: 'Support Agent',
      uuid: 'AG-009-SUP',
      role: 'Customer Support Specialist',
      description: 'Handles general support queries with knowledge base integration',
      icon: Users,
    },
    {
      id: 'order',
      name: 'Order Agent',
      uuid: 'AG-142-ORD',
      role: 'Fulfillment Expert',
      description: 'Manages order tracking and fulfillment operations',
      icon: ShoppingCart,
    },
    {
      id: 'billing',
      name: 'Billing Agent',
      uuid: 'AG-771-BIL',
      role: 'Billing Specialist',
      description: 'Handles subscription and payment processing',
      icon: CreditCard,
    },
  ]

  const selected = agents.find(a => a.id === selectedAgent)
  const Icon = selected?.icon || GitGraph
  const selectedStats = stats[selectedAgent] || { totalRequests: 0, avgResponseTime: 0, successRate: 0, lastUsed: null }

  const capabilities = [
    { name: 'semantic_intent_analysis', description: 'Analyzes user intent using semantic understanding' },
    { name: 'context_preservation', description: 'Maintains conversation context across agent switches' },
    { name: 'real_time_routing', description: 'Routes queries to specialized agents in real-time' },
  ]

  const getLastUsed = (timestamp: string | null) => {
    if (!timestamp) return 'Never'
    const now = new Date()
    const used = new Date(timestamp)
    const diffMs = now.getTime() - used.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur border-b border-border px-8 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground">Agent Capabilities Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">RELAY MULTI-AGENT ARCHITECTURE V4.2.0-STABLE</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Agent Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const AgentIcon = agent.icon
            const agentStats = stats[agent.id] || { totalRequests: 0, avgResponseTime: 0, successRate: 0, lastUsed: null }
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                  selectedAgent === agent.id
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                    : 'bg-card border-border hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <AgentIcon className={`w-8 h-8 ${selectedAgent === agent.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-mono text-muted-foreground">
                    {agentStats.totalRequests} requests
                  </span>
                </div>
                <h3 className="font-mono font-bold text-lg mb-1">{agent.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{agent.uuid}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Last used: <span className="text-foreground font-mono">{getLastUsed(agentStats.lastUsed)}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Agent Details */}
        {selected && (
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-mono text-2xl font-bold mb-2">{selected.name}</h2>
                <p className="text-muted-foreground">{selected.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">UUID:</span>
                    <code className="font-mono text-sm bg-accent px-2 py-1 rounded">{selected.uuid}</code>
                    <button className="p-1 hover:bg-accent rounded">
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <span className="font-mono text-sm">{selected.role}</span>
                  </div>
                </div>
              </div>
              <Icon className="w-16 h-16 text-primary" />
            </div>

            {/* Capabilities */}
            <div>
              <h3 className="font-mono font-bold text-lg mb-4">Agent Capabilities</h3>
              <div className="space-y-3">
                {capabilities.map((capability) => (
                  <div
                    key={capability.name}
                    className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <code className="font-mono text-sm font-bold">{capability.name}</code>
                      <p className="text-xs text-muted-foreground mt-1">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">TOTAL REQUESTS</p>
                <p className="text-2xl font-mono font-bold">
                  {loading ? '...' : selectedStats.totalRequests}
                </p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">AVG RESPONSE</p>
                <p className="text-2xl font-mono font-bold">
                  {loading ? '...' : selectedStats.avgResponseTime > 1000 
                    ? `${(selectedStats.avgResponseTime / 1000).toFixed(1)}s` 
                    : `${selectedStats.avgResponseTime}ms`}
                </p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">SUCCESS RATE</p>
                <p className="text-2xl font-mono font-bold">
                  {loading ? '...' : `${selectedStats.successRate}%`}
                </p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">LAST USED</p>
                <p className="text-xl font-mono font-bold">
                  {loading ? '...' : getLastUsed(selectedStats.lastUsed)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
