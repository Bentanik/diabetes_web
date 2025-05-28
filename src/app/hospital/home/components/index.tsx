'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { BarChartIcon, BellIcon, BotIcon, MessageCircleIcon, MessageSquareIcon, UsersIcon } from 'lucide-react'
import { motion } from "framer-motion"
import ProfileHospitalMenu from '@/components/profile_hospital_menu'
import HospitalBox from '@/components/hospital_box'

const START_CARDS = [
  {
    title: "Tổng số nhân viên",
    value: "156",
    change: "+12",
    changeText: "so với tháng trước",
    positive: true,
    color: "bg-blue-500",
    icon: UsersIcon,
  },
  {
    title: "Thành viên trong group",
    value: "2,847",
    change: "+234",
    changeText: "thành viên mới tháng này",
    positive: true,
    color: "bg-green-500",
    icon: MessageSquareIcon,
  },
  {
    title: "Tương tác AI hôm nay",
    value: "1,289",
    change: "+15%",
    changeText: "so với hôm qua",
    positive: true,
    color: "bg-purple-500",
    icon: BotIcon,
  },
  {
    title: "Tin nhắn mới hôm nay",
    value: "1,247",
    change: "+8%",
    changeText: "so với hôm qua",
    positive: true,
    color: "bg-orange-500",
    icon: MessageCircleIcon,
  },
]


const Header = () => {
  return <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-color)]">Dashboard Quản Trị</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Tổng quan hoạt động hôm nay - {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="gap-2">
          <BarChartIcon className="w-4 h-4" />
          Xuất báo cáo
        </Button>
        <Button variant="ghost" size="icon">
          <BellIcon className="w-5 h-5" />
        </Button>
        <div>
          <ProfileHospitalMenu profile={1} />
        </div>
      </div>
    </div>
  </motion.div>
}

export default function HomeHospitalComponent() {
  return (
    <div>
      {/* Header */}
      <header>
        <Header />
      </header>
      {/* Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {START_CARDS.map((card, index) => (
          <HospitalBox key={index} title={card.title} value={card.value} icon={card.icon} unit={''} changeText={card.changeText} change={card.change} positive={card.positive} />
        ))}
      </div>
    </div>
  )
}
