import { motion } from "framer-motion";

export function LogoSparkles() {
  const sparkles = [
    { left: "12%", top: "20%", delay: 0 },
    { left: "82%", top: "24%", delay: 1 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300/70"
          style={{ left: s.left, top: s.top, boxShadow: "0 0 10px rgba(103,232,249,0.55)" }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3.4, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
