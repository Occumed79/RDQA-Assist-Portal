import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, AlertTriangle, Upload, Info, FileText, ChevronDown, ChevronUp } from "lucide-react";

type DocStatus = "Uploaded" | "Pending" | "Missing" | "Not Required";

interface DocItem {
  id: string;
  item: string;
  description: string;
  required: boolean;
  status: DocStatus;
  note?: string;
}

const statusConfig: Record<DocStatus, { color: string; bg: string; border: string; icon: React.ElementType; label: string }> = {
  Uploaded: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", icon: CheckCircle2, label: "Uploaded" },
  Pending: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25", icon: Clock, label: "Pending" },
  Missing: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/25", icon: XCircle, label: "Missing" },
  "Not Required": { color: "text-white/35", bg: "bg-white/5", border: "border-white/10", icon: AlertTriangle, label: "N/A" },
};

const initialDocs: DocItem[] = [
  { id: "rdqa_letter", item: "RDQA letter (original)", description: "The original RDQA letter issued by Occu-Med identifying the conditions requiring follow-up.", required: true, status: "Uploaded" },
  { id: "provider_letter", item: "Provider letter", description: "A written letter from the treating provider responding to each item in the RDQA letter.", required: true, status: "Missing", note: "Must address each bullet point specifically. General letters are not sufficient." },
  { id: "job_functions", item: "Essential job functions document", description: "The job functions document for the specific position, attached to the provider packet.", required: true, status: "Uploaded" },
  { id: "labs", item: "Lab results / diagnostic testing", description: "Relevant lab results (A1c, BMP, urinalysis, etc.) or imaging ordered in connection with the RDQA.", required: true, status: "Pending", note: "Confirm which labs were specifically requested in the RDQA letter." },
  { id: "medication_list", item: "Current medication list", description: "A list of all current medications, including dosages, relevant to the flagged condition.", required: true, status: "Missing" },
  { id: "restrictions", item: "Restrictions / accommodations statement", description: "Provider explicitly states whether restrictions or accommodations are needed for safe job performance.", required: true, status: "Missing", note: "This must be a clear yes/no with specifics if yes." },
  { id: "bp_readings", item: "Clinical blood pressure readings (3+)", description: "At least 3 clinical blood pressure readings taken over at least one week. Required for hypertension cases only.", required: false, status: "Not Required", note: "Home readings are not accepted." },
  { id: "pft", item: "Pulmonary function test (PFT/spirometry)", description: "Results from a pulmonary function test. Required for asthma or respiratory cases.", required: false, status: "Not Required" },
  { id: "cpap_data", item: "CPAP compliance data", description: "CPAP or BiPAP compliance download showing hours per night and AHI on therapy. Required for sleep apnea cases.", required: false, status: "Not Required" },
  { id: "cardiac_testing", item: "Cardiac testing results (EKG, stress test, echo)", description: "Results from recent cardiac testing. Required for cardiac history cases.", required: false, status: "Not Required" },
  { id: "specialist_note", item: "Specialist note (if applicable)", description: "Note from a specialist (cardiologist, pulmonologist, etc.) if one was specifically requested in the RDQA letter.", required: false, status: "Not Required" },
];

const statusCycle: DocStatus[] = ["Missing", "Pending", "Uploaded", "Not Required"];

export default function RdqaChecklistPage() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cycleStatus = (id: string) => {
    setDocs((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;
        const currentIdx = statusCycle.indexOf(doc.status);
        const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
        return { ...doc, status: nextStatus };
      })
    );
  };

  const uploaded = docs.filter((d) => d.status === "Uploaded").length;
  const total = docs.filter((d) => d.status !== "Not Required").length;
  const pct = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  const requiredMissing = docs.filter((d) => d.required && d.status === "Missing").length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">What do I need to send?</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Track which documents have been uploaded, which are pending, and which are still missing. Click any status badge to cycle through statuses.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Completion</span>
              <span>{uploaded}/{total} items</span>
            </div>
            <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full rounded-full ${ pct === 100 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400" }`}
              />
            </div>
          </div>
          <span className={`text-lg font-black ${ pct === 100 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400" }`}>{pct}%</span>
          {requiredMissing > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400 font-semibold">{requiredMissing} required missing</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-400/20 px-4 py-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <p className="text-xs text-blue-300/80 leading-relaxed">
          Click any status badge to cycle through: <strong>Missing → Pending → Uploaded → N/A</strong>. Expand any row for details and notes.
        </p>
      </div>

      <Card className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/8">
          {docs.map((doc, i) => {
            const cfg = statusConfig[doc.status];
            const StatusIcon = cfg.icon;
            const isExpanded = expandedId === doc.id;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <div
                  className={`flex items-center justify-between px-5 py-4 ${ doc.status === "Not Required" ? "opacity-50" : "" }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                      className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white/85 truncate">{doc.item}</span>
                        {doc.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/20 text-red-400 font-bold uppercase tracking-wide shrink-0">Required</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => cycleStatus(doc.id)}
                    className={`ml-4 shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all hover:opacity-80 ${ cfg.bg } ${ cfg.border } ${ cfg.color }`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-4 pt-0 bg-white/3">
                    <p className="text-xs text-white/55 leading-relaxed">{doc.description}</p>
                    {doc.note && (
                      <div className="flex items-start gap-2 mt-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300/70">{doc.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}