# Complete Setup & Tracing Guide - Pathshala Design Studio

## 🎯 What We've Built

A **multiagent AI system** with **LangSmith tracing** for education program design validation:

```
┌─────────────────────────────────────────────────────┐
│         Pathshala Design Studio                      │
│   (Education Program Design Platform)               │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Multiagent AI Validation System              │  │
│  │                                                │  │
│  │  🤖 Agent 1: Logic Chain Validator           │  │
│  │  🤖 Agent 2: SMART Measurability Checker     │  │
│  │  🤖 Agent 3: Context Advisor                 │  │
│  │  🤖 Agent 4: Quality Scorer                  │  │
│  │                                                │  │
│  │  🔍 Powered by: Groq + LangSmith Tracing    │  │
│  │  💾 Database: Supabase PostgreSQL             │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Setup Checklist

### ✅ Phase 1: Database (Supabase PostgreSQL)

- [x] Created Prisma schema with all models
- [x] Configured for Prisma v7
- [x] Set up Supabase connection with URL encoding
- [x] Installed dependencies: `npm install groq-sdk langsmith @langchain/langgraph`

**Your Encoded Password:**
```
Shree%40225422%5D
```

**To Complete:**
```powershell
cd w:\hackathon\pathshala-design-studio
npx prisma db push  # Create database tables
npm run dev         # Start server
```

### ✅ Phase 2: AI Agents (Groq + Multi-Agent System)

- [x] Created 4 specialized agents
- [x] Logic Chain Validator
- [x] SMART Measurability Checker
- [x] Context Advisor
- [x] Quality Scorer
- [x] Orchestrator for batch execution

**Files:**
- `src/lib/ai-agents.ts` - Main agent implementations
- `src/app/api/ai/validate/route.ts` - API endpoint
- `src/components/AIValidationPanel.tsx` - Results UI

### ✅ Phase 3: LangSmith Tracing

- [x] Created tracing infrastructure
- [x] Batch trace orchestration
- [x] Agent result logging
- [x] LangSmith integration layer

**Files:**
- `src/lib/langsmith-tracing.ts` - Tracing utilities
- `LANGSMITH_MULTIAGENT_GUIDE.md` - Detailed guide
- `DATABASE_LANGSMITH_SETUP.md` - Complete setup

---

## 🚀 Quick Start (Next Steps)

### Step 1: Update .env with Your Credentials

Edit `w:\hackathon\pathshala-design-studio\.env`:

```env
# Supabase Database (already set - verify encoding)
DATABASE_URL=postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:5432/postgres

# Groq API (already set - verify it's active)
GROQ_API_KEY=gsk_your_groq_api_key_here

# LangSmith Tracing (NEW - add these)
LANGCHAIN_API_KEY=lsk_your_api_key_from_smith_langchain_com
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=pathshala-design-studio
```

### Step 2: Create Database Tables

```powershell
cd w:\hackathon\pathshala-design-studio

# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

**Expected output:**
```
✓ Prisma schema pushed to database
✓ Successfully created tables: users, organizations, lfa_projects, ...
```

### Step 3: Set Up LangSmith Tracing (Optional but Recommended)

1. Visit https://smith.langchain.com
2. Sign up (free)
3. Go to Settings → API Keys
4. Create new API key (starts with `lsk_`)
5. Copy and paste in `.env` as `LANGCHAIN_API_KEY`

### Step 4: Start Dev Server

```powershell
npm run dev
```

Should see:
```
✓ Ready in 1.2s
GET /auth/register 200
GET /api/ai/validate (ready when called)
```

### Step 5: Test the Flow

1. Open http://localhost:3000/auth/register
2. Create account
3. Create a project
4. Fill in program details
5. Click validate
6. See AI results in UI
7. Check LangSmith dashboard at https://smith.langchain.com/projects

---

## 🔍 Understanding the Multiagent Flow

### When User Clicks "Validate"

```
User Interface
    ↓
POST /api/ai/validate
    ↓
┌─────────────────────────────────────┐
│ Orchestrator Starts Batch Trace     │
│ (LangSmith records this)            │
└─────────────────────────────────────┘
    ↓
┌──────────────────┬────────────────┬──────────────────┬──────────────────┐
│ Logic Validator  │ SMART Checker  │ Context Advisor  │ Quality Scorer   │
│ (2-3 seconds)    │ (1-2 seconds)  │ (1-2 seconds)    │ (1-2 seconds)    │
│                  │                │                  │                  │
│ Input:           │ Input:         │ Input:           │ Input:           │
│ - Activities     │ - Outcomes     │ - Problem        │ - All results    │
│ - Outcomes       │ - Criteria     │ - Theme          │                  │
│ - Impact         │                │ - Stakeholders   │                  │
│                  │                │                  │                  │
│ Output:          │ Output:        │ Output:          │ Output:          │
│ {                │ {              │ {                │ {                │
│   isValid: bool  │   isValid: bool│   suggestions: []│   overallScore   │
│   score: 92      │   score: 88    │   score: 85      │   score: 88      │
│   issues: [...]  │   issues: []   │ }                │   issues: [...]  │
│ }                │ }              │                  │ }                │
└──────────────────┴────────────────┴──────────────────┴──────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Batch Completes (Total: 6-8 sec)    │
│ LangSmith logs complete trace       │
│ Return results to UI                │
└─────────────────────────────────────┘
    ↓
UI Displays Results
    ↓
User Opens LangSmith Dashboard
    ↓
See complete execution trace with:
- Each agent's input/output
- Token consumption
- Timing
- Any errors
```

---

## 📊 LangSmith Dashboard Features

### What You'll See:

