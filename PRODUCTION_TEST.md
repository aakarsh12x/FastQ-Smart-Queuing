# 🧪 Production Testing Guide

## Current Deployment URLs

- **Frontend**: https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app
- **Backend**: https://fastq-backend.onrender.com
- **MongoDB**: MongoDB Atlas Cluster

---

## 🔍 Pre-Flight Checks

### 1. Backend Health Check

```bash
curl https://fastq-backend.onrender.com/api/test
```

**Expected Response**:
```json
{
  "message": "CORS is working!",
  "timestamp": "2025-10-11T..."
}
```

### 2. Frontend Load Check

Open browser:
```
https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app
```

**Expected**: Login/Register page loads without errors

### 3. Check Browser Console

Open DevTools (F12) → Console tab

**Expected**: No CORS errors, no 500 errors

---

## 📝 Full System Test

### Test 1: User Registration ✅

1. Open frontend URL
2. Click **"Sign Up"**
3. Fill in:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: password123
4. Click **"Create Account"**

**Expected**: 
- Success message
- Redirected to user dashboard
- No errors in console

---

### Test 2: User Login ✅

1. Open frontend URL (new incognito window)
2. Fill in:
   - **Email**: test@example.com
   - **Password**: password123
3. Click **"Sign In"**

**Expected**:
- Success message
- Redirected to user dashboard
- Token saved in localStorage

---

### Test 3: Admin Login ✅

1. Open frontend URL (new incognito window)
2. Fill in:
   - **Email**: admin_seed@fastq.dev
   - **Password**: admin123
3. Click **"Sign In"**

**Expected**:
- Success message
- Redirected to admin dashboard
- Can see dashboard stats

---

### Test 4: Create Queue (Admin) ✅

1. Login as admin
2. Go to **"Queues"** from sidebar
3. Click **"Create Queue"** button
4. Fill in:
   - **Name**: Test Queue
   - **Description**: Testing production
   - **Location**: Test Building
   - **Category**: Select from dropdown (food/medical/admin/education/other)
5. Click **"Create Queue"**

**Expected**:
- Success message
- Redirected to queues list
- New queue appears in list

---

### Test 5: View Queues (User) ✅

1. Login as regular user (test@example.com)
2. Go to **"Dashboard"**
3. Scroll to **"Available Queues"** section

**Expected**:
- List of active queues
- Can see "Test Queue" created by admin
- Shows current users, wait time, location

---

### Test 6: Join Queue (User) ✅

1. Still logged in as user
2. Find "Test Queue" in available queues
3. Click **"Join Queue"** button

**Expected**:
- Success message
- Queue animation appears at top
- Shows user position (likely position 1)
- Shows people ahead (0)

---

### Test 7: Queue Animation ✅

1. Still in user dashboard
2. Check queue animation at top

**Expected**:
- Horizontal queue display
- Shows user's position
- Shows total people in queue
- Shows estimated wait time
- Interactive hover effects

---

### Test 8: Leave Queue (User) ✅

1. Find the queue you joined
2. Click **"Leave Queue"** button

**Expected**:
- Success message
- Queue animation disappears
- Queue reappears in "Available Queues"

---

### Test 9: Smart Recommendations ✅

1. Login as user
2. Go to **"Dashboard"**
3. Scroll to **"Smart Recommendations"** section

**Expected**:
- Shows recommended queues
- Displays score (0-100)
- Shows estimated wait time
- Shows recommendation message
- Can click to view more in Smart Insights

---

### Test 10: Smart Insights Page ✅

1. Click **"Smart Insights"** in sidebar (Brain icon)

**Expected**:
- Page loads with blue-black theme
- Shows "Top Recommendations" section
- Shows "Wait Time Prediction" section
- Shows "Peak Hours" section
- Shows "Quick Tips" section
- All data loads correctly

---

### Test 11: User Settings ✅

1. Go to **"Settings"** from sidebar
2. Check profile information

**Expected**:
- Shows logged-in user's name/email
- Email field is read-only
- Can edit name, phone
- Can toggle notification preferences
- "Save Changes" button is centered
- Can save successfully

---

### Test 12: Queue Management (Admin) ✅

1. Login as admin
2. Go to **"Queues"**
3. Find "Test Queue"
4. Try:
   - Pause queue
   - Resume queue
   - Delete queue

**Expected**:
- Status changes work
- Real-time updates
- Can delete successfully

---

### Test 13: Analytics (User) ✅

1. Login as user
2. Go to **"Analytics"** from sidebar

**Expected**:
- Shows queue history
- Shows time saved stats
- Shows graphs/charts
- Data loads correctly

---

### Test 14: Real-Time Updates ✅

1. Open frontend in **two browser windows**
2. Window 1: Login as admin
3. Window 2: Login as user
4. Admin: Create new queue
5. User: Check if queue appears without refresh

**Expected**:
- New queue appears in user's list automatically
- Socket.IO connection working

---

### Test 15: Mobile Responsiveness ✅

1. Open frontend on mobile device or use DevTools responsive mode
2. Test all pages

**Expected**:
- All pages are responsive
- Navigation works
- Queue animation works
- No horizontal scroll

---

## 🐛 Debugging Issues

### Issue: CORS Errors

**Check**:
1. Render logs: `https://dashboard.render.com/`
2. Verify `FRONTEND_URL` matches Vercel URL exactly
3. Check browser console for exact error

**Fix**:
```bash
# In Render Dashboard → Environment
FRONTEND_URL=https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app
```

---

### Issue: MongoDB Connection Errors

**Check**:
1. Render logs show "Connected to MongoDB"?
2. MongoDB Atlas Network Access has `0.0.0.0/0`?
3. Connection string has correct password?

**Fix**:
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0`
3. Wait 3-5 minutes
4. Redeploy on Render

---

### Issue: 500 Internal Server Errors

**Check**:
1. Render logs for error details
2. Check if backend is running

**Fix**:
1. Check Render logs
2. Verify environment variables
3. Redeploy if needed

---

### Issue: Frontend Not Loading

**Check**:
1. Vercel deployment logs
2. Browser console errors
3. Network tab in DevTools

**Fix**:
1. Check Vercel deployment status
2. Verify build succeeded
3. Check `NEXT_PUBLIC_API_URL` in `vercel.json`

---

## 📊 Test Results Template

```
Date: _____________
Tester: ___________

✅ Backend health check
✅ Frontend loads
✅ User registration
✅ User login
✅ Admin login
✅ Create queue
✅ View queues
✅ Join queue
✅ Queue animation
✅ Leave queue
✅ Smart recommendations
✅ Smart insights page
✅ User settings
✅ Queue management
✅ Analytics
✅ Real-time updates
✅ Mobile responsive

Notes:
___________________
___________________
```

---

**Last Updated**: Oct 11, 2025

