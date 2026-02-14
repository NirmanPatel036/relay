'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Package, CreditCard, HelpCircle, Database, CheckCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentType?: string
  reasoning?: string
  timestamp?: string
  isAnimating?: boolean
}

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 15) // 15ms per character for smooth typing

      return () => clearTimeout(timeout)
    } else if (onComplete && currentIndex === text.length && displayedText === text) {
      onComplete()
    }
  }, [currentIndex, text, displayedText, onComplete])

  // Helper function to format the displayed text
  const formatContent = (content: string) => {
    const lines = content.split('\n')
    const formatted: React.ReactNode[] = []
    let currentList: React.ReactNode[] = []
    let listKey = 0

    const processInlineFormatting = (text: string) => {
      const parts = text.split(/\*\*([^*]+)\*\*/g)
      return parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
      )
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      const listMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
      
      if (listMatch) {
        const [, number, text] = listMatch
        currentList.push(
          <li key={`list-${listKey}-${number}`} className="ml-4">
            <span className="font-bold">{number}. </span>
            {processInlineFormatting(text)}
          </li>
        )
      } else {
        if (currentList.length > 0) {
          formatted.push(
            <ol key={`ol-${listKey}`} className="space-y-2 my-2">
              {currentList}
            </ol>
          )
          currentList = []
          listKey++
        }
        
        if (trimmed) {
          formatted.push(
            <p key={`p-${idx}`} className="mb-2 last:mb-0">
              {processInlineFormatting(line)}
            </p>
          )
        } else if (idx < lines.length - 1) {
          formatted.push(<br key={`br-${idx}`} />)
        }
      }
    })

    if (currentList.length > 0) {
      formatted.push(
        <ol key={`ol-${listKey}`} className="space-y-2 my-2">
          {currentList}
        </ol>
      )
    }

    return formatted
  }

  return <>{formatContent(displayedText)}</>
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [hasSampleData, setHasSampleData] = useState<boolean | null>(null)
  const [isPopulatingData, setIsPopulatingData] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    // Get user ID from Supabase session and check for sample data
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        checkSampleData(user.id)
      }
    }
    getUserId()
  }, [])

  const checkSampleData = async (uid: string) => {
    try {
      // Check if orders exist
      const ordersResponse = await fetch('http://localhost:3001/api/user/check-sample-data', {
        headers: {
          'x-user-id': uid,
        },
      })
      
      if (ordersResponse.ok) {
        const data = await ordersResponse.json()
        setHasSampleData(data.hasData)
      } else {
        // If API fails, default to showing the button (assume no data)
        console.warn('Failed to check sample data, defaulting to show button')
        setHasSampleData(false)
      }
    } catch (error) {
      console.error('Error checking sample data:', error)
      // On error, default to showing the button
      setHasSampleData(false)
    }
  }

  const populateSampleData = async () => {
    if (!userId || isPopulatingData) return

    setIsPopulatingData(true)
    try {
      const response = await fetch('http://localhost:3001/api/user/populate-sample-data', {
        method: 'POST',
        headers: {
          'x-user-id': userId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHasSampleData(true)
        
        // Add success message to chat
        const successMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: `✅ Sample data populated successfully! You now have 3 orders and 3 invoices. Try asking:\n\n• "Where is my order #8829?"\n• "Show me invoice INV-2024-001"\n• "Track order #7742"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, successMessage])
      } else {
        throw new Error('Failed to populate data')
      }
    } catch (error) {
      console.error('Error populating sample data:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: '❌ Failed to populate sample data. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsPopulatingData(false)
    }
  }

  const getAgentIcon = (agentType?: string) => {
    switch (agentType) {
      case 'order':
        return <Package className="w-4 h-4" />
      case 'billing':
        return <CreditCard className="w-4 h-4" />
      case 'support':
        return <HelpCircle className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  const getAgentColor = (agentType?: string) => {
    switch (agentType) {
      case 'order':
        return 'text-blue-500'
      case 'billing':
        return 'text-purple-500'
      case 'support':
        return 'text-green-500'
      default:
        return 'text-primary'
    }
  }

  const getAgentBgColor = (agentType?: string) => {
    switch (agentType) {
      case 'order':
        return 'bg-blue-500/10 border-blue-500/20'
      case 'billing':
        return 'bg-purple-500/10 border-purple-500/20'
      case 'support':
        return 'bg-green-500/10 border-green-500/20'
      default:
        return 'bg-primary/10 border-primary/20'
    }
  }

  const getAgentName = (agentType?: string) => {
    switch (agentType) {
      case 'order':
        return 'Order Agent'
      case 'billing':
        return 'Billing Agent'
      case 'support':
        return 'Support Agent'
      default:
        return 'Relay AI'
    }
  }

  const getAgentMessageBgColor = (agentType?: string) => {
    switch (agentType) {
      case 'order':
        return 'bg-card border-2 border-blue-500'
      case 'billing':
        return 'bg-card border-2 border-purple-500'
      case 'support':
        return 'bg-card border-2 border-green-500'
      default:
        return 'bg-card border-2 border-primary'
    }
  }

  const formatMessageContent = (content: string) => {
    const lines = content.split('\n')
    const formatted: React.ReactNode[] = []
    let currentList: React.ReactNode[] = []
    let listKey = 0

    const processInlineFormatting = (text: string) => {
      // Handle bold text **text**
      const parts = text.split(/\*\*([^*]+)\*\*/g)
      return parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
      )
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      
      // Check for numbered list items (e.g., "1. Item" or "1.  Item")
      const listMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
      
      if (listMatch) {
        const [, number, text] = listMatch
        currentList.push(
          <li key={`list-${listKey}-${number}`} className="ml-4">
            <span className="font-bold">{number}. </span>
            {processInlineFormatting(text)}
          </li>
        )
      } else {
        // If we have accumulated list items, add them as an ol
        if (currentList.length > 0) {
          formatted.push(
            <ol key={`ol-${listKey}`} className="space-y-2 my-2">
              {currentList}
            </ol>
          )
          currentList = []
          listKey++
        }
        
        // Add regular line
        if (trimmed) {
          formatted.push(
            <p key={`p-${idx}`} className="mb-2 last:mb-0">
              {processInlineFormatting(line)}
            </p>
          )
        } else if (idx < lines.length - 1) {
          // Empty line - add spacing
          formatted.push(<br key={`br-${idx}`} />)
        }
      }
    })

    // Flush any remaining list items
    if (currentList.length > 0) {
      formatted.push(
        <ol key={`ol-${listKey}`} className="space-y-2 my-2">
          {currentList}
        </ol>
      )
    }

    return formatted
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Ensure we have a userId
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await apiClient.sendMessage({
        userId,
        message: inputValue,
        conversationId: conversationId || undefined,
        stream: false,
      })

      if (!conversationId) {
        setConversationId(response.conversationId)
      }

      setCurrentAgent(response.routing.agentType)

      // Add reasoning message if available
      if (response.routing.reasoning) {
        const reasoningMessage: Message = {
          id: Date.now().toString() + '-reasoning',
          role: 'system',
          content: response.routing.reasoning,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, reasoningMessage])
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: response.message.content,
        agentType: response.routing.agentType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnimating: true,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'system',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b border-border px-8 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold text-foreground">Multi-Agent Chat</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentAgent ? `Connected to ${currentAgent} agent` : 'Start a conversation'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sample Data Status */}
            {hasSampleData !== null && (
              <div className="flex items-center gap-2">
                {hasSampleData === false && (
                  <button
                    onClick={populateSampleData}
                    disabled={isPopulatingData}
                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPopulatingData ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <Database className="w-4 h-4 text-primary" />
                    )}
                    <span className="font-mono text-xs text-primary font-medium">
                      {isPopulatingData ? 'Loading...' : 'Load Sample Data'}
                    </span>
                  </button>
                )}
                {hasSampleData === true && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-mono text-xs text-green-500 font-medium">Sample Data Ready</span>
                  </div>
                )}
              </div>
            )}
            {/* Current Agent Indicator */}
            {currentAgent && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className={`${getAgentColor(currentAgent)}`}>{getAgentIcon(currentAgent)}</span>
                <span className="font-mono text-sm capitalize">{currentAgent}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border-b border-blue-500/20 px-8 py-3 flex-shrink-0 overflow-hidden">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="inline-flex animate-scroll-left whitespace-nowrap">
              <p className="text-sm text-blue-600 dark:text-blue-400 inline-block">
                <span className="font-semibold">Need order or invoice information?</span> Visit the{' '}
                <a href="/orders" className="underline font-bold hover:text-blue-700 dark:hover:text-blue-300">
                  Orders page
                </a>{' '}
                to view all your orders and invoices. Copy order/invoice numbers from there to query here.
              </p>
              <span className="inline-block w-20"></span>
              <p className="text-sm text-blue-600 dark:text-blue-400 inline-block">
                <span className="font-semibold">Need order or invoice information?</span> Visit the{' '}
                <a href="/orders" className="underline font-bold hover:text-blue-700 dark:hover:text-blue-300">
                  Orders page
                </a>{' '}
                to view all your orders and invoices. Copy order/invoice numbers from there to query here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-mono">No messages yet. Start a conversation!</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {/* Bot Avatar - Left side for assistant messages */}
              {message.role === 'assistant' && (
                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 ${getAgentBgColor(message.agentType)} flex items-center justify-center`}>
                  <div className={`${getAgentColor(message.agentType)}`}>
                    {getAgentIcon(message.agentType)}
                  </div>
                </div>
              )}

              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.role === 'system'
                    ? 'bg-accent text-white italic border border-border'
                    : getAgentMessageBgColor(message.agentType)
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                    <span className={`text-xs font-mono font-bold ${getAgentColor(message.agentType)}`}>
                      {getAgentName(message.agentType)}
                    </span>
                    {message.timestamp && (
                      <span className="text-xs opacity-40 font-mono">• {message.timestamp}</span>
                    )}
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    {message.role === 'assistant' ? (
                      <div className="text-sm leading-relaxed">
                        {message.isAnimating !== false ? (
                          <TypewriterText 
                            text={message.content}
                            onComplete={() => {
                              setMessages(prev => prev.map(m => 
                                m.id === message.id ? { ...m, isAnimating: false } : m
                              ))
                            }}
                          />
                        ) : (
                          formatMessageContent(message.content)
                        )}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.role === 'user' && message.timestamp && (
                      <p className="text-xs opacity-60 mt-2 font-mono">{message.timestamp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* User Avatar - Right side for user messages */}
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start gap-3"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 ${getAgentBgColor(currentAgent || undefined)} flex items-center justify-center`}>
              <div className={`${getAgentColor(currentAgent || undefined)}`}>
                {getAgentIcon(currentAgent || undefined)}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 max-w-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground font-mono">
                  {currentAgent ? getAgentName(currentAgent) : 'Agent'} is typing...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/80 backdrop-blur p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            rows={1}
            disabled={isLoading || !userId}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading || !userId}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
