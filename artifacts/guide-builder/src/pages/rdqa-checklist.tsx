import { Card } from "@/components/ui/card";

const checklist = [
  { item: "RDQA letter attached", status: "Missing" },
  { item: "Provider packet attached", status: "Pending" },
  { item: "Job functions included", status: "Uploaded" },
  { item: "Testing / labs included", status: "Incomplete" },
  { item: "Restrictions / accommodations addressed", status: "Incomplete" },
  { item: "Provider responded to each bullet", status: "Missing" },
];

export default function RdqaChecklistPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">What do I need to send?</h1>
      <Card className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="space-y-3">
          {checklist.map((row) => (
            <div key={row.item} className="flex items-center justify-between py-3 border-b border-white/8 last:border-b-0">
              <span className="text-white/80">{row.item}</span>
              <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50">{row.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}