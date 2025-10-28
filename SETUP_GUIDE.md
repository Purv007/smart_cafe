# Cafeteria Project Setup Guide

## Prerequisites
- ✅ Node.js (v22.15.0) - Already installed
- ✅ npm (v11.6.0) - Already installed
- ❌ MongoDB - Needs to be installed

## Quick Setup Options

### Option 1: Install MongoDB Locally (Recommended)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows installer
   - Run the installer as Administrator
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service

2. **Start MongoDB Service:**
   - Open Services (services.msc)
   - Find "MongoDB" service
   - Start the service

### Option 2: Use MongoDB Atlas (Cloud - No Installation Required)

1. **Create MongoDB Atlas Account:**
   - Go to: https://www.mongodb.com/atlas
   - Sign up for free
   - Create a new cluster (free tier)

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Update Server Configuration:**
   - Edit `server/index.js` line 90
   - Replace `mongodb://127.0.0.1:27017/Cafeteria` with your Atlas connection string

## Running the Project

### Step 1: Install Dependencies
```bash
# Backend dependencies
cd Cafeteria1/server
npm install

# Frontend dependencies  
cd ../Frontend
npm install
```

### Step 2: Seed Database (Optional)
```bash
cd ../server
node seedProducts.js
```

### Step 3: Start Backend Server
```bash
cd server
npm start
```
Server will run on: http://localhost:3001

### Step 4: Start Frontend (New Terminal)
```bash
cd Frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## Default Admin Credentials
- Email: admin@cafeteria.com
- Password: admin123

## Features
- User authentication (signup/signin)
- Product catalog with categories
- Shopping cart functionality
- Order management
- Admin dashboard
- Email notifications
- Payment integration (demo)
- Wishlist functionality
- Product reviews and ratings

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify connection string is correct

### Port Conflicts
- Backend: Change port in `server/index.js` line 1708
- Frontend: Change port in `Frontend/vite.config.js`

### Permission Issues
- Run PowerShell as Administrator
- Check antivirus/firewall settings

