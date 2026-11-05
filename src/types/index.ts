/**
 * Core type definitions for KisanSeva Agritech Platform
 * Engineered for Indian smallholder farmers (< 2 hectares)
 */

export type Season = 'kharif' | 'rabi';

export type Language = 'hi' | 'malvi' | 'en' | 'mr' | 'pa';

export type LocalizedString = {
  hi: string;
  malvi: string;
  en: string;
  mr?: string;
  pa?: string;
  [key: string]: string | undefined;
};

export function getLocalizedText(
  obj: { [key: string]: string | undefined } | undefined,
  lang: Language,
  fallback = 'hi'
): string {
  if (!obj) return '';
  return obj[lang] || obj[fallback] || obj['hi'] || obj['en'] || '';
}

export interface CropInfo {
  id: string;
  name: string;
  localName: LocalizedString;
  season: Season;
  typicalYieldRange: [number, number]; // Quintals per acre
  mspRatePerQuintal: number; // ₹ MSP
  mandiRateCurrent: number; // ₹ Current Mandi price
  waterRequirement: 'low' | 'medium' | 'high';
  growthDurationDays: number;
  criticalIrrigationStages: string[];
}

export interface DiseaseDiagnosis {
  id: string;
  cropId: string;
  cropName: string;
  diseaseName: string;
  localDiseaseName: LocalizedString;
  colloquialTerms: string[];
  severity: 'low' | 'moderate' | 'critical';
  confidence: number;
  imageThumbnail: string;
  framingQualityScore: number; // 0 - 100
  symptoms: LocalizedString;
  genericChemical: {
    activeIngredient: string;
    formulation: string;
    commercialGenericName: string;
    dosagePer15LPump: string;
    dosagePerAcre: string;
    waterVolumePerAcre: string;
    estimatedCostPerAcre: number;
    safetyWaitPeriodDays: number;
    preparationInstructions: LocalizedString;
  };
  dealerAlternative: {
    proprietaryBrand: string;
    marketingPitch: string;
    estimatedCostPerAcre: number;
    unnecessaryAddons: string[];
  };
  netSavingPerAcre: number;
  audioAdvisoryText: LocalizedString;
  status: 'analyzing' | 'completed' | 'queued_offline';
  timestamp: string;
  farmerAdoptionChoice?: 'adopted_generic' | 'bought_dealer_cocktail' | 'no_chemical';
}

export interface YieldScenarioInputs {
  ureaBags: number; // 45kg bags per acre (Govt subsidised ₹266.50)
  dapBags: number; // 50kg bags per acre (~₹1,350)
  potashBags: number; // per acre (~₹1,700)
  zincSulphateKg: number; // kg per acre (~₹70/kg)
  irrigationPasses: number; // count (1 to 5)
  weedManagement: 'none' | 'hand_weeding' | 'pre_emergence_spray';
}

export interface YieldPredictionResult {
  predictedYieldQuintalsPerAcre: number;
  confidenceScore: number; // 0 - 100
  confidenceRating: 'High' | 'Medium' | 'Low (Thin Data)';
  confidenceReason: LocalizedString;
  grossRevenueRupees: number;
  additionalCostRupees: number;
  netProfitRupees: number;
  returnAssured: boolean;
  prudenceAdvisory: LocalizedString;
  explainableFactors: {
    factorName: string;
    impact: 'positive' | 'negative' | 'neutral';
    magnitude: string;
    visualBarPct: number;
    explanation: string;
  }[];
}

export interface SavedYieldScenario {
  id: string;
  title: string;
  season: Season;
  cropId: string;
  cropName: string;
  inputs: YieldScenarioInputs;
  result: YieldPredictionResult;
  savedAt: string;
}

export interface ElectricitySlot {
  slotName: string;
  phaseType: '3-Phase Agricultural' | '1-Phase Rural Lighting Only';
  timeRange: string;
  startHour: number; // 24h
  endHour: number;
  isLiveNow: boolean;
  voltageStatus: 'Normal (415V)' | 'Low Voltage (310V - Motor Tripping)' | 'Power Cut';
  upcomingRosterChange: string;
}

export interface IrrigationRecommendation {
  status: 'DELAY_PUMPING' | 'IRRIGATE_NOW' | 'WAIT_FOR_POWER';
  urgency: 'high' | 'caution' | 'optimal';
  headline: LocalizedString;
  detailedAdvice: LocalizedString;
  audioPrompt: LocalizedString;
  weatherSummary: {
    rainProbability24h: number;
    rainProbability48h: number;
    expectedRainfallMm: number;
    temperatureC: number;
    humidityPct: number;
    soilMoistureStatus: 'Over-saturated' | 'Adequate' | 'Moisture Deficit' | 'Critical Stress';
    soilMoisturePct: number;
  };
  electricitySlot: ElectricitySlot;
  canalRoster: {
    canalName: string;
    isWaterFlowing: boolean;
    turnDateRange: string;
    distanceKm: number;
  };
  dieselOrPowerCostSavedPerAcre: number;
  pumpingHoursRecommended: number;
  lastUpdatedFormatted: string;
  offlineCachedAt: string;
}

export interface VoiceMessage {
  id: string;
  sender: 'farmer' | 'kisan_seva_bot';
  text: string;
  dialectDetected?: string;
  colloquialTermsMapped?: { colloquial: string; technical: string }[];
  audioDurationSeconds?: number;
  timestamp: string;
  suggestedAction?: {
    type: 'open_disease' | 'open_irrigation' | 'open_yield';
    label: string;
  };
}

export interface FarmerProfile {
  name: string;
  village: string;
  district: string;
  state: string;
  plotSizeHectares: number; // Sub-2ha
  plotSizeAcres: number;
  primaryCropKharif: string;
  primaryCropRabi: string;
  waterSource: 'Borewell (Electric Pump)' | 'Canal + Diesel Pump' | 'Open Well' | 'Rainfed';
  soilType: 'Deep Black Cotton Soil (Regur)' | 'Medium Loam' | 'Sandy Red Soil';
}

export interface ValidationMetrics {
  readableCaptureRate: number; // %
  totalPhotosCaptured: number;
  glareAlertsTriggered: number;
  dealerBypassRate: number; // % who chose generic
  chemicalCostSavedRupees: number;
  yieldScenarioInteractions: number;
  scenariosSavedCount: number;
  trustScoreAvg: number; // out of 5
  delayedIrrigationAdherenceRate: number; // %
  dieselPumpSavingsTotalRupees: number;
  voiceToTextInputRatio: number; // e.g. 84% voice
  weeklyRetentionSessions: number;
  colloquialTermMatches: number;
}