**1. Real-Time Execution:**
- Watch agents execute live
- See token count increase
- Monitor latency

**2. Agent Performance:**
```
Agent               | Duration | Tokens | Status
--------------------|----------|--------|--------
logic-validator     | 2.3s     | 847    | ✓
smart-checker       | 1.8s     | 623    | ✓
context-advisor     | 1.5s     | 421    | ✓
quality-scorer      | 1.2s     | 356    | ✓
TOTAL               | 6.8s     | 2,247  | ✓
```

**3. Execution Flow:**
- Visual DAG showing agent dependencies
- Which agents ran in parallel
- Which ran sequentially

**4. Debugging:**
- Click any agent to see full response
- Check input that was sent
- Review any errors

---

## 📚 Documentation Files Created

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.md` | Supabase database setup |
| `LANGSMITH_MULTIAGENT_GUIDE.md` | Complete LangSmith guide |
| `DATABASE_LANGSMITH_SETUP.md` | Database + LangSmith combined guide |
| `PASSWORD_ENCODING_GUIDE.md` | URL encoding reference |
| `src/lib/langsmith-tracing.ts` | Tracing implementation |

---

## 🐛 Troubleshooting

### Database Connection Fails

```
Error: P1000: Authentication failed
```

**Solution:**
```env
# Check password is encoded
DATABASE_URL=postgresql://postgres:Shree%40225422%5D@...
                                       ↑       ↑
                                    %40    %5D
```

See `PASSWORD_ENCODING_GUIDE.md` for details.

### Registration Returns 500 Error

**Check:**
1. Supabase tables were created: `npx prisma db push`
2. Database credentials are correct in `.env`
3. Dev server logs show actual error (scroll up in terminal)

### Traces Don't Appear in LangSmith

**Check:**
1. API key is correct (starts with `lsk_`)
2. `LANGCHAIN_TRACING_V2=true` in .env
3. Dev server restarted after .env changes
4. Correct project selected in dashboard

---

## 🎓 Learning Resources

### AI Multiagent Concepts
- **LangSmith Docs:** https://docs.smith.langchain.com
- **LangChain LangGraph:** https://github.com/langchain-ai/langgraph

### Database
- **Supabase Docs:** https://supabase.com/docs
- **Prisma v7 Config:** https://www.prisma.io/docs/orm/reference/prisma-schema-reference

### Deployment
- **Vercel (Frontend):** https://vercel.com
- **Supabase Hosting (Database):** Auto-scaling

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Database:
- Can run `npx prisma db push` without errors
- Tables appear in Supabase dashboard
- Can register new users without 500 errors

✅ AI Validation:
- Click validate, see results appear in 6-10 seconds
- No errors in terminal
- Results displayed in UI

✅ LangSmith Tracing:
- Login to https://smith.langchain.com
- See "pathshala-design-studio" project
- Traces appear when you validate
- Can click and expand any agent trace

---

## 🚀 Next Phase: Advanced Features

Once basic setup is working:

1. **Performance Optimization**
   - Analyze slowest agents in LangSmith
   - Optimize Groq model selection
   - Add caching for repeated validations

2. **Team Features**
   - Share projects
   - Collaborative editing
   - Comment and feedback system

3. **Production Deployment**
   - Deploy to Vercel
   - Set up Supabase backup
   - Enable LangSmith monitoring

4. **Enhanced AI**
   - Add more validation agents
   - Custom stakeholder analysis
   - Geographic risk assessment

---

## 📞 Support

**Having issues?**

1. Check documentation files (*.md)
2. Review terminal error messages
3. Look at LangSmith traces for clues
4. Restart dev server after any changes

**All guides are in the project root directory!**

---

## 💾 Files Summary

### Core Files
- `src/lib/ai-agents.ts` - 4 agents + orchestrator
- `src/lib/langsmith-tracing.ts` - Tracing infrastructure
- `src/app/api/ai/validate/route.ts` - API endpoint
- `src/components/AIValidationPanel.tsx` - Results display
- `prisma/schema.prisma` - Database schema
- `.env` - Credentials (Supabase, Groq, LangSmith)

### Documentation
- `SUPABASE_SETUP.md`
- `LANGSMITH_MULTIAGENT_GUIDE.md`
- `DATABASE_LANGSMITH_SETUP.md`
- `PASSWORD_ENCODING_GUIDE.md`

### Configuration
- `prisma.config.ts` - Prisma v7 config
- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config

---

## ✨ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 Frontend                       │
│  (React components, auth pages, project management UI)       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  /auth/* → Authentication                                   │
│  /api/projects/* → Project CRUD                             │
│  /api/ai/validate → AI Multiagent Validation               │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ↓                    ↓                    ↓
┌──────────────┐   ┌──────────────────┐   ┌──────────────┐
│ Supabase DB  │   │   Groq API       │   │ LangSmith    │
│ (PostgreSQL) │   │ (4 AI Agents)    │   │ (Tracing)    │
└──────────────┘   └──────────────────┘   └──────────────┘
```

**Data Flow:**
1. User submits program data
2. API validates and stores in Supabase
3. Calls AI agents via Groq
4. LangSmith traces entire execution
5. Returns results with recommendations
6. UI displays scores and suggestions

---

## Ready to Go! 🚀

```powershell
# 1. Update .env with LangSmith key
# 2. Create database tables
cd w:\hackathon\pathshala-design-studio
npx prisma db push

# 3. Start dev server
npm run dev

# 4. Register and test
# Visit: http://localhost:3000/auth/register

# 5. Monitor traces
# Visit: https://smith.langchain.com/projects
```

**You're all set! 🎉**

Questions? Check the documentation files or review the source code comments.
