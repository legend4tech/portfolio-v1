"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink, Code2, Award, Globe } from "lucide-react";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";

// Stats data for the cards
const stats = [
  {
    icon: <Code2 className="w-6 h-6" />,
    number: 11,
    title: "TOTAL PROJECTS",
    subtitle: "Innovative web solutions crafted",
  },
  {
    icon: <Award className="w-6 h-6" />,
    number: 7,
    title: "CERTIFICATES",
    subtitle: "Professional skills validated",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    number: 3,
    title: "YEARS OF EXPERIENCE",
    subtitle: "Continuous learning journey",
  },
];

export function About() {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="min-h-screen py-20 hero-gradient">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold">About Me</h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <span className="text-purple-400">✨</span>
            Transforming Ideas into digital experiences
            <span className="text-purple-400">✨</span>
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-5xl font-bold mb-2">
                <span className="text-purple-400"> I&#39;m</span>
                <br />

                <Typewriter
                  words={["Dennis Ajulu", "A Fullstack Developer"]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </h3>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 leading-relaxed"
            >
              A passionate Computer Scientist and Full-Stack Developer with a
              strong focus on crafting dynamic and user-friendly digital
              experiences. I specialize in Full-Stack development, blending
              creativity with performance optimization to build seamless,
              high-quality web applications. Always eager to learn and push
              boundaries, I strive to create innovative solutions that make an
              impact.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4">
              {/* Download CV Button */}
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-full">
                <Download className="w-4 h-4" />
                Download CV
              </button>

              {/* View Projects Button */}
              <a href="#portfolio">
                <button className="flex items-center gap-2 glass-card hover:bg-white/10 transition-colors px-6 py-3 rounded-full">
                  <ExternalLink className="w-4 h-4" />
                  View Projects
                </button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                {/* Purple glow effect */}
                <div className="absolute inset-0 bg-purple-500/20 -3xl" />
                <Image
                  src="/profile.jpg"
                  alt="Profile"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover relative z-10 hover:scale-110 transition-transform duration-300 ease-in-out"
                />
                
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card rounded-xl p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 glass-card rounded-full">{stat.icon}</div>
                <span className="text-4xl font-bold">{stat.number}</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{stat.title}</h4>
                <p className="text-sm text-gray-400">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
