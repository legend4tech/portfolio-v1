"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  GitPullRequest,
  Tag,
  CheckCircle2,
  GitBranch,
  FileCode,
  Plus,
  Minus,
  GitCommit,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RelativeTime } from "../RelativeTime";
import type { GitHubPRResponse } from "@/hooks/usePullRequests";
import Image from "next/image";

interface PRCardProps {
  pr: GitHubPRResponse;
  index: number;
}

export function PRCard({ pr, index }: PRCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const impactScore =
    (pr.additions || 0) +
    (pr.deletions || 0) +
    (pr.commits || 0) * 10 +
    pr.closedIssues.length * 50;

  const getImpactLevel = (score: number) => {
    if (score > 500) return { label: "Major", color: "text-purple-400" };
    if (score > 200) return { label: "Medium", color: "text-blue-400" };
    return { label: "Minor", color: "text-green-400" };
  };

  const impact = getImpactLevel(impactScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative glass-card rounded-xl p-6 space-y-4 hover:border-purple-400/50 border border-white/10 transition-all overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="mt-1 p-2 rounded-lg bg-purple-500/10 flex-shrink-0 group-hover:bg-purple-500/20 transition-colors"
            >
              <GitPullRequest className="w-5 h-5 text-purple-400" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <Link
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:text-purple-400 transition-colors line-clamp-2 block break-words group-hover:text-purple-300"
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
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          </motion.div>
        </div>

        {/* Impact Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
        >
          <Sparkles className={`w-3 h-3 ${impact.color}`} />
          <span className={`text-xs font-semibold ${impact.color}`}>
            {impact.label} Impact
          </span>
          <span className="text-xs text-gray-500">({impactScore} pts)</span>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20"
          >
            <Plus className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-mono">
              +{pr.additions || 0}
            </span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20"
          >
            <Minus className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400 font-mono">
              -{pr.deletions || 0}
            </span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20"
          >
            <GitCommit className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">
              {pr.commits || 0}
            </span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20"
          >
            <FileCode className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-orange-400 font-mono">
              {pr.changedFiles || 0}
            </span>
          </motion.div>
        </div>

        {/* Description */}
        {pr.description && !isExpanded && (
          <p className="text-gray-400 text-sm line-clamp-2 break-words">
            {pr.description.split("\n")[0]}
          </p>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Full Description */}
              {pr.description && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-gray-400 text-sm whitespace-pre-wrap break-words">
                    {pr.description}
                  </p>
                </div>
              )}

              {/* Reviewers */}
              {pr.reviewers && pr.reviewers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>Reviewers:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pr.reviewers.map((reviewer) => (
                      <motion.div
                        key={reviewer.login}
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                      >
                        {!imageError && reviewer.avatarUrl ? (
                          <Image
                            src={reviewer.avatarUrl}
                            alt={reviewer.login}
                            width={16}
                            height={16}
                            className="rounded-full"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-purple-500/20" />
                        )}
                        <span className="text-xs text-gray-400">
                          {reviewer.login}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Labels */}
        {pr.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pr.labels.slice(0, isExpanded ? undefined : 5).map((label) => (
              <motion.span
                key={label.name}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs break-words"
                style={{
                  backgroundColor: `#${label.color}20`,
                  color: `#${label.color}`,
                  border: `1px solid #${label.color}40`,
                }}
              >
                <Tag className="w-3 h-3 flex-shrink-0" />
                <span className="break-words">{label.name}</span>
              </motion.span>
            ))}
            {!isExpanded && pr.labels.length > 5 && (
              <span className="text-xs text-gray-500 flex items-center">
                +{pr.labels.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Closed Issues */}
        {pr.closedIssues.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              Closed Issues ({pr.closedIssues.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {pr.closedIssues.map((issue) => (
                <Link
                  key={issue.number}
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors cursor-pointer"
                  >
                    #{issue.number}
                    <ExternalLink className="w-3 h-3" />
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-white/5">
          <span className="flex items-center gap-1">
            Merged{" "}
            {pr.mergedAt ? (
              <RelativeTime date={pr.mergedAt} />
            ) : (
              <span className="text-sm text-gray-400">recently</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  More
                </>
              )}
            </motion.button>
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
        </div>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.1), transparent 40%)",
        }}
      />
    </motion.div>
  );
}
