import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Activity,
  Wind,
  Moon,
  Brain,
  Bone,
  Stethoscope,
  AlertTriangle,
  FileText,
  CheckSquare,
  Download,
  Info,
} from "lucide-react";

interface ConditionData {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  trigger: string;
  officialLanguage: string;
  plainEnglish: string;
  providerChecklist: string[];
  documentsNeeded: string[];
  commonMistakes: string[];
  providerType: string;
}

const conditions: ConditionData[] = [
  {
    id: "hypertension",
    name: "Elevated Blood Pressure / Hypertension",
    icon: Heart,
    color: "text-red-400",
    trigger: "Blood pressure readings were elevated during the pre-employment or periodic medical evaluation.",
    officialLanguage: "Elevated blood pressure warrants evaluation by physician and documentation of control. For reconsideration, employee should provide at least 3 clinical blood pressure readings taken over a period of at least one week demonstrating control, and a report from a medical evaluation identifying the presence of any impairing symptomatology or target organ damage relevant to safe performance of essential job functions.",
    plainEnglish: "Your blood pressure readings were elevated. Occu-Med needs updated clinical readings and a provider statement explaining whether your blood pressure is controlled and whether there are symptoms or organ damage that could affect safe job performance. This tool does not provide medical advice or determine qualification — it helps explain the documentation requested in your RDQA letter.",
    providerChecklist: [
      "Provide at least 3 clinical blood pressure readings taken over at least one week.",
      "Confirm whether blood pressure is currently controlled.",
      "Identify whether there is end-organ or target-organ damage (heart, kidneys, eyes, brain).",
      "Address symptoms such as dizziness, chest pain, fainting, or shortness of breath.",
      "List all current medications for blood pressure.",
      "State whether medications cause any impairing side effects.",
      "State whether ongoing monitoring is needed during the work/deployment period.",
      "Address whether restrictions or reasonable accommodations are needed.",
      "Confirm whether the applicant can safely perform the essential job functions (attached).",
    ],
    documentsNeeded: [
      "3 clinical blood pressure readings (dated, from a provider's office)",
      "Provider letter addressing each bullet point in the RDQA letter",
      "Current medication list",
      "Any relevant lab results (BMP, creatinine, urinalysis if ordered)",
    ],
    commonMistakes: [
      "Submitting home blood pressure readings instead of clinical readings.",
      "Providing fewer than 3 readings or readings taken on the same day.",
      "Provider letter that does not address target organ damage or symptoms.",
      "Not mentioning whether restrictions or accommodations are needed.",
      "Provider addressing general health rather than the specific job functions.",
    ],
    providerType: "Primary care physician, internist, or cardiologist.",
  },
  {
    id: "diabetes",
    name: "Elevated A1c / Diabetes",
    icon: Activity,
    color: "text-amber-400",
    trigger: "Hemoglobin A1c result was elevated during the medical evaluation, suggesting possible diabetes, prediabetes, or another underlying condition.",
    officialLanguage: "Elevated hemoglobin A1c requires report from evaluation and statement from personal physician addressing whether the results are diagnostic of an underlying medical condition, whether there is target organ damage, related complications, or impairing symptomatology, list of instituted treatment, and any ongoing monitoring indicated over the deployment term of 1 year. Newly diagnosed diabetic individuals should also have documentation of a complete initial diabetic evaluation, including eye exam, foot exam, nutrition counseling, etc.",
    plainEnglish: "Your A1c result was elevated. Occu-Med needs your provider to explain whether this means you have diabetes or another medical condition, whether there are any complications, what treatment was started, and whether you will need ongoing monitoring. This tool does not provide medical advice or determine qualification.",
    providerChecklist: [
      "Does the A1c result indicate diabetes, prediabetes, or another diagnosis?",
      "Are there any complications such as kidney, nerve, eye, heart, circulation, or other target-organ issues?",
      "Are there any symptoms that could impair safe job performance?",
      "What treatment was started (medication, lifestyle, diet)?",
      "What medication or lifestyle plan is being used?",
      "Is ongoing monitoring needed during the deployment or work period?",
      "If newly diagnosed: was a diabetic foot exam completed?",
      "If newly diagnosed: was nutrition counseling completed?",
      "If newly diagnosed: was an eye exam completed (if applicable)?",
      "Does the condition impact the applicant's ability to perform the essential job functions?",
      "Are restrictions or reasonable accommodations needed?",
    ],
    documentsNeeded: [
      "Provider letter addressing each RDQA bullet point",
      "A1c lab result (recent)",
      "Current medication list",
      "Eye exam documentation (if newly diagnosed)",
      "Foot exam documentation (if newly diagnosed)",
      "Nutrition counseling documentation (if newly diagnosed)",
    ],
    commonMistakes: [
      "Provider letter that does not address whether A1c is diagnostic of a specific condition.",
      "Missing documentation of initial diabetic evaluation for newly diagnosed individuals.",
      "Not addressing target organ damage or complications.",
      "Failing to state whether the condition affects job function performance.",
      "Not including a medication list or monitoring plan.",
    ],
    providerType: "Primary care physician, internist, or endocrinologist for complex cases.",
  },
  {
    id: "asthma",
    name: "Asthma / Respiratory Condition",
    icon: Wind,
    color: "text-cyan-400",
    trigger: "History of asthma or respiratory condition was noted, or spirometry/PFT results were abnormal during the evaluation.",
    officialLanguage: "Respiratory conditions require evaluation by a physician and documentation of current status, control, and functional capacity. Provider should address current symptom frequency, medication use, triggers, and whether the condition is likely to impact safe performance of essential job functions in the work environment.",
    plainEnglish: "Occu-Med needs your provider to explain the current status of your respiratory condition, how well it is controlled, what medications you use, and whether it could affect your ability to safely perform the job duties. This tool does not provide medical advice or determine qualification.",
    providerChecklist: [
      "Current diagnosis and severity classification (intermittent, mild, moderate, severe).",
      "Current symptom frequency and triggers.",
      "Current medication list (rescue and controller inhalers).",
      "Date of most recent pulmonary function test (PFT/spirometry) and results.",
      "Whether the condition is currently well-controlled.",
      "Whether the work environment (dust, fumes, physical exertion) could trigger symptoms.",
      "Whether any restrictions or accommodations are needed.",
      "Whether the applicant can safely perform the essential job functions (attached).",
    ],
    documentsNeeded: [
      "Provider letter addressing each RDQA bullet point",
      "Pulmonary function test (PFT/spirometry) results if available",
      "Current medication list",
      "Any specialist notes (pulmonologist) if applicable",
    ],
    commonMistakes: [
      "Not including PFT results when they were ordered.",
      "Provider letter that does not address the specific work environment.",
      "Failing to address whether the condition is currently controlled.",
      "Not mentioning rescue inhaler use frequency.",
      "Not addressing restrictions or accommodations.",
    ],
    providerType: "Primary care physician or pulmonologist for moderate-to-severe cases.",
  },
  {
    id: "sleep-apnea",
    name: "Sleep Apnea",
    icon: Moon,
    color: "text-indigo-400",
    trigger: "History of sleep apnea was noted, or symptoms suggesting sleep-disordered breathing were identified during the evaluation.",
    officialLanguage: "Sleep apnea requires documentation of current treatment compliance and effectiveness. Provider should address current treatment modality (CPAP, BiPAP, oral appliance, surgical), compliance data if available, current symptom status, and whether daytime sleepiness or other symptoms could impair safe performance of essential job functions.",
    plainEnglish: "Occu-Med needs your provider to confirm that your sleep apnea is being treated, that you are compliant with treatment, and that you do not have symptoms (like daytime sleepiness) that could affect safe job performance. This tool does not provide medical advice or determine qualification.",
    providerChecklist: [
      "Current diagnosis and severity (mild, moderate, severe AHI).",
      "Current treatment modality (CPAP, BiPAP, oral appliance, surgery, positional therapy).",
      "CPAP/BiPAP compliance data if available (hours per night, AHI on therapy).",
      "Current symptom status: daytime sleepiness, fatigue, cognitive effects.",
      "Epworth Sleepiness Scale score if available.",
      "Whether treatment is effective and condition is controlled.",
      "Whether any restrictions or accommodations are needed.",
      "Whether the applicant can safely perform the essential job functions (attached).",
    ],
    documentsNeeded: [
      "Provider letter addressing each RDQA bullet point",
      "Sleep study (polysomnography) results if available",
      "CPAP compliance download/report if applicable",
      "Current medication list",
    ],
    commonMistakes: [
      "Not providing CPAP compliance data when CPAP is prescribed.",
      "Provider letter that does not address daytime sleepiness or cognitive effects.",
      "Failing to address whether the condition is controlled on current treatment.",
      "Not addressing whether restrictions are needed for safety-sensitive tasks.",
    ],
    providerType: "Primary care physician or sleep medicine specialist.",
  },
  {
    id: "behavioral-health",
    name: "Behavioral Health / Mental Health History",
    icon: Brain,
    color: "text-purple-400",
    trigger: "History of a behavioral health condition (depression, anxiety, PTSD, bipolar disorder, etc.) was noted during the evaluation.",
    officialLanguage: "Behavioral health conditions require documentation from a treating provider or mental health professional addressing current diagnosis, treatment status, stability, and whether any symptoms could impair safe performance of essential job functions. Provider should address current medication, therapy, and any restrictions or accommodations needed.",
    plainEnglish: "Occu-Med needs documentation from your treating provider or mental health professional explaining your current status, whether your condition is stable and treated, and whether it could affect your ability to safely perform the job duties. This tool does not provide medical advice or determine qualification.",
    providerChecklist: [
      "Current diagnosis and DSM classification if applicable.",
      "Current treatment: medication, therapy, or both.",
      "Current stability and symptom status.",
      "Date of most recent evaluation or appointment.",
      "Whether the condition is currently well-managed.",
      "Whether any symptoms (mood instability, concentration, impulse control, etc.) could impair job performance.",
      "Whether any restrictions or accommodations are needed.",
      "Whether the applicant can safely perform the essential job functions (attached).",
    ],
    documentsNeeded: [
      "Provider or mental health professional letter addressing each RDQA bullet point",
      "Current medication list",
      "Any relevant evaluation or assessment notes",
    ],
    commonMistakes: [
      "Submitting a letter from a non-treating provider who has not evaluated the applicant.",
      "Provider letter that does not address current stability or treatment.",
      "Not addressing whether symptoms could impair job-specific functions.",
      "Failing to address restrictions or accommodations.",
      "Letter that is too vague and does not respond to each bullet point.",
    ],
    providerType: "Treating psychiatrist, psychologist, licensed therapist, or primary care physician.",
  },
  {
    id: "orthopedic",
    name: "Orthopedic / Musculoskeletal Conditions",
    icon: Bone,
    color: "text-orange-400",
    trigger: "History of back pain, joint condition, prior injury, or musculoskeletal limitation was noted during the evaluation.",
    officialLanguage: "Musculoskeletal conditions require documentation from a treating provider addressing current diagnosis, functional status, and whether the condition is likely to impact safe performance of the essential job functions. Provider should address range of motion, strength, pain levels, activity limitations, and any restrictions or accommodations needed.",
    plainEnglish: "Occu-Med needs your provider to explain your current condition, how it affects your movement and strength, and whether it could affect your ability to safely perform the job duties. This tool does not provide medical advice or determine qualification.",
    providerChecklist: [
      "Current diagnosis and affected area (spine, knee, shoulder, ankle, etc.).",
      "Current functional status: range of motion, strength, pain level.",
      "Current treatment: physical therapy, medication, injections, surgery.",
      "Date of most recent evaluation or imaging.",
      "Whether the condition is stable or progressing.",
      "Specific functional limitations relevant to the job duties (lifting, standing, walking, etc.).",
      "Whether any restrictions or accommodations are needed.",
      "Whether the applicant can safely perform the essential job functions (attached).",
    ],
    documentsNeeded: [
      "Provider letter addressing each RDQA bullet point",
      "Relevant imaging reports (X-ray, MRI) if available",
      "Physical therapy notes if applicable",
      "Current medication list",
    ],
    commonMistakes: [
      "Provider letter that does not address specific functional limitations.",
      "Not addressing whether the condition affects the specific job duties listed.",
      "Failing to address restrictions or accommodations.",
      "Not including imaging results when they were ordered.",
      "Letter that addresses general health rather than job-specific function.",
    ],
    providerType: "Primary care physician, orthopedic surgeon, or physiatrist.",
  },
  {
    id: "cardiac",
    name: "Cardiac History",
    icon: Stethoscope,
    color: "text-rose-400",
    trigger: "History of cardiac condition (prior heart attack, arrhythmia, heart failure, valve disease, etc.) was noted during the evaluation.",
    officialLanguage: "Cardiac conditions require documentation from a treating cardiologist or physician addressing current diagnosis, treatment status, functional capacity, and whether the condition is likely to impact safe performance of essential job functions. Provider should address current symptoms, exercise tolerance, medication, and any restrictions or accommodations needed.",
    plainEnglish: "Occu-Med needs documentation from your cardiologist or treating physician explaining your current cardiac status, whether your condition is stable and treated, and whether it could affect your ability to safely perform the job duties. This tool does not provide medical advice or determine qualification.",
    providerChecklist: [
      "Current cardiac diagnosis and history.",
      "Current treatment: medication, device (pacemaker/ICD), surgical history.",
      "Current symptom status: chest pain, shortness of breath, palpitations, syncope.",
      "Most recent cardiac testing results (EKG, stress test, echocardiogram) and dates.",
      "Current functional capacity (METs if available).",
      "Whether the condition is currently stable and controlled.",
      "Whether any restrictions or accommodations are needed.",
      "Whether the applicant can safely perform the essential job functions (attached).",
    ],
    documentsNeeded: [
      "Cardiologist or treating physician letter addressing each RDQA bullet point",
      "Recent EKG results",
      "Stress test or echocardiogram results if applicable",
      "Current medication list",
      "Any device clinic notes (pacemaker/ICD) if applicable",
    ],
    commonMistakes: [
      "Submitting a letter from a primary care provider when a cardiologist evaluation was requested.",
      "Not including recent cardiac testing results.",
      "Provider letter that does not address functional capacity or exercise tolerance.",
      "Failing to address restrictions or accommodations.",
      "Not addressing whether the condition is currently stable.",
    ],
    providerType: "Cardiologist; primary care physician for minor or well-controlled conditions.",
  },
];

