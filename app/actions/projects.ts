"use server"

import { getDb } from "@/lib/mongodb"
import type { DBProject, DBProjectDocument } from "@/types/portfolioTypes"
import { ObjectId } from "mongodb"

// Get all projects from database
export async function getProjects(): Promise<DBProject[]> {
  try {
    const db = await getDb()
    const projectsCollection = db.collection<DBProjectDocument>("projects")
    const projects = await projectsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return projects.map((project) => ({
      ...project,
      _id: project._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw new Error(`Error fetching projects: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Get single project by ID
export async function getProjectById(id: string): Promise<DBProject | null> {
  try {
    const db = await getDb()
    const projectsCollection = db.collection<DBProjectDocument>("projects")
    const project = await projectsCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!project) return null

    return {
      ...project,
      _id: project._id?.toString(),
    }
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

// Add new project
export async function addProject(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("image") as string
    const technologies = JSON.parse(formData.get("technologies") as string)
    const keyFeatures = JSON.parse(formData.get("keyFeatures") as string)
    const demoUrl = formData.get("demoUrl") as string
    const githubUrl = formData.get("githubUrl") as string

    const db = await getDb()
    const projectsCollection = db.collection("projects")

    const project = {
      title,
      description,
      image,
      technologies,
      keyFeatures,
      demoUrl,
      githubUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await projectsCollection.insertOne(project)

    return { ...project, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error adding project:", error)
    throw new Error(`Error adding project: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Update existing project
export async function updateProject(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("image") as string
    const technologies = JSON.parse(formData.get("technologies") as string)
    const keyFeatures = JSON.parse(formData.get("keyFeatures") as string)
    const demoUrl = formData.get("demoUrl") as string
    const githubUrl = formData.get("githubUrl") as string

    const db = await getDb()
    const projectsCollection = db.collection("projects")

    const updateData = {
      title,
      description,
      image,
      technologies,
      keyFeatures,
      demoUrl,
      githubUrl,
      updatedAt: new Date(),
    }

    await projectsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return { _id: id, ...updateData }
  } catch (error) {
    console.error("Error updating project:", error)
    throw new Error(`Error updating project: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Delete project
export async function deleteProject(id: string) {
  try {
    const db = await getDb()
    const projectsCollection = db.collection("projects")

    await projectsCollection.deleteOne({ _id: new ObjectId(id) })

    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    throw new Error(`Error deleting project: ${error instanceof Error ? error.message : String(error)}`)
  }
}
