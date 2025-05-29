const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Helper to check if mongoose is already connected
const isConnected = () => mongoose.connection.readyState === 1;

// Connect to test database (only if not already connected)
const connectTestDB = async () => {
  if (isConnected()) return;
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Test database connected");
  } catch (error) {
    console.error("Test database connection error:", error);
    throw error;
  }
};

// Clear test database (only if connected)
const clearTestDB = async () => {
  if (!isConnected()) return;
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error("Error clearing test database:", error);
  }
};

// Close DB connection
const closeConnections = async () => {
  if (!isConnected()) return;
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log("Test database disconnected");
  } catch (error) {
    console.error("Error closing test database connection:", error);
  }
};

module.exports = {
  connectTestDB,
  clearTestDB,
  closeConnections,
};
