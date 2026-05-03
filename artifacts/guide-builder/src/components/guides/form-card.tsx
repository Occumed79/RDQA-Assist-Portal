import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList, ChevronDown, Edit2, Trash2, Users, Send,
  Type, AlignLeft, CheckSquare, CircleDot, List, Hash, Star, Calendar, PenLine,
  User, Mail, Clock, ChevronRight, Link2
} from "lucide-react";
import { useListFormSubmissions, useDeleteGuideForm, getListGuideFormsQueryKey, getListFormSubmissionsQueryKey } from "@workspace/api-client-react";
import type { GuideForm, FormField, GuideFormSubmission } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { FormFillModal } from "./form-fill-modal";

const FIELD_ICONS: Record<FormField["type"], React.ElementType> = {
  text: Type, textarea: AlignLeft, checkbox: CheckSquare, radio: CircleDot,
  select: List, number: Hash, rating: Star, date: Calendar, signature: PenLine,
};

function SubmissionRow({ sub, fields }: { sub: GuideFormSubmission; fields: FormField[] }) {
  const [open, setOpen] = useState(false);
  const answers = (sub?.answers || {}) as Record<string, unknown>;

  return (
    <div className="rounded-lg border border-white/8 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/4 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{sub?.submitterName}</p>
            <p className="text-xs text-white/40 truncate">{sub?.submitterEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-xs text-white/30 hidden sm:inline">
            {sub?.submittedAt ? format(new Date(sub.submittedAt), "MMM d, yyyy") : ""}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="px-4 py-3 space-y-3 bg-white/2">
              <div className="flex items-center gap-4 text-xs text-white/35">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{sub?.submitterEmail}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{sub?.submittedAt ? format(new Date(sub.submittedAt), "MMM d, yyyy 'at' h:mm a") : ""}</span>
              </div>
              <div className="space-y-2">
                {fields.map(field => {
                  const answer = answers[field.id];
                  if (answer === undefined || answer === null || answer === "") return null;
                  return (
                    <div key={field.id} className="text-sm">
                      <p className="text-white/40 text-xs mb-1">{field.label}</p>
                      {field.type === "signature" ? (
                        <div className="w-36 h-12 rounded bg-white/5 border border-white/10 overflow-hidden">
                          <img src={answer as string} alt="Signature" className="w-full h-full object-contain" />
                        </div>
                      ) : field.type === "rating" ? (
                        <p className="text-white/80">{"★".repeat(answer as number)}{"☆".repeat(5 - (answer as number))}</p>
                      ) : field.type === "checkbox" ? (
                        <p className="text-white/80">{answer ? "Yes" : "No"}</p>
                      ) : (
                        <p className="text-white/80 whitespace-pre-wrap">{String(answer)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FormCard({ form, guideId, onEdit }: { form: GuideForm; guideId: number; onEdit: (f: GuideForm) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [fillOpen, setFillOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteForm = useDeleteGuideForm();

  const { data: submissions, isLoading: sigsLoading } = useListFormSubmissions(form.id, {
    query: { enabled: expanded, queryKey: getListFormSubmissionsQueryKey(form.id) }
  });

  const handleDelete = () => {
    if (!confirm(`Delete form "${form.title}"? This will also delete all submissions.`)) return;
    deleteForm.mutate({ id: form.id }, {
      onSuccess: () => {
        toast.success("Form deleted");
        queryClient.invalidateQueries({ queryKey: getListGuideFormsQueryKey(guideId) });
      },
      onError: () => toast.error("Failed to delete form"),
    });
  };

  const handleShare = () => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const url = `${window.location.origin}${base}/forms/${form.publicToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
  };

  const fields = (form.fields as FormField[]).slice().sort((a, b) => a.order - b.order);

  return (
    <>
      <Card className="glass-panel rounded-xl overflow-hidden border border-white/8">
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{form.title}</p>
            <p className="text-xs text-white/40">
              {fields.length} field{fields.length !== 1 ? "s" : ""}
              {form.description ? ` · ${form.description}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button type="button" variant="ghost" size="sm" onClick={() => setFillOpen(true)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 gap-1.5 text-xs h-7 px-2">
              <Send className="w-3.5 h-3.5" /> Fill out
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleShare}
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-1.5 text-xs h-7 px-2">
              <Link2 className="w-3.5 h-3.5" /> Share
            </Button>
            <Button type="button" variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/8" onClick={() => onEdit(form)}>
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-rose-400 hover:bg-rose-400/10" onClick={handleDelete} disabled={deleteForm.isPending}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/8" onClick={() => setExpanded(e => !e)}>
              <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Field chips */}
        {fields.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {fields.map(f => {
              const Icon = FIELD_ICONS[f.type] || Type;
              return (
                <span key={f.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-white/50 text-xs">
                  <Icon className="w-3 h-3" /> {f.label || f.type}
                  {f.required && <span className="text-rose-400 ml-0.5">*</span>}
                </span>
              );
            })}
          </div>
        )}

        {/* Submissions expand */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/8"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Users className="w-4 h-4" />
                  <span>{sigsLoading ? "Loading…" : `${submissions?.length || 0} submission${submissions?.length !== 1 ? "s" : ""}`}</span>
                </div>
                {sigsLoading ? (
                  <div className="space-y-2">{[1, 2].map(i => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="space-y-2">
                    {submissions.map(sub => <SubmissionRow key={sub.id} sub={sub} fields={fields} />)}
                  </div>
                ) : (
                  <p className="text-white/25 text-xs text-center py-3">No submissions yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <FormFillModal form={form} isOpen={fillOpen} onClose={() => setFillOpen(false)} />
    </>
  );
}
