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
import axios from "axios";
import { useBackdrop } from "@/context/backdrop_context";

type ChatMessage = {
    id?: string;
    session_id?: string;
    user_id?: string;
    role: "user" | "assistant" | "ai";
    content: string;
    created_at: string;
    updated_at?: string;
    isTyping?: boolean;
};

type ChatHistoryResponse = {
    isSuccess: boolean;
    code: string;
    message: string;
    data: ChatMessage[];
};

type SendMessageResponse = {
    isSuccess: boolean;
    code: string;
    message: string;
    data: {
        id: string;
        session_id: string;
        user_id: string;
        content: string;
        role: "ai" | "user";
        created_at: string;
        updated_at: string;
    };
};

const API_BASE_URL = "http://localhost:8000/api/v1/rag";
const FIXED_USER_ID = "admin";

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

export default function ChatMain() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const {showBackdrop, hideBackdrop} = useBackdrop()

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

    // Load chat history on component mount
    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<ChatHistoryResponse>(
                `${API_BASE_URL}/chat?user_id=${FIXED_USER_ID}`,
                {
                    headers: {
                        accept: "application/json",
                    },
                }
            );

            if (response.data.isSuccess) {
                const historyMessages = response.data.data.map((msg) => ({
                    ...msg,
                    role: msg.role === "ai" ? "assistant" : msg.role,
                })) as ChatMessage[];
                setMessages(historyMessages);
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (text: string) => {
        const userMessage: ChatMessage = {
            role: "user",
            content: text,
            created_at: new Date().toISOString(),
        };

        // Add user message and typing indicator
        setMessages((prev) => [
            ...prev,
            userMessage,
            {
                role: "assistant",
                content: "Đang soạn...",
                created_at: new Date().toISOString(),
                isTyping: true,
            },
        ]);

        try {
            const response = await axios.post<SendMessageResponse>(
                `${API_BASE_URL}/chat`,
                {
                    content: text,
                    user_id: FIXED_USER_ID,
                },
                {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            // Remove typing indicator and add AI response from API
            if (response.data.isSuccess && response.data.data) {
                const aiMessage = response.data.data;
                setMessages((prev) => {
                    const withoutTyping = prev.filter((msg) => !msg.isTyping);
                    return [
                        ...withoutTyping,
                        {
                            id: aiMessage.id,
                            session_id: aiMessage.session_id,
                            user_id: aiMessage.user_id,
                            role: aiMessage.role === "ai" ? "assistant" : aiMessage.role,
                            content: aiMessage.content,
                            created_at: aiMessage.created_at,
                            updated_at: aiMessage.updated_at,
                        },
                    ];
                });
            } else {
                // Handle unsuccessful response
                setMessages((prev) => {
                    const withoutTyping = prev.filter((msg) => !msg.isTyping);
                    return [
                        ...withoutTyping,
                        {
                            role: "assistant",
                            content: "Xin lỗi, tôi không thể trả lời lúc này.",
                            created_at: new Date().toISOString(),
                        },
                    ];
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            // Remove typing indicator and show error
            setMessages((prev) => {
                const withoutTyping = prev.filter((msg) => !msg.isTyping);
                return [
                    ...withoutTyping,
                    {
                        role: "assistant",
                        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
                        created_at: new Date().toISOString(),
                    },
                ];
            });
        }
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const text = message.trim();
        if (!text) return;
        setMessage("");
        sendMessage(text);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const text = message.trim();
            if (!text) return;
            setMessage("");
            sendMessage(text);
        }
    };

    const clearConversation = async () => {
        showBackdrop();
        await axios.delete(
            `${API_BASE_URL}/chat/delete-chat-admin?user_id=${FIXED_USER_ID}`,
        );
        setMessages([]);
        hideBackdrop();
    };

    return (
        <div className="mx-auto">
            <div
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                className="relative bg-white rounded-3xl border border-[#248FCA]/10 flex flex-col h-[calc(100vh-240px)] max-h-[720px] overflow-hidden"
            >
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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#248FCA]/20 to-[#248FCA]/10 rounded-full flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-[#248FCA] animate-pulse" />
                            </div>
                            <div className="text-gray-600 text-lg">
                                Đang tải lịch sử...
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
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
                                className={`flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300 ${m.role === "user" ? "flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user"
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
                                    className={`max-w-[75%] ${m.role === "user"
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
                                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 ${m.role === "user"
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
                            className="h-[52px] w-[52px] p-0 rounded-2xl bg-gradient-to-r from-[#248FCA] to-[#1e7bb8] hover:from-[#1e7bb8] hover:to-[#248FCA] transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
