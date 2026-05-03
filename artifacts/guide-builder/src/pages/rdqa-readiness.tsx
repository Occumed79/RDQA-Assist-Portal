import { Card } from "@/components/ui/card";

export default function RdqaReadinessPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Readiness Score</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Current case readiness</span>
          <span className="text-2xl font-black text-cyan-300">78%</span>
        </div>
        <p className="text-sm text-white/55">Missing provider packet completion, one lab result, and explicit restrictions/accommodations language.</p>
        <p className="text-sm text-white/55">Use this score to decide whether the case is ready for review or still needs applicant follow-up.</p>
      </Card>
    </div>
  );
}