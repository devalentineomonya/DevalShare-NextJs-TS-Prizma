# DevalShare - Developer Collaboration Platform

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-000000?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5.12.1-2D3748?logo=prisma)
![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E59B?logo=postgresql)
![pnpm](https://img.shields.io/badge/pnpm-8.15.6-F69220?logo=pnpm)

A full-stack platform for developers to **share projects**, **collaborate**, and **connect**. Built with modern web technologies and featuring real-time interactions.

![DevalShare Preview](public/screenshot.png)
## 🚀 Key Features

- 👥 **Social Sharing**
  - Share projects with markdown descriptions
  - Like/Bookmark interesting projects
  - Report inappropriate content
  - Public/Private project visibility

- 💬 **Real-time Chat**
  - WebSocket-based messaging
  - Direct messages & group channels
  - Code snippet sharing

- 🔐 **Secure Authentication**
  - NextAuth with Google/GitHub/Email
  - Session management
  - Role-based access control

- 🛠️ **Developer Tools**
  - Project versioning
  - Code preview embeds
  - API documentation sharing

## 💻 Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - TypeScript 5.3
  - Tailwind CSS 4
  - shadcn/ui
  - NextAuth.js

- **Backend**:
  - NestJS 15
  - Prisma 5 + PostgreSQL (Neon)
  - WebSockets (Socket.io)
  - Redis for caching

- **Tooling**:
  - pnpm workspace
  - Zod validation
  - Vitest for testing

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon recommended)
- Redis server
- OAuth credentials (Google/GitHub)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/devalentineomonya/DevalShare-NextJs-TS-Prizma.git
   cd DevalShare-NextJs-TS-Prizma
   ```

2. **Install dependencies (using pnpm)**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```env
   # .env
   DATABASE_URL="postgresql://user:pass@neon-hostname/project"
   REDIS_URL="redis://localhost:6379"
   NEXTAUTH_SECRET="your-secure-key"
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Run development servers**
   ```bash
   pnpm dev

   ```

## 🌟 Social Features

### Project Sharing
1. Create projects with title/description/tags
2. Upload code samples or link repositories
3. Set visibility (public/private)
4. Share via unique URL

### Collaboration
- Comment on projects
- Fork public projects
- Request collaboration
- Real-time code review

### Chat System
```ts
// Example WebSocket handler
socket.on('message', (message: ChatMessage) => {
  broadcastToRoom(message.roomId, 'new_message', message);
});
```

## 🚨 Reporting System
1. Click "Report" on any content
2. Select reason (spam/inappropriate/etc)
3. Admins receive real-time notifications
4. Automated content moderation

## 📦 Deployment

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevalentineomonya%2FDevalShare-NextJs-TS-Prizma)

### Backend (Docker)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
CMD ["pnpm", "start:backend"]
```

## 📄 License
MIT - See [LICENSE](LICENSE) for details
