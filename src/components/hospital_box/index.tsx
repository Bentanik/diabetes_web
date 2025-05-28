"use client"

import type React from "react"
import { motion } from "framer-motion"

interface HospitalBoxProps {
  title: string
  icon: React.ElementType
  value: string
  unit?: string
  change?: string
  changeText?: string
  positive?: boolean
}

export default function HospitalBox({
  title,
  icon,
  value,
  unit,
  change,
  changeText,
  positive = true,
}: HospitalBoxProps) {
  const Icon = icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: Math.random() * 0.2,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      className="relative w-full bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-12 translate-y-12"></div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-500"></div>

      {/* Icon Section */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 shadow-sm mb-6"
      >
        <Icon size={28} strokeWidth={2} />
      </motion.div>

      {/* Content Section */}
      <div className="space-y-4">
        {/* Title and Trend */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-700 leading-tight">{title}</h3>
        </div>

        {/* Value */}
        <div className="flex items-baseline space-x-2">
          <motion.span
            key={value}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-gray-900"
          >
            {value}
          </motion.span>
          {unit && <span className="text-lg font-medium text-gray-600">{unit}</span>}
        </div>

        {/* Change Information */}
        {change && (
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${positive ? "text-green-600" : "text-red-600"}`}>{change}</span>
            {changeText && <span className="text-gray-500">{changeText}</span>}
          </div>
        )}

        {/* Progress Bar */}
        {/* <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div> */}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </motion.div>
  )
}
