import type { Metadata } from "next";
import { ProjectsManagementClient } from "@/components/admin/ProjectsManagementClient";

export const metadata: Metadata = {
  title: "Manage Projects - Admin",
};

/**
 * Projects Management Page
 * Server component that renders the client-side projects management interface
 */
export default function ProjectsManagementPage() {
  return <ProjectsManagementClient />;
}
