# FastQ - Smart Queue Management System 🚀
Live Link - https://fastq-ichy73kkw-aakarsh12xs-projects.vercel.app/
.
<img width="1896" height="893" alt="image" src="https://github.com/user-attachments/assets/c5d2539e-a70c-4aac-a0ae-67f8809beabc" />

<img width="1897" height="911" alt="image" src="https://github.com/user-attachments/assets/fd1c25a3-7e92-4393-a44c-b8108ca62dc0" />

![FastQ Logo](https://img.shields.io/badge/FastQ-Smart%20Queuing-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

**FastQ** is a modern, real-time queue management system designed for canteens, hospitals, offices, and any environment requiring efficient queue handling. Skip the wait, not the line!

### Key Highlights
- ⚡ **Real-time Updates** - Instant queue position updates via Socket.IO
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS & Next.js
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📊 **Analytics Dashboard** - Comprehensive insights for admins
- 🌐 **Multi-category Support** - Food, Medical, Administrative, Education, and more

## ✨ Features

### For Users
- 📱 Join queues remotely
- 📍 Real-time position tracking
- ⏱️ Estimated wait time
- 📊 Personal analytics & history
- ⭐ Rate and review queues

### For Admins
- 🎛️ Complete queue management
- 👥 User management
- 📈 Advanced analytics
- 🔔 Real-time notifications
- ⚙️ Customizable queue settings

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn/ui, Aceternity UI
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.IO
- **Validation:** Express Validator

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aakarsh12x/FastQ-Smart-Queuing.git
cd FastQ-Smart-Queuing
```

2. **Setup Backend**
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Seed the database with example data:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

3. **Setup Frontend**
```bash
cd Frontend/fastq
npm install
```

Create a `.env.local` file in the Frontend/fastq directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Default Login Credentials (After Seeding)

**Admin Account:**
- Email: `admin_seed@fastq.dev`
- Password: `admin123`

**User Account:**
- Email: `user_seed@fastq.dev`
- Password: `password123`

## 📁 Project Structure

```
FastQ-Smart-Queuing/
├── Backend/
│   ├── config/           # Database and configuration
│   ├── middleware/       # Authentication, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Seed and utility scripts
│   ├── server.js        # Express server entry point
│   └── package.json
├── Frontend/
│   └── fastq/
│       ├── app/         # Next.js App Router pages
│       │   ├── dashboard/         # Admin dashboard
│       │   └── user-dashboard/    # User dashboard
│       ├── components/  # Reusable UI components
│       ├── lib/         # Utilities
│       └── package.json
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
GET  /api/auth/me        - Get current user
```

### Queue Endpoints
```
GET    /api/queues              - Get all queues
GET    /api/queues/:id          - Get queue details
POST   /api/queues              - Create queue (Admin)
PUT    /api/queues/:id          - Update queue (Admin)
DELETE /api/queues/:id          - Delete queue (Admin)
POST   /api/queues/:id/join     - Join a queue
POST   /api/queues/:id/leave    - Leave a queue
GET    /api/queues/:id/position - Get user position
```

### User Endpoints
```
GET  /api/users/profile    - Get user profile
PUT  /api/users/profile    - Update user profile
```

### Admin Endpoints
```
GET  /api/admin/dashboard  - Get admin dashboard stats
POST /api/admin/serve-next - Serve next user in queue
```

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🧪 Testing

### Backend Tests
```bash
cd Backend
npm test
```

### Run Manual Tests
```bash
node test-backend.js
```

## 📦 Deployment

### Backend Deployment (Recommended: Railway/Render/Heroku)
1. Set environment variables on your hosting platform
2. Deploy the Backend folder
3. Update `MONGODB_URI` to use Atlas
4. Set `NODE_ENV=production`

### Frontend Deployment (Recommended: Vercel)
1. Connect your GitHub repo to Vercel
2. Set root directory to `Frontend/fastq`
3. Add environment variable `NEXT_PUBLIC_API_URL`
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aakarsh Shrey**
- GitHub: [@aakarsh12x](https://github.com/aakarsh12x)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Aceternity UI](https://ui.aceternity.com/) - Beautiful UI components
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time communication

---

<div align="center">
Made with ❤️ by Aakarsh Shrey

⭐ Star this repository if you find it helpful!
</div>

