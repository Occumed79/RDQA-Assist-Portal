import { useState } from "react";
import { useCreateGuide } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import GuideForm from "@/components/guides/guide-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { GuideStep } from "@workspace/api-client-react";

const TEMPLATES = [
  { id: "blank", name: "Blank Guide", icon: FileText, desc: "Start from scratch" },
  { id: "sop", name: "Standard Operating Procedure", icon: ClipboardList, desc: "Formal process documentation" },
  { id: "training", name: "Training Guide", icon: BookOpen, desc: "Onboarding and education" },
];

export default function GuideNew() {
  const [, setLocation] = useLocation();
  const createGuide = useCreateGuide();
  const [template, setTemplate] = useState<string | null>(null);

  const handleSubmit = async (data: { title: string; description: string; category?: string; tags?: string[]; steps?: GuideStep[] }) => {
    try {
      const guide = await createGuide.mutateAsync({ data });
      toast.success("Guide created successfully!");
      setLocation(`/guides/${guide.id}`);
    } catch (error) {
      toast.error("Failed to create guide");
    }
  };

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 mt-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create a New Guide</h1>
          <p className="text-muted-foreground text-lg">Choose a starting point for your documentation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className="glass-panel glass-panel-hover p-6 rounded-xl cursor-pointer h-full flex flex-col items-center text-center space-y-4 group"
                onClick={() => setTemplate(t.id)}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                  <t.icon className="w-8 h-8 text-white/80 group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <div className="mt-auto pt-4 w-full">
                  <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 group-hover:bg-blue-400/20 transition-all">
                    Select <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const initialData = {
    title: template === "sop" ? "Standard Operating Procedure: " : template === "training" ? "Training Guide: " : "",
    description: "",
    category: template === "sop" ? "Operations" : template === "training" ? "HR/Training" : "General",
    tags: [],
    steps: []
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => setTemplate(null)} className="glass-panel border-white/10 text-white hover:bg-white/10">
          Back
        </Button>
        <h1 className="text-2xl font-bold text-white">Create {TEMPLATES.find(t => t.id === template)?.name}</h1>
      </div>
      
      <GuideForm initialData={initialData} onSubmit={handleSubmit} isSaving={createGuide.isPending} />
    </div>
  );
}
