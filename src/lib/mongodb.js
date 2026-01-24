// /lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to environment variables");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, use global to avoid multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
