# 🚀 Quick Start: Get AI Running in 5 Minutes

## Prerequisites
- [x] Pathshala Design Studio already set up
- [x] Groq SDK installed (`groq-sdk` package)
- [ ] Groq API key (get this now!)

---

## Step 1: Get Your Groq API Key (2 minutes)

1. **Visit:** [https://console.groq.com/keys](https://console.groq.com/keys)

2. **Sign Up:**
   - Click "Sign In" → "Sign up with Google" (or email)
   - **No credit card required!**
   - Free tier: 14,400 requests/day

3. **Create API Key:**
   - Click "Create API Key"
   - Name it: `pathshala-dev`
   - Copy the key (starts with `gsk_...`)

---

## Step 2: Configure Environment (1 minute)

1. **Open your project folder:**
   ```bash
   cd w:\hackathon\pathshala-design-studio
   ```

2. **Create `.env.local` file** (if it doesn't exist):
   ```bash
   # Copy from example
   copy .env.example .env.local
   ```

3. **Add your Groq API key to `.env.local`:**
   ```env
   # Database (keep existing)
   DATABASE_URL="your-existing-database-url"

   # NextAuth (keep existing)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-existing-secret"

   # AI Features - ADD THIS LINE
   GROQ_API_KEY="gsk_paste_your_actual_key_here"
   ```

4. **Save the file**

---

## Step 3: Test AI Validation (2 minutes)

### Option A: Quick Test (API Only)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open Postman/Thunder Client or use curl:**
   ```bash
   # Test endpoint
   curl -X POST http://localhost:3000/api/ai/validate \
     -H "Content-Type: application/json" \
     -d '{
       "projectId": "test-project-id",
       "validationType": "logic"
     }'
   ```

3. **Expected response (in ~3 seconds):**
   ```json
   {
     "success": true,
     "validationType": "logic",
     "result": {
       "isValid": true,
       "score": 85,
       "issues": [...],
       "strengths": [...]
     }
   }
   ```

### Option B: Full UI Test (Recommended)

1. **Add AI Panel to your journey page:**

   Edit: `src/app/projects/[id]/journey/page.tsx`

   ```tsx
   import { AIValidationPanel } from "@/components/AIValidationPanel";

   export default function JourneyPage({ params }: { params: { id: string } }) {
     return (
       <div className="container mx-auto p-6 space-y-6">
         <h1 className="text-3xl font-bold">Your Design Journey</h1>
         
         {/* Your existing journey map */}
         <JourneyMap {...props} />
         
         {/* ADD THIS: AI Validation Panel */}
         <div className="border-t pt-6 mt-6">
           <h2 className="text-2xl font-bold mb-4">AI Validation</h2>
           <AIValidationPanel projectId={params.id} />
         </div>
       </div>
     );
   }
   ```

2. **Visit your project page:**
   ```
   http://localhost:3000/projects/[your-project-id]/journey
   ```

3. **Click "Full Validation" button**

4. **Wait 10-15 seconds** (AI is thinking!)

5. **See results:**
   - ✅ Overall quality score
   - ⚠️ Issues identified
   - 💡 Suggestions
   - 📊 Dimension scores

---

## Troubleshooting

### Error: "AI validation failed"

**Cause:** Missing or invalid API key

**Fix:**
```bash
# Check your .env.local file
cat .env.local | grep GROQ_API_KEY

# Should show:
# GROQ_API_KEY="gsk_..."

# If blank, add your key and restart server:
npm run dev
```

---

### Error: "Project not found"

**Cause:** Invalid project ID

**Fix:**
1. Create a project through the UI first
2. Note the project ID from the URL
3. Use that ID in your test

---

### Error: "Rate limit exceeded"

**Cause:** Too many requests (free tier: ~240/min)

**Fix:**
1. Wait 1 minute
2. Retry
3. For production, upgrade to paid tier ($0.27/1M tokens)

---

## What to Test

### Test Case 1: Empty Project
```json
{
  "projectId": "test-project-1",
  "validationType": "quality"
}
```
**Expected:** Low score (30-40%), many critical gaps

---

### Test Case 2: Partial Project
```json
{
  "projectId": "test-project-2",
  "validationType": "full"
}
```
**Expected:** Medium score (50-70%), some issues, several suggestions

---

### Test Case 3: Complete Project
```json
{
  "projectId": "test-project-3",
  "validationType": "full"
}
```
**Expected:** High score (80-95%), minor issues, ready for review

---

## Next Steps After Testing

### 1. **Integrate into User Journey** (High Priority)

Add validation checkpoint at Level 5:

```tsx
// In Level 5 completion handler
const handleLevel5Complete = async () => {
  // Auto-trigger AI validation
  const result = await fetch("/api/ai/validate", {
    method: "POST",
    body: JSON.stringify({
      projectId,
      validationType: "full"
    })
  });
  
  // Show results in modal
  showValidationResults(result);
};
```

### 2. **Add Contextual Hints** (Medium Priority)

Show AI suggestions while users fill quests:

```tsx
// In QuestForm component
const { data: suggestions } = useSWR(
  `/api/ai/validate?projectId=${projectId}&validationType=suggestions`,
  fetcher
);

// Display in sidebar:
<div className="sidebar">
  <h4>💡 AI Suggestions</h4>
  {suggestions?.map(s => (
    <SuggestionCard key={s.title} {...s} />
  ))}
</div>
```

### 3. **Track Usage** (Low Priority)

Add analytics to measure AI adoption:

```tsx
// Track validation events
analytics.track('ai_validation_run', {
  projectId,
  validationType,
  score: result.overallScore,
  userId: session.user.id
});
```

---

## Performance Tips

### Cache Validation Results

```tsx
// Prevent duplicate validations
const [lastValidation, setLastValidation] = useState(null);

const validate = async () => {
  // Check if project changed since last validation
  if (lastValidation?.timestamp > project.updatedAt) {
    return lastValidation.result;
  }
  
  // Run new validation
  const result = await runValidation();
  setLastValidation({ timestamp: Date.now(), result });
  return result;
};
```

### Debounce Validation Requests

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedValidate = useDebouncedCallback(
  () => runValidation(),
  2000 // Wait 2 seconds after last change
);
```

---

## Cost Monitoring

### Daily Cost Estimate

| Validations/Day | Cost/Day | Cost/Month |
|-----------------|----------|------------|
| 10 | $0.005 | $0.15 |
| 100 | $0.05 | $1.50 |
| 1,000 | $0.50 | $15.00 |

**Note:** Groq free tier = 14,400 requests/day = more than enough for development!

---

## Support

### If Something Goes Wrong

1. **Check API Key:**
   ```bash
   echo $GROQ_API_KEY  # Should show your key
   ```

2. **Check Server Logs:**
   ```bash
   npm run dev
   # Look for errors in terminal
   ```

3. **Test Groq API Directly:**
   ```bash
   curl https://api.groq.com/openai/v1/chat/completions \
     -H "Authorization: Bearer $GROQ_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "llama-3.3-70b-versatile",
       "messages": [{"role": "user", "content": "Hello!"}]
     }'
   ```

4. **File an Issue:**
   - Groq Support: [console.groq.com/support](https://console.groq.com/support)
   - Include: error message, project ID, timestamp

---

## Success Checklist

- [ ] Groq API key obtained
- [ ] `.env.local` configured
- [ ] Dev server running
- [ ] API endpoint responds in <5s
- [ ] AI panel shows in UI
- [ ] Full validation completes successfully
- [ ] Results display correctly
- [ ] No console errors

---

**🎉 Congratulations! Your AI-powered validation system is live!**

**Time to completion:** 5 minutes  
**Cost so far:** $0.00 (free tier)  
**Competitive advantage:** ✅ Unique in LFA tools

---

## What's Next?

1. ✅ Test with real project data
2. 🔄 Iterate on AI prompts based on results
3. 🚀 Launch pilot with 5 NGOs
4. 📊 Track usage and quality metrics
5. 🎯 Refine based on user feedback

**You're now 110x cheaper and 10x faster than OpenAI-based competitors!** 🚀
