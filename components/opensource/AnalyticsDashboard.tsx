// components/opensource/AnalyticsDashboard.tsx
"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  GitBranch,
  Github,
  Calendar,
  Code,
  GitCommit,
  FileCode,
  Target,
  Activity,
  Award,
} from "lucide-react";
import { usePullRequests } from "@/hooks/usePullRequests";
import { useMemo } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  gradient: string;
  delay?: number;
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-lg ${gradient.replace("bg-gradient-to-br", "bg-gradient-to-br")}`}
          >
            {icon}
          </motion.div>
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 }}
              className="text-3xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent"
            >
              {value}
            </motion.div>
          </div>
        </div>
        <div className="text-sm text-gray-400 font-medium">{label}</div>
        {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

export function AnalyticsDashboard() {
  const {
    data: pullRequests,
    stats,
    isLoading,
    isCached,
    fetchTime,
  } = usePullRequests();

  const analytics = useMemo(() => {
    if (!pullRequests || pullRequests.length === 0) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentPRs = pullRequests.filter(
      (pr) => new Date(pr.mergedAt) >= thirtyDaysAgo
    );

    const weeklyPRs = pullRequests.filter(
      (pr) => new Date(pr.mergedAt) >= sevenDaysAgo
    );

    // Calculate average stats
    const avgAdditions =
      pullRequests.reduce((sum, pr) => sum + (pr.additions || 0), 0) /
      pullRequests.length;
    const avgDeletions =
      pullRequests.reduce((sum, pr) => sum + (pr.deletions || 0), 0) /
      pullRequests.length;
    const avgCommits =
      pullRequests.reduce((sum, pr) => sum + (pr.commits || 0), 0) /
      pullRequests.length;

    // Get most productive day
    const dayFrequency = pullRequests.reduce(
      (acc, pr) => {
        const day = new Date(pr.mergedAt).toLocaleDateString("en-US", {
          weekday: "long",
        });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostProductiveDay = Object.entries(dayFrequency).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      recentActivity: recentPRs.length,
      weeklyActivity: weeklyPRs.length,
      avgAdditions: Math.round(avgAdditions),
      avgDeletions: Math.round(avgDeletions),
      avgCommits: Math.round(avgCommits * 10) / 10,
      mostProductiveDay: mostProductiveDay
        ? `${mostProductiveDay[0]} (${mostProductiveDay[1]} PRs)`
        : "N/A",
      totalCodeChanges: pullRequests.reduce(
        (sum, pr) => sum + (pr.additions || 0) + (pr.deletions || 0),
        0
      ),
    };
  }, [pullRequests]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="glass-card p-6 rounded-xl border border-white/10 animate-pulse"
          >
            <div className="h-10 w-20 bg-purple-500/10 rounded mb-3" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!analytics || !stats) return null;

  return (
    <div className="space-y-6 mb-12">
      {/* Cache status */}
      {isCached && fetchTime && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs"
        >
          <Activity className="w-3 h-3" />
          Cached data • {fetchTime}ms
        </motion.div>
      )}

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
          label="Total Pull Requests"
          value={stats.total || 0}
          subtext={`${analytics.weeklyActivity} this week`}
          gradient="bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          delay={0}
        />
        <StatCard
          icon={<GitBranch className="w-6 h-6 text-blue-400" />}
          label="Repositories"
          value={stats.repositories || 0}
          subtext="Across multiple projects"
          gradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
          delay={0.1}
        />
        <StatCard
          icon={<Github className="w-6 h-6 text-green-400" />}
          label="Issues Closed"
          value={stats.totalIssuesClosed || 0}
          subtext="Problems solved"
          gradient="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
          delay={0.2}
        />
        <StatCard
          icon={<GitCommit className="w-6 h-6 text-orange-400" />}
          label="Total Commits"
          value={stats.totalCommits || 0}
          subtext={`Avg ${analytics.avgCommits} per PR`}
          gradient="bg-gradient-to-br from-orange-500/10 to-red-500/10"
          delay={0.3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Code className="w-6 h-6 text-emerald-400" />}
          label="Lines Added"
          value={`+${stats.totalAdditions?.toLocaleString() || 0}`}
          subtext={`Avg ${analytics.avgAdditions} per PR`}
          gradient="bg-gradient-to-br from-emerald-500/10 to-green-500/10"
          delay={0.4}
        />
        <StatCard
          icon={<FileCode className="w-6 h-6 text-red-400" />}
          label="Lines Deleted"
          value={`-${stats.totalDeletions?.toLocaleString() || 0}`}
          subtext={`Avg ${analytics.avgDeletions} per PR`}
          gradient="bg-gradient-to-br from-red-500/10 to-pink-500/10"
          delay={0.5}
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-yellow-400" />}
          label="Code Changes"
          value={analytics.totalCodeChanges.toLocaleString()}
          subtext="Total impact"
          gradient="bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
          delay={0.6}
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-indigo-400" />}
          label="Most Active"
          value={analytics.mostProductiveDay.split(" ")[0]}
          subtext={analytics.mostProductiveDay}
          gradient="bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
          delay={0.7}
        />
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-6 rounded-xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">
              {analytics.weeklyActivity}
            </div>
            <div className="text-sm text-gray-400">Last 7 days</div>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">
              {analytics.recentActivity}
            </div>
            <div className="text-sm text-gray-400">Last 30 days</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
