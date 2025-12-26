
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setResultImage(null);
    try {
      const imageUrl = await GeminiService.generateImage(prompt);
      setResultImage(imageUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-8 py-10 overflow-y-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Image Studio</h2>
        <p className="text-slate-400">Transform your ideas into high-quality visual art with Gemini 2.5 Flash.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="glass-effect rounded-3xl p-6 h-fit border border-slate-800">
          <label className="block text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city with flying cars and neon lights, high resolution, cinematic lighting..."
            className="w-full h-40 bg-slate-900/50 rounded-2xl p-4 border border-slate-700 text-white outline-none focus:border-blue-500 transition-colors resize-none mb-6"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
              !prompt.trim() || isGenerating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] shadow-xl shadow-blue-600/20'
            }`}
          >
            {isGenerating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Generating Art...
              </>
            ) : (
              <>
                <i className="fa-solid fa-sparkles"></i>
                Generate Image
              </>
            )}
          </button>
        </div>

        {/* Display Area */}
        <div className="glass-effect rounded-3xl p-4 aspect-square flex items-center justify-center border border-slate-800 overflow-hidden relative group">
          {!resultImage && !isGenerating && (
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 mx-auto flex items-center justify-center mb-4">
                <i className="fa-solid fa-image text-3xl text-slate-600"></i>
              </div>
              <p className="text-slate-500">Your generated masterpiece will appear here</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-10 bg-slate-900/40 backdrop-blur-sm">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full animate-ping absolute"></div>
                <div className="w-24 h-24 border-4 border-blue-500 rounded-full animate-spin border-t-transparent relative"></div>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-medium animate-pulse">Consulting the muse...</p>
                <p className="text-xs text-slate-500 mt-1">This usually takes about 10-20 seconds</p>
              </div>
            </div>
          )}

          {resultImage && (
            <div className="w-full h-full animate-in fade-in zoom-in duration-700">
              <img 
                src={resultImage} 
                alt="Generated Art" 
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-6 left-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => window.open(resultImage, '_blank')}
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <i className="fa-solid fa-expand mr-2"></i> View Full
                </button>
                <a 
                  href={resultImage} 
                  download="generated-art.png"
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-colors text-center"
                >
                  <i className="fa-solid fa-download mr-2"></i> Save
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
