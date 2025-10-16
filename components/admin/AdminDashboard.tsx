"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FolderKanban,
  Award,
  Code2,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminDashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatar?: string | null;
    username?: string | null;
  };
}

/**
 * Admin Dashboard Component
 * Central hub for managing portfolio content with welcome message and avatar
 */
export function AdminDashboard({ user }: AdminDashboardProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // Use custom avatar if available, otherwise fall back to OAuth image
  const avatarUrl = user.avatar || user.image;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="container mx-auto px-6 py-12">
        {/* Header with User Info */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Welcome back,{" "}
              {user.username || user.name?.split(" ")[0] || "Admin"}! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your portfolio content and settings
            </p>
          </div>

          {/* User Menu with Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-14 w-14 rounded-full ring-2 ring-purple-500/50 hover:ring-purple-400"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={avatarUrl || undefined}
                    alt={user.name || "Admin"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold text-lg">
                    {user.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-900 border-gray-800"
              align="end"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                asChild
                className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <Link href="/admin/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Projects Management Card */}
          <Card className="glass-card border-0 hover:border-purple-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FolderKanban className="w-7 h-7 text-purple-400" />
              </div>
              <CardTitle className="text-white text-xl">Projects</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your portfolio projects and showcase your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/20"
              >
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Certificates Management Card */}
          <Card className="glass-card border-0 hover:border-blue-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-7 h-7 text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">Certificates</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your certifications and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
              >
                <Link href="/admin/certificates">Manage Certificates</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tech Stack Management Card */}
          <Card className="glass-card border-0 hover:border-cyan-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-7 h-7 text-cyan-400" />
              </div>
              <CardTitle className="text-white text-xl">Tech Stack</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your technical skills and tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/20"
              >
                <Link href="/admin/techstack">Manage Tech Stack</Link>
              </Button>
            </CardContent>
          </Card>

          {/* View Portfolio Card */}
          <Card className="glass-card border-0 hover:border-green-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-7 h-7 text-green-400" />
              </div>
              <CardTitle className="text-white text-xl">
                View Portfolio
              </CardTitle>
              <CardDescription className="text-gray-400">
                Preview your portfolio as visitors see it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-green-400/50"
              >
                <Link href="/">View Portfolio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
