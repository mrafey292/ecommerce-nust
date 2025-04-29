// lib/db.js
import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add these options to improve connection reliability
  connectTimeoutMS: 10000, // Connection timeout
  socketTimeoutMS: 45000,  // Socket timeout
};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global;

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    // Create a connection promise and store it
    globalWithMongo._mongoClientPromise = client.connect()
      .then(client => {
        console.log("MongoDB connection established globally");
        return client;
      })
      .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then(client => {
      console.log("MongoDB connection established");
      return client;
    })
    .catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    });
}

// Export a module-scoped MongoClient promise.
export default clientPromise;