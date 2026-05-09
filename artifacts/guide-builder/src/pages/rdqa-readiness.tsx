import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle, Gauge, ArrowRight, Info } from "lucide-react";

interface ReadinessItem {
  id: string;
  label: string;
  description: string;
  weight: number;
  category: "required" | "important" | "optional";
}

const readinessItems: ReadinessItem[] = [
  { id: "rdqa_letter", label: "RDQA letter attached", description: "The original RDQA letter from Occu-Med is included in the submission.", weight: 15, category: "required" },
  { id: "provider_letter", label: "Provider letter received", description: "A written letter from the treating provider has been submitted.", weight: 20, category: "required" },
  { id: "each_bullet", label: "Each bullet point addressed", description: "The provider letter responds to each specific item listed in the RDQA letter.", weight: 20, category: "required" },
  { id: "job_functions", label: "Job functions reviewed by provider", description: "The provider confirms they reviewed the essential job functions document.", weight: 10, category: "required" },
  { id: "restrictions", label: "Restrictions/accommodations addressed", description: "The provider explicitly states whether restrictions or accommodations are needed.", weight: 10, category: "required" },
  { id: "labs_included", label: "Lab results / testing included", description: "Relevant lab results, imaging, or test results are included as requested.", weight: 10, category: "important" },
  { id: "medication_list", label: "Medication list included", description: "Current medication list is attached or described in the provider letter.", weight: 5, category: "important" },
  { id: "current_status", label: "Current condition status stated", description: "Provider states whether the condition is currently controlled, stable, or active.", weight: 5, category: "important" },
  { id: "no_home_readings", label: "No home readings (clinical only)", description: "For blood pressure cases: only clinical readings are submitted, not home readings.", weight: 3, category: "optional" },
  { id: "specialist_note", label: "Specialist note included (if applicable)", description: "If a specialist was requested, their note is included.", weight: 2, category: "optional" },
];

const categoryColors = {
  required: { label: "Required", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  important: { label: "Important", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  optional: { label: "Optional", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

export default function RdqaReadinessPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const score = readinessItems.reduce((sum, item) => sum + (checked[item.id] ? item.weight : 0), 0);
  const maxScore = readinessItems.reduce((sum, item) => sum + item.weight, 0);
  const pct = Math.round((score / maxScore) * 100);

  const scoreColor =
    pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg =
    pct >= 80 ? "bg-emerald-400" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  const scoreLabel =
    pct >= 80 ? "Ready for Review" : pct >= 50 ? "Needs Attention" : "Not Ready";

  const missing = readinessItems.filter((item) => !checked[item.id]);
  const requiredMissing = missing.filter((i) => i.category === "required");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">Readiness Score</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Check off each item as it is confirmed present in the submission. The score signals whether the case is ready for EQA review or still needs follow-up.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-3">
          {(["required", "important", "optional"] as const).map((cat) => (
            <div key={cat}>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border mb-2 ${categoryColors[cat].bg} ${categoryColors[cat].border} ${categoryColors[cat].color}`}>
                {categoryColors[cat].label}
              </div>
              <div className="space-y-2">
                {readinessItems.filter((i) => i.category === cat).map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 2 }}
                    className={`glass-panel rounded-xl p-4 border cursor-pointer transition-all ${
                      checked[item.id] ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => toggle(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {checked[item.id] ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-white/25" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium ${ checked[item.id] ? "text-white" : "text-white/70" }`}>
                            {item.label}
                          </span>
                          <span className="text-xs text-white/30 shrink-0">+{item.weight}pts</span>
                        </div>
                        <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score Panel */}
        <div className="space-y-4">
          <Card className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gauge className="w-4 h-4 text-white/40" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Readiness Score</span>
            </div>
            <div className={`text-6xl font-black mb-1 ${scoreColor}`}>{pct}%</div>
            <div className={`text-sm font-semibold mb-4 ${scoreColor}`}>{scoreLabel}</div>
            <div className="w-full h-3 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${scoreBg}`}
              />
            </div>
            <div className="mt-3 text-xs text-white/40">{score} / {maxScore} points</div>
          </Card>

          {requiredMissing.length > 0 && (
            <Card className="glass-panel p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-red-400/70">Required Missing</span>
              </div>
              <div className="space-y-1.5">
                {requiredMissing.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 text-xs text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0 mt-1.5" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {pct >= 80 && (
            <Card className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Case is review-ready</span>
              </div>
              <p className="text-xs text-white/55 mt-1.5 leading-relaxed">
                All required items are present. This case can be moved to EQA review.
              </p>
            </Card>
          )}

          <Card className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-white/40" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">How to Use</span>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              Check each item as you confirm it is present in the submission. Use this score to decide whether to move the case to review or send a follow-up request to the applicant.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}