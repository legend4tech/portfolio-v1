"use server";

import { getDb } from "@/lib/mongodb";
import type {
  DBCertificate,
  DBCertificateDocument,
} from "@/types/portfolioTypes";
import { ObjectId } from "mongodb";

/**
 * Server action to fetch all certificates from the database
 * Returns certificates sorted by date (newest first)
 */
export async function getCertificates(): Promise<DBCertificate[]> {
  try {
    const db = await getDb();
    const certificatesCollection =
      db.collection<DBCertificateDocument>("certificates");
    const certificates = await certificatesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return certificates.map((cert) => ({
      ...cert,
      _id: cert._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    throw new Error(
      `Error fetching certificates: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Server action to fetch a single certificate by ID
 */
export async function getCertificateById(
  id: string,
): Promise<DBCertificate | null> {
  try {
    const db = await getDb();
    const certificatesCollection =
      db.collection<DBCertificateDocument>("certificates");
    const certificate = await certificatesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) return null;

    return {
      ...certificate,
      _id: certificate._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return null;
  }
}

/**
 * Server action to add a new certificate to the database
 */
export async function addCertificate(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const issuer = formData.get("issuer") as string;
    const date = formData.get("date") as string;
    const image = formData.get("image") as string;
    const href = formData.get("href") as string;

    const db = await getDb();
    const certificatesCollection = db.collection("certificates");

    const certificate = {
      title,
      issuer,
      date,
      image,
      href,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await certificatesCollection.insertOne(certificate);

    return { ...certificate, _id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error adding certificate:", error);
    throw new Error(
      `Error adding certificate: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Server action to update an existing certificate
 */
export async function updateCertificate(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const issuer = formData.get("issuer") as string;
    const date = formData.get("date") as string;
    const image = formData.get("image") as string;
    const href = formData.get("href") as string;

    const db = await getDb();
    const certificatesCollection = db.collection("certificates");

    const updateData = {
      title,
      issuer,
      date,
      image,
      href,
      updatedAt: new Date(),
    };

    await certificatesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    return { _id: id, ...updateData };
  } catch (error) {
    console.error("Error updating certificate:", error);
    throw new Error(
      `Error updating certificate: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Server action to delete a certificate from the database
 */
export async function deleteCertificate(id: string) {
  try {
    const db = await getDb();
    const certificatesCollection = db.collection("certificates");

    await certificatesCollection.deleteOne({ _id: new ObjectId(id) });

    return { success: true };
  } catch (error) {
    console.error("Error deleting certificate:", error);
    throw new Error(
      `Error deleting certificate: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
