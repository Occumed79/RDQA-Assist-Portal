import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin, DollarSign, Clock, Stethoscope, Heart, Brain, Bone, Wind, Moon, Activity, ChevronRight, Info, ExternalLink, AlertTriangle } from "lucide-react";

const resourceCategories = [
  {
    id: "primary-care",
    title: "Primary Care / Community Clinic",
    icon: Stethoscope,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    description: "Best for routine provider letters, common conditions (hypertension, diabetes, asthma), and lower-cost access. Most RDQA letters can be completed by a primary care provider.",
    bestFor: ["Hypertension", "Elevated A1c / Diabetes", "Asthma", "Behavioral Health", "Orthopedic (mild)"],
    howToFind: "Search your insurance directory for in-network primary care physicians, or use your employer's health plan website.",
    tips: [
      "Call ahead and explain you need a letter for an occupational health review, not a disability determination.",
      "Bring the RDQA letter and job functions document to the appointment.",
      "Ask the provider to respond to each bullet point specifically.",
    ],
    cost: "Typically covered by insurance. Copay varies.",
    speed: "1–2 weeks for appointment + letter.",
  },
  {
    id: "fqhc",
    title: "FQHC / Federally Qualified Health Center",
    icon: MapPin,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    description: "Federally Qualified Health Centers provide care on a sliding-scale fee basis regardless of insurance status. Ideal when the applicant has no primary care provider or has limited insurance.",
    bestFor: ["Uninsured or underinsured applicants", "Applicants without a PCP", "Most common RDQA conditions"],
    howToFind: "Visit findahealthcenter.hrsa.gov to locate the nearest FQHC by zip code.",
    tips: [
      "Bring proof of income if available — fees are based on ability to pay.",
      "Explain the purpose of the visit: you need a letter for an occupational health review.",
      "Some FQHCs have same-week appointments available.",
    ],
    cost: "Sliding scale, as low as $0 for low-income patients.",
    speed: "1–3 weeks depending on location.",
    link: "https://findahealthcenter.hrsa.gov",
    linkLabel: "Find an FQHC near you",
  },
  {
    id: "specialist",
    title: "Specialist (Cardiologist, Pulmonologist, etc.)",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description: "Some RDQA conditions require documentation from a specialist. Cardiologists are needed for cardiac history cases; pulmonologists for complex respiratory cases; sleep medicine for sleep apnea; psychiatrists or psychologists for behavioral health.",
    bestFor: ["Cardiac History", "Complex Asthma / Respiratory", "Sleep Apnea (CPAP compliance)", "Behavioral Health (complex)"],
    howToFind: "Use your insurance directory or ask your primary care provider for a referral. Referrals can speed up insurance approval.",
    tips: [
      "Ask your PCP for a referral — this can reduce wait times and cost.",
      "Bring the RDQA letter and job functions to the specialist appointment.",
      "Confirm the specialist will write a letter specifically for occupational health review purposes.",
    ],
    cost: "Specialist copay varies. Some require referral for insurance coverage.",
    speed: "2–6 weeks for specialist appointment. Expedited options may be available.",
  },
  {
    id: "cash-pay",
    title: "Cash-Pay / Direct Primary Care",
    icon: DollarSign,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    description: "Direct primary care (DPC) or cash-pay clinics can often see patients faster than traditional insurance-based practices. Useful when speed is the priority and the applicant can afford out-of-pocket costs.",
    bestFor: ["Applicants with tight deadlines", "Applicants without insurance", "Routine RDQA conditions"],
    howToFind: "Search 'direct primary care [your city]' or use dpcfrontier.com to find DPC practices.",
    tips: [
      "Confirm the provider is willing to write occupational health letters before booking.",
      "Ask about flat-fee pricing for a single visit and letter.",
      "Some urgent care clinics can also write provider letters for straightforward cases.",
    ],
    cost: "Typically $75–$200 per visit, no insurance required.",
    speed: "Often same-week or next-day appointments.",
    link: "https://www.dpcfrontier.com",
    linkLabel: "Find a DPC practice",
  },
  {
    id: "financial-assistance",
    title: "Hospital Financial Assistance",
    icon: DollarSign,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    description: "Most non-profit hospitals are required to offer financial assistance programs (charity care) for patients who cannot afford care. This can cover specialist visits, lab testing, and imaging.",
    bestFor: ["Applicants who need specialist visits or testing but cannot afford it", "Uninsured or underinsured applicants"],
    howToFind: "Contact the hospital's billing or financial counseling department directly. Ask specifically about 'charity care' or 'financial assistance programs'.",
    tips: [
      "Apply before your appointment if possible — some programs require pre-approval.",
      "Bring proof of income (pay stubs, tax return) to the application.",
      "Non-profit hospitals are legally required to have these programs.",
    ],
    cost: "Can reduce or eliminate cost for qualifying patients.",
    speed: "Varies. Application processing may take 1–2 weeks.",
  },
  {
    id: "telehealth",
    title: "Telehealth / Virtual Visit",
    icon: Clock,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    description: "Telehealth visits can be appropriate for some RDQA conditions where a physical exam is not required. Useful for obtaining provider letters for behavioral health, medication reviews, and some chronic condition follow-ups.",
    bestFor: ["Behavioral Health", "Medication review / chronic condition management", "Applicants in rural areas"],
    howToFind: "Check your insurance plan for covered telehealth providers. Teladoc, MDLive, and similar platforms offer on-demand visits.",
    tips: [
      "Confirm the telehealth provider can write an occupational health letter before booking.",
      "Some conditions (blood pressure readings, physical exams) cannot be completed via telehealth.",
      "Telehealth visits are often same-day or next-day.",
    ],
    cost: "Often covered by insurance. Out-of-pocket typically $50–$100.",
    speed: "Same-day or next-day in many cases.",
  },
];

