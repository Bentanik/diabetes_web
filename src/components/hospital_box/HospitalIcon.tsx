import { motion } from "framer-motion"
import type { ElementType } from "react"

interface HospitalIconProps {
  icon: ElementType
  color?: string
}

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

export function HospitalIcon({ icon: Icon, color = "#248fca" }: HospitalIconProps) {
  return (
    <motion.div
      variants={iconVariants}
      initial="rest"
      whileHover="hover"
      className="relative flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group/icon"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}25)`,
        boxShadow: `0 8px 32px ${color}20`
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}25, ${color}35)`
        }}
      />
      <Icon 
        size={28} 
        strokeWidth={2.5} 
        style={{ color: color }}
        className="relative z-10 drop-shadow-sm"
      />
    </motion.div>
  )
} 