function ConditionCard({ condition }: { condition: ConditionData }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = condition.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl border border-white/10 overflow-hidden"
    >
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className={`w-5 h-5 ${condition.color}`} />
          </div>
          <div>
            <h2 className="font-semibold text-white text-base">{condition.name}</h2>
            <p className="text-sm text-white/50 mt-0.5 leading-relaxed">{condition.trigger}</p>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 space-y-5 border-t border-white/8 pt-5">
              <div className="flex gap-2 rounded-xl bg-blue-500/10 border border-blue-400/20 p-3">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300/80 leading-relaxed">
                  This tool does not provide medical advice or determine qualification. It helps explain the documentation requested in your RDQA letter and organizes the information needed for review. The provider must make clinical assessments.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-white/40" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Official RDQA Language</h3>
                </div>
                <blockquote className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 italic leading-relaxed">
                  {condition.officialLanguage}
                </blockquote>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-cyan-400/70">What This Means</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                  {condition.plainEnglish}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/50">Provider type: </span>
                <span className="text-xs text-white/80">{condition.providerType}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70">Provider Must Address</h3>
                </div>
                <div className="space-y-2">
                  {condition.providerChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-emerald-400">{i + 1}</span>
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400/70">Documents to Upload</h3>
                </div>
                <div className="space-y-1.5">
                  {condition.documentsNeeded.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/65">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0 mt-2" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-red-400/70">Common Mistakes</h3>
                </div>
                <div className="space-y-1.5">
                  {condition.commonMistakes.map((mistake, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/65">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0 mt-2" />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RdqaConditionsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white">Condition Pages</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Plain-English explanations for each RDQA condition. Click any condition to see the official language, what it means, what your provider must address, documents to upload, and common mistakes to avoid.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-400/20 px-3 py-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-blue-300/80">
            Occu-Med is not providing medical advice. This portal helps explain what documentation is needed for review.
          </span>
        </div>
      </motion.div>

      <div className="space-y-3">
        {conditions.map((condition, i) => (
          <motion.div
            key={condition.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ConditionCard condition={condition} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}