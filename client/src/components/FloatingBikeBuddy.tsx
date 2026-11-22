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
      {/* Floating Toggle Button (Positioned safely above bottom nav on mobile) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs shadow-elevated hover:scale-105 transition-all border border-[#35483C]"
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-[#35483C]" />
          </div>
          <span className="hidden xs:inline">AI Bike Buddy</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 max-w-[calc(100vw-1.5rem)] h-[520px] max-h-[80vh] bg-white border border-[#E9E3D8] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-3.5 bg-[#242622] text-white border-b border-[#35483C] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#35483C] flex items-center justify-center text-white border border-[#A4AD98]/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-sm text-white">AI Bike Buddy</h4>
                  <span className="text-[9px] bg-[#35483C] text-white px-1.5 py-0.5 font-mono uppercase tracking-wider">Mechanic</span>
                </div>
                <p className="text-[10px] text-[#A4AD98]">Two-Wheeler Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ai-buddy"
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-mono font-bold text-white hover:text-[#35483C] bg-white/10 hover:bg-white px-2 py-1 border border-white/20 transition-colors"
              >
                Expand
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-white/10 hover:bg-white text-white hover:text-[#242622] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F5EF]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#35483C] text-white'
                      : 'bg-white text-[#242622] border border-[#E9E3D8]'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.warning && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 text-[10px] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
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
                          className="flex items-center gap-2 p-2 bg-white hover:bg-[#F7F5EF] border border-[#E9E3D8] text-xs transition-colors"
                        >
                          <img src={item.primaryImage} alt={item.title} className="w-10 h-10 object-cover border border-[#E9E3D8]" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#242622] truncate">{item.title}</p>
                            <p className="text-[#35483C] font-semibold">{formatINR(item.price)} • {item.city}</p>
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
          <div className="px-3 py-2 bg-white border-t border-[#E9E3D8] flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Clicking sound when I press starter')}
              className="px-2.5 py-1 bg-[#F7F5EF] border border-[#E9E3D8] text-[#242622] whitespace-nowrap hover:border-[#35483C] transition-colors"
            >
              Clicking sound
            </button>
            <button
              onClick={() => handleSend('My scooter mileage suddenly dropped')}
              className="px-2.5 py-1 bg-[#F7F5EF] border border-[#E9E3D8] text-[#242622] whitespace-nowrap hover:border-[#35483C] transition-colors"
            >
              Mileage drop
            </button>
            <button
              onClick={() => handleSend('Brake lever feels soft and spongy')}
              className="px-2.5 py-1 bg-[#F7F5EF] border border-[#E9E3D8] text-[#242622] whitespace-nowrap hover:border-[#35483C] transition-colors"
            >
              Spongy brakes
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E9E3D8] flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              disabled={isTranscribing}
              className={`p-2.5 border transition-colors ${
                isListening
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-[#F7F5EF] text-[#242622] border-[#E9E3D8] hover:border-[#35483C]'
              }`}
              title="Voice Input"
            >
              {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin text-[#35483C]" /> : (isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />)}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              disabled={isTyping}
              placeholder={isTranscribing ? "Transcribing speech..." : "Ask anything about 2-wheelers or market..."}
              className="flex-1 bg-[#F7F5EF] border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C] disabled:opacity-50"
            />

            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="p-2.5 bg-[#35483C] hover:bg-[#242622] border border-[#35483C] disabled:opacity-40 text-white transition-colors"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
