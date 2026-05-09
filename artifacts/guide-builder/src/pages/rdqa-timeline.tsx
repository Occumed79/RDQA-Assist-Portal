import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, ChevronRight, User, ArrowRight, Info } from "lucide-react";

const allSteps = [
  {
    id: 1,
    label: "RDQA Issued",
    description: "Occu-Med has issued a Request for Documentation / Quality Assurance letter based on findings from your medical evaluation.",
    action: "Review the RDQA letter you received. Note all conditions listed and the deadline.",
    tip: "The conditions requiring follow-up are typically listed on page 2 of the letter.",
  },
  {
    id: 2,
    label: "Applicant Notified",
    description: "You have been contacted by an EQA analyst with instructions on how to respond to the RDQA.",
    action: "Read the email or letter from Occu-Med carefully. Contact your analyst if you have questions.",
    tip: "Save the analyst's contact information. You can reach out at any time for clarification.",
  },
  {
    id: 3,
    label: "Provider Packet Prepared",
    description: "The provider packet — including the RDQA letter, job functions, and checklist — has been assembled for your provider.",
    action: "Use the Provider Letter Generator on this portal to create your provider packet, or ask your analyst for one.",
    tip: "Give your provider a copy of the RDQA letter AND the job functions document. Both are needed.",
  },
  {
    id: 4,
    label: "Provider Appointment Scheduled",
    description: "You have scheduled an appointment with the appropriate provider to obtain the required documentation.",
    action: "Schedule your appointment. Bring the provider packet and any relevant medical records.",
    tip: "Ask the provider to respond to each bullet point specifically, not just in general terms.",
  },
  {
    id: 5,
    label: "Documents Uploaded",
    description: "All required documentation has been gathered and submitted to Occu-Med for review.",
    action: "Upload all documents through the portal or send them to your analyst. Use the checklist to confirm nothing is missing.",
    tip: "Check the Document Checklist page before submitting to avoid delays.",
  },
  {
    id: 6,
    label: "EQA Review",
    description: "An EQA analyst is reviewing your submitted documentation for completeness and accuracy.",
    action: "No action needed. Your analyst will contact you if anything is missing or unclear.",
    tip: "Response times vary. Contact your analyst if you have not heard back within 5 business days.",
  },
  {
    id: 7,
    label: "SME Review (if applicable)",
    description: "A Subject Matter Expert (SME) or medical reviewer is evaluating the documentation against job requirements and guidelines.",
    action: "No action needed at this stage. Your analyst will update you on the outcome.",
    tip: "SME review is not required for all cases. Your analyst will let you know if it applies.",
  },
  {
    id: 8,
    label: "Final Recommendation",
    description: "Occu-Med has completed its review and issued a final recommendation to the client/employer.",
    action: "You will be notified of the outcome. Contact your analyst or HR representative with any questions.",
    tip: "Occu-Med's recommendation is based on documentation provided. If you disagree, ask your analyst about the reconsideration process.",
  },
];

export default function RdqaTimelinePage() {
  const [currentStep, setCurrentStep] = useState(3);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">Applicant Timeline</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Track where you are in the RDQA process and what your next step is. Each stage shows what action is needed and helpful tips.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-white/40">Simulate step:</span>
          <div className="flex gap-1">
            {allSteps.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  s.id === currentStep
                    ? "bg-blue-500 text-white"
                    : s.id < currentStep
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-white/30 border border-white/10"
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Next Step Banner */}
      {currentStep <= allSteps.length && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-5 border border-blue-400/25 bg-blue-500/8"
        >
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400/70 mb-1">Your Next Step</p>
              <p className="text-white font-semibold">{allSteps[currentStep - 1]?.action}</p>
              {allSteps[currentStep - 1]?.tip && (
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/50">{allSteps[currentStep - 1].tip}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <Card className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="space-y-0">
          {allSteps.map((step, idx) => {
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isPending = step.id > currentStep;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4"
              >
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isComplete
                        ? "bg-emerald-500/20 border border-emerald-500/40"
                        : isCurrent
                        ? "bg-blue-500/20 border-2 border-blue-400"
                        : "bg-white/5 border border-white/15"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                  {idx < allSteps.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${
                        isComplete ? "bg-emerald-500/30" : "bg-white/8"
                      }`}
                      style={{ minHeight: "24px" }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-6 flex-1 ${ idx === allSteps.length - 1 ? "pb-0" : "" }`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`font-semibold text-sm ${
                        isComplete ? "text-emerald-400" : isCurrent ? "text-white" : "text-white/35"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold uppercase tracking-wide">
                        Current
                      </span>
                    )}
                    {isComplete && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold uppercase tracking-wide">
                        Done
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${ isPending ? "text-white/25" : "text-white/55" }`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}