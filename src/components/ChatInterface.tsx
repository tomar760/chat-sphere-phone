import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Video, MoreVertical, ArrowLeft, Mic, Smile, Paperclip } from "lucide-react";
import { Contact } from "./ContactList";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { StoryViewer } from "./StoryViewer";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  status?: "sent" | "delivered" | "read";
  reactions?: { emoji: string; users: string[] }[];
  isEdited?: boolean;
  replyTo?: { id: string; text: string; sender: string };
  isVoiceMessage?: boolean;
  voiceDuration?: string;
}

interface ChatInterfaceProps {
  contact: Contact;
  onBack?: () => void;
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hey! How's your day going?",
    timestamp: "2:30 PM",
    isSent: false,
    reactions: [{ emoji: "❤️", users: ["me"] }],
  },
  {
    id: "2",
    text: "It's going great! Just finished a big project at work. How about you?",
    timestamp: "2:32 PM",
    isSent: true,
    status: "delivered",
    isEdited: true,
  },
  {
    id: "3",
    text: "That's awesome! I'm just catching up on some reading. What kind of project was it?",
    timestamp: "2:33 PM",
    isSent: false,
    replyTo: { id: "2", text: "It's going great! Just finished a big project...", sender: "You" },
  },
  {
    id: "4",
    text: "",
    timestamp: "2:34 PM",
    isSent: true,
    status: "delivered",
    isVoiceMessage: true,
    voiceDuration: "0:23",
  },
  {
    id: "5",
    text: "That sounds amazing! Can't wait to see it 🚀",
    timestamp: "2:35 PM",
    isSent: false,
    reactions: [{ emoji: "🚀", users: ["me"] }, { emoji: "👍", users: ["Sarah", "Mike"] }],
  },
];

export const ChatInterface = ({ contact, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const mockStories = [
    {
      id: "1",
      userId: contact.id,
      userName: contact.name,
      userAvatar: contact.avatar,
      content: "Beautiful sunset today! 🌅",
      timestamp: "2 hours ago",
      views: 12,
      type: "text" as const,
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: "2", 
      userId: contact.id,
      userName: contact.name,
      userAvatar: contact.avatar,
      content: "Having an amazing day!",
      timestamp: "4 hours ago", 
      views: 8,
      type: "text" as const,
      backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    }
  ];

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !isRecording) return;

    const message: Message = {
      id: Date.now().toString(),
      text: isRecording ? "" : newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      status: "sent",
      replyTo: replyToMessage ? {
        id: replyToMessage.id,
        text: replyToMessage.text,
        sender: replyToMessage.isSent ? "You" : contact.name
      } : undefined,
      isVoiceMessage: isRecording,
      voiceDuration: isRecording ? "0:15" : undefined,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setReplyToMessage(null);
    setIsRecording(false);

    // Simulate message delivery status
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: "delivered" as const } : msg
        )
      );
    }, 1000);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
      if (existingReaction) {
        // Toggle reaction
        const hasUserReacted = existingReaction.users.includes("me");
        return {
          ...msg,
          reactions: msg.reactions?.map(r => 
            r.emoji === emoji 
              ? { 
                  ...r, 
                  users: hasUserReacted 
                    ? r.users.filter(u => u !== "me")
                    : [...r.users, "me"]
                } 
              : r
          ).filter(r => r.users.length > 0)
        };
      } else {
        // Add new reaction
        return {
          ...msg,
          reactions: [...(msg.reactions || []), { emoji, users: ["me"] }]
        };
      }
    }));
  };

  const handleEdit = (messageId: string, newText: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, text: newText, isEdited: true }
        : msg
    ));
  };

  const handleReply = (message: Message) => {
    setReplyToMessage(message);
  };

  const StatusIcon = ({ status }: { status?: Message["status"] }) => {
    if (!status) return null;
    
    return (
      <div className="flex items-center">
        {status === "sent" && (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-3 h-3 text-chat-time">✓</div>
          </div>
        )}
        {status === "delivered" && (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-3 h-3 text-chat-time">✓✓</div>
          </div>
        )}
        {status === "read" && (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-3 h-3 text-whatsapp-green">✓✓</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-chat-bg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        
        <Avatar 
          className={`w-10 h-10 cursor-pointer ${
            contact.hasStory 
              ? `ring-2 ${contact.storyViewed ? 'ring-gray-400' : 'ring-whatsapp-green'} ring-offset-2 ring-offset-background` 
              : ''
          }`}
          onClick={() => contact.hasStory && setShowStories(true)}
        >
          <AvatarImage src={contact.avatar} />
          <AvatarFallback className="bg-whatsapp-green text-white">
            {contact.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold">{contact.name}</h2>
          <p className="text-sm text-muted-foreground">
            {contact.isOnline ? "Online" : contact.lastSeen}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReaction={handleReaction}
              onReply={handleReply}
              onEdit={handleEdit}
            />
          ))}
          
          {/* Typing indicator */}
          <TypingIndicator isTyping={contact.isTyping || false} userName={contact.name} />
        </div>
      </ScrollArea>

      {/* Reply preview */}
      {replyToMessage && (
        <div className="px-4 py-2 bg-muted border-t border-l-4 border-whatsapp-green">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-whatsapp-green">
                Replying to {replyToMessage.isSent ? "yourself" : contact.name}
              </p>
              <p className="text-muted-foreground truncate max-w-[300px]">
                {replyToMessage.text || "Voice message"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyToMessage(null)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-card border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Smile className="w-4 h-4" />
          </Button>
          
          {newMessage.trim() ? (
            <Button
              type="submit"
              size="sm"
              className="bg-whatsapp-green hover:bg-whatsapp-green-dark text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className={`${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-whatsapp-green hover:bg-whatsapp-green-dark'
              } text-white transition-colors`}
              onClick={() => {
                if (isRecording) {
                  handleSendMessage(new Event('submit') as any);
                } else {
                  setIsRecording(true);
                }
              }}
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>

      {/* Story Viewer */}
      {showStories && (
        <StoryViewer
          stories={mockStories}
          currentStoryIndex={0}
          onClose={() => setShowStories(false)}
          onNext={() => {}}
          onPrevious={() => {}}
        />
      )}
    </div>
  );
};