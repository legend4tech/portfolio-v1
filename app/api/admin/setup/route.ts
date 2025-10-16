import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * API Route: Create First Admin User
 * POST /api/admin/setup
 */

const setupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().optional(),
  secretPin: z.string().min(1, "Secret PIN is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = setupSchema.parse(body);

    const expectedPin = process.env.ADMIN_SETUP_PIN;
    if (!expectedPin) {
      return NextResponse.json(
        {
          message:
            "Admin setup is not configured. Please set ADMIN_SETUP_PIN environment variable.",
        },
        { status: 500 },
      );
    }

    if (validatedData.secretPin !== expectedPin) {
      return NextResponse.json(
        { message: "Invalid secret PIN" },
        { status: 403 },
      );
    }

    // Check if admin already exists
    const db = await getDb();
    const adminExists = await db.collection("users").findOne({ role: "admin" });

    if (adminExists) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const avatarValue =
      validatedData.avatar && validatedData.avatar.trim() !== ""
        ? validatedData.avatar
        : null;

    // Create admin user
    const result = await db.collection("users").insertOne({
      name: validatedData.name,
      username: validatedData.username,
      email: validatedData.email,
      password: hashedPassword,
      avatar: avatarValue,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create response and delete the cookie
    const response = NextResponse.json(
      {
        success: true,
        userId: result.insertedId.toString(),
      },
      { status: 201 },
    );

    // Clear the no_admin_exists cookie
    response.cookies.delete("no_admin_exists");

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 },
      );
    }

    console.error("Setup error:", error);
    return NextResponse.json(
      { message: "Failed to create admin account" },
      { status: 500 },
    );
  }
}
