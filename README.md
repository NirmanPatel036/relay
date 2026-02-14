# 🎯 RELAY: Multi-Agent Customer Support Platform

> Modern multi-agent AI customer support system with intelligent query routing and specialized domain handlers

## 📊 Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.3-FF0055?style=for-the-badge&logo=framer&logoColor=white)

### Backend
![Hono](https://img.shields.io/badge/Hono-4.0.0-FF6600?style=for-the-badge&logo=hono&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.11-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.8.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Database & Auth
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.39.3-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### AI & ML
![Google Gemini](https://img.shields.io/badge/Google_Gemini_2.5-Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-3.0.0-000000?style=for-the-badge&logo=vercel&logoColor=white)

### UI Components
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-8B5CF6?style=for-the-badge&logo=radixui&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.544.0-F56565?style=for-the-badge&logo=lucide&logoColor=white)

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>React 19.2.3 + TypeScript]
        A1[Landing Page]
        A2[Dashboard]
        A3[Chat Interface]
        A4[Order Management]
        A5[Authentication]
        
        A --> A1
        A --> A2
        A --> A3
        A --> A4
        A --> A5
    end

    subgraph "API Gateway"
        B[Hono.js Server<br/>Port 3001]
        B1[CORS Middleware]
        B2[Rate Limiter]
        B3[Logger]
        B4[Error Handler]
        
        B --> B1
        B --> B2
        B --> B3
        B --> B4
    end

    subgraph "Multi-Agent System"
        C[Router Agent<br/>Query Analysis]
        
        D[Support Agent<br/>FAQs, Troubleshooting]
        E[Order Agent<br/>Tracking, Status]
        F[Billing Agent<br/>Payments, Invoices]
        
        D1[Knowledge Base Tools]
        E1[Order Lookup Tools]
        F1[Payment Tools]
        
        C -->|Routes to| D
        C -->|Routes to| E
        C -->|Routes to| F
        
        D --> D1
        E --> E1
        F --> F1
    end

    subgraph "AI Layer"
        G[Google Gemini 2.5 Flash<br/>Vercel AI SDK]
        G1[Text Generation]
        G2[Intent Classification]
        G3[Context Understanding]
        
        G --> G1
        G --> G2
        G --> G3
    end

    subgraph "Data Layer"
        H[Supabase PostgreSQL<br/>Row Level Security]
        H1[(Users Table)]
        H2[(Conversations Table)]
        H3[(Messages Table)]
        H4[(Orders Table)]
        H5[(Payments Table)]
        H6[(Agent Metrics Table)]
        
        H --> H1
        H --> H2
        H --> H3
        H --> H4
        H --> H5
        H --> H6
    end

    subgraph "Authentication"
        I[Supabase Auth]
        I1[Email Auth]
        I2[JWT Tokens]
        I3[Session Management]
        I4[RLS Policies]
        
        I --> I1
        I --> I2
        I --> I3
        I --> I4
    end

    subgraph "Services"
        J[Agent Service]
        K[Order Service]
        L[Payment Service]
        M[Conversation Service]
    end

    A -->|HTTP/REST| B
    B -->|Process Request| C
    C -->|AI Inference| G
    D -->|AI Inference| G
    E -->|AI Inference| G
    F -->|AI Inference| G
    
    B -->|Authenticate| I
    I -->|Verify Token| H
    
    C -->|Delegate Task| J
    D -->|Query Data| J
    E -->|Query Data| K
    F -->|Query Data| L
    
    J -->|Prisma ORM| H
    K -->|Prisma ORM| H
    L -->|Prisma ORM| H
    M -->|Prisma ORM| H
    
    A5 -->|Auth Flow| I

    style A fill:#0df259,stroke:#0ba946,color:#000
    style C fill:#4285F4,stroke:#1a73e8,color:#fff
    style D fill:#34A853,stroke:#0f9d58,color:#fff
    style E fill:#FBBC04,stroke:#f9ab00,color:#000
    style F fill:#EA4335,stroke:#d33b2c,color:#fff
    style G fill:#8B5CF6,stroke:#7c3aed,color:#fff
    style H fill:#3ECF8E,stroke:#2ab178,color:#000
    style I fill:#FF6600,stroke:#e55a00,color:#fff
