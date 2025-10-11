# 🚨 URGENT: Render Deployment Issues - FIXED

## 📍 New Backend URL Detected!

Your backend is now at: **`https://fastq-smart-queuing-2.onrender.com`**

---

## 🐛 Two Critical Issues Found

### Issue 1: Environment Variables Not Set ❌
**Log shows**: `Environment: development` (should be `production`)  
**Log shows**: `Frontend URL: http://localhost:3000` (should be Vercel URL)

### Issue 2: MongoDB Connection Still Failing ❌
**Error**: "IP not whitelisted"

---

## ✅ SOLUTION: Set Environment Variables in Render Dashboard

### Step 1: Go to Render Dashboard
**URL**: https://dashboard.render.com/

### Step 2: Find Your Service
Name: **fastq-smart-queuing-2** (or similar)

### Step 3: Go to "Environment" Tab
Click **"Environment"** in the left sidebar

### Step 4: ADD/UPDATE These Variables

Click **"Add Environment Variable"** for each one:

```
NODE_ENV = production
```

```
MONGODB_URI = mongodb+srv://fastq_admin:YOUR_ACTUAL_PASSWORD@cluster0.mrsijen.mongodb.net/fastq?retryWrites=true&w=majority
```

```
JWT_SECRET = (click "Generate" button to auto-create)
```

```
FRONTEND_URL = https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app
```

```
RATE_LIMIT_WINDOW_MS = 900000
```

```
RATE_LIMIT_MAX_REQUESTS = 100
```

### Step 5: VERIFY MongoDB Connection String

**CRITICAL**: Your `MONGODB_URI` must have:
1. ✅ Your **actual password** (not `<PASSWORD>` or `YOUR_ACTUAL_PASSWORD`)
2. ✅ `/fastq` before the `?`
3. ✅ No spaces or line breaks

**Format**:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.mrsijen.mongodb.net/fastq?retryWrites=true&w=majority
```

**Example** (with fake password):
```
mongodb+srv://fastq_admin:MySecretPass123@cluster0.mrsijen.mongodb.net/fastq?retryWrites=true&w=majority
```

### Step 6: Save and Redeploy

1. Click **"Save Changes"** at the bottom
2. Render will automatically redeploy
3. Watch the logs

---

## 🔍 MongoDB Atlas: Double-Check Network Access

Even though you said you configured it, let's verify:

### Step 1: Go to MongoDB Atlas
**URL**: https://cloud.mongodb.com/

### Step 2: Check Network Access
1. Click **"Security"** → **"Network Access"** in left sidebar
2. You should see an entry: **`0.0.0.0/0`** with status **"Active"**

### Step 3: If Not There, Add It
1. Click **"Add IP Address"**
2. Select **"Allow Access from Anywhere"**
3. It will auto-fill: `0.0.0.0/0`
4. Click **"Confirm"**
5. **WAIT 5 MINUTES** (this is critical!)

### Step 4: Check Database User
1. Click **"Security"** → **"Database Access"**
2. Verify user **`fastq_admin`** exists
3. Check it has **"Read and write to any database"** permissions
4. Note the password (you'll need it for connection string)

---

## 📊 Expected Logs After Fix

After you set the environment variables and redeploy, logs should show:

```
==> Running 'npm start'
🚀 Server running on port 10000
📊 Environment: production ✅
🌐 Frontend URL: https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app ✅
✅ Connected to MongoDB ✅
```

**If you see this, you're DONE!** ✅

---

## 🔧 Update Frontend Configuration

Since your backend URL changed, update the frontend:

### Step 1: Update Vercel Environment Variable

In **Vercel Dashboard**:
1. Go to your project settings
2. Click **"Environment Variables"**
3. Find or add: `NEXT_PUBLIC_API_URL`
4. Set value to: `https://fastq-smart-queuing-2.onrender.com/api`
5. Save

### Step 2: Update Local Files

Update these files locally:

**`Frontend/fastq/vercel.json`**:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://fastq-smart-queuing-2.onrender.com/api"
  }
}
```

**`Frontend/fastq/next.config.ts`**:
```typescript
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fastq-smart-queuing-2.onrender.com/api',
}
```

### Step 3: Commit and Redeploy

```bash
cd C:\Users\aakar\FastQ
git add Frontend/fastq/vercel.json Frontend/fastq/next.config.ts
git commit -m "Update backend URL"
git push origin main
```

### Step 4: Redeploy Frontend

```bash
cd Frontend/fastq
npx vercel --prod --yes
```

---

## 🧪 Test After All Fixes

Run this after BOTH backend and frontend are updated:

```bash
cd C:\Users\aakar\FastQ
node test-production.js
```

Or manually test backend:

```bash
curl https://fastq-smart-queuing-2.onrender.com/api/test
```

**Expected**: `{"message":"CORS is working!","timestamp":"..."}`

---

## 📋 Checklist

### Render Backend
- [ ] Go to Render Dashboard
- [ ] Find service (fastq-smart-queuing-2)
- [ ] Go to "Environment" tab
- [ ] Add `NODE_ENV=production`
- [ ] Add `MONGODB_URI` with correct password and `/fastq`
- [ ] Add `JWT_SECRET` (generate)
- [ ] Add `FRONTEND_URL` (Vercel URL)
- [ ] Add rate limit vars
- [ ] Save changes
- [ ] Wait for redeploy
- [ ] Check logs for "✅ Connected to MongoDB"

### MongoDB Atlas
- [ ] Go to cloud.mongodb.com
- [ ] Security → Network Access
- [ ] Verify `0.0.0.0/0` is Active
- [ ] If not, add it and wait 5 minutes
- [ ] Security → Database Access
- [ ] Verify user exists with correct permissions

### Frontend Update
- [ ] Update `vercel.json` with new backend URL
- [ ] Update `next.config.ts` with new backend URL
- [ ] Commit and push changes
- [ ] Redeploy to Vercel
- [ ] Update Vercel environment variable

### Test
- [ ] Backend health check works
- [ ] Can register user
- [ ] Can login
- [ ] Can see queues
- [ ] No CORS errors

---

## 🆘 Still Getting MongoDB Error?

If you still see "IP not whitelisted" after adding `0.0.0.0/0`:

### Option 1: Wait Longer
- Changes can take up to 10 minutes to propagate
- Wait 10 minutes, then redeploy on Render

### Option 2: Check Connection String Format
```
✅ CORRECT:
mongodb+srv://user:pass@cluster.net/fastq?retryWrites=true&w=majority

❌ WRONG (missing /fastq):
mongodb+srv://user:pass@cluster.net/?retryWrites=true&w=majority

❌ WRONG (special chars in password not encoded):
mongodb+srv://user:p@ss!word@cluster.net/fastq?retryWrites=true
```

### Option 3: Get Render's IP Addresses
Instead of `0.0.0.0/0`, you can whitelist Render's specific IPs:
- Get Render IPs from: https://render.com/docs/networking
- Add each IP to MongoDB Atlas Network Access

---

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ Backend logs show: `Environment: production`
2. ✅ Backend logs show: `✅ Connected to MongoDB`
3. ✅ Frontend URL in logs matches Vercel
4. ✅ `curl https://fastq-smart-queuing-2.onrender.com/api/test` returns JSON
5. ✅ Frontend can register/login users
6. ✅ No CORS or 404 errors

---

**Priority**: Fix environment variables in Render FIRST, then test!

