"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, MessageSquare, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  contactFormSchema,
  commentFormSchema,
  type ContactFormValues,
  type CommentFormValues,
} from "@/lib/schema";
import AllComments from "./AllComments";
import { useAddComment } from "@/hooks/useAddComment";

// Updated social links data with full-width flag
const socialLinks = [
  {
    name: "Let's Connect",
    icon: "/linkedin.png",
    color: "bg-blue-500/10",
    link: "#",
    fullWidth: true,
  },
  {
    name: "Instagram",
    icon: "/instagram.png",
    color: "bg-pink-500/10",
    link: "#",
  },
  { name: "Youtube", icon: "/youtube.png", color: "bg-red-500/10", link: "#" },
  { name: "Github", icon: "/github.png", color: "bg-gray-600/10", link: "#" },
  { name: "TikTok", icon: "/tiktok.png", color: "bg-gray-500/10", link: "#" },
];

// Sample comments

export function Contact() {
  // Contact form
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      message: "",
      email: "",
    },
  });

  // Comment form
  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const { mutate: addComment, isPending: isAddingComment } = useAddComment();

  // Animation controls
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Form submission handlers
  const onContactSubmit = async (data: ContactFormValues) => {
    console.log("Contact form:", data);
  };

  const onCommentSubmit = async (data: CommentFormValues) => {
    addComment(data, {
      onSuccess: () => {
        commentForm.reset();
        setSelectedFile(null);
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
    <section id="contact" className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold text-purple-400">Contact Me</h2>
          <p className="text-gray-400">
            Got a question? Send me a message, and I&#39;ll get back to you
            soon.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Form */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Get in Touch Form */}
            <Card className="glass-card  bg-white/5">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-purple-400">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...contactForm}>
                  <form
                    onSubmit={contactForm.handleSubmit(onContactSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              className="glass-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your Email"
                              className="glass-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Your Message"
                              className="glass-input min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                    >
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Connect With Me - Updated Layout */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Connect With Me</h4>
              <div className="space-y-4">
                {/* Full-width first link */}
                {socialLinks
                  .filter((link) => link.fullWidth)
                  .map((social) => (
                    <a
                      key={social.name}
                      href={social.link}
                      className={`glass-card p-4 rounded-xl flex items-center gap-3 ${social.color} hover:bg-opacity-20 transition-colors w-full`}
                    >
                      <Image
                        src={social.icon || "/placeholder.svg"}
                        alt={social.name}
                        width={40}
                        height={40}
                      />
                      <span className="text-sm">{social.name}</span>
                    </a>
                  ))}
                {/* Grid for remaining links */}
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks
                    .filter((link) => !link.fullWidth)
                    .map((social) => (
                      <a
                        key={social.name}
                        href={social.link}
                        className={`glass-card p-4 rounded-xl flex items-center gap-3 ${social.color} hover:bg-opacity-20 transition-colors`}
                      >
                        <Image
                          src={social.icon || "/placeholder.svg"}
                          alt={social.name}
                          width={40}
                          height={40}
                        />
                        <span className="text-sm">{social.name}</span>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Comments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="glass-card"
          >
            <Card className="glass-card ">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="w-5 h-5" />
                  Comments <span className="text-gray-400 text-sm">(230)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Comment Form */}
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
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        Profile Photo (optional)
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {imagePreview ? (
                            <Avatar>
                              <AvatarImage
                                src={imagePreview}
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
                                setSelectedFile(file);
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }}
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
                            {imagePreview
                              ? "Change Photo"
                              : "Choose Profile Photo"}
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
                              setSelectedFile(null);
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
                      <p className="text-xs text-gray-400">
                        Max file size: 5MB
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-500 hover:bg-purple-600 focus:ring-2 focus:ring-purple-500/50"
                      disabled={isAddingComment}
                    >
                      {isAddingComment ? "Posting" : "Post Comment"}
                    </Button>
                  </form>
                </Form>

                {/* Comments List with Scroll and Empty State */}
                <AllComments />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
