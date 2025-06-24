# 🌟 CareX - Calorie Tracking Application

A comprehensive web application for tracking daily calorie intake, managing food logs, and monitoring health goals. Built with React, Node.js, TypeScript, and MongoDB.

![CareX Logo](./client/public/logo192.png)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Food Database**: Comprehensive database with 16+ pre-loaded foods across categories
- **Calorie Tracking**: Log meals by breakfast, lunch, dinner, and snacks
- **Daily Summaries**: Track daily calorie intake vs. goals
- **Progress Visualization**: Charts and progress bars for goal monitoring
- **User Profiles**: Customizable health goals and personal information

### Advanced Features
- **Food Search**: Real-time search through food database
- **Custom Foods**: Create and add your own foods to the database
- **Statistics**: Weekly, monthly, and yearly analytics
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live data synchronization

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Chart.js & react-chartjs-2** for data visualization
- **Axios** for API communication
- **Headless UI** for accessible components
- **Heroicons** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for request validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) 
- **MongoDB** (v4.4 or higher)
- **Git**

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 500MB free space

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd CareX
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Step 1: Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/carex

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB Installation

1. **Install MongoDB Community Server**:
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux (Ubuntu)**: 
     ```bash
     wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
     sudo apt-get update
     sudo apt-get install -y mongodb-org
     ```

2. **Start MongoDB Service**:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # MongoDB should start automatically as a service
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in `.env`

### Step 3: Database Seeding

The application will automatically seed the database with sample food data on first run.

## 🚀 Running the Application

### Step 1: Start MongoDB

Ensure MongoDB is running:

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"
```

### Step 2: Start the Backend Server

```bash
cd server
npm run dev
```

The backend will start on `http://localhost:5000`

You should see:
```
🚀 Server is running on port 5000
🌍 Environment: development
✅ MongoDB connected successfully
✅ Foods already seeded
```

### Step 3: Start the Frontend Development Server

Open a new terminal:

```bash
cd client
npm start
```

The frontend will start on `http://localhost:3000` (or the next available port)

### Step 4: Verify Installation

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response: `{"status":"OK","message":"CareX API is running"}`

2. **Frontend Access**: Open your browser and navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "profile": {
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activityLevel": "moderate",
    "goal": "maintain"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Food Endpoints

#### Search Foods
```http
GET /api/foods/search?q=apple&category=fruits
Authorization: Bearer <token>
```

#### Get Food Categories
```http
GET /api/foods/meta/categories
Authorization: Bearer <token>
```

#### Create Food
```http
POST /api/foods
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Custom Food",
  "caloriesPerServing": 150,
  "servingSize": "1",
  "servingUnit": "piece",
  "category": "fruits"
}
```

### Food Log Endpoints

#### Log Food
```http
POST /api/logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "foodId": "food-id-here",
  "quantity": 2,
  "mealType": "breakfast",
  "totalCalories": 300
}
```

#### Get Daily Summary
```http
GET /api/logs/daily/2025-06-24
Authorization: Bearer <token>
```

## 📁 Project Structure

```
CareX/
├── README.md                 # This file
├── test-api.sh              # API testing script
├── client/                  # Frontend React application
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # Reusable React components
│       ├── contexts/        # React context providers
│       ├── hooks/           # Custom React hooks
│       ├── pages/           # Page components
│       ├── services/        # API service layer
│       ├── types/           # TypeScript type definitions
│       └── utils/           # Utility functions
└── server/                  # Backend Node.js application
    ├── package.json         # Backend dependencies
    ├── tsconfig.json        # TypeScript configuration
    └── src/
        ├── config/          # Database and app configuration
        ├── controllers/     # Route controllers
        ├── middleware/      # Express middleware
        ├── models/          # MongoDB/Mongoose models
        ├── routes/          # API routes
        └── utils/           # Backend utilities
```

## 📖 Usage Guide

### 1. User Registration

1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Sign Up"
3. Fill in your personal information:
   - Name and email
   - Password (minimum 6 characters)
   - Age, gender, height, weight
   - Activity level and health goal
4. Click "Create Account"

### 2. User Login

1. Go to the login page
2. Enter your email and password
3. Click "Sign In"

### 3. Dashboard Overview

After logging in, you'll see:
- **Daily Calorie Progress**: Visual progress toward your daily goal
- **Today's Meals**: Breakdown by breakfast, lunch, dinner, snacks
- **Quick Add**: Button to log new foods
- **Recent Foods**: Recently logged items

### 4. Logging Food

1. Click "Add Food" or the "+" button
2. Search for a food in the database
3. Select the food and specify quantity
4. Choose meal type (breakfast, lunch, dinner, snack)
5. Add optional notes
6. Click "Log Food"

### 5. Creating Custom Foods

1. In the food logger, click "Can't find your food? Create a new one"
2. Fill in food details:
   - Name and brand (optional)
   - Calories per serving
   - Serving size and unit
   - Category
3. Click "Create Food"

### 6. Viewing Statistics

1. Navigate to the "Stats" page
2. Choose time period (week, month, year)
3. View charts showing:
   - Daily calorie intake trends
   - Goal achievement percentage
   - Meal distribution

### 7. Managing Profile

1. Go to "Profile" page
2. Update personal information
3. Modify health goals
4. Change password if needed

## 🧪 Testing

### Manual Testing

Use the provided test script to verify API functionality:

```bash
chmod +x test-api.sh
./test-api.sh
```

### Frontend Testing

```bash
cd client
npm test
```

### Backend Testing

```bash
cd server
npm test
```

### End-to-End Testing

1. **Registration Flow**:
   - Register a new user
   - Verify email validation
   - Check profile creation

2. **Food Logging Flow**:
   - Search for foods
   - Log different meal types
   - Verify calorie calculations

3. **Statistics Flow**:
   - View daily summaries
   - Check weekly/monthly stats
   - Verify chart rendering

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the frontend**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

### Backend Deployment (Heroku/Railway)

1. **Prepare for deployment**:
   ```bash
   cd server
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Deploy using Git** or platform-specific CLI

### Database Deployment (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in production environment
3. Configure network access and database users

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

#### Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Update Node.js using nvm
nvm install --lts
nvm use --lts
```

### Error Messages

- **"MongoDB connection failed"**: Check MongoDB service and connection string
- **"JWT token invalid"**: Clear browser storage and login again
- **"Port 3000 already in use"**: Either stop the conflicting process or use a different port

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the database solution
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for beautiful data visualizations

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Create an issue on GitHub
3. Contact the development team

---

**Happy tracking with CareX! 🌟**
