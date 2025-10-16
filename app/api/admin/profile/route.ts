import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { ObjectId } from "mongodb"

/**
 * API Route: Update Admin Profile
 * PUT /api/admin/profile
 */

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  avatar: z.string().optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    const db = await getDb()
    const userId = new ObjectId(session.user.id)

    // If changing password, verify current password
    if (validatedData.newPassword && validatedData.currentPassword) {
      const user = await db.collection("users").findOne({ _id: userId })

      if (!user || !user.password) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      const passwordMatch = await bcrypt.compare(validatedData.currentPassword, user.password)

      if (!passwordMatch) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

      // Update with new password
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            name: validatedData.name,
            username: validatedData.username,
            email: validatedData.email,
            password: hashedPassword,
            avatar: validatedData.avatar,
            updatedAt: new Date(),
          },
        },
      )
    } else {
      // Update without password change
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            name: validatedData.name,
            username: validatedData.username,
            email: validatedData.email,
            avatar: validatedData.avatar,
            updatedAt: new Date(),
          },
        },
      )
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
    }

    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
  }
}
