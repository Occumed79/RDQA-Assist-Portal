import { useRef, useEffect, useState, useCallback } from "react";
import SignaturePad from "signature_pad";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetPublicForm, useSubmitPublicForm,
  getGetPublicFormQueryKey,
} from "@workspace/api-client-react";
import type { FormField } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, CheckCircle2, BookOpen, ClipboardList, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/* ── field renderers ─────────────────────────────────────────────────────── */

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          className={`text-3xl transition-colors ${(hover || value) >= star ? "text-amber-400" : "text-white/20"}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >★</button>
      ))}
    </div>
  );
}

function SignatureField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgba(0,0,0,0)",
      penColor: "rgba(255,255,255,0.95)",
      minWidth: 1.5,
      maxWidth: 3,
    });
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">Draw your signature below</span>
        <Button type="button" variant="ghost" size="sm" onClick={clear}
          className="h-6 text-xs text-white/30 hover:text-white hover:bg-white/8 gap-1 px-2">
          <RotateCcw className="w-3 h-3" /> Clear
        </Button>
      </div>
      <div className="relative rounded-xl border border-white/12 bg-white/4 overflow-hidden" style={{ height: 130 }}>
        <canvas ref={canvasRef} className="w-full h-full touch-none cursor-crosshair block" />
        {empty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/18 text-sm select-none">Sign here</p>
          </div>
        )}
        <div className="absolute bottom-3 left-5 right-5 border-t border-white/10 pointer-events-none" />
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
      return <Textarea value={(value as string) || ""} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={`${base} min-h-[90px]`} />;
    case "number":
      return <Input type="number" value={(value as string) || ""} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={base} />;
    case "date":
      return <Input type="date" value={(value as string) || ""} onChange={e => onChange(e.target.value)} className={`${base} [color-scheme:dark]`} />;
    case "checkbox":
      return (
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white/4 border border-white/8 hover:bg-white/6 transition-colors">
          <input type="checkbox" checked={!!(value as boolean)} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
          <span className="text-sm text-white/80">{field.label}</span>
        </label>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {(field.options || []).map(opt => (
            <label key={opt} className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all ${value === opt ? "bg-blue-500/10 border-blue-500/30 text-white" : "bg-white/3 border-white/8 text-white/70 hover:bg-white/6"}`}>
              <input type="radio" name={field.id} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="accent-blue-500" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      );
    case "select":
      return (
        <select value={(value as string) || ""} onChange={e => onChange(e.target.value)}
          className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-1 focus:ring-blue-500/40">
          <option value="" className="bg-[#0d1525]">Select an option…</option>
          {(field.options || []).map(opt => <option key={opt} value={opt} className="bg-[#0d1525]">{opt}</option>)}
        </select>
      );
    case "rating":
      return <StarRating value={(value as number) || 0} onChange={onChange} />;
    case "signature":
      return <SignatureField value={(value as string) || ""} onChange={onChange} />;
    default:
      return null;
  }
}

/* ── main page ───────────────────────────────────────────────────────────── */

export default function PublicFormPage() {
  const { token } = useParams<{ token: string }>();
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading, error } = useGetPublicForm(token || "", {
    query: { enabled: !!token, queryKey: getGetPublicFormQueryKey(token || "") }
  });

  const submit = useSubmitPublicForm();

  const visibleFields = (form?.fields as FormField[] | undefined || [])
    .slice()
    .sort((a, b) => a.order - b.order);

  const handleSubmit = () => {
    if (!form) return;
    if (!submitterName.trim()) { toast.error("Please enter your name"); return; }
    if (!submitterEmail.trim() || !submitterEmail.includes("@")) { toast.error("Please enter a valid email"); return; }
    const missingRequired = visibleFields.find(f =>
      f.required && (answers[f.id] === undefined || answers[f.id] === "" || answers[f.id] === false)
    );
    if (missingRequired) { toast.error(`"${missingRequired.label || "A required field"}" is required`); return; }

    submit.mutate(
      { token: token!, data: { submitterName: submitterName.trim(), submitterEmail: submitterEmail.trim(), answers } },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => toast.error("Failed to submit. Please try again."),
      }
    );
  };

  /* ── success state ── */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "radial-gradient(ellipse at top, #0f1a2e 0%, #08101e 100%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-10 max-w-sm w-full text-center border border-white/12 shadow-[0_0_60px_rgba(59,130,246,0.15)]"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Response Submitted</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Your response has been recorded. Thank you for completing <span className="text-white/80 font-medium">"{form?.title}"</span>.
          </p>
          <p className="text-xs text-white/30 mt-6">You can safely close this page.</p>
        </motion.div>
      </div>
    );
  }

  /* ── loading state ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "radial-gradient(ellipse at top, #0f1a2e 0%, #08101e 100%)" }}>
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  /* ── error / not found ── */
  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "radial-gradient(ellipse at top, #0f1a2e 0%, #08101e 100%)" }}>
        <div className="glass-panel rounded-2xl p-10 max-w-sm w-full text-center border border-white/12">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Form Not Found</h2>
          <p className="text-white/50 text-sm">This form link may be invalid or the form is no longer active.</p>
        </div>
      </div>
    );
  }

  /* ── main form ── */
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "radial-gradient(ellipse at top, #0f1a2e 0%, #08101e 100%)" }}>
      <div className="max-w-lg mx-auto">
        {/* Branding */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm text-white/50 font-medium">GuideBuilder</span>
          <span className="text-white/20">·</span>
          <span className="text-sm text-white/40 truncate max-w-[200px]">{form.guideTitle}</span>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel rounded-2xl border border-white/12 overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.1)]"
        >
          {/* Header */}
          <div className="p-6 pb-5 border-b border-white/8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0 mt-0.5">
                <ClipboardList className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">{form.title}</h1>
                {form.description && (
                  <p className="text-sm text-white/50 mt-1 leading-relaxed">{form.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Identity fields */}
            <div className="grid grid-cols-2 gap-4 pb-5 border-b border-white/8">
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">Your Name <span className="text-rose-400">*</span></Label>
                <Input value={submitterName} onChange={e => setSubmitterName(e.target.value)} placeholder="Jane Smith"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-blue-500/40" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">Email <span className="text-rose-400">*</span></Label>
                <Input value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} type="email" placeholder="jane@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-blue-500/40" />
              </div>
            </div>

            {/* Dynamic fields */}
            {visibleFields.map((field, i) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="space-y-2"
              >
                {field.type !== "checkbox" && (
                  <Label className="text-white/75 text-sm flex items-center gap-1.5">
                    {field.label || "Untitled field"}
                    {field.required && <span className="text-rose-400">*</span>}
                  </Label>
                )}
                <FieldInput
                  field={field}
                  value={answers[field.id]}
                  onChange={v => setAnswers(a => ({ ...a, [field.id]: v }))}
                />
              </motion.div>
            ))}

            {visibleFields.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">This form has no fields.</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <Button
              onClick={handleSubmit}
              disabled={submit.isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-base shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.55)] disabled:opacity-40 disabled:shadow-none transition-all"
            >
              <Send className="w-4 h-4 mr-2" />
              {submit.isPending ? "Submitting…" : "Submit Response"}
            </Button>
            <p className="text-center text-xs text-white/25 mt-3">
              Your response will be securely stored by GuideBuilder.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
