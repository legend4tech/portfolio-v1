import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CertificateForm } from "@/components/admin/CertificateForm";

export const metadata: Metadata = {
  title: "Add Certificate - Admin",
};

/**
 * New Certificate Page
 * Form to add a new certificate
 */
export default function NewCertificatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Button
          asChild
          variant="ghost"
          className="mb-8 -ml-4 text-white hover:text-purple-500  bg-purple-500"
        >
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Certificates
          </Link>
        </Button>

        <CertificateForm mode="create" />
      </div>
    </div>
  );
}
