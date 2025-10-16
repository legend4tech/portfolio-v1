"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { addCertificate, updateCertificate } from "@/app/actions/certificates";
import type { DBCertificate } from "@/types/portfolioTypes";
import Image from "next/image";

const certificateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  issuer: z
    .string()
    .min(2, "Issuer must be at least 2 characters")
    .max(100, "Issuer is too long"),
  date: z.string().min(1, "Date is required"),
  image: z.string().url("Must be a valid URL").min(1, "Image is required"),
  href: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Certificate URL is required"),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

interface CertificateFormProps {
  certificate?: DBCertificate;
  mode: "create" | "edit";
}

export function CertificateForm({ certificate, mode }: CertificateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    certificate?.image || null,
  );
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(
    "upload",
  );

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: certificate?.title || "",
      issuer: certificate?.issuer || "",
      date: certificate?.date || "",
      image: certificate?.image || "",
      href: certificate?.href || "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();

      form.setValue("image", data.fileUrl);
      setImagePreview(data.fileUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    form.setValue("image", url);
    setImagePreview(url);
  };

  const handleChangeImage = () => {
    setImagePreview(null);
    form.setValue("image", "");
  };

  const onSubmit = async (values: CertificateFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("issuer", values.issuer);
        formData.append("date", values.date);
        formData.append("image", values.image);
        formData.append("href", values.href);

        if (mode === "edit" && certificate?._id) {
          await updateCertificate(certificate._id, formData);
          toast.success("Certificate updated successfully!");
        } else {
          await addCertificate(formData);
          toast.success("Certificate added successfully!");
        }

        router.push("/admin/certificates");
        router.refresh();
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          mode === "edit"
            ? "Failed to update certificate"
            : "Failed to add certificate",
        );
      }
    });
  };

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-white text-2xl">
          {mode === "edit" ? "Edit Certificate" : "Add New Certificate"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {mode === "edit"
            ? "Update certificate information"
            : "Fill in the details to add a new certificate"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Certificate Image
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5 border border-white/10">
                            <Image
                              src={imagePreview}
                              alt="Certificate preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleChangeImage}
                            className="w-full bg-white/5 hover:bg-white/10 text-white hover:text-purple-400 border-white/10"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit">
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                imageInputMode === "upload"
                                  ? "default"
                                  : "ghost"
                              }
                              className={
                                imageInputMode === "upload"
                                  ? "bg-purple-500 hover:bg-purple-600"
                                  : "text-purple-500"
                              }
                              onClick={() => setImageInputMode("upload")}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                imageInputMode === "url" ? "default" : "ghost"
                              }
                              className={
                                imageInputMode === "url"
                                  ? "bg-purple-500 hover:bg-purple-600"
                                  : "text-purple-500"
                              }
                              onClick={() => setImageInputMode("url")}
                            >
                              Link
                            </Button>
                          </div>

                          {imageInputMode === "upload" ? (
                            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-400/50 transition-colors">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <Label
                                htmlFor="image-upload"
                                className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium"
                              >
                                Click to upload certificate image
                              </Label>
                              <p className="text-sm text-gray-500 mt-2">
                                PNG, JPG, WebP up to 5MB
                              </p>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </div>
                          ) : (
                            <Input
                              {...field}
                              className="glass-input"
                              placeholder="https://example.com/certificate.jpg"
                              type="url"
                              onChange={(e) =>
                                handleImageUrlChange(e.target.value)
                              }
                            />
                          )}

                          {isUploading && (
                            <div className="flex items-center gap-2 text-sm text-purple-400">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Uploading image...
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    {imagePreview
                      ? "Click 'Change Image' to upload a different image"
                      : imageInputMode === "upload"
                        ? "Upload a certificate image (PNG, JPG, WebP - Max 5MB)"
                        : "Enter the URL of your certificate image"}
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Certificate Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React and Next.js Complete Course"
                      className="glass-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Issuer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Udemy, Coursera, etc."
                      className="glass-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Date Issued</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., October 22 2023"
                      className="glass-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Certificate URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      className="glass-input"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    Link to view the full certificate
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-6 border-t border-white/10">
              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-purple-500/20"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "edit" ? "Updating..." : "Adding..."}
                  </>
                ) : mode === "edit" ? (
                  "Update Certificate"
                ) : (
                  "Add Certificate"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:text-purple-400"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
