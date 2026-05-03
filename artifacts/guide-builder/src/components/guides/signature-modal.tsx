import { useRef, useEffect, useState, useCallback } from "react";
import SignaturePad from "signature_pad";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, RotateCcw, PenLine, CheckCircle2, ShieldCheck } from "lucide-react";
import { useCreateGuideSignature, useListGuideSignatures, getListGuideSignaturesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

interface SignatureModalProps {
  guideId: number;
  guideTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SignatureModal({ guideId, guideTitle, isOpen, onClose }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const createSignature = useCreateGuideSignature();

  const initPad = useCallback(() => {
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
    pad.addEventListener("endStroke", () => setIsEmpty(pad.isEmpty()));
    padRef.current = pad;
    setIsEmpty(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(initPad, 50);
    } else {
      padRef.current?.off();
    }
  }, [isOpen, initPad]);

  const handleClear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error("Please enter your full name"); return; }
    if (!email.trim() || !email.includes("@")) { toast.error("Please enter a valid email"); return; }
    if (!padRef.current || padRef.current.isEmpty()) { toast.error("Please draw your signature"); return; }

    const signatureDataUrl = padRef.current.toDataURL("image/png");

    createSignature.mutate(
      { id: guideId, data: { signerName: name.trim(), signerEmail: email.trim(), signatureDataUrl } },
      {
        onSuccess: () => {
          toast.success("Guide signed successfully");
          queryClient.invalidateQueries({ queryKey: getListGuideSignaturesQueryKey(guideId) });
          onClose();
          setName("");
          setEmail("");
          padRef.current?.clear();
          setIsEmpty(true);
        },
        onError: () => toast.error("Failed to submit signature"),
      }
    );
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
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.2)] border border-white/15"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-lg">Sign Guide</h2>
                  <p className="text-xs text-white/50 truncate max-w-[260px]">{guideTitle}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/40 hover:text-white hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Full Name</Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-blue-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Email Address</Label>
                  <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder="jane@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Signature Canvas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70 text-sm flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5" /> Draw Signature
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-7 text-xs text-white/40 hover:text-white hover:bg-white/10 gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </Button>
                </div>
                <div className="relative rounded-xl border border-white/15 bg-white/5 overflow-hidden" style={{ height: 140 }}>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none cursor-crosshair"
                    style={{ display: "block" }}
                  />
                  {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-white/20 text-sm select-none">Sign here</p>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 right-4 border-t border-white/15 pointer-events-none" />
                </div>
              </div>

              <p className="text-xs text-white/35 leading-relaxed">
                By signing, you confirm that you have read and understood this guide. Your signature, name, and email will be recorded with a timestamp.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleSubmit}
                disabled={createSignature.isPending || isEmpty || !name || !email}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] py-5 text-base disabled:opacity-40 disabled:shadow-none transition-all"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {createSignature.isPending ? "Submitting..." : "Submit Signature"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
