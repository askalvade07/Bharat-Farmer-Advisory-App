import React, { useState } from 'react';
import { X, User, MapPin, Layers, Droplets, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { FarmerProfile } from '../types';
import { storageService } from '../services/storageService';
import { audioSpeechService } from '../services/audioSpeechService';

interface FarmerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  onUpdateProfile: (profile: FarmerProfile) => void;
}

export const FarmerProfileDrawer: React.FC<FarmerProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<FarmerProfile>(profile);
  const [activeProfileTab, setActiveProfileTab] = useState<'p1' | 'p2'>('p1');

  if (!isOpen) return null;

  const handleSwitchSharedProfile = (profileId: 'p1' | 'p2') => {
    setActiveProfileTab(profileId);
    audioSpeechService.playFeedbackSound('confirm');
    if (profileId === 'p1') {
      const p1: FarmerProfile = {
        name: 'रामेश्वर पटेल (Rameshwar Patel)',
        village: 'सेमलिया (Semaliya)',
        district: 'उज्जैन (Ujjain)',
        state: 'मध्य प्रदेश (Madhya Pradesh)',
        plotSizeHectares: 1.6,
        plotSizeAcres: 3.95,
        primaryCropKharif: 'soybean',
        primaryCropRabi: 'wheat',
        waterSource: 'Borewell (Electric Pump)',
        soilType: 'Deep Black Cotton Soil (Regur)',
      };
      setFormData(p1);
      onUpdateProfile(p1);
      storageService.saveFarmerProfile(p1);
    } else {
      const p2: FarmerProfile = {
        name: 'बाबूलाल मालवीय (Babu Lal Malviya)',
        village: 'नरवर (Narwar)',
        district: 'उज्जैन (Ujjain)',
        state: 'मध्य प्रदेश (Madhya Pradesh)',
        plotSizeHectares: 0.9,
        plotSizeAcres: 2.22,
        primaryCropKharif: 'soybean',
        primaryCropRabi: 'gram',
        waterSource: 'Canal + Diesel Pump',
        soilType: 'Medium Loam',
      };
      setFormData(p2);
      onUpdateProfile(p2);
      storageService.saveFarmerProfile(p2);
    }
  };

  const handleSave = () => {
    audioSpeechService.playFeedbackSound('confirm');
    onUpdateProfile(formData);
    storageService.saveFarmerProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00652c] text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                किसान प्रोफाइल व खेत विवरण
              </h3>
              <p className="text-xs text-slate-500">
                साझा फोन प्रोफाइल (Shared Household Device)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-5 space-y-5 flex-1">
          {/* Shared Device Profile Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              1. साझा फोन में किसान चुनें (Quick Profile Switch):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSwitchSharedProfile('p1')}
                className={`min-h-[44px] p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                  activeProfileTab === 'p1'
                    ? 'bg-emerald-50 text-[#00652c] border-[#00652c] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="block font-extrabold">रामेश्वर पटेल</span>
                <span className="text-[11px] text-slate-500">1.6 हे. (3.95 एकड़)</span>
              </button>
              <button
                onClick={() => handleSwitchSharedProfile('p2')}
                className={`min-h-[44px] p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                  activeProfileTab === 'p2'
                    ? 'bg-emerald-50 text-[#00652c] border-[#00652c] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="block font-extrabold">बाबूलाल मालवीय</span>
                <span className="text-[11px] text-slate-500">0.9 हे. (2.22 एकड़)</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">किसान का नाम:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#00652c] focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">गाँव:</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#00652c] focus:outline-none font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">जिला:</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#00652c] focus:outline-none font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">रकबा (हेक्टेयर):</label>
                <input
                  type="number"
                  step="0.1"
                  max="2.0"
                  value={formData.plotSizeHectares}
                  onChange={(e) => {
                    const h = parseFloat(e.target.value) || 1.0;
                    setFormData({
                      ...formData,
                      plotSizeHectares: h,
                      plotSizeAcres: Number((h * 2.471).toFixed(2)),
                    });
                  }}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#00652c] focus:outline-none font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">रकबा (एकड़ में):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.plotSizeAcres}
                  disabled
                  className="w-full min-h-[44px] px-3 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">पानी का मुख्य साधन:</label>
              <select
                value={formData.waterSource}
                onChange={(e) => setFormData({ ...formData, waterSource: e.target.value as any })}
                className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#00652c] focus:outline-none font-semibold text-slate-900 cursor-pointer"
              >
                <option value="Borewell (Electric Pump)">ट्यूबवेल / बोरवेल (3-फेज बिजली मोटर)</option>
                <option value="Canal + Diesel Pump">नहर + डीजल पम्पसेट</option>
                <option value="Open Well">कुआं (ओपन वेल मोटर)</option>
                <option value="Rainfed">बारिश आधारित (Rainfed / असिंचित)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">मिट्टी की किस्म:</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#00652c] focus:outline-none font-semibold text-slate-900 cursor-pointer"
              >
                <option value="Deep Black Cotton Soil (Regur)">गहरी काली मिट्टी (मालवा रेगुर)</option>
                <option value="Medium Loam">मध्यम दोमट मिट्टी</option>
                <option value="Sandy Red Soil">लाल रेतीली मिट्टी</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleSave}
            className="w-full min-h-[48px] bg-[#00652c] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95"
          >
            <Check className="w-5 h-5" />
            <span>प्रोफाइल सुरक्षित करें (Save Profile)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
