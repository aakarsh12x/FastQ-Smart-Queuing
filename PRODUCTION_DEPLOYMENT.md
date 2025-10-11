# Production Deployment Instructions

## 🚀 Quick Deploy Guide

### Prerequisites
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (for database)

---

## Step 1: Deploy Frontend to Vercel (Using CLI)

### A. Login to Vercel
```bash
cd Frontend/fastq
npx vercel login
```
Follow the browser authentication.

### B. Deploy to Production
```bash
# Deploy to production
npx vercel --prod

# When prompted:
# Project name: fastq-frontend (or your choice)
# Which scope: Your account
# Link to existing project: No
# Directory: ./ (current directory)
# Override settings: No
```

### C. Set Environment Variables in Vercel Dashboard
After deployment:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_API_URL` = `https://fastq-backend.onrender.com/api` (update after backend deploy)

### D. Redeploy
```bash
npx vercel --prod
```

**Copy your Vercel URL** (e.g., `https://fastq-frontend.vercel.app`)

---

## Step 2: Set up MongoDB Atlas

### A. Create Cluster
1. Go to https://cloud.mongodb.com/
2. Create account/login
3. Build a Database → Free tier (M0)
4. Choose cloud provider & region (closest to Render's region)
5. Cluster name: `FastQ` (or any name)

### B. Create Database User
1. Security → Database Access
2. Add New Database User
3. Authentication: Password
4. Username: `fastq_admin`
5. Password: Generate secure password (save it!)
6. Database User Privileges: Read and write to any database
7. Add User

### C. Configure Network Access
1. Security → Network Access
2. Add IP Address
3. Allow Access from Anywhere: `0.0.0.0/0`
4. Confirm

### D. Get Connection String
1. Database → Connect
2. Connect your application
3. Copy connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with `fastq`

Example: `mongodb+srv://fastq_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority`

---

## Step 3: Deploy Backend to Render

### A. Create Web Service
1. Go to https://dashboard.render.com/
2. New + → Web Service
3. Connect your GitHub repository: `aakarsh12x/FastQ-Smart-Queuing`
4. Configure:

**Settings:**
- Name: `fastq-backend`
- Region: Oregon (US West) or closest to you
- Branch: `main`
- Root Directory: `Backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: Free

### B. Add Environment Variables

Click "Advanced" → Add Environment Variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://fastq_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fastq?retryWrites=true&w=majority
JWT_SECRET=GENERATE_THIS_BELOW
FRONTEND_URL=https://your-vercel-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste as `JWT_SECRET` value.

### C. Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. **Copy your Render URL** (e.g., `https://fastq-backend.onrender.com`)

---

## Step 4: Update Cross-References

### A. Update Backend FRONTEND_URL
1. Go to Render Dashboard
2. Select `fastq-backend`
3. Environment tab
4. Edit `FRONTEND_URL`
5. Set to your Vercel URL: `https://your-vercel-app.vercel.app`
6. Save Changes (auto-redeploys)

### B. Update Frontend API URL
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Edit `NEXT_PUBLIC_API_URL`
5. Set to: `https://fastq-backend.onrender.com/api`
6. Save
7. Go to Deployments tab
8. Click "..." on latest deployment → Redeploy

---

## Step 5: Seed Database (Optional)

### Using Render Shell:
1. Render Dashboard → Your backend service
2. Shell tab (top right)
3. Run:
```bash
node scripts/seed.js
```

This creates:
- Admin: `admin_seed@fastq.dev` / `admin123`
- User: `user_seed@fastq.dev` / `password123`
- Sample queues

---

## Step 6: Test Your Deployment

### A. Test Backend
```bash
curl https://fastq-backend.onrender.com/api/test
```
Should return: `{"message":"CORS is working!","timestamp":"..."}`

### B. Test Frontend
1. Visit your Vercel URL
2. Try to register a new account
3. Login with seeded credentials
4. Admin: Create a queue
5. User: Join a queue
6. Check Smart Insights

---

## 🔧 Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in Render matches Vercel URL exactly (no trailing slash)
- Check Render logs for CORS configuration errors
- Ensure backend is running (check Render dashboard)

### API Connection Failed
- Verify `NEXT_PUBLIC_API_URL` in Vercel ends with `/api`
- Check if backend is awake (Render free tier sleeps after 15min inactivity)
- Test backend directly: `curl https://your-backend.onrender.com/api/test`

### MongoDB Connection Failed
- Verify connection string format
- Check IP whitelist includes `0.0.0.0/0`
- Verify database user credentials
- Check Render logs for detailed error

### Render Cold Starts
- Free tier sleeps after 15 minutes of inactivity
- First request takes ~30 seconds to wake up
- Consider upgrading to paid tier for 24/7 availability

### Deployment Failed
- Check Render logs for build errors
- Verify all environment variables are set
- Ensure Node version compatibility (Render uses latest LTS)

---

## 📊 Monitoring

### Backend (Render)
- Dashboard → Logs (real-time)
- Dashboard → Metrics (CPU, Memory)
- Set up email alerts for downtime

### Frontend (Vercel)
- Dashboard → Analytics
- Dashboard → Logs
- Real-time build logs during deployment

### Database (MongoDB Atlas)
- Charts → Performance
- Alerts → Set up custom alerts
- Real-time performance metrics

---

## 🎯 Production URLs

Once deployed, update these:

- **Frontend**: `https://__________.vercel.app`
- **Backend**: `https://__________.onrender.com`
- **Database**: MongoDB Atlas cluster

---

## 🔐 Security Checklist

- [ ] Changed default seeded user passwords
- [ ] JWT_SECRET is randomly generated (64+ characters)
- [ ] MongoDB connection string not exposed in code
- [ ] CORS configured with specific frontend URL
- [ ] Rate limiting enabled
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set in hosting platforms (not in code)

---

## 🚀 Next Steps After Deployment

1. **Custom Domain**: 
   - Vercel: Project Settings → Domains
   - Render: Settings → Custom Domain

2. **SSL/HTTPS**: 
   - Automatic on both Vercel and Render

3. **Monitoring**:
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Configure error tracking (Sentry)

4. **Backups**:
   - MongoDB Atlas: Automatic backups on paid tiers
   - Consider manual exports periodically

5. **Performance**:
   - Enable Vercel Analytics
   - Monitor Render metrics
   - Optimize MongoDB indexes

---

## 💰 Cost Breakdown (Free Tier)

- **Vercel**: Free forever (hobby tier)
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic SSL

- **Render**: Free (with limitations)
  - Sleeps after 15 min inactivity
  - 750 hours/month
  - Upgrade to $7/month for 24/7

- **MongoDB Atlas**: Free (M0 cluster)
  - 512 MB storage
  - Shared RAM
  - Upgrade for more storage/performance

**Total**: $0/month (free tier) or ~$7/month (hobby tier with 24/7 backend)

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **GitHub Issues**: https://github.com/aakarsh12x/FastQ-Smart-Queuing/issues

