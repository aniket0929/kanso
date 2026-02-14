"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { getMessages, sendMessage, getConversations } from "@/lib/actions/inbox.actions";
import { toast } from "sonner";
import { Mail, MessageSquare, Inbox } from "lucide-react";

interface Conversation {
  id: string;
  contact: { name: string; email: string | null; phone: string | null };
  subject: string | null;
  updatedAt: Date;
  messages: { id: string; content: string; createdAt: Date }[];
}

interface Message {
  id: string;
  content: string;
  direction: string;
  createdAt: Date;
}

interface InboxClientProps {
  initialConversations: Conversation[];
}

export function InboxClient({ initialConversations }: InboxClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [filter, setFilter] = useState<"all" | "email" | "sms">("all");
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // Filter change handler
  const handleFilterChange = async (newFilter: "all" | "email" | "sms") => {
      setFilter(newFilter);
      setLoadingConversations(true);
      try {
          const newConvs = await getConversations(newFilter);
          setConversations(newConvs);
          // If selected ID is not in new list, select first or null
          if (newConvs.length > 0) {
             const exists = newConvs.find(c => c.id === selectedId);
             if (!exists) setSelectedId(newConvs[0].id);
          } else {
             setSelectedId(null);
          }
      } catch (error) {
          toast.error("Failed to filter conversations");
      } finally {
          setLoadingConversations(false);
      }
  };

  useEffect(() => {
    if (selectedId) {
        setLoadingMessages(true);
        getMessages(selectedId).then((msgs: any) => {
            setMessages(msgs);
            setLoadingMessages(false);
        });
    } else {
        setMessages([]);
    }
  }, [selectedId]);

  const handleSelect = (id: string) => {
      setSelectedId(id);
  };

  const handleSend = async () => {
      if (!selectedId || !replyText.trim()) return;
      setSending(true);
      try {
          const newMsg = await sendMessage(selectedId, replyText);
          setMessages((prev) => [...prev, newMsg as any]);
          setReplyText("");
          toast.success("Message sent");
      } catch (err) {
          toast.error("Failed to send");
      } finally {
          setSending(false);
      }
  };

  const selectedConversation = conversations.find(c => c.id === selectedId);

  return (
    <>
      {/* Sidebar List */}
      <div className="w-full md:w-80 border-r bg-muted/10 flex flex-col">
        <div className="p-4 font-semibold border-b space-y-4">
            <div className="flex items-center justify-between">
                <span>Messages ({conversations.length})</span>
            </div>
            {/* Filter Tabs */}
            <div className="flex bg-muted/50 p-1 rounded-lg">
                <button
                    onClick={() => handleFilterChange("all")}
                    className={cn(
                        "flex-1 text-sm font-medium py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5",
                        filter === "all" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    <Inbox className="w-3.5 h-3.5" />
                    All
                </button>
                <button
                    onClick={() => handleFilterChange("email")}
                    className={cn(
                        "flex-1 text-sm font-medium py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5",
                        filter === "email" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                </button>
                <button
                    onClick={() => handleFilterChange("sms")}
                    className={cn(
                        "flex-1 text-sm font-medium py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5",
                        filter === "sms" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    SMS
                </button>
            </div>
        </div>
        <ScrollArea className="flex-1">
            {loadingConversations ? (
                 <div className="p-8 text-center text-muted-foreground text-md space-y-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    <p>Loading...</p>
                 </div>
            ) : (
                <>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => handleSelect(conv.id)}
                        className={cn(
                            "p-4 border-b cursor-pointer hover:bg-muted/50 transition flex gap-3 items-start",
                            selectedId === conv.id && "bg-muted"
                        )}
                    >
                        <Avatar>
                            <AvatarFallback>{conv.contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium truncate">{conv.contact.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(conv.updatedAt))}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                                {conv.messages[0]?.content.replace(/<[^>]*>?/gm, '') || "No messages"}
                            </p>
                        </div>
                    </div>
                ))}
                {conversations.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-md">
                        No {filter === 'all' ? '' : filter} conversations found.
                    </div>
                )}
                </>
            )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
            <>
                <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold">{selectedConversation.contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedConversation.subject || "No Subject"}</p>
                    </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {loadingMessages ? (
                            <div className="text-center text-md text-muted-foreground p-4">Loading messages...</div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col max-w-[80%] rounded-lg p-3 text-md",
                                        msg.direction === "outbound" 
                                            ? "ml-auto bg-primary text-primary-foreground" 
                                            : "mr-auto bg-muted border"
                                    )}
                                >
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: msg.content }} 
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                    />
                                    <span className="text-md opacity-70 mt-1 self-end">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            ))
                        )}
                        {messages.length === 0 && !loadingMessages && (
                            <div className="text-center text-md text-muted-foreground">Start the conversation...</div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-muted/10">
                    <div className="flex gap-2">
                        <Textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type a reply..." 
                            className="min-h-[50px] resize-none"
                        />
                        <Button 
                            className="h-auto" 
                            onClick={handleSend}
                            disabled={sending || !replyText.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
            </div>
        )}
      </div>
    </>
  );
}
