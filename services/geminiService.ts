import { GoogleGenAI, Type, GenerateContentResponse, Modality, LiveServerMessage } from "@google/genai";

export class GeminiService {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance
  private static ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  static async generateChatResponse(prompt: string, history: { role: string, parts: string[] }[]) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts[0] }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are a highly capable AI assistant named Gemini Hub. You provide clear, helpful, and concise responses. Respond in the same language the user uses.",
        temperature: 0.7,
      },
    });
    // response.text is a property, not a method
    return response.text;
  }

  static async generateImage(prompt: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      // Iterate through parts to find image data as per nano banana series models
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  }

  static connectLive(callbacks: {
    onopen: () => void;
    onmessage: (msg: LiveServerMessage) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
        },
        systemInstruction: 'You are a helpful and friendly real-time voice assistant. Keep your responses natural and conversational.'
      }
    });
  }
}

// Utility functions for Audio processing
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
