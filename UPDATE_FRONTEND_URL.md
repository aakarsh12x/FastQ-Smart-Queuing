# 🔧 Update Frontend URL in Render

## 🚨 Important: Update Render Environment Variable

Your frontend has been redeployed to a new URL. You need to update the `FRONTEND_URL` in Render.

### **New Frontend URL**: 
```
https://fastq-bvbkm6y6b-aakarsh12xs-projects.vercel.app
```

---

## ✅ Update Render Configuration

### **Step 1: Go to Render Dashboard**
**URL**: https://dashboard.render.com/

### **Step 2: Find Your Service**
Look for: **fastq-smart-queuing-2**

### **Step 3: Update Environment Variable**
1. Click **"Environment"** tab
2. Find **`FRONTEND_URL`**
3. **Edit** the value to:
   ```
   https://fastq-bvbkm6y6b-aakarsh12xs-projects.vercel.app
   ```
4. **Save Changes**

### **Step 4: Wait for Redeploy**
Render will automatically redeploy with the new configuration.

---

## 🧪 Test After Update

Once Render redeploys (2-3 minutes):

### **Method 1: Browser Test**
1. Open: https://fastq-bvbkm6y6b-aakarsh12xs-projects.vercel.app
2. Click "Sign Up"
3. Enter:
   - **Name**: `Test User`
   - **Email**: `test@example.com` (use unique email)
   - **Password**: `password123`
4. Click "Create Account"
5. **Expected**: Success! Redirected to dashboard

### **Method 2: Console Debug**
1. Open browser console (F12)
2. Try registration
3. Look for these logs:
   ```
   Registration attempt: {name: "Test User", email: "test@example.com", ...}
   Registration response: {status: 201, data: {...}}
   ```

---

## 🔍 What Was Fixed

### **Frontend Validation Added**:
- ✅ Required field validation
- ✅ Name length validation (2-50 characters)
- ✅ Password length validation (min 6 characters)
- ✅ Email format validation
- ✅ Console logging for debugging
- ✅ Better error messages

### **Backend Already Working**:
- ✅ Registration endpoint tested and working
- ✅ Validation working correctly
- ✅ CORS configured properly
- ✅ MongoDB connected

---

## 📊 Expected Results

### **Before Fix**:
- 400 Bad Request errors
- No clear error messages
- Validation issues

### **After Fix**:
- ✅ Clear validation messages
- ✅ Successful registration
- ✅ Console logs for debugging
- ✅ Proper error handling

---

## 🎯 Quick Test Commands

### **Test Backend Directly**:
```bash
cd C:\Users\aakar\FastQ
node debug-frontend-backend.js
```

### **Test Full System**:
```bash
cd C:\Users\aakar\FastQ
node test-production.js
```

---

## 📋 Checklist

- [ ] ✅ Frontend redeployed with validation fixes
- [ ] ⚠️ **YOU: Update `FRONTEND_URL` in Render**
- [ ] ⏳ Wait for Render redeploy (2-3 minutes)
- [ ] ✅ Test registration in browser
- [ ] ✅ Check console logs for debugging info

---

**Next Step**: Update `FRONTEND_URL` in Render Dashboard, then test the registration! 🚀
