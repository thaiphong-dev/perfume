"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAdminStore } from "@/store/admin-store";
import {
  Send,
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Paperclip,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function AdminChat() {
  const { chatMessages, fetchChatMessages, markMessageAsRead, replyToMessage } =
    useAdminStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  useEffect(() => {
    if (chatMessages.length > 0 && !selectedUser) {
      setSelectedUser(chatMessages[0].userId);
    }
  }, [chatMessages, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter users based on search term and unread filter
  const filteredUsers = chatMessages
    .filter((message) => {
      const matchesSearch = message.userName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesUnread = filterUnread ? !message.read : true;

      return matchesSearch && matchesUnread;
    })
    .reduce((acc, message) => {
      if (!acc.some((m) => m.userId === message.userId)) {
        acc.push(message);
      }
      return acc;
    }, [] as typeof chatMessages);

  // Get messages for selected user
  const userMessages = chatMessages
    .filter((message) => message.userId === selectedUser)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Mark message as read when selected
  useEffect(() => {
    if (selectedUser) {
      const unreadMessages = chatMessages.filter(
        (message) => message.userId === selectedUser && !message.read
      );

      unreadMessages.forEach((message) => {
        markMessageAsRead(message.id);
      });
    }
  }, [selectedUser, chatMessages, markMessageAsRead]);

  const handleSendReply = async () => {
    if (!selectedUser || !replyText.trim()) return;

    setIsSending(true);

    try {
      // Find the latest message from the selected user
      const latestMessage = [...chatMessages]
        .filter((message) => message.userId === selectedUser)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

      if (latestMessage) {
        await replyToMessage(latestMessage.id, replyText);

        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully.",
        });

        setReplyText("");
        scrollToBottom();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold text-[#4A3034] dark:text-white mb-6">
        Customer Support
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
        {/* User List */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="unread-filter"
                  className="mr-2"
                  checked={filterUnread}
                  onChange={(e) => setFilterUnread(e.target.checked)}
                />
                <label
                  htmlFor="unread-filter"
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  Show unread only
                </label>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "user" : "users"}
              </span>
            </div>
          </div>

          <Separator />

          <ScrollArea className="h-[calc(100%-8rem)]">
            <div className="space-y-1 p-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const unreadCount = chatMessages.filter(
                    (message) => message.userId === user.userId && !message.read
                  ).length;

                  return (
                    <button
                      key={user.userId}
                      className={`w-full flex items-center p-3 rounded-md transition-colors ${
                        selectedUser === user.userId
                          ? "bg-[#4A3034] text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedUser(user.userId)}
                    >
                      <div className="relative">
                        <div className="relative h-10 w-10">
                          <Image
                            src={
                              user.userAvatar ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={user.userName}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <p
                            className={`font-medium ${
                              selectedUser === user.userId
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {user.userName}
                          </p>
                          <p
                            className={`text-xs ${
                              selectedUser === user.userId
                                ? "text-white/70"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {formatTime(user.timestamp)}
                          </p>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            selectedUser === user.userId
                              ? "text-white/70"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {user.message}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="border-b dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-10 w-10">
                      {userMessages.length > 0 && (
                        <Image
                          src={
                            userMessages[0].userAvatar ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={userMessages[0].userName}
                          fill
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userMessages.length > 0
                          ? userMessages[0].userName
                          : "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                        <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {userMessages.length > 0 ? (
                    <>
                      {userMessages.map((message, index) => {
                        // Check if we need to show date separator
                        const showDateSeparator =
                          index === 0 ||
                          formatDate(message.timestamp) !==
                            formatDate(userMessages[index - 1].timestamp);

                        return (
                          <div key={message.id}>
                            {showDateSeparator && (
                              <div className="flex justify-center my-4">
                                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                            )}

                            <div
                              className={`flex ${
                                message.replied
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              {!message.replied && (
                                <div className="flex-shrink-0 mr-3">
                                  <div className="relative h-8 w-8">
                                    <Image
                                      src={
                                        message.userAvatar ||
                                        "/placeholder.svg?height=32&width=32"
                                      }
                                      alt={message.userName}
                                      fill
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}

                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.replied
                                    ? "bg-[#4A3034] text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <div
                                  className={`mt-1 flex items-center justify-end text-xs ${
                                    message.replied
                                      ? "text-white/70"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {formatTime(message.timestamp)}
                                  {message.replied && (
                                    <span className="ml-1">
                                      {message.read ? (
                                        <CheckCheck className="h-3 w-3" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {message.replied && (
                                <div className="flex-shrink-0 ml-3">
                                  <div className="relative h-8 w-8">
                                    <Image
                                      src="/placeholder.svg?height=32&width=32"
                                      alt="Admin"
                                      fill
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No messages yet
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t dark:border-gray-700 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply();
                  }}
                  className="flex items-center space-x-2"
                >
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#4A3034] hover:bg-[#5B4145] text-white"
                    disabled={!replyText.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Info className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
