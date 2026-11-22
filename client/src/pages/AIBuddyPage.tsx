import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Wrench, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Volume2,
  Trash2,
  X,
  Plus
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { 
  diagnoseTwoWheelerQuery, 
  POPULAR_PROFILES, 
  PersonalizedVehicleProfile, 
  MechanicDiagnosis 
} from '../utils/mechanicAI';
import { sendAIBuddyMessage } from '../services/aiApi';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  diagnosis?: MechanicDiagnosis;
  imageAttachment?: string;
  audioAttachment?: boolean;
  recommendations?: string[];
  timestamp: string;
}

export const AIBuddyPage: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<PersonalizedVehicleProfile>(POPULAR_PROFILES[0]);
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>('en');
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<boolean>(false);
  const [audioRecordingSeconds, setAudioRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Namaste! I am AI Bike Buddy, your 24/7 dedicated two-wheeler master mechanic and ownership advisor. I specialize exclusively in motorcycles, scooters, and electric two-wheelers.

Currently tailored to your vehicle: **${selectedProfile.brand} ${selectedProfile.model} (${selectedProfile.year})**.

Ask me about unusual engine clicking sounds, sudden mileage drops, CVT judder, spongy brakes, EV battery charging, or scheduled maintenance checklists!`,
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Audio recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setAudioRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleSend = async (textInput?: string) => {
    const q = textInput || input;
    if (!q.trim() && !attachedImage && !attachedAudio) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q || (attachedImage ? 'Please inspect this photo of my bike component.' : 'Please listen to this engine audio recording.'),
      imageAttachment: attachedImage || undefined,
      audioAttachment: attachedAudio,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const hadImage = Boolean(attachedImage);
    const hadAudio = attachedAudio;
    setAttachedImage(null);
    setAttachedAudio(false);
    setIsTyping(true);

    try {
      // Build conversation history payload from prior messages
      const historyPayload = messages.slice(-8).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      // 1. Send to AI Buddy Service (Gemini API with Strict Boundaries + Grounded Marketplace Retrieval)
      const res = await sendAIBuddyMessage({
        message: q || (hadImage ? 'Photo component inspection' : 'Engine audio sound check'),
        history: historyPayload,
        language,
        vehicle_context: selectedProfile
      });

      // 2. Also run complementary local diagnostic checks if it's a mechanical query
      const diagnosis = diagnoseTwoWheelerQuery(
        q || (hadImage ? 'Inspect bike component image' : 'Unusual engine sound recording'),
        selectedProfile,
        hadImage,
        hadAudio
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.response || res.text || `Here is my assessment for your ${selectedProfile.brand} ${selectedProfile.model}:`,
        diagnosis: res.is_refusal ? undefined : diagnosis,
        recommendations: res.matched_listings?.map((l: any) => l.title) || diagnosis.recommendedListings,
        timestamp: res.timestamp || 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Spoken narration
      if ('speechSynthesis' in window && language !== 'pa' && !res.is_refusal) {
        const briefUtterance = new SpeechSynthesisUtterance(diagnosis.title || 'Technical assessment generated');
        briefUtterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(briefUtterance);
      }
    } catch (err: any) {
      console.warn('AI Buddy send error:', err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ **Connection Notice**: ${err?.message || 'Could not reach GEAR UP AI Buddy. Please verify that the backend server is running.'}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSpeechRecording = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your question freely.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
    recognition.continuous = false;

    if (!isListening) {
      setIsListening(true);
      setAttachedAudio(true);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] flex flex-col">
      {/* Top Header & Vehicle Profile Switcher */}
      <div className="border-b border-[#1A332B] bg-white px-4 sm:px-6 py-3.5 sticky top-20 z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#35483C]/30 text-white flex items-center justify-center border border-[#35483C]/50 shadow-sm flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-base text-white">AI Bike Buddy</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#E9E3D8] border border-[#E9E3D8] text-[10px] text-[#242622] font-bold uppercase tracking-wider">
                  Master Mechanic
                </span>
              </div>
              <p className="text-xs text-[#85857E]">24/7 Diagnostics, Audio Engine Sound Scanner & Servicing Guide</p>
            </div>
          </div>

          {/* Vehicle Profile Selector & Language Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-none border border-[#E9E3D8] text-xs">
              <span className="text-[#85857E] text-[11px]">Active Profile:</span>
              <select
                value={selectedProfile.model}
                onChange={(e) => {
                  const p = POPULAR_PROFILES.find((prof) => prof.model === e.target.value);
                  if (p) setSelectedProfile(p);
                }}
                className="bg-transparent font-bold text-[#35483C] focus:outline-none cursor-pointer"
              >
                {POPULAR_PROFILES.map((p) => (
                  <option key={p.model} value={p.model} className="bg-white text-white">
                    {p.brand} {p.model} ({p.year})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center rounded-none bg-white p-1 border border-[#E9E3D8] text-[11px] font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-lg ${language === 'en' ? 'bg-[#35483C] text-white' : 'text-[#85857E]'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-lg ${language === 'hi' ? 'bg-[#35483C] text-white' : 'text-[#85857E]'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('pa')}
                className={`px-2 py-0.5 rounded-lg ${language === 'pa' ? 'bg-[#35483C] text-white' : 'text-[#85857E]'}`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>

            {/* Clear / New Chat Button */}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'ai',
                    text: `Namaste! I am GEAR UP AI Buddy, your intelligent advisor for India's used two-wheeler marketplace. Ask me about used bike/scooter buying, condition checks, price negotiation, RC & insurance verification, or maintenance!`,
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 border border-forest-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Clear & Start New Conversation"
            >
              <Trash2 className="w-3.5 h-3.5 text-forest-400" />
              <span>New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Conversation */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 overflow-y-auto space-y-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
              <span>{m.sender === 'user' ? 'You' : 'AI Bike Buddy (Mechanic)'}</span>
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>

            {/* Attached User Photo Preview */}
            {m.imageAttachment && (
              <div className="mb-2 max-w-xs rounded-none overflow-hidden border border-[#E9E3D8] bg-black">
                <img src={m.imageAttachment} alt="User Upload" className="w-full h-40 object-cover" />
                <div className="p-2 bg-[#0C1713] text-[10px] text-[#242622] font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Attached Component Photo
                </div>
              </div>
            )}

            {/* Attached Audio Badge */}
            {m.audioAttachment && (
              <div className="mb-2 p-2.5 rounded-none bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Engine Sound Acoustic Recording Uploaded</span>
              </div>
            )}

            {/* Text Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-none border border-[#E9E3D8] text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#35483C] text-white rounded-br-none shadow-md'
                  : 'bg-white border border-[#E9E3D8] text-[#242622] rounded-bl-none shadow-elevated'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Structured Diagnostic Card */}
              {m.diagnosis && (
                <div className="mt-4 p-4 rounded-none bg-[#091411] border border-[#E9E3D8] space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E9E3D8]">
                    <span className="font-heading font-extrabold text-sm text-[#35483C]">
                      {m.diagnosis.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white text-[#242622] border border-[#E9E3D8]">
                      {m.diagnosis.category}
                    </span>
                  </div>

                  {/* Critical Safety Alert */}
                  {m.diagnosis.isSafetyCritical && m.diagnosis.safetyWarning && (
                    <div className="p-3 rounded-none bg-red-950/80 border border-red-700/80 text-red-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[11px] text-red-300">Safety Critical Notice</p>
                        <p className="text-[11px] text-red-200 mt-0.5">{m.diagnosis.safetyWarning}</p>
                      </div>
                    </div>
                  )}

                  {/* Possible Causes */}
                  <div>
                    <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#242622]" />
                      Possible Root Causes:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-[#85857E] text-[11px]">
                      {m.diagnosis.possibleCauses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Safe DIY Checks */}
                  <div>
                    <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#242622]" />
                      Safe Checks to Perform Yourself:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-[#85857E] text-[11px]">
                      {m.diagnosis.diyChecks.map((check, i) => (
                        <li key={i}>{check}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Professional Recommendation */}
                  <div className="p-2.5 rounded-none bg-white border border-[#E9E3D8] text-[11px] text-[#85857E]">
                    <strong className="text-white">When to visit a mechanic: </strong>
                    {m.diagnosis.professionalAction}
                  </div>
                </div>
              )}
            </div>

            {/* Marketplace Recommendations inside Chat */}
            {m.recommendations && m.recommendations.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {m.recommendations.map((id) => {
                  const item = SEED_LISTINGS.find((b) => b.id === id);
                  if (!item) return null;
                  return (
                    <Link
                      key={item.id}
                      to={`/bike/${item.id}`}
                      className="p-3 rounded-none bg-[#12221D] hover:bg-[#E9E3D8]/60 border border-[#E9E3D8] transition-all flex items-center gap-3 group"
                    >
                      <img src={item.primaryImage} alt={item.title} className="w-14 h-14 rounded-none object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-white group-hover:text-[#35483C] truncate">{item.title}</p>
                        <p className="font-heading font-extrabold text-sm text-[#242622] mt-0.5">{formatINR(item.price)}</p>
                        <p className="text-[10px] text-[#85857E] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#242622]" />
                          {item.area}, {item.city}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#85857E] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-none bg-white border border-[#E9E3D8] text-xs text-[#85857E] w-44">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>Analyzing diagnostics...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters */}
      <div className="px-4 sm:px-6 py-2 bg-[#0C1613] border-t border-[#162922]">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold whitespace-nowrap">Try asking:</span>
          <button
            onClick={() => handleSend('My bike makes a clicking sound when pressing the starter button')}
            className="px-3 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white whitespace-nowrap"
          >
            Starter clicking sound
          </button>
          <button
            onClick={() => handleSend('My scooter vibrates violently between 15-20 km/h on pickup')}
            className="px-3 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white whitespace-nowrap"
          >
            CVT pickup vibration
          </button>
          <button
            onClick={() => handleSend('My front brake lever feels very spongy and soft')}
            className="px-3 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white whitespace-nowrap"
          >
            Spongy brake lever
          </button>
          <button
            onClick={() => handleSend('Mileage suddenly dropped from 48 kmpl to 32 kmpl')}
            className="px-3 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white whitespace-nowrap"
          >
            Sudden mileage drop
          </button>
          <button
            onClick={() => handleSend('How to optimize Ather EV battery range in Indian summers?')}
            className="px-3 py-1 rounded-full bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white whitespace-nowrap"
          >
            EV battery tips
          </button>
        </div>
      </div>

      {/* Image / Audio Attachment Staging Area */}
      {(attachedImage || isListening) && (
        <div className="px-4 sm:px-6 py-2 bg-white border-t border-[#E9E3D8]">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            {attachedImage && (
              <div className="relative w-14 h-14 rounded-none overflow-hidden border border-[#35483C]">
                <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-0 right-0 p-0.5 bg-black/80 text-white rounded-bl"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {isListening && (
              <div className="flex items-center gap-2 text-xs text-red-400 animate-pulse font-bold">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span>Recording engine acoustic sound... ({audioRecordingSeconds}s)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Control Bar */}
      <div className="border-t border-[#1A332B] bg-white px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {/* Hidden Image File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Photo Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-none bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white transition-colors"
            title="Attach photo of tyres, leak, warning lights"
          >
            <Camera className="w-5 h-5 text-[#242622]" />
          </button>

          {/* Microphone Audio Button */}
          <button
            onClick={toggleSpeechRecording}
            className={`p-3 rounded-none border transition-colors ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-white text-[#85857E] border-[#E9E3D8] hover:text-white'
            }`}
            title="Record engine sound or speak question"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#242622]" />}
          </button>

          {/* Main Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
            disabled={isTyping}
            placeholder={`Ask about buying, selling, prices, RC/insurance, or diagnostics...`}
            className="flex-1 bg-white border border-[#E9E3D8] rounded-none px-4 py-3 text-sm text-[#242622] focus:outline-none focus:border-[#35483C] disabled:opacity-50"
          />

          <button
            onClick={() => handleSend()}
            disabled={isTyping || (!input.trim() && !attachedImage && !attachedAudio)}
            className="px-6 py-3 rounded-none bg-[#35483C] hover:bg-[#242622] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-elevated"
          >
            <span>{isTyping ? 'Thinking...' : 'Ask'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
