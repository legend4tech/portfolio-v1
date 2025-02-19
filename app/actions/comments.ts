"use server";

import { CommentFormValues } from "@/lib/schema";
import { MongoClient } from "mongodb";

// Initialize MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URL as string);

let dbConnection: Promise<MongoClient> | null = null;

/**
 * Establish a connection to the MongoDB database.
 * Ensures only one connection is maintained across requests.
 */
async function connectToDatabase() {
  if (!dbConnection) {
    console.log("Connecting to MongoDB...");
    dbConnection = mongoClient.connect();
    console.log("Connected to MongoDB!");
  }
  return (await dbConnection).db();
}

// Add a new comment to the database.
export async function addComment(data: CommentFormValues) {
  const db = await connectToDatabase();
  const comment_section = db.collection("comment_section");

  // Construct comment object
  const comment = {
    name: data.name,
    message: data.message,
    time_posted: new Date().toISOString(),
  };
  console.log(comment);
  // Insert comment into MongoDB
  const result = await comment_section.insertOne(comment);
  return { ...comment, _id: result.insertedId.toString() };
}

// Retrieve all comments from the database, sorted by most recent.
export async function getComments() {
  console.log("connecting to db");
  const db = await connectToDatabase();
  console.log("connected to db");
  const comments = db.collection("comment_section");

  const result = await comments.find().sort({ time_posted: -1 }).toArray();
  // Serialize the MongoDB objects
  return result.map((comment) => ({
    id: comment._id.toString(),
    name: comment.name,
    message: comment.message,
    time_posted: comment.time_posted,
  }));
}
