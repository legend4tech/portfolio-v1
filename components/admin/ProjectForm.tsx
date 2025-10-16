"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, X, Loader2, Upload } from "lucide-react";
import { addProject, updateProject } from "@/app/actions/projects";
import type { DBProject } from "@/types/portfolioTypes";
import { projectSchema, type ProjectFormData } from "@/lib/project_schema";
import { toast } from "sonner";
import Image from "next/image";

interface ProjectFormProps {
  project?: DBProject;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.image || null,
  );
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(
    "upload",
  );
  const [newTech, setNewTech] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      technologies: project?.technologies || [],
      keyFeatures: project?.keyFeatures || [],
      demoUrl: project?.demoUrl || "",
      githubUrl: project?.githubUrl || "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      form.setValue("image", data.fileUrl);
      setImagePreview(data.fileUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploading(false);
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

  const addTechnology = () => {
    const trimmed = newTech.trim();
    if (!trimmed) return;

    const currentTechs = form.getValues("technologies");
    if (currentTechs.includes(trimmed)) {
      toast.error("Technology already added");
      return;
    }

    if (currentTechs.length >= 15) {
      toast.error("Maximum 15 technologies allowed");
      return;
    }

    form.setValue("technologies", [...currentTechs, trimmed]);
    setNewTech("");
  };

  const removeTechnology = (tech: string) => {
    const currentTechs = form.getValues("technologies");
    form.setValue(
      "technologies",
      currentTechs.filter((t) => t !== tech),
    );
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;

    const currentFeatures = form.getValues("keyFeatures");
    if (currentFeatures.length >= 10) {
      toast.error("Maximum 10 key features allowed");
      return;
    }

    form.setValue("keyFeatures", [...currentFeatures, trimmed]);
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("keyFeatures");
    form.setValue(
      "keyFeatures",
      currentFeatures.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("image", data.image);
      formData.append("technologies", JSON.stringify(data.technologies));
      formData.append("keyFeatures", JSON.stringify(data.keyFeatures));
      formData.append("demoUrl", data.demoUrl);
      formData.append("githubUrl", data.githubUrl);

      if (project?._id) {
        await updateProject(project._id, formData);
        toast.success("Project updated successfully!");
      } else {
        await addProject(formData);
        toast.success("Project created successfully!");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {project ? "Edit Project" : "Create New Project"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {project
                ? "Update your project details below"
                : "Fill in the details to add a new project to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Project Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="glass-input"
                      placeholder="My Awesome Project"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    A catchy title for your project (3-100 characters)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="glass-input resize-none"
                      placeholder="Describe what makes your project special..."
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    A brief overview of your project (10-500 characters)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Project Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Project preview"
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

                          {imageInputMode === "upload" && (
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-500 border-purple-500/50"
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    ?.click()
                                }
                                disabled={uploading}
                              >
                                {uploading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Image
                                  </>
                                )}
                              </Button>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </div>
                          )}

                          {imageInputMode === "url" && (
                            <Input
                              {...field}
                              className="glass-input"
                              placeholder="https://example.com/image.jpg"
                              type="url"
                              onChange={(e) =>
                                handleImageUrlChange(e.target.value)
                              }
                            />
                          )}
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    {imagePreview
                      ? "Click 'Change Image' to upload a different image"
                      : imageInputMode === "upload"
                        ? "Upload a project screenshot or banner (JPEG, PNG, WebP - Max 5MB)"
                        : "Enter the URL of your project image"}
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Technologies</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTechnology();
                            }
                          }}
                          className="glass-input flex-1"
                          placeholder="e.g., React, TypeScript, Node.js"
                        />
                        <Button
                          type="button"
                          onClick={addTechnology}
                          className="bg-purple-500 hover:bg-purple-600"
                          disabled={!newTech.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 text-sm"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTechnology(tech)}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    Add technologies used in this project (1-15 items)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Key Features</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Textarea
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          className="glass-input resize-none flex-1"
                          placeholder="Describe a key feature..."
                          rows={2}
                        />
                        <Button
                          type="button"
                          onClick={addFeature}
                          className="bg-purple-500 hover:bg-purple-600 self-start"
                          disabled={!newFeature.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {field.value.length > 0 && (
                        <div className="space-y-2">
                          {field.value.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-md bg-white/5 border border-white/10 group hover:border-purple-500/30 transition-colors"
                            >
                              <span className="flex-1 text-sm text-gray-300">
                                {feature}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    Highlight the main features of your project (1-10 items)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="demoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Demo URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="glass-input"
                      placeholder="https://demo.example.com"
                      type="url"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    Link to the live demo or deployed version
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="glass-input"
                      placeholder="https://github.com/username/repo"
                      type="url"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    Link to the GitHub repository
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-6 border-t border-white/10">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{project ? "Update Project" : "Create Project"}</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/5 hover:bg-white/10 text-white hover:text-purple-400 border-white/10"
                disabled={loading || uploading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
