# FastQ Deployment Checklist

## ✅ Completed
- [x] Code pushed to GitHub: https://github.com/aakarsh12x/FastQ-Smart-Queuing
- [x] CORS configuration added to backend
- [x] Deployment configurations created
- [x] Deployment guide created

## 📋 Next Steps (Do These Now)

### 1. Set up MongoDB Atlas (5 minutes)
- [ ] Go to https://www.mongodb.com/cloud/atlas/register
- [ ] Create free cluster
- [ ] Create database user
- [ ] Whitelist all IPs: `0.0.0.0/0`
- [ ] Copy connection string

### 2. Deploy Backend to Render (10 minutes)
- [ ] Go to https://dashboard.render.com/
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `aakarsh12x/FastQ-Smart-Queuing`
- [ ] Set Root Directory: `Backend`
- [ ] Add all environment variables (see DEPLOYMENT.md)
- [ ] Deploy and copy backend URL

### 3. Deploy Frontend to Vercel (5 minutes)
- [ ] Go to https://vercel.com/new
- [ ] Import: `aakarsh12x/FastQ-Smart-Queuing`
- [ ] Set Root Directory: `Frontend/fastq`
- [ ] Add environment variable: `NEXT_PUBLIC_API_URL` = `[backend-url]/api`
- [ ] Deploy and copy frontend URL

### 4. Update Backend with Frontend URL (2 minutes)
- [ ] Go back to Render
- [ ] Update `FRONTEND_URL` environment variable with Vercel URL
- [ ] Save (triggers redeploy)

### 5. Seed Database (Optional, 2 minutes)
- [ ] In Render, go to Shell tab
- [ ] Run: `node scripts/seed.js`

### 6. Test Deployment (5 minutes)
- [ ] Visit frontend URL
- [ ] Try registration
- [ ] Login with seeded admin: `admin_seed@fastq.dev` / `admin123`
- [ ] Create a queue
- [ ] Login with user: `user_seed@fastq.dev` / `password123`
- [ ] Join a queue
- [ ] Check Smart Insights

## 🔑 Important URLs

- **GitHub Repo**: https://github.com/aakarsh12x/FastQ-Smart-Queuing
- **Deployment Guide**: See DEPLOYMENT.md file
- **Backend (Render)**: _[Will be: https://fastq-backend.onrender.com]_
- **Frontend (Vercel)**: _[Will be: https://fastq-smart-queuing.vercel.app]_

## 🛠️ Environment Variables Reference

### Backend (Render):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fastq
JWT_SECRET=[generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"]
FRONTEND_URL=https://your-vercel-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://fastq-backend.onrender.com/api
```

## ⚠️ Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` in backend matches your Vercel domain exactly
2. **API Not Working**: Ensure `NEXT_PUBLIC_API_URL` ends with `/api`
3. **Database Connection**: Whitelist `0.0.0.0/0` in MongoDB Atlas
4. **Render Cold Start**: Free tier takes ~30 seconds to wake up

## 📞 Need Help?

Follow the detailed step-by-step guide in `DEPLOYMENT.md`

