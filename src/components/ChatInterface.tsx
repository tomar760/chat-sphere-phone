import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Contact } from "./ContactList";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  status?: "sent" | "delivered" | "read";
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
  },
  {
    id: "2",
    text: "It's going great! Just finished a big project at work. How about you?",
    timestamp: "2:32 PM",
    isSent: true,
    status: "delivered",
  },
  {
    id: "3",
    text: "That's awesome! I'm just catching up on some reading. What kind of project was it?",
    timestamp: "2:33 PM",
    isSent: false,
  },
  {
    id: "4",
    text: "It was a new mobile app design for our client. Really exciting stuff! 🚀",
    timestamp: "2:34 PM",
    isSent: true,
    status: "delivered",
  },
];

export const ChatInterface = ({ contact, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      status: "sent",
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate message delivery status
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: "delivered" as const } : msg
        )
      );
    }, 1000);
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
        
        <Avatar className="w-10 h-10">
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
            <div
              key={message.id}
              className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  message.isSent
                    ? 'bg-chat-sent text-white rounded-br-md'
                    : 'bg-chat-received rounded-bl-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-xs ${message.isSent ? 'text-white/70' : 'text-chat-time'}`}>
                    {message.timestamp}
                  </span>
                  {message.isSent && <StatusIcon status={message.status} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-card border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            className="bg-whatsapp-green hover:bg-whatsapp-green-dark text-white"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};