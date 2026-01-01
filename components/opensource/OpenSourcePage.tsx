"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Github,
  Filter,
  ArrowLeft,
  Search,
  X,
  RefreshCw,
  Download,
} from "lucide-react";

import { PRCardSkeleton } from "./PRCardSkeleton";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { useFilteredPullRequests } from "@/hooks/usePullRequests";
import { PRCard } from "./PRCard";

export function OpenSourcePage() {
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "recent" | "oldest" | "additions" | "commits"
  >("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: pullRequests,
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useFilteredPullRequests({
    repository: selectedRepo,
    searchQuery,
    sortBy,
  });

  // Get unique repositories
  const repositories = [
    "all",
    ...new Set(pullRequests.map((pr) => pr.repository)),
  ];

  const handleExportData = () => {
    const dataStr = JSON.stringify(pullRequests, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `github-contributions-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 via-30% to-purple-500/10 blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Back button */}
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

          {/* OnlyDust Logo */}
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
                  repeat: Infinity,
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
        {loading && !pullRequests.length && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card p-6 rounded-xl space-y-2 animate-pulse"
                >
                  <div className="h-10 w-20 bg-purple-500/10 rounded" />
                  <div className="h-4 w-32 bg-white/5 rounded" />
                </div>
              ))}
            </div>

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
                onClick={() => refetch()}
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
            {/* Analytics Dashboard */}
            <AnalyticsDashboard />

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-xl mb-8 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">Filter & Sort</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-white"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
                    />
                    {isRefetching ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/50 hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-400/50 transition-colors placeholder:text-gray-500"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Repository Filter */}
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-2 block">
                    Repository
                  </label>
                  <select
                    value={selectedRepo}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-400/50 transition-colors"
                  >
                    {repositories.map((repo) => (
                      <option key={repo} value={repo} className="bg-gray-900">
                        {repo === "all" ? "All Repositories" : repo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-400/50 transition-colors"
                  >
                    <option value="recent" className="bg-gray-900">
                      Most Recent
                    </option>
                    <option value="oldest" className="bg-gray-900">
                      Oldest First
                    </option>
                    <option value="additions" className="bg-gray-900">
                      Most Additions
                    </option>
                    <option value="commits" className="bg-gray-900">
                      Most Commits
                    </option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="text-purple-400 font-semibold">
                    {pullRequests.length}
                  </span>{" "}
                  contribution{pullRequests.length !== 1 ? "s" : ""}
                  {selectedRepo !== "all" && (
                    <>
                      {" "}
                      in{" "}
                      <span className="text-blue-400 font-semibold">
                        {selectedRepo}
                      </span>
                    </>
                  )}
                  {searchQuery && (
                    <>
                      {" "}
                      matching{" "}
                      <span className="text-green-400 font-semibold">
                        "{searchQuery}"
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
              <AnimatePresence mode="popLayout">
                {pullRequests.map((pr, index) => (
                  <PRCard key={pr.id} pr={pr} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty Filter Results */}
            {pullRequests.length === 0 && (
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
                      setSearchQuery("");
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
        {!loading &&
          !error &&
          pullRequests.length === 0 &&
          !searchQuery &&
          selectedRepo === "all" && (
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
