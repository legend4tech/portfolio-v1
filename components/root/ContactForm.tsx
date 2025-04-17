"use client";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
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
import { contactFormSchema, type ContactFormValues } from "@/lib/schema";
import { useSendEmail } from "@/hooks/use-send-email";

// Social links data with full-width flag
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

export function ContactForm() {
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      message: "",
      email: "",
    },
  });

  const { mutate: sendEmail, isPending } = useSendEmail();

  const onContactSubmit = async (data: ContactFormValues) => {
    sendEmail(data, {
      onSuccess: () => {
        // Reset form after successful submission
        contactForm.reset();
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Get in Touch Form */}
      <Card className="glass-card bg-white/5">
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
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
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
  );
}
