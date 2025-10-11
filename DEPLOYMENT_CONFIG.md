# 🚀 FastQ Deployment Configuration

## 📍 Current Deployment URLs

### Frontend (Vercel)
- **Production**: `https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app`
- **Framework**: Next.js 15
- **Build Command**: `npm run build`

### Backend (Render)
- **Production**: `https://fastq-backend.onrender.com`
- **Framework**: Express.js + Socket.IO
- **Start Command**: `npm start`

---

## ⚙️ Environment Variables

### Backend (Render Dashboard)

Set these in **Render Dashboard → Your Service → Environment**:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://fastq_admin:<PASSWORD>@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority
JWT_SECRET=<GENERATED_BY_RENDER>
FRONTEND_URL=https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel Dashboard)

Set these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://fastq-backend.onrender.com/api
```

---

## 🔧 MongoDB Atlas Configuration

### Network Access
1. Go to **Security → Network Access**
2. Add IP: `0.0.0.0/0` (Allow from anywhere)
3. Wait 2-3 minutes for changes to propagate

### Database Access
1. Go to **Security → Database Access**
2. User: `fastq_admin`
3. Password: (Your password)
4. Permissions: **Read and write to any database**

---

## 📦 Deployment Steps

### Backend to Render

1. **Push to GitHub**:
   ```bash
   cd Backend
   git add .
   git commit -m "Update CORS configuration"
   git push origin main
   ```

2. **Render will auto-deploy** from GitHub

3. **Check logs** in Render Dashboard for success

### Frontend to Vercel

1. **Deploy using Vercel CLI**:
   ```bash
   cd Frontend/fastq
   npx vercel --prod --yes
   ```

2. **Or push to GitHub** (if connected to Vercel)

---

## ✅ Verification Checklist

After deployment:

- [ ] Backend is running: `https://fastq-backend.onrender.com/api/test`
- [ ] MongoDB is connected (check Render logs)
- [ ] Frontend loads: `https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app`
- [ ] Can register new user
- [ ] Can login
- [ ] Can create queue (admin)
- [ ] Can join queue (user)
- [ ] Real-time updates work
- [ ] Smart features work

---

## 🐛 Troubleshooting

### CORS Errors
- **Check**: `FRONTEND_URL` in Render matches your Vercel URL
- **Check**: Backend CORS configuration allows your Vercel domain
- **Test**: `curl https://fastq-backend.onrender.com/api/test`

### MongoDB Connection Errors
- **Check**: Network Access has `0.0.0.0/0`
- **Check**: `MONGODB_URI` is correct in Render
- **Wait**: 2-3 minutes after changing network access

### Frontend 404 Errors
- **Check**: `NEXT_PUBLIC_API_URL` points to Render backend
- **Rebuild**: Redeploy frontend after changing env vars

---

## 📝 Notes

- **Free Tier Limits**: Render backend may sleep after 15 min of inactivity
- **Cold Starts**: First request after sleep takes 30-60 seconds
- **Logs**: Check Render logs for backend errors
- **Vercel Logs**: Check Vercel deployment logs for frontend errors

---

**Last Updated**: Oct 11, 2025

