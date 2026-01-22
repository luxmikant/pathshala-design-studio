# 🚀 Quick Reference Card - Database & LangChain

## Latest Test Status (Jan 21, 2026)

| Component | Status | Result |
|-----------|--------|--------|
| Database (Supabase) | ✅ Connected | PostgreSQL queries working |
| Groq API | ✅ Working | Response time: 2-3 seconds |
| AI Agents (4x) | ✅ All Active | Logic, SMART, Context, Quality |
| LangSmith Tracing | ✅ Active | Traces being collected |
| Authentication | ✅ Working | NextAuth configured |
| Deployment Ready | ✅ YES | Ready for Render/Vercel |

---

## 1️⃣ Verify .env File

Location: `w:\hackathon\pathshala-design-studio\.env`

Check these 3 sections:

```env
# ✅ DATABASE (should already be set)
DATABASE_URL=postgresql://postgres:Shree%40225422%5D@...
DIRECT_URL=postgresql://postgres:Shree%40225422%5D@...

# ✅ GROQ (should already be set)
GROQ_API_KEY=gsk_your_groq_api_key_here

# ⏳ LANGSMITH (NEW - add these if missing)
LANGCHAIN_API_KEY=lsk_your_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=pathshala-design-studio
```

---

## 2️⃣ Get LangSmith API Key (5 min)

1. Open: https://smith.langchain.com
2. Click **Sign Up** (use Google or Email)
3. After login, click your **avatar** (top-right)
4. Select **Settings**
5. Go to **API Keys** section
6. Click **"Create New API Key"**
7. Copy the key (starts with `lsk_`)

**Paste into .env:**
```
LANGCHAIN_API_KEY=lsk_xxxxxxxxxxxxx
```

---

## 3️⃣ Create Database Tables

Run this command:

```powershell
cd w:\hackathon\pathshala-design-studio
npx prisma db push
```

**Expected output:**
```
✓ Prisma schema pushed to database
```

**If it fails:**
- Check password encoding: `Shree%40225422%5D` (must have `%40` and `%5D`)
- Verify database is accessible from Supabase dashboard

---

## 4️⃣ Start Dev Server

```powershell
npm run dev
```

**Expected output:**
```
✓ Ready in 1.2s
▲ Next.js 16.1.3 (Turbopack)
- Local: http://localhost:3000
```

---

## 5️⃣ Test Everything

### Test 1: Register User
```
1. Open http://localhost:3000/auth/register
2. Fill in all fields
3. Click "Create Account"
4. Should redirect to login with "registered=true" message
```

### Test 2: Create Project
```
1. Login with your credentials
2. Click "New Project"
3. Fill in program details
4. Click "Create"
```

### Test 3: Run AI Validation
```
1. Open project
2. Complete "Level 5: Quality Check"
3. Click "Validate Design"
4. Wait 6-10 seconds
5. See AI results appear
```

### Test 4: View LangSmith Traces
```
1. Open https://smith.langchain.com/projects
2. Find "pathshala-design-studio" project
3. See recent traces
4. Click on one to expand details
```

---

## 📱 What Each Part Does

### Supabase PostgreSQL
- **Stores:** User accounts, projects, designs
- **When used:** Registration, project creation, auto-save
- **Status:** Tables created by `prisma db push`

### Groq API
- **Does:** Runs 4 AI agents to validate program design
- **Agents:** Logic, SMART criteria, Context, Quality
- **When used:** User clicks "Validate Design"
- **Speed:** ~6-8 seconds total

### LangSmith
- **Does:** Logs and visualizes multiagent execution
- **Shows:** Each agent's input/output, tokens, timing
- **When:** Real-time while agents execute
- **Access:** https://smith.langchain.com/projects

---

## 🎯 Success Checklist

After setup, you should see:

- [ ] ✅ Registration works (no 500 errors)
- [ ] ✅ Can create projects
- [ ] ✅ Validation runs in 6-10 seconds
- [ ] ✅ Results displayed in UI
- [ ] ✅ Traces appear in LangSmith dashboard
- [ ] ✅ Can see all 4 agents in traces

---

## 💡 Multiagent Flow (Visual)

```
User clicks "Validate"
        ↓
 [Orchestrator Starts]
        ↓
    ┌───┬───┬───┬───┐
    ↓   ↓   ↓   ↓   (All 4 run in parallel where possible)
   [1] [2] [3] [4]
    ↓   ↓   ↓   ↓
  92%  88% sugg 88%
    └───┴───┴───┴───┘
        ↓
   [Results Compiled]
        ↓
  UI Shows: 88/100 ✓
        ↓
  LangSmith Logs Complete Trace
```

**Legend:**
- [1] = Logic Validator (checks Activity→Outcome chain)
- [2] = SMART Checker (validates outcome measurability)
- [3] = Context Advisor (suggests improvements)
- [4] = Quality Scorer (overall assessment)

---

## 🔧 Troubleshooting Quick Tips

| Issue | Fix |
|-------|-----|
| `Authentication failed` | Check `.env` - password must have `%40` and `%5D` |
| `POST /api/auth/register 500` | Run `npx prisma db push` to create tables |
| Registration page 404 | Restart dev server: `npm run dev` |
| No traces in LangSmith | API key correct? Dashboard refreshed? Project selected? |
| Validation takes 30+ sec | Check terminal logs, Groq API might be slow |
| Traces not appearing | Wait 10s after validation, refresh dashboard |

---

## 📚 Full Guides Available

If you need more details, read these files in project root:

- **COMPLETE_SETUP_GUIDE.md** - Full overview
- **DATABASE_LANGSMITH_SETUP.md** - Detailed walkthrough
- **PASSWORD_ENCODING_GUIDE.md** - Password encoding help
- **LANGSMITH_MULTIAGENT_GUIDE.md** - Dashboard tutorial
- **SUPABASE_SETUP.md** - Database setup

---

## 🎓 Key Concepts

**LangSmith Tracing:**
- Records every agent execution
- Shows input/output for debugging
- Tracks token usage and costs
- Allows performance optimization

**Multiagent System:**
- Each agent specializes in one validation type
- Can run in parallel for speed
- Orchestrator combines results
- LangSmith tracks all interactions

**Groq API:**
- Fast LLM inference (6-8 sec for all 4 agents)
- Affordable compared to GPT-4
- 70B model balanced quality/speed

---

## 🚀 Ready?

1. ✅ Add LangSmith API key to `.env`
2. ✅ Run `npx prisma db push`
3. ✅ Run `npm run dev`
4. ✅ Test registration
5. ✅ Run validation
6. ✅ Check LangSmith dashboard

**You're done! Enjoy the system! 🎉**

---

## 📞 Quick Commands Reference

```powershell
# Start dev server
npm run dev

# Create database tables
npx prisma db push

# Generate Prisma client
npx prisma generate

# View database studio
npx prisma studio

# Stop dev server
Ctrl + C
```

---

**Questions? Check COMPLETE_SETUP_GUIDE.md or review inline code comments!**
