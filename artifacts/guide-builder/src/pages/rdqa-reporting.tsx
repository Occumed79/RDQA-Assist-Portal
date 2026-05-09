import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BarChart2, Clock, CheckCircle2, AlertCircle, TrendingUp, Users, FileText, AlertTriangle } from "lucide-react";

const statCards = [
  { label: "Total Cases (YTD)", value: "142", delta: "+18 vs last year", positive: true, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Avg. Resolution Time", value: "11.4d", delta: "-2.1d vs last year", positive: true, icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "Cases Closed", value: "118", delta: "83% closure rate", positive: true, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "Pending Action", value: "24", delta: "6 overdue", positive: false, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
];

const conditionBreakdown = [
  { condition: "Hypertension", count: 42, pct: 30 },
  { condition: "Elevated A1c / Diabetes", count: 28, pct: 20 },
  { condition: "Sleep Apnea", count: 21, pct: 15 },
  { condition: "Behavioral Health", count: 18, pct: 13 },
  { condition: "Orthopedic", count: 15, pct: 11 },
  { condition: "Cardiac History", count: 11, pct: 8 },
  { condition: "Asthma", count: 7, pct: 5 },
];

const delayReasons = [
  { reason: "Provider letter incomplete", count: 31, pct: 48 },
  { reason: "Missing lab results", count: 18, pct: 28 },
  { reason: "Applicant non-responsive", count: 9, pct: 14 },
  { reason: "Specialist referral needed", count: 6, pct: 9 },
];

const monthlyData = [
  { month: "Nov", opened: 9, closed: 7 },
  { month: "Dec", opened: 7, closed: 9 },
  { month: "Jan", opened: 14, closed: 11 },
  { month: "Feb", opened: 18, closed: 15 },
  { month: "Mar", opened: 22, closed: 20 },
  { month: "Apr", opened: 19, closed: 21 },
  { month: "May", opened: 12, closed: 8 },
];

const maxBar = Math.max(...monthlyData.map((d) => Math.max(d.opened, d.closed)));

const clientSummary = [
  { client: "County Parks & Recreation", cases: 38, open: 5, avgDays: 10.2, topCondition: "Hypertension" },
  { client: "City Unified School District", cases: 27, open: 4, avgDays: 12.8, topCondition: "Behavioral Health" },
  { client: "Port Authority", cases: 22, open: 6, avgDays: 9.5, topCondition: "Cardiac History" },
  { client: "Transit Department", cases: 31, open: 7, avgDays: 13.1, topCondition: "Sleep Apnea" },
  { client: "City Library System", cases: 24, open: 2, avgDays: 8.7, topCondition: "Orthopedic" },
];

export default function RdqaReportingPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">Client Reporting</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Aggregate analytics across all RDQA cases. Use this to identify trends, common delay reasons, and cases pending action.
        </p>
        <div className="mt-2 text-xs text-white/30">Data shown: Jan 2026 – May 2026 (YTD)</div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`glass-panel p-5 rounded-2xl border ${stat.border} ${stat.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40">{stat.label}</span>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className={`text-xs mt-1 ${stat.positive ? "text-emerald-400/70" : "text-red-400/70"}`}>{stat.delta}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Volume Chart */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 className="w-4 h-4 text-white/40" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Monthly Case Volume</span>
            </div>
            <div className="flex items-end gap-3 h-36">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "112px" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.opened / maxBar) * 100}%` }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex-1 rounded-t-sm bg-blue-400/40"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.closed / maxBar) * 100}%` }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="flex-1 rounded-t-sm bg-emerald-400/40"
                    />
                  </div>
                  <span className="text-[10px] text-white/35">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-400/40" />
                <span className="text-xs text-white/40">Opened</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-400/40" />
                <span className="text-xs text-white/40">Closed</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Condition Breakdown */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-white/40" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Cases by Condition</span>
            </div>
            <div className="space-y-3">
              {conditionBreakdown.map((row) => (
                <div key={row.condition}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{row.condition}</span>
                    <span className="text-white/40">{row.count} ({row.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.pct}%` }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="h-full rounded-full bg-blue-400/60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delay Reasons */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Common Delay Reasons</span>
            </div>
            <div className="space-y-3">
              {delayReasons.map((row) => (
                <div key={row.reason}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{row.reason}</span>
                    <span className="text-white/40">{row.count} cases ({row.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.pct}%` }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="h-full rounded-full bg-amber-400/60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Client Summary Table */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-4 h-4 text-white/40" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">By Client</span>
            </div>
            <div className="space-y-0 divide-y divide-white/8">
              <div className="grid grid-cols-4 gap-2 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 col-span-2">Client</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-center">Cases</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-center">Avg Days</span>
              </div>
              {clientSummary.map((row) => (
                <div key={row.client} className="grid grid-cols-4 gap-2 py-2.5 items-center">
                  <div className="col-span-2">
                    <div className="text-xs text-white/75 font-medium truncate">{row.client}</div>
                    <div className="text-[10px] text-white/35">{row.open} open &middot; {row.topCondition}</div>
                  </div>
                  <span className="text-xs text-white/60 text-center">{row.cases}</span>
                  <span className={`text-xs text-center font-semibold ${ row.avgDays <= 10 ? "text-emerald-400" : row.avgDays <= 12 ? "text-amber-400" : "text-red-400" }`}>{row.avgDays}d</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}