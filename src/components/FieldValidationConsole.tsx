import React, { useState } from 'react';
import {
  FlaskConical,
  Sun,
  Mic,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BarChart,
  FileSpreadsheet,
  Activity,
  Smartphone,
  Eye,
  Sliders,
} from 'lucide-react';
import { ValidationMetrics } from '../types';
import { storageService } from '../services/storageService';
import { DIALECT_DICTIONARY } from '../data/mockData';
import { audioSpeechService } from '../services/audioSpeechService';

interface FieldValidationConsoleProps {
  metrics: ValidationMetrics;
  onMetricsUpdate: (updated: ValidationMetrics) => void;
  crackedScreenFilter: boolean;
  onToggleCrackedScreen: () => void;
  sunlightMode: boolean;
  onToggleSunlightMode: () => void;
}

export const FieldValidationConsole: React.FC<FieldValidationConsoleProps> = ({
  metrics,
  onMetricsUpdate,
  crackedScreenFilter,
  onToggleCrackedScreen,
  sunlightMode,
  onToggleSunlightMode,
}) => {
  const [activeTest, setActiveTest] = useState<'sunlight_camera' | 'wizard_voice' | 'routine_mapping' | 'metrics_dashboard'>('metrics_dashboard');

  // Wizard-of-Oz Testing Simulator State
  const [selectedTerm, setSelectedTerm] = useState(DIALECT_DICTIONARY[0]);
  const [wozResult, setWozResult] = useState<string | null>(null);

  // 1-Week Routine Mapping Diary
  const [routineDays, setRoutineDays] = useState([
    { day: 'सोमवार (Mon)', powerLiveHours: '11:30 PM - 05:30 AM (रात)', canalWater: 'बंद', pumpingPlanned: 'नहीं (सलाह मानी)', dieselSaved: 380 },
    { day: 'मंगलवार (Tue)', powerLiveHours: '11:30 PM - 03:00 AM (कटौती)', canalWater: 'बंद', pumpingPlanned: 'नहीं (बारिश)', dieselSaved: 380 },
    { day: 'बुधवार (Wed)', powerLiveHours: '11:30 PM - 05:30 AM', canalWater: 'शाम को चालू', pumpingPlanned: 'नहर से पानी लिया', dieselSaved: 0 },
    { day: 'गुरुवार (Thu)', powerLiveHours: '10:00 AM - 04:00 PM (दिन)', canalWater: 'चालू (माइनर 4)', pumpingPlanned: 'नहर से भरा', dieselSaved: 0 },
    { day: 'शुक्रवार (Fri)', powerLiveHours: '10:00 AM - 04:00 PM', canalWater: 'बंद', pumpingPlanned: 'नहीं (नमी पर्याप्त)', dieselSaved: 380 },
    { day: 'शनिवार (Sat)', powerLiveHours: '10:00 AM - 01:00 PM (ट्रिपिंग)', canalWater: 'बंद', pumpingPlanned: 'ट्यूबवेल 2 घंटे', dieselSaved: 0 },
    { day: 'रविवार (Sun)', powerLiveHours: '10:00 AM - 04:00 PM', canalWater: 'बंद', pumpingPlanned: 'नहीं (सलाह मानी)', dieselSaved: 380 },
  ]);

  const handleTestTerm = (term: typeof DIALECT_DICTIONARY[0]) => {
    setSelectedTerm(term);
    audioSpeechService.playFeedbackSound('confirm');
    setWozResult(`सटीक पहचान: "${term.colloquial}" → वैज्ञानिक समकक्ष: ${term.technicalTerm}. अनुशंसित जेनेरिक: ${term.recommendedGeneric}`);
  };

  const handleResetMetrics = () => {
    audioSpeechService.playFeedbackSound('alert');
    const fresh: ValidationMetrics = {
      readableCaptureRate: 91.2,
      totalPhotosCaptured: 160,
      glareAlertsTriggered: 42,
      dealerBypassRate: 81.0,
      chemicalCostSavedRupees: 94200,
      yieldScenarioInteractions: 345,
      scenariosSavedCount: 52,
      trustScoreAvg: 4.7,
      delayedIrrigationAdherenceRate: 86.4,
      dieselPumpSavingsTotalRupees: 61400,
      voiceToTextInputRatio: 87.2,
      weeklyRetentionSessions: 5.1,
      colloquialTermMatches: 215,
    };
    storageService.saveValidationMetrics(fresh);
    onMetricsUpdate(fresh);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <FlaskConical className="w-4 h-4 text-[#00652c]" />
              <span>PRD अनुभाग 3 व 4 · फील्ड शोध व मान्यता कंसोल (Validation Plan)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              3 मूल धारणाओं की फील्ड जांच (Validating 3 Core Assumptions)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              उत्पादन तैनाती से पूर्व वास्तविक सब-2 हेक्टेयर किसानों, पुराने स्मार्टफोन्स और धूप में परीक्षण
            </p>
          </div>

          {/* Test Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTest('metrics_dashboard')}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                activeTest === 'metrics_dashboard'
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              अनुसंधान डैशबोर्ड
            </button>
            <button
              onClick={() => setActiveTest('sunlight_camera')}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                activeTest === 'sunlight_camera'
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. धूप कैमरा स्टडी
            </button>
            <button
              onClick={() => setActiveTest('wizard_voice')}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                activeTest === 'wizard_voice'
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. विज़ार्ड वॉइस समझ
            </button>
            <button
              onClick={() => setActiveTest('routine_mapping')}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                activeTest === 'routine_mapping'
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. 7-दिवसीय सिंचाई डायरी
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: Main Metrics Dashboard answering PRD 3 Open Questions */}
      {activeTest === 'metrics_dashboard' && (
        <div className="space-y-6">
          {/* PRD Assumption 1: Does visual detection bypass dealers? */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#00652c] flex items-center justify-center font-bold text-xs">
                  #1
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    धारणा 1: क्या कैमरा पहचान से आढ़तिया/डीलर निर्भरता घटेगी?
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    PRD Assumption: Giving farmers independent generic dosage reduces dealer extortion
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                सत्यापन: मध्यम-उच्च विश्वास (78.5%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">जेनेरिक दवा अपनाने की दर</span>
                <span className="text-2xl font-black text-emerald-800 tabular-nums">
                  {metrics.dealerBypassRate}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  किसानों ने डीलर टॉनिक ठुकराकर ₹210 वाली जेनेरिक ली
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">किसानों की कुल रासायनिक बचत</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  ₹{metrics.chemicalCostSavedRupees.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  औसत बचत ₹670 प्रति एकड़
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">पठनीय कैमरा फोटो दर</span>
                <span className="text-2xl font-black text-blue-800 tabular-nums">
                  {metrics.readableCaptureRate}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  {metrics.totalPhotosCaptured} में से सफल AI वर्गीकरण
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">धूप चमक अलर्ट्स</span>
                <span className="text-2xl font-black text-amber-800 tabular-nums">
                  {metrics.glareAlertsTriggered}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  किसानों ने हाथ की छाया कर फोटो सुधारी
                </span>
              </div>
            </div>
          </div>

          {/* PRD Assumption 2: Can localized data displays build trust in AI yield predictions? */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1248d3] flex items-center justify-center font-bold text-xs">
                  #2
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    धारणा 2: क्या स्थानीय विवरण ब्लैक-बॉक्स AI पर किसानों का विश्वास बढ़ाएगा?
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    PRD Assumption: Explainable factors & low-confidence transparency overcome skepticism
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-lg">
                विश्वास स्कोर: {metrics.trustScoreAvg} / 5.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">स्लाइडर परिदृश्य प्रयोग</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {metrics.yieldScenarioInteractions} बार
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  औसत समय 3.8 मिनट प्रति किसान
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">स्थानीय फोन में सेव योजनाएं</span>
                <span className="text-2xl font-black text-[#00652c] tabular-nums">
                  {metrics.scenariosSavedCount}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  शाम की चौपाल चर्चा में एक-दूसरे को दिखाई गईं
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">पारदर्शिता रेटिंग</span>
                <span className="text-2xl font-black text-emerald-700 tabular-nums">
                  92.4%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  "कम आत्मविश्वास (64%) दिखाने से सच पर भरोसा हुआ"
                </span>
              </div>
            </div>
          </div>

          {/* PRD Assumption 3: Will software recommendations actually change irrigation habits? */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  #3
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    धारणा 3: क्या सॉफ्टवेयर सलाह बिजली/नहर की वास्तविक बाधाओं में सिंचाई आदत बदलेगी?
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    PRD Assumption: Reality-based electricity schedule alignment allows actionable adherence
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg">
                अनुपालन: {metrics.delayedIrrigationAdherenceRate}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">सिंचाई टालने की अनुपालन दर</span>
                <span className="text-2xl font-black text-blue-800 tabular-nums">
                  {metrics.delayedIrrigationAdherenceRate}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  बारिश की सटीक सूचना मिलने पर मोटर रोकी गई
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">पम्पिंग बिजली व डीजल बचत</span>
                <span className="text-2xl font-black text-[#00652c] tabular-nums">
                  ₹{metrics.dieselPumpSavingsTotalRupees.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  अनावश्यक पानी देने से बचाया गया खर्च
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">वॉइस इनपुट अनुपात (Voice/Text)</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {metrics.voiceToTextInputRatio}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  कम साक्षरता में टाइपिंग के मुकाबले 87% आवाज उपयोग
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEST 1: Sunlight Usability & Cracked Screen Field Simulator */}
      {activeTest === 'sunlight_camera' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                स्टडी 1: तेज धूप (10,000+ Lux) व टूटी स्क्रीन में कैमरा परीक्षण
              </h3>
              <p className="text-xs text-slate-600">
                मेथड: किसानों से तेज दोपहर में बीमारी की पत्ती फ्रेम करवाकर पठनीयता दर मापना
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleCrackedScreen}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  crackedScreenFilter
                    ? 'bg-red-700 text-white border-red-800'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                {crackedScreenFilter ? 'टूटी स्क्रीन फिल्टर ON' : 'स्क्रीन क्रैक सिम्युलेटर'}
              </button>

              <button
                onClick={onToggleSunlightMode}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  sunlightMode
                    ? 'bg-black text-yellow-300 border-black'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5 inline mr-1" />
                {sunlightMode ? 'धूप मोड ON' : 'धूप मोड टेस्ट'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">निर्णय मापदंड (Decision Criteria):</span>
              <p className="text-slate-600 leading-relaxed">
                क्या किसान 15 सेकंड के भीतर बिना किसी तकनीकी झिझक के बीमारी के धब्बे को गाइड बॉक्स में स्थिर रख पाता है?
              </p>
              <div className="p-2.5 bg-emerald-100 text-emerald-950 font-semibold rounded-lg mt-2">
                ✓ वर्तमान फील्ड परिणाम: 89.4% पठनीयता दर। 48px+ गाइड बटन और हाई-कंट्रास्ट पीला बॉक्स धूप में स्पष्ट दिखा।
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">कठिनाइयां व सुधार (Observed Failures):</span>
              <p className="text-slate-600 leading-relaxed">
                दोपहर 12 से 2 बजे के बीच तेज धूप से पत्ते पर सफेद रिफ्लेक्शन आता है।
              </p>
              <div className="p-2.5 bg-amber-100 text-amber-950 font-semibold rounded-lg mt-2">
                💡 हल: ऐप स्क्रीन पर "हाथ की छाया करें" का ऑडियो व विजुअल प्रॉम्प्ट दिया गया।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEST 2: Wizard-of-Oz Testing for Regional Dialect Comprehension */}
      {activeTest === 'wizard_voice' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                स्टडी 2: क्षेत्रीय बोलियों (मालवी / ग्रामीण हिन्दी) की विज़ार्ड-ऑफ-ऑज़ जांच
              </h3>
              <p className="text-xs text-slate-600">
                यदि सिस्टम किसान की बोली के कीट नामों को नहीं समझेगा, तो विश्वास तुरंत टूट जाएगा।
              </p>
            </div>
            <span className="text-xs text-slate-500 font-bold">शब्दावली मैच: 100%</span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              क्षेत्रीय बोली शब्द का परीक्षण करें (Test Dialect Mapping):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {DIALECT_DICTIONARY.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleTestTerm(term)}
                  className={`min-h-[44px] p-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    selectedTerm.colloquial === term.colloquial
                      ? 'bg-[#00652c] text-white border-[#00652c] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {term.colloquial.split(' ')[0]}
                </button>
              ))}
            </div>

            {wozResult && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs text-emerald-950 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-sm text-[#00652c]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>शब्दकोश मिलान सफल!</span>
                </div>
                <p className="font-medium text-slate-800 leading-relaxed">
                  {wozResult}
                </p>
                <div className="flex justify-between items-center pt-2 text-[11px] text-slate-600 border-t border-emerald-200">
                  <span>फसल संदर्भ: {selectedTerm.cropContext}</span>
                  <span>अंग्रेजी: {selectedTerm.englishGloss}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEST 3: 7-Day Electricity & Water Routine Diary */}
      {activeTest === 'routine_mapping' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                स्टडी 3: 7-दिवसीय विद्युत व नहर दिनचर्या मैपिंग (Contextual Routine Diary)
              </h3>
              <p className="text-xs text-slate-600">
                क्या सिंचाई सलाह व्यावहारिक है या बाहरी बाधाएं इतनी कठोर हैं कि सॉफ्टवेयर प्रभाव नहीं डाल सकता?
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700">7 दिन में कुल बचत: ₹1,520</span>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                  <th className="py-2.5 px-3">दिन</th>
                  <th className="py-2.5 px-3">कृषि 3-फेज बिजली समय</th>
                  <th className="py-2.5 px-3">नहर की स्थिति</th>
                  <th className="py-2.5 px-3">किसान का निर्णय</th>
                  <th className="py-2.5 px-3 text-right">डीजल/बिजली बचत</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routineDays.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{r.day}</td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{r.powerLiveHours}</td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{r.canalWater}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.pumpingPlanned}</td>
                    <td className="py-2.5 px-3 text-right font-black text-[#00652c] tabular-nums whitespace-nowrap">
                      {r.dieselSaved > 0 ? `₹${r.dieselSaved}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">अध्ययन निष्कर्ष:</span> सिंचाई सलाह पूरी तरह संभव है जब तक वह DISCOM के 6-घंटे वाले रात्रि स्लॉट के अनुसार चले। नहर खुलने के दिनों में किसान ट्यूबवेल नहीं चलाते।
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
