"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Tech stack data
const techStack = [
  {
    category: "Frontend",
    items: [
      { name: "HTML", icon: "/html-5.png" },
      { name: "CSS", icon: "/css.png" },
      {
        name: "JavaScript",
        icon: "/javascript.png",
      },
      { name: "React JS", icon: "/react.png" },
      { name: "Next JS", icon: "/nextjs.png" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Next JS", icon: "/nextjs.png" },
      { name: "Supabase", icon: "/supabase.png" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Vite", icon: "/vite.png" },
      {
        name: "Tailwind CSS",
        icon: "/tailwind.png",
      },
      { name: "Shadcn UI", icon: "/shadcn-ui.png" },
      { name: "Vercel", icon: "/vercel.png" },
    ],
  },
];

// Certificate data
const certificates = [
  {
    id: 1,
    title: "HTML and CSS Course",
    issuer: "Udemy",
    date: "October 22 2023",
    image: "/html&css_certificate.jpg",
    href: "https://udemy-certificate.s3.amazonaws.com/image/UC-c596998b-1de2-410d-9ed6-aacf0e646c90.jpg",
  },
  {
    id: 2,
    title: "Comlete Javascript Course",
    issuer: "Udemy",
    date: "July 31 2023",
    image: "/javascript_certificate.jpg",
    href: "https://udemy-certificate.s3.amazonaws.com/image/UC-840c54c7-f5a4-4a04-acf3-55afea4afe52.jpg",
  },
  {
    id: 3,
    title:
      "React And NextJs Course + Redux, React Router, Tanstack Query, Tailwind CSS  ",
    issuer: "Udemy",
    date: "October 28 2024",
    image: "/react_certificate.jpg",
    href: "https://udemy-certificate.s3.amazonaws.com/image/UC-72f46aa9-50e8-48a2-b86f-ce6d5bcf9e0a.jpg",
  },
  // Add more certificates as needed
];

// Projects type definition
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  detailsUrl: string;
}

// Sample projects data
const projects: Project[] = [
  {
    id: 1,
    title: "Aritmatika Solver",
    description:
      "Program ini dirancang untuk mempermudah pengguna dalam menyelesaikan soal-soal Aritmatika secara otomatis dengan...",
    image: "/22.jpg",
    demoUrl: "#",
    detailsUrl: "#",
  },
  {
    id: 2,
    title: "AutoChat-Discord",
    description:
      "AutoChat adalah solusi otomatisasi untuk mengelola pesan ke seluruh Discord secara terkelola. Pengguna dapat...",
    image: "/placeholder.svg?height=400&width=600",
    demoUrl: "#",
    detailsUrl: "#",
  },
  {
    id: 3,
    title: "Buku Catatan",
    description:
      "Buku Catatan adalah website yang memungkinkan pengguna untuk membuat, menyimpan, dan mengelola catatan secara...",
    image: "/placeholder.svg?height=400&width=600",
    demoUrl: "#",
    detailsUrl: "#",
  },
  {
    id: 4,
    title: "Growtopia-Calculator",
    description:
      "Growtopia Surgery Shop Calculator membantu pemain dalam menghitung keuntungan dari...",
    image: "/placeholder.svg?height=400&width=600",
    demoUrl: "#",
    detailsUrl: "#",
  },
  {
    id: 5,
    title: "IT Support Bekasi",
    description:
      "Website IT Support Bekasi adalah proyek yang saya buat dan website ini digunakan untuk...",
    image: "/placeholder.svg?height=400&width=600",
    demoUrl: "#",
    detailsUrl: "#",
  },
  {
    id: 6,
    title: "Portfolio-V4",
    description:
      "Website Portfolio-v4 adalah versi sebelumnya dari website ini yang saya buat menggunakan...",
    image: "/placeholder.svg?height=400&width=600",
    demoUrl: "#",
    detailsUrl: "#",
  },
];

// New component for tech stack category
const TechStackCategory = ({ category, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? items : items.slice(0, 6);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold capitalize gradient-text">
        {category} Technologies
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayedItems.map((tech) => (
          <motion.div
            key={tech.name}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-xl flex flex-col items-center gap-4"
          >
            <div className="relative w-12 h-12">
              <Image
                src={tech.icon}
                alt={tech.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="text-sm font-medium text-center">{tech.name}</span>
          </motion.div>
        ))}
      </div>
      {items.length > 6 && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="w-full mt-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-white"
        >
          {isExpanded ? "View Less" : "View More"}
          {isExpanded ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export function Portfolio() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);
  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, 4);

  return (
    <section id="portfolio" className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-purple-400">
            Portfolio Showcase
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore my journey through projects, certifications, and technical
            expertise. Each section represents a milestone in my continuous
            learning path.
          </p>
        </motion.div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-transparent">
            {["Projects", "Certificates", "Tech Stack"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 hover:text-purple-400"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Projects Tab Content */}
          <TabsContent value="projects">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <a
                        href={project.demoUrl}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                      >
                        Live Demo <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={project.detailsUrl}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                      >
                        Details <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {!showAllProjects && projects.length > 4 && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowAllProjects(true)}
                  variant="outline"
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50"
                >
                  View All Projects
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Certificates Tab Content */}
          <TabsContent value="certificates">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayedCertificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-semibold gradient-text">
                      {cert.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <Link
                        href={cert.href}
                        className="flex gap-1 items-center hover:text-purple-300 "
                      >
                        {cert.issuer} <ExternalLink className="w-4 h-4" />
                      </Link>
                      <span>{cert.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {!showAllCertificates && certificates.length > 4 && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowAllCertificates(true)}
                  variant="outline"
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50"
                >
                  View All Certificates
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Tech Stack Tab Content */}
          <TabsContent value="tech stack">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {techStack.map((category) => (
                <TechStackCategory
                  key={category.category}
                  category={category.category}
                  items={category.items}
                />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
