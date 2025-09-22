const { MongoClient } = require('mongodb');

async function setupMongoDB() {
  const uri = 'mongodb://localhost:27017';
  const dbName = 'reliefconnect';
  
  console.log('🔄 Setting up MongoDB...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('helprequests').createIndex({ userId: 1 });
    await db.collection('helprequests').createIndex({ status: 1 });
    await db.collection('helprequests').createIndex({ urgency: 1 });
    await db.collection('helprequests').createIndex({ createdAt: -1 });
    await db.collection('alerts').createIndex({ isActive: 1 });
    await db.collection('alerts').createIndex({ createdAt: -1 });
    
    console.log('✅ Database indexes created');
    
    await client.close();
    console.log('🎉 MongoDB setup complete!');
    
  } catch (error) {
    console.error('❌ MongoDB setup error:', error.message);
    console.log('💡 Make sure MongoDB is running: mongod');
  }
}

setupMongoDB();