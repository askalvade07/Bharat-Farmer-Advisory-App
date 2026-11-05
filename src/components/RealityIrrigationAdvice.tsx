import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Zap,
  CloudRain,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  ShieldCheck,
  Calendar,
  Compass,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { IrrigationRecommendation, Language } from '../types';
import { storageService } from '../services/storageService';
import { audioSpeechService } from '../services/audioSpeechService';

interface RealityIrrigationAdviceProps {
  language: Language;
  plotSizeAcres: number;
  isOnline: boolean;
  sunlightMode: boolean;
}

export const RealityIrrigationAdvice: React.FC<RealityIrrigationAdviceProps> = ({
  language,
  plotSizeAcres,
  isOnline,
  sunlightMode,
}) => {
  const [advice, setAdvice] = useState<IrrigationRecommendation>(storageService.getIrrigationCache());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [adherenceRecorded, setAdherenceRecorded] = useState<'adhered' | 'irrigated_override' | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showCanalDetails, setShowCanalDetails] = useState<boolean>(false);
  const [isRefreshingCache, setIsRefreshingCache] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      audioSpeechService.stopSpeaking();
    };
  }, []);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      audioSpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text = advice.audioPrompt[language] || advice.audioPrompt.hi;
      audioSpeechService.speak(text, language, () => setIsSpeaking(false));
    }
  };

  const handleRefreshCache = () => {
    if (!isOnline) {
      audioSpeechService.playFeedbackSound('alert');
      return;
    }
    setIsRefreshingCache(true);
    audioSpeechService.playFeedbackSound('camera_shutter');

    setTimeout(() => {
      setIsRefreshingCache(false);
      const updated = {
        ...advice,
        lastUpdatedFormatted: `अभी ${new Date().toLocaleTimeString()} पर मौसम रडार व ग्रिड से सिंक हुआ`,
        offlineCachedAt: new Date().toLocaleString('hi-IN'),
      };
      setAdvice(updated);
      storageService.saveIrrigationCache(updated);
      audioSpeechService.playFeedbackSound('confirm');
    }, 1200);
  };

  const handleLogAdherence = (didAdhere: boolean) => {
    audioSpeechService.playFeedbackSound('confirm');
    if (didAdhere) {
      setAdherenceRecorded('adhered');
      storageService.logIrrigationAdherence(true, 'सिंचाई 48 घंटे टाली (बारिश के कारण ₹380 बचाए)');
    } else {
      setAdherenceRecorded('irrigated_override');
    }
  };

  const submitOverrideWithReason = (reason: string) => {
    storageService.logIrrigationAdherence(false, reason);
    setOverrideReason(reason);
  };

  const totalSavingRupees = advice.dieselOrPowerCostSavedPerAcre * plotSizeAcres;

  return (
    <div className="space-y-6">
      {/* Top Main Status: Reality-Based Action Banner */}
      <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 shadow-sm transition-colors ${
        advice.status === 'DELAY_PUMPING'
          ? 'bg-amber-50 border-amber-500 text-amber-950'
          : advice.status === 'IRRIGATE_NOW'
          ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
          : 'bg-blue-50 border-blue-500 text-blue-950'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-600 text-white">
                महत्वपूर्ण सिंचाई निर्णय (Action Alert)
              </span>
              <span className="text-xs font-bold text-amber-900">
                {advice.lastUpdatedFormatted}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {advice.headline[language] || advice.headline.hi}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-3xl">
              {advice.detailedAdvice[language] || advice.detailedAdvice.hi}
            </p>
          </div>

          {/* Large Spoken Audio Button for low-literacy farmers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={handleToggleSpeak}
              className={`min-h-[52px] px-5 py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-3 cursor-pointer shadow-md transition-transform active:scale-95 ${
                isSpeaking
                  ? 'bg-amber-700 text-white animate-pulse'
                  : 'bg-[#00652c] text-white hover:bg-[#15803d]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  <span>आवाज रोकें</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-emerald-200" />
                  <span>सिंचाई सलाह सुनें (Audio)</span>
                </>
              )}
            </button>

            <button
              onClick={handleRefreshCache}
              disabled={isRefreshingCache || !isOnline}
              className="min-h-[52px] px-4 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              title={isOnline ? 'ताजा मौसम व ग्रिड अपडेट करें' : 'ऑफलाइन मोड'}
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${isRefreshingCache ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">सिंक करें</span>
            </button>
          </div>
        </div>

        {/* Cost Savings Calculator (PRD Metric: Pumping cost saved per acre) */}
        <div className="mt-6 pt-5 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200">
            <span className="text-xs text-amber-800 font-bold block">
              प्रति एकड़ अनुमानित बचत (Per Acre Saving)
            </span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              ₹{advice.dieselOrPowerCostSavedPerAcre}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              4 घंटे ट्यूबवेल मोटर चलाने का बिजली बिल बचा
            </span>
          </div>

          <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200">
            <span className="text-xs text-amber-800 font-bold block">
              आपके कुल खेत पर बचत ({plotSizeAcres} एकड़)
            </span>
            <span className="text-2xl font-black text-[#00652c] tabular-nums">
              ₹{Math.round(totalSavingRupees)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              डीजल/बिजली व लेबर की सीधी शुद्ध बचत
            </span>
          </div>

          <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200">
            <span className="text-xs text-amber-800 font-bold block">
              अनुमानित वर्षा (Rain Quantity)
            </span>
            <span className="text-2xl font-black text-blue-700 tabular-nums">
              {advice.weatherSummary.expectedRainfallMm} मिमी
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              बारिश संभावना: {advice.weatherSummary.rainProbability24h}% (IMD रडार)
            </span>
          </div>
        </div>
      </div>

      {/* Hero 2-Column: Electricity Grid Roster vs Hyper-Local Weather Constraints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Card: Reality-Based Electricity Schedule (MPPKVVCL 3-Phase Ag Grid) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Zap className="w-4 h-4 fill-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    बिजली आपूर्ति रोस्टर (Power Schedule)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    म.प्र. पश्चिम क्षेत्र विद्युत वितरण (उज्जैन ग्रामीण)
                  </span>
                </div>
              </div>

              {/* Live Power Indicator */}
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                advice.electricitySlot.isLiveNow
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {advice.electricitySlot.isLiveNow ? '3-फेज लाइन चालू' : 'अभी 3-फेज बंद'}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold block">वर्तमान कृषि स्लॉट</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {advice.electricitySlot.slotName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold block">निर्धारित समय</span>
                  <span className="text-sm font-bold text-slate-800">
                    {advice.electricitySlot.timeRange}
                  </span>
                </div>
              </div>

              {/* Voltage & Phase Warning (Addresses real farmer hardship) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">वोल्टेज स्थिति:</span>
                  <span className="font-bold text-slate-900">
                    {advice.electricitySlot.voltageStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">फेज प्रकार:</span>
                  <span className="font-bold text-slate-900">
                    {advice.electricitySlot.phaseType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  {advice.electricitySlot.upcomingRosterChange}
                </p>
              </div>

              {/* Realistic Advisory explanation: We do NOT tell farmer to irrigate at 2 PM when power is only midnight! */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">सटीक समय समन्वय:</span> ऐप कभी भी दिन में 2 बजे ट्यूबवेल चलाने को नहीं कहेगा, क्योंकि कृषि 3-फेज बिजली केवल रात 11:30 से सुबह 5:30 बजे ही मिलती है।
                </div>
              </div>
            </div>
          </div>

          {/* Canal Rotation Schedule Accordion */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => setShowCanalDetails(!showCanalDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-950 cursor-pointer py-1"
            >
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#1248d3]" />
                <span>नहर पानी की बारी (Canal Schedule)</span>
              </div>
              {showCanalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCanalDetails && (
              <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">उपनहर:</span>
                  <span className="font-bold text-slate-800">{advice.canalRoster.canalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">दूरी:</span>
                  <span className="font-bold text-slate-800">{advice.canalRoster.distanceKm} किमी</span>
                </div>
                <p className="text-[11px] text-[#00652c] font-bold pt-1">
                  {advice.canalRoster.turnDateRange}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Hyper-Local Weather & Soil Moisture Status */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800">
                  <CloudRain className="w-4 h-4 fill-blue-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    स्थानीय मौसम व मिट्टी नमी (Weather Radar)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    ग्राम सेमलिया पिनकोड 456006 उपग्रह डेटा
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block">तापमान</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {advice.weatherSummary.temperatureC}°C · {advice.weatherSummary.humidityPct}% आर्द्रता
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Rain Probability Progress Bar */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">अगले 24 घंटे में वर्षा की संभावना:</span>
                  <span className="text-blue-700 text-sm font-black">
                    {advice.weatherSummary.rainProbability24h}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${advice.weatherSummary.rainProbability24h}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>आज रात: हल्की फुहार</span>
                  <span className="font-bold text-blue-800">कल सुबह: तेज बारिश (24.5 मिमी)</span>
                </div>
              </div>

              {/* Soil Moisture Gauge */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">खेत की मिट्टी में वर्तमान नमी:</span>
                  <span className="text-emerald-700 text-sm font-black">
                    {advice.weatherSummary.soilMoisturePct}% ({advice.weatherSummary.soilMoistureStatus})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${advice.weatherSummary.soilMoisturePct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  काली मिट्टी में अभी पर्याप्त नमी है। यदि आज ट्यूबवेल चलाया तो पौधे पीले पड़ सकते हैं।
                </p>
              </div>

              {/* Offline Field Cache Notice */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  ऑफलाइन कैश समय: {advice.offlineCachedAt}
                </span>
                <span className="font-bold text-slate-800 text-[11px]">खेत में बिना 4G चलेगा</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FARMER BEHAVIORAL FEEDBACK LOGGER (PRD Assumption 3 Instrument: Adherence & Real-world constraints) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              सिंचाई डायरी व व्यवहार पुष्टि (Irrigation Log & Adherence)
            </h3>
            <p className="text-xs text-slate-600">
              क्या आपने बारिश की सलाह मानकर आज रात ट्यूबवेल बंद रखा?
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">अनुसंधान उपकरण #3</span>
        </div>

        {adherenceRecorded === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleLogAdherence(true)}
              className="min-h-[48px] px-4 py-3 bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>हाँ, सिंचाई टाल दी (₹380 बिजली बचाई)</span>
            </button>

            <button
              onClick={() => handleLogAdherence(false)}
              className="min-h-[48px] px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>नहीं, मैंने फिर भी पानी दिया (मजबूरी थी)</span>
            </button>
          </div>
        ) : adherenceRecorded === 'adhered' ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>धन्यवाद! आपकी ₹380 की बचत दर्ज हो गई है। मिट्टी व फसल सुरक्षित रहेगी।</span>
            </div>
            <button
              onClick={() => setAdherenceRecorded(null)}
              className="text-xs text-emerald-800 underline font-bold cursor-pointer"
            >
              बदलें
            </button>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3">
            <span className="text-xs sm:text-sm font-bold text-amber-950 block">
              आपने सिंचाई क्यों की? (फील्ड बाधाओं को समझने हेतु बताएं):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'बिजली कब कट जाए भरोसा नहीं था',
                'आज ही नहर के पानी की बारी थी',
                'फसल बहुत मुरझा रही थी',
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => submitOverrideWithReason(reason)}
                  className={`min-h-[44px] p-2 text-xs font-bold rounded-lg border text-left cursor-pointer transition-colors ${
                    overrideReason === reason
                      ? 'bg-amber-800 text-white border-amber-900'
                      : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            {overrideReason && (
              <p className="text-xs text-amber-900 font-semibold">
                ✓ आपका अनुभव दर्ज कर लिया गया है ताकि बिजली विभाग को रिपोर्ट भेजी जा सके।
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
