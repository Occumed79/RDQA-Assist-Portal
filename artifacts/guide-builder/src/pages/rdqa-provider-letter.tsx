import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, User, Briefcase, Heart, CheckSquare, Copy, Info, Stethoscope } from "lucide-react";

const conditionOptions = [
  { value: "hypertension", label: "Elevated Blood Pressure / Hypertension" },
  { value: "diabetes", label: "Elevated A1c / Diabetes" },
  { value: "asthma", label: "Asthma / Respiratory Condition" },
  { value: "sleep-apnea", label: "Sleep Apnea" },
  { value: "behavioral-health", label: "Behavioral Health / Mental Health" },
  { value: "orthopedic", label: "Orthopedic / Musculoskeletal Condition" },
  { value: "cardiac", label: "Cardiac History" },
  { value: "weight", label: "Body Weight / BMI" },
  { value: "other", label: "Other (describe below)" },
];

const conditionChecklists: Record<string, string[]> = {
  hypertension: [
    "Provide at least 3 clinical blood pressure readings taken over at least one week.",
    "Confirm whether blood pressure is currently controlled.",
    "Identify whether there is end-organ or target-organ damage (heart, kidneys, eyes, brain).",
    "Address symptoms such as dizziness, chest pain, fainting, or shortness of breath.",
    "List all current blood pressure medications.",
    "State whether medications cause any impairing side effects.",
    "State whether ongoing monitoring is needed during the work/deployment period.",
    "Address whether restrictions or reasonable accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  diabetes: [
    "State whether the A1c result indicates diabetes, prediabetes, or another diagnosis.",
    "Address whether there are complications (kidney, nerve, eye, heart, circulation).",
    "Describe any symptoms that could impair safe job performance.",
    "List treatment started (medication, lifestyle, diet).",
    "State whether ongoing monitoring is needed during the work/deployment period.",
    "If newly diagnosed: confirm whether foot exam, eye exam, and nutrition counseling were completed.",
    "Confirm whether the condition impacts the applicant's ability to perform the essential job functions.",
    "Address whether restrictions or reasonable accommodations are needed.",
  ],
  asthma: [
    "State the current diagnosis and severity classification.",
    "Describe current symptom frequency and triggers.",
    "List current medications (rescue and controller inhalers).",
    "Provide date and results of most recent pulmonary function test (PFT/spirometry).",
    "Confirm whether the condition is currently well-controlled.",
    "Address whether the work environment could trigger symptoms.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  "sleep-apnea": [
    "State the current diagnosis and severity (AHI).",
    "Describe current treatment modality (CPAP, BiPAP, oral appliance, surgery).",
    "Provide CPAP/BiPAP compliance data if available.",
    "Address current symptom status: daytime sleepiness, fatigue, cognitive effects.",
    "Confirm whether treatment is effective and condition is controlled.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  "behavioral-health": [
    "State the current diagnosis.",
    "Describe current treatment: medication, therapy, or both.",
    "Confirm current stability and symptom status.",
    "State the date of most recent evaluation or appointment.",
    "Address whether any symptoms could impair job performance.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  orthopedic: [
    "State the current diagnosis and affected area.",
    "Describe current functional status: range of motion, strength, pain level.",
    "Describe current treatment: physical therapy, medication, injections, surgery.",
    "State the date of most recent evaluation or imaging.",
    "Describe specific functional limitations relevant to the job duties.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  cardiac: [
    "State the current cardiac diagnosis and history.",
    "Describe current treatment: medication, device (pacemaker/ICD), surgical history.",
    "Address current symptoms: chest pain, shortness of breath, palpitations, syncope.",
    "Provide most recent cardiac testing results (EKG, stress test, echocardiogram) and dates.",
    "State current functional capacity (METs if available).",
    "Confirm whether the condition is currently stable and controlled.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  weight: [
    "Confirm current body weight and BMI.",
    "Address whether there are any weight-related health conditions or complications.",
    "Describe any functional limitations relevant to the job duties.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
  other: [
    "Provide current diagnosis and status.",
    "Describe current treatment and management.",
    "Address whether there are symptoms that could impair job performance.",
    "Address whether restrictions or accommodations are needed.",
    "Confirm whether the applicant can safely perform the essential job functions (attached).",
  ],
};

function generateLetter(fields: {
  applicantName: string;
  jobTitle: string;
  employer: string;
  condition: string;
  customCondition: string;
  analystName: string;
  analystPhone: string;
  analystEmail: string;
}): string {
  const conditionLabel =
    fields.condition === "other"
      ? fields.customCondition || "[condition]"
      : conditionOptions.find((c) => c.value === fields.condition)?.label || "[condition]";
  const checklist = conditionChecklists[fields.condition] || conditionChecklists["other"];
  const checklistText = checklist
    .map((item, i) => `  ${String.fromCharCode(97 + i)}) ${item}`)
    .join("\n");
  return `To Whom It May Concern,\n\nWe are writing on behalf of ${fields.applicantName || "[Applicant Name]"}${fields.employer ? `, who is applying for the position of ${fields.jobTitle || "[Job Title]"} with ${fields.employer}` : ""}. As part of our occupational health review process, we are requesting additional medical documentation related to the following condition: ${conditionLabel}.\n\nPlease review the attached essential job functions for the ${fields.jobTitle || "[Job Title]"} position and provide a written statement addressing the following items:\n\n${checklistText}\n\nWe ask that you:\n\u2022 Be as specific as possible when addressing each item above.\n\u2022 Ensure that your responses address the applicant's ability to perform the essential job functions of the specific role, rather than general return-to-work status.\n\u2022 Include the results of any additional testing performed and reference relevant medical history where indicated.\n\u2022 Clearly state whether restrictions or reasonable accommodations are needed.\n\nIMPORTANT: Occu-Med is not requesting a determination of fitness or a medical opinion on employment eligibility. We are requesting factual clinical information to support our occupational health review process.\n\nPlease return the completed letter to:\n${fields.analystName || "[EQA Analyst Name]"}\n${fields.analystPhone ? `Phone: ${fields.analystPhone}` : ""}\n${fields.analystEmail ? `Email: ${fields.analystEmail}` : ""}\n\nThank you for your time and cooperation. If you have any questions, please do not hesitate to reach out.\n\nSincerely,\nOccu-Med EQA Department`;
}

export default function RdqaProviderLetterPage() {
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState({
    applicantName: "",
    jobTitle: "",
    employer: "",
    condition: "",
    customCondition: "",
    analystName: "",
    analystPhone: "",
    analystEmail: "",
  });

  const letter = generateLetter(fields);

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all";
  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">Provider Letter Generator</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Fill in the fields below to generate a provider packet letter with a condition-specific checklist of exactly what the provider must address.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-400/20 px-3 py-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-blue-300/80">This letter is a template. Review and adjust before sending. Occu-Med is not providing medical advice.</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <h2 className="font-semibold text-white text-sm uppercase tracking-widest">Applicant Info</h2>
            </div>
            <div>
              <label className={labelClass}>Applicant Name</label>
              <input className={inputClass} placeholder="e.g. Jane Smith" value={fields.applicantName} onChange={(e) => setFields((f) => ({ ...f, applicantName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Title</label>
                <input className={inputClass} placeholder="e.g. Recreation Aide" value={fields.jobTitle} onChange={(e) => setFields((f) => ({ ...f, jobTitle: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Employer / Client</label>
                <input className={inputClass} placeholder="e.g. County Parks" value={fields.employer} onChange={(e) => setFields((f) => ({ ...f, employer: e.target.value }))} />
              </div>
            </div>
            <div className="border-t border-white/8 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-red-400" />
                <h2 className="font-semibold text-white text-sm uppercase tracking-widest">Condition</h2>
              </div>
              <div>
                <label className={labelClass}>RDQA Condition</label>
                <select className={inputClass + " cursor-pointer"} value={fields.condition} onChange={(e) => setFields((f) => ({ ...f, condition: e.target.value }))}>
                  <option value="" disabled>Select a condition...</option>
                  {conditionOptions.map((opt) => (<option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>))}
                </select>
              </div>
              {fields.condition === "other" && (
                <div className="mt-3">
                  <label className={labelClass}>Describe the condition</label>
                  <input className={inputClass} placeholder="Describe the condition..." value={fields.customCondition} onChange={(e) => setFields((f) => ({ ...f, customCondition: e.target.value }))} />
                </div>
              )}
            </div>
            <div className="border-t border-white/8 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <h2 className="font-semibold text-white text-sm uppercase tracking-widest">Analyst Contact</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Analyst Name</label>
                  <input className={inputClass} placeholder="e.g. John Doe, EQA" value={fields.analystName} onChange={(e) => setFields((f) => ({ ...f, analystName: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} placeholder="(555) 000-0000" value={fields.analystPhone} onChange={(e) => setFields((f) => ({ ...f, analystPhone: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} placeholder="analyst@occu-med.com" value={fields.analystEmail} onChange={(e) => setFields((f) => ({ ...f, analystEmail: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4">
          {fields.condition && (
            <Card className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70">Checklist Preview</span>
              </div>
              <div className="space-y-1.5">
                {(conditionChecklists[fields.condition] || conditionChecklists["other"]).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/65">
                    <span className="text-emerald-400 font-bold shrink-0">{String.fromCharCode(97 + i)})</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card className="glass-panel p-5 rounded-2xl border border-white/10 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/40" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Generated Letter</span>
              </div>
              <Button size="sm" variant="outline" className="border-white/15 text-white/70 hover:text-white hover:bg-white/10 text-xs h-7" onClick={handleCopy}>
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="text-xs text-white/65 leading-relaxed whitespace-pre-wrap font-sans max-h-[480px] overflow-y-auto">{letter}</pre>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}