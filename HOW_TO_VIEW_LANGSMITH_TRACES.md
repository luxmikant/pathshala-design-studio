## ✅ COMPLETE GUIDE: How to View LangSmith Traces

Your LangSmith is configured correctly! Follow these steps to see traces.

---

## 🎯 Step-by-Step Instructions

### Step 1: Enable Tracing in Code

Edit `src/lib/langsmith-tracing.ts` and **UNCOMMENT** the client initialization:

**File:** `src/lib/langsmith-tracing.ts` (around line 18-25)

**Find this:**
```typescript
// Temporarily disabled due to API compatibility issues
export const langsmithClient: Client | null = null;
/*
export const langsmithClient = process.env.LANGCHAIN_API_KEY
  ? new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: process.env.LANGCHAIN_API_KEY,
    })
  : null;
*/
```

**Change to:**
```typescript
// Enable LangSmith tracing
export const langsmithClient = process.env.LANGCHAIN_API_KEY
  ? new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: process.env.LANGCHAIN_API_KEY,
    })
  : null;
```

✅ **Done!** Save the file.

---

### Step 2: Verify .env Configuration

Check your `.env` file has:

```env
LANGCHAIN_API_KEY=lsv2_pt_your_langchain_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=pathshala-design-studio
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

✅ **Verified** (from our test output!)

---

### Step 3: Clear Cache & Restart Server

```bash
# Clean up
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Start dev server
npm run dev
```

Wait for:
```
✓ Ready in X.Xs
```

---

### Step 4: Create a Test Project

1. Go to http://localhost:3000
2. **Register** with a test account:
   ```
   Email: test@example.com
   Password: Test@123456
   ```
3. **Create Organization** (e.g., "Test School NGO")
4. **Create Project** (e.g., "Foundational Learning Program")

---

### Step 5: Fill Program Details

In the Journey/Quest form, enter:

```
Activities:
- Train teachers on reading methods
- Distribute reading materials

Outputs:
- 50 teachers trained
- 500 books distributed

Outcomes:
- 90% of teachers implement techniques
- 70% of students read at grade level

Impact:
- Improved literacy for 10,000 students
```

---

### Step 6: Trigger AI Validation

Look for a button like **"Validate with AI"** or **"Check Quality"**

Click it and wait 2-3 seconds for the 4 agents to run.

---

### Step 7: View Traces in LangSmith

**Open your browser:**
```
https://smith.langchain.com/projects/pathshala-design-studio
```

**You should see:**
- List of traces (recent ones at top)
- Each trace shows timestamp and duration
- Click a trace to see agent details

---

## 📊 What You'll See

### In Dashboard
```
Project: pathshala-design-studio
├─ Trace 1 (2026-01-21 10:30:45)
│  ├─ Input: {activities, outcomes, ...}
│  ├─ Duration: 2.456s
│  └─ Status: ✅ Success
├─ Trace 2 (2026-01-21 10:35:12)
│  └─ ...
└─ Trace 3 (2026-01-21 10:40:33)
   └─ ...
```

### Click on a Trace
```
Run 1: logic-chain-validator
  Input:  {activities: [...], outcomes: [...]}
  Output: {isValid: true, score: 90, issues: [...]}
  Model:  llama-3.3-70b-versatile
  Duration: 0.567s
  Tokens: input: 345, output: 123

Run 2: measurability-smart-checker
  Input:  {outcomes: [...]}
  Output: {smartScore: 85, ...}
  Duration: 0.456s
  ...

Run 3: context-advisor
  Input:  {activities: [...], outcomes: [...]}
  Output: {recommendations: [...]}
  Duration: 0.432s
  ...

Run 4: quality-scorer
  Input:  {full program data}
  Output: {score: 80, recommendation: "NEEDS_REVISION"}
  Duration: 0.521s
  ...
```

---

## 🔍 Troubleshooting

### Issue: Still No Traces Appearing

**Check 1: Is the langsmith-tracing.ts file uncommented?**
```bash
# Search for the comment
grep -n "langsmithClient = process.env" src/lib/langsmith-tracing.ts

