# 🔧 Fix Frontend API URL Configuration

## 🚨 Problem

Frontend is calling `http://localhost:5000` instead of `https://fastq-smart-queuing-2.onrender.com`

This causes CORS errors even though the backend is working fine!

---

## ✅ Solution: Set Environment Variable in Vercel

### **Step 1: Go to Vercel Dashboard**

**URL**: https://vercel.com/dashboard

### **Step 2: Find Your Project**

Look for: **fastq** (or your project name)

### **Step 3: Go to Settings**

1. Click on your project
2. Click **"Settings"** tab at the top
3. Click **"Environment Variables"** in the left sidebar

### **Step 4: Add/Update Environment Variable**

1. **Look for existing**: `NEXT_PUBLIC_API_URL`
   - If it exists, click the **"..."** menu → **"Edit"**
   - If it doesn't exist, click **"Add New"**

2. **Set the values**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://fastq-smart-queuing-2.onrender.com/api`
   - **Environment**: Check ALL (Production, Preview, Development)

3. **Click**: "Save"

### **Step 5: Redeploy**

After saving, Vercel will ask if you want to redeploy:
- Click **"Redeploy"** or
- Go to **"Deployments"** tab → Click **"..."** on latest → **"Redeploy"**

---

## 🚀 Alternative: Redeploy via CLI (Faster)

If you have Vercel CLI installed:

```bash
cd C:\Users\aakar\FastQ\Frontend\fastq
npx vercel --prod --yes
```

This will automatically use the `vercel.json` configuration.

---

## 📊 Verify the Fix

### **Step 1: Check Vercel Build Logs**

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"Building"** or **"Build Logs"**
4. Look for:
   ```
   Environment Variables
   NEXT_PUBLIC_API_URL: https://fastq-smart-queuing-2.onrender.com/api ✅
   ```

### **Step 2: Test the Frontend**

1. Open: https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app
2. Press **F12** (DevTools)
3. Go to **"Network"** tab
4. Try to register/login
5. Look at the API calls - they should go to:
   ```
   https://fastq-smart-queuing-2.onrender.com/api/auth/register ✅
   ```
   
   NOT:
   ```
   http://localhost:5000/api/auth/register ❌
   ```

---

## 🐛 If Still Calling localhost

### **Option 1: Hard Refresh Browser**

Sometimes the browser caches the old JavaScript:
- Press **Ctrl + Shift + R** (Windows/Linux)
- Or **Cmd + Shift + R** (Mac)

### **Option 2: Check Browser Console**

1. Open browser console (F12)
2. Type: `console.log(window.location.origin)`
3. Make sure you're on the Vercel URL, not localhost

### **Option 3: Clear Build Cache on Vercel**

1. Vercel Dashboard → Your Project
2. Settings → General
3. Scroll to **"Build & Development Settings"**
4. Look for cache options
5. Redeploy with fresh build

---

## 📋 Current URLs Summary

| Service | URL |
|---------|-----|
| **Backend (Render)** | `https://fastq-smart-queuing-2.onrender.com` |
| **Backend API** | `https://fastq-smart-queuing-2.onrender.com/api` |
| **Frontend (Vercel)** | `https://fastq-7ktxyvp55-aakarsh12xs-projects.vercel.app` |

---

## ✅ After Fix - Expected Behavior

### **Network Tab Should Show**:
```
POST https://fastq-smart-queuing-2.onrender.com/api/auth/register
Status: 200 OK
Response: { "success": true, "token": "...", ... }
```

### **Console Should Show**:
- No CORS errors ✅
- No "Failed to load resource" errors ✅
- Successful registration/login ✅

---

## 🎯 Quick Steps Summary

1. **Go to**: https://vercel.com/dashboard
2. **Click**: Your project (fastq)
3. **Click**: Settings → Environment Variables
4. **Add/Edit**: `NEXT_PUBLIC_API_URL` = `https://fastq-smart-queuing-2.onrender.com/api`
5. **Save** and **Redeploy**
6. **Wait**: 2-3 minutes for deployment
7. **Test**: Open frontend, try to register

---

**OR use CLI**:
```bash
cd Frontend/fastq
npx vercel --prod --yes
```

Then test! 🚀

