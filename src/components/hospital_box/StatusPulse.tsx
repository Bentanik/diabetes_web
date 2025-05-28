import { motion } from "framer-motion"

interface StatusPulseProps {
  positive?: boolean
}

export function StatusPulse({ positive = true }: StatusPulseProps) {
  return (
    <div className="absolute top-6 right-6">
      <motion.div
        animate={{
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-3 h-3 rounded-full shadow-sm"
        style={{ backgroundColor: positive ? "#10b981" : "#ef4444" }}
      />
    </div>
  )
} 