import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Wrench, 
  AlertTriangle,
  FileText,
  Volume2,
  Trash2,
  X,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { 
  diagnoseTwoWheelerQuery, 
  POPULAR_PROFILES, 
  PersonalizedVehicleProfile, 
  MechanicDiagnosis 
} from '../utils/mechanicAI';
import { sendAIBuddyMessage, transcribeAudio } from '../services/aiApi';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  diagnosis?: MechanicDiagnosis;
  imageAttachment?: string;
  audioAttachment?: boolean;
  responseType?: string;
  recommendations?: string[];
  timestamp: string;
}

export const AIBuddyPage: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<PersonalizedVehicleProfile>(POPULAR_PROFILES[0]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<boolean>(false);
  const [audioRecordingSeconds, setAudioRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am GEAR UP AI Buddy, your advisor for India's used two-wheeler marketplace. Ask me about used bike/scooter buying, condition checks, price negotiation, RC & insurance verification, or maintenance. You can also upload photos of documents, notes, or two-wheelers for instant analysis.`,
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

    const currentAttachedImage = attachedImage;
    const currentAttachedAudio = attachedAudio;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q || (currentAttachedImage ? 'What is shown or written in this image?' : 'Please analyze this engine audio recording.'),
      imageAttachment: currentAttachedImage || undefined,
      audioAttachment: currentAttachedAudio,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAttachedImage(null);
    setAttachedAudio(false);
    setIsTyping(true);

    try {
      // Build conversation history payload from prior messages
      const historyPayload = messages.slice(-8).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      // Extract image MIME type if present
      let imageMime = 'image/jpeg';
      if (currentAttachedImage && currentAttachedImage.startsWith('data:image/')) {
        const match = currentAttachedImage.match(/^data:(image\/[a-zA-Z0-9.+_-]+);base64,/);
        if (match) imageMime = match[1];
      }

      // Send to genuine Gemini AI Buddy Service with image and audio support
      const res = await sendAIBuddyMessage({
        message: q || (currentAttachedImage ? 'What is shown or written into this image?' : 'Please analyze this audio recording.'),
        history: historyPayload,
        vehicle_context: selectedProfile,
        image_data: currentAttachedImage || null,
        mime_type: currentAttachedImage ? imageMime : null,
      });

      // ONLY attach diagnostic card if the response is explicitly categorized as VEHICLE_DIAGNOSTIC
      // Never attach diagnostic cards for image transcriptions, math, or general text!
      const isVehicleDiagnostic = res.response_type === 'VEHICLE_DIAGNOSTIC';
      const diagnosis = isVehicleDiagnostic
        ? diagnoseTwoWheelerQuery(
            q || (currentAttachedImage ? 'Inspect bike component image' : 'Unusual engine sound recording'),
            selectedProfile,
            Boolean(currentAttachedImage),
            currentAttachedAudio
          )
        : undefined;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.response || res.text || `Here is my assessment for your ${selectedProfile.brand} ${selectedProfile.model}:`,
        diagnosis,
        responseType: res.response_type,
        recommendations: res.matched_listings?.map((l: any) => l.title),
        timestamp: res.timestamp || 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Spoken narration
      if ('speechSynthesis' in window && !res.is_refusal) {
        const briefUtterance = new SpeechSynthesisUtterance(res.response || 'Response generated');
        briefUtterance.lang = 'en-IN';
        window.speechSynthesis.speak(briefUtterance);
      }
    } catch (err: any) {
      console.warn('AI Buddy send error:', err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ **Notice**: ${err?.message || 'Could not reach GEAR UP AI Buddy. Please verify connection.'}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

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
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
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
          setIsTranscribingAudio(true);
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
                setIsTranscribingAudio(false);
              }
            };
            reader.readAsDataURL(audioBlob);
          } catch (e) {
            setIsTranscribingAudio(false);
          }
        } else {
          setIsTranscribingAudio(false);
        }
      };

      recorder.start(250);
      setIsListening(true);
      setAttachedAudio(true);
    } catch (err: any) {
      console.warn('Microphone access denied or error:', err);
      fallbackSpeechRecognition();
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleSpeechRecording = () => {
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
      alert('Speech recognition / microphone is not supported in this browser. You can type freely.');
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
      {/* Top Header & Vehicle Profile Switcher (Apple Liquid Glass Header) */}
      <div className="border-b border-[#242622]/[0.08] bg-white/85 backdrop-blur-[24px] saturate-[180%] px-4 sm:px-6 py-3.5 sticky top-16 sm:top-20 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#35483C] text-white flex items-center justify-center border border-[#35483C]/50 shadow-sm shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-base text-[#242622]">AI Bike Buddy</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#242622]/10 text-[10px] text-[#35483C] font-mono font-bold uppercase tracking-wider">
                  Multimodal Telemetry
                </span>
              </div>
              <p className="text-xs text-[#85857E]">Vision OCR, Voice Transcription, Document Analysis & Servicing Guide</p>
            </div>
          </div>

          {/* Vehicle Profile Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#242622]/10 text-xs shadow-sm">
              <span className="text-[#85857E] text-[11px] font-mono">Profile:</span>
              <select
                value={selectedProfile.model}
                onChange={(e) => {
                  const p = POPULAR_PROFILES.find((prof) => prof.model === e.target.value);
                  if (p) setSelectedProfile(p);
                }}
                className="bg-transparent font-bold text-[#35483C] focus:outline-none cursor-pointer text-xs"
              >
                {POPULAR_PROFILES.map((p) => (
                  <option key={p.model} value={p.model} className="bg-white text-[#242622]">
                    {p.brand} {p.model} ({p.year})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'ai',
                    text: `Chat reset. How can I assist you with two-wheelers, vehicle documents, or image analysis today?`,
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="w-9 h-9 flex items-center justify-center text-[#85857E] hover:text-[#242622] hover:bg-white rounded-full border border-transparent hover:border-[#242622]/10 transition-all tactile-btn"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-4 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <div className="flex items-center gap-2 text-[11px] text-[#85857E] px-1 font-mono">
              <span>{m.sender === 'user' ? 'You' : 'GEAR UP AI'}</span>
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>

            <div
              className={`max-w-2xl p-4 sm:p-5 ${
                m.sender === 'user'
                  ? 'bg-[#35483C] text-white rounded-2xl rounded-tr-xs shadow-sm'
                  : 'bg-white border border-[#242622]/[0.08] text-[#242622] rounded-2xl rounded-tl-xs shadow-sm'
              }`}
            >
              {/* Image Preview if user uploaded */}
              {m.imageAttachment && (
                <div className="mb-3 rounded-2xl overflow-hidden border border-black/10 max-w-xs shadow-sm">
                  <img src={m.imageAttachment} alt="Uploaded attachment" className="w-full h-auto object-cover max-h-60" />
                </div>
              )}

              {/* Message text with whitespace formatting */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>

              {/* Structured Diagnostic Card */}
              {m.diagnosis && (
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#242622]/10">
                    <span className="font-heading font-extrabold text-sm text-[#35483C]">
                      {m.diagnosis.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white text-[#242622] border border-[#242622]/10">
                      {m.diagnosis.category}
                    </span>
                  </div>

                  {/* Critical Safety Alert */}
                  {m.diagnosis.isSafetyCritical && m.diagnosis.safetyWarning && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[11px] text-red-800">Safety Critical Notice</p>
                        <p className="text-[11px] text-red-700 mt-0.5">{m.diagnosis.safetyWarning}</p>
                      </div>
                    </div>
                  )}

                  {/* Possible Causes */}
                  <div>
                    <h5 className="font-bold text-[#242622] mb-1.5 flex items-center gap-1.5 font-mono">
                      <Wrench className="w-3.5 h-3.5 text-[#35483C]" />
                      Possible Root Causes:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-[#4A4D46] text-[11px]">
                      {m.diagnosis.possibleCauses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Safe DIY Checks */}
                  <div>
                    <h5 className="font-bold text-[#242622] mb-1.5 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#35483C]" />
                      Safe Checks to Perform Yourself:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-[#4A4D46] text-[11px]">
                      {m.diagnosis.diyChecks.map((check, i) => (
                        <li key={i}>{check}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Professional Recommendation */}
                  <div className="p-3 rounded-xl bg-white border border-[#242622]/[0.08] text-[11px] text-[#4A4D46]">
                    <strong className="text-[#242622]">When to visit a mechanic: </strong>
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
                      className="p-3 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-[#242622]/[0.08] transition-all flex items-center gap-3 group shadow-sm hover:shadow-md tactile-btn"
                    >
                      <img src={item.primaryImage} alt={item.title} className="w-14 h-14 rounded-xl object-cover border border-[#242622]/10" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#242622] group-hover:text-[#35483C] truncate">{item.title}</p>
                        <p className="font-heading font-extrabold text-sm text-[#35483C] mt-0.5">{formatINR(item.price)}</p>
                        <p className="text-[10px] text-[#85857E] flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-[#35483C]" />
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
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#242622]/[0.08] text-xs text-[#85857E] w-48 shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#35483C] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#35483C] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#35483C] animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="font-mono text-[11px]">Analyzing response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters */}
      <div className="px-4 sm:px-6 py-2.5 bg-white/70 border-t border-[#242622]/[0.06]">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-[#85857E] font-mono text-[10px] uppercase tracking-wider whitespace-nowrap">Suggested:</span>
          <button
            onClick={() => handleSend('What documents should I verify when buying a used bike in Punjab?')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 text-[#242622] hover:bg-[#35483C] hover:text-white whitespace-nowrap transition-all duration-200 tactile-btn shadow-sm"
          >
            RC & transfer documents
          </button>
          <button
            onClick={() => handleSend('My bike makes a clicking sound when pressing the starter button')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 text-[#242622] hover:bg-[#35483C] hover:text-white whitespace-nowrap transition-all duration-200 tactile-btn shadow-sm"
          >
            Starter clicking sound
          </button>
          <button
            onClick={() => handleSend('How to optimize electric scooter battery range in Indian summers?')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 text-[#242622] hover:bg-[#35483C] hover:text-white whitespace-nowrap transition-all duration-200 tactile-btn shadow-sm"
          >
            EV battery tips
          </button>
          <button
            onClick={() => handleSend('Mileage suddenly dropped from 50 kmpl to 32 kmpl')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 text-[#242622] hover:bg-[#35483C] hover:text-white whitespace-nowrap transition-all duration-200 tactile-btn shadow-sm"
          >
            Sudden mileage drop
          </button>
        </div>
      </div>

      {/* Image / Audio Attachment Staging Area */}
      {(attachedImage || isListening || isTranscribingAudio) && (
        <div className="px-4 sm:px-6 py-2.5 bg-[#FAF9F5] border-t border-[#242622]/[0.08]">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            {attachedImage && (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#35483C] shadow-sm">
                <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {isListening && (
              <div className="flex items-center gap-2 text-xs text-red-600 animate-pulse font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>Recording audio... ({audioRecordingSeconds}s) - Tap mic to finish</span>
              </div>
            )}
            {isTranscribingAudio && (
              <div className="flex items-center gap-2 text-xs text-[#35483C] font-mono font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-[#35483C]" />
                <span>Transcribing audio with Gemini AI...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Control Bar (Apple Liquid Glass Sticky Footer) */}
      <div className="sticky bottom-0 border-t border-[#242622]/[0.08] bg-white/90 backdrop-blur-[24px] saturate-[180%] px-3 sm:px-6 py-3 sm:py-4 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {/* Hidden Image File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Photo Upload Button (44x44px min touch target) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-[#242622]/10 text-[#85857E] hover:text-[#242622] hover:bg-[#FAF9F5] transition-all shrink-0 tactile-btn shadow-sm"
            title="Attach photo, handwritten notes, RC document, or component"
            aria-label="Attach photo or document"
          >
            <Camera className="w-5 h-5 text-[#242622]" />
          </button>

          {/* Microphone Audio Button (44x44px min touch target) */}
          <button
            onClick={toggleSpeechRecording}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all shrink-0 tactile-btn shadow-sm ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-white text-[#85857E] border-[#242622]/10 hover:text-[#242622] hover:bg-[#FAF9F5]'
            }`}
            title={isListening ? 'Stop recording and transcribe' : 'Record voice or audio'}
            aria-label="Voice input recording"
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#242622]" />}
          </button>

          {/* Main Text Input inside Rounded Pill */}
          <div className="flex-1 flex items-center bg-[#FAF9F5] rounded-full border border-[#242622]/10 px-4 py-1.5 focus-within:border-[#35483C] focus-within:ring-2 focus-within:ring-[#35483C]/10 transition-all min-h-[44px]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              disabled={isTyping}
              placeholder={attachedImage ? 'Ask about image...' : 'Ask about 2-wheelers, prices, RC...'}
              className="w-full bg-transparent text-xs sm:text-sm text-[#242622] placeholder:text-[#85857E] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Submit Action Button */}
          <button
            onClick={() => handleSend()}
            disabled={isTyping || (!input.trim() && !attachedImage && !attachedAudio)}
            className="px-5 sm:px-6 min-h-[44px] rounded-full bg-[#35483C] hover:bg-[#242622] disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 tactile-btn border border-[#35483C]"
            aria-label="Send message"
          >
            <span className="hidden xs:inline">{isTyping ? 'Thinking...' : 'Ask'}</span>
            <Send className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
