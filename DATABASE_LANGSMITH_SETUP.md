# Database Connection & LangSmith Tracing Setup Guide

## Part 1: Fix Supabase Database Connection

### Problem: "Authentication failed"

The database password contains special characters that need URL encoding.

### Solution:

**Your current password:** `Shree@225422]`

**Special characters that need encoding:**
- `@` → `%40`
- `]` → `%5D`

**Step 1: Get Correct Connection String**

Go to Supabase dashboard:
1. https://app.supabase.com
2. Select your project
3. Settings (gear icon) → Database
4. Copy the **direct URL** (port 5432, not 6543)

**Example format:**
```
postgresql://postgres.YOUR_REF:YOUR_PASSWORD@db.YOUR_ENDPOINT.supabase.co:5432/postgres
```

**Step 2: Manually Encode the Password**

For password `Shree@225422]`:

```
Original:  Shree@225422]
Encoded:   Shree%40225422%5D
```

**Step 3: Build Complete Connection Strings**

Update `.env` with:

```env
# Connection pooler (Transaction mode) - for queries
DATABASE_URL="postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:6543/postgres?pgbouncer=true"

# Direct connection (Session mode) - for migrations
DIRECT_URL="postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:5432/postgres"
```

**Step 4: Save and Restart**

```powershell
# Restart your dev server to reload .env
npm run dev
```

**Step 5: Test the Connection**

```powershell
cd w:\hackathon\pathshala-design-studio
npx prisma db push
```

If successful, you'll see:
```
✓ Prisma schema pushed to database
```

---

## Part 2: LangSmith Multiagent Tracing Setup

### What is LangSmith?

Real-time visualization and tracing of your multiagent AI system. See:
- Each agent's decisions
- Token usage per agent
- Latency and performance
- Error debugging

### Quick Start (3 minutes)

**Step 1: Create LangSmith Account**
```
https://smith.langchain.com
→ Sign up (free)
```

**Step 2: Get API Key**
```
Settings → API Keys → Create New API Key
```

**Step 3: Update .env**

Add to your `.env`:
```env
LANGCHAIN_API_KEY=lsk_your_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=pathshala-design-studio
```

**Step 4: Restart Dev Server**
```powershell
npm run dev
```

**Step 5: Trigger AI Validation**

1. Register at http://localhost:3000/auth/register
2. Create a project
3. Run validation
4. Go to https://smith.langchain.com/projects
5. See traces appear in real-time!

---

## Part 3: Understanding Multiagent Flow in LangSmith

### Flow Diagram

```
Your API Call
    ↓
┌─────────────────────────────────────────┐
│  ORCHESTRATOR (Batch Trace)             │
│                                          │
│  ├─→ [2.3s] Logic Chain Validator       │
│  │   - Validates Activity→Outcome chain │
│  │   - Output: validity score           │
│  │                                       │
│  ├─→ [1.8s] Measurability Checker       │
│  │   - Validates SMART criteria         │
│  │   - Output: outcome validity         │
│  │                                       │
│  ├─→ [1.5s] Context Advisor             │
│  │   - Sector-specific suggestions      │
│  │   - Output: recommendations          │
│  │                                       │
│  └─→ [1.2s] Quality Scorer              │
│      - Overall quality assessment       │
│      - Output: final score 85/100       │
│                                          │
└─────────────────────────────────────────┘
    ↓
Total: 6.8 seconds
Total Tokens: 2,847 (input: 1,203, output: 1,644)
```

### Dashboard Insights

**Real-time Metrics:**
- Agent execution time
- Token consumption
- Success/failure rate
- Error logs

**Agent Comparison:**
- Which agent is slowest?
- Which consumes most tokens?
- Which fails most often?

**Debugging:**
- Click any failed trace
- See exact LLM response
- Review input that caused error

---

## Part 4: Complete Example Flow

### Scenario: User Creates & Validates Program

