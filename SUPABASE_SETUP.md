# Supabase Database Setup Guide

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `pathshala-design-studio`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to you
5. Click "Create new project" and wait ~2 minutes

## Step 2: Get Database Connection Strings

1. Once your project is created, go to **Project Settings** (gear icon)
2. Navigate to **Database** section
3. Scroll to **Connection string** section
4. Copy both connection strings:

   ### Transaction Mode (Pooler) - For application queries
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   ### Session Mode (Direct) - For migrations
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xxx.pooler.supabase.com:5432/postgres
   ```

## Step 3: Update Your .env File

Edit `w:\hackathon\pathshala-design-studio\.env`:

```env
# Supabase PostgreSQL Database
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"
```

**Important**: Replace `YOUR_PASSWORD`, `YOUR_PROJECT_REF`, and `YOUR_REGION` with actual values from Step 2.

## Step 4: Push Database Schema

Run these commands in your terminal:

```powershell
cd w:\hackathon\pathshala-design-studio

# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

## Step 5: Verify Database Setup

Check in Supabase dashboard:
1. Go to **Table Editor**
2. You should see all tables: `users`, `organizations`, `lfa_projects`, etc.

## Step 6: Start Development Server

```powershell
npm run dev
```

Now try registering at http://localhost:3000/auth/register

---

## Troubleshooting

### Connection Error
- Verify password is correct in connection strings
- Check if Supabase project is active (not paused)
- Ensure you're using the correct region endpoint

### Schema Push Failed
- Use `DIRECT_URL` for migrations (port 5432, no pgbouncer)
- Check database password doesn't contain special characters that need URL encoding

### Still Getting 500 Error?
- Check dev server logs in terminal
- Verify `.env` file is in the correct location
- Restart dev server after changing `.env`

---

## Free Tier Limits

Supabase free tier includes:
- ✅ 500 MB database storage
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ Auto-pause after 1 week inactivity (can reactivate instantly)

Perfect for development and small production apps!
