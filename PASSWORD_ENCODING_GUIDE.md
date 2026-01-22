# Password URL Encoding Quick Reference

## Your Specific Case

**Original Password:**
```
Shree@225422]
```

**Character-by-Character Breakdown:**

```
S     → S
h     → h
r     → r
e     → e
e     → e
@     → %40    ← SPECIAL: @ must be encoded
2     → 2
2     → 2
5     → 5
4     → 4
2     → 2
2     → 2
]     → %5D    ← SPECIAL: ] must be encoded
```

**Final Encoded Password:**
```
Shree%40225422%5D
```

---

## How to Use in Connection String

### Template:
```
postgresql://postgres:PASSWORD@host:port/database
```

### Your Connection String (with encoded password):
```
postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:5432/postgres
```

---

## Complete .env Setup

```env
# Encoded password version - USE THIS
DATABASE_URL="postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:Shree%40225422%5D@db.bqrhqpsylbxtmxvodarh.supabase.co:5432/postgres"

# For reference (DON'T USE - unencoded, will fail)
# DATABASE_URL="postgresql://postgres:Shree@225422]@db.bqrhqpsylbxtmxvodarh.supabase.co:6543/postgres?pgbouncer=true"
```

---

## Common Special Characters

| Character | Unicode | URL Encoded | Example |
|-----------|---------|-------------|---------|
| Space     | U+0020  | %20         | `my password` → `my%20password` |
| @         | U+0040  | %40         | `user@domain` → `user%40domain` |
| #         | U+0023  | %23         | `pass#123` → `pass%23123` |
| &         | U+0026  | %26         | `a&b` → `a%26b` |
| =         | U+003D  | %3D         | `a=b` → `a%3Db` |
| [         | U+005B  | %5B         | `[test]` → `%5Btest%5D` |
| ]         | U+005D  | %5D         | `test]` → `test%5D` |
| {         | U+007B  | %7B         | `{test}` → `%7Btest%7D` |
| }         | U+007D  | %7D         | `test}` → `test%7D` |
| %         | U+0025  | %25         | `100%` → `100%25` |
| :         | U+003A  | %3A         | `10:30` → `10%3A30` |
| /         | U+002F  | %2F         | `a/b` → `a%2Fb` |
| ?         | U+003F  | %3F         | `search?q=1` → `search%3Fq=1` |

---

## Why Encoding is Needed

**Database URL Format:**
```
protocol://user:password@host:port/database
```

Special characters in the password can break this format:
- `@` is a separator → must encode
- `]` breaks the connection string → must encode
- `/` is a path separator → must encode
- `:` is a port separator → must encode

**Example of what happens without encoding:**

```
❌ postgresql://postgres:Shree@225422]@host:5432/db
                        ↑              ↑
                     This looks like a separator - BROKEN!
                     Database thinks password ends here

✅ postgresql://postgres:Shree%40225422%5D@host:5432/db
                        ↑              ↑
                     @ and ] are part of password - CORRECT!
```

---

## Testing Your Connection

After updating .env:

```powershell
# Test 1: Run Prisma migration
cd w:\hackathon\pathshala-design-studio
npx prisma db push

# You should see:
# ✓ Prisma schema pushed to database
```

If you see `Authentication failed`, re-check the encoding.

---

## Online URL Encoding Tools

If you need to encode a password:
- https://www.urlencoder.org/
- https://www.url-encode-decode.com/

**Steps:**
1. Copy your password
2. Paste in encoder
3. Click encode
4. Copy result
5. Paste in .env

---

## Double-Check Your .env

```env
# ✅ CORRECT (encoded special chars)
DATABASE_URL="postgresql://postgres:Shree%40225422%5D@db.example.com:6543/postgres?pgbouncer=true"

# ❌ WRONG (unencoded - will fail)
DATABASE_URL="postgresql://postgres:Shree@225422]@db.example.com:6543/postgres?pgbouncer=true"
```

---

## If Still Failing

1. **Copy from Supabase directly**
   - Get connection string from Supabase dashboard
   - It might already have encoding

2. **Check password is correct**
   - Verify password hasn't changed
   - Try resetting password in Supabase

3. **Verify host is correct**
   - Should be: `db.XXXXXX.supabase.co`
   - Not: `localhost` or `127.0.0.1`

4. **Check port**
   - Migrations: use **5432** (DIRECT_URL)
   - Queries: use **6543** (DATABASE_URL with pgbouncer=true)

---

## Summary

Your encoded password for use in connection strings:

```
Shree%40225422%5D
```

Use this in both DATABASE_URL and DIRECT_URL in your .env file.

✅ Done! Now run:
```powershell
npx prisma db push
```
