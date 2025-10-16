"use server"

import { getDb } from "@/lib/mongodb"
import type { DBTechStack } from "@/types/portfolioTypes"
import { ObjectId } from "mongodb"

/**
 * Server action to fetch all tech stack items from the database
 * Returns tech stack items sorted by category and order
 */
export async function getTechStack(): Promise<DBTechStack[]> {
  try {
    const db = await getDb()
    const techStackCollection = db.collection<DBTechStack>("techstack")
    const techStack = await techStackCollection.find({}).sort({ category: 1, order: 1 }).toArray()

    return techStack.map((tech) => ({
      ...tech,
      _id: tech._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching tech stack:", error)
    throw new Error(`Error fetching tech stack: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Server action to fetch a single tech stack item by ID
 */
export async function getTechStackById(id: string): Promise<DBTechStack | null> {
  try {
    const db = await getDb()
    const techStackCollection = db.collection<DBTechStack>("techstack")
    const tech = await techStackCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!tech) return null

    return {
      ...tech,
      _id: tech._id?.toString(),
    }
  } catch (error) {
    console.error("Error fetching tech stack item:", error)
    return null
  }
}

/**
 * Server action to add a new tech stack item to the database
 */
export async function addTechStack(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const icon = formData.get("icon") as string
    const category = formData.get("category") as DBTechStack["category"]
    const order = Number.parseInt(formData.get("order") as string)

    const db = await getDb()
    const techStackCollection = db.collection("techstack")

    const tech = {
      name,
      icon,
      category,
      order,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await techStackCollection.insertOne(tech)

    return { ...tech, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error adding tech stack item:", error)
    throw new Error(`Error adding tech stack item: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Server action to update an existing tech stack item
 */
export async function updateTechStack(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const icon = formData.get("icon") as string
    const category = formData.get("category") as DBTechStack["category"]
    const order = Number.parseInt(formData.get("order") as string)

    const db = await getDb()
    const techStackCollection = db.collection("techstack")

    const updateData = {
      name,
      icon,
      category,
      order,
      updatedAt: new Date(),
    }

    await techStackCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return { _id: id, ...updateData }
  } catch (error) {
    console.error("Error updating tech stack item:", error)
    throw new Error(`Error updating tech stack item: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Server action to delete a tech stack item from the database
 */
export async function deleteTechStack(id: string) {
  try {
    const db = await getDb()
    const techStackCollection = db.collection("techstack")

    await techStackCollection.deleteOne({ _id: new ObjectId(id) })

    return { success: true }
  } catch (error) {
    console.error("Error deleting tech stack item:", error)
    throw new Error(`Error deleting tech stack item: ${error instanceof Error ? error.message : String(error)}`)
  }
}
