'use client'
import ChatMain from '@/app/admin/train-ai/chat/components/chat_main'
import Header from '@/app/admin/train-ai/chat/components/header'
import React from 'react'

export default function ChatComponent() {
    return (
        <div>
            <header>
                <Header />
            </header>
            <main>
                <ChatMain />
            </main>
        </div>
    )
}
