import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { User, Briefcase, Clock, CheckCircle2, AlertCircle, Circle, Search, Filter } from "lucide-react";

type StatusType = "Pending Applicant" | "Pending Provider" | "Under Review" | "Awaiting SME" | "Complete" | "On Hold";

interface CaseRecord {
  id: string;
  applicant: string;
  employer: string;
  jobTitle: string;
  condition: string;
  status: StatusType;
  stage: number;
  deadline: string;
  daysLeft: number;
  analyst: string;
}

const mockCases: CaseRecord[] = [
  { id: "RDQA-2026-001", applicant: "Maria G.", employer: "County Parks", jobTitle: "Recreation Aide", condition: "Hypertension", status: "Pending Applicant", stage: 2, deadline: "May 15, 2026", daysLeft: 7, analyst: "J. Doe" },
  { id: "RDQA-2026-002", applicant: "James T.", employer: "City Schools", jobTitle: "Custodian", condition: "Elevated A1c", status: "Pending Provider", stage: 3, deadline: "May 20, 2026", daysLeft: 12, analyst: "S. Kim" },
  { id: "RDQA-2026-003", applicant: "Linda R.", employer: "Port Authority", jobTitle: "Security Officer", condition: "Sleep Apnea", status: "Under Review", stage: 5, deadline: "May 12, 2026", daysLeft: 4, analyst: "J. Doe" },
  { id: "RDQA-2026-004", applicant: "Carlos M.", employer: "Transit Dept.", jobTitle: "Bus Operator", condition: "Cardiac History", status: "Awaiting SME", stage: 6, deadline: "May 18, 2026", daysLeft: 10, analyst: "A. Patel" },
  { id: "RDQA-2026-005", applicant: "Susan W.", employer: "County Parks", jobTitle: "Lifeguard", condition: "Asthma", status: "Complete", stage: 8, deadline: "May 5, 2026", daysLeft: 0, analyst: "S. Kim" },
  { id: "RDQA-2026-006", applicant: "Derek H.", employer: "City Library", jobTitle: "Librarian", condition: "Behavioral Health", status: "On Hold", stage: 2, deadline: "May 25, 2026", daysLeft: 17, analyst: "A. Patel" },
];

const statusConfig: Record<StatusType, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  "Pending Applicant": { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25", icon: Clock },
  "Pending Provider": { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/25", icon: Clock },
  "Under Review": { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/25", icon: Search },
  "Awaiting SME": { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/25", icon: User },
  "Complete": { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", icon: CheckCircle2 },
  "On Hold": { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/25", icon: AlertCircle },
};

const stages = ["Issued", "Notified", "Packet", "Appt.", "Docs", "EQA Review", "SME", "Final"];

export default function RdqaStatusPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = mockCases.filter((c) => {
    const matchSearch =
      c.applicant.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.condition.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = mockCases.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">Case Status</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Real-time visibility into RDQA case status for employees, applicants, and analysts. Showing {mockCases.length} active cases.
        </p>
      </motion.div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...Object.keys(statusConfig)] as string[]).map((s) => {
          const count = s === "All" ? mockCases.length : statusCounts[s] || 0;
          const cfg = s !== "All" ? statusConfig[s as StatusType] : null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === s
                  ? cfg ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "bg-white/15 border-white/25 text-white"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8"
              }`}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400/50 transition-all"
          placeholder="Search by name, case ID, or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Case Cards */}
      <div className="space-y-3">
        {filtered.map((c, i) => {
          const cfg = statusConfig[c.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white/50" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{c.applicant}</span>
                        <span className="text-xs text-white/30">{c.id}</span>
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">
                        {c.jobTitle} &middot; {c.employer} &middot; {c.condition}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {c.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg border ${
                      c.daysLeft <= 5 && c.status !== "Complete"
                        ? "bg-red-500/10 border-red-500/25 text-red-400"
                        : "bg-white/5 border-white/10 text-white/50"
                    }`}>
                      {c.status === "Complete" ? "Closed" : `${c.daysLeft}d left`}
                    </span>
                    <span className="text-xs text-white/30">Analyst: {c.analyst}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between mb-1.5">
                    {stages.map((stage, idx) => (
                      <span
                        key={stage}
                        className={`text-[9px] font-medium ${
                          idx + 1 <= c.stage ? "text-white/60" : "text-white/20"
                        }`}
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                  <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.stage / stages.length) * 100}%` }}
                      transition={{ delay: i * 0.04 + 0.2, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        c.status === "Complete" ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass-panel rounded-2xl p-8 text-center text-white/40">
            No cases match your search.
          </div>
        )}
      </div>
    </div>
  );
}