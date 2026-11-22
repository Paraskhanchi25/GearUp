import React, { useState, useRef } from 'react';
import { Bot, X, Send, Sparkles, Mic, MicOff, ChevronRight, Wrench, AlertTriangle, Loader2 } from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { diagnoseTwoWheelerQuery } from '../utils/mechanicAI';
import { sendAIBuddyMessage, transcribeAudio } from '../services/aiApi';
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

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I'm GEAR UP AI Buddy, your advisor for India's used two-wheeler marketplace. Ask me about buying, selling, prices, condition checks, or RC/insurance.",
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const startAudioRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        fallbackSpeechRecognition();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        audioStreamRef.current?.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;

        if (audioBlob.size > 200) {
          setIsTranscribing(true);
          try {
            const reader = new FileReader();
            reader.onload = async () => {
              const base64Audio = reader.result as string;
              try {
                const transRes = await transcribeAudio({
                  audio_data: base64Audio,
                  mime_type: audioBlob.type || 'audio/webm',
                });
                if (transRes && transRes.transcript) {
                  setInput((prev) => (prev ? `${prev} ${transRes.transcript}` : transRes.transcript));
                }
              } catch (err) {
                console.warn('Audio transcription error:', err);
              } finally {
                setIsTranscribing(false);
              }
            };
            reader.readAsDataURL(audioBlob);
          } catch (e) {
            setIsTranscribing(false);
          }
        } else {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsListening(true);
    } catch (err) {
      console.warn('Microphone error:', err);
      fallbackSpeechRecognition();
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleSpeech = () => {
    if (isListening) {
      stopAudioRecording();
    } else {
      startAudioRecording();
    }
  };

  const fallbackSpeechRecognition = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <>
      {/* Floating Toggle Button (Positioned safely above bottom nav on mobile: bottom-20 sm:bottom-6) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#161816] hover:bg-[#242622] text-white font-mono font-medium text-xs shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all duration-300 border border-white/15 tactile-btn backdrop-blur-xl group"
          aria-label="Open AI Bike Buddy"
        >
          <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold tracking-wide">AI Buddy</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Window - Apple Liquid Glass Container */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 sm:inset-auto sm:bottom-8 sm:right-8 z-50 sm:w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[82vh] bg-white/95 backdrop-blur-2xl border border-[#242622]/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in ring-1 ring-black/5">
          {/* Header - Porsche / Dark Glass Head */}
          <div className="px-5 py-4 bg-[#161816] text-white border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#35483C] flex items-center justify-center text-white border border-white/15 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-semibold text-sm text-white tracking-tight">AI Bike Buddy</h4>
                  <span className="text-[10px] bg-white/10 text-[#FAF9F5] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider border border-white/10">
                    Mechanic AI
                  </span>
                </div>
                <p className="text-[11px] text-[#A4AD98]">Two-Wheeler Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ai-buddy"
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-mono font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/15 transition-all duration-300 tactile-btn"
              >
                Expand
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-all duration-300 tactile-btn"
                aria-label="Close AI Bike Buddy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF9F5]/70">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#35483C] text-white rounded-2xl rounded-tr-xs shadow-sm font-sans'
                      : 'bg-white text-[#242622] rounded-2xl rounded-tl-xs border border-[#242622]/[0.08] shadow-sm font-sans'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.warning && (
                    <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] rounded-xl flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{m.warning}</span>
                    </div>
                  )}
                </div>

                {/* Recommended Vehicle Mini Cards */}
                {m.recommendedIds && (
                  <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                    {m.recommendedIds.map((id) => {
                      const item = SEED_LISTINGS.find((b) => b.id === id);
                      if (!item) return null;
                      return (
                        <Link
                          key={item.id}
                          to={`/bike/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2.5 bg-white hover:bg-[#F7F5EF] border border-[#242622]/[0.08] rounded-2xl text-xs transition-all duration-300 shadow-sm hover:shadow-md tactile-btn"
                        >
                          <img
                            src={item.primaryImage}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#242622]/10"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#242622] truncate">{item.title}</p>
                            <p className="text-[#35483C] font-semibold text-[11px]">
                              {formatINR(item.price)} • {item.city}
                            </p>
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

          {/* Quick Prompts Pills */}
          <div className="px-4 py-2.5 bg-white/80 border-t border-[#242622]/[0.06] flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend('Clicking sound when I press starter')}
              className="px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#242622]/10 text-[#242622] whitespace-nowrap hover:bg-[#35483C] hover:text-white hover:border-[#35483C] transition-all duration-200 tactile-btn shrink-0"
            >
              Clicking starter sound
            </button>
            <button
              onClick={() => handleSend('My scooter mileage suddenly dropped')}
              className="px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#242622]/10 text-[#242622] whitespace-nowrap hover:bg-[#35483C] hover:text-white hover:border-[#35483C] transition-all duration-200 tactile-btn shrink-0"
            >
              Mileage drop
            </button>
            <button
              onClick={() => handleSend('Brake lever feels soft and spongy')}
              className="px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#242622]/10 text-[#242622] whitespace-nowrap hover:bg-[#35483C] hover:text-white hover:border-[#35483C] transition-all duration-200 tactile-btn shrink-0"
            >
              Spongy brakes
            </button>
          </div>

          {/* Input Box - Apple Liquid Glass Style */}
          <div className="p-3.5 bg-white border-t border-[#242622]/[0.08] flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              disabled={isTranscribing}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 tactile-btn shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-[#FAF9F5] text-[#242622] border-[#242622]/10 hover:border-[#35483C]'
              }`}
              title="Voice Input"
              aria-label="Voice Input"
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#35483C]" />
              ) : isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1 flex items-center bg-[#FAF9F5] rounded-full border border-[#242622]/10 px-3.5 py-1.5 focus-within:border-[#35483C] focus-within:ring-2 focus-within:ring-[#35483C]/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                disabled={isTyping}
                placeholder={isTranscribing ? "Transcribing speech..." : "Ask mechanic or advisor..."}
                className="w-full bg-transparent text-xs text-[#242622] placeholder:text-[#85857E] focus:outline-none disabled:opacity-50"
              />
            </div>

            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#35483C] hover:bg-[#242622] disabled:opacity-30 text-white flex items-center justify-center transition-all duration-300 tactile-btn shadow-sm shrink-0"
              aria-label="Send Message"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
