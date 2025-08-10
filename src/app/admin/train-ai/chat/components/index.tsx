"use client";
import {
    type FormEvent,
    type KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2, ChevronDown, Bot, User } from "lucide-react";

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
    new Date(iso).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

export default function ChatMain() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content:
                "Xin chào! Đây là khu vực kiểm thử hội thoại của admin. Tôi sẵn sàng hỗ trợ bạn với mọi câu hỏi.",
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
        const threshold = 48;
        const distanceFromBottom =
            el.scrollHeight - el.clientHeight - el.scrollTop;
        setIsAtBottom(distanceFromBottom <= threshold);
    };

    const scrollToBottom = () => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };

    const sendMock = (text: string) => {
        const now = new Date().toISOString();
        setMessages((prev) => [
            ...prev,
            { role: "user", content: text, created_at: now },
            {
                role: "assistant",
                content: "Đang soạn...",
                created_at: now,
                isTyping: true,
            },
        ]);

        setTimeout(() => {
            setMessages((prev) => {
                const copy = [...prev];
                const idx = copy.findIndex(
                    (m, i) => i === copy.length - 1 && m.isTyping
                );
                if (idx !== -1) {
                    copy[idx] = {
                        role: "assistant",
                        content:
                            "Đây là câu trả lời mẫu phù hợp ngữ cảnh kiểm thử. Tôi có thể giúp bạn với nhiều loại câu hỏi khác nhau và cung cấp thông tin chi tiết theo yêu cầu của bạn.",
                        created_at: new Date().toISOString(),
                    };
                }
                return copy;
            });
        }, 1200);
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
        <div className="mx-auto">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-[#248FCA]/10 flex flex-col h-[calc(100vh-240px)] max-h-[720px] overflow-hidden">
                {/* Modern Header */}
                <div className="px-6 py-4 rounded-t-3xl bg-gradient-to-r from-[#248FCA] via-[#1e7bb8] to-[#248FCA]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-lg text-white">
                                    Phiên kiểm thử AI
                                </div>
                                <div className="text-sm text-white/80">
                                    Kiểm tra đáp ứng hội thoại theo tri thức
                                </div>
                            </div>
                        </div>
                        <Button
                            className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 rounded-full cursor-pointer"
                            onClick={clearConversation}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa cuộc trò chuyện
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div
                    ref={listRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#248FCA]/5 to-white"
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#248FCA]/20 to-[#248FCA]/10 rounded-full flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-[#248FCA]" />
                            </div>
                            <div className="text-gray-600 text-lg">
                                Chưa có tin nhắn
                            </div>
                            <div className="text-gray-500 text-sm mt-1">
                                Hãy nhập câu hỏi bên dưới để bắt đầu
                            </div>
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                                    m.role === "user" ? "flex-row-reverse" : ""
                                }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        m.role === "user"
                                            ? "bg-gradient-to-br from-[#248FCA] to-[#1e7bb8]"
                                            : "bg-gradient-to-br from-gray-500 to-gray-600"
                                    }`}
                                >
                                    {m.role === "user" ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>

                                {/* Message Content */}
                                <div
                                    className={`max-w-[75%] ${
                                        m.role === "user"
                                            ? "items-end"
                                            : "items-start"
                                    } flex flex-col`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-gray-600">
                                            {m.role === "user"
                                                ? "Bạn"
                                                : "Trợ lý AI"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatTime(m.created_at)}
                                        </span>
                                    </div>

                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 ${
                                            m.role === "user"
                                                ? "bg-gradient-to-br from-[#248FCA] to-[#1e7bb8] text-white shadow-[#248FCA]/20 rounded-br-md"
                                                : "bg-white text-gray-800 border border-[#248FCA]/10 shadow-[#248FCA]/5 rounded-bl-md hover:shadow-md hover:border-[#248FCA]/20"
                                        } ${m.isTyping ? "animate-pulse" : ""}`}
                                    >
                                        {m.isTyping ? (
                                            <div className="flex items-center gap-1">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-[#248FCA]/60 rounded-full animate-bounce"></div>
                                                    <div
                                                        className="w-2 h-2 bg-[#248FCA]/60 rounded-full animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.1s",
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="w-2 h-2 bg-[#248FCA]/60 rounded-full animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.2s",
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-[#248FCA]">
                                                    Đang soạn...
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap break-words">
                                                {m.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Scroll to Bottom Button */}
                {!isAtBottom && (
                    <div className="absolute bottom-32 right-6 z-10">
                        <Button
                            onClick={scrollToBottom}
                            size="sm"
                            className="h-10 w-10 p-0 rounded-full bg-white border border-[#248FCA]/20 shadow-lg hover:shadow-xl text-[#248FCA] hover:text-[#1e7bb8] hover:bg-[#248FCA]/5 transition-all duration-200 cursor-pointer"
                            variant="ghost"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-6 bg-gradient-to-t from-[#248FCA]/5 to-white border-t border-[#248FCA]/10">
                    {/* Suggestions */}
                    {messages.length <= 1 && (
                        <div className="mb-4">
                            <div className="text-xs font-medium text-[#248FCA] mb-2">
                                Gợi ý câu hỏi:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMessage(suggestion)}
                                        className="px-3 py-2 text-xs bg-[#248FCA]/10 hover:bg-[#248FCA]/20 text-[#248FCA] rounded-full transition-colors duration-200 border border-[#248FCA]/20 hover:border-[#248FCA]/30"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                                className="min-h-[52px] max-h-32 resize-none border-2 border-[#248FCA]/20 rounded-2xl px-4 py-3 text-sm focus:border-[#248FCA] focus:ring-0 transition-colors duration-200 pr-12 bg-white/80 backdrop-blur-sm"
                                rows={1}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!message.trim()}
                            className="h-[52px] w-[52px] p-0 rounded-2xl bg-gradient-to-r from-[#248FCA] to-[#1e7bb8] hover:from-[#1e7bb8] hover:to-[#248FCA] disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
