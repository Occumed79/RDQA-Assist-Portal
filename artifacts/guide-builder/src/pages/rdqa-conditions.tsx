import { Card } from "@/components/ui/card";

const conditions = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Sleep Apnea",
  "Mental Health History",
  "Orthopedic Conditions",
  "Cardiac History",
];

export default function RdqaConditionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Condition Pages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map((c) => (
          <Card key={c} className="glass-panel p-5 rounded-2xl border border-white/10">
            <h2 className="font-semibold text-white">{c}</h2>
            <p className="text-sm text-white/55 mt-2">
              What triggered the RDQA, what Occu-Med needs, what the provider should address, documents to upload, and common mistakes.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}