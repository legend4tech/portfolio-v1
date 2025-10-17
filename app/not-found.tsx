"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { Sparkles, Home, ArrowRight, Star } from "lucide-react";

export default function NotFound() {
  const stars = [
    { top: "10%", left: "5%", delay: "0s", size: 16 },
    { top: "15%", right: "8%", delay: "0.5s", size: 12 },
    { top: "35%", left: "3%", delay: "1s", size: 14 },
    { top: "50%", right: "5%", delay: "1.5s", size: 16 },
    { top: "70%", left: "8%", delay: "0.8s", size: 12 },
    { top: "75%", right: "10%", delay: "1.2s", size: 14 },
    { top: "85%", left: "12%", delay: "0.3s", size: 16 },
    { top: "80%", right: "3%", delay: "1.8s", size: 12 },
    { top: "25%", left: "15%", delay: "0.4s", size: 10 },
    { top: "60%", right: "15%", delay: "1.3s", size: 10 },
    { top: "45%", left: "20%", delay: "0.9s", size: 14 },
    { top: "20%", right: "20%", delay: "1.7s", size: 12 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute opacity-0"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            animation: `twinkle 3s ease-in-out ${star.delay} infinite`,
          }}
        >
          <Star
            size={star.size}
            className="text-cyan-400 fill-cyan-400"
            style={{
              filter: "drop-shadow(0 0 6px rgba(34, 211, 238, 0.8))",
            }}
          />
        </div>
      ))}

      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-6 md:gap-12 relative z-10">
        <div className="w-full h-64 md:h-96 flex justify-center animate-float">
          <DotLottieReact
            src="https://lottie.host/3f61778c-4acf-4f8b-b314-f8e2031633ac/jZnDNr3zgW.lottie"
            loop
            autoplay
          />
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <h1 className="relative text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center px-4 py-2">
            <Sparkles
              className="inline-block mr-2 mb-1 text-cyan-400"
              size={32}
            />
            Page Not Found
            <Sparkles
              className="inline-block ml-2 mb-1 text-purple-400"
              size={32}
            />
          </h1>
        </div>

        <p className="text-gray-400 text-center text-lg md:text-xl max-w-md">
          The page you&apos;re looking for has drifted into deep space
        </p>

        {/* Futuristic button */}
        <Link
          href="/"
          className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold text-lg md:text-xl rounded-xl transition-all duration-300 transform hover:scale-105 overflow-hidden glow-button"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative flex items-center gap-2">
            <Home size={24} />
            Return Home
            <ArrowRight
              size={24}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </span>
        </Link>

        {/* Additional tech detail */}
        <div className="mt-8 flex gap-2 text-xs md:text-sm text-gray-500 font-mono">
          <span className="px-3 py-1 bg-gray-900/50 border border-gray-800 rounded">
            ERROR_404
          </span>
          <span className="px-3 py-1 bg-gray-900/50 border border-gray-800 rounded">
            RESOURCE_NOT_FOUND
          </span>
        </div>
      </div>
    </div>
  );
}
