# FastQ - Smart Queue Management System

Live: https://fastq-ichy73kkw-aakarsh12xs-projects.vercel.app/

## Preview

![FastQ UI 1](https://github.com/user-attachments/assets/c5d2539e-a70c-4aac-a0ae-67f8809beabc)
![FastQ UI 2](https://github.com/user-attachments/assets/fd1c25a3-7e92-4393-a44c-b8108ca62dc0)

## About

FastQ is a real-time queue management system for canteens, hospitals, offices, and similar environments. It allows users to join queues remotely and track their position while giving admins full control and analytics.

## Features

### Users
- Join queues remotely  
- Track real-time position  
- View estimated wait time  
- Access history and analytics  
- Rate queues  

### Admins
- Manage queues and users  
- View analytics dashboard  
- Send real-time updates  
- Customize queue settings  

## Tech Stack

### Frontend
- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- Shadcn UI, Aceternity UI  
- Framer Motion  

### Backend
- Node.js, Express.js  
- MongoDB (Atlas), Mongoose  
- JWT Authentication, bcrypt  
- Socket.IO  
- Express Validator  

## Setup

### Clone
```bash
git clone https://github.com/aakarsh12x/FastQ-Smart-Queuing.git
cd FastQ-Smart-Queuing
```

### Backend
```bash
cd Backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=your_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

Run:
```bash
npm run seed
npm run dev
```

### Frontend
```bash
cd Frontend/fastq
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run:
```bash
npm run dev
```

## Default Credentials

Admin  
- admin_seed@fastq.dev  
- admin123  

User  
- user_seed@fastq.dev  
- password123  

## API Overview

### Auth
- POST `/api/auth/register`  
- POST `/api/auth/login`  
- GET `/api/auth/me`  

### Queues
- GET `/api/queues`  
- POST `/api/queues`  
- POST `/api/queues/:id/join`  
- POST `/api/queues/:id/leave`  

### Admin
- GET `/api/admin/dashboard`  
- POST `/api/admin/serve-next`  

## Project Structure

```
Backend/
Frontend/fastq/
```

## Deployment

Backend: Railway / Render  
Frontend: Vercel  

## Author

Aakarsh Shrey  
https://github.com/aakarsh12x  
