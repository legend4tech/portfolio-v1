"use server";

import type { CommentDocument, CommentTypes } from "@/types/commentTypes";
import { MongoClient } from "mongodb";

// Initialize MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URL as string);

let dbConnection: Promise<MongoClient> | null = null;

async function connectToDatabase() {
  if (!dbConnection) {
    console.log("Connecting to MongoDB...");
    dbConnection = mongoClient.connect();
    console.log("Connected to MongoDB!");
  }
  return (await dbConnection).db(process.env.MONGODB_DB);
}

// Add a new comment to the database.
export async function addComment(formData: FormData) {
  try {
    // 1. Extract data from FormData
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const avatar = (formData.get("avatar") as string) || null;

    // Debug log to check what we're receiving
    console.log("Received form data:", {
      name,
      message,
      avatar: avatar ? "Avatar URL received" : "No avatar",
    });

    // 2. Save data to MongoDB
    const db = await connectToDatabase();
    const comment_section = db.collection("comment_section");

    // Construct comment object
    const comment = {
      name,
      message,
      time_posted: new Date().toISOString(),
      avatar,
    };

    // Insert comment into MongoDB
    const result = await comment_section.insertOne(comment);

    return { ...comment, _id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error(
      `Error adding comment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Fetch all comments from the database.
export async function getComments(): Promise<CommentTypes[]> {
  try {
    const db = await connectToDatabase();
    const comment_section = db.collection<CommentDocument>("comment_section");
    const comments = await comment_section
      .find({})
      .sort({ time_posted: -1 })
      .toArray();

    return comments.map(
      (comment): CommentTypes => ({
        _id: comment._id.toString(),
        name: comment.name,
        message: comment.message,
        time_posted: comment.time_posted,
        avatar: comment.avatar,
      })
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error(
      `Error fetching comments: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
