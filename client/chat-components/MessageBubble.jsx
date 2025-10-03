import ReactMarkdown from "react-markdown";
import { User, Bot, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function MessageBubble({ chat, formatTime }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  const handleSpeak = () => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(chat.message);

    // Set up event listeners
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak the message
    window.speechSynthesis.speak(utterance);
    speechRef.current = utterance;
  };

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <div className={`flex ${chat.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] ${
          chat.isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className={`flex-shrink-0 ${chat.isUser ? "ml-3" : "mr-3"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              chat.isUser
                ? "bg-slate-900 dark:bg-slate-100"
                : "bg-gradient-to-r from-emerald-500 to-green-500"
            }`}
          >
            {chat.isUser ? (
              <User className="w-4 h-4 text-white dark:text-slate-900" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
        <div
          className={`px-4 py-3 rounded-3xl ${
            chat.isUser
              ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
              : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            <ReactMarkdown>{chat.message}</ReactMarkdown>
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-60">
              {formatTime(chat.createdAt)}
            </span>
            {!chat.isUser && (
              <button
                onClick={handleSpeak}
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                  isSpeaking
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                }`}
                title={isSpeaking ? "Stop speaking" : "Speak message"}
              >
                <Volume2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
