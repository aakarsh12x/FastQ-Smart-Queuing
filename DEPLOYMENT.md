# FastQ Deployment Guide

This guide will help you deploy FastQ to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

## Step 1: Set up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine for testing)
3. Create a database user with read/write permissions
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Copy your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/fastq`)

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/aakarsh12x/FastQ-Smart-Queuing`
4. Configure the service:
   - **Name**: `fastq-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `your-mongodb-atlas-connection-string`
   - `JWT_SECRET` = `your-secure-random-string` (generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - `FRONTEND_URL` = `https://your-vercel-app.vercel.app` (will update after Vercel deployment)
   - `RATE_LIMIT_WINDOW_MS` = `900000`
   - `RATE_LIMIT_MAX_REQUESTS` = `100`

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://fastq-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository: `https://github.com/aakarsh12x/FastQ-Smart-Queuing`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `Frontend/fastq`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://fastq-backend.onrender.com/api` (your Render backend URL + /api)

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your frontend URL (e.g., `https://fastq-smart-queuing.vercel.app`)

## Step 4: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Select your `fastq-backend` service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Save changes (this will trigger a redeploy)

## Step 5: Seed the Database (Optional)

To add sample data to your database:

1. In Render dashboard, go to your backend service
2. Click on "Shell" tab
3. Run: `node scripts/seed.js`

## Step 6: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try to register a new user
3. Log in with:
   - **Admin**: `admin_seed@fastq.dev` / `admin123`
   - **User**: `user_seed@fastq.dev` / `password123`

## Troubleshooting

### Frontend can't connect to backend
- Make sure `NEXT_PUBLIC_API_URL` in Vercel includes `/api` at the end
- Check that CORS is properly configured in backend
- Verify `FRONTEND_URL` in Render matches your Vercel domain

### Backend not starting
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Database connection errors
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas
- Check connection string format
- Verify database user has correct permissions

## Production Considerations

1. **Security**:
   - Use a strong JWT_SECRET
   - Restrict MongoDB Atlas IP whitelist to only Render IPs
   - Enable MongoDB Atlas audit logs

2. **Performance**:
   - Upgrade to paid Render plan for better performance
   - Enable MongoDB Atlas indexes
   - Use Vercel Analytics to monitor frontend performance

3. **Monitoring**:
   - Set up Render alerts for downtime
   - Monitor MongoDB Atlas metrics
   - Use Vercel logs for frontend debugging

## Useful Commands

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Test backend API:
```bash
curl https://your-backend.onrender.com/api/test
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/aakarsh12x/FastQ-Smart-Queuing/issues
- Documentation: See project README.md

