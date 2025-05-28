import { motion } from "framer-motion"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface ChangeIndicatorProps {
  change: string
  changeText?: string
  positive?: boolean
}

export function ChangeIndicator({ change, changeText, positive = true }: ChangeIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex items-center gap-2 text-sm"
    >
      <div 
        className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium ${
          positive 
            ? "text-emerald-700 bg-emerald-50 border border-emerald-200" 
            : "text-red-700 bg-red-50 border border-red-200"
        }`}
      >
        {positive ? (
          <TrendingUpIcon className="w-3 h-3" />
        ) : (
          <TrendingDownIcon className="w-3 h-3" />
        )}
        <span>{change}</span>
      </div>
      {changeText && (
        <span className="text-gray-500 font-medium">{changeText}</span>
      )}
    </motion.div>
  )
} 