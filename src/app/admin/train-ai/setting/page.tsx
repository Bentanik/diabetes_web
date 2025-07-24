import SettingTrainAIComponent from '@/app/admin/train-ai/setting/components'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: "Cài đặt",
    description: "Cài đặt",
}

export default function SettingTrainAIPage() {
    return (
        <div>
            <SettingTrainAIComponent />
        </div>
    )
}
