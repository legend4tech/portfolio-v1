"use client"

import { motion } from "framer-motion"
import { PRCard } from "./PRCard"
import { PRCardSkeleton } from "./PRCardSkeleton"
import { Button } from "../ui/button"
import { Github, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePullRequests } from "@/hooks/usePullRequests"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export function OpenSourceSection() {
  const { data: pullRequests = [], isLoading: loading, error } = usePullRequests()

  const displayedPRs = pullRequests.slice(0, 6)

  return (
    <section id="opensource" className="min-h-screen py-20">
      <div className="container mx-auto px-6">
       

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-5  flex-col">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Github className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Open Source Contributions</span>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <Image src="/onlydust-logo.png" alt="OnlyDust" width={40} height={40} className="object-contain" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text">OnlyDust Contributions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            My merged pull requests and contributions to open source projects through OnlyDust. Building in public and
            contributing to the ecosystem.
          </p>
        </motion.div>

        {/* Loading State - Using skeleton loaders */}
        {loading && (
          <>
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-xl text-center space-y-2">
                  <Skeleton className="h-10 w-20 mx-auto bg-purple-500/10" />
                  <Skeleton className="h-4 w-32 mx-auto bg-white/5" />
                </div>
              ))}
            </div>

            {/* PRs Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
                {error instanceof Error ? error.message : "Failed to fetch pull requests"}
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

        {/* PRs Grid */}
        {!loading && !error && pullRequests.length > 0 && (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{pullRequests.length}</div>
                <div className="text-sm text-gray-400">Merged Pull Requests</div>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {new Set(pullRequests.map((pr) => pr.repository)).size}
                </div>
                <div className="text-sm text-gray-400">Repositories</div>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {pullRequests.reduce((acc, pr) => acc + pr.closedIssues.length, 0)}
                </div>
                <div className="text-sm text-gray-400">Issues Closed</div>
              </div>
            </motion.div>

            {/* PRs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPRs.map((pr, index) => (
                <PRCard key={pr.id} pr={pr} index={index} />
              ))}
            </div>

            {/* View More Button - Links to dedicated page */}
            {pullRequests.length > 6 && (
              <div className="mt-12 text-center">
                <Link href="/open-source">
                  <Button
                    variant="outline"
                    className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-white border-purple-500/50 hover:border-purple-400 transition-all group"
                  >
                    View All {pullRequests.length} Contributions
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
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
    </section>
  )
}
