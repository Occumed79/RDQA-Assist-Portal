import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Upload, X, Wand2, ArrowRight, CheckCircle2, Loader2,
  Edit2, GripVertical, Lightbulb, AlertTriangle, ImageIcon,
  Camera, Sparkles, BookOpen, ChevronDown, ChevronUp, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateGuide } from "@workspace/api-client-react";
import { FloatingSparkleField } from "@/components/characters/KurzgesagtBird";
import type { GuideStep } from "@workspace/api-client-react";

interface UploadedScreenshot {
  id: string;
  file: File;
  previewUrl: string;
  data: string;
  mimeType: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function StepEditor({
  step,
  index,
  screenshot,
  onChange,
  onRemove,
}: {
  step: GuideStep;
  index: number;
  screenshot?: UploadedScreenshot;
  onChange: (s: GuideStep) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-panel rounded-2xl overflow-hidden border border-white/10"
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/30 shrink-0">
          <span className="text-sm font-bold text-blue-300">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{step.title || "Untitled step"}</p>
          <p className="text-xs text-white/40 truncate">{step.instruction?.slice(0, 80)}…</p>
        </div>
        {screenshot && (
          <div className="w-12 h-8 rounded-md overflow-hidden border border-white/10 shrink-0">
            <img src={screenshot.previewUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/8">
              <div className="pt-3 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/50">Step Title</Label>
                  <Input
                    value={step.title}
                    onChange={e => onChange({ ...step, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white text-sm h-8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/50">Instruction</Label>
                  <Textarea
                    value={step.instruction}
                    onChange={e => onChange({ ...step, instruction: e.target.value })}
                    className="bg-white/5 border-white/10 text-white text-sm min-h-[72px]"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-emerald-400/70 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Tip
                    </Label>
                    <Input
                      value={step.tip || ""}
                      onChange={e => onChange({ ...step, tip: e.target.value })}
                      placeholder="Optional tip..."
                      className="bg-emerald-500/5 border-emerald-500/15 text-white text-sm h-8 placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-rose-400/70 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Caution
                    </Label>
                    <Input
                      value={step.caution || ""}
                      onChange={e => onChange({ ...step, caution: e.target.value })}
                      placeholder="Optional caution..."
                      className="bg-rose-500/5 border-rose-500/15 text-white text-sm h-8 placeholder:text-white/20"
                    />
                  </div>
                </div>
                {screenshot && (
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={screenshot.previewUrl} alt="Screenshot" className="w-full object-cover max-h-48" />
                    <div className="px-3 py-2 bg-white/3 text-xs text-white/40 flex items-center gap-2">
                      <Camera className="w-3 h-3" />
                      Screenshot from step {index + 1}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ScribePage() {
  const [, navigate] = useLocation();
  const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>([]);
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");
  const [guideCategory, setGuideCategory] = useState("Tutorial");
  const [context, setContext] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phase, setPhase] = useState<"upload" | "review">("upload");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createGuide = useCreateGuide();

  const addFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) { toast.error("Please upload image files only"); return; }
    const newScreenshots: UploadedScreenshot[] = await Promise.all(
      imageFiles.map(async (file) => {
        const previewUrl = URL.createObjectURL(file);
        const data = await fileToBase64(file);
        return {
          id: `ss-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file,
          previewUrl,
          data,
          mimeType: file.type as UploadedScreenshot["mimeType"],
        };
      })
    );
    setScreenshots(prev => [...prev, ...newScreenshots]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleAnalyze = async () => {
    if (screenshots.length === 0) { toast.error("Upload at least one screenshot first"); return; }
    setAnalyzing(true);
    try {
      const res = await fetch(`${BASE}/api/ai/analyze-screenshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenshots: screenshots.map(s => ({ data: s.data, mimeType: s.mimeType })),
          context: context.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setSteps(json.steps || []);
      setSuggestedTitle(json.suggestedTitle || "");
      setSuggestedDescription(json.suggestedDescription || "");
      setGuideTitle(json.suggestedTitle || "");
      setGuideDescription(json.suggestedDescription || "");
      setPhase("review");
      toast.success(`Generated ${json.steps?.length || 0} steps from your screenshots!`);
    } catch {
      toast.error("Failed to analyze screenshots. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveGuide = async () => {
    if (!guideTitle.trim()) { toast.error("Guide title is required"); return; }
    setSaving(true);
    try {
      const guide = await createGuide.mutateAsync({
        data: {
          title: guideTitle.trim(),
          description: guideDescription.trim(),
          category: guideCategory,
          tags: ["auto-generated", "scribe"],
          steps: steps.map((s, i) => ({
            ...s,
            order: i + 1,
            imageUrl: screenshots[i]?.previewUrl ? undefined : s.imageUrl,
          })),
        },
      });
      toast.success("Guide saved successfully!");
      navigate(`/guides/${guide.id}`);
    } catch {
      toast.error("Failed to save guide");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 p-8"
        style={{
          background: "linear-gradient(135deg, rgba(15,25,50,0.9) 0%, rgba(10,18,38,0.95) 100%)",
        }}
      >
        <FloatingSparkleField count={10} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/8 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/8 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                AI-POWERED
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide">
                SCRIBE
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Auto<span className="text-amber-400">Scribe</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Upload screenshots of any workflow — Gemini Vision reads each one and writes your step-by-step guide automatically.
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Context */}
            <div className="glass-panel rounded-2xl p-6 space-y-4 border border-white/8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-semibold text-white">Guide Context</h2>
                <span className="text-xs text-white/30">(optional but helps AI)</span>
              </div>
              <Input
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder='e.g. "Setting up a new employee in HR system" or "How to deploy to production"'
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25"
              />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
                dragOver
                  ? "border-amber-400/60 bg-amber-500/5"
                  : "border-white/15 hover:border-blue-400/40 hover:bg-blue-500/3"
              }`}
              style={{ minHeight: 200 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4"
                >
                  <Upload className="w-8 h-8 text-white/40" />
                </motion.div>
                <p className="text-white/70 font-semibold text-lg mb-1">Drop screenshots here</p>
                <p className="text-white/35 text-sm">or click to browse · PNG, JPG, WebP · up to 20 images</p>
              </div>
            </div>

            {/* Thumbnail grid */}
            {screenshots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-white/70">
                    {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""} ready
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setScreenshots([])}
                    className="text-white/30 hover:text-rose-400 text-xs h-7"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {screenshots.map((ss, i) => (
                    <motion.div
                      key={ss.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative group aspect-video rounded-xl overflow-hidden border border-white/10"
                    >
                      <img src={ss.previewUrl} alt={`Step ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); removeScreenshot(ss.id); }}
                          className="w-7 h-7 rounded-full bg-rose-500/80 flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 w-5 h-5 rounded-md bg-black/60 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">{i + 1}</span>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-blue-400/30 transition-colors flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-5 h-5 text-white/25" />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleAnalyze}
                disabled={screenshots.length === 0 || analyzing}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.55)] transition-all disabled:opacity-40"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing screenshots…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-3" />
                    Generate Guide with AI
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>
            </motion.div>

            {analyzing && (
              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 border border-amber-500/20">
                <OccumedLogo size={36} />
                <div>
                  <p className="text-white font-semibold">Gemini is reading your screenshots…</p>
                  <p className="text-white/50 text-sm mt-0.5">Identifying actions, writing instructions, and organizing steps.</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Success banner */}
            <div className="glass-panel rounded-2xl p-5 flex items-center gap-4 border border-emerald-500/25 bg-emerald-500/5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{steps.length} steps generated from {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}</p>
                <p className="text-emerald-300/60 text-sm">Review and edit before saving as a guide.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPhase("upload"); setSteps([]); }}
                className="text-white/40 hover:text-white shrink-0"
              >
                Start over
              </Button>
            </div>

            {/* Guide metadata */}
            <div className="glass-panel rounded-2xl p-6 space-y-4 border border-white/8">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-semibold text-white">Guide Details</h2>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/50">Title</Label>
                  <Input
                    value={guideTitle}
                    onChange={e => setGuideTitle(e.target.value)}
                    placeholder="Guide title…"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/50">Description</Label>
                  <Textarea
                    value={guideDescription}
                    onChange={e => setGuideDescription(e.target.value)}
                    placeholder="What does this guide cover?"
                    className="bg-white/5 border-white/10 text-white min-h-[72px]"
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/50">Category</Label>
                  <Input
                    value={guideCategory}
                    onChange={e => setGuideCategory(e.target.value)}
                    placeholder="Tutorial, SOP, Onboarding…"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-400" />
                  Generated Steps
                </h2>
                <span className="text-sm text-white/40">{steps.length} step{steps.length !== 1 ? "s" : ""}</span>
              </div>
              <AnimatePresence>
                {steps.map((step, i) => (
                  <StepEditor
                    key={step.id}
                    step={step}
                    index={i}
                    screenshot={screenshots[i]}
                    onChange={updated => setSteps(prev => prev.map((s, idx) => idx === i ? updated : s))}
                    onRemove={() => setSteps(prev => prev.filter((_, idx) => idx !== i))}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Save Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleSaveGuide}
                disabled={saving || !guideTitle.trim() || steps.length === 0}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.55)] transition-all disabled:opacity-40"
              >
                {saving ? (
                  <><Loader2 className="w-5 h-5 mr-3 animate-spin" />Saving Guide…</>
                ) : (
                  <><BookOpen className="w-5 h-5 mr-3" />Save as Guide<ArrowRight className="w-5 h-5 ml-3" /></>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
