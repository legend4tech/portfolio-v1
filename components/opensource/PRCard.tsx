"use client"

import { motion } from "framer-motion"
import { ExternalLink, GitPullRequest, Tag, CheckCircle2, GitBranch, FileCode } from "lucide-react"
import Link from "next/link"
import type { GitHubPRDisplay } from "@/types/portfolioTypes"
import { RelativeTime } from "../RelativeTime"

interface PRCardProps {
  pr: GitHubPRDisplay
  index: number
}

export function PRCard({ pr, index }: PRCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-xl p-6 space-y-4 hover:border-purple-400/50 border border-transparent transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-1 p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
            <GitPullRequest className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold hover:text-purple-400 transition-colors line-clamp-2 block break-words"
            >
              {pr.title}
            </Link>
            <Link
              href={pr.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors mt-1 inline-flex items-center gap-1"
            >
              <GitBranch className="w-3 h-3" />
              {pr.repository}
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
      </div>

      {/* Description - Added break-words and proper text wrapping */}
      {pr.description && (
        <p className="text-gray-400 text-sm line-clamp-3 break-words">{pr.description.split("\n")[0]}</p>
      )}

      {/* Labels */}
      {pr.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pr.labels.slice(0, 5).map((label) => (
            <span
              key={label.name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs break-words"
              style={{
                backgroundColor: `#${label.color}20`,
                color: `#${label.color}`,
                border: `1px solid #${label.color}40`,
              }}
            >
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span className="break-words">{label.name}</span>
            </span>
          ))}
          {pr.labels.length > 5 && <span className="text-xs text-gray-500">+{pr.labels.length - 5} more</span>}
        </div>
      )}

      {/* Closed Issues */}
      {pr.closedIssues.length > 0 && (
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            Closed Issues:
          </p>
          <div className="flex flex-wrap gap-2">
            {pr.closedIssues.map((issue) => (
              <Link
                key={issue.number}
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
              >
                #{issue.number}
                <ExternalLink className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-white/5">
        <span className="flex items-center gap-1">
          Merged{" "}
          {pr.mergedAt ? <RelativeTime date={pr.mergedAt} /> : <span className="text-sm text-gray-400">recently</span>}
        </span>
        <Link
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
        >
          View PR
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  )
}
