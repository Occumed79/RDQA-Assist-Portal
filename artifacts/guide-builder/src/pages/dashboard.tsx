import React from "react";
import { useGetGuideStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, ListOrdered, Tag, Clock, ArrowRight, Wand2, Sparkles, ShieldCheck, FileQuestion, ClipboardList, MessageSquareText, Gauge, Users, UploadCloud, PanelTop } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { FloatingSparkleField, MiniSparkle } from "@/components/characters/KurzgesagtBird";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetGuideStats();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 glass-panel rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 glass-panel rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] glass-panel rounded-xl" />
      </div>
    );
  }

  const overviewStats = [
    { label: "Total Guides", value: stats?.totalGuides || 0, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "rgba(59,130,246,0.2)" },
    { label: "Total Steps", value: stats?.totalSteps || 0, icon: ListOrdered, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "rgba(16,185,129,0.2)" },
    { label: "Categories", value: Object.keys(stats?.categoryCounts || {}).length, icon: Tag, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "rgba(245,158,11,0.2)" },
  ];

  const rdqaTools = [
    { title: "Portal Home", description: "Entry point for employees and applicants.", icon: PanelTop, href: "/rdqa" },
    { title: "Condition Pages", description: "Plain-English pages for common RDQA conditions.", icon: FileQuestion, href: "/rdqa/conditions" },
    { title: "Document Checklist", description: "Track missing items before review.", icon: ClipboardList, href: "/rdqa/checklist" },
    { title: "Provider Letter Generator", description: "Draft condition-specific provider instructions.", icon: MessageSquareText, href: "/rdqa/provider-letter" },
    { title: "Upload & QA", description: "Guide applicants through clean submissions.", icon: UploadCloud, href: "/scribe" },
    { title: "Readiness Score", description: "Surface whether a case is review-ready.", icon: Gauge, href: "/rdqa/readiness" },
    { title: "Applicant Timeline", description: "Show RDQA status and next steps.", icon: Users, href: "/rdqa/timeline" },
    { title: "Client Reporting", description: "Turn RDQA work into premium analytics.", icon: ShieldCheck, href: "/rdqa/reporting" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero banner — Kurzgesagt style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, rgba(12,22,45,0.95) 0%, rgba(8,14,30,0.98) 100%)" }}
      >
        <FloatingSparkleField count={12} />

        {/* Background glow orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-amber-500/8 rounded-full blur-[80px] translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400/80 text-sm font-semibold tracking-widest uppercase">Occu-Med RDQA Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
              Support Applicants,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Reduce Hand-Holding
              </span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed max-w-lg">
              Standardize RDQA guidance, surface next steps, and package the service as a premium Occu-Med offering.
            </p>
            <div className="flex gap-3 mt-5 justify-center md:justify-start flex-wrap">
              <Link href="/rdqa">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open Portal
                </motion.button>
              </Link>
              <Link href="/rdqa/provider-letter">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <MessageSquareText className="w-4 h-4" />
                  Generate Letter
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {overviewStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden"
              style={{ boxShadow: `0 8px 32px ${stat.glow}, 0 0 0 1px rgba(255,255,255,0.05)` }}
            >
              <div className={`p-3.5 rounded-xl ${stat.bg} border ${stat.border} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-panel rounded-3xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70 mb-1">RDQA Portal Tools</p>
            <h2 className="text-2xl font-bold text-white">Helpful tools for Occu-Med employees and applicants</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/40">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-sm">Fast guide creation</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rdqaTools.map((tool, i) => (
            <Link key={tool.title} href={tool.href}>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="glass-panel glass-panel-hover rounded-2xl p-4 h-full border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                    <tool.icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{tool.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed mt-1">{tool.description}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Guides */}
        <motion.div
          className="col-span-2 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Guides
            </h2>
            <Link href="/guides" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentGuides?.map((guide, i) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <Link href={`/guides/${guide.id}`} className="block">
                  <Card className="glass-panel glass-panel-hover p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white truncate max-w-md">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                        {guide.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
                        {guide.category}
                      </span>
                      <span className="text-xs">{format(new Date(guide.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
            {(!stats?.recentGuides || stats.recentGuides.length === 0) && (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4">
                <p className="text-muted-foreground">No guides yet. Start with an RDQA portal page.</p>
                <Link href="/rdqa" className="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                  Open portal
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {/* AutoScribe promo card */}
          <div className="relative glass-panel rounded-2xl p-5 border border-amber-500/20 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(120,60,0,0.15) 0%, rgba(10,18,38,0.9) 100%)" }}
          >
            <div className="absolute top-2 right-2 pointer-events-none">
              <MiniSparkle x={0} y={0} delay={0} color="#f59e0b" />
              <MiniSparkle x={15} y={20} delay={0.8} color="#fbbf24" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <p className="font-bold text-amber-300 text-sm">AutoScribe</p>
                <p className="text-xs text-white/40">AI-powered guide generator</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-3">
              Upload screenshots of any process — Gemini Vision writes your guide automatically.
            </p>
            <Link href="/scribe">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Wand2 className="w-3 h-3" />
                Try AutoScribe
              </motion.button>
            </Link>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white px-1 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              Categories
            </h2>
            <Card className="glass-panel p-5 rounded-xl space-y-4">
              {Object.entries(stats?.categoryCounts || {}).length > 0 ? (
                Object.entries(stats!.categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-white/80 font-medium text-sm">{category}</span>
                    </div>
                    <span className="text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md text-xs border border-white/10">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No categories yet.</p>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
