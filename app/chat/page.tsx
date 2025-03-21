"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Send,
  Paperclip,
  ChevronLeft,
  Phone,
  Video,
  Info,
  Loader2,
} from "lucide-react";
import { useAuthStore, useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Message {
  id: string;
  content: string;
  sender: "user" | "admin";
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  attachment?: {
    type: "image" | "file";
    url: string;
    name: string;
  };
}

export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();
  const { toast } = useToast();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "admin",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "read",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsSending(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate sending delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
      setIsSending(false);

      // Simulate admin typing
      setIsTyping(true);

      // Simulate admin response after delay
      setTimeout(() => {
        setIsTyping(false);

        // Add admin response
        const adminResponses = [
          "Thank you for your message! I'll look into this for you.",
          "I understand your concern. Let me check what options we have available.",
          "That's a great question about our products. Let me provide some information.",
          "I'd be happy to help you with your skincare routine.",
          "We have several options that might work for your needs.",
        ];

        const randomResponse =
          adminResponses[Math.floor(Math.random() * adminResponses.length)];

        const adminMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: "admin",
          timestamp: new Date(),
          status: "delivered",
        };

        setMessages((prev) => [...prev, adminMessage]);
      }, 2000);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="border-b dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => router.back()}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="relative h-10 w-10">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Beauty Consultant"
                        fill
                        className="rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                    </div>
                    <div>
                      <p className="font-medium text-[#4A3034] dark:text-white">
                        Beauty Consultant
                      </p>
                      <p className="text-xs text-[#6D5D60] dark:text-gray-400">
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-[#4A3034] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-[#4A3034] dark:text-white"
                        }`}
                      >
                        {message.attachment && (
                          <div className="mb-2">
                            {message.attachment.type === "image" ? (
                              <div className="relative h-40 w-full overflow-hidden rounded">
                                <Image
                                  src={
                                    message.attachment.url || "/placeholder.svg"
                                  }
                                  alt="Attachment"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center rounded bg-white dark:bg-gray-600 p-2">
                                <Paperclip className="mr-2 h-4 w-4" />
                                <span className="text-sm">
                                  {message.attachment.name}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`mt-1 flex items-center justify-end text-xs ${
                            message.sender === "user"
                              ? "text-gray-300"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                          {message.sender === "user" && (
                            <span className="ml-1">
                              {message.status === "sending" && "✓"}
                              {message.status === "sent" && "✓"}
                              {message.status === "delivered" && "✓✓"}
                              {message.status === "read" && "✓✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg bg-gray-100 dark:bg-gray-700 p-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-300"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-300"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-300"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t dark:border-gray-700 p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-2"
                >
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("type_a_message")}
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#4A3034] hover:bg-[#3A2024] text-white"
                    disabled={!newMessage.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#6D5D60] dark:text-gray-400">
                {t("chat_support_hours")}: 9:00 AM - 6:00 PM, Monday to Friday
              </p>
              <p className="text-sm text-[#6D5D60] dark:text-gray-400">
                {t("chat_support_note")}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
