import { Card } from "@/components/ui/card";

const stages = [
  "RDQA issued",
  "Letter delivered",
  "Provider packet started",
  "Documents uploaded",
  "EQA review",
  "Final decision",
];

export default function RdqaStatusPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Case Status</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center justify-between py-3 border-b border-white/8 last:border-b-0">
            <span className="text-white/80">{stage}</span>
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50">{i < 3 ? "Done" : "Pending"}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}