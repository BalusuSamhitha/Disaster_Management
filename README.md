# ReliefConnect - Disaster Management Platform

A comprehensive full-stack disaster management platform that connects government officials, volunteers, and users in need during natural disasters and emergencies.

## 🚀 Features

### Role-based Authentication & Dashboards
- *Government Officials*: Monitor disasters, manage resources, create alerts, view analytics
- *Volunteers*: Accept help requests, track tasks, manage availability and skills
- *Users in Need*: Request emergency assistance, find shelters, receive alerts

### Core Functionality
- *Real-time Help Request System*: Submit and manage emergency assistance requests
- *Volunteer Coordination*: Register volunteers, assign tasks, track progress
- *Emergency Alert System*: Government-issued notifications and update
- *Responsive Design*: Mobile-first approach with dark theme
- 
## 🛠 Tech Stack

### Frontend
- *React 18* with TypeScript
- *React Router* for navigation
- *Axios* for API calls
- *Lucide React* for icons
- *Custom CSS* with CSS variables

### Backend
- *Node.js* with Express.js
- *MongoDB* with Mongoose (with in-memory fallback)
- *JWT* authentication
- *bcryptjs* for password hashing
- *CORS* enabled

## 📦 Installation

1. *Clone the repository*
bash
git clone <repository-url>
cd reliefconnect


2. *Install dependencies*
bash
npm install


3. *Set up environment variables*
The .env file is already configured with default values:
env
MONGODB_URI=mongodb://localhost:27017/reliefconnect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000


4. *Start the application*

For development with both frontend and backend:
bash
npm run dev:full


Or run separately:
bash
# Backend only
npm run server

# Frontend only (in another terminal)
npm run dev


## 🔐 Demo Accounts

The application includes demo accounts for testing:

- *Government Official*: gov@demo.com / password123
- *Volunteer*: volunteer@demo.com / password123
- *User in Need*: user@demo.com / password123

## 📱 Usage Guide

### For Users in Need
1. *Register/Login* to your account
2. *Request Help* by filling out the emergency assistance form
3. *Find Shelters* and emergency services nearby
4. *Receive Alerts* about safety notifications

### For Volunteers
1. *Register* with your  availability
2. *View Available Tasks* in your dashboard
3. *Accept Help Requests* that match your skills
4. *Update Task Status* as you work on them


### For Government Officials
1. *Login* to access the command center
2. *Monitor Critical Incidents* requiring immediate attention
3. *Deploy Resources* and assign volunteers
4. *Create Emergency Alerts* for public notifications



## 🔧 API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Help Requests
- POST /api/help-requests - Create help request

### Volunteers
- GET /api/volunteers - Get all volunteers


### Alerts
- GET /api/alerts - Get active alerts
- POST /api/alerts - Create new alert (government only)

### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics

### Contact
- POST /api/contact - Submit contact form
 

## 🔄 Workflow

### Help Request Lifecycle
1. *User submits help request* → Status: pending
2. *Volunteer accepts task* → Status: assigned
3. *Volunteer starts work* → Status: in-progress
4. *Volunteer completes task* → Status: completed

### Data Flow
- *Users* create help requests visible to volunteers and government
- *Volunteers* can accept and update task status
- *Government* monitors all activities and can deploy resources
- *Real-time updates* across all dashboards


## 🔧 Development

### Running in Development Mode
bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev:full

# Or start separately:
npm run server    # Backend on port 5000
npm run dev       # Frontend on port 5173
