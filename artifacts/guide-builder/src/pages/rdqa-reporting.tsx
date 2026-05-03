import { Card } from "@/components/ui/card";

export default function RdqaReportingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Client Reporting</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10">
        <p className="text-white/70">Show clients total cases, average resolution time, common delay reasons, and cases pending action.</p>
      </Card>
    </div>
  );
}