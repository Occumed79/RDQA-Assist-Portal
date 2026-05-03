import React from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Home, PlusCircle, Settings, Wand2, Camera, ShieldCheck, FileQuestion, ClipboardList, MapPin, Workflow, FileSearch, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { OccumedLogo } from "@/components/brand/OccumedLogo";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/rdqa", label: "RDQA Portal", icon: ShieldCheck },
    { href: "/rdqa/conditions", label: "Conditions", icon: FileQuestion },
    { href: "/rdqa/checklist", label: "Checklist", icon: ClipboardList },
    { href: "/rdqa/resources", label: "Resources", icon: MapPin },
    { href: "/guides", label: "Library", icon: BookOpen },
    { href: "/scribe", label: "AutoScribe", icon: Camera, accent: true },
  ];

  const pageTitle = (() => {
    if (location === "/") return "Dashboard";
    if (location === "/guides") return "Guides Library";
    if (location === "/guides/new") return "Create New Guide";
    if (location === "/scribe") return "AutoScribe";
    if (location === "/rdqa") return "RDQA Portal";
    if (location === "/rdqa/conditions") return "Condition Pages";
    if (location === "/rdqa/checklist") return "Checklist";
    if (location === "/rdqa/resources") return "Resource Navigator";
    if (location === "/rdqa/provider-letter") return "Provider Letter";
    if (location === "/rdqa/readiness") return "Readiness Score";
    if (location === "/rdqa/timeline") return "Applicant Timeline";
    if (location === "/rdqa/reporting") return "Client Reporting";
    if (location.startsWith("/rdqa/")) return "RDQA Tool";
    if (location.startsWith("/guides/") && location.endsWith("/edit")) return "Edit Guide";
    return "";
  })();

  return (
    <div className="flex h-screen w-full overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-y-0 border-l-0 flex flex-col z-20">
        <div className="p-5" />

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? item.accent
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "bg-white/10 text-white shadow-inner shadow-white/5 border border-white/10"
                      : item.accent
                        ? "text-amber-400/70 hover:bg-amber-500/8 hover:text-amber-300"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.accent && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wide">AI</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2">
          <Link href="/guides/new" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all border border-blue-400/20">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Guide
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Floating Glass Toolbar */}
        <header className="absolute top-0 left-0 right-0 h-16 z-10 p-4">
          <div className="mx-auto max-w-7xl h-full glass-panel rounded-xl flex items-center justify-between px-6 border-white/10">
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              {location === "/scribe" && <Wand2 className="w-4 h-4 text-amber-400" />}
              {pageTitle}
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 p-[1px]">
                <div className="w-full h-full bg-card rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto pt-24 pb-8 px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
