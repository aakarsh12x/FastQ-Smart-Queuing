# fastQ Backend API

A comprehensive Node.js backend for the fastQ queue management system.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Queue Management**: Create, update, delete, and manage queues
- **Real-time Updates**: Socket.IO for live queue position updates
- **User Management**: Profile management, queue history, statistics
- **Admin Dashboard**: Complete admin controls and analytics
- **Analytics & Reporting**: Comprehensive analytics and report generation
- **Rate Limiting**: API rate limiting for security
- **Data Validation**: Input validation and sanitization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠 Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   # Use your MongoDB Atlas connection string here (replace <db_password>)
   MONGODB_URI=mongodb+srv://aakarshshrey12:<db_password>@clustern.fzlg8zn.mongodb.net/fastq?retryWrites=true&w=majority&appName=ClusterN
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Queues
- `GET /api/queues` - Get all active queues
- `GET /api/queues/:id` - Get queue details
- `POST /api/queues` - Create queue (Admin)
- `PUT /api/queues/:id` - Update queue (Admin)
- `DELETE /api/queues/:id` - Delete queue (Admin)
- `POST /api/queues/:id/join` - Join queue
- `POST /api/queues/:id/leave` - Leave queue
- `GET /api/queues/:id/position` - Get user position

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/my-queues` - Get user's current queues
- `GET /api/users/history` - Get queue history
- `GET /api/users/stats` - Get user statistics
- `POST /api/users/rate-queue` - Rate a queue
- `GET /api/users/notifications` - Get notifications

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/queues` - Get admin's queues
- `GET /api/admin/queues/:id` - Get queue details
- `POST /api/admin/queues/:id/serve-next` - Serve next user
- `POST /api/admin/queues/:id/remove-user` - Remove user
- `PUT /api/admin/queues/:id/status` - Update queue status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/queues` - Get queue analytics
- `GET /api/analytics/activity` - Get activity analytics
- `GET /api/analytics/categories` - Get category analytics
- `GET /api/analytics/reports` - Generate reports (Admin)

## 🔧 Database Models

### User
- Basic user information
- Role-based access (user/admin)
- Preferences and statistics
- Password hashing with bcrypt

### Queue
- Queue information and settings
- Current users with positions
- Statistics and ratings
- Admin management

### QueueHistory
- Historical queue data
- User wait times and ratings
- Status tracking (served/left/expired)

### Analytics
- Daily and hourly statistics
- Performance metrics
- Category breakdowns

## 🔌 Real-time Features

The backend uses Socket.IO for real-time updates:

- **Queue Updates**: Live position changes
- **User Notifications**: When served or position changes
- **Admin Actions**: Real-time queue management

### Socket Events

**Client → Server**:
- `join-queue` - Join a queue room
- `leave-queue` - Leave a queue room

**Server → Client**:
- `queue-updated` - Queue state changed
- `user-served` - User has been served
- `queue-status-updated` - Queue status changed

## 🛡 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: express-validator
- **CORS**: Configured for frontend
- **Helmet**: Security headers

## 📊 Analytics & Reporting

- **Overview Statistics**: Total users, queues, completion rates
- **Queue Performance**: Individual queue analytics
- **Activity Tracking**: Hourly/daily activity patterns
- **Category Analysis**: Performance by category
- **Report Generation**: Comprehensive reports for admins

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Configure production MongoDB
3. **Build**: No build step required for Node.js
4. **Process Manager**: Use PM2 for production
5. **Reverse Proxy**: Use Nginx for SSL and load balancing

## 📝 API Documentation

The API follows RESTful conventions with consistent response formats:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": [ ... ] // Validation errors
}
```

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend:

1. **CORS**: Configured for `http://localhost:3000`
2. **Authentication**: JWT tokens for session management
3. **Real-time**: Socket.IO for live updates
4. **API Structure**: Matches frontend requirements

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Review the error logs
3. Ensure MongoDB is running
4. Verify environment variables

## 🎯 Next Steps

- [ ] Add email notifications
- [ ] Implement push notifications
- [ ] Add queue scheduling
- [ ] Implement queue templates
- [ ] Add multi-language support
- [ ] Implement advanced analytics
- [ ] Add queue capacity management
- [ ] Implement queue merging/splitting

