"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, Link as LinkIcon, Sparkles } from "lucide-react"
import { addTechStack, updateTechStack } from "@/app/actions/techstack"
import type { DBTechStack } from "@/types/portfolioTypes"
import { techStackSchema, type TechStackFormData } from "@/lib/techstack_schema"
import { toast } from "sonner"
import Image from "next/image"

interface TechStackFormProps {
  techStack?: DBTechStack
}

export function TechStackForm({ techStack }: TechStackFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [iconPreview, setIconPreview] = useState<string | null>(techStack?.icon || null)
  const [iconInputMode, setIconInputMode] = useState<"upload" | "url">("upload")

  const form = useForm<TechStackFormData>({
    resolver: zodResolver(techStackSchema),
    defaultValues: {
      name: techStack?.name || "",
      icon: techStack?.icon || "",
      category: techStack?.category || "Frontend",
      order: techStack?.order || 0,
    },
  })

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload icon")
      }

      form.setValue("icon", data.fileUrl)
      setIconPreview(data.fileUrl)
      toast.success("Icon uploaded successfully!")
    } catch (error) {
      console.error("Error uploading icon:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload icon")
    } finally {
      setUploading(false)
    }
  }

  const handleIconUrlChange = (url: string) => {
    form.setValue("icon", url)
    setIconPreview(url)
  }

  const onSubmit = async (data: TechStackFormData) => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("icon", data.icon)
      formData.append("category", data.category)
      formData.append("order", data.order.toString())

      if (techStack?._id) {
        await updateTechStack(techStack._id, formData)
        toast.success("Tech stack updated successfully!")
      } else {
        await addTechStack(formData)
        toast.success("Tech stack created successfully!")
      }

      router.push("/admin/techstack")
      router.refresh()
    } catch (error) {
      console.error("Error saving tech stack:", error)
      toast.error("Failed to save tech stack. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="glass-card border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-white text-3xl">
                {techStack ? "Edit Tech Stack" : "Add New Tech Stack"}
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-base">
              {techStack
                ? "Update your tech stack details below"
                : "Fill in the details to add a new technology to your stack"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative">
            {/* Icon Field - Featured prominently */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-semibold">Technology Icon</FormLabel>
                  <FormControl>
                    <div className="space-y-6">
                      {/* Icon Preview - Larger and more prominent */}
                      {iconPreview && (
                        <div className="flex justify-center">
                          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm shadow-xl shadow-purple-500/10">
                            <Image
                              src={iconPreview || "/placeholder.svg"}
                              alt="Icon preview"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        </div>
                      )}

                      {/* Mode Toggle - More stylish */}
                      <div className="flex gap-3 p-1.5 bg-white/5 rounded-xl w-fit mx-auto border border-white/10">
                        <Button
                          type="button"
                          size="sm"
                          variant={iconInputMode === "upload" ? "default" : "ghost"}
                          className={
                            iconInputMode === "upload" 
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg" 
                              : "text-purple-400 hover:text-purple-300 hover:bg-white/5"
                          }
                          onClick={() => setIconInputMode("upload")}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={iconInputMode === "url" ? "default" : "ghost"}
                          className={
                            iconInputMode === "url" 
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg" 
                              : "text-purple-400 hover:text-purple-300 hover:bg-white/5"
                          }
                          onClick={() => setIconInputMode("url")}
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Image URL
                        </Button>
                      </div>

                      {/* Upload Mode */}
                      {iconInputMode === "upload" && (
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white hover:text-purple-400 border-white/10 h-12 shadow-lg"
                            onClick={() => document.getElementById("icon-upload")?.click()}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 mr-2" />
                                {iconPreview ? "Change Icon" : "Upload Icon"}
                              </>
                            )}
                          </Button>
                          <input
                            id="icon-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={handleIconUpload}
                          />
                        </div>
                      )}

                      {/* URL Mode */}
                      {iconInputMode === "url" && (
                        <Input
                          {...field}
                          className="glass-input h-12 text-base"
                          placeholder="https://example.com/icon.png"
                          type="url"
                          onChange={(e) => handleIconUrlChange(e.target.value)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    {iconInputMode === "upload"
                      ? "Upload a technology icon (PNG, SVG, WebP - Max 2MB)"
                      : "Enter the URL of the technology icon"}
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-semibold">Technology Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="glass-input h-12 text-base" placeholder="React JS" />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    The name of the technology (2-50 characters)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Category & Order in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input h-12">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-purple-500/30">
                        <SelectItem
                          value="Frontend"
                          className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 focus:text-white"
                        >
                          Frontend
                        </SelectItem>
                        <SelectItem
                          value="Backend"
                          className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 focus:text-white"
                        >
                          Backend
                        </SelectItem>
                        <SelectItem
                          value="Blockchain"
                          className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 focus:text-white"
                        >
                          Blockchain
                        </SelectItem>
                        <SelectItem
                          value="Tools"
                          className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 focus:text-white"
                        >
                          Tools
                        </SelectItem>
                        <SelectItem
                          value="Other"
                          className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 focus:text-white"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-400">
                      The category this technology belongs to
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Order Field */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold">Display Order</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="glass-input h-12 text-base"
                        placeholder="0"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Lower numbers appear first (0-999)
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold h-12 text-base shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{techStack ? "Update Tech Stack" : "Add Tech Stack"}</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/5 hover:bg-white/10 text-white hover:text-purple-400 border-white/10 h-12 px-8"
                disabled={loading || uploading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}