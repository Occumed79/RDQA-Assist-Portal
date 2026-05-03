import { Card } from "@/components/ui/card";

const steps = [
  "RDQA issued",
  "Applicant notified",
  "Records requested",
  "Documents uploaded",
  "EQA review",
  "SME review",
  "Final recommendation",
];

export default function RdqaTimelinePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Applicant Timeline</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center justify-between py-3 border-b border-white/8 last:border-b-0">
            <span className="text-white/80">{step}</span>
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50">{idx < 3 ? "Complete" : "Pending"}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}