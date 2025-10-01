# FastQ Deployment & Setup Guide

## 📋 Quick Start Checklist

### Prerequisites
- ✅ Node.js v18+ installed
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Git installed
- ✅ npm or yarn

---

## 🚀 Local Development Setup

### Step 1: Clone & Install

```powershell
# Clone the repository
git clone https://github.com/aakarsh12x/FastQ-Smart-Queuing.git
cd FastQ-Smart-Queuing
```

### Step 2: Backend Setup

```powershell
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file
# Copy the following into Backend/.env:
```

**Backend/.env Template:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Replace `MONGODB_URI` with your actual MongoDB Atlas connection string.

```powershell
# Seed the database with example data
npm run seed

# Start the backend server
npm start
# OR for development with auto-reload:
npm run dev
```

Backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup

```powershell
# Open a new terminal/PowerShell window
cd Frontend/fastq

# Install dependencies
npm install

# Create .env.local file
# Add the following:
```

**Frontend/fastq/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```powershell
# Start the frontend development server
npm run dev
```

Frontend should now be running on `http://localhost:3000`

---

## 🔑 Default Login Credentials

After running the seed script, use these credentials:

**Admin Account:**
- Email: `admin_seed@fastq.dev`
- Password: `admin123`

**User Account:**
- Email: `user_seed@fastq.dev`
- Password: `password123`

---

## 🐛 Troubleshooting Common Issues

### Issue: 500 Error When Joining Queue
**Solution:** 
1. Ensure backend is running (`npm start` in Backend folder)
2. Check MongoDB connection in `.env`
3. Run seed script: `npm run seed`
4. Clear browser localStorage and re-login

### Issue: "Cannot GET /api/queues" or 401 Unauthorized
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` in `Frontend/fastq/.env.local`
2. Check that you're logged in (token exists in localStorage)
3. Restart both frontend and backend servers

### Issue: Frontend Shows Mock Data
**Solution:**
The user dashboard (`/user-dashboard/page.tsx`) currently uses mock data. Replace with API fetches:

```typescript
// In useEffect, fetch from backend:
useEffect(() => {
  const fetchQueues = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/queues`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const mapped = data.data.map((q: any) => ({
      id: q._id,
      name: q.name,
      description: q.description || '',
      category: q.category,
      currentUsers: q.currentUsers?.length || 0,
      estimatedWaitTime: `${q.settings?.estimatedWaitTime || 5} min`,
      status: q.status,
      location: q.location,
      rating: 4.5 // Placeholder
    }));
    setQueues(mapped);
  };
  fetchQueues();
}, []);
```

### Issue: MongoDB Connection Timeout
**Solution:**
1. Check if your IP is whitelisted in MongoDB Atlas
2. Verify the connection string format
3. Ensure URL-encoded password (spaces = `%20`, special chars escaped)

### Issue: Port Already in Use
**Solution:**
```powershell
# Find process using port 5000 (backend)
netstat -ano | findstr :5000
# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# For port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📦 Production Deployment

### Backend (Railway/Render/Heroku)

1. **Create New Web Service**
2. **Connect GitHub Repository**
3. **Set Root Directory:** `Backend`
4. **Set Environment Variables:**
   - `NODE_ENV=production`
   - `MONGODB_URI=<your_atlas_connection_string>`
   - `JWT_SECRET=<strong_secret_key>`
   - `FRONTEND_URL=<your_frontend_url>`
   - `PORT=5000` (or platform default)

5. **Build Command:** `npm install`
6. **Start Command:** `npm start`

### Frontend (Vercel/Netlify)

1. **Import Project from GitHub**
2. **Framework:** Next.js
3. **Root Directory:** `Frontend/fastq`
4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL=<your_backend_url>/api`

6. **Deploy!**

---

## 🧪 Testing

### Backend API Tests
```powershell
cd Backend
node test-backend.js
```

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login as user
- [ ] Login as admin
- [ ] View queues list
- [ ] Join a queue
- [ ] Check position updates
- [ ] Leave a queue
- [ ] Admin: Create new queue
- [ ] Admin: View queue details
- [ ] Admin: Serve next user (TODO: implement)

---

## 📝 Known Issues & TODOs

1. **User Dashboard Mock Data:** Still using hardcoded queues - needs API integration
2. **Real-time Updates:** Socket.IO configured but not fully implemented
3. **Serve Next User:** Admin endpoint exists but frontend UI needed
4. **User Stats:** Currently mock data - needs backend endpoint
5. **Queue Analytics:** Placeholder graphs - needs real data integration

---

## 🔧 Environment Variables Reference

### Backend Required
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key_min_32_chars` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `PORT` | Server port | `5000` |

### Frontend Required
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:5000/api` |

---

## 💡 Tips

1. **Always run seed script first** after connecting to a new database
2. **Use environment-specific .env files** (`.env.local` for dev, `.env.production` for prod)
3. **Never commit .env files** - they're in `.gitignore`
4. **Check browser console** for frontend errors
5. **Check terminal logs** for backend errors

---

## 📞 Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review backend terminal logs
3. Check browser DevTools console
4. Verify all environment variables are set correctly
5. Ensure MongoDB Atlas IP whitelist includes your IP
6. Open an issue on GitHub with error details

---

## 🔄 Database Reset

To start fresh:

```powershell
cd Backend
npm run seed:reset  # Deletes all data
npm run seed        # Re-seeds with fresh data
```

---

**Last Updated:** 2025-10-01  
**FastQ Version:** 1.0.0

