import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Reply, Edit3, Mic, Play, Pause } from "lucide-react";
import { Message } from "./ChatInterface";

interface MessageBubbleProps {
  message: Message;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  onEdit: (messageId: string, newText: string) => void;
}

const commonEmojis = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

export const MessageBubble = ({ message, onReaction, onReply, onEdit }: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEdit = () => {
    if (editText.trim() && editText !== message.text) {
      onEdit(message.id, editText);
    }
    setIsEditing(false);
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
    <div
      className={`group flex ${message.isSent ? 'justify-end' : 'justify-start'} relative`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Reply indicator */}
      {message.replyTo && (
        <div className={`w-full mb-1 ${message.isSent ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block px-2 py-1 rounded text-xs bg-muted text-muted-foreground border-l-2 ${
            message.isSent ? 'border-white/50' : 'border-whatsapp-green/50'
          }`}>
            <div className="font-medium">{message.replyTo.sender}</div>
            <div className="truncate max-w-[200px]">{message.replyTo.text}</div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {showActions && (
        <div className={`absolute top-0 ${message.isSent ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background shadow-md hover:bg-accent"
            onClick={() => setShowReactions(!showReactions)}
          >
            😊
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background shadow-md hover:bg-accent"
            onClick={() => onReply(message)}
          >
            <Reply className="w-4 h-4" />
          </Button>
          {message.isSent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-background shadow-md hover:bg-accent"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background shadow-md hover:bg-accent"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Reaction picker */}
      {showReactions && (
        <div className={`absolute ${message.isSent ? 'right-0' : 'left-0'} -top-12 bg-background border rounded-full p-2 shadow-lg flex gap-1 z-20`}>
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              className="hover:bg-accent rounded-full p-1 transition-colors"
              onClick={() => {
                onReaction(message.id, emoji);
                setShowReactions(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative ${
          message.isSent
            ? 'bg-chat-sent text-white rounded-br-md'
            : 'bg-chat-received rounded-bl-md'
        }`}
      >
        {/* Voice message */}
        {message.isVoiceMessage ? (
          <div className="flex items-center gap-3 min-w-[200px]">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-full ${
                message.isSent ? 'hover:bg-white/20' : 'hover:bg-black/10'
              }`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            {/* Voice waveform */}
            <div className="flex-1 flex items-center gap-1 h-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-current opacity-70 rounded-full transition-all duration-100 ${
                    isPlaying && i < 8 ? 'animate-pulse' : ''
                  }`}
                  style={{
                    height: `${Math.random() * 16 + 8}px`,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
            
            <span className={`text-xs ${message.isSent ? 'text-white/70' : 'text-muted-foreground'}`}>
              {message.voiceDuration || "0:32"}
            </span>
          </div>
        ) : (
          /* Text message */
          <>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEdit();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  className={`w-full bg-transparent border-none outline-none text-sm ${
                    message.isSent ? 'text-white' : 'text-foreground'
                  }`}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className={`h-6 px-2 text-xs ${
                      message.isSent ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className={`h-6 px-2 text-xs ${
                      message.isSent ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10'
                    }`}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{message.text}</p>
            )}
          </>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-1 py-0 h-5 bg-background/80 hover:bg-background cursor-pointer"
                onClick={() => onReaction(message.id, reaction.emoji)}
              >
                {reaction.emoji} {reaction.users.length}
              </Badge>
            ))}
          </div>
        )}

        {!isEditing && (
          <div className="flex items-center justify-end gap-1 mt-1">
            {message.isEdited && (
              <span className={`text-xs italic ${message.isSent ? 'text-white/50' : 'text-muted-foreground/70'}`}>
                edited
              </span>
            )}
            <span className={`text-xs ${message.isSent ? 'text-white/70' : 'text-chat-time'}`}>
              {message.timestamp}
            </span>
            {message.isSent && <StatusIcon status={message.status} />}
          </div>
        )}

        {/* Read receipts with avatars */}
        {message.status === "read" && message.isSent && (
          <div className="flex -space-x-1 mt-1 justify-end">
            <Avatar className="w-4 h-4 border border-white">
              <AvatarFallback className="bg-whatsapp-green text-white text-xs">
                {message.isSent ? 'R' : 'S'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};