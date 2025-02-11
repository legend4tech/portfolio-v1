"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function Hero() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full relative overflow-hidden group"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm relative z-10">Ready to Innovate</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/70 to-blue-500/0 group-hover:animate-shine" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                FullStack
                <br />
                <span className="gradient-text">Developer</span>
              </h1>
              <p className="text-xl text-gray-400">
                <Typewriter
                  words={["Tech Enthusiast", "Computer Scientist"]}
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
              {["React", "Javascript", "Node.js", "Tailwind"].map((tech) => (
                <span
                  key={tech}
                  className="glass-card px-4 py-2 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <a
                href="#portfolio"
                className="glass-card px-6 py-3 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                Projects
                <ExternalLink className="w-4 h-4" />{" "}
              </a>
              <a
                href="#contact"
                className="glass-card px-6 py-3 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                Contact
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-square max-w-2xl mx-auto"
          >
            <DotLottieReact
              src="https://lottie.host/d35da9a7-96ed-4f5a-9916-f6bb3fdb84f5/qwazBY4n6Z.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
