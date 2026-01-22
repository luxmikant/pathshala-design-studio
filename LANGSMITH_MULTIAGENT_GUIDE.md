# LangSmith Multiagent Tracing Guide

## Overview

LangSmith provides **real-time visibility** into your multiagent AI system. Watch as:
- Each agent processes requests
- Agents collaborate and pass data
- Decisions are made and why
- Tokens are consumed
- Performance metrics update

## Quick Start (5 minutes)

### Step 1: Create LangSmith Account
1. Visit https://smith.langchain.com
2. Sign up (free tier includes 1,000 traces/month)
3. You'll land on the dashboard

### Step 2: Generate API Key
1. Click your **avatar** (top-right) → **Settings**
2. Navigate to **API keys** section
3. Click **"Create New API Key"**
4. Copy the key (e.g., `lsk_...`)

### Step 3: Update `.env` File

Edit `w:\hackathon\pathshala-design-studio\.env` and add:

```env
# LangSmith Tracing Configuration
LANGCHAIN_API_KEY=lsk_your_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=pathshala-design-studio
```

**Keep your API key secret!** Never commit it to GitHub.

### Step 4: Restart Dev Server

```powershell
cd w:\hackathon\pathshala-design-studio
npm run dev
```

### Step 5: Trigger a Validation

1. Open http://localhost:3000/auth/register
2. Create an account
3. Create a new project
4. Add program details
5. The AI validation will run

### Step 6: View Live Traces

1. Open https://smith.langchain.com/projects
2. Select **"pathshala-design-studio"** project
3. Click on a trace to expand details

---

## Understanding Traces

### Trace Structure

```
┌─ Orchestrator Trace (Main Validation)
│  ├─ Logic Chain Validator Agent
│  │  ├─ Input: Activities, Outcomes, Impact
│  │  └─ Output: LogicChainResult {isValid, score, issues}
│  │
│  ├─ SMART Measurability Checker Agent
│  │  ├─ Input: Outcomes
│  │  └─ Output: MeasurabilityResult
│  │
│  ├─ Context Advisor Agent
│  │  ├─ Input: Program details
│  │  └─ Output: ContextResult
│  │
│  └─ Quality Scorer Agent
│     ├─ Input: All previous results
│     └─ Output: OverallQualityScore
```

### What Each Trace Shows

| Field | Meaning |
|-------|---------|
| **Name** | Agent or function name |
| **Input** | Data sent to the agent |
| **Output** | Result returned by agent |
| **Duration** | How long it took (ms) |
| **Tokens** | LLM tokens used |
| **Status** | ✓ Success or ✗ Error |
| **Metadata** | Custom tags and context |

---

## Key Features

### 1. Real-Time Monitoring
- Watch traces as they execute
- No delays or batching
- Perfect for debugging

### 2. Performance Analytics
```
Dashboard shows:
├─ Total traces per day
├─ Average latency per agent
├─ Token usage trends
├─ Error rates
└─ Top slowest operations
```

### 3. Debugging Failed Validations
```
Click on error trace to see:
├─ Exact error message
├─ Full LLM response
├─ Input that caused it
└─ Stack trace (if applicable)
```

### 4. Agent Comparison
- Compare logic validator vs measurability checker
- Identify which agent is slowest
- Track score changes over time

### 5. Custom Tags & Filtering
```
Filter traces by:
├─ validation (validation operations)
├─ education-program (domain)
├─ logical-framework (methodology)
├─ groq-inference (LLM provider)
└─ multi-agent (orchestration)
```

---

## Example Trace Walkthrough

### Scenario: User validates a program design

**In Dashboard:**

