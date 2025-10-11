# 🔧 Fix Render Deployment - Step by Step

## 🚨 Problem Detected

Your Render backend is returning **404 Not Found** for all endpoints. This means the service is not properly configured or not running.

---

## ✅ Solution: Render Dashboard Configuration

### Step 1: Go to Render Dashboard

1. Open: https://dashboard.render.com/
2. Login with your account
3. Find your **fastq-backend** service
4. Click on it to open

---

### Step 2: Check Service Settings

Click **"Settings"** tab and verify:

| Setting | Expected Value | Notes |
|---------|----------------|-------|
| **Name** | `fastq-backend` | Any name is fine |
| **Root Directory** | `Backend` | ⚠️ CRITICAL - Must be `Backend` |
| **Build Command** | `npm install` | |
| **Start Command** | `npm start` | Must run `node server.js` |
| **Branch** | `main` | Your GitHub branch |

**⚠️ If Root Directory is NOT `Backend`, this is your problem!**

---

### Step 3: Environment Variables

Click **"Environment"** tab and verify ALL these exist:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://fastq_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority
JWT_SECRET=(should be auto-generated)
FRONTEND_URL=https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Critical Checks**:
- [ ] `MONGODB_URI` has your actual password (not `<PASSWORD>`)
- [ ] `MONGODB_URI` has `/fastq` before the `?`
- [ ] `FRONTEND_URL` matches your Vercel URL exactly
- [ ] No extra spaces or quotes around values

---

### Step 4: Manual Deploy

1. Still in Render Dashboard
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Click **"Deploy"**
5. Wait for deployment (watch the logs)

---

### Step 5: Watch the Logs

While deploying, watch the logs. You should see:

```
==> Cloning from https://github.com/aakarsh12x/FastQ-Smart-Queuing...
==> Checking out commit ...
==> Using root directory Backend
==> Running 'npm install'
... (packages installing)
==> Build successful 🎉
==> Starting service with 'npm start'
🚀 Server running on port 10000
📊 Environment: production
🌐 Frontend URL: https://...
✅ Connected to MongoDB
```

**Look for these indicators**:
- ✅ "Using root directory Backend"
- ✅ "Build successful"
- ✅ "Server running on port 10000"
- ✅ "Connected to MongoDB"

**Bad signs**:
- ❌ "Service Root Directory is missing"
- ❌ "MongoDB connection error"
- ❌ Any crash or exit

---

## 🐛 Common Issues & Fixes

### Issue 1: "Service Root Directory is missing"

**Cause**: Root Directory not set to `Backend`

**Fix**:
1. Settings tab
2. Find **"Root Directory"**
3. Enter: `Backend`
4. Click **"Save Changes"**
5. Redeploy

---

### Issue 2: "MongoDB connection error"

**Cause**: Network access not configured or wrong connection string

**Fix**:
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Security → Network Access
3. Verify `0.0.0.0/0` exists
4. Wait 5 minutes
5. Check `MONGODB_URI` in Render has:
   - Correct password
   - `/fastq` database name
6. Redeploy

---

### Issue 3: "Cannot find module"

**Cause**: Dependencies not installed or wrong directory

**Fix**:
1. Verify Root Directory is `Backend`
2. Check Build Command is `npm install`
3. Clear build cache: Settings → "Clear Build Cache"
4. Redeploy

---

### Issue 4: "Address already in use"

**Cause**: Multiple processes or wrong port binding

**Fix**:
1. Verify Start Command is `npm start`
2. Check `server.js` has: `server.listen(PORT, '0.0.0.0', ...)`
3. Restart service

---

## 📋 Verification Checklist

After deployment completes:

- [ ] Logs show "✅ Connected to MongoDB"
- [ ] Logs show "Server running on port 10000"
- [ ] No error messages in logs
- [ ] Service status shows "Live" (green)
- [ ] Test endpoint works (see below)

---

## 🧪 Test After Deployment

### Test 1: Health Check

In your terminal:
```bash
node test-production.js
```

Or manually:
```bash
curl https://fastq-backend.onrender.com/api/test
```

**Expected**: 
```json
{"message":"CORS is working!","timestamp":"..."}
```

### Test 2: Try Register

Use Postman or curl:
```bash
curl -X POST https://fastq-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123"}'
```

**Expected**: JSON response with success message

---

## 🔄 Alternative: Redeploy from GitHub

If manual deploy doesn't work:

### Option A: Force Push
```bash
cd Backend
# Make a small change
echo "# Trigger deploy" >> README.md
git add README.md
git commit -m "Trigger Render deployment"
git push origin main
```

### Option B: Reconnect Repository
1. Render Dashboard → Settings
2. Click "Disconnect Repository"
3. Click "Connect Repository"
4. Select your GitHub repo
5. Redeploy

---

## 🆘 Still Not Working?

### Check These:

1. **Render Service Status**
   - Dashboard should show "Live" status (green)
   - Not "Failed" or "Build failed"

2. **GitHub Repository**
   - Latest code is pushed to `main` branch
   - `Backend/` directory exists with `server.js`

3. **MongoDB Atlas**
   - Cluster is running (not paused)
   - Network Access has `0.0.0.0/0`
   - User credentials are correct

4. **Render Account**
   - Service is not suspended
   - Build minutes not exceeded (free tier limit)

---

## 📞 Get Help

If still stuck, check:
- **Render Status**: https://status.render.com/
- **MongoDB Atlas Status**: https://status.cloud.mongodb.com/
- **Render Logs**: Copy full error and search online
- **GitHub Issues**: https://github.com/render-examples/node-express-mongodb

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Render Dashboard shows "Live" (green)
2. ✅ Logs show "✅ Connected to MongoDB"
3. ✅ `curl https://fastq-backend.onrender.com/api/test` returns JSON
4. ✅ Frontend can register/login users
5. ✅ No CORS errors in browser console

---

**Last Updated**: Oct 11, 2025

