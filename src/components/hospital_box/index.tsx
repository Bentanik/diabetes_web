"use client"

import type { ElementType } from "react"
import { HospitalCard } from "./HospitalCard"
import { HospitalIcon } from "./HospitalIcon"
import { StatusPulse } from "./StatusPulse"
import { ValueDisplay } from "./ValueDisplay"
import { ChangeIndicator } from "./ChangeIndicator"

interface HospitalBoxProps {
  title: string
  icon: ElementType
  value: string
  unit?: string
  change?: string
  changeText?: string
  positive?: boolean
  color?: string
}

export default function HospitalBox({
  title,
  icon,
  value,
  unit,
  change,
  changeText,
  positive = true,
  color = "#248fca",
}: HospitalBoxProps) {
  return (
    <HospitalCard color={color}>
      <StatusPulse positive={positive} />
      <HospitalIcon icon={icon} color={color} />
      <ValueDisplay title={title} value={value} unit={unit} />
      {change && (
        <ChangeIndicator 
          change={change} 
          changeText={changeText} 
          positive={positive} 
        />
      )}
    </HospitalCard>
  )
}
