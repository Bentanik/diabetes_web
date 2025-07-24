"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowUp,
    Clipboard,
    RefreshCcw,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
import {
    useGetChatHistoryService,
    useSendMessageService,
} from "@/services/chat/services";

const ChatItem = ({
    message,
    index,
}: {
    message: API.TChatMessage;
    index: number;
}) => {
    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isUser = message.role === "user";

    if (isUser) {
        // User message - align right
        return (
            <div
                key={index}
                className="flex items-start gap-4 w-full justify-end"
            >
                <div className="grid gap-2 flex-1 max-w-[70%]">
                    <div className="flex items-center gap-2 justify-end">
                        <div className="text-xs text-gray-400">
                            {formatTime(message.created_at)}
                        </div>
                        <div className="font-semibold text-gray-900">Bạn</div>
                    </div>
                    <div className="w-full flex justify-end">
                        <div className="text-right prose prose-sm text-gray-800 max-w-none bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3">
                            <div className="whitespace-pre-wrap leading-relaxed text-sm">
                                {message.content}
                            </div>
                        </div>
                    </div>
                </div>
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                    <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="User Avatar"
                    />
                    <AvatarFallback className="bg-[#248fca] text-white">
                        U
                    </AvatarFallback>
                </Avatar>
            </div>
        );
    }

    // AI message - align left
    return (
        <div key={index} className="flex items-start gap-4 w-full">
            <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder-ai.jpg" alt="AI Avatar" />
                <AvatarFallback className="bg-gray-600 text-white">
                    AI
                </AvatarFallback>
            </Avatar>
            <div className="grid gap-2 flex-1 max-w-[70%]">
                <div className="flex items-center gap-2">
                    <div className="font-semibold text-gray-900">
                        AI Assistant
                    </div>
                    <div className="text-xs text-gray-400">
                        {formatTime(message.created_at)}
                    </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="prose prose-sm text-gray-800 max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm">
                            {message.content}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 pt-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                        onClick={() => copyMessage(message.content)}
                    >
                        <Clipboard className="w-3.5 h-3.5" />
                        <span className="sr-only">Copy</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 hover:bg-green-50 text-gray-500 hover:text-green-600"
                    >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="sr-only">Upvote</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 hover:bg-red-50 text-gray-500 hover:text-red-600"
                    >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span className="sr-only">Downvote</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 hover:bg-blue-50 text-gray-500 hover:text-[#248fca]"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span className="sr-only">Regenerate</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function CheckMain() {
    const [localMessages, setLocalMessages] = useState<API.TChatMessage[]>([]);
    const [input, setInput] = useState("");

    const {
        mutate: sendMessageAPI,
        isPending: isSending,
        isError: isSendError,
        error: sendError,
    } = useSendMessageService();

    // Fetch chat history from API
    const {
        chat_history: chatHistoryData,
        isPending,
        isError,
        error,
        refetch: refetchHistory,
    } = useGetChatHistoryService({
        session_id: "admin",
        limit: 100,
        skip: 0,
    });

    // Extract chat_history from response
    const chat_history = chatHistoryData;

    // Combine API data with local messages
    const [allMessages, setAllMessages] = useState<API.TChatMessage[]>([]);

    useEffect(() => {
        if (chat_history?.messages) {
            // Combine API messages with local messages
            const combined = [...chat_history.messages, ...localMessages];
            // Sort by created_at to maintain chronological order
            const sorted = combined.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );
            setAllMessages(sorted);
        } else {
            setAllMessages(localMessages);
        }
    }, [chat_history, localMessages]);

    const sendMessage = async () => {
        if (!input.trim() || isSending) return;

        const userMessage: API.TChatMessage = {
            role: "user",
            content: input.trim(),
            created_at: new Date().toISOString(),
        };

        // Add user message to local state immediately
        setLocalMessages((prev) => [...prev, userMessage]);
        const currentInput = input.trim();
        setInput("");

        sendMessageAPI(
            {
                session_id: "admin",
                user_id: "admin", // Có thể lấy từ auth context
                message: currentInput,
            },
            {
                onSuccess: (response) => {
                    if (response.value.data?.answer) {
                        const aiMessage: API.TChatMessage = {
                            role: "assistant",
                            content: response.value.data.answer,
                            created_at: new Date().toISOString(),
                        };
                        setLocalMessages((prev) => [...prev, aiMessage]);
                    }

                    setTimeout(() => {
                        refetchHistory();
                        setLocalMessages([]);
                    }, 1000);
                },
                onError: (error: TMeta) => {
                    console.error("Send message error:", error);

                    const errorMessage: API.TChatMessage = {
                        role: "assistant",
                        content: `Xin lỗi, đã có lỗi xảy ra: ${
                            error?.title || "Không thể kết nối với server"
                        }. Vui lòng thử lại sau.`,
                        created_at: new Date().toISOString(),
                    };
                    setLocalMessages((prev) => [...prev, errorMessage]);
                },
            }
        );
    };

    // Loading state
    if (isPending) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#248fca]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 border-2 border-[#248fca] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-600 text-lg font-medium">
                                Đang tải lịch sử chat...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-red-600 text-lg font-medium">
                                Lỗi tải dữ liệu
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                {error?.message || "Không thể tải lịch sử chat"}
                            </p>
                            <Button
                                onClick={() => refetchHistory()}
                                className="mt-4 bg-[#248fca] hover:bg-[#248fca]/90"
                            >
                                Thử lại
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto">
            {/* Chat Messages Container */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-sm h-[calc(100vh-200px)] overflow-y-auto">
                <div className="flex flex-col gap-6 overflow-y-auto">
                    {allMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#248fca]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-[#248fca]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-lg font-medium">
                                    Chào mừng đến với AI Assistant
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Nhập tin nhắn bên dưới để bắt đầu trò chuyện
                                </p>
                            </div>
                        </div>
                    ) : (
                        allMessages.map((message, index) => (
                            <ChatItem
                                key={`${message.created_at}-${index}`}
                                message={message}
                                index={index}
                            />
                        ))
                    )}

                    {/* Loading indicator khi đang gửi */}
                    {isSending && (
                        <div className="flex items-start gap-4 w-full">
                            <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-gray-600 text-white">
                                    AI
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-2 flex-1 max-w-[70%]">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold text-gray-900">
                                        AI Assistant
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date().toLocaleTimeString(
                                            "vi-VN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-[#248fca] rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-[#248fca] rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.1s",
                                                }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-[#248fca] rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm">
                                            AI đang suy nghĩ...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area Container */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <Textarea
                            placeholder="Nhập tin nhắn để trò chuyện với AI Assistant..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            rows={3}
                            className="min-h-[80px] resize-none pr-16 focus:border-[#248fca] focus:ring-[#248fca] border-gray-300 rounded-xl"
                            disabled={isSending}
                        />
                        <Button
                            onClick={sendMessage}
                            size="icon"
                            className="absolute w-10 h-10 top-3 right-3 bg-[#248fca] hover:bg-[#248fca]/90 transition-all duration-200 disabled:opacity-50"
                            disabled={isSending || !input.trim()}
                        >
                            {isSending ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <ArrowUp className="w-5 h-5 text-white" />
                            )}
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>

                    {/* Helper text và error display */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                            Enter để gửi, Shift+Enter để xuống dòng
                        </span>
                        {/* Error display */}
                        {isSendError && (
                            <span className="text-red-500 font-medium">
                                {sendError?.title || "Không thể gửi tin nhắn"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
