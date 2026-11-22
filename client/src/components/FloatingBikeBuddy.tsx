import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Mic, MicOff, ChevronRight, Wrench, AlertTriangle, Loader2 } from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { diagnoseTwoWheelerQuery } from '../utils/mechanicAI';
import { sendAIBuddyMessage } from '../services/aiApi';
import { Link } from 'react-router-dom';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  recommendedIds?: string[];
  warning?: string;
}

export const FloatingBikeBuddy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>('en');

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Namaste! I'm GEAR UP AI Buddy, your 24/7 used two-wheeler advisor. Ask me about buying, selling, prices, condition checks, or RC/insurance!",
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isTyping) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text: q }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendAIBuddyMessage({
        message: q,
        history: historyPayload,
        language,
      });

      const reply = res.response || res.text || 'Diagnostic assessment generated.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          recommendedIds: res.matched_listings?.map((l: any) => l.id),
        },
      ]);
    } catch (err: any) {
      // Complement with offline diagnostic if backend unreachable
      const diagnosis = diagnoseTwoWheelerQuery(q, null);
      let reply = `🔧 **${diagnosis.title}**\n\n`;
      reply += `**Possible Causes:**\n${diagnosis.possibleCauses.slice(0, 2).map((c) => `• ${c}`).join('\n')}\n\n`;
      reply += `*Recommendation:* ${diagnosis.professionalAction}`;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          warning: diagnosis.isSafetyCritical ? diagnosis.safetyWarning : undefined,
          recommendedIds: diagnosis.recommendedListings,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSpeech = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
    recognition.continuous = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-forest-700 to-forest-500 text-white font-bold text-xs shadow-sm hover:scale-105 transition-transform border border-forest-400/50"
        >
          <div className="w-6 h-6 rounded-full bg-[#E9E3D8] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#242622]" />
          </div>
          <span>AI Bike Buddy</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-[#101E19] border border-[#E9E3D8]/80 rounded-none border border-[#E9E3D8] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-forest-900 to-forest-800 border-b border-[#E9E3D8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-[#35483C]/30 flex items-center justify-center text-[#35483C] border border-[#35483C]/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-sm text-white">AI Bike Buddy</h4>
                  <span className="text-[10px] bg-[#35483C]/60 text-[#35483C] px-1.5 rounded font-mono">Mechanic</span>
                </div>
                <p className="text-[10px] text-[#242622]">2-Wheeler Diagnostic Expert</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ai-buddy"
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-bold text-[#242622] hover:text-white bg-white px-2 py-1 rounded-md border border-[#E9E3D8]"
              >
                Expand
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white hover:bg-[#E9E3D8] text-[#85857E] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-none text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#35483C] text-white rounded-br-none'
                      : 'bg-white text-[#242622] border border-[#E9E3D8] rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.warning && (
                    <div className="mt-2 p-2 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-[10px] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{m.warning}</span>
                    </div>
                  )}
                </div>

                {/* Recommended Vehicle Mini Cards */}
                {m.recommendedIds && (
                  <div className="mt-2 space-y-1.5 w-full">
                    {m.recommendedIds.map((id) => {
                      const item = SEED_LISTINGS.find((b) => b.id === id);
                      if (!item) return null;
                      return (
                        <Link
                          key={item.id}
                          to={`/bike/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-none bg-[#E9E3D8]/60 hover:bg-[#E9E3D8]/40 border border-[#E9E3D8] text-xs transition-colors"
                        >
                          <img src={item.primaryImage} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate">{item.title}</p>
                            <p className="text-[#242622] font-semibold">{formatINR(item.price)} • {item.city}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#85857E]" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-[#0B1512] border-t border-[#E9E3D8] flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Clicking sound when I press starter')}
              className="px-2 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] whitespace-nowrap hover:border-[#35483C]"
            >
              Clicking sound
            </button>
            <button
              onClick={() => handleSend('My scooter mileage suddenly dropped')}
              className="px-2 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] whitespace-nowrap hover:border-[#35483C]"
            >
              Mileage drop
            </button>
            <button
              onClick={() => handleSend('Brake lever feels soft and spongy')}
              className="px-2 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] whitespace-nowrap hover:border-[#35483C]"
            >
              Spongy brakes
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E9E3D8] flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-none border transition-colors ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-[#E9E3D8] text-[#242622] border-[#E9E3D8] hover:text-white'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              disabled={isTyping}
              placeholder="Ask anything about 2-wheelers or market..."
              className="flex-1 bg-white border border-[#E9E3D8] rounded-none px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C] disabled:opacity-50"
            />

            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="p-2 rounded-none bg-[#35483C] hover:bg-[#242622] disabled:opacity-40 text-white transition-colors"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