const quizQuestions = [
  {
    id: "insurance",
    question: "Does the applicant have health insurance?",
    options: [
      { label: "Yes, with a primary care provider", value: "insured-pcp" },
      { label: "Yes, but no primary care provider", value: "insured-no-pcp" },
      { label: "No insurance", value: "uninsured" },
    ],
  },
  {
    id: "condition",
    question: "What type of condition is the RDQA for?",
    options: [
      { label: "Common condition (BP, A1c, asthma, orthopedic)", value: "common" },
      { label: "Cardiac, sleep apnea, or complex respiratory", value: "specialist" },
      { label: "Behavioral health / mental health", value: "behavioral" },
    ],
  },
  {
    id: "timeline",
    question: "How urgent is the deadline?",
    options: [
      { label: "More than 2 weeks", value: "flexible" },
      { label: "Less than 2 weeks", value: "urgent" },
    ],
  },
];

const quizRecommendations: Record<string, string[]> = {
  "insured-pcp-common-flexible": ["primary-care"],
  "insured-pcp-common-urgent": ["primary-care", "telehealth"],
  "insured-pcp-specialist-flexible": ["specialist", "primary-care"],
  "insured-pcp-specialist-urgent": ["specialist", "cash-pay"],
  "insured-pcp-behavioral-flexible": ["primary-care", "specialist"],
  "insured-pcp-behavioral-urgent": ["telehealth", "primary-care"],
  "insured-no-pcp-common-flexible": ["fqhc", "primary-care"],
  "insured-no-pcp-common-urgent": ["cash-pay", "telehealth"],
  "insured-no-pcp-specialist-flexible": ["specialist", "fqhc"],
  "insured-no-pcp-specialist-urgent": ["cash-pay", "specialist"],
  "insured-no-pcp-behavioral-flexible": ["fqhc", "telehealth"],
  "insured-no-pcp-behavioral-urgent": ["telehealth", "cash-pay"],
  "uninsured-common-flexible": ["fqhc", "financial-assistance"],
  "uninsured-common-urgent": ["cash-pay", "fqhc"],
  "uninsured-specialist-flexible": ["fqhc", "financial-assistance"],
  "uninsured-specialist-urgent": ["cash-pay", "financial-assistance"],
  "uninsured-behavioral-flexible": ["fqhc", "telehealth"],
  "uninsured-behavioral-urgent": ["telehealth", "cash-pay"],
};

export default function RdqaResourcesPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizDone, setQuizDone] = useState(false);

  const currentQuestionIdx = quizQuestions.findIndex((q) => !answers[q.id]);
  const quizKey = quizQuestions.map((q) => answers[q.id] || "").join("-");
  const recommendations = quizDone ? (quizRecommendations[quizKey] || ["primary-care", "fqhc"]) : [];

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (Object.keys(newAnswers).length === quizQuestions.length) {
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizDone(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white">Resource Navigator</h1>
        <p className="text-white/55 mt-2 leading-relaxed max-w-2xl">
          Find the right type of provider or resource for your situation. Use the Pathway Quiz to get a personalized recommendation, or browse all resource categories below.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-400/20 px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-amber-300/80">
            These resources are provided as a courtesy only. Occu-Med does not endorse, recommend, contract with, or partner with any specific provider.
          </span>
        </div>
      </motion.div>

      {/* Pathway Quiz */}
      <Card className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Resource Pathway Quiz</span>
          </div>
          {(Object.keys(answers).length > 0 || quizDone) && (
            <button onClick={resetQuiz} className="text-xs text-white/40 hover:text-white/70 transition-colors">Reset</button>
          )}
        </div>

        {!quizDone ? (
          <div className="space-y-4">
            {quizQuestions.map((q, i) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = i === currentQuestionIdx;
              const isPast = i < currentQuestionIdx;
              if (!isCurrent && !isPast) return null;
              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p className={`text-sm font-medium mb-2 ${isCurrent ? "text-white" : "text-white/40"}`}>{q.question}</p>
                  {isPast ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                      {q.options.find((o) => o.value === answers[q.id])?.label}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(q.id, opt.value)}
                          className="px-3 py-2 rounded-xl text-sm border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm text-white/70 mb-3">Based on your answers, we recommend:</p>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((recId, i) => {
                const cat = resourceCategories.find((c) => c.id === recId);
                if (!cat) return null;
                const Icon = cat.icon;
                return (
                  <div key={recId} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${cat.bg} ${cat.border} ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                    {i === 0 ? "First: " : "Also: "}{cat.title}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </Card>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resourceCategories.map((cat, i) => {
          const Icon = cat.icon;
          const isRecommended = recommendations.includes(cat.id);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`glass-panel p-5 rounded-2xl border transition-all ${ isRecommended ? `${cat.border} ${cat.bg}` : "border-white/10" }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.bg} border ${cat.border}`}>
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white text-sm">{cat.title}</h2>
                    {isRecommended && (
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${cat.color}`}>Recommended</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-white/60 leading-relaxed mb-3">{cat.description}</p>
                <div className="flex gap-4 text-xs text-white/40 mb-3">
                  <span><strong className="text-white/60">Cost:</strong> {cat.cost}</span>
                </div>
                <div className="flex gap-4 text-xs text-white/40 mb-3">
                  <span><strong className="text-white/60">Speed:</strong> {cat.speed}</span>
                </div>
                <div className="space-y-1">
                  {cat.tips.map((tip, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 rounded-full bg-white/30 shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
                {cat.link && (
                  <a
                    href={cat.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${cat.color} hover:opacity-80 transition-opacity`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {cat.linkLabel}
                  </a>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}