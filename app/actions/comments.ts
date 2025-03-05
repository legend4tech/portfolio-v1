"use server";

import { uploadFileToS3 } from "@/lib/uploadFileToS3";
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
    const file = formData.get("file") as File | null;

    // 2. Upload file to S3 if it exists
    let fileUrl = null;
    if (file && file.size > 0) {
      fileUrl = await uploadFileToS3(file);
    }

    // 3. Save data to MongoDB
    const db = await connectToDatabase();
    const comment_section = db.collection("comment_section");

    // Construct comment object
    const comment = {
      name,
      message,
      time_posted: new Date().toISOString(),
      fileUrl,
    };

    // Insert comment into MongoDB
    const result = await comment_section.insertOne(comment);
    return { ...comment, _id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error(
      `Error adding comment: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Fetch all comments from the database.
export async function getComments() {
  try {
    const db = await connectToDatabase();
    const comment_section = db.collection("comment_section");
    const comments = await comment_section
      .find({})
      .sort({ time_posted: -1 })
      .toArray();

    return comments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error(
      `Error fetching comments: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
