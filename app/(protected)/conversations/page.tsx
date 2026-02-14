'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Conversation {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
  users: {
    name: string | null
    email: string
  }
  messages: {
    id: string
    content: string
    role: string
    agent_type: string | null
    created_at: string
  }[]
}

export default function Conversations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    avgResponseTime: '0s',
    activeUsers: 0
  })

  useEffect(() => {
    fetchConversations()
    fetchStats()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          users (
            name,
            email
          ),
          messages (
            id,
            content,
            role,
            agent_type,
            created_at
          )
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setConversations(data || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total conversations
      const { count: convCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })

      // Get total messages
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })

      // Get unique users
      const { data: usersData } = await supabase
        .from('conversations')
        .select('user_id', { head: false })

      const uniqueUsers = new Set(usersData?.map(c => c.user_id) || []).size

      // Get average response time from agent_metrics
      const { data: metricsData } = await supabase
        .from('agent_metrics')
        .select('response_time')

      const avgTime = metricsData && metricsData.length > 0
        ? Math.round(metricsData.reduce((acc, m) => acc + m.response_time, 0) / metricsData.length)
        : 0

      setStats({
        totalConversations: convCount || 0,
        totalMessages: msgCount || 0,
        avgResponseTime: avgTime > 1000 ? `${(avgTime / 1000).toFixed(1)}s` : `${avgTime}ms`,
        activeUsers: uniqueUsers
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getLastMessage = (conv: Conversation) => {
    if (!conv.messages || conv.messages.length === 0) return 'No messages yet'
    const lastMsg = conv.messages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
    return lastMsg.content.length > 50 ? `"${lastMsg.content.substring(0, 50)}..."` : `"${lastMsg.content}"`
  }

  const getAgentType = (conv: Conversation) => {
    if (!conv.messages || conv.messages.length === 0) return 'No Agent'
    const agentMessages = conv.messages.filter(m => m.agent_type)
    if (agentMessages.length === 0) return 'Router Agent'
    
    const lastAgentMsg = agentMessages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
    
    return lastAgentMsg.agent_type === 'order' ? 'Order Agent' :
           lastAgentMsg.agent_type === 'billing' ? 'Billing Agent' :
           lastAgentMsg.agent_type === 'support' ? 'Support Agent' :
           'Router Agent'
  }

  const getStatus = (conv: Conversation) => {
    // If no messages, it's pending
    if (!conv.messages || conv.messages.length === 0) return 'Pending'
    
    // If last message is from user (role: user), it's open
    const sortedMessages = conv.messages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    if (sortedMessages[0].role === 'user') return 'Open'
    
    // If last message is from assistant, it's resolved
    return 'Resolved'
  }

  const getActivity = (conv: Conversation) => {
    const now = new Date()
    const updated = new Date(conv.updated_at)
    const diffMs = now.getTime() - updated.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} mins ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const metrics = [
    { label: 'TOTAL CONVERSATIONS', value: stats.totalConversations.toString(), status: 'healthy' },
    { label: 'TOTAL MESSAGES', value: stats.totalMessages.toString(), status: 'normal' },
    { label: 'AVG. RESPONSE TIME', value: stats.avgResponseTime, status: 'normal' },
    { label: 'ACTIVE USERS', value: stats.activeUsers.toString(), status: 'excellent' },
  ]

  const filteredConversations = conversations.filter(
    (conv) =>
      searchTerm === '' ||
      conv.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAgentType(conv).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur border-b border-border px-8 py-6">
        <h1 className="font-mono text-3xl font-bold text-foreground mb-6">Conversations</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations, users, or agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-3 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition-all flex items-center space-x-2 font-mono text-sm">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center space-x-2 font-mono text-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-card border border-border rounded-lg p-6">
              <p className="text-xs text-muted-foreground font-mono mb-2">{metric.label}</p>
              <p className="text-3xl font-mono font-bold mb-2">{metric.value}</p>
              <div className="flex items-center space-x-1">
                {metric.status === 'excellent' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className={`w-4 h-4 ${metric.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'}`} />
                )}
                <span className="text-xs text-muted-foreground capitalize">{metric.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Conversations Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    Conversation ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    Last Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-muted-foreground font-mono">Loading conversations...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredConversations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <span className="text-muted-foreground font-mono">No conversations found</span>
                    </td>
                  </tr>
                ) : (
                  filteredConversations.map((conversation) => {
                    const status = getStatus(conversation)
                    return (
                      <tr key={conversation.id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                              <span className="font-mono text-sm font-bold text-primary">
                                {conversation.users?.name?.charAt(0) || conversation.users?.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-mono text-sm">{conversation.users?.name || conversation.users?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="font-mono text-xs bg-accent px-2 py-1 rounded">
                            {conversation.id.substring(0, 8)}
                          </code>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          <p className="text-sm text-muted-foreground">{getLastMessage(conversation)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm">{getAgentType(conversation)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                              status === 'Open'
                                ? 'bg-blue-500/20 text-blue-500'
                                : status === 'Resolved'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground font-mono">{getActivity(conversation)}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
