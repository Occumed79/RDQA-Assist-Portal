import { useState } from "react";
import {
  useGetGuide, useListGuideSignatures, useListGuideForms,
  getGetGuideQueryKey, getListGuideSignaturesQueryKey, getListGuideFormsQueryKey
} from "@workspace/api-client-react";
import type { GuideForm } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Edit2, Copy, Download, ArrowLeft, Lightbulb, AlertTriangle, CheckCircle2,
  ShieldCheck, PenLine, User, Mail, Clock, ClipboardList, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { SignatureModal } from "@/components/guides/signature-modal";
import { FormEditorModal } from "@/components/guides/form-editor-modal";
import { FormCard } from "@/components/guides/form-card";

export default function GuideDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);
  const [sigModalOpen, setSigModalOpen] = useState(false);
  const [formEditorOpen, setFormEditorOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<GuideForm | null>(null);

  const { data: guide, isLoading, error } = useGetGuide(id, {
    query: { enabled: !!id, queryKey: getGetGuideQueryKey(id) }
  });
  const { data: signatures, isLoading: sigsLoading } = useListGuideSignatures(id, {
    query: { enabled: !!id, queryKey: getListGuideSignaturesQueryKey(id) }
  });
  const { data: forms, isLoading: formsLoading } = useListGuideForms(id, {
    query: { enabled: !!id, queryKey: getListGuideFormsQueryKey(id) }
  });

  const handleCopyText = () => {
    if (!guide) return;
    let text = `${guide.title}\n\n${guide.description || ""}\n\n`;
    guide.steps?.forEach((step, i) => {
      text += `${i + 1}. ${step.title}\n${step.instruction}\n`;
      if (step.tip) text += `Tip: ${step.tip}\n`;
      if (step.caution) text += `Caution: ${step.caution}\n`;
      text += "\n";
    });
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard as text");
  };

  const handleCopyMarkdown = () => {
    if (!guide) return;
    let md = `# ${guide.title}\n\n${guide.description || ""}\n\n`;
    guide.steps?.forEach((step, i) => {
      md += `## ${i + 1}. ${step.title}\n\n${step.instruction}\n\n`;
      if (step.tip) md += `> **Tip:** ${step.tip}\n\n`;
      if (step.caution) md += `> ⚠️ **Caution:** ${step.caution}\n\n`;
      if (step.imageUrl) md += `![${step.imageCaption || step.title}](${step.imageUrl})\n\n`;
    });
    navigator.clipboard.writeText(md);
    toast.success("Copied to clipboard as Markdown");
  };

  const openNewForm = () => { setEditingForm(null); setFormEditorOpen(true); };
  const openEditForm = (f: GuideForm) => { setEditingForm(f); setFormEditorOpen(true); };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-32 glass-panel rounded-xl" />
        <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-48 glass-panel rounded-xl" />)}</div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white">Guide not found</h2>
        <Link href="/guides" className="text-blue-400 mt-4 inline-block">Return to guides</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/guides">
          <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Library
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopyText} className="glass-panel border-white/10 text-white hover:bg-white/10">
            <Copy className="w-4 h-4 mr-2" /> Text
          </Button>
          <Button variant="outline" onClick={handleCopyMarkdown} className="glass-panel border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Markdown
          </Button>
          <Link href={`/guides/${id}/edit`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Edit2 className="w-4 h-4 mr-2" /> Edit Guide
            </Button>
          </Link>
        </div>
      </div>

      {/* Guide Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {guide.category && (
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm font-medium">
                {guide.category}
              </span>
            )}
            {guide.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{guide.title}</h1>
          {guide.description && (
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl">{guide.description}</p>
          )}
          <div className="text-sm text-white/50 pt-4 flex items-center gap-4">
            <span>Last updated: {format(new Date(guide.updatedAt), "MMMM d, yyyy")}</span>
            <span>•</span>
            <span>{guide.steps?.length || 0} steps</span>
          </div>
        </div>
      </motion.div>

      {/* Steps List */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[28px] md:before:ml-[36px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-white/10 before:to-transparent">
        {guide.steps?.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative flex gap-6 md:gap-8"
          >
            <div className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-[#0a101d] glass-panel border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <span className="text-xl font-bold bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">{index + 1}</span>
            </div>
            <div className="flex-1 pt-2 md:pt-4 space-y-6">
              <div className="glass-panel p-6 md:p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <div className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap">{step.instruction}</div>
                {step.imageUrl && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-white/10 relative">
                    <img src={step.imageUrl} alt={step.imageCaption || step.title} className="w-full object-cover max-h-[400px]" />
                    {step.imageCaption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-3 text-sm text-white/90">{step.imageCaption}</div>
                    )}
                  </div>
                )}
                {(step.tip || step.caution) && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.tip && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
                        <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div><h4 className="font-medium text-emerald-300 mb-1">Pro Tip</h4><p className="text-emerald-100/80 text-sm leading-relaxed">{step.tip}</p></div>
                      </div>
                    )}
                    {step.caution && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div><h4 className="font-medium text-rose-300 mb-1">Caution</h4><p className="text-rose-100/80 text-sm leading-relaxed">{step.caution}</p></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {(!guide.steps || guide.steps.length === 0) && (
          <div className="ml-24 glass-panel p-8 rounded-2xl text-center">
            <p className="text-muted-foreground">This guide doesn't have any steps yet.</p>
          </div>
        )}

        <div className="relative flex gap-6 md:gap-8 pt-8">
          <div className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 flex items-center">
            <h3 className="text-xl font-medium text-white/80">Guide Complete</h3>
          </div>
        </div>
      </div>

      {/* ── Forms Section ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-16 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Forms</h2>
              <p className="text-xs text-white/40">
                {formsLoading ? "Loading…" : `${forms?.length || 0} form${forms?.length !== 1 ? "s" : ""} attached`}
              </p>
            </div>
          </div>
          <Button
            onClick={openNewForm}
            className="bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Form
          </Button>
        </div>

        {formsLoading ? (
          <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 glass-panel rounded-xl" />)}</div>
        ) : forms && forms.length > 0 ? (
          <div className="space-y-3">
            {forms.map((form, i) => (
              <motion.div key={form.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <FormCard form={form} guideId={id} onEdit={openEditForm} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-10 text-center border border-dashed border-white/10">
            <ClipboardList className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 font-medium mb-1">No forms yet</p>
            <p className="text-white/25 text-sm mb-4">Add a form to collect feedback, signatures, quiz responses, and more.</p>
            <Button onClick={openNewForm} className="bg-indigo-600/70 hover:bg-indigo-500 text-white border border-indigo-500/30 text-sm">
              <Plus className="w-4 h-4 mr-2" /> Create first form
            </Button>
          </div>
        )}
      </motion.div>

      {/* ── Signatures Section ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Signatures</h2>
              <p className="text-xs text-white/40">
                {sigsLoading ? "Loading…" : `${signatures?.length || 0} acknowledgment${signatures?.length !== 1 ? "s" : ""} recorded`}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setSigModalOpen(true)}
            className="bg-blue-600/80 hover:bg-blue-500 text-white border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
          >
            <PenLine className="w-4 h-4 mr-2" /> Sign this Guide
          </Button>
        </div>

        {sigsLoading ? (
          <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-24 glass-panel rounded-xl" />)}</div>
        ) : signatures && signatures.length > 0 ? (
          <div className="space-y-3">
            {signatures.map((sig, i) => (
              <motion.div key={sig.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 border border-white/8"
              >
                <div className="shrink-0 w-44 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                  <img src={sig.signatureDataUrl} alt={`Signature by ${sig.signerName}`} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-medium"><User className="w-4 h-4 text-white/40 shrink-0" />{sig.signerName}</div>
                  <div className="flex items-center gap-2 text-sm text-white/50"><Mail className="w-3.5 h-3.5 shrink-0" />{sig.signerEmail}</div>
                  <div className="flex items-center gap-2 text-xs text-white/35"><Clock className="w-3 h-3 shrink-0" />{format(new Date(sig.signedAt), "MMMM d, yyyy 'at' h:mm a")}</div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-10 text-center border border-dashed border-white/10">
            <ShieldCheck className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 font-medium mb-1">No signatures yet</p>
            <p className="text-white/25 text-sm">Be the first to sign off on this guide.</p>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <SignatureModal guideId={id} guideTitle={guide.title} isOpen={sigModalOpen} onClose={() => setSigModalOpen(false)} />
      <FormEditorModal guideId={id} form={editingForm} isOpen={formEditorOpen} onClose={() => setFormEditorOpen(false)} />
    </div>
  );
}
