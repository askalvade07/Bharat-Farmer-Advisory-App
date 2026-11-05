import React from 'react';
import { Mic, Sun, Wifi, WifiOff, User, Sparkles } from 'lucide-react';
import { Language, Season } from '../types';

interface HeaderProps {
  activeTab: 'disease' | 'yield' | 'irrigation' | 'validation';
  setActiveTab: (tab: 'disease' | 'yield' | 'irrigation' | 'validation') => void;
  language: Language;
  season: Season;
  sunlightMode: boolean;
  onToggleSunlightMode: () => void;
  isOnline: boolean;
  onToggleOnlineStatus: () => void;
  onOpenVoiceModal: () => void;
  onOpenProfileDrawer: () => void;
  farmerName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  season,
  sunlightMode,
  onToggleSunlightMode,
  isOnline,
  onToggleOnlineStatus,
  onOpenVoiceModal,
  onOpenProfileDrawer,
  farmerName,
}) => {
  const getNavLabel = (tab: 'disease' | 'yield' | 'irrigation' | 'validation') => {
    switch (tab) {
      case 'disease':
        return language === 'hi' || language === 'malvi'
          ? 'फसल डॉक्टर'
          : language === 'mr'
          ? 'पीक डॉक्टर'
          : 'Crop Doctor';
      case 'yield':
        return language === 'hi' || language === 'malvi'
          ? 'पैदावार अनुमान'
          : language === 'mr'
          ? 'उत्पादन अंदाज'
          : 'Yield Forecast';
      case 'irrigation':
        return language === 'hi' || language === 'malvi'
          ? 'सिंचाई व बिजली'
          : language === 'mr'
          ? 'पाणी व वीज'
          : 'Irrigation & Power';
      case 'validation':
        return language === 'hi' || language === 'malvi'
          ? 'फील्ड शोध'
          : language === 'mr'
          ? 'फील्ड डेटा'
          : 'Field Research';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text element Brand Wordmark (Strict Top Bar Contract) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('disease')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00652c] text-white flex items-center justify-center font-extrabold text-xl shadow-sm group-hover:bg-[#15803d] transition-colors">
              क
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#00652c] whitespace-nowrap block leading-none">
                KisanSeva
              </span>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap block mt-0.5">
                किसान सेवा · Sub-2Ha Smallholders
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 Clean single-line navigation links (Strict Top Bar Contract) */}
        <nav className="hidden lg:flex items-center gap-1 md:gap-2">
          {(['disease', 'yield', 'irrigation', 'validation'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#dcfce7] text-[#00652c] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {getNavLabel(tab)}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Voice Advisory Trigger) + Field Resilience Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Offline / Online Field Toggle */}
          <button
            onClick={onToggleOnlineStatus}
            title={isOnline ? 'Online (4G Field Network)' : 'Offline (Field Cache Active)'}
            className={`min-h-[44px] px-2.5 sm:px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">4G सक्रिय</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="whitespace-nowrap font-bold">ऑफलाइन कैश</span>
              </>
            )}
          </button>

          {/* Sunlight Glare Mode Toggle */}
          <button
            onClick={onToggleSunlightMode}
            title="तेज धूप मोड / High-Contrast Sunlight Mode"
            aria-label="Toggle Sunlight Glare Mode"
            className={`min-h-[44px] min-w-[44px] px-2 sm:px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
              sunlightMode
                ? 'bg-black text-yellow-300 border-black shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sun className={`w-4 h-4 ${sunlightMode ? 'text-yellow-400 fill-yellow-400' : 'text-amber-600'}`} />
            <span className="hidden md:inline whitespace-nowrap">
              {sunlightMode ? 'धूप मोड ON' : 'धूप मोड'}
            </span>
          </button>

          {/* Farmer Profile Avatar Button */}
          <button
            onClick={onOpenProfileDrawer}
            title="किसान प्रोफाइल व खेत विवरण"
            aria-label="Farmer Profile"
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer border border-slate-200"
          >
            <User className="w-4 h-4 text-[#00652c]" />
          </button>

          {/* PRIMARY CTA: Voice Advisor Trigger */}
          <button
            onClick={onOpenVoiceModal}
            className="min-h-[44px] px-3.5 sm:px-4 py-2 bg-[#00652c] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Mic className="w-4 h-4 text-[#d3ffd5] animate-pulse" />
            <span className="hidden sm:inline">बोलकर पूछें</span>
            <span className="sm:hidden">माइक</span>
          </button>
        </div>
      </div>
    </header>
  );
};
