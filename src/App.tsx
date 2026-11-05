import React, { useState, useEffect } from 'react';
import {
  Camera,
  TrendingUp,
  Droplets,
  FlaskConical,
  Mic,
  Sun,
  ShieldCheck,
  AlertTriangle,
  Wifi,
  WifiOff,
  User,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { SeasonLanguageBar } from './components/SeasonLanguageBar';
import { CameraDiseaseScanner } from './components/CameraDiseaseScanner';
import { ExplainableYieldForecast } from './components/ExplainableYieldForecast';
import { RealityIrrigationAdvice } from './components/RealityIrrigationAdvice';
import { FieldValidationConsole } from './components/FieldValidationConsole';
import { VoiceAdvisoryModal } from './components/VoiceAdvisoryModal';
import { FarmerProfileDrawer } from './components/FarmerProfileDrawer';
import { CROPS_DATA } from './data/mockData';
import { CropInfo, DiseaseDiagnosis, FarmerProfile, Language, Season, ValidationMetrics } from './types';
import { storageService } from './services/storageService';

export default function App() {
  // Navigation & Seasonal State
  const [activeTab, setActiveTab] = useState<'disease' | 'yield' | 'irrigation' | 'validation'>('disease');
  const [season, setSeason] = useState<Season>(storageService.getSeason());
  const [language, setLanguage] = useState<Language>(storageService.getLanguage());

  // Available crops based on season
  const availableCrops = CROPS_DATA.filter((c) => c.season === season);
  const [selectedCropId, setSelectedCropId] = useState<string>(
    availableCrops[0]?.id || (season === 'kharif' ? 'soybean' : 'wheat')
  );

  // Sync selected crop when season changes
  useEffect(() => {
    const crops = CROPS_DATA.filter((c) => c.season === season);
    if (!crops.some((c) => c.id === selectedCropId)) {
      setSelectedCropId(crops[0]?.id || 'soybean');
    }
  }, [season]);

  const selectedCrop = CROPS_DATA.find((c) => c.id === selectedCropId) || CROPS_DATA[0];

  // Farmer Profile & Environmental Settings
  const [profile, setProfile] = useState<FarmerProfile>(storageService.getFarmerProfile());
  const [sunlightMode, setSunlightMode] = useState<boolean>(storageService.getSunlightMode());
  const [isOnline, setIsOnline] = useState<boolean>(true); // Toggle 4G field edge vs offline cache
  const [crackedScreenFilter, setCrackedScreenFilter] = useState<boolean>(false); // PRD observational study tester

  // Data States
  const [diagnoses, setDiagnoses] = useState<DiseaseDiagnosis[]>(storageService.getDiagnoses());
  const [metrics, setMetrics] = useState<ValidationMetrics>(storageService.getValidationMetrics());

  // Modal / Drawer visibility
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);

  // Handle language switch
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    storageService.setLanguage(lang);
  };

  // Handle season switch
  const handleSelectSeason = (s: Season) => {
    setSeason(s);
    storageService.setSeason(s);
  };

  // Handle sunlight mode toggle
  const handleToggleSunlightMode = () => {
    const next = !sunlightMode;
    setSunlightMode(next);
    storageService.setSunlightMode(next);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-emerald-500/20 selection:text-emerald-900 relative ${
        sunlightMode ? 'sunlight-mode bg-white text-black' : 'bg-[#faf8ff] text-[#131b2e]'
      }`}
    >
      {/* Optional PRD Study Overlay: Simulated Cracked Screen lines */}
      {crackedScreenFilter && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-85">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="0%" x2="45%" y2="55%" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="45%" y1="55%" x2="90%" y2="85%" stroke="#ffffff" strokeWidth="2" />
            <line x1="45%" y1="55%" x2="15%" y2="95%" stroke="#000000" strokeWidth="1.5" strokeDasharray="4,2" />
            <line x1="70%" y1="10%" x2="45%" y2="55%" stroke="#000000" strokeWidth="1.8" />
            <circle cx="45%" cy="55%" r="18" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="45%" cy="55%" r="35" fill="none" stroke="#000000" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
          <div className="absolute top-18 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
            PRD टेस्ट: टूटी स्क्रीन सिम्युलेटर सक्रिय
          </div>
        </div>
      )}

      {/* Strict Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        season={season}
        sunlightMode={sunlightMode}
        onToggleSunlightMode={handleToggleSunlightMode}
        isOnline={isOnline}
        onToggleOnlineStatus={() => setIsOnline(!isOnline)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
        farmerName={profile.name}
      />

      {/* Seasonal & Direct On-Screen Language Switcher Bar */}
      <SeasonLanguageBar
        season={season}
        onSelectSeason={handleSelectSeason}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        availableCrops={availableCrops}
        selectedCropId={selectedCropId}
        onSelectCropId={setSelectedCropId}
        plotSizeAcres={profile.plotSizeAcres}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        {activeTab === 'disease' && (
          <CameraDiseaseScanner
            diagnoses={diagnoses}
            onDiagnosesUpdate={setDiagnoses}
            language={language}
            selectedCropId={selectedCropId}
            isOnline={isOnline}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'yield' && (
          <ExplainableYieldForecast
            season={season}
            language={language}
            selectedCrop={selectedCrop}
            plotSizeAcres={profile.plotSizeAcres}
          />
        )}

        {activeTab === 'irrigation' && (
          <RealityIrrigationAdvice
            language={language}
            plotSizeAcres={profile.plotSizeAcres}
            isOnline={isOnline}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'validation' && (
          <FieldValidationConsole
            metrics={metrics}
            onMetricsUpdate={setMetrics}
            crackedScreenFilter={crackedScreenFilter}
            onToggleCrackedScreen={() => setCrackedScreenFilter(!crackedScreenFilter)}
            sunlightMode={sunlightMode}
            onToggleSunlightMode={handleToggleSunlightMode}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 from Mobile Touch Guidelines) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1">
        <div className="grid grid-cols-5 items-center h-16">
          <button
            onClick={() => setActiveTab('disease')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
              activeTab === 'disease' ? 'text-[#00652c] font-black' : 'text-slate-500 font-medium'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">फसल डॉक्टर</span>
          </button>

          <button
            onClick={() => setActiveTab('yield')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
              activeTab === 'yield' ? 'text-[#00652c] font-black' : 'text-slate-500 font-medium'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">पैदावार</span>
          </button>

          {/* Central Thumb-Zone Floating Mic Button */}
          <div className="flex items-center justify-center -mt-5">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-14 h-14 rounded-full bg-[#00652c] text-white flex items-center justify-center shadow-lg border-3 border-white cursor-pointer active:scale-95 transition-transform"
              aria-label="बोलकर पूछें"
            >
              <Mic className="w-6 h-6 text-[#d3ffd5] animate-pulse" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('irrigation')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
              activeTab === 'irrigation' ? 'text-[#00652c] font-black' : 'text-slate-500 font-medium'
            }`}
          >
            <Droplets className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">सिंचाई</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
              activeTab === 'validation' ? 'text-[#00652c] font-black' : 'text-slate-500 font-medium'
            }`}
          >
            <FlaskConical className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">फील्ड शोध</span>
          </button>
        </div>
      </div>

      {/* Voice-First Advisory Modal */}
      <VoiceAdvisoryModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onNavigateToTab={setActiveTab}
      />

      {/* Shared-Device Farmer Profile Drawer */}
      <FarmerProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
      />
    </div>
  );
}
