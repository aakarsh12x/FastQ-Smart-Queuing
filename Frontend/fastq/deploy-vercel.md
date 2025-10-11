# Deploy Frontend to Vercel - Quick Guide

## Prerequisites
- You need to complete authentication first
- Backend should be deployed to Render first to get the API URL

## Step-by-Step Deployment

### 1. Navigate to Frontend Directory
```bash
cd Frontend/fastq
```

### 2. Login to Vercel (if not already)
```bash
npx vercel login
```
- A browser window will open
- Authenticate with your Vercel account
- Return to terminal

### 3. Deploy to Production
```bash
npx vercel --prod
```

### 4. Answer the Prompts:
```
? Set up and deploy "~\FastQ\Frontend\fastq"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? fastq-frontend
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

### 5. Wait for Deployment
- Build process will start
- Takes 2-5 minutes
- You'll see a production URL when done

### 6. Set Environment Variable
After first deployment, go to Vercel Dashboard:

1. Visit https://vercel.com/dashboard
2. Select `fastq-frontend` project
3. Settings → Environment Variables
4. Add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://YOUR-RENDER-BACKEND.onrender.com/api`
   - **Environment**: Production
5. Save

### 7. Redeploy with Environment Variables
```bash
npx vercel --prod
```

## Your Deployment URLs

After deployment, you'll get:
- **Production**: `https://fastq-frontend.vercel.app` (or custom domain)
- **Preview**: Created on every git push

## Update Backend with Frontend URL

Once you have your Vercel URL:

1. Go to Render Dashboard
2. Select your backend service
3. Environment → Edit `FRONTEND_URL`
4. Set to: `https://YOUR-VERCEL-URL.vercel.app`
5. Save (triggers redeploy)

## Subsequent Deployments

For future updates:
```bash
cd Frontend/fastq
git push origin main  # This auto-deploys if you set up Git integration
# OR
npx vercel --prod     # Manual deployment
```

## Troubleshooting

### "Command not found: vercel"
```bash
npm install -g vercel
# OR use npx
npx vercel --version
```

### Authentication Issues
```bash
npx vercel logout
npx vercel login
```

### Build Errors
- Check `npm run build` works locally
- Verify all dependencies in package.json
- Check Vercel build logs in dashboard

### Environment Variables Not Working
- Variables must start with `NEXT_PUBLIC_`
- Redeploy after adding/changing variables
- Clear browser cache

## Quick Commands Reference

```bash
# Login
npx vercel login

# Deploy to production
npx vercel --prod

# Deploy to preview
npx vercel

# Check deployment status
npx vercel ls

# View logs
npx vercel logs

# Remove project
npx vercel remove fastq-frontend
```

## Alternative: GitHub Integration (Recommended)

Instead of CLI, you can use Vercel's GitHub integration:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Add environment variables
5. Deploy

**Benefits:**
- Auto-deploy on every push to main
- Preview deployments for pull requests
- No manual CLI commands needed

## Next Steps

After deployment:
1. ✅ Test the deployed frontend
2. ✅ Verify API connectivity
3. ✅ Update backend FRONTEND_URL
4. ✅ Test authentication flow
5. ✅ Check all features work in production
6. (Optional) Add custom domain in Vercel settings

