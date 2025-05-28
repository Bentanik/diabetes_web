import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface HospitalCardProps {
  children: ReactNode
  color?: string
}

const containerVariants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    rotateX: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: Math.random() * 0.1,
    }
  }
}

export function HospitalCard({ children, color = "#248fca" }: HospitalCardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.03,
        y: -8,
        rotateX: 2,
        transition: { 
          duration: 0.3,
          type: "spring",
          stiffness: 300
        },
      }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-full min-h-[200px] bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shawdow-hospital  transition-all duration-500 cursor-pointer group overflow-hidden"
      style={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(255, 255, 255, 0.7) 50%, 
          ${color}08 100%)`
      }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `linear-gradient(135deg, 
            ${color}05 0%, 
            ${color}10 50%, 
            ${color}15 100%)`
        }}
      />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-[0.03]"
          style={{ backgroundColor: color }}
        />
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-6 left-6 w-16 h-16 rounded-full opacity-[0.02]"
          style={{ backgroundColor: color }}
        />
      </div>

      {children}
    </motion.div>
  )
} 