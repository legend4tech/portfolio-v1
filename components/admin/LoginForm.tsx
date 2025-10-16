"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { verifyCredentials } from "@/lib/auth-actions";

/**
 * Login Form Schema
 */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Form Component
 * Handles email/password and Google OAuth authentication
 * Fixed for Auth.js v5 production deployment
 */
export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handle email/password login
   * Now verifies credentials via Server Action before calling signIn
   */
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const verificationResult = await verifyCredentials(
        data.email,
        data.password,
      );

      if (!verificationResult.success || !verificationResult.user) {
        toast.error(verificationResult.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // This passes the verified user data to the authorize callback
      const result = await signIn("credentials", {
        email: verificationResult.user.email,
        id: verificationResult.user.id,
        name: verificationResult.user.name,
        role: verificationResult.user.role,
        username: verificationResult.user.username,
        avatar: verificationResult.user.avatar,
        redirect: false,
      });

      // Check for authentication errors
      if (result?.error) {
        toast.error("Authentication failed");
        return;
      }

      // Check if login was successful
      if (result?.ok) {
        toast.success("Login successful!");
        window.location.href = "/admin";
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("[v0] Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google OAuth login
   * Using explicit callbackUrl
   */
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Use explicit callbackUrl for production
      await signIn("google", {
        callbackUrl: `${window.location.origin}/admin`,
        redirect: true,
      });
    } catch (error) {
      console.error("[v0] Google login error:", error);
      toast.error("Failed to login with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card border border-white/10 shadow-2xl">
      <CardHeader className="text-center space-y-6 pb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto ring-1 ring-white/10 shadow-lg shadow-purple-500/20">
          <Lock className="w-10 h-10 text-purple-400" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-4xl font-bold gradient-text">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Sign in to access the admin dashboard
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        {/* Email/Password Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-sm">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-purple-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@example.com"
                        className="h-12 pl-12 pr-4 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-sm">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-purple-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="h-12 pl-12 pr-4 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900/80 text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full h-12 bg-white/5 hover:text-purple-400 hover:bg-white/10 text-white border-white/20 hover:border-white/30 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
