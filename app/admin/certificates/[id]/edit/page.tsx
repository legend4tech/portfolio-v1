import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CertificateForm } from "@/components/admin/CertificateForm"
import { getCertificateById } from "@/app/actions/certificates"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Certificate - Admin",
}

/**
 * Edit Certificate Page
 * Form to edit an existing certificate
 */
export default async function EditCertificatePage({ params }: { params: { id: string } }) {
  const certificate = await getCertificateById(params.id)

  if (!certificate) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Button asChild variant="ghost" className="mb-8 text-white hover:text-purple-500  bg-purple-500 -ml-4">
          <Link href="/admin/certificates" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Certificates
          </Link>
        </Button>

        <CertificateForm certificate={certificate} mode="edit" />
      </div>
    </div>
  )
}