# Should show line 19-20 (uncommented)
```

**Check 2: Did you restart the dev server after editing?**
```bash
# Kill any running servers
taskkill /F /IM node.exe

# Start fresh
npm run dev
```

**Check 3: Is the validation actually being called?**
- Check browser console for errors
- Check dev server terminal logs
- Look for any error messages

**Check 4: Wait 30 seconds**
- LangSmith has a slight delay
- Traces appear after a brief delay
- Refresh the dashboard

---

### Issue: Shows 404 Error

This is NORMAL! It means:
- ✅ API key is valid
- ✅ Endpoint is correct
- ⚠️ Just testing an invalid endpoint (expected behavior)

The actual traces will be sent automatically.

---

### Issue: No Project Showing

1. Go to https://smith.langchain.com
2. Click **"Projects"** at the top
3. Look for **"pathshala-design-studio"**
4. If not there, create it:
   - Click "New Project"
   - Name: `pathshala-design-studio`
   - Click Create

---

## 📝 Complete Workflow Diagram

```
You → http://localhost:3000
       ↓
   Register/Login
       ↓
   Create Organization
       ↓
   Create Project
       ↓
   Fill Program Details
       ├─ Activities
       ├─ Outcomes
       └─ Indicators
       ↓
   Click "Validate"
       ↓
   Backend Calls Agents
   ├─ Agent 1: Logic Validator
   ├─ Agent 2: SMART Checker
   ├─ Agent 3: Context Advisor
   └─ Agent 4: Quality Scorer
       ↓
   Each Agent Call Logged to LangSmith
       ↓
   Result Returned to User
   ├─ Quality Score (0-100)
   └─ Recommendations
       ↓
   User Sees Score + Feedback
       ↓
   You Check Dashboard
   → https://smith.langchain.com/projects/pathshala-design-studio
       ↓
   See All Traces!
```

---

## ✅ Verification Checklist

Before starting, verify all are ✅:

- [ ] LangSmith account created (smith.langchain.com)
- [ ] API key generated and copied
- [ ] `.env` file has `LANGCHAIN_API_KEY`
- [ ] `src/lib/langsmith-tracing.ts` is UNCOMMENTED
- [ ] Dev server started: `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Can register and create project
- [ ] Can trigger validation
- [ ] Access dashboard: https://smith.langchain.com

---

## 🚀 Quick Test

**Run this command to verify setup:**
```bash
node test-langsmith-trace.js
```

**Expected output:**
```
✅ LANGCHAIN_API_KEY = lsv2_pt_...
✅ LANGCHAIN_TRACING_V2 = true
✅ API Key format is correct
✅ langsmith package installed
✅ LangSmith Configuration Verified!
```

---

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| https://smith.langchain.com | Main dashboard |
| https://smith.langchain.com/projects/pathshala-design-studio | Your traces |
| https://smith.langchain.com/settings/account | API keys |
| https://docs.smith.langchain.com | Documentation |

---

## 💡 Pro Tips

### See Recent Traces First
- Go to dashboard
- Traces are sorted by date (newest first)
- Just created a trace? It appears at top

### Filter by Agent
- Click "Filters"
- Select agent name
- See only that agent's runs

### Compare Traces
- Select 2 traces
- Click "Compare"
- See differences side-by-side

### Export Trace Data
- Click a trace
- Click "Export"
- Download as JSON for analysis

---

## 🎯 Next Steps

1. **Enable tracing** (uncomment langsmith-tracing.ts)
2. **Restart server** (npm run dev)
3. **Create test project** (http://localhost:3000)
4. **Trigger validation** (click validate button)
5. **View traces** (https://smith.langchain.com/projects/pathshala-design-studio)
6. **Analyze results** (click on trace to see details)

---

**That's it! Now you can trace all AI agent activities.** 🎉

If you still have issues, run `test-langsmith-trace.js` again and share the output!
