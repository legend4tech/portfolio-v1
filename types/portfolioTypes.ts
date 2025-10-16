import type { ObjectId } from "mongodb";

// ------------------------------------------
// 🔹 Tech Stack Types
// ------------------------------------------

export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  category: string;
  items: TechItem[];
}

// ------------------------------------------
// 🔹 Certificate Types
// ------------------------------------------

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  href: string;
}

// ------------------------------------------
// 🔹 Project Types
// ------------------------------------------

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  detailsUrl: string;
}

export interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  keyFeatures: string[];
  demoUrl: string;
  githubUrl: string;
}

// ------------------------------------------
// 🔹 GitHub Pull Request Types
// ------------------------------------------

export interface GitHubPRBase {
  id: number;
  title: string;
  url: string;
  mergedAt: string;
  repository: string;
  repositoryUrl: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  closedIssues: Array<{
    number: string;
    url: string;
  }>;
  description: string | null;
}

export interface GitHubPRDisplay extends GitHubPRBase {}

export interface GitHubPR extends GitHubPRBase {
  additions?: number;
  deletions?: number;
  changedFiles?: number;
}

// ------------------------------------------
// 🔹 MongoDB Document Types (with ObjectId)
// ------------------------------------------

export interface DBProjectDocument {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  keyFeatures: string[];
  demoUrl: string;
  githubUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBCertificateDocument {
  _id: ObjectId;
  title: string;
  issuer: string;
  date: string;
  image: string;
  href: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBTechStackDocument {
  _id: ObjectId;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "Blockchain" | "Tools" | "Other";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ------------------------------------------
// 🔹 API Return Types (with string _id)
// ------------------------------------------

export interface DBProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  keyFeatures: string[];
  demoUrl: string;
  githubUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBCertificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  href: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBTechStack {
  _id: string;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "Blockchain" | "Tools" | "Other";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ------------------------------------------
// 🔹 User Types
// ------------------------------------------

export interface DBUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
