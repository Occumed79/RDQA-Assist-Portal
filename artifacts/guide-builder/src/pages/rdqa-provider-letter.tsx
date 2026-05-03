import { Card } from "@/components/ui/card";

export default function RdqaProviderLetterPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Provider Letter Generator</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <p className="text-white/70">Generate a provider packet with the RDQA letter, job functions, and a checklist of exactly what the provider must answer.</p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60 space-y-2">
          <p>Include: current status, symptoms, testing, functional limits, restrictions, accommodations, and whether the condition impacts the essential job functions.</p>
          <p>Also include a plain request for the provider to be specific and respond to each bullet point so the analyst gets a complete answer on the first pass.</p>
        </div>
      </Card>
    </div>
  );
}