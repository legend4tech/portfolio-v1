"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CodeXml,
  ExternalLink,
  Github,
  Package,
  Package2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// This would typically come from your data source
const projectData = {
  slug: "growtopia-calculator",
  title: "Growtopia-Calculator",
  description:
    "Growtopia Surgery Shop Calculator membantu pemain Growtopia menghitung keuntungan dari penjualan tools di vending shop surgery. Cukup masukkan jumlah pack dan harga per pack untuk menghitung modal, profit kotor, dan profit bersih, sehingga memudahkan perencanaan dan strategi penjualan.",
  image: "/22.jpg",
  stats: [
    { number: 5, label: "Total Teknologi" },
    { number: 3, label: "Fitur Utama" },
  ],
  technologies: ["GSAP", "AOS", "HTML", "CSS", "Javascript", "Nextjs"],
  keyFeatures: [
    "Menghitung modal awal, profit kotor, dan profit bersih secara otomatis dari penjualan tools.",
    "Mensimulasikan jumlah pack yang dijual dan harga per pack untuk merencanakan strategi penjualan.",
    "Memberikan ringkasan data penjualan untuk membantu analisis performa toko vending.",
  ],
  demoUrl: "#",
  githubUrl: "#",
};

export default function ProjectDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link
              href="/portfolio"
              className="hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span>/</span>
            <Link
              href="/portfolio"
              className="hover:text-purple-400 transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <span className="text-purple-400">{projectData.title}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Title and Description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                {projectData.title}
              </h1>
              <p className="text-gray-400 leading-relaxed">
                {projectData.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {projectData.stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    `glass-card p-4 rounded-xl space-y-1 hover:border-purple-400/50 hover:border flex gap-3 items-center`
                  )}
                >
                  <div
                    className={cn(
                      `h-11 w-11 rounded-full bg-[#372556] text-purple-300 flex items-center justify-center`,
                      index === 0 && "bg-[#202E55] text-blue-300"
                    )}
                  >
                    {index === 0 ? (
                      <CodeXml size={30} />
                    ) : (
                      <Package2Icon size={30} />
                    )}
                  </div>
                  <div
                    className={cn(
                      `text-2xl font-bold text-purple-400 `,
                      index === 0 && "text-blue-400"
                    )}
                  >
                    {stat.number}
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-purple-500 hover:bg-purple-600 text-white p-6"
              >
                <Link
                  href={projectData.demoUrl}
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white/5 hover:bg-white/10 text-pink-200 hover:text-white p-6"
              >
                <Link
                  href={projectData.githubUrl}
                  className="inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Github
                </Link>
              </Button>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech) => (
                  <div
                    key={tech}
                    // variant="outline"
                    className="bg-white/5 hover:bg-white/10 text-purple-400 border-purple-400/50 py-5 px-7 rounded-lg border flex gap-2 items-center"
                  >
                    <Package size={20} />
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Project Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden glass-card p-1">
              <Image
                src={projectData.image || "/placeholder.svg"}
                alt={projectData.title}
                className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                width={1200}
                height={675}
                onLoadingComplete={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Key Features */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                  <span className="text-yellow-500">★</span>
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 ">
                  {projectData.keyFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 text-gray-300 hover:bg-white/5 hover:backdrop-blur-md hover:border hover:border-white/10 p-3 rounded-md "
                    >
                      <span className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
