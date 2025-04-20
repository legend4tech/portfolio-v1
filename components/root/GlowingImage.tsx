"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GlowingImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function GlowingImage({ src, alt, width, height }: GlowingImageProps) {
  return (
    <div className="aspect-square max-w-md mx-auto">
      <div className="w-full h-full rounded-full relative flex items-center justify-center">
        {/* Strong outer glow */}
        <motion.div
          className="absolute w-[110%] h-[110%] rounded-full blur-md"
          style={{
            background:
              "radial-gradient(circle at center, rgba(168, 85, 247, 0.6) 0%, rgba(168, 85, 247, 0) 70%)",
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Pulsing glow ring */}
        <motion.div
          className="absolute w-[100%] h-[100%] rounded-full"
          style={{ border: "2px solid rgba(168, 85, 247, 0.3)" }}
          animate={{
            boxShadow: [
              "0 0 15px 5px rgba(168, 85, 247, 0.4)",
              "0 0 25px 10px rgba(168, 85, 247, 0.6)",
              "0 0 15px 5px rgba(168, 85, 247, 0.4)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden z-20 opacity-30"
          style={{
            background:
              "linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.8) 45%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Image container with subtle border */}
        <div
          className="w-[90%] h-[90%] rounded-full overflow-hidden relative z-10 group"
          style={{ boxShadow: "0 0 0 1px rgba(168, 85, 247, 0.2)" }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}
