"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    created_at: string;
    isTyping?: boolean;
};

const SUGGESTIONS = [
    "Tóm tắt tài liệu số 5",
    "Gợi ý chế độ ăn tuần này",
    "Danh sách thực phẩm nên hạn chế",
];

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

export default function ChatMain() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content: "Xin chào! Đây là khu vực kiểm thử hội thoại của admin.",
            created_at: new Date().toISOString(),
        },
    ]);

    const listRef = useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => {
        if (!listRef.current) return;
        if (isAtBottom) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isAtBottom]);

    const handleScroll = () => {
        const el = listRef.current;
        if (!el) return;
        const threshold = 48; // px
        const distanceFromBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
        setIsAtBottom(distanceFromBottom <= threshold);
    };

    const scrollToBottom = () => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };

    const sendMock = (text: string) => {
        const now = new Date().toISOString();
        // Add user message and typing placeholder
        setMessages((prev) => [
            ...prev,
            { role: "user", content: text, created_at: now },
            { role: "assistant", content: "Đang soạn...", created_at: now, isTyping: true },
        ]);

        // Replace typing with mock answer
        setTimeout(() => {
            setMessages((prev) => {
                const copy = [...prev];
                const idx = copy.findIndex((m, i) => i === copy.length - 1 && m.isTyping);
                if (idx !== -1) {
                    copy[idx] = {
                        role: "assistant",
                        content: "(mock) Đây là câu trả lời mẫu phù hợp ngữ cảnh kiểm thử.",
                        created_at: new Date().toISOString(),
                    };
                }
                return copy;
            });
        }, 800);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const text = message.trim();
        if (!text) return;
        setMessage("");
        sendMock(text);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const text = message.trim();
            if (!text) return;
            setMessage("");
            sendMock(text);
        }
    };

    const clearConversation = () => setMessages([]);

    return (
        <div className="mx-auto max-w-4xl">
            <div className="relative border rounded-2xl bg-white shadow-md flex flex-col h-[calc(100vh-240px)] max-h-[720px]">
                {/* Sub header */}
                <div className="px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-t-2xl bg-gray-50/60">
                    <div>
                        <div className="text-sm font-semibold text-gray-900">Phiên kiểm thử</div>
                        <div className="text-xs text-gray-500">Mục tiêu: kiểm tra đáp ứng hội thoại theo tri thức</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {SUGGESTIONS.map((s) => (
                            <Button
                                key={s}
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs bg-white hover:bg-gray-50 border-gray-200"
                                onClick={() => setMessage(s)}
                            >
                                {s}
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                            onClick={clearConversation}
                        >
                            Xóa cuộc trò chuyện
                        </Button>
                    </div>
                </div>

                {/* Messages list */}
                <div
                    ref={listRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white"
                >
                    {messages.length === 0 ? (
                        <div className="text-sm text-gray-500">
                            Chưa có tin nhắn. Hãy nhập câu hỏi bên dưới để bắt đầu.
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div key={idx} className={`max-w-[78%] w-fit ${m.role === "user" ? "ml-auto" : ""}`}>
                                <div className={`mb-1 text-[11px] ${m.role === "user" ? "text-right text-gray-500" : "text-gray-500"}`}>
                                    {m.role === "user" ? "Bạn" : "Trợ lý"} • {formatTime(m.created_at)}
                                </div>
                                <div
                                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed border break-words whitespace-pre-wrap ${m.role === "user"
                                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white border-blue-600 shadow-sm rounded-br-md"
                                        : "bg-gray-50 text-gray-900 border-gray-200 shadow-sm rounded-bl-md"
                                        } ${m.isTyping ? "opacity-80" : ""}`}
                                >
                                    {m.isTyping ? "Đang soạn..." : m.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Scroll to bottom */}
                {!isAtBottom && (
                    <div className="absolute bottom-24 right-4">
                        <Button
                            onClick={scrollToBottom}
                            size="sm"
                            variant="secondary"
                            className="h-7 px-3 text-xs bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                            Xuống cuối
                        </Button>
                    </div>
                )}

                {/* Composer */}
                <form onSubmit={onSubmit} className="border-t p-3 bg-gray-50/60 rounded-b-2xl">
                    <div className="flex items-end gap-2">
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Nhập tin nhắn... (Enter gửi, Shift+Enter xuống dòng)"
                                className="text-sm min-h-[44px] max-h-32 border-0 focus-visible:ring-0 focus-visible:outline-none"
                                rows={2}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!message.trim()}
                            className="text-sm h-[44px] px-4 bg-[#248fca] hover:bg-[#248fca]/90"
                        >
                            Gửi
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}


