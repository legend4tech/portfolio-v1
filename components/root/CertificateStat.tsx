"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useCertificates } from "@/hooks/useCertificates";
import { CounterAnimation } from "./CounterAnimation";

export function CertificateStat() {
  const { data: certificates, isLoading } = useCertificates();
  const certificateCount = certificates?.length || 0;

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
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="glass-card rounded-xl p-6 space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 glass-card rounded-full">
          <Award className="w-6 h-6" />
        </div>
        <div className="text-4xl font-bold">
          {isLoading ? (
            <div className="w-16 h-10 bg-gray-700 rounded animate-pulse" />
          ) : (
            <CounterAnimation target={certificateCount} />
          )}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-1">CERTIFICATES</h4>
        <p className="text-sm text-gray-400">Professional skills validated</p>
      </div>
    </motion.div>
  );
}