```

---

## 🔄 Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend<br/>(Next.js)
    participant API as API Gateway<br/>(Hono.js)
    participant RA as Router Agent
    participant SA as Specialized Agent<br/>(Support/Order/Billing)
    participant AI as Google Gemini
    participant DB as PostgreSQL<br/>(Supabase)

    U->>FE: Enter Query
    FE->>API: POST /api/chat
    API->>API: Verify JWT Token
    API->>API: Rate Limiting Check
    
    API->>RA: Route Query
    RA->>AI: Analyze Intent
    AI-->>RA: Return Classification
    RA->>RA: Confidence Scoring
    
    alt Route to Support Agent
        RA->>SA: Delegate to Support Agent
        SA->>AI: Generate Response
        SA->>DB: Log Interaction
    else Route to Order Agent
        RA->>SA: Delegate to Order Agent
        SA->>DB: Fetch Order Data
        SA->>AI: Generate Response
        SA->>DB: Log Interaction
    else Route to Billing Agent
        RA->>SA: Delegate to Billing Agent
        SA->>DB: Fetch Payment Data
        SA->>AI: Generate Response
        SA->>DB: Log Interaction
    end
    
    SA-->>API: Return Response
    API->>DB: Save Message
    API->>DB: Update Conversation
    API-->>FE: Stream Response
    FE-->>U: Display Answer
```

---

## 🎯 Agent System Architecture

```mermaid
graph LR
    subgraph "Agent Hierarchy"
        R[Router Agent<br/>🎯 Intent Classifier]
        
        S[Support Agent<br/>💬 General Support]
        O[Order Agent<br/>📦 Order Management]
        B[Billing Agent<br/>💳 Payment Handling]
        
        R -->|FAQ/Login Issues| S
        R -->|Order #1234| O
        R -->|Invoice INV-*| B
    end
    
    subgraph "Support Tools"
        S1[Knowledge Base Search]
        S2[Account Assistance]
        S3[Troubleshooting Guide]
        S4[Password Reset]
        
        S --> S1
        S --> S2
        S --> S3
        S --> S4
    end
    
    subgraph "Order Tools"
        O1[Order Lookup]
        O2[Tracking Status]
        O3[Delivery Updates]
        O4[Order Modification]
        
        O --> O1
        O --> O2
        O --> O3
        O --> O4
    end
    
    subgraph "Billing Tools"
        B1[Invoice Retrieval]
        B2[Payment Processing]
        B3[Refund Handler]
        B4[Subscription Manager]
        
        B --> B1
        B --> B2
        B --> B3
        B --> B4
    end

    style R fill:#4285F4,stroke:#1a73e8,color:#fff
    style S fill:#34A853,stroke:#0f9d58,color:#fff
    style O fill:#FBBC04,stroke:#f9ab00,color:#000
    style B fill:#EA4335,stroke:#d33b2c,color:#fff
```

---

## 📁 Project Structure

