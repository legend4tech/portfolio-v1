"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { useDeleteCertificate } from "@/hooks/useDeleteCertificate";
import { useCertificates } from "@/hooks/useCertificates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CertificatesListSkeleton } from "@/components/admin/loadingSkeleton/CertificatesListSkeleton";
import { ErrorState } from "@/components/root/ErrorState";

/**
 * Certificates List Component
 * Fetches and displays all certificates using React Query hook
 * Provides edit/delete actions with loading and error states
 */
export function CertificatesList() {
  const {
    data: certificates = [],
    isLoading,
    error,
    refetch,
  } = useCertificates();
  const { mutate: deleteCertificate, isPending } = useDeleteCertificate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Handles certificate deletion with loading state
   */
  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteCertificate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (isLoading) {
    return <CertificatesListSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load certificates"
        message="There was an error loading your certificates. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  // Empty state - no certificates available
  if (certificates.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardContent className="py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No certificates yet
          </h3>
          <p className="text-gray-400 mb-6">
            Get started by adding your first certificate
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Link href="/admin/certificates/new">
              Add Your First Certificate
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((certificate, index) => (
        <motion.div
          key={certificate._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="glass-card border-0 hover:border-blue-400/50 transition-all duration-300 h-full flex flex-col group">
            {/* Certificate Image */}
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <Image
                  src={
                    certificate.image || "/placeholder.svg?height=300&width=400"
                  }
                  alt={certificate.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col">
              {/* Certificate Title */}
              <CardTitle className="text-white mb-2 line-clamp-2 text-lg">
                {certificate.title}
              </CardTitle>
              <CardDescription className="text-gray-400 mb-4 flex-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-400 font-medium">
                    {certificate.issuer}
                  </span>
                  <span>{certificate.date}</span>
                </div>
              </CardDescription>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Link href={`/admin/certificates/${certificate._id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isPending && deletingId === certificate._id}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Delete Certificate
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-white">
                          &quot;{certificate.title}&quot;
                        </span>
                        ? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(certificate._id!)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* External Link */}
              <div className="pt-3 border-t border-white/10">
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="w-full text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-purple-300"
                >
                  <Link
                    href={certificate.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Certificate
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
