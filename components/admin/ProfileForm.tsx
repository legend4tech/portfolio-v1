"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, LinkIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const profileFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    avatar: z.string().optional(),
  })
  .refine(
    (data) => {
      // If newPassword is provided, currentPassword must also be provided
      if (data.newPassword && data.newPassword.length > 0) {
        return data.currentPassword && data.currentPassword.length > 0;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      // If newPassword is provided, it must be at least 6 characters
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword.length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["newPassword"],
    },
  );

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    avatar?: string | null;
  };
}

interface ProfileUpdatePayload {
  name: string;
  username: string;
  email: string;
  avatar: string;
  newPassword?: string;
  currentPassword?: string;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
      avatar: user.avatar || "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const originalValues = {
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || "",
    };

    const currentValues = {
      name: watchedValues.name,
      username: watchedValues.username,
      email: watchedValues.email,
      avatar: avatarPreview || watchedValues.avatar || "",
    };

    const passwordChanged = Boolean(
      (watchedValues.currentPassword &&
        watchedValues.currentPassword.length > 0) ||
        (watchedValues.newPassword && watchedValues.newPassword.length > 0),
    );

    const profileChanged = Boolean(
      originalValues.name !== currentValues.name ||
        originalValues.username !== currentValues.username ||
        originalValues.email !== currentValues.email ||
        originalValues.avatar !== currentValues.avatar,
    );

    setHasChanges(profileChanged || passwordChanged);
  }, [watchedValues, avatarPreview, user]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setAvatarPreview(data.url);
      form.setValue("avatar", data.url);
      toast.success("Avatar uploaded successfully!");
      return data.url;
    } catch (error) {
      toast.error("Failed to upload avatar");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);

    try {
      const payload: ProfileUpdatePayload = {
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: avatarPreview || data.avatar || "",
      };

      if (data.newPassword && data.newPassword.length > 0) {
        payload.newPassword = data.newPassword;
        payload.currentPassword = data.currentPassword;
      }

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      toast.success("Profile updated successfully!");
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Link href="/admin">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <CardTitle className="text-3xl font-bold gradient-text">
              Profile Settings
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Update your account details and avatar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="space-y-3">
              <FormLabel className="text-white font-medium">
                Profile Avatar
              </FormLabel>
              <Tabs
                value={uploadMode}
                onValueChange={(v) => setUploadMode(v as "upload" | "url")}
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-purple-500/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger
                    value="url"
                    className="data-[state=active]:bg-purple-500/20"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Image URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={isUploading}
                    className="bg-white/5 border-white/10 text-white file:bg-purple-500/20 file:text-purple-300 file:border-0 file:mr-4 file:px-4 file:py-2 hover:bg-white/10"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-3">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.jpg"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setAvatarPreview(e.target.value);
                            }}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {avatarPreview && (
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/50">
                    <Image
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Change Section */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Change Password (Optional)
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-400">
                        Leave blank to keep current password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                You have unsaved changes
              </div>
            )}

            <Button
              type="submit"
              disabled={
                isLoading ||
                isUploading ||
                !hasChanges ||
                !form.formState.isValid
              }
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-6 text-base shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
