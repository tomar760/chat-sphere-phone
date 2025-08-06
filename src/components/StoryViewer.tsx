import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  views: number;
  type: "text" | "image";
  backgroundColor?: string;
}

interface StoryViewerProps {
  stories: Story[];
  currentStoryIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const StoryViewer = ({ 
  stories, 
  currentStoryIndex, 
  onClose, 
  onNext, 
  onPrevious 
}: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [reply, setReply] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [liked, setLiked] = useState(false);

  const currentStory = stories[currentStoryIndex];
  const storyDuration = 5000; // 5 seconds per story

  useEffect(() => {
    setProgress(0);
    setLiked(false);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + (100 / (storyDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, onNext]);

  const handleReply = () => {
    if (reply.trim()) {
      // Handle reply logic here
      console.log("Reply sent:", reply);
      setReply("");
      setShowReplyInput(false);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentStoryIndex ? '100%' : 
                       index === currentStoryIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={currentStory.userAvatar} />
            <AvatarFallback className="bg-whatsapp-green text-white">
              {currentStory.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">{currentStory.userName}</p>
            <p className="text-white/70 text-sm">{currentStory.timestamp}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Story content */}
      <div 
        className="w-full h-full flex items-center justify-center relative"
        style={{
          backgroundColor: currentStory.backgroundColor || '#000'
        }}
      >
        {currentStory.type === "text" ? (
          <div className="text-white text-2xl font-medium text-center px-8 max-w-md">
            {currentStory.content}
          </div>
        ) : (
          <img 
            src={currentStory.content} 
            alt="Story content"
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* Navigation areas */}
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1 cursor-pointer" 
            onClick={onPrevious}
          />
          <div 
            className="flex-1 cursor-pointer" 
            onClick={onNext}
          />
        </div>
      </div>

      {/* Story actions */}
      <div className="absolute bottom-6 left-4 right-4 flex items-center gap-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLiked(!liked)}
          className={`text-white hover:bg-white/20 rounded-full ${
            liked ? 'text-red-500' : 'text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        </Button>

        {showReplyInput ? (
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Reply to story..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="text-white hover:bg-white/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyInput(true)}
            className="flex-1 text-white hover:bg-white/20 justify-start rounded-full border border-white/30"
          >
            Reply to story...
          </Button>
        )}
      </div>

      {/* Story views counter */}
      <div className="absolute bottom-20 left-4 text-white/70 text-sm z-10">
        👁 {currentStory.views} views
      </div>
    </div>
  );
};