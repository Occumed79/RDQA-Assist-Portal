import { useState } from "react";
import type { GuideStep } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, Plus, GripVertical, Trash2, Wand2, Lightbulb, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { useAiGenerateSteps, useAiPolishSteps, useAiAutofillStep } from "@workspace/api-client-react";
import { toast } from "sonner";
import { motion, Reorder } from "framer-motion";

interface GuideFormProps {
  initialData: {
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    steps?: GuideStep[];
  };
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

export default function GuideForm({ initialData, onSubmit, isSaving }: GuideFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category || "");
  const [tags, setTags] = useState(initialData.tags?.join(", ") || "");
  
  const [steps, setSteps] = useState<GuideStep[]>(initialData.steps || []);
  const [aiOutline, setAiOutline] = useState("");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const generateSteps = useAiGenerateSteps();
  const polishSteps = useAiPolishSteps();
  const autofillStep = useAiAutofillStep();

  const handleAddStep = () => {
    setSteps([...steps, { id: `new-${Date.now()}`, title: "", instruction: "", order: steps.length }]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const handleUpdateStep = (id: string, field: keyof GuideStep, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    
    onSubmit({
      title,
      description,
      category,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      steps: steps.map((s, i) => ({ ...s, order: i }))
    });
  };

  const handleGenerateFromOutline = async (): Promise<void> => {
    if (!aiOutline) { toast.error("Please provide an outline"); return; }
    if (!title) { toast.error("Please set a guide title first"); return; }
    
    try {
      const result = await generateSteps.mutateAsync({ data: { outline: aiOutline, guideTitle: title, mode: "append" } });
      setSteps([...steps, ...result.steps.map((s, i) => ({ ...s, id: `ai-${Date.now()}-${i}`, order: steps.length + i }))]);
      setAiOutline("");
      setIsAiPanelOpen(false);
      toast.success("Steps generated successfully!");
    } catch (error) {
      toast.error("Failed to generate steps");
    }
  };

  const handlePolishSteps = async (): Promise<void> => {
    if (steps.length === 0) { toast.error("No steps to polish"); return; }
    if (!title) { toast.error("Please set a guide title first"); return; }
    
    try {
      const result = await polishSteps.mutateAsync({ data: { steps, guideTitle: title } });
      setSteps(result.steps.map((s, i) => ({ ...s, id: steps[i]?.id || `polished-${Date.now()}-${i}`, order: i })));
      toast.success("Steps polished successfully!");
    } catch (error) {
      toast.error("Failed to polish steps");
    }
  };

  const handleAutofillStep = async (stepId: string): Promise<void> => {
    if (!title) { toast.error("Please set a guide title first"); return; }
    const step = steps.find(s => s.id === stepId);
    if (!step || (!step.title && !step.instruction)) { toast.error("Provide at least a title or instruction to autofill"); return; }

    try {
      const result = await autofillStep.mutateAsync({ data: { step, guideTitle: title } });
      setSteps(steps.map(s => s.id === stepId ? { ...result.step, id: s.id, order: s.order } : s));
      toast.success("Step autofilled successfully!");
    } catch (error) {
      toast.error("Failed to autofill step");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <form id="guide-form" onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-panel p-6 rounded-xl space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white/80">Guide Title</Label>
                <Input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Onboarding New Employees"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-lg py-6 focus-visible:ring-primary/50"
                />
              </div>
              <div>
                <Label className="text-white/80">Description</Label>
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Briefly describe what this guide covers..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] focus-visible:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Category</Label>
                  <Input 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    placeholder="e.g. HR, Operations"
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Tags (comma separated)</Label>
                  <Input 
                    value={tags} 
                    onChange={e => setTags(e.target.value)} 
                    placeholder="e.g. training, remote, basics"
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Steps</h2>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePolishSteps}
                  disabled={steps.length === 0 || polishSteps.isPending}
                  className="glass-panel border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {polishSteps.isPending ? "Polishing..." : "AI Polish All"}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddStep}
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </div>

            <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-4">
              {steps.map((step, index) => (
                <Reorder.Item key={step.id} value={step}>
                  <Card className="glass-panel rounded-xl overflow-hidden group">
                    <div className="flex">
                      <div className="p-4 flex flex-col items-center justify-between bg-white/5 border-r border-white/10 w-12 shrink-0 cursor-grab active:cursor-grabbing">
                        <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                        <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                      </div>
                      
                      <div className="p-4 flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <Input 
                            value={step.title} 
                            onChange={e => handleUpdateStep(step.id, "title", e.target.value)} 
                            placeholder="Step Title"
                            className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 text-lg font-medium text-white focus-visible:ring-0 focus-visible:border-primary/50"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAutofillStep(step.id)}
                              disabled={autofillStep.isPending}
                              className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
                            >
                              <Wand2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveStep(step.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <Textarea 
                          value={step.instruction} 
                          onChange={e => handleUpdateStep(step.id, "instruction", e.target.value)} 
                          placeholder="Detailed instructions for this step..."
                          className="bg-white/5 border-white/10 text-white min-h-[80px] focus-visible:ring-primary/50"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Lightbulb className="absolute left-3 top-3 w-4 h-4 text-emerald-400" />
                            <Input 
                              value={step.tip || ""} 
                              onChange={e => handleUpdateStep(step.id, "tip", e.target.value)} 
                              placeholder="Pro tip (optional)"
                              className="pl-9 bg-emerald-500/5 border-emerald-500/20 text-emerald-50 placeholder:text-emerald-500/50 focus-visible:ring-emerald-500/50"
                            />
                          </div>
                          <div className="relative">
                            <AlertTriangle className="absolute left-3 top-3 w-4 h-4 text-rose-400" />
                            <Input 
                              value={step.caution || ""} 
                              onChange={e => handleUpdateStep(step.id, "caution", e.target.value)} 
                              placeholder="Caution (optional)"
                              className="pl-9 bg-rose-500/5 border-rose-500/20 text-rose-50 placeholder:text-rose-500/50 focus-visible:ring-rose-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                            <Input 
                              value={step.imageUrl || ""} 
                              onChange={e => handleUpdateStep(step.id, "imageUrl", e.target.value)} 
                              placeholder="Image URL (optional)"
                              className="pl-9 bg-blue-500/5 border-blue-500/20 text-blue-50 placeholder:text-blue-500/50 focus-visible:ring-blue-500/50"
                            />
                          </div>
                          <div className="relative">
                            <Input 
                              value={step.imageCaption || ""} 
                              onChange={e => handleUpdateStep(step.id, "imageCaption", e.target.value)} 
                              placeholder="Image Caption (optional)"
                              className="bg-blue-500/5 border-blue-500/20 text-blue-50 placeholder:text-blue-500/50 focus-visible:ring-blue-500/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Reorder.Item>
              ))}
              
              {steps.length === 0 && (
                <div className="glass-panel p-8 rounded-xl border border-dashed border-white/20 text-center">
                  <p className="text-muted-foreground">No steps added yet. Add a step or use AI to generate from an outline.</p>
                </div>
              )}
            </Reorder.Group>
          </div>
        </form>
      </div>

      {/* AI Sidebar & Actions */}
      <div className="xl:col-span-1 space-y-6">
        <div className="sticky top-24 space-y-6">
          <Card className="glass-panel border-amber-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.05)]">
            <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-medium">
                <Wand2 className="w-5 h-5" /> AI Assistant
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Generate from Outline</Label>
                <Textarea 
                  value={aiOutline} 
                  onChange={e => setAiOutline(e.target.value)} 
                  placeholder="Paste a rough outline or text, e.g. 'First log in, then click settings, update profile pic...'"
                  className="bg-black/20 border-white/10 text-white min-h-[120px] text-sm focus-visible:ring-amber-500/50"
                />
              </div>
              <Button 
                onClick={handleGenerateFromOutline} 
                disabled={!aiOutline || generateSteps.isPending}
                className="w-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
              >
                {generateSteps.isPending ? "Generating..." : "Generate Steps"}
              </Button>
            </div>
          </Card>

          <Card className="glass-panel rounded-xl p-4">
            <Button 
              type="submit" 
              form="guide-form" 
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] py-6 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Saving..." : "Save Guide"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
