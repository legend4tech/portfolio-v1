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
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RelativeTime } from "../RelativeTime";
import type { GitHubPRResponse } from "@/hooks/usePullRequests";
import { FEATURED_REPOS } from "@/hooks/usePullRequests";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PRCardProps {
  pr: GitHubPRResponse;
  index: number;
}

export function PRCard({ pr, index }: PRCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFeatured = FEATURED_REPOS.has(pr.repositoryUrl);

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className={`group relative glass-card rounded-xl p-6 space-y-4 border transition-all overflow-hidden
          ${
            isFeatured
              ? "border-yellow-500/40 hover:border-yellow-400/70 shadow-lg shadow-yellow-500/10"
              : "border-white/10 hover:border-purple-400/50"
          }`}
      >
        {/* ── Featured: static gold background ── */}
        {isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-amber-400/4 to-orange-500/8 pointer-events-none" />
        )}

        {/* ── Featured: animated shimmer sweep ── */}
        {isFeatured && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
            <motion.div
              animate={{ x: ["-150%", "250%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 4,
              }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-yellow-300/15 to-transparent skew-x-12"
            />
          </div>
        )}

        {/* ── Non-featured: hover gradient ── */}
        {!isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}

        {/* ── Featured badge pinned to top edge ── */}
        {isFeatured && (
          <div className="absolute -top-px left-0 right-0 flex justify-center pointer-events-none z-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-b-lg bg-gradient-to-r from-yellow-500 to-amber-400 shadow-md shadow-yellow-500/30">
              <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
              <span className="text-xs font-bold text-yellow-900 tracking-wide uppercase">
                Featured Contribution
              </span>
              <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`relative z-10 space-y-4 ${isFeatured ? "mt-4" : ""}`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className={`mt-1 p-2 rounded-lg flex-shrink-0 transition-colors
                  ${
                    isFeatured
                      ? "bg-yellow-500/15 group-hover:bg-yellow-500/25"
                      : "bg-purple-500/10 group-hover:bg-purple-500/20"
                  }`}
              >
                <GitPullRequest
                  className={`w-5 h-5 ${isFeatured ? "text-yellow-400" : "text-purple-400"}`}
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <Link
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-lg font-semibold transition-colors line-clamp-2 block break-words
                    ${
                      isFeatured
                        ? "hover:text-yellow-400 group-hover:text-yellow-300"
                        : "hover:text-purple-400 group-hover:text-purple-300"
                    }`}
                >
                  {pr.title}
                </Link>
                <Link
                  href={pr.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-400 transition-colors mt-1 inline-flex items-center gap-1
                    ${isFeatured ? "hover:text-yellow-400" : "hover:text-purple-400"}`}
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
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${isFeatured ? "text-yellow-400" : "text-green-400"}`}
              />
            </motion.div>
          </div>

          {/* Impact Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border
              ${
                isFeatured
                  ? "bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border-yellow-500/30"
                  : "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20"
              }`}
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

          {/* Description preview — always 2 lines, never grows */}
          {pr.description && (
            <p className="text-gray-400 text-sm line-clamp-2 break-words">
              {pr.description.split("\n")[0]}
            </p>
          )}

          {/* Labels — always max 3 shown */}
          {pr.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pr.labels.slice(0, 3).map((label) => (
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
              {pr.labels.length > 3 && (
                <span className="text-xs text-gray-500 flex items-center">
                  +{pr.labels.length - 3} more
                </span>
              )}
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
              {/* "More" now opens modal instead of inline expand */}
              {(pr.description ||
                (pr.reviewers && pr.reviewers.length > 0) ||
                pr.closedIssues.length > 0 ||
                pr.labels.length > 3) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className={`inline-flex items-center gap-1 transition-colors
                    ${
                      isFeatured
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-purple-400 hover:text-purple-300"
                    }`}
                >
                  More
                </motion.button>
              )}
              <Link
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 transition-colors
                  ${
                    isFeatured
                      ? "text-yellow-400 hover:text-yellow-300"
                      : "text-purple-400 hover:text-purple-300"
                  }`}
              >
                View PR
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: isFeatured
              ? "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(234, 179, 8, 0.08), transparent 40%)"
              : "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.1), transparent 40%)",
          }}
        />
      </motion.div>

      {/* ── Detail Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-950 border border-white/10 text-white">
          <DialogHeader>
            <div className="flex items-start gap-3 pr-8">
              <div
                className={`mt-1 p-2 rounded-lg flex-shrink-0
                  ${isFeatured ? "bg-yellow-500/15" : "bg-purple-500/10"}`}
              >
                <GitPullRequest
                  className={`w-5 h-5 ${isFeatured ? "text-yellow-400" : "text-purple-400"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-semibold leading-snug text-white">
                  {pr.title}
                </DialogTitle>
                <Link
                  href={pr.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-400 mt-1 inline-flex items-center gap-1
                    ${isFeatured ? "hover:text-yellow-400" : "hover:text-purple-400"}`}
                >
                  <GitBranch className="w-3 h-3" />
                  {pr.repository}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                <Plus className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-mono">
                  +{pr.additions || 0}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                <Minus className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400 font-mono">
                  -{pr.deletions || 0}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                <GitCommit className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-mono">
                  {pr.commits || 0} commits
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                <FileCode className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-400 font-mono">
                  {pr.changedFiles || 0} files
                </span>
              </div>
            </div>

            {/* Full Description */}
            {pr.description && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Description
                </p>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {pr.description}
                  </p>
                </div>
              </div>
            )}

            {/* All Labels */}
            {pr.labels.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Labels
                </p>
                <div className="flex flex-wrap gap-2">
                  {pr.labels.map((label) => (
                    <span
                      key={label.name}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                      style={{
                        backgroundColor: `#${label.color}20`,
                        color: `#${label.color}`,
                        border: `1px solid #${label.color}40`,
                      }}
                    >
                      <Tag className="w-3 h-3 flex-shrink-0" />
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviewers */}
            {pr.reviewers && pr.reviewers.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Reviewers
                </p>
                <div className="flex flex-wrap gap-2">
                  {pr.reviewers.map((reviewer) => (
                    <div
                      key={reviewer.login}
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Closed Issues */}
            {pr.closedIssues.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1">
                  <FileCode className="w-3 h-3" />
                  Closed Issues ({pr.closedIssues.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {pr.closedIssues.map((issue) => (
                    <Link
                      key={issue.number}
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors cursor-pointer">
                        #{issue.number}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                Merged{" "}
                {pr.mergedAt ? <RelativeTime date={pr.mergedAt} /> : "recently"}
              </span>
              <Link
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isFeatured
                      ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 border border-yellow-500/30"
                      : "bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border border-purple-500/30"
                  }`}
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
