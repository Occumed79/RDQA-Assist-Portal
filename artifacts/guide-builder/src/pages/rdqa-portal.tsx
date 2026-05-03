import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeInfo, ClipboardList, Gauge, MessageSquareText, FileQuestion, UploadCloud, Users, ShieldCheck, ChevronRight, MapPin, Lock, Workflow, FileSearch } from "lucide-react";

const sections = [
  { title: "Condition Pages", desc: "Plain-English pages for each RDQA condition.", icon: FileQuestion, href: "/rdqa/conditions" },
  { title: "Provider Packet", desc: "Give providers the letter, job functions, and checklist.", icon: MessageSquareText, href: "/rdqa/provider-letter" },
  { title: "Resource Navigator", desc: "Neutral low-cost, self-pay, and community-care options.", icon: MapPin, href: "/rdqa/resources" },
  { title: "Upload Review", desc: "Check what was uploaded before analysts touch it.", icon: FileSearch, href: "/rdqa/checklist" },
  { title: "Readiness Score", desc: "Signal when the case is complete enough to move.", icon: Gauge, href: "/rdqa/readiness" },
  { title: "Applicant Timeline", desc: "Show the current step and the next action.", icon: Users, href: "/rdqa/timeline" },
  { title: "Case Status", desc: "Real-time status visibility for employees and applicants.", icon: Workflow, href: "/rdqa/status" },
  { title: "Client Reporting", desc: "Premium analytics and case movement reporting.", icon: ShieldCheck, href: "/rdqa/reporting" },
];

export default function RdqaPortalPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-80 h-80 -top-20 -left-20" />
          <div className="orb orb-purple w-72 h-72 top-10 right-0" />
          <div className="orb orb-emerald w-64 h-64 bottom-0 left-1/3" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/70 mb-3">RDQA Support Portal</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Occu-Med portal tools</h1>
          <p className="mt-4 text-white/60 text-lg leading-relaxed">
            A support portal for employees and applicants that reduces hand-holding, standardizes submissions, and opens a premium client-facing service path.
          </p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white/60">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">Cuts repetitive EQA support</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">Improves first-pass completeness</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">Supports chargeable client tiers</div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Open Portal</Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">View Analytics</Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {sections.map((item, i) => (
          <Link key={item.title} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="glass-panel glass-panel-hover rounded-2xl p-5 h-full border border-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-cyan-300" />
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 mt-1" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/55 leading-relaxed">{item.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}