**In Pathshala Dashboard:**
```
1. User signs up with email
2. Creates project "Education Initiative"
3. Fills in:
   - Activities: ["Train 100 teachers", ...]
   - Outcomes: ["Teachers equipped with skills", ...]
   - Impact: "Improve learning by 30%"
4. Clicks "Validate Design"
```

**In LangSmith Dashboard (Real-time):**

```
Run: validation-orchestrator
├─ Status: RUNNING
├─ Elapsed: 2.3s
│
├─ ✓ logic-chain-validator (completed in 2.3s)
│  └─ Output: {isValid: true, score: 92}
│
├─ ⏳ measurability-smart-checker (running...)
│  └─ Processed 1 of 3 outcomes
│
├─ ⏳ context-advisor (queued)
│  └─ Waiting for measurability to complete
│
└─ ⏳ quality-scorer (queued)
   └─ Will summarize all results
```

**After completion (8.6s later):**

```
Run: validation-orchestrator ✓
├─ Duration: 8.6s
├─ Total Tokens: 2,847
├─ Status: SUCCESS
│
├─ Agents (all successful):
│  ├─ logic-chain-validator: 92/100
│  ├─ measurability-checker: 88/100
│  ├─ context-advisor: suggestions [...]
│  └─ quality-scorer: 88/100
│
└─ Outputs:
   ├─ overallScore: 88
   ├─ recommendation: "Good design - Review-Ready"
   └─ criticalIssues: []
```

### Back in Pathshala UI:

```
✅ Validation Complete!

⭐ Overall Score: 88/100
📋 Status: Review-Ready

Strengths:
✓ Strong logic chain coherence
✓ Outcomes are SMART measurable
✓ Good stakeholder coverage

Areas for Improvement:
⚠ Add baseline data
⚠ Define success metrics clearly
```

---

## Troubleshooting

### Database Connection Fails

```
Error: P1000: Authentication failed
```

**Check:**
1. Password encoding: `@` → `%40`, `]` → `%5D`
2. Correct Supabase endpoint (not localhost)
3. PORT: Use 5432 for migrations, 6543 for queries
4. Restart dev server after .env changes

### LangSmith Traces Not Appearing

```
Check:
1. API key is correct (starts with lsk_)
2. LANGCHAIN_TRACING_V2=true in .env
3. Restart dev server
4. Visit https://smith.langchain.com/projects
5. Select "pathshala-design-studio" project
```

### Still Not Working?

1. Check terminal logs for errors
2. Verify .env file is in project root
3. Run `npm run dev` to reload env vars
4. Try creating new LangSmith API key

---

## URL Encoding Reference

```
Character | Encoded
----------|----------
@         | %40
]         | %5D
[         | %5B
#         | %23
&         | %26
=         | %3D
```

For your password `Shree@225422]`:
- `Shree` → `Shree` (no change)
- `@` → `%40`
- `225422` → `225422` (no change)
- `]` → `%5D`
- Result: `Shree%40225422%5D`

---

## Next Steps

1. ✅ Update .env with properly encoded Supabase credentials
2. ✅ Run `npx prisma db push` to create database tables
3. ✅ Set up LangSmith API key in .env
4. ✅ Restart dev server: `npm run dev`
5. ✅ Register and create a project
6. ✅ Trigger validation and watch traces in LangSmith!

## Success Criteria

You'll know it's working when:
- ✅ Registration works without 500 errors
- ✅ Database tables exist in Supabase
- ✅ Traces appear in LangSmith dashboard
- ✅ AI validation completes in <10 seconds
- ✅ Scores displayed in UI match LangSmith logs

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **LangSmith Docs**: https://docs.smith.langchain.com
- **Prisma v7 Config**: https://www.prisma.io/docs/orm/reference/prisma-schema-reference
- **URL Encoding**: https://www.urlencoder.org/

Need help? Check the guides:
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- [LANGSMITH_MULTIAGENT_GUIDE.md](LANGSMITH_MULTIAGENT_GUIDE.md)
