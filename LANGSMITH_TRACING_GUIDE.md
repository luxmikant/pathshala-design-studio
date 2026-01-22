## 🔍 LangSmith Tracing Setup Guide

### Step 1: Verify LangSmith Credentials

First, check your `.env` file has all required variables:

```bash
# Required for LangSmith
LANGCHAIN_API_KEY=lsv2_pt_your_langchain_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=pathshala-design-studio
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

**Where to get these:**
1. Go to https://smith.langchain.com
2. Sign up with GitHub
3. Click your profile → API Keys
4. Create new API key
5. Copy and paste into `.env`

---

### Step 2: Enable LangSmith Tracing in Code

Edit `src/lib/langsmith-tracing.ts` and uncomment the client:

```typescript
// UNCOMMENT THIS:
export const langsmithClient = process.env.LANGCHAIN_API_KEY
  ? new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: process.env.LANGCHAIN_API_KEY,
    })
  : null;
```

---

### Step 3: Install Required Package

Make sure `langsmith` is installed:

```bash
npm install langsmith
```

---

### Step 4: Verify Tracing Configuration

Check these environment variables are set:

```bash
# In terminal:
echo $env:LANGCHAIN_API_KEY
echo $env:LANGCHAIN_TRACING_V2
echo $env:LANGCHAIN_PROJECT
```

**Expected output:**
```
lsv2_pt_your_key_here...
true
pathshala-design-studio
```

---

### Step 5: Test LangSmith Connection

Run the test script with tracing enabled:

```bash
node test-langsmith-trace.js
```

---

### Step 6: View Traces in Dashboard

1. Go to https://smith.langchain.com
2. Select project: **pathshala-design-studio**
3. Click **"Traces"** tab
4. You should see recent AI agent calls

---

## 🎯 How Tracing Works

```
User Action
    ↓
API Route (/api/ai/validate)
    ↓
Trace Created (with metadata)
    ↓
Agent 1 Called → Logged with input/output
    ↓
Agent 2 Called → Logged with input/output
    ↓
Agent 3 Called → Logged with input/output
    ↓
Agent 4 Called → Logged with input/output
    ↓
Trace Completed → Sent to LangSmith
    ↓
Available in Dashboard at smith.langchain.com
```

---

## 📊 What You'll See in LangSmith

### Traces View
- **Project**: pathshala-design-studio
- **Traces**: Each validation call
- **Timestamp**: When it ran
- **Status**: Success/Error
- **Duration**: How long it took
- **Tokens**: Input/output token count

### Drill Down Into Trace
- **Inputs**: What was sent to the agent
- **Outputs**: What the agent returned
- **Model**: llama-3.3-70b-versatile
- **Metadata**: Tags, project name, etc.

### Metrics
- Average latency
- Success rate
- Token usage
- Error patterns

---

## 🐛 Troubleshooting

### Issue 1: "No traces appearing"

**Check:**
```bash
# Is LANGCHAIN_API_KEY set?
echo $env:LANGCHAIN_API_KEY

# Is LANGCHAIN_TRACING_V2 true?
echo $env:LANGCHAIN_TRACING_V2

# Is the API key valid?
# (Try accessing https://smith.langchain.com)
```

**Fix:**
```bash
# Update .env
LANGCHAIN_API_KEY=your_actual_key_here
LANGCHAIN_TRACING_V2=true

# Restart server
npm run dev
```

---

### Issue 2: "Connection refused"

**Check:**
- Is LangSmith API endpoint correct?
  ```
  https://api.smith.langchain.com (correct)
  https://smith.langchain.com (wrong)
  ```

**Fix:**
```env
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

---

### Issue 3: "Invalid API Key"

**Check:**
- API key format should start with `lsv2_pt_`
- No extra spaces or quotes
- In `.env`, not in quotes

**Fix:**
```env
# ✅ Correct
LANGCHAIN_API_KEY=lsv2_pt_abc123xyz789

# ❌ Wrong
LANGCHAIN_API_KEY="lsv2_pt_abc123xyz789"
LANGCHAIN_API_KEY= lsv2_pt_abc123xyz789 (space)
```

---

### Issue 4: "Tracing disabled in code"

The LangSmith client is commented out in `langsmith-tracing.ts`.

**Fix:**
Uncomment these lines:

```typescript
// src/lib/langsmith-tracing.ts (around line 18-25)

export const langsmithClient = process.env.LANGCHAIN_API_KEY
  ? new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: process.env.LANGCHAIN_API_KEY,
    })
  : null;
```

---

## ✅ Verification Checklist

- [ ] LangSmith account created (smith.langchain.com)
- [ ] API key generated
- [ ] `.env` has LANGCHAIN_API_KEY
- [ ] `.env` has LANGCHAIN_TRACING_V2=true
- [ ] `.env` has LANGCHAIN_PROJECT=pathshala-design-studio
- [ ] `langsmith-tracing.ts` uncommented
- [ ] `npm install langsmith` run
- [ ] Dev server restarted (`npm run dev`)
- [ ] Test trace script executed
- [ ] Traces visible in dashboard

---

## 🚀 Next Steps

### Test End-to-End

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open browser**
   ```
   http://localhost:3000/auth/register
   ```

3. **Create account & project**
   - Register
   - Create a new project
   - Fill in program details

4. **Trigger validation**
   - Click "Validate with AI"
   - Watch the 4 agents run

5. **Check LangSmith**
   - Go to https://smith.langchain.com
   - Select project
   - See new traces appear

---

## 📝 Sample Trace Output

When working correctly, you'll see:

```json
{
  "id": "trace-abc123",
  "project_name": "pathshala-design-studio",
  "timestamp": "2026-01-21T10:30:45.123Z",
  "duration": 2.456,
  "agents": [
    {
      "name": "logic-chain-validator",
      "input": {
        "activities": [...],
        "outcomes": [...]
      },
      "output": {
        "isValid": true,
        "score": 90,
        "issues": []
      },
      "duration": 0.567
    },
    {
      "name": "measurability-smart-checker",
      "input": {...},
      "output": {...},
      "duration": 0.456
    }
    // ... more agents
  ],
  "status": "success",
  "tags": ["validation", "education-program", "multi-agent"]
}
```

---

## 🔗 Quick Links

- **LangSmith Dashboard**: https://smith.langchain.com
- **Create API Key**: https://smith.langchain.com/settings/account
- **View Project**: https://smith.langchain.com/projects/pathshala-design-studio
- **LangSmith Docs**: https://docs.smith.langchain.com

---

## 📞 Still Having Issues?

**Check logs:**
```bash
# Start dev server with debug logs
DEBUG=langsmith:* npm run dev
```

**Verify connection:**
```bash
# Run test
node test-langsmith-trace.js
```

**Check dashboard:**
- Are you logged into the right account?
- Is the API key from the right account?
- Did you wait 30 seconds for traces to appear? (slight delay)

---

**Status**: Follow the steps above and traces will appear in LangSmith! 🎯
