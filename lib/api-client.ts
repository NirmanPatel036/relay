const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface Message {
  id: string
  conversationId: string
  role: string
  content: string
  agentType?: string
  reasoning?: string
  metadata?: any
  createdAt: string
}

export interface Conversation {
  id: string
  userId: string
  title?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface SendMessageRequest {
  conversationId?: string
  userId: string
  message: string
  stream?: boolean
}

export interface SendMessageResponse {
  conversationId: string
  message: Message
  routing: {
    agentType: string
    reasoning: string
    confidence: number
  }
  metadata: any
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await fetch(`${this.baseUrl}/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send message')
    }

    return response.json()
  }

  async streamMessage(
    request: SendMessageRequest,
    onChunk: (type: string, data: any) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: true }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to stream message')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is not readable')
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          onChunk(data.type, data)
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await fetch(`${this.baseUrl}/chat/conversations/${conversationId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get conversation')
    }

    return response.json()
  }

  async getConversations(userId: string): Promise<{ conversations: Conversation[]; total: number }> {
    const response = await fetch(`${this.baseUrl}/chat/conversations?userId=${userId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get conversations')
    }

    return response.json()
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete conversation')
    }
  }

  async getAgents() {
    const response = await fetch(`${this.baseUrl}/agents`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get agents')
    }

    return response.json()
  }

  async getAgentCapabilities(agentType: string) {
    const response = await fetch(`${this.baseUrl}/agents/${agentType}/capabilities`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get agent capabilities')
    }

    return response.json()
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`)

    if (!response.ok) {
      throw new Error('Health check failed')
    }

    return response.json()
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
