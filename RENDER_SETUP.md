# 🔧 Render Backend Setup Guide

## Step-by-Step Configuration

### 1. MongoDB Atlas Setup (CRITICAL)

#### Network Access
1. Go to https://cloud.mongodb.com/
2. Click **"Security"** → **"Network Access"** in left sidebar
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"**
5. It will auto-fill: `0.0.0.0/0`
6. Add comment: `Render Production`
7. Click **"Confirm"**
8. **WAIT 3-5 MINUTES** for changes to propagate

#### Database User
1. Go to **"Security"** → **"Database Access"**
2. Verify your user exists (e.g., `fastq_admin`)
3. Check **"Built-in Role"**: **"Read and write to any database"**
4. Note the password (you'll need it for connection string)

#### Get Connection String
1. Click **"Database"** → **"Connect"**
2. Select **"Connect your application"**
3. Choose **"Driver: Node.js"**, **"Version: 5.5 or later"**
4. Copy the connection string:
   ```
   mongodb+srv://fastq_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password
6. **Add database name** before the `?`:
   ```
   mongodb+srv://fastq_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority
   ```

---

### 2. Render Service Configuration

#### Environment Variables

Go to **Render Dashboard** → **Your Service** → **Environment** tab

Add these exact variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Fixed value |
| `PORT` | `10000` | Fixed value (Render default) |
| `MONGODB_URI` | `mongodb+srv://fastq_admin:PASSWORD@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority` | **REPLACE WITH YOUR STRING** |
| `JWT_SECRET` | (Auto-generated) | Click "Generate" button |
| `FRONTEND_URL` | `https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app` | Your Vercel URL |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Optional |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Optional |

#### Service Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `Backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Branch** | `main` |
| **Auto-Deploy** | ✅ Yes |

---

### 3. Deployment

1. **Save environment variables** in Render Dashboard
2. **Trigger manual deploy** or push to GitHub
3. **Watch logs** in Render Dashboard

---

### 4. Expected Logs (SUCCESS)

```
🚀 Server running on port 10000
📊 Environment: production
🌐 Frontend URL: https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app
✅ Connected to MongoDB
```

---

### 5. Test Backend

Open in browser or use curl:

```bash
curl https://fastq-backend.onrender.com/api/test
```

Expected response:
```json
{
  "message": "CORS is working!",
  "timestamp": "2025-10-11T..."
}
```

---

## 🚨 Common Errors & Solutions

### Error: "IP not whitelisted"
**Solution**: 
- Go to MongoDB Atlas → Network Access
- Verify `0.0.0.0/0` is listed
- Wait 3-5 minutes
- Redeploy on Render

### Error: "Authentication failed"
**Solution**:
- Check username/password in `MONGODB_URI`
- Verify Database User has correct permissions
- Ensure `/fastq` database name is in connection string

### Error: "Service Root Directory is missing"
**Solution**:
- In Render Dashboard → Settings
- Set **Root Directory** to `Backend`
- Save and redeploy

### Error: "CORS blocked"
**Solution**:
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check backend `server.js` CORS configuration
- Redeploy backend

---

## 📋 Verification Checklist

After deployment:

- [ ] MongoDB Atlas has `0.0.0.0/0` in Network Access
- [ ] Waited 3-5 minutes after MongoDB config change
- [ ] All environment variables are set in Render
- [ ] `MONGODB_URI` has correct password and `/fastq` database
- [ ] `FRONTEND_URL` matches Vercel deployment URL
- [ ] Render logs show "✅ Connected to MongoDB"
- [ ] Backend test endpoint works: `https://fastq-backend.onrender.com/api/test`
- [ ] No errors in Render logs

---

## 🔄 Redeploying

### From Render Dashboard
1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Watch logs

### From GitHub
1. Push changes to `main` branch
2. Render will auto-deploy
3. Check logs in Render Dashboard

---

**Last Updated**: Oct 11, 2025

