require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not found in environment variables, using default (not recommended for production)');
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'volunteer', 'government'], default: 'user' },
  phone: String,
  location: String,
  skills: [String],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Help Request Schema
const helpRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'assigned', 'in-progress', 'completed'], default: 'pending' },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

// Alert Schema
const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['emergency', 'warning', 'info'], required: true },
  location: String,
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Alert = mongoose.model('Alert', alertSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the dist directory (for production)
app.use(express.static(path.join(__dirname, '../dist')));

// Request logging
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// MongoDB connection with retry logic
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reliefconnect';
let isConnected = false;
let connectionAttempts = 0;
const maxRetries = 3;
let inMemoryData = {
  users: [],
  helpRequests: [],
  alerts: [],
  contacts: []
};

const connectToMongoDB = async () => {
  try {
    connectionAttempts++;
    console.log(`🔄 Attempting MongoDB connection (${connectionAttempts}/${maxRetries})...`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Initialize database on first connection
    setTimeout(() => initializeDatabase(), 1000);
    
  } catch (error) {
    console.error(`❌ MongoDB connection error (attempt ${connectionAttempts}):`, error.message);
    
    if (connectionAttempts < maxRetries) {
      const delay = Math.min(1000 * connectionAttempts, 3000);
      console.log(`⏳ Retrying in ${delay}ms...`);
      setTimeout(connectToMongoDB, delay);
    } else {
      console.warn('⚠️  Running without MongoDB - using in-memory storage');
      console.log('💡 To use persistent storage:');
      console.log('   1. Install MongoDB: https://docs.mongodb.com/manual/installation/');
      console.log('   2. Start MongoDB: mongod');
      console.log('   3. Or use MongoDB Atlas cloud database');
      initializeInMemoryData();
    }
  }
};

// Initialize in-memory data when MongoDB is not available
const initializeInMemoryData = () => {
  console.log('🔧 Initializing in-memory demo data...');
  
  // Create demo users with hashed passwords
  inMemoryData.users = [
    {
      _id: 'gov-demo-id',
      name: 'Government Official',
      email: 'gov@demo.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      role: 'government',
      phone: '+1-555-0101',
      location: 'City Hall, Downtown',
      skills: [],
      isVerified: false,
      createdAt: new Date()
    },
    {
      _id: 'volunteer-demo-id',
      name: 'John Volunteer',
      email: 'volunteer@demo.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      role: 'volunteer',
      phone: '+1-555-0102',
      location: 'Community Center',
      skills: ['First Aid', 'Search and Rescue', 'Emergency Response'],
      isVerified: false,
      createdAt: new Date()
    },
    {
      _id: 'user-demo-id',
      name: 'Jane User',
      email: 'user@demo.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      role: 'user',
      phone: '+1-555-0103',
      location: 'Residential Area',
      skills: [],
      isVerified: false,
      createdAt: new Date()
    }
  ];

  // Create sample help requests
  inMemoryData.helpRequests = [
    {
      _id: 'help-1',
      userId: 'user-demo-id',
      title: 'Need Emergency Shelter',
      description: 'Family of 4 needs temporary shelter due to flooding',
      category: 'shelter',
      urgency: 'high',
      location: 'Riverside District',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Create sample alerts
  inMemoryData.alerts = [
    {
      _id: 'alert-1',
      title: 'Flood Warning',
      message: 'Heavy rainfall expected. Residents in low-lying areas should evacuate.',
      type: 'warning',
      location: 'Riverside District',
      isActive: true,
      createdBy: 'gov-demo-id',
      createdAt: new Date()
    }
  ];

  console.log('✅ In-memory demo data initialized');
};

// Initialize database with demo data
const initializeDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🔧 Initializing database with demo data...');
      
      // Create demo users
      const demoUsers = [
        {
          name: 'Government Official',
          email: 'gov@demo.com',
          password: await bcrypt.hash('password123', 10),
          role: 'government',
          phone: '+1-555-0101',
          location: 'City Hall, Downtown'
        },
        {
          name: 'John Volunteer',
          email: 'volunteer@demo.com',
          password: await bcrypt.hash('password123', 10),
          role: 'volunteer',
          phone: '+1-555-0102',
          location: 'Community Center',
          skills: ['First Aid', 'Search and Rescue', 'Emergency Response']
        },
        {
          name: 'Jane User',
          email: 'user@demo.com',
          password: await bcrypt.hash('password123', 10),
          role: 'user',
          phone: '+1-555-0103',
          location: 'Residential Area'
        }
      ];

      await User.insertMany(demoUsers);
      console.log('✅ Demo users created');

      // Create sample help requests
      const users = await User.find();
      const sampleRequests = [
        {
          userId: users[2]._id,
          title: 'Need Emergency Shelter',
          description: 'Family of 4 needs temporary shelter due to flooding',
          category: 'shelter',
          urgency: 'high',
          location: 'Riverside District'
        },
        {
          userId: users[2]._id,
          title: 'Medical Assistance Required',
          description: 'Elderly person needs medication delivery',
          category: 'medical',
          urgency: 'medium',
          location: 'Oak Street'
        }
      ];

      await HelpRequest.insertMany(sampleRequests);
      console.log('✅ Sample help requests created');

      // Create sample alerts
      const sampleAlerts = [
        {
          title: 'Flood Warning',
          message: 'Heavy rainfall expected. Residents in low-lying areas should evacuate.',
          type: 'warning',
          location: 'Riverside District',
          createdBy: users[0]._id
        }
      ];

      await Alert.insertMany(sampleAlerts);
      console.log('✅ Sample alerts created');
      
      console.log('🎉 Database initialization complete!');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { name, email, password, role, phone, location, skills } = req.body;

    let existingUser;
    if (isConnected) {
      // Check if user exists in MongoDB
      existingUser = await User.findOne({ email });
    } else {
      // Check if user exists in memory
      existingUser = inMemoryData.users.find(u => u.email === email);
    }
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      _id: isConnected ? undefined : `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
      location,
      skills: skills || [],
      isVerified: false,
      createdAt: new Date()
    };

    let user;
    if (isConnected) {
      // Save to MongoDB
      user = new User(userData);
      await user.save();
    } else {
      // Save to memory
      user = userData;
      inMemoryData.users.push(user);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User registered successfully:', email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    let user;
    if (isConnected) {
      // Find user in MongoDB
      user = await User.findOne({ email });
    } else {
      // Find user in memory
      user = inMemoryData.users.find(u => u.email === email);
    }
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Help Requests Routes
app.get('/api/help-requests', async (req, res) => {
  try {
    let requests;
    if (isConnected) {
      requests = await HelpRequest.find()
        .populate('userId', 'name email location')
        .populate('assignedVolunteer', 'name email phone')
        .sort({ createdAt: -1 });
    } else {
      requests = inMemoryData.helpRequests.map(req => ({
        ...req,
        userId: inMemoryData.users.find(u => u._id === req.userId)
      }));
    }
    res.json(requests);
  } catch (error) {
    console.error('❌ Error fetching help requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/help-requests', async (req, res) => {
  try {
    console.log('📝 Creating help request:', req.body);
    
    // Add userId from request body or default for testing
    const requestData = {
      ...req.body,
      userId: req.body.userId || 'user-demo-id', // Default for demo
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    let helpRequest;
    if (isConnected) {
      helpRequest = new HelpRequest(requestData);
      await helpRequest.save();
    } else {
      helpRequest = {
        _id: `help-${Date.now()}`,
        ...requestData
      };
      inMemoryData.helpRequests.push(helpRequest);
    }
    
    console.log('✅ Help request created:', helpRequest.title);
    res.status(201).json(helpRequest);
  } catch (error) {
    console.error('❌ Error creating help request:', error);
    res.status(500).json({ 
      message: 'Server error creating help request',
      error: error.message 
    });
  }
});

// Volunteer assignment route
app.post('/api/volunteer/assign', async (req, res) => {
  try {
    const { requestId, volunteerId } = req.body;
    console.log('👥 Assigning volunteer:', volunteerId, 'to request:', requestId);
    
    let updatedRequest;
    if (isConnected) {
      updatedRequest = await HelpRequest.findByIdAndUpdate(
        requestId,
        { 
          assignedVolunteer: volunteerId,
          status: 'assigned',
          updatedAt: new Date()
        },
        { new: true }
      );
    } else {
      const requestIndex = inMemoryData.helpRequests.findIndex(r => r._id === requestId);
      if (requestIndex !== -1) {
        inMemoryData.helpRequests[requestIndex] = {
          ...inMemoryData.helpRequests[requestIndex],
          assignedVolunteer: volunteerId,
          status: 'assigned',
          updatedAt: new Date()
        };
        updatedRequest = inMemoryData.helpRequests[requestIndex];
      }
    }
    
    if (updatedRequest) {
      console.log('✅ Volunteer assigned successfully');
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Help request not found' });
    }
  } catch (error) {
    console.error('❌ Error assigning volunteer:', error);
    res.status(500).json({ message: 'Server error assigning volunteer' });
  }
});

// Update request status route
app.put('/api/help-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log('📊 Updating request status:', id, 'to', status);
    
    let updatedRequest;
    if (isConnected) {
      updatedRequest = await HelpRequest.findByIdAndUpdate(
        id,
        { 
          status,
          updatedAt: new Date()
        },
        { new: true }
      );
    } else {
      const requestIndex = inMemoryData.helpRequests.findIndex(r => r._id === id);
      if (requestIndex !== -1) {
        inMemoryData.helpRequests[requestIndex] = {
          ...inMemoryData.helpRequests[requestIndex],
          status,
          updatedAt: new Date()
        };
        updatedRequest = inMemoryData.helpRequests[requestIndex];
      }
    }
    
    if (updatedRequest) {
      console.log('✅ Request status updated successfully');
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Help request not found' });
    }
  } catch (error) {
    console.error('❌ Error updating request status:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// Volunteers Routes
app.get('/api/volunteers', async (req, res) => {
  try {
    let volunteers;
    if (isConnected) {
      volunteers = await User.find({ role: 'volunteer' }).select('-password');
    } else {
      volunteers = inMemoryData.users
        .filter(u => u.role === 'volunteer')
        .map(u => ({ ...u, password: undefined }));
    }
    res.json(volunteers);
  } catch (error) {
    console.error('❌ Error fetching volunteers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Alerts Routes
app.get('/api/alerts', async (req, res) => {
  try {
    let alerts;
    if (isConnected) {
      alerts = await Alert.find({ isActive: true })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
    } else {
      alerts = inMemoryData.alerts
        .filter(a => a.isActive)
        .map(a => ({
          ...a,
          createdBy: inMemoryData.users.find(u => u._id === a.createdBy)
        }));
    }
    res.json(alerts);
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    let alert;
    if (isConnected) {
      alert = new Alert(req.body);
      await alert.save();
    } else {
      alert = {
        _id: `alert-${Date.now()}`,
        ...req.body,
        isActive: true,
        createdAt: new Date()
      };
      inMemoryData.alerts.push(alert);
    }
    console.log('✅ Alert created:', alert.title);
    res.status(201).json(alert);
  } catch (error) {
    console.error('❌ Error creating alert:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    let totalUsers, totalRequests, activeAlerts, totalVolunteers;
    
    if (isConnected) {
      [totalUsers, totalRequests, activeAlerts, totalVolunteers] = await Promise.all([
        User.countDocuments(),
        HelpRequest.countDocuments(),
        Alert.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'volunteer' })
      ]);
    } else {
      totalUsers = inMemoryData.users.length;
      totalRequests = inMemoryData.helpRequests.length;
      activeAlerts = inMemoryData.alerts.filter(a => a.isActive).length;
      totalVolunteers = inMemoryData.users.filter(u => u.role === 'volunteer').length;
    }

    res.json({
      totalUsers,
      totalRequests,
      activeAlerts,
      totalVolunteers
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
  try {
    if (isConnected) {
      const contact = new Contact(req.body);
      await contact.save();
    } else {
      const contact = {
        _id: `contact-${Date.now()}`,
        ...req.body,
        createdAt: new Date()
      };
      inMemoryData.contacts.push(contact);
    }
    console.log('✅ Contact form submitted:', contact.email);
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server running',
    database: isConnected ? 'MongoDB Connected' : 'In-Memory Storage',
    dataMode: isConnected ? 'persistent' : 'temporary',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.get('*', (req, res) => {
  // For API routes that don't exist, return JSON error
  if (req.originalUrl.startsWith('/api/')) {
    console.log('❌ API route not found:', req.method, req.originalUrl);
    return res.status(404).json({ message: 'API route not found' });
  }
  
  // For all other routes in development, redirect to Vite dev server
  console.log('📁 Redirecting to Vite dev server for:', req.originalUrl);
  res.redirect(`http://localhost:5173${req.originalUrl}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Start MongoDB connection
  connectToMongoDB();
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (isConnected) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});