import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ContactListProps {
  onContactSelect: (contact: Contact) => void;
  selectedContactId?: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    lastMessage: "Hey! How's your day going?",
    lastMessageTime: "2:34 PM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    phone: "+1 (555) 987-6543",
    lastMessage: "Thanks for the help earlier!",
    lastMessageTime: "1:15 PM",
    isOnline: false,
    lastSeen: "Last seen 30 minutes ago",
  },
  {
    id: "3",
    name: "Emily Davis",
    phone: "+1 (555) 456-7890",
    lastMessage: "Can we meet tomorrow?",
    lastMessageTime: "12:45 PM",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    phone: "+1 (555) 321-0987",
    lastMessage: "Perfect! See you then.",
    lastMessageTime: "11:30 AM",
    isOnline: false,
    lastSeen: "Last seen 2 hours ago",
  },
  {
    id: "5",
    name: "Jordan Smith",
    phone: "+1 (555) 654-3210",
    lastMessage: "Check out this cool article!",
    lastMessageTime: "Yesterday",
    isOnline: true,
  },
];

export const ContactList = ({ onContactSelect, selectedContactId }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-whatsapp-green rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Chats</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contacts */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                selectedContactId === contact.id ? 'bg-accent' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="bg-whatsapp-green text-white">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-online rounded-full border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {contact.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.lastMessage || contact.lastSeen || "No messages yet"}
                  </p>
                  {contact.unreadCount && contact.unreadCount > 0 && (
                    <Badge className="bg-whatsapp-green text-white ml-2 min-w-[20px] h-5 rounded-full text-xs">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};