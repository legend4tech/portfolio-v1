"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Upload, LinkIcon, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

/**
 * Setup Form Component
 * Creates the first admin user with avatar upload
 */
export function SetupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setAvatarPreview(data.fileUrl || data.url)
      toast.success("Avatar uploaded successfully!")
      return data.fileUrl || data.url
    } catch (error) {
      toast.error("Failed to upload avatar")
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const clearAvatar = () => {
    setAvatarPreview("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const avatarValue = avatarPreview && avatarPreview.trim() !== "" ? avatarPreview : undefined

    const data = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      avatar: avatarValue,
      secretPin: formData.get("secretPin") as string,
    }

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Setup failed")
      }

      toast.success("Admin account created successfully!")
      router.push("/admin/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create admin account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl border-purple-500/20 bg-gray-900/95 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center space-y-3 pb-8">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Create Admin Account
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">
          Set up your admin account to manage your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label className="text-white font-semibold text-base">Profile Avatar</Label>

            {!avatarPreview ? (
              <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "upload" | "url")}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-800/80">
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger
                    value="url"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Image URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 mt-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    disabled={isUploading}
                    className="bg-gray-800/80 border-gray-700 text-white file:bg-purple-500/20 file:text-purple-400 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md file:font-medium hover:file:bg-purple-500/30 cursor-pointer h-12"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-4 mt-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    onChange={(e) => setAvatarPreview(e.target.value)}
                    className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 h-12"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg shadow-purple-500/20">
                  <Image src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" fill className="object-cover" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAvatar}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Change Avatar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-white font-semibold">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 h-12"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="username" className="text-white font-semibold">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                required
                placeholder="johndoe"
                className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 h-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-white font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 h-12"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-white font-semibold">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 h-12"
            />
            <p className="text-sm text-gray-400">Must be at least 6 characters</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="secretPin" className="text-white font-semibold">
              Secret PIN
            </Label>
            <Input
              id="secretPin"
              name="secretPin"
              type="password"
              required
              placeholder="Enter your secret setup PIN"
              className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 hover:from-purple-600 hover:via-blue-600 hover:to-purple-700 text-white font-semibold h-14 text-base shadow-lg shadow-purple-500/30 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Admin Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
