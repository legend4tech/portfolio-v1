"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PRCard } from "./PRCard";
import { PRCardSkeleton } from "./PRCardSkeleton";
import { Button } from "../ui/button";
import {
  Github,
  Filter,
  Calendar,
  GitBranch,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { usePullRequests } from "@/hooks/usePullRequests";

export function OpenSourcePage() {
  const {
    data: pullRequests = [],
    isLoading: loading,
    error,
  } = usePullRequests();
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");

  // Get unique repositories
  const repositories = [
    "all",
    ...new Set(pullRequests.map((pr) => pr.repository)),
  ];

  // Filter and sort PRs
  const filteredPRs = pullRequests
    .filter((pr) => selectedRepo === "all" || pr.repository === selectedRepo)
    .sort((a, b) => {
      const dateA = new Date(a.mergedAt).getTime();
      const dateB = new Date(b.mergedAt).getTime();
      return sortBy === "recent" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 via-30% to-purple-500/10 blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:border-purple-400/50 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
              Back to Home
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-8"
        >
          <Link
            href="/#opensource"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 hover:border-purple-400/50 transition-colors"
          >
            <Github className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">
              Open Source Contributions
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative glass-card p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 bg-black/40 backdrop-blur-xl"
            >
              <Image
                src="/onlydust-logo.png"
                alt="OnlyDust Logo"
                width={96}
                height={96}
                className="w-24 h-24 object-contain"
                priority
              />
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                    "0 0 40px rgba(168, 85, 247, 0.5)",
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
              />
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              OnlyDust Contributions
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              A comprehensive view of my open source journey. Every pull request
              represents a contribution to the ecosystem, solving real problems
              and building innovative solutions.
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <>
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-xl space-y-2">
                  <Skeleton className="h-10 w-20 bg-purple-500/10" />
                  <Skeleton className="h-4 w-32 bg-white/5" />
                </div>
              ))}
            </div>

            {/* Filters Skeleton */}
            <div className="glass-card p-6 rounded-xl mb-8 space-y-4">
              <Skeleton className="h-6 w-32 bg-white/10" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-40 bg-white/5" />
                <Skeleton className="h-10 w-40 bg-white/5" />
              </div>
            </div>

            {/* PRs Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <PRCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
              <p className="text-red-400 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to fetch pull requests"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && pullRequests.length > 0 && (
          <>
            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-400">
                    {pullRequests.length}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Total Pull Requests</div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <GitBranch className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    {new Set(pullRequests.map((pr) => pr.repository)).size}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Repositories</div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Github className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {pullRequests.reduce(
                      (acc, pr) => acc + pr.closedIssues.length,
                      0,
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Issues Closed</div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-400">
                    {pullRequests.reduce(
                      (acc, pr) => acc + pr.labels.length,
                      0,
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Total Labels</div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-xl mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">Filter & Sort</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Repository Filter */}
                  <select
                    value={selectedRepo}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-400/50 transition-colors"
                  >
                    {repositories.map((repo) => (
                      <option key={repo} value={repo} className="bg-gray-900">
                        {repo === "all" ? "All Repositories" : repo}
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "recent" | "oldest")
                    }
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-400/50 transition-colors"
                  >
                    <option value="recent" className="bg-gray-900">
                      Most Recent
                    </option>
                    <option value="oldest" className="bg-gray-900">
                      Oldest First
                    </option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="text-purple-400 font-semibold">
                    {filteredPRs.length}
                  </span>{" "}
                  contribution
                  {filteredPRs.length !== 1 ? "s" : ""}
                  {selectedRepo !== "all" && (
                    <>
                      {" "}
                      in{" "}
                      <span className="text-blue-400 font-semibold">
                        {selectedRepo}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </motion.div>

            {/* PRs Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPRs.map((pr, index) => (
                <PRCard key={pr.id} pr={pr} index={index} />
              ))}
            </motion.div>

            {/* Empty Filter Results */}
            {filteredPRs.length === 0 && (
              <div className="text-center py-20">
                <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
                  <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    No contributions found with the selected filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedRepo("all");
                      setSortBy("recent");
                    }}
                    variant="outline"
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && pullRequests.length === 0 && (
          <div className="text-center py-20">
            <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
              <Github className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No contributions found yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
