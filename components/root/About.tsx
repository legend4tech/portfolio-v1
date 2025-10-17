"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink, Code2, Globe, Sparkles } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { GlowingImage } from "./GlowingImage";
import { handleDownloadResume } from "@/lib/handleDownloadResume";
import { CertificateStat } from "./CertificateStat";

const currentYear = new Date().getFullYear();

// Stats data for the cards (excluding certificates - will be rendered separately)
const stats = [
  {
    icon: <Code2 className="w-6 h-6" />,
    number: "30+",
    title: "TOTAL PROJECTS",
    subtitle: "Innovative web solutions crafted",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    number: currentYear - 2022,
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
    <section
      id="about"
      className="min-h-screen py-20 hero-gradient relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-40 right-0 w-96 h-px bg-gradient-to-l from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute bottom-40 left-0 w-80 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold relative inline-block">
            About Me
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-purple-500/50 rounded-full blur-sm" />
          </h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Transforming Ideas into digital experiences
            <Sparkles className="w-4 h-4 text-purple-400" />
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
                <span className="relative inline-block">
                  <Typewriter
                    words={[
                      "Dennis Ajulu",
                      "A Fullstack Developer",
                      "A Web3 Developer",
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                  <span className="absolute -bottom-1 left-0 w-24 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
                </span>
              </h3>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 leading-relaxed glass-card p-4 rounded-xl border border-white/5"
            >
              A passionate Computer Scientist and Full-Stack Developer with a
              strong focus on crafting dynamic and user-friendly digital
              experiences. I specialize in Full-Stack development, blending
              creativity with performance optimization to build seamless,
              high-quality web applications. I&apos;am also a Web3 developer
              contributing to the decentralized web through open-source
              platforms like OnlyDust. As a Starknet Basecamp 13 Graduate with
              Honours, I&apos;ve actively contributed to ecosystems such as
              Starknet, Stellar, and Aztec, continuously pushing boundaries and
              creating innovative solutions that make an impact. Always eager to
              learn and grow, I strive to build technology that truly matters.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col xxs:flex-row gap-4"
            >
              {/* Download Resume Button */}
              <motion.button
                onClick={handleDownloadResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 transition-all px-6 py-3 rounded-full cursor-pointer shadow-lg hover:shadow-purple-500/50"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </motion.button>

              {/* View Projects Button */}
              <a href="#portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col sm:flex-row items-center gap-2 glass-card hover:bg-white/10 transition-all px-6 py-3 rounded-full w-full border border-white/5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Projects</span>
                </motion.button>
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
            {/* Decorative rings around image */}
            <div
              className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse"
              style={{ animationDuration: "3s" }}
            />
            <div className="absolute inset-4 rounded-full border border-cyan-500/10" />
            <GlowingImage
              src="/profile.jpg"
              alt="Profile"
              width={400}
              height={400}
            />
          </motion.div>
        </div>

        {/* Stats Cards - 3 column layout with certificate in middle */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* First stat card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="stat-card-glow glass-card rounded-xl p-6 space-y-4 border border-white/5 hover:border-purple-500/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 glass-card rounded-full bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                {stats[0].icon}
              </div>
              <span className="text-4xl font-bold bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {stats[0].number}
              </span>
            </div>
            <div>
              <h4 className="font-semibold mb-1">{stats[0].title}</h4>
              <p className="text-sm text-gray-400">{stats[0].subtitle}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CertificateStat />
          </motion.div>

          {/* Second stat card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="stat-card-glow glass-card rounded-xl p-6 space-y-4 border border-white/5 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 glass-card rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                {stats[1].icon}
              </div>
              <span className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stats[1].number}
              </span>
            </div>
            <div>
              <h4 className="font-semibold mb-1">{stats[1].title}</h4>
              <p className="text-sm text-gray-400">{stats[1].subtitle}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