```
Trace: validation-orchestrator
├─ Inputs:
│  ├─ activities: ["Train teachers", "Distribute materials", ...]
│  ├─ outputs: ["Teachers trained", "Materials distributed", ...]
│  ├─ outcomes: ["Improved student engagement", ...]
│  └─ impact: "Increase learning outcomes in 5 districts"
│
├─ Agents Executed (sequentially):
│  ├─ [3.2s] logic-chain-validator
│  │  └─ Output: {isValid: true, score: 92, issues: [...]}
│  │
│  ├─ [2.1s] measurability-smart-checker
│  │  └─ Output: {isValid: true, score: 88, issues: [...]}
│  │
│  ├─ [1.8s] context-advisor
│  │  └─ Output: {suggestions: [...], score: 85}
│  │
│  └─ [1.5s] quality-scorer
│     └─ Output: {overallScore: 88, recommendation: "Good design"}
│
├─ Total Duration: 8.6 seconds
├─ Total Tokens: 2,847 (input: 1,203, output: 1,644)
└─ Status: ✓ Success
```

---

## Advanced Features

### Comparing Agent Versions

Test new agent logic:

1. Update an agent in `src/lib/ai-agents.ts`
2. Run validation
3. View new trace in LangSmith
4. Compare side-by-side with previous version
5. Decide if improvement is worth it

### Identifying Bottlenecks

**From the dashboard:**
- Sort by duration
- Find slowest agents
- Check if they can be optimized
- Monitor token usage

### Exporting Traces

LangSmith allows:
- Download trace data as JSON
- Export to CSV for analysis
- Create custom reports
- Share traces with team

---

## Troubleshooting

### Traces Not Appearing?

**Check 1: API Key**
```
Verify in .env:
LANGCHAIN_API_KEY=lsk_... (should start with 'lsk_')
```

**Check 2: Restart Server**
```powershell
# Stop current dev server (Ctrl+C)
npm run dev
```

**Check 3: Check for Errors**
```
Look at terminal output:
✓ If "LangSmith tracing enabled" appears → working
✗ If any error → check API key format
```

### API Key Not Working?

1. Log in to https://smith.langchain.com
2. Go to Settings → API keys
3. Generate a **new** key (old one might be deleted)
4. Update `.env` and restart dev server

### Missing Recent Traces?

- Refresh the LangSmith page
- Check project filter (top-left)
- Ensure LANGCHAIN_PROJECT matches

---

## Environment Variables Summary

```env
# Required for tracing
LANGCHAIN_API_KEY=lsk_xxxxx

# Enable automatic LangChain tracing
LANGCHAIN_TRACING_V2=true

# Project name (organize traces)
LANGCHAIN_PROJECT=pathshala-design-studio

# Optional: Custom base URL (usually not needed)
# LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

---

## Best Practices

✅ **DO:**
- Enable tracing in development (helps debugging)
- Review traces regularly to optimize agents
- Use custom tags for filtering
- Set meaningful run names

❌ **DON'T:**
- Commit API keys to GitHub
- Use tracing for massive production volumes (costs money)
- Leave old projects cluttering the dashboard
- Share API keys in Slack/email

---

## Dashboard Navigation

### Main Sections

1. **Projects** (left sidebar)
   - Switch between different projects
   - Create new projects

2. **Traces** (center)
   - List of all executions
   - Click to expand details

3. **Analytics** (top)
   - Performance charts
   - Token usage
   - Error rates

4. **Settings** (gear icon)
   - API keys
   - Team management
   - Billing

---

## Next Steps

1. ✅ Set up .env with LangSmith credentials
2. ✅ Restart dev server
3. ✅ Trigger a validation
4. ✅ Watch traces appear in real-time
5. ✅ Explore the dashboard
6. ✅ Test different program designs
7. ✅ Monitor agent performance

## Support

- **LangSmith Docs**: https://docs.smith.langchain.com
- **API Reference**: https://api.smith.langchain.com/docs
- **Community Discord**: https://discord.gg/6adMQxSpJS
- **Issues/Feedback**: GitHub issues or email support@langchain.com

---

## Free Tier Details

✅ **Included:**
- 1,000 traces per month
- Real-time tracing
- Basic analytics
- Unlimited storage
- No credit card required

💰 **Premium** (optional):
- Unlimited traces
- Advanced analytics
- Team features
- Priority support

Start free, upgrade when needed!
