"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { commentFormSchema, type CommentFormValues } from "@/lib/schema";
import { useAddComment } from "@/hooks/useAddComment";

export function CommentForm() {
  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: "",
      message: "",
      file: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const { mutate: addComment, isPending: isAddingComment } = useAddComment();

  const onCommentSubmit = async (data: CommentFormValues) => {
    console.log("Comment form:", data);
    addComment(data, {
      onSuccess: () => {
        // Reset form after successful submission
        commentForm.reset();
        setCharCount(0);
        setImagePreview(null);
        if (document.getElementById("photo-upload")) {
          (document.getElementById("photo-upload") as HTMLInputElement).value =
            "";
        }
      },
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Form {...commentForm}>
      <form
        onSubmit={commentForm.handleSubmit(onCommentSubmit)}
        className="space-y-4 mb-8"
      >
        <FormField
          control={commentForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  className="glass-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={commentForm.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Write your message here..."
                    className="glass-input min-h-[120px] resize-none pr-16 comments-scroll"
                    maxLength={500}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setCharCount(e.target.value.length);
                    }}
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                    {charCount}/500
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Photo Upload */}
        <FormField
          control={commentForm.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormControl>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Profile Photo (optional)
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {imagePreview ? (
                        <Avatar>
                          <AvatarImage
                            src={imagePreview || "/placeholder.svg"}
                            alt="Profile preview"
                          />
                          <AvatarFallback>
                            <Upload className="w-6 h-6 text-purple-500" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarFallback>
                            <Upload className="w-6 h-6 text-purple-500" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size <= 2 * 1024 * 1024) {
                              onChange(file);
                              setImagePreview(URL.createObjectURL(file));
                            } else {
                              commentForm.setError("file", {
                                type: "manual",
                                message: "Image must be less than 2MB ",
                              });
                            }
                          }
                        }}
                        {...field}
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 hover:text-white"
                        onClick={() =>
                          document.getElementById("photo-upload")?.click()
                        }
                      >
                        {imagePreview ? "Change Photo" : "Choose Profile Photo"}
                      </Button>
                    </div>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500"
                        onClick={() => {
                          setImagePreview(null);
                          onChange(undefined);
                          if (document.getElementById("photo-upload")) {
                            (
                              document.getElementById(
                                "photo-upload"
                              ) as HTMLInputElement
                            ).value = "";
                          }
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Max file size: 2MB</p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 focus:ring-2 focus:ring-purple-500/50"
          disabled={isAddingComment}
        >
          {isAddingComment ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Form>
  );
}
