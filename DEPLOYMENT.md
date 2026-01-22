# 🚀 Pathshala Design Studio - Deployment Guide

## Quick Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deployment ready"
git push origin master
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import your repository
3. Vercel auto-detects Next.js - click "Deploy"

### Step 3: Add Environment Variables
In Vercel Project Settings → Environment Variables, add:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | Postgres connection string (with pooler) |
| `DIRECT_URL` | ✅ Yes | Direct Postgres connection (for migrations) |
| `NEXTAUTH_SECRET` | ✅ Yes | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ Yes | Your Vercel URL (e.g., `https://yourapp.vercel.app`) |
| `GROQ_API_KEY` | ✅ Yes | From [console.groq.com](https://console.groq.com) |
| `LANGCHAIN_API_KEY` | Optional | From [smith.langchain.com](https://smith.langchain.com) |
| `LANGCHAIN_TRACING_V2` | Optional | Set to `true` for AI debugging |
| `LANGCHAIN_PROJECT` | Optional | `pathshala-design-studio` |

### Step 4: Setup Database
**Option A: Supabase (Recommended)**
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection String
3. Copy **Connection Pooler** URL for `DATABASE_URL`
4. Copy **Direct Connection** URL for `DIRECT_URL`

**Option B: Neon**
1. Create project at [neon.tech](https://neon.tech)
2. Copy the connection string

**Option C: Railway/PlanetScale**
- Follow their PostgreSQL setup guides

### Step 5: Run Database Migrations
After first deploy, open Vercel terminal or run locally:
```bash
npx prisma migrate deploy
```

---

## Environment Variables Template

Copy this to your Vercel environment:

```env
# Database (Required)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth (Required)
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# AI (Required for AI features)
GROQ_API_KEY="gsk_..."

# Optional
LANGCHAIN_API_KEY=""
LANGCHAIN_TRACING_V2=false
LANGCHAIN_PROJECT="pathshala-design-studio"
```

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Ensure all environment variables are set
- Database must be accessible from Vercel

### Database Connection Issues
- Verify DATABASE_URL format includes `?sslmode=require`
- For Supabase, use the pooled connection (port 6543)
- Check if database is in same region as Vercel

### Auth Issues
- NEXTAUTH_URL must match your production domain exactly
- NEXTAUTH_SECRET must be at least 32 characters
- Clear cookies if testing locally and production

### AI Features Not Working
- Verify GROQ_API_KEY is valid
- Check Vercel function logs for API errors
- AI features gracefully degrade if not configured

---

## Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

---

## Architecture

```
pathshala-design-studio/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   └── projects/     # Project management
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── prisma.ts     # Database client
│   │   └── ai-agents.ts  # AI validation
│   └── middleware.ts     # Auth middleware
├── prisma/
│   └── schema.prisma     # Database schema
└── vercel.json           # Vercel configuration
```

---

## Support

For issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connectivity
4. Review error boundaries in UI

Happy deploying! 🎉
