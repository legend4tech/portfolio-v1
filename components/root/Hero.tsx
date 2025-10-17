"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { InnovativeButton } from "./InnovativeButton";

export function Hero() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      {/* Subtle animated accent lines */}
      <div className="absolute top-32 left-0 w-64 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute bottom-32 right-0 w-80 h-px bg-gradient-to-l from-transparent via-purple-500/30 to-transparent" />

      {/* Floating orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-6 lg:pt-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Ready to Innovate Badge */}
            <InnovativeButton />

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                FullStack
                <br />
                <span className="gradient-text relative">
                  Developer
                  {/* Subtle underline glow */}
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-full blur-sm" />
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                <Typewriter
                  words={["Web3 Enthusiast", "Computer Scientist"]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-400 max-w-lg">
              Building innovative, high-performance, and user-centric websites
              for seamless digital experiences.
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-3">
              {["Javascript", "React", "Next.js", "Tailwind"].map((tech) => (
                <span
                  key={tech}
                  className="tech-pill glass-card px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-6 py-3 rounded-full hover:bg-white/10 transition-all inline-flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Projects
                <ExternalLink className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-6 py-3 rounded-full hover:bg-white/10 transition-all inline-flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/20"
              >
                Contact
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-square max-w-2xl mx-auto animate-float"
          >
            {/* Subtle glow behind animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

            <DotLottieReact
              src="https://lottie.host/d0a6bb3e-535f-400d-a51b-951722e46039/QoXZDuIib0.lottie"
              loop
              autoplay
              className="w-full h-full relative z-10"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
