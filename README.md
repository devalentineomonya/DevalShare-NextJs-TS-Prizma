# DevalShare - Developer Collaboration Platform

![Developer Community](https://img.shields.io/badge/Platform-Developer%20Community-blue) ![Next.js](https://img.shields.io/badge/Next.js-14.2.x-000000?logo=next.js) ![Prisma](https://img.shields.io/badge/ORM-Prisma-%232B2D42) ![Real-Time Chat](https://img.shields.io/badge/Chat-Socket.io-green)

A full-stack developer community platform where users can share projects, collaborate, and connect. Built with modern web technologies to foster developer networking and knowledge sharing.

![Platform Screenshot](/public/images/screenshot.png) <!-- Update with actual path -->

## ✨ Core Features
- **Project Sharing**  
  Post tech projects with code snippets, descriptions, and tags
- **Community Interaction**  
  - Comment on projects
  - Repost interesting work
  - Upvote/downvote system
- **Real-Time Chat**  
  Socket.io-powered messaging between developers
- **User Profiles**  
  Customizable profiles with project portfolios
- **Notifications**  
  Get alerts for comments, reposts, and mentions
- **Tag System**  
  Categorize projects with tech stack tags (React, Node.js, etc.)

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (GitHub & Google OAuth)
- **Realtime**: Socket.io
- **Deployment**: Vercel + Supabase

## 🚀 Quick Start
1. Clone repo:
   ```bash
   git clone https://github.com/devalentineomonya/DevalShare-NextJs-TS-Prizma.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   ```
4. Database setup:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

## 🔧 Configuration
**Prisma Schema**  
Modify `prisma/schema.prisma` for database models:
```prisma
model Project {
  id          String   @id @default(uuid())
  title       String
  description String
  // ... other fields
}
```

**Authentication**  
Add OAuth providers in `next.config.js`:
```javascript
authOptions: {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ]
}
```

## 🖥 Running the App
```bash
npm run dev
```

## 🌐 Production Deployment
1. Build project:
   ```bash
   npm run build
   ```
2. Start production server:
   ```bash
   npm start
   ```

## 🤝 Contributing
1. Create an issue describing your proposed change
2. Fork repository and create feature branch
3. Submit PR with detailed description of changes

## 📄 License
MIT License - see [LICENSE](LICENSE) for details

## 📬 Contact
For feature requests or issues:  
[Create GitHub Issue](https://github.com/devalentineomonya/DevalShare-NextJs-TS-Prizma/issues)  
Project Link: [https://github.com/devalentineomonya/DevalShare-NextJs-TS-Prizma](https://github.com/devalentineomonya/DevalShare-NextJs-TS-Prizma)
