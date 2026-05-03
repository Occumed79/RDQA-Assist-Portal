import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Plus, Trash2, GripVertical, ChevronDown, Type, AlignLeft,
  CheckSquare, CircleDot, List, Hash, Star, Calendar, PenLine, X
} from "lucide-react";
import type { FormField } from "@workspace/api-client-react";

const FIELD_TYPES: { type: FormField["type"]; label: string; icon: React.ElementType; description: string }[] = [
  { type: "text",      label: "Short Text",   icon: Type,        description: "Single line text input" },
  { type: "textarea",  label: "Long Text",    icon: AlignLeft,   description: "Multi-line text area" },
  { type: "checkbox",  label: "Checkbox",     icon: CheckSquare, description: "Yes / No toggle" },
  { type: "radio",     label: "Multiple Choice", icon: CircleDot, description: "Pick one option" },
  { type: "select",    label: "Dropdown",     icon: List,        description: "Select from a list" },
  { type: "number",    label: "Number",       icon: Hash,        description: "Numeric value" },
  { type: "rating",    label: "Star Rating",  icon: Star,        description: "1–5 star rating" },
  { type: "date",      label: "Date",         icon: Calendar,    description: "Date picker" },
  { type: "signature", label: "Signature",    icon: PenLine,     description: "Handwritten signature" },
];

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

function FieldTypeIcon({ type, className }: { type: FormField["type"]; className?: string }) {
  const ft = FIELD_TYPES.find(f => f.type === type);
  if (!ft) return null;
  return <ft.icon className={className} />;
}

function FieldEditor({ field, onChange, onDelete }: { field: FormField; onChange: (f: FormField) => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const hasOptions = field.type === "radio" || field.type === "select";

  return (
    <Card className="glass-panel rounded-xl overflow-hidden group border border-white/8">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
        <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors cursor-grab shrink-0" />
        <div className="w-7 h-7 rounded-md bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
          <FieldTypeIcon type={field.type} className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <span className="flex-1 text-sm font-medium text-white truncate">{field.label || <span className="text-white/30">Untitled field</span>}</span>
        <span className="text-xs text-white/30 shrink-0 hidden sm:inline">{FIELD_TYPES.find(f => f.type === field.type)?.label}</span>
        {field.required && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 shrink-0">Required</span>}
        <Button type="button" variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-rose-400 hover:bg-rose-400/10 shrink-0" onClick={e => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Field Label</Label>
              <Input
                value={field.label}
                onChange={e => onChange({ ...field, label: e.target.value })}
                placeholder="e.g. Your full name"
                className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20 h-8 focus-visible:ring-blue-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Field Type</Label>
              <select
                value={field.type}
                onChange={e => onChange({ ...field, type: e.target.value as FormField["type"], options: undefined })}
                className="w-full h-8 rounded-md bg-white/5 border border-white/10 text-white text-sm px-2 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
              >
                {FIELD_TYPES.map(ft => (
                  <option key={ft.type} value={ft.type} className="bg-[#0d1525]">{ft.label}</option>
                ))}
              </select>
            </div>
          </div>

          {(field.type === "text" || field.type === "textarea" || field.type === "number") && (
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Placeholder (optional)</Label>
              <Input
                value={field.placeholder || ""}
                onChange={e => onChange({ ...field, placeholder: e.target.value })}
                placeholder="Hint text shown inside the field"
                className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20 h-8 focus-visible:ring-blue-500/40"
              />
            </div>
          )}

          {hasOptions && (
            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Options (one per line)</Label>
              <Textarea
                value={(field.options || []).join("\n")}
                onChange={e => onChange({ ...field, options: e.target.value.split("\n").map(o => o.trim()).filter(Boolean) })}
                placeholder={"Option A\nOption B\nOption C"}
                className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20 min-h-[80px] focus-visible:ring-blue-500/40"
                rows={3}
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => onChange({ ...field, required: e.target.checked })}
              className="w-3.5 h-3.5 rounded accent-blue-500"
            />
            <span className="text-xs text-white/60">Required field</span>
          </label>
        </div>
      )}
    </Card>
  );
}

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: "",
      required: false,
      order: fields.length,
    };
    onChange([...fields, newField]);
    setPickerOpen(false);
  };

  const updateField = (id: string, updated: FormField) => {
    onChange(fields.map(f => f.id === id ? updated : f));
  };

  const deleteField = (id: string) => {
    onChange(fields.filter(f => f.id !== id).map((f, i) => ({ ...f, order: i })));
  };

  const handleReorder = (newFields: FormField[]) => {
    onChange(newFields.map((f, i) => ({ ...f, order: i })));
  };

  return (
    <div className="space-y-4">
      <Reorder.Group axis="y" values={fields} onReorder={handleReorder} className="space-y-3">
        {fields.map(field => (
          <Reorder.Item key={field.id} value={field}>
            <FieldEditor
              field={field}
              onChange={updated => updateField(field.id, updated)}
              onDelete={() => deleteField(field.id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {fields.length === 0 && (
        <div className="glass-panel rounded-xl p-8 text-center border border-dashed border-white/10">
          <p className="text-white/30 text-sm">No fields yet. Add a field below to get started.</p>
        </div>
      )}

      {/* Add field button */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(p => !p)}
          className="w-full border-dashed border-white/20 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/30"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Field
        </Button>

        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full mb-2 left-0 right-0 z-30 glass-panel rounded-xl border border-white/15 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-medium text-white/50">Choose field type</span>
              <Button type="button" variant="ghost" size="icon" className="w-5 h-5 text-white/30 hover:text-white" onClick={() => setPickerOpen(false)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {FIELD_TYPES.map(ft => (
                <button
                  key={ft.type}
                  type="button"
                  onClick={() => addField(ft.type)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white/4 hover:bg-white/8 border border-transparent hover:border-blue-500/30 text-center transition-all group"
                >
                  <ft.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-[10px] text-white/60 group-hover:text-white leading-tight">{ft.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
