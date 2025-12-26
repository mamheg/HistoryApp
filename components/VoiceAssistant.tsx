
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GeminiService, decodeBase64, encodeBase64, decodeAudioData } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const cleanup = useCallback(() => {
    setIsActive(false);
    setStatus('idle');
    
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const handleToggle = async () => {
    if (isActive) {
      cleanup();
      return;
    }

    setStatus('connecting');
    setIsActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = GeminiService.connectLive({
        onopen: () => {
          setStatus('listening');
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessorRef.current.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            
            const pcmBlob = {
              data: encodeBase64(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };

            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessorRef.current);
          scriptProcessorRef.current.connect(audioContextRef.current!.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData) {
            setStatus('speaking');
            const ctx = outputAudioContextRef.current!;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            
            const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            
            source.addEventListener('ended', () => {
              sourcesRef.current.delete(source);
              if (sourcesRef.current.size === 0) setStatus('listening');
            });
            
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }

          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setStatus('listening');
          }
        },
        onerror: (e) => {
          console.error('Live Error:', e);
          setStatus('error');
        },
        onclose: () => cleanup()
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('error');
      setIsActive(false);
    }
  };

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Live Conversation</h2>
          <p className="text-slate-400 text-lg">Speak naturally with Gemini 2.5 Flash Native Audio.</p>
        </div>

        <div className="relative flex items-center justify-center py-20">
          {/* Visualizer rings */}
          <div className={`absolute w-40 h-40 rounded-full border-2 border-blue-500/20 ${isActive ? 'animate-[ping_3s_infinite]' : ''}`}></div>
          <div className={`absolute w-60 h-60 rounded-full border-2 border-purple-500/10 ${isActive ? 'animate-[ping_4s_infinite]' : ''}`}></div>
          
          <button
            onClick={handleToggle}
            className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isActive 
                ? 'bg-red-500 shadow-red-500/40 hover:scale-110' 
                : 'bg-blue-600 shadow-blue-600/40 hover:scale-110'
            }`}
          >
            <i className={`fa-solid ${isActive ? 'fa-square' : 'fa-microphone'} text-4xl text-white`}></i>
          </button>

          {/* Status badge */}
          <div className="absolute -bottom-10 flex flex-col items-center">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
              status === 'idle' ? 'bg-slate-800 text-slate-500 border-slate-700' :
              status === 'connecting' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 animate-pulse' :
              status === 'listening' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
              status === 'speaking' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
              'bg-red-500/20 text-red-500 border-red-500/30'
            }`}>
              {status}
            </div>
            {isActive && status === 'listening' && (
              <p className="text-sm text-slate-500 mt-4 italic">Listening to your voice...</p>
            )}
            {isActive && status === 'speaking' && (
              <p className="text-sm text-blue-400 mt-4 italic font-medium">Gemini is responding</p>
            )}
          </div>
        </div>

        <div className="glass-effect p-6 rounded-2xl text-left border border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tips for Live Mode</h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-0.5"></i> Speak clearly and keep background noise low.</li>
            <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-0.5"></i> You can interrupt the AI at any time.</li>
            <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-0.5"></i> Use for real-time practice, roleplay, or brainstorming.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
