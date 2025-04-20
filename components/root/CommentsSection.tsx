"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AllComments from "./AllComments";
import { CommentForm } from "./CommentForm";
import { useComments } from "@/hooks/useComments";

export function CommentsSection() {
  const { data: comments, isPending: isGettingLength } = useComments();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5" />
            Comments{" "}
            {isGettingLength ? (
              <span className="text-gray-400 text-sm flex items-center">
                (
                <motion.div
                  className="h-4 w-8 bg-purple-500/20 rounded-md overflow-hidden relative"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full bg-purple-400/30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.2,
                      ease: "linear",
                    }}
                  />
                </motion.div>
                )
              </span>
            ) : comments?.length === 0 ? (
              <motion.span
                className="text-gray-400 text-sm flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    repeatType: "reverse",
                  }}
                  className="text-purple-400"
                >
                  (be the first!)
                </motion.span>
              </motion.span>
            ) : (
              <span className="text-gray-400 text-sm">
                ({comments?.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <CommentForm />

          {/* Comments List */}
          <AllComments />
        </CardContent>
      </Card>
    </motion.div>
  );
}
