import React from 'react';
import { Languages, Calendar, ShieldCheck, Sprout } from 'lucide-react';
import { CropInfo, Language, Season } from '../types';

interface SeasonLanguageBarProps {
  season: Season;
  onSelectSeason: (season: Season) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  availableCrops: CropInfo[];
  selectedCropId: string;
  onSelectCropId: (cropId: string) => void;
  plotSizeAcres: number;
}

export const SeasonLanguageBar: React.FC<SeasonLanguageBarProps> = ({
  season,
  onSelectSeason,
  language,
  onSelectLanguage,
  availableCrops,
  selectedCropId,
  onSelectCropId,
  plotSizeAcres,
}) => {
  const languageOptions: { id: Language; label: string; script: string }[] = [
    { id: 'hi', label: 'हिन्दी', script: 'Hindi' },
    { id: 'malvi', label: 'मालवी', script: 'Malvi' },
    { id: 'mr', label: 'मराठी', script: 'Marathi' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ', script: 'Punjabi' },
    { id: 'en', label: 'English', script: 'English' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Kharif / Rabi Seasonal Sprint Navigation */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectSeason('kharif')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                season === 'kharif'
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>खरीफ (Kharif 2026)</span>
            </button>
            <button
              onClick={() => onSelectSeason('rabi')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                season === 'rabi'
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>रबी (Rabi 2026-27)</span>
            </button>
          </div>

          {/* Crop Selector Segment */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {availableCrops.map((crop) => {
              const isSelected = crop.id === selectedCropId;
              const localName = crop.localName[language] || crop.localName.hi || crop.name;
              return (
                <button
                  key={crop.id}
                  onClick={() => onSelectCropId(crop.id)}
                  className={`min-h-[38px] px-3 py-1 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-100 text-[#00652c] border-[#00652c]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Sprout className="w-3 h-3 text-[#15803d]" />
                    {localName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Direct On-Screen Language Switcher (Mandatory PRD Area 4) & Plot Context */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
          {/* Sub-2ha Plot Context */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#15803d]" />
            <span>रकबा: {plotSizeAcres} एकड़ (Sub-2Ha)</span>
            <span aria-hidden="true">·</span>
            <span>निःशुल्क कृषक सलाह</span>
          </div>

          {/* Visual Language Switcher directly on screen */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Languages className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5 hidden sm:inline" />
            {languageOptions.map((opt) => {
              const isCurrent = language === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectLanguage(opt.id)}
                  className={`min-h-[36px] px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={opt.script}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
