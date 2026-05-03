import { useRef, useEffect, useState, useCallback } from "react";
import SignaturePad from "signature_pad";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, RotateCcw, Send, ClipboardList } from "lucide-react";
import { useSubmitGuideForm, getListFormSubmissionsQueryKey } from "@workspace/api-client-react";
import type { GuideForm, FormField } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FormFillModalProps {
  form: GuideForm | null;
  isOpen: boolean;
  onClose: () => void;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${(hover || value) >= star ? "text-amber-400" : "text-white/20"}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function SignatureField({ fieldId, value, onChange }: { fieldId: string; value: string; onChange: (v: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [empty, setEmpty] = useState(true);

  const init = useCallback(() => {
    if (!canvasRef.current) return;
    if (padRef.current) padRef.current.off();
    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);
    const pad = new SignaturePad(canvas, { backgroundColor: "rgba(0,0,0,0)", penColor: "rgba(255,255,255,0.95)", minWidth: 1.5, maxWidth: 3 });
    pad.addEventListener("endStroke", () => {
      setEmpty(pad.isEmpty());
      onChange(pad.toDataURL("image/png"));
    });
    padRef.current = pad;
    setEmpty(true);
  }, [onChange]);

  useEffect(() => { setTimeout(init, 30); return () => { padRef.current?.off(); }; }, [init]);

  const clear = () => { padRef.current?.clear(); setEmpty(true); onChange(""); };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">Draw your signature</span>
        <Button type="button" variant="ghost" size="sm" onClick={clear} className="h-6 text-xs text-white/30 hover:text-white hover:bg-white/8 gap-1 px-2">
          <RotateCcw className="w-3 h-3" /> Clear
        </Button>
      </div>
      <div className="relative rounded-lg border border-white/12 bg-white/4 overflow-hidden" style={{ height: 110 }}>
        <canvas ref={canvasRef} className="w-full h-full touch-none cursor-crosshair block" />
        {empty && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-white/18 text-xs select-none">Sign here</p></div>}
        <div className="absolute bottom-2.5 left-4 right-4 border-t border-white/10 pointer-events-none" />
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FormField; value: unknown; onChange: (v: unknown) => void }) {
  const base = "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-blue-500/40";

  switch (field.type) {
    case "text":
      return <Input value={(value as string) || ""} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={base} />;
    case "textarea":
      return <Textarea value={(value as string) || ""} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={`${base} min-h-[80px]`} />;
    case "number":
      return <Input type="number" value={(value as string) || ""} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={base} />;
    case "date":
      return <Input type="date" value={(value as string) || ""} onChange={e => onChange(e.target.value)} className={`${base} [color-scheme:dark]`} />;
    case "checkbox":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!(value as boolean)} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
          <span className="text-sm text-white/70">{field.label}</span>
        </label>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {(field.options || []).map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={field.id} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="accent-blue-500" />
              <span className="text-sm text-white/80">{opt}</span>
            </label>
          ))}
        </div>
      );
    case "select":
      return (
        <select
          value={(value as string) || ""}
          onChange={e => onChange(e.target.value)}
          className="w-full h-9 rounded-md bg-white/5 border border-white/10 text-white text-sm px-2 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        >
          <option value="" className="bg-[#0d1525]">Select an option…</option>
          {(field.options || []).map(opt => <option key={opt} value={opt} className="bg-[#0d1525]">{opt}</option>)}
        </select>
      );
    case "rating":
      return <StarRating value={(value as number) || 0} onChange={onChange} />;
    case "signature":
      return <SignatureField fieldId={field.id} value={(value as string) || ""} onChange={onChange} />;
    default:
      return null;
  }
}

export function FormFillModal({ form, isOpen, onClose }: FormFillModalProps) {
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const queryClient = useQueryClient();
  const submit = useSubmitGuideForm();

  const reset = () => { setSubmitterName(""); setSubmitterEmail(""); setAnswers({}); };

  const handleSubmit = () => {
    if (!form) return;
    if (!submitterName.trim()) { toast.error("Please enter your name"); return; }
    if (!submitterEmail.trim() || !submitterEmail.includes("@")) { toast.error("Please enter a valid email"); return; }
    const missingRequired = form.fields.find(f => f.required && (answers[f.id] === undefined || answers[f.id] === "" || answers[f.id] === false));
    if (missingRequired) { toast.error(`"${missingRequired.label || "A required field"}" is required`); return; }

    submit.mutate(
      { id: form.id, data: { submitterName: submitterName.trim(), submitterEmail: submitterEmail.trim(), answers } },
      {
        onSuccess: () => {
          toast.success("Response submitted successfully");
          queryClient.invalidateQueries({ queryKey: getListFormSubmissionsQueryKey(form.id) });
          onClose();
          reset();
        },
        onError: () => toast.error("Failed to submit response"),
      }
    );
  };

  const visibleFields = (form?.fields || []).slice().sort((a, b) => a.order - b.order);

  return (
    <AnimatePresence>
      {isOpen && form && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)] border border-white/12 flex flex-col"
            style={{ maxHeight: "90vh" }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{form.title}</h2>
                  {form.description && <p className="text-xs text-white/40 truncate max-w-[260px]">{form.description}</p>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/30 hover:text-white hover:bg-white/8 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Identity */}
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/8">
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Your Name</Label>
                  <Input value={submitterName} onChange={e => setSubmitterName(e.target.value)} placeholder="Jane Smith" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-8 text-sm focus-visible:ring-blue-500/40" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Email Address</Label>
                  <Input value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} type="email" placeholder="jane@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-8 text-sm focus-visible:ring-blue-500/40" />
                </div>
              </div>

              {/* Dynamic Fields */}
              {visibleFields.map(field => (
                <div key={field.id} className="space-y-1.5">
                  {field.type !== "checkbox" && (
                    <Label className="text-white/70 text-sm flex items-center gap-1">
                      {field.label || "Untitled field"}
                      {field.required && <span className="text-rose-400 ml-0.5">*</span>}
                    </Label>
                  )}
                  <FieldInput
                    field={field}
                    value={answers[field.id]}
                    onChange={v => setAnswers(a => ({ ...a, [field.id]: v }))}
                  />
                </div>
              ))}

              {visibleFields.length === 0 && (
                <p className="text-white/30 text-sm text-center py-4">This form has no fields yet.</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/8 shrink-0">
              <Button
                onClick={handleSubmit}
                disabled={submit.isPending}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.55)] py-5 text-base disabled:opacity-40 disabled:shadow-none transition-all"
              >
                <Send className="w-4 h-4 mr-2" />
                {submit.isPending ? "Submitting…" : "Submit Response"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
