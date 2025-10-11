# ⚡ FastQ Quick Start Guide

## 🌐 Your Live URLs

**Frontend**: https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app  
**Backend API**: https://fastq-backend.onrender.com/api

---

## 🚨 CRITICAL: Fix MongoDB Connection NOW

### 1. Go to MongoDB Atlas
https://cloud.mongodb.com/

### 2. Add Network Access
1. **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"**
4. It will show: `0.0.0.0/0`
5. Click **"Confirm"**
6. **⏳ WAIT 3-5 MINUTES**

### 3. Verify Connection String in Render
1. Go to: https://dashboard.render.com/
2. Select your `fastq-backend` service
3. Click **"Environment"** tab
4. Check `MONGODB_URI`:
   ```
   mongodb+srv://fastq_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority
   ```
   - ✅ Has correct password
   - ✅ Has `/fastq` before the `?`

### 4. Redeploy Backend (if needed)
1. In Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment
4. Check logs for: `✅ Connected to MongoDB`

---

## 🧪 Quick Test

### 1. Test Backend
```bash
curl https://fastq-backend.onrender.com/api/test
```

**Should see**: `{"message":"CORS is working!","timestamp":"..."}`

### 2. Test Frontend
1. Open: https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app
2. Should see login page (no errors)
3. Press F12 → Console (should be no CORS errors)

### 3. Test Full Flow
1. **Register**: Create new account
2. **Login**: Use your credentials
3. **Dashboard**: Should load with available queues
4. **Join Queue**: Click to join any queue
5. **Queue Animation**: Should appear at top

---

## 📚 Full Documentation

- **`DEPLOYMENT_SUMMARY.md`**: Complete deployment status & next steps
- **`RENDER_SETUP.md`**: Detailed Render configuration
- **`PRODUCTION_TEST.md`**: Comprehensive testing checklist
- **`DEPLOYMENT_CONFIG.md`**: Environment variables reference

---

## 🆘 Quick Troubleshooting

### "IP not whitelisted" error
→ Add `0.0.0.0/0` to MongoDB Atlas Network Access, wait 3-5 min

### CORS errors in browser
→ Check `FRONTEND_URL` in Render matches Vercel URL exactly

### Backend not connecting
→ Verify `MONGODB_URI` has correct password and `/fastq` database

### 500 errors
→ Check Render logs for details

---

## 🎯 Default Login Credentials

### Admin Account
- **Email**: `admin_seed@fastq.dev`
- **Password**: `admin123`

### Test User
- **Email**: `user_seed@fastq.dev`
- **Password**: `password123`

---

## 🔄 Redeploy Commands

### Frontend (from `/Frontend/fastq`)
```bash
npx vercel --prod --yes
```

### Backend
Pushes to `main` branch auto-deploy, or use Render Dashboard → Manual Deploy

---

## ✅ Success Indicators

- [ ] MongoDB Atlas shows `0.0.0.0/0` in Network Access
- [ ] Render logs show "✅ Connected to MongoDB"
- [ ] Backend test endpoint works
- [ ] Frontend loads without CORS errors
- [ ] Can register and login
- [ ] Can create and join queues

---

**Start Here**: Fix MongoDB Atlas Network Access (`0.0.0.0/0`) → Wait 5 min → Test!

