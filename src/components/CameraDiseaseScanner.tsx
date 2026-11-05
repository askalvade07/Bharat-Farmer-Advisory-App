import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  HelpCircle,
  Shield,
  Eye,
  Info,
} from 'lucide-react';
import { DiseaseDiagnosis, Language } from '../types';
import { audioSpeechService } from '../services/audioSpeechService';
import { storageService } from '../services/storageService';

interface CameraDiseaseScannerProps {
  diagnoses: DiseaseDiagnosis[];
  onDiagnosesUpdate: (updated: DiseaseDiagnosis[]) => void;
  language: Language;
  selectedCropId: string;
  isOnline: boolean;
  sunlightMode: boolean;
}

export const CameraDiseaseScanner: React.FC<CameraDiseaseScannerProps> = ({
  diagnoses,
  onDiagnosesUpdate,
  language,
  selectedCropId,
  isOnline,
  sunlightMode,
}) => {
  const [activeTab, setActiveTab] = useState<'viewfinder' | 'results' | 'history'>('viewfinder');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiseaseDiagnosis | null>(diagnoses[0] || null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSimulatingCapture, setIsSimulatingCapture] = useState<boolean>(false);
  const [backgroundUploadStatus, setBackgroundUploadStatus] = useState<string | null>(null);

  // Live Viewfinder Guidance Simulation States
  const [distanceState, setDistanceState] = useState<'too_far' | 'optimal' | 'too_close'>('optimal');
  const [lightingState, setLightingState] = useState<'harsh_glare' | 'optimal' | 'low_light'>('optimal');
  const [focusState, setFocusState] = useState<'steady' | 'shaky'>('steady');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleFieldPhotos = [
    {
      title: 'सोयाबीन पत्ती (Soybean Mosaic)',
      path: '/src/assets/images/leaf_disease_sample_soybean_1793853537577.jpg',
      crop: 'soybean',
      expectedDiagnosisId: 'diag-soy-01',
    },
    {
      title: 'गेहूं पीला रतुआ (Wheat Stripe Rust)',
      path: '/src/assets/images/crop_wheat_rust_sample_1793853537802.jpg',
      crop: 'wheat',
      expectedDiagnosisId: 'diag-wheat-02',
    },
  ];

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      audioSpeechService.stopSpeaking();
    };
  }, []);

  // Handle capture simulation
  const handleCapture = (imageSource?: string) => {
    audioSpeechService.playFeedbackSound('camera_shutter');
    setIsSimulatingCapture(true);

    const activePhoto = imageSource || sampleFieldPhotos[selectedSampleIndex].path;

    if (!isOnline) {
      // Offline fallback: Queue for background upload when connection restores
      setTimeout(() => {
        setIsSimulatingCapture(false);
        setBackgroundUploadStatus('फोटो डिवाइस में सुरक्षित सेव हो गई है। 4G नेटवर्क आते ही बैकग्राउंड में परिणाम आ जाएगा।');
        audioSpeechService.playFeedbackSound('confirm');
        storageService.addToOfflineQueue({
          id: `offline-${Date.now()}`,
          cropId: selectedCropId,
          cropName: selectedCropId === 'soybean' ? 'सोयाबीन' : 'गेहूं',
          imageBlobUrl: activePhoto,
          timestamp: new Date().toLocaleTimeString(),
          status: 'pending_in_queue',
        });
      }, 1200);
      return;
    }

    // Online simulation: Background upload with result notification
    setBackgroundUploadStatus('पत्ती की फोटो अपलोड हो रही है... AI रोग मॉडल विश्लेषण कर रहा है...');
    
    setTimeout(() => {
      setIsSimulatingCapture(false);
      setBackgroundUploadStatus(null);
      audioSpeechService.playFeedbackSound('confirm');

      // Update validation metrics for readable capture
      const metrics = storageService.getValidationMetrics();
      metrics.totalPhotosCaptured += 1;
      metrics.readableCaptureRate = Math.min(
        98,
        Number((metrics.readableCaptureRate * 0.96 + 4).toFixed(1))
      );
      storageService.saveValidationMetrics(metrics);

      // Select diagnosis based on sample
      const matchedDiag = diagnoses.find(d => d.cropId === selectedCropId) || diagnoses[0];
      setSelectedDiagnosis(matchedDiag);
      setActiveTab('results');

      // Auto-play spoken advice prompt in local language
      const speechText = matchedDiag.audioAdvisoryText[language] || matchedDiag.audioAdvisoryText.hi;
      setIsSpeaking(true);
      audioSpeechService.speak(speechText, language, () => setIsSpeaking(false));
    }, 1800);
  };

  const handleToggleSpeak = (text: string) => {
    if (isSpeaking) {
      audioSpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioSpeechService.speak(text, language, () => setIsSpeaking(false));
    }
  };

  const handleAdoptionChoice = (choice: 'adopted_generic' | 'bought_dealer_cocktail' | 'no_chemical') => {
    if (!selectedDiagnosis) return;
    audioSpeechService.playFeedbackSound('confirm');
    storageService.updateAdoptionChoice(selectedDiagnosis.id, choice);
    const updated = diagnoses.map(d => d.id === selectedDiagnosis.id ? { ...d, farmerAdoptionChoice: choice } : d);
    onDiagnosesUpdate(updated);
    setSelectedDiagnosis({ ...selectedDiagnosis, farmerAdoptionChoice: choice });
  };

  return (
    <div className="space-y-6">
      {/* Top Segmented Sub-Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('viewfinder')}
            className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'viewfinder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-[#00652c]" />
            <span>पत्ती स्कैन (Camera Guide)</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>सटीक जांच व दवा (Diagnosis)</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>इतिहास ({diagnoses.length})</span>
          </button>
        </div>

        {/* Offline Upload Queue Notification if any */}
        {backgroundUploadStatus && (
          <div className="text-xs bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
            <span className="font-semibold">{backgroundUploadStatus}</span>
          </div>
        )}
      </div>

      {/* VIEW 1: Camera-Guided Viewfinder with Real-Time Framing, Lighting, Focus Guide */}
      {activeTab === 'viewfinder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Viewfinder Simulation Frame */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-900 shadow-xl relative aspect-4/3 flex flex-col justify-between">
            {/* Background Leaf Image preview simulating live lens */}
            <div className="absolute inset-0 z-0">
              <img
                src={sampleFieldPhotos[selectedSampleIndex].path}
                alt="Leaf in viewfinder"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  focusState === 'shaky' ? 'blur-xs scale-105' : 'blur-0 scale-100'
                } ${lightingState === 'harsh_glare' ? 'brightness-150 contrast-125' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* TOP OVERLAY: Active Sunlight & Guidance Status */}
            <div className="relative z-10 p-4 flex items-center justify-between gap-3 text-white">
              {/* Guidance Badge: Distance */}
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border ${
                distanceState === 'optimal'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
              }`}>
                {distanceState === 'optimal' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>दूरी सही है (15 सेमी)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>पत्ती के और पास लाएं</span>
                  </>
                )}
              </div>

              {/* Guidance Badge: Lighting / Glare */}
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border ${
                lightingState === 'optimal'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-950/80 text-yellow-300 border-yellow-500/50'
              }`}>
                {lightingState === 'harsh_glare' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span>तेज धूप की चमक! हाथ की छाया करें</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>रोशनी सही है</span>
                  </>
                )}
              </div>

              {/* Guidance Badge: Focus / Steady */}
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border ${
                focusState === 'steady'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-red-950/80 text-red-300 border-red-500/50 animate-pulse'
              }`}>
                {focusState === 'steady' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>फोकस स्थिर है</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>हाथ स्थिर रखें</span>
                  </>
                )}
              </div>
            </div>

            {/* CENTER OVERLAY: Tactile High-Contrast Focus Reticle (Yellow/White for high sunlight visibility) */}
            <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none p-6">
              <div className="w-56 h-56 sm:w-72 sm:h-72 border-2 border-dashed border-yellow-300/90 rounded-2xl relative flex items-center justify-center">
                {/* 4 Corner Crosshairs */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white" />

                {/* Central Instruction for illiterate or low-text farmers */}
                <div className="bg-black/75 px-4 py-2 rounded-xl text-center backdrop-blur-md border border-white/20">
                  <p className="text-white text-xs sm:text-sm font-bold">
                    बीमार पत्ती को इस चौकोर में रखें
                  </p>
                  <p className="text-yellow-300 text-[11px] font-medium mt-0.5">
                    Frame diseased leaf inside box
                  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM CONTROLS: Massive 48px+ Touch Target Capture Button */}
            <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-between gap-4">
              {/* Photo File Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const url = URL.createObjectURL(e.target.files[0]);
                    handleCapture(url);
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[48px] px-3 sm:px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md cursor-pointer transition-colors"
                title="गैलरी या कैमरा से चुनें"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">गैलरी / फाइल</span>
              </button>

              {/* PRIMARY SHUTTER BUTTON (64px Tactile Outdoor Ring) */}
              <button
                onClick={() => handleCapture()}
                disabled={isSimulatingCapture}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white border-4 border-emerald-500 shadow-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-90 hover:scale-105 mx-auto"
                aria-label="फोटो खींचें और रोग जांचें"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${isSimulatingCapture ? 'bg-amber-500 animate-spin' : 'bg-[#00652c]'} flex items-center justify-center text-white`}>
                  {isSimulatingCapture ? (
                    <RefreshCw className="w-6 h-6 text-white" />
                  ) : (
                    <Camera className="w-7 h-7 text-white" />
                  )}
                </div>
              </button>

              {/* Field Sample Switcher */}
              <button
                onClick={() => setSelectedSampleIndex((prev) => (prev + 1) % sampleFieldPhotos.length)}
                className="min-h-[48px] px-3 sm:px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-colors"
                title="खेत का दूसरा नमूना बदलें"
              >
                <RefreshCw className="w-4 h-4 text-yellow-300" />
                <span className="hidden sm:inline">नमूना बदलें</span>
              </button>
            </div>
          </div>

          {/* Right Column: Sunlight Usability Controls & Field Framing Checkers */}
          <div className="lg:col-span-4 space-y-4">
            {/* Field Condition Assistant Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00652c]" />
                <h3 className="font-bold text-slate-900 text-base">
                  धूप व फील्ड मार्गदर्शन (Sunlight Guidance)
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                तेज धूप में पत्तियों की फोटो अक्सर चमक या धुंधली होने से खराब हो जाती है। नीचे दिए गए लाइव जांच मानकों से फोटो सही आती है:
              </p>

              {/* Interactive Simulation Toggles for Field Testing */}
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    1. रोशनी जांच (Lighting & Glare)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLightingState('optimal')}
                      className={`min-h-[38px] px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                        lightingState === 'optimal'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      छायादार साफ (Optimal)
                    </button>
                    <button
                      onClick={() => {
                        setLightingState('harsh_glare');
                        const m = storageService.getValidationMetrics();
                        m.glareAlertsTriggered += 1;
                        storageService.saveValidationMetrics(m);
                      }}
                      className={`min-h-[38px] px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                        lightingState === 'harsh_glare'
                          ? 'bg-amber-600 text-white border-amber-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      तेज धूप चमक (Glare)
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    2. दूरी व फ्रेमिंग (Distance & Framing)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDistanceState('optimal')}
                      className={`min-h-[38px] px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                        distanceState === 'optimal'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      पास (15 सेमी सही)
                    </button>
                    <button
                      onClick={() => setDistanceState('too_far')}
                      className={`min-h-[38px] px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                        distanceState === 'too_far'
                          ? 'bg-amber-600 text-white border-amber-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      बहुत दूर (Too far)
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    3. स्थिरता (Hands & Cracked Screen)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFocusState('steady')}
                      className={`min-h-[38px] px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                        focusState === 'steady'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      स्थिर हाथ (Steady)
                    </button>
                    <button
                      onClick={() => setFocusState('shaky')}
                      className={`min-h-[38px] px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                        focusState === 'shaky'
                          ? 'bg-red-600 text-white border-red-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      हिलता हुआ (Shaky)
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Field Advice Box */}
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">फील्ड टिप:</span> यदि हाथ मिट्टी से सने हैं, तो फोन की वॉल्यूम बटन दबाकर भी फोटो खींची जा सकती है।
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Complete Diagnosis & Localized Cost-Effective Treatment Screen */}
      {activeTab === 'results' && selectedDiagnosis && (
        <div className="space-y-6">
          {/* Main Diagnosis Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Strip with Spoken Audio Playback Button */}
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <span>जांच पूर्ण · AI विश्वास स्तर: {selectedDiagnosis.confidence}%</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedDiagnosis.cropName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {selectedDiagnosis.localDiseaseName[language] || selectedDiagnosis.localDiseaseName.hi}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  वैज्ञानिक नाम: {selectedDiagnosis.diseaseName}
                </p>
              </div>

              {/* PROMINENT AUDIO LISTEN BUTTON for low-text literacy farmers */}
              <button
                onClick={() => handleToggleSpeak(selectedDiagnosis.audioAdvisoryText[language] || selectedDiagnosis.audioAdvisoryText.hi)}
                className={`min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 cursor-pointer shadow-sm transition-transform active:scale-95 ${
                  isSpeaking
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-[#00652c] text-white hover:bg-[#15803d]'
                }`}
                aria-label="बोलकर निर्देश सुनें"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5" />
                    <span>आवाज बंद करें (Stop)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-emerald-200" />
                    <span>पूरा निर्देश सुनें (Listen Audio)</span>
                  </>
                )}
              </button>
            </div>

            {/* Content Body: Side-by-Side Comparison of Generic Chemical vs Dealer Cocktail */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Photo & Symptoms (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 relative">
                  <img
                    src={selectedDiagnosis.imageThumbnail}
                    alt={selectedDiagnosis.diseaseName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] font-bold px-2 py-1 rounded-md backdrop-blur-xs">
                    खेत में ली गई फोटो
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block text-sm">
                    लक्षण पहचान (Visual Symptoms):
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedDiagnosis.symptoms[language] || selectedDiagnosis.symptoms.hi}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-slate-500 font-medium">
                    <span>स्थानीय नाम:</span>
                    {selectedDiagnosis.colloquialTerms.map((t, idx) => (
                      <span key={idx} className="font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Treatment & Cost Comparison (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                {/* Cost Saving Banner (Fights dealer exploitation) */}
                <div className="bg-emerald-100/70 border-2 border-emerald-400 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#00652c] text-white flex items-center justify-center font-black text-xl shrink-0">
                      ₹
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#00652c] uppercase tracking-wide block">
                        आपकी सीधी शुद्ध बचत (Cash Saved Per Acre)
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                        ₹{selectedDiagnosis.netSavingPerAcre} / एकड़
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-600">
                    <span className="block font-semibold">डीलर के महंगे टॉनिक से मुक्ति</span>
                    <span className="text-emerald-800 font-bold">फील्ड परीक्षित जेनेरिक फार्मूला</span>
                  </div>
                </div>

                {/* Direct Comparison Cards: Generic vs Dealer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: AI Recommended Low-Cost Generic (Green border) */}
                  <div className="bg-white rounded-2xl border-2 border-emerald-600 p-4 space-y-3 relative shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        अनुशंसित जेनेरिक दवा (Low Cost)
                      </span>
                      <span className="text-lg font-black text-emerald-800 tabular-nums">
                        ₹{selectedDiagnosis.genericChemical.estimatedCostPerAcre}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {selectedDiagnosis.genericChemical.commercialGenericName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        तत्व: {selectedDiagnosis.genericChemical.activeIngredient}
                      </p>
                    </div>

                    {/* Exact Dosages in Farmer-Friendly Units (15L knapsack pump) */}
                    <div className="space-y-1.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">15 लीटर पंप की टंकी:</span>
                        <span className="font-bold text-slate-900">
                          {selectedDiagnosis.genericChemical.dosagePer15LPump}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">प्रति एकड़ मात्रा:</span>
                        <span className="font-bold text-slate-900">
                          {selectedDiagnosis.genericChemical.dosagePerAcre}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">पानी की मात्रा:</span>
                        <span className="font-bold text-slate-900">
                          {selectedDiagnosis.genericChemical.waterVolumePerAcre}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50">
                        <span className="text-slate-600 font-medium">तुड़ाई सुरक्षा अंतराल (Wait):</span>
                        <span className="font-bold text-emerald-800">
                          {selectedDiagnosis.genericChemical.safetyWaitPeriodDays} दिन
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">घोलने की सही विधि:</span>
                      {selectedDiagnosis.genericChemical.preparationInstructions[language] || selectedDiagnosis.genericChemical.preparationInstructions.hi}
                    </div>
                  </div>

                  {/* Option 2: Dealer Cocktail Trap (Yellow/Red border) */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-300 p-4 space-y-3 relative opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        दुकानदार / आढ़तिया का पैकेज
                      </span>
                      <span className="text-lg font-black text-red-700 line-through tabular-nums">
                        ₹{selectedDiagnosis.dealerAlternative.estimatedCostPerAcre}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {selectedDiagnosis.dealerAlternative.proprietaryBrand}
                      </h4>
                      <p className="text-xs text-amber-900 font-medium mt-0.5">
                        {selectedDiagnosis.dealerAlternative.marketingPitch}
                      </p>
                    </div>

                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                      <span className="font-bold text-slate-800 block text-xs mb-1">
                        अनावश्यक महंगे खर्चे जो जोड़े जाते हैं:
                      </span>
                      {selectedDiagnosis.dealerAlternative.unnecessaryAddons.map((addon, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-red-800">
                          <span className="text-red-500 font-bold">✕</span>
                          <span>{addon}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950">
                      <span className="font-bold">सचेत रहें:</span> दुकानदार कमीशन के लिए 3 अलग दवाइयां मिलाते हैं जिसकी फसल को जरूरत नहीं होती।
                    </div>
                  </div>
                </div>

                {/* Farmer Feedback & Research Instrument (Validates PRD Assumption 1) */}
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800">
                      आपने क्या निर्णय लिया? (Did you choose generic or dealer?)
                    </span>
                    <span className="text-[11px] text-slate-500">फील्ड शोध डेटा</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAdoptionChoice('adopted_generic')}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedDiagnosis.farmerAdoptionChoice === 'adopted_generic'
                          ? 'bg-[#00652c] text-white border-[#00652c] shadow-xs'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>जेनेरिक दवा ली (₹670 बचाए)</span>
                    </button>

                    <button
                      onClick={() => handleAdoptionChoice('bought_dealer_cocktail')}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedDiagnosis.farmerAdoptionChoice === 'bought_dealer_cocktail'
                          ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>दुकानदार का ब्रांड लिया</span>
                    </button>

                    <button
                      onClick={() => handleAdoptionChoice('no_chemical')}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedDiagnosis.farmerAdoptionChoice === 'no_chemical'
                          ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>दवा नहीं डाली</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Historical Diagnoses & Offline Logs */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">
              पूर्व में जांची गई पत्तियां (Saved Diagnoses)
            </h3>
            <span className="text-xs text-slate-500 font-medium">डिवाइस मेमोरी में सुरक्षित</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnoses.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDiagnosis(d);
                  setActiveTab('results');
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex gap-4 items-center"
              >
                <img
                  src={d.imageThumbnail}
                  alt={d.diseaseName}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{d.timestamp}</span>
                    <span className="font-bold text-emerald-700">बचत: ₹{d.netSavingPerAcre}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm truncate mt-0.5">
                    {d.localDiseaseName[language] || d.localDiseaseName.hi}
                  </h4>
                  <p className="text-xs text-slate-600 truncate">
                    दवा: {d.genericChemical.commercialGenericName}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[#00652c] font-bold">
                    <span>विवरण देखें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