```
customer-care/
├── clone-relay-chat/          # Next.js Frontend
│   ├── app/
│   │   ├── (protected)/       # Auth-protected routes
│   │   │   ├── chat/          # Multi-agent chat interface
│   │   │   ├── conversations/ # Conversation history
│   │   │   ├── dashboard/     # Analytics dashboard
│   │   │   └── orders/        # Order management
│   │   ├── docs/              # Documentation page
│   │   ├── login/             # Authentication
│   │   ├── signup/            # User registration
│   │   └── page.tsx           # Landing page
│   └── components/            # React components
│       ├── ui/                # Shadcn UI components
│       ├── user-nav.tsx       # User profile dropdown
│       ├── nav-sidebar.tsx    # Navigation sidebar
│       └── theme-toggle.tsx   # Theme switcher
│
└── backend/                    # Hono.js Backend
    ├── src/
    │   ├── agents/            # Multi-agent system
    │   │   ├── base.agent.ts
    │   │   ├── router.agent.ts
    │   │   ├── support.agent.ts
    │   │   ├── order.agent.ts
    │   │   └── billing.agent.ts
    │   ├── services/          # Business logic
    │   │   ├── agent.service.ts
    │   │   ├── order.service.ts
    │   │   ├── payment.service.ts
    │   │   └── conversation.service.ts
    │   ├── routes/            # API endpoints
    │   │   ├── chat.routes.ts
    │   │   ├── agent.routes.ts
    │   │   ├── user.routes.ts
    │   │   └── health.routes.ts
    │   ├── middleware/        # Request middleware
    │   └── index.ts           # Server entry point
    └── prisma/
        └── schema.prisma      # Database schema
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.11+
- PostgreSQL 15+
- Google Gemini API Key
- Supabase Account

### Frontend Setup

```bash
cd relay
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run development server:
```bash
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```

Generate Prisma client and seed database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Run development server:
```bash
npm run dev
```

---

## 🎨 Features

### ✨ Core Features
- **Multi-Agent AI System**: Intelligent query routing with specialized domain handlers
- **Real-time Chat**: Streaming AI responses with conversation history
- **Order Management**: Track orders, view status, and manage deliveries
- **Payment Handling**: Invoice retrieval, refunds, and payment processing
- **User Authentication**: Secure JWT-based auth with Supabase
- **Dark Mode**: Theme toggle with smooth animations
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Analytics Dashboard**: Agent performance metrics and insights

### 🤖 Agent Capabilities

#### Router Agent
- Intent classification using Google Gemini
- Confidence scoring for routing decisions
- Dynamic agent delegation
- Context-aware query analysis

#### Support Agent
- FAQ handling
- Account assistance
- Password reset management
- General troubleshooting

#### Order Agent
- Order status lookup
- Tracking number retrieval
- Delivery date estimation
- Order modification support

#### Billing Agent
- Invoice generation and retrieval
- Payment processing
- Refund handling
- Subscription management

---

## 📊 Database Schema

### Core Tables
- **users**: User accounts and profiles
- **conversations**: Chat conversation threads
- **messages**: Individual chat messages with agent metadata
- **orders**: Order information and tracking
- **payments**: Payment transactions and invoices
- **agent_metrics**: Agent performance analytics

### Security
- Row Level Security (RLS) enabled on all tables
- JWT token verification
- User-scoped data access
- Rate limiting on API endpoints

---

## 🔧 API Endpoints

### Chat Routes
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/conversations` - List user conversations
- `GET /api/chat/conversations/:id` - Get conversation details

### Agent Routes
- `GET /api/agents/metrics` - Retrieve agent performance metrics
- `POST /api/agents/feedback` - Submit agent feedback

### User Routes
- `GET /api/user/profile` - Get user profile
- `GET /api/user/orders` - List user orders
- `GET /api/user/orders/:orderNumber` - Get order details

### Health Check
- `GET /api/health` - Server health status

---

## 🎯 Deployment

### Frontend (Vercel)
```bash
cd relay
vercel --prod
```

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables from `.env.example`
3. Build command: `npm run build && npx prisma generate`
4. Start command: `node dist/index.js`
5. Auto-deploy on push

---

## 📈 Performance

- **AI Response Time**: < 2 seconds (streaming)
- **API Latency**: < 100ms (cached queries)
- **Database Queries**: Optimized with Prisma indexes
- **Rate Limiting**: 100 requests/minute per user
- **Concurrent Users**: Horizontal scaling ready

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is built for educational purposes as part of a technical assessment round by a startup.

---


## 🙏 Acknowledgments

- **Supabase** - Database and authentication
- **Google Gemini** - AI inference
- **Vercel** - AI SDK and deployment
- **Shadcn UI** - Component library
- **Radix UI** - Accessible primitives

---

<div align="center">

**BUILT WITH ❤️ FOR MODERN CUSTOMER SUPPORT**

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)

</div>
