"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function InnovativeButton() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full group"
    >
      {/* Base gradient background */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 opacity-90"></span>

      {/* Glow effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 blur-[6px] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>

      {/* Inner shadow for depth */}
      <span className="absolute inset-[1.5px] rounded-full bg-gradient-to-br from-white/10 to-transparent"></span>

      {/* Animated border */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className="absolute inset-[-2px] bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 opacity-70 animate-slowSpin"></span>
      </span>

      {/* Shine effect - performant because it only uses transform */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></span>
      </span>

      {/* Sparkle icon with subtle animation */}
      <motion.span
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        <Sparkles className="w-5 h-5 text-white drop-shadow-glow" />
      </motion.span>

      {/* Text with subtle shadow for better readability */}
      <span className="text-sm font-medium text-white relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
        Ready to Innovate
      </span>
    </motion.button>
  );
}
