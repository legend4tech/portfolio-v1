import type { ObjectId } from "mongodb"

// MongoDB document types (with ObjectId)
export interface DBProjectDocument {
  _id: ObjectId
  title: string
  description: string
  image: string
  technologies: string[]
  keyFeatures: string[]
  demoUrl: string
  githubUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface DBCertificateDocument {
  _id: ObjectId
  title: string
  issuer: string
  date: string
  image: string
  href: string
  createdAt: Date
  updatedAt: Date
}

export interface DBTechStackDocument {
  _id: ObjectId
  name: string
  icon: string
  category: "Frontend" | "Backend" | "Blockchain" | "Tools" | "Other"
  order: number
  createdAt: Date
  updatedAt: Date
}

// API return types (with string _id)
export interface DBProject {
  _id: string
  title: string
  description: string
  image: string
  technologies: string[]
  keyFeatures: string[]
  demoUrl: string
  githubUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface DBCertificate {
  _id: string
  title: string
  issuer: string
  date: string
  image: string
  href: string
  createdAt: Date
  updatedAt: Date
}

export interface DBTechStack {
  _id: string
  name: string
  icon: string
  category: "Frontend" | "Backend" | "Blockchain" | "Tools" | "Other"
  order: number
  createdAt: Date
  updatedAt: Date
}
