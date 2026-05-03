import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, ClipboardList } from "lucide-react";
import { useCreateGuideForm, useUpdateGuideForm, getListGuideFormsQueryKey } from "@workspace/api-client-react";
import type { GuideForm, FormField } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormBuilder } from "./form-builder";

interface FormEditorModalProps {
  guideId: number;
  form: GuideForm | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FormEditorModal({ guideId, form, isOpen, onClose }: FormEditorModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const queryClient = useQueryClient();

  const createForm = useCreateGuideForm();
  const updateForm = useUpdateGuideForm();

  useEffect(() => {
    if (isOpen) {
      setTitle(form?.title || "");
      setDescription(form?.description || "");
      setFields((form?.fields as FormField[]) || []);
    }
  }, [isOpen, form]);

  const isEditing = !!form;
  const isPending = createForm.isPending || updateForm.isPending;

  const handleSave = () => {
    if (!title.trim()) { toast.error("Form title is required"); return; }
    if (isEditing) {
      updateForm.mutate(
        { id: form.id, data: { title: title.trim(), description, fields } },
        {
          onSuccess: () => {
            toast.success("Form updated");
            queryClient.invalidateQueries({ queryKey: getListGuideFormsQueryKey(guideId) });
            onClose();
          },
          onError: () => toast.error("Failed to update form"),
        }
      );
    } else {
      createForm.mutate(
        { id: guideId, data: { title: title.trim(), description, fields } },
        {
          onSuccess: () => {
            toast.success("Form created");
            queryClient.invalidateQueries({ queryKey: getListGuideFormsQueryKey(guideId) });
            onClose();
          },
          onError: () => toast.error("Failed to create form"),
        }
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl glass-panel rounded-2xl overflow-hidden border border-white/12 shadow-[0_0_60px_rgba(59,130,246,0.15)] flex flex-col"
            style={{ maxHeight: "92vh" }}
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
                  <h2 className="font-semibold text-white text-lg">{isEditing ? "Edit Form" : "Create New Form"}</h2>
                  <p className="text-xs text-white/40">Add fields to collect structured responses</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/30 hover:text-white hover:bg-white/8 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Form meta */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Form Title</Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Completion Acknowledgment, Feedback Survey, Incident Report…"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-blue-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Description (optional)</Label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What is this form for? Shown to respondents above the fields."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 min-h-[60px] focus-visible:ring-blue-500/40 text-sm"
                    rows={2}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-white/30">Form Fields</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Field builder */}
              <FormBuilder fields={fields} onChange={setFields} />
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/8 flex items-center justify-between shrink-0">
              <p className="text-xs text-white/30">{fields.length} field{fields.length !== 1 ? "s" : ""} configured</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose} className="border-white/10 text-white/60 hover:text-white hover:bg-white/8">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isPending || !title.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all disabled:opacity-40"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isPending ? "Saving…" : isEditing ? "Save Changes" : "Create Form"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
