import { MongoClient, ServerApiVersion } from "mongodb";

/**
 * MongoDB connection utility
 * Manages database connection with connection pooling
 * Exports MongoClient for Auth.js adapter
 */

if (!process.env.MONGODB_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URL;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
const clientPromise: Promise<MongoClient> = (() => {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the connection
    // across module reloads caused by HMR (Hot Module Replacement)
    const globalWithMongo = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
  } else {
    // In production mode, create a new client
    client = new MongoClient(uri, options);
  }

  // Return the connection promise
  return client.connect();
})();

/**
 * Get the MongoDB database instance
 * @returns Promise<Db> - MongoDB database instance
 */
export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(process.env.MONGODB_DB);
}

// Export the client promise for Auth.js adapter
export default clientPromise;
