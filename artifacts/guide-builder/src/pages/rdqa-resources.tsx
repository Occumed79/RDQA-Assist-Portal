import { Card } from "@/components/ui/card";

const resources = [
  { title: "Primary care / community clinic", text: "Good for routine letters, common follow-up, and lower-cost access." },
  { title: "FQHC / county clinic", text: "Useful when the applicant has no PCP or needs sliding-scale options." },
  { title: "Hospital financial assistance", text: "Useful when testing or specialty follow-up is unaffordable." },
  { title: "Cash-pay specialist", text: "Useful when speed matters more than insurance routing." },
];

export default function RdqaResourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Resource Navigator</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <p className="text-white/70">
          These resources are provided as a courtesy only. Occu-Med does not endorse, recommend, contract with, or partner with these providers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r) => (
            <div key={r.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h2 className="font-semibold text-white">{r.title}</h2>
              <p className="text-sm text-white/55 mt-1">{r.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}