
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems = [
    { id: AppView.CHAT, icon: 'fa-message', label: 'Chat' },
    { id: AppView.IMAGE, icon: 'fa-wand-magic-sparkles', label: 'Create' },
    { id: AppView.VOICE, icon: 'fa-microphone', label: 'Voice' },
  ];

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <nav className="w-20 md:w-64 glass-effect border-r border-slate-800 flex flex-col items-center py-8 z-20">
        <div className="mb-12 flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-bolt text-white text-xl"></i>
          </div>
          <h1 className="hidden md:block text-xl font-bold gradient-text">Gemini Hub</h1>
        </div>

        <div className="flex-1 flex flex-col gap-4 w-full px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                currentView === item.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl w-6 text-center`}></i>
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto px-4 w-full">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hidden md:block">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Powered by</p>
            <div className="flex items-center gap-2">
              <img src="https://picsum.photos/id/1/24/24" className="w-6 h-6 rounded-full opacity-50 grayscale" alt="Google" />
              <span className="text-sm text-slate-400">Gemini 3 Pro</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-[#0b1120]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
