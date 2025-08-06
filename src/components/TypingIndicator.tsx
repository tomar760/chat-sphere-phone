import { useEffect, useState } from "react";

interface TypingIndicatorProps {
  isTyping: boolean;
  userName: string;
}

export const TypingIndicator = ({ isTyping, userName }: TypingIndicatorProps) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "." : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isTyping) return null;

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[70%] px-4 py-2 rounded-2xl shadow-sm bg-chat-received rounded-bl-md">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground italic">
            {userName} is typing{dots}
          </span>
        </div>
      </div>
    </div>
  );
};