import { motion } from "framer-motion";

interface KurzgesagtBirdProps {
  size?: number;
  color?: string;
  mood?: "happy" | "thinking" | "excited" | "waving";
  className?: string;
  floatDelay?: number;
}

export function KurzgesagtBird({
  size = 120,
  color = "#3b82f6",
  mood = "happy",
  className = "",
  floatDelay = 0,
}: KurzgesagtBirdProps) {
  const eyeY = mood === "happy" ? 38 : mood === "thinking" ? 40 : 36;
  const beakRotate = mood === "excited" ? -5 : 0;

  return (
    <motion.div
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: floatDelay + 0.5 },
      }}
    >
      <svg
        viewBox="0 0 100 110"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <motion.ellipse
          cx="50" cy="106" rx="18" ry="5"
          fill="rgba(0,0,0,0.25)"
          animate={{ scaleX: [1, 0.85, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        />

        {/* Body */}
        <motion.ellipse
          cx="50" cy="62" rx="30" ry="34"
          fill={color}
          animate={{ scaleY: [1, 1.02, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        />

        {/* Belly */}
        <ellipse cx="50" cy="68" rx="18" ry="20" fill="rgba(255,255,255,0.18)" />

        {/* Head */}
        <motion.circle
          cx="50" cy="32" r="24"
          fill={color}
          animate={{ scaleY: [1, 1.02, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        />

        {/* Left Wing */}
        <motion.ellipse
          cx="22" cy="65" rx="10" ry="16"
          fill={color}
          style={{ filter: "brightness(0.85)" }}
          animate={{
            rotate: mood === "waving" ? [0, -20, 0, -15, 0] : [0, -5, 0],
            originX: "22px",
            originY: "55px",
          }}
          transition={{
            duration: mood === "waving" ? 1.2 : 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: floatDelay,
          }}
        />

        {/* Right Wing */}
        <motion.ellipse
          cx="78" cy="65" rx="10" ry="16"
          fill={color}
          style={{ filter: "brightness(0.85)" }}
          animate={{
            rotate: [0, 5, 0],
            originX: "78px",
            originY: "55px",
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay + 0.3 }}
        />

        {/* Eye sockets */}
        <circle cx="40" cy={eyeY} r="9" fill="white" />
        <circle cx="60" cy={eyeY} r="9" fill="white" />

        {/* Pupils */}
        <motion.circle
          cx="42" cy={eyeY}
          r="5"
          fill="#0a1628"
          animate={{ scaleX: [1, 0.9, 1], scaleY: mood === "happy" ? [1, 1, 0.1, 1, 1] : [1, 0.9, 1] }}
          transition={{ duration: mood === "happy" ? 4 : 2, repeat: Infinity, ease: "easeInOut", delay: floatDelay + 1 }}
        />
        <motion.circle
          cx="62" cy={eyeY}
          r="5"
          fill="#0a1628"
          animate={{ scaleX: [1, 0.9, 1], scaleY: mood === "happy" ? [1, 1, 0.1, 1, 1] : [1, 0.9, 1] }}
          transition={{ duration: mood === "happy" ? 4 : 2, repeat: Infinity, ease: "easeInOut", delay: floatDelay + 1 }}
        />

        {/* Eye shine */}
        <circle cx="44" cy={eyeY - 2} r="2" fill="white" opacity="0.8" />
        <circle cx="64" cy={eyeY - 2} r="2" fill="white" opacity="0.8" />

        {/* Beak */}
        <motion.g
          animate={{ rotate: beakRotate }}
          style={{ transformOrigin: "50px 48px" }}
        >
          <polygon
            points="44,47 56,47 50,55"
            fill="#f59e0b"
          />
          <line x1="44" y1="51" x2="56" y2="51" stroke="#d97706" strokeWidth="1.5" />
        </motion.g>

        {/* Feet */}
        <ellipse cx="42" cy="96" rx="9" ry="4" fill="#f59e0b" />
        <ellipse cx="58" cy="96" rx="9" ry="4" fill="#f59e0b" />

        {/* Cheek blush */}
        {mood === "happy" || mood === "excited" ? (
          <>
            <ellipse cx="31" cy={eyeY + 7} rx="5" ry="3" fill="rgba(255,150,100,0.35)" />
            <ellipse cx="69" cy={eyeY + 7} rx="5" ry="3" fill="rgba(255,150,100,0.35)" />
          </>
        ) : null}

        {/* Thinking bubble */}
        {mood === "thinking" && (
          <g>
            <circle cx="72" cy="20" r="3" fill="rgba(255,255,255,0.3)" />
            <circle cx="79" cy="13" r="4.5" fill="rgba(255,255,255,0.25)" />
            <circle cx="87" cy="7" r="6" fill="rgba(255,255,255,0.2)" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

export function MiniSparkle({ x, y, delay = 0, color = "#f59e0b" }: { x: number; y: number; delay?: number; color?: string }) {
  return (
    <motion.svg
      viewBox="0 0 20 20"
      width={16}
      height={16}
      style={{ position: "absolute", left: x, top: y }}
      animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path
        d="M10 0 L11.8 7.2 L19 10 L11.8 12.8 L10 20 L8.2 12.8 L1 10 L8.2 7.2 Z"
        fill={color}
      />
    </motion.svg>
  );
}

export function FloatingSparkleField({ count = 8 }: { count?: number }) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 137.5) % 100,
    y: (i * 97.3) % 100,
    delay: i * 0.4,
    color: ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"][i % 5],
    size: 10 + (i % 3) * 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + s.delay,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 20 20" width={s.size} height={s.size}>
            <path
              d="M10 0 L11.8 7.2 L19 10 L11.8 12.8 L10 20 L8.2 12.8 L1 10 L8.2 7.2 Z"
              fill={s.color}
              opacity="0.7"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
