import { CropInfo, DiseaseDiagnosis, FarmerProfile, IrrigationRecommendation, ValidationMetrics } from '../types';

export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  name: 'रामेश्वर पटेल (Rameshwar Patel)',
  village: 'सेमलिया (Semaliya)',
  district: 'उज्जैन (Ujjain)',
  state: 'मध्य प्रदेश (Madhya Pradesh)',
  plotSizeHectares: 1.6, // sub-2 hectare
  plotSizeAcres: 3.95,
  primaryCropKharif: 'soybean',
  primaryCropRabi: 'wheat',
  waterSource: 'Borewell (Electric Pump)',
  soilType: 'Deep Black Cotton Soil (Regur)',
};

export const CROPS_DATA: CropInfo[] = [
  {
    id: 'soybean',
    name: 'Soybean (सोयाबीन)',
    localName: {
      hi: 'सोयाबीन',
      malvi: 'सोयाबीन',
      en: 'Soybean',
      mr: 'सोयाबीन',
      pa: 'ਸੋਇਆਬੀਨ',
    },
    season: 'kharif',
    typicalYieldRange: [7, 14], // Quintals / acre
    mspRatePerQuintal: 4892,
    mandiRateCurrent: 4720,
    waterRequirement: 'medium',
    growthDurationDays: 95,
    criticalIrrigationStages: ['फूल आने की अवस्था (Flowering)', 'फली बनते समय (Pod Filling)'],
  },
  {
    id: 'cotton',
    name: 'Cotton (कपास)',
    localName: {
      hi: 'कपास',
      malvi: 'कपास',
      en: 'Cotton',
      mr: 'कापूस',
      pa: 'ਕਪਾਹ',
    },
    season: 'kharif',
    typicalYieldRange: [8, 16],
    mspRatePerQuintal: 7521,
    mandiRateCurrent: 7350,
    waterRequirement: 'medium',
    growthDurationDays: 160,
    criticalIrrigationStages: ['कलियां बनते समय (Squaring)', 'फूल और डोडियां (Boll Development)'],
  },
  {
    id: 'wheat',
    name: 'Wheat (गेहूं)',
    localName: {
      hi: 'गेहूं (शरबती / लोकवान)',
      malvi: 'गेहूं',
      en: 'Wheat (Sharbati/Lokwan)',
      mr: 'गहू',
      pa: 'ਕਣਕ',
    },
    season: 'rabi',
    typicalYieldRange: [14, 24],
    mspRatePerQuintal: 2425,
    mandiRateCurrent: 2580,
    waterRequirement: 'high',
    growthDurationDays: 120,
    criticalIrrigationStages: ['CRI अवस्था (21 दिन)', 'कल्ले फूटते समय (Tillering)', 'दूधिया अवस्था (Milking)'],
  },
  {
    id: 'mustard',
    name: 'Mustard (सरसों / राई)',
    localName: {
      hi: 'सरसों / राई',
      malvi: 'राई',
      en: 'Mustard',
      mr: 'मोहरी',
      pa: 'ਸਰ੍ਹੋਂ',
    },
    season: 'rabi',
    typicalYieldRange: [6, 11],
    mspRatePerQuintal: 5650,
    mandiRateCurrent: 5800,
    waterRequirement: 'low',
    growthDurationDays: 105,
    criticalIrrigationStages: ['फूल आने से ठीक पहले (Pre-flowering)', 'फलियां बनते समय (Siliqua formation)'],
  },
  {
    id: 'gram',
    name: 'Gram / Chickpea (चना)',
    localName: {
      hi: 'चना (देसी / काबुली)',
      malvi: 'चणो',
      en: 'Chickpea / Gram',
      mr: 'हरभरा',
      pa: 'ਛੋਲੇ',
    },
    season: 'rabi',
    typicalYieldRange: [7, 13],
    mspRatePerQuintal: 5440,
    mandiRateCurrent: 5620,
    waterRequirement: 'low',
    growthDurationDays: 110,
    criticalIrrigationStages: ['फूल आने से पहले (Branching)', 'घंटी बनते समय (Pod development)'],
  },
];

export const INITIAL_DIAGNOSES: DiseaseDiagnosis[] = [
  {
    id: 'diag-soy-01',
    cropId: 'soybean',
    cropName: 'सोयाबीन (Soybean)',
    diseaseName: 'Yellow Mosaic Virus + Cercospora Leaf Blight',
    localDiseaseName: {
      hi: 'पीला मोज़ेक वायरस और पर्ण झुलसा',
      malvi: 'सोयाबीन को पीलियो रोग',
      en: 'Yellow Mosaic Virus & Leaf Spot',
    },
    colloquialTerms: ['पीलापन', 'पीलिया रोग', 'पत्ती का पीला पड़ना', 'सफेद मक्खी का फैलाव'],
    severity: 'moderate',
    confidence: 94,
    imageThumbnail: '/src/assets/images/leaf_disease_sample_soybean_1793853537577.jpg',
    framingQualityScore: 92,
    symptoms: {
      en: 'Yellow mosaic patterns alternating with green tissue on leaves; transmitted by Whitefly vector. Minor necrotic fungal spotting at margin.',
      hi: 'पत्तियों पर पीले और हरे चकत्ते; सफेद मक्खी द्वारा फैलता है। किनारों पर भूरे धब्बे।',
      malvi: 'पाती पर पीलो चकत्तो पड़ गयो है, सफेद मच्छर का कारण फैले है।',
    },
    genericChemical: {
      activeIngredient: 'Thiamethoxam 25% WG + Hexaconazole 5% SC',
      formulation: 'दानेदार घुलनशील पाउडर + तरल सस्पेंशन',
      commercialGenericName: 'थियामेथोक्सम २५% डब्लूजी (Generic Thiamethoxam) + हेक्साकोनाज़ोल ५%',
      dosagePer15LPump: 'थियामेथोक्सम 10 ग्राम + हेक्साकोनाज़ोल 30 मिली (15 लीटर पंप की टंकी में)',
      dosagePerAcre: '100 ग्राम थियामेथोक्सम + 300 मिली हेक्साकोनाज़ोल प्रति एकड़',
      waterVolumePerAcre: '150 लीटर साफ पानी',
      estimatedCostPerAcre: 210, // ₹ 210
      safetyWaitPeriodDays: 14,
      preparationInstructions: {
        en: 'Dissolve Thiamethoxam in 1 liter clean water first in a plastic bucket, then add Hexaconazole and stir well before pouring into the knapsack spray pump.',
        hi: 'पहले बाल्टी में 1 लीटर पानी लेकर 10 ग्राम थियामेथोक्सम पाउडर अच्छी तरह घोलें, फिर 30 मिली हेक्साकोनाज़ोल मिलाकर 15 लीटर टंकी में भरें। शाम 4 बजे के बाद छिड़काव करें।',
        malvi: 'पेल्या बाल्टी में एक लोटा पानी लेई न दवा घोलजो, फिर टंकी में नाखी न सांझ को छिड़काव करजो।',
      },
    },
    dealerAlternative: {
      proprietaryBrand: 'मार्केट डीलर का टॉनिक + 3 दवाइयों का मिश्रण (Dealer Triple Cocktail)',
      marketingPitch: 'दुकानदार का दावा: "यह विदेशी सुपर टॉनिक और महँगी इम्पोर्टेड दवा से 3 दिन में पत्ता गहरा हरा हो जाएगा"',
      estimatedCostPerAcre: 880, // Dealer charges ₹880
      unnecessaryAddons: ['अनावश्यक अमीनो एसिड टॉनिक (₹350)', 'ब्रांडेड मल्टी-कॉम्प्लेक्स स्टीकर (₹180)', 'महंगी मल्टी-केमिकल शीशी (₹350)'],
    },
    netSavingPerAcre: 670, // ₹670 saved per acre!
    audioAdvisoryText: {
      en: 'Diagnosed: Yellow Mosaic spread by whiteflies. Do not buy expensive dealer tonics. Buy generic Thiamethoxam 25 WG and Hexaconazole for only 210 rupees per acre. Mix 10 grams plus 30 ml in one 15-liter pump.',
      hi: 'जांच परिणाम: आपकी सोयाबीन में सफेद मक्खी से फैलने वाला पीला मोज़ेक है। डीलर के 880 रुपये वाले महंगे टॉनिक के बहकावे में न आएं। सहकारी समिति या दुकान से 210 रुपये वाला जेनेरिक थियामेथोक्सम 25% डब्लूजी और हेक्साकोनाज़ोल लें। 15 लीटर पंप में 10 ग्राम थियामेथोक्सम और 30 मिली हेक्साकोनाज़ोल मिलाकर शाम को छिड़कें। आपकी प्रति एकड़ 670 रुपये की सीधी बचत होगी।',
      malvi: 'थारी सोयाबीन में सफेद मच्छर से पीलियो रोग आयो है। लाला जी की महंगी शीशी मत लीजो। सहकारी से 210 रुपिया वालो थियामेथोक्सम पावडर लेई न 15 लीटर टंकी में 10 ग्राम घोली न सांझ को छिड़क देजो। थारे 670 रुपिया बच जावेगा।',
    },
    status: 'completed',
    timestamp: 'आज सुबह 07:15 AM',
    farmerAdoptionChoice: 'adopted_generic',
  },
  {
    id: 'diag-wheat-02',
    cropId: 'wheat',
    cropName: 'गेहूं (Wheat)',
    diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
    localDiseaseName: {
      hi: 'गेहूं का पीला रतुआ / पीला गेरुआ',
      malvi: 'गेहूं की पीली हळदी रोग',
      en: 'Yellow Stripe Rust',
    },
    colloquialTerms: ['हल्दी रोग', 'गेरुआ', 'पीला पाउडर', 'पत्ती पर पीली धारियां'],
    severity: 'critical',
    confidence: 96,
    imageThumbnail: '/src/assets/images/crop_wheat_rust_sample_1793853537802.jpg',
    framingQualityScore: 95,
    symptoms: {
      en: 'Linear yellow-orange stripes of powdery spores parallel to leaf veins. Rubs off yellow on fingers.',
      hi: 'पत्तियों की शिराओं के समानांतर पीले-नारंगी पाउडर की धारियां। हाथ लगाने पर उंगलियों पर पीली हल्दी जैसा पाउडर चिपकता है।',
      malvi: 'पाती पर हळदी जैसी पीली धारियां पड़ी है, हाथ लगावा से पीलो पाऊडर आंगुली पर लागे।',
    },
    genericChemical: {
      activeIngredient: 'Propiconazole 25% EC (प्रोपिकोनाज़ोल २५% ईसी)',
      formulation: 'इमल्सीफायबल कंसंट्रेट (तरल दवा)',
      commercialGenericName: 'प्रोपिकोनाज़ोल २५% ईसी (Generic Propiconazole)',
      dosagePer15LPump: '15 मिली प्रति 15 लीटर पंप (1 मिली प्रति लीटर पानी)',
      dosagePerAcre: '200 मिली प्रति एकड़ (200 लीटर पानी में)',
      waterVolumePerAcre: '200 लीटर पानी',
      estimatedCostPerAcre: 195,
      safetyWaitPeriodDays: 30,
      preparationInstructions: {
        en: 'Mix 15 ml Propiconazole per 15L pump. Ensure full underside leaf coverage. Spray when leaves are dry in morning.',
        hi: 'प्रति 15 लीटर पंप में 15 मिली प्रोपिकोनाज़ोल डालें। तेज धूप निकलने से पहले या दोपहर बाद छिड़कें। पत्ते के नीचे तक दवा पहुंचनी चाहिए।',
        malvi: '15 लीटर टंकी में 15 मिली दवाई नाख जो। पत्ता की निचली बाजू भी दवाई जानी छैवे।',
      },
    },
    dealerAlternative: {
      proprietaryBrand: 'आढ़तिया स्पेशल इम्पोर्टेड कॉम्बो + पीजीआर ग्रोथ प्रमोटर',
      marketingPitch: 'दुकानदार का दावा: "यह 950 रुपये वाला कॉम्बो नहीं डालोगे तो बालियां नहीं भरेंगी"',
      estimatedCostPerAcre: 920,
      unnecessaryAddons: ['अनावश्यक समुद्री शैवाल एक्सट्रैक्ट (₹320)', 'ब्रांडेड प्रोपिकोनाज़ोल भारी मार्जिन (₹400)', 'स्प्रेडर (₹200)'],
    },
    netSavingPerAcre: 725,
    audioAdvisoryText: {
      en: 'Urgent: Yellow stripe rust detected. Do not buy expensive combination tonics. Generic Propiconazole 25 EC costs only 195 rupees per acre and stops rust immediately.',
      hi: 'सावधान: गेहूं में पीला रतुआ है। उंगली पर छूने पर पीला पाउडर आ रहा है। डीलर के 920 रुपये वाले महंगे टॉनिक की जरूरत नहीं है। किसी भी मान्यता प्राप्त दुकान से जेनेरिक प्रोपिकोनाज़ोल 25% ईसी लें जो केवल 195 रुपये प्रति एकड़ में आती है। 15 लीटर पंप में 15 मिली डालकर तुरंत छिड़कें। आपकी 725 रुपये की बचत होगी।',
      malvi: 'गेहूं में पीली हळदी रोग लाग्यो है। लाला जी को 920 रुपियो वालो टॉनिक मत लेजो। सीधा प्रोपिकोनाज़ोल 25 ईसी मांगजो जो 195 रुपिया में आवे है। 15 लीटर टंकी में 15 मिली दवाई मिलाई न आज ही छिड़क दो।',
    },
    status: 'completed',
    timestamp: 'कल शाम 05:40 PM',
    farmerAdoptionChoice: 'adopted_generic',
  },
];

export const MOCK_IRRIGATION_ADVICE: IrrigationRecommendation = {
  status: 'DELAY_PUMPING',
  urgency: 'high',
  headline: {
    en: 'Postpone Pumping: Heavy Rain Expected in 18 Hours',
    hi: 'सिंचाई 48 घंटे टालें: कल भारी बारिश (24 मिमी) का निश्चित अनुमान',
    malvi: 'मोटर मत चलावजो: काल जोरदार पाणी बरसने वालो है',
  },
  detailedAdvice: {
    en: 'Do NOT run your borewell motor tonight. IMD radar shows 24mm localized rainfall arriving tomorrow morning. Soil moisture is currently adequate (62%). Pumping now will waste electricity and cause waterlogging.',
    hi: 'आज रात अपनी ट्यूबवेल मोटर बिल्कुल न चलाएं। मौसम उपग्रह और वेदर मॉडल के अनुसार अगले 18 घंटे में आपके गांव सेमलिया में 24 मिमी अच्छी बारिश होगी। मिट्टी में 62% नमी पहले से है। अभी पानी देने से जड़ें सड़ेंगी और डीजल/बिजली का खर्च बेकार जाएगा।',
    malvi: 'आज रात को ट्यूबल की मोटर मत चलाइजो। काल सुबह थारे खेत में जोरदार पाणी गिरेगा। खेत में 62 टका नमी पेले से ही है। अभी पाणी दियो तो फसल पीली पड़ जावेगी न लाइट को खर्ची फालतू लागेगा।',
  },
  audioPrompt: {
    en: 'Attention: Delay your irrigation. Rain is arriving tomorrow. You will save 380 rupees per acre on pumping costs.',
    hi: 'ध्यान दें: आज रात ट्यूबवेल न चलाएं। कल सुबह 24 मिमी बारिश होने वाली है। सिंचाई टालने से आपके प्रति एकड़ 380 रुपये की बिजली और पम्पिंग खर्च की सीधी बचत होगी।',
    malvi: 'रामेश्वर जी, आज रात मोटर मत चलावजो। काल सुबह जोरदार पाणी बरससी। मोटर नी चलाई न थारे 380 रुपिया प्रति एकड़ बच जावेगा।',
  },
  weatherSummary: {
    rainProbability24h: 88,
    rainProbability48h: 65,
    expectedRainfallMm: 24.5,
    temperatureC: 28,
    humidityPct: 78,
    soilMoistureStatus: 'Adequate',
    soilMoisturePct: 62,
  },
  electricitySlot: {
    slotName: 'रात्रि कृषि स्लॉट (Night Ag Slot)',
    phaseType: '3-Phase Agricultural',
    timeRange: 'रात 11:30 PM से सुबह 05:30 AM (6 घंटे)',
    startHour: 23.5,
    endHour: 5.5,
    isLiveNow: false,
    voltageStatus: 'Normal (415V)',
    upcomingRosterChange: 'सोमवार से दिन का स्लॉट (10:00 AM - 04:00 PM) चालू होगा',
  },
  canalRoster: {
    canalName: 'चंबल उपनहर माइनर 4 (Chambal Sub-Canal Minor 4)',
    isWaterFlowing: false,
    turnDateRange: 'गुरुवार सुबह 6:00 AM से शनिवार शाम 6:00 PM तक पानी छोड़ा जाएगा',
    distanceKm: 0.8,
  },
  dieselOrPowerCostSavedPerAcre: 380, // ₹ 380 saved
  pumpingHoursRecommended: 0,
  lastUpdatedFormatted: 'आज सुबह 06:15 AM पर फील्ड नेटवर्क से सिंक हुआ',
  offlineCachedAt: '04 Nov 2026, 06:15 AM',
};

export const DIALECT_DICTIONARY: {
  colloquial: string;
  technicalTerm: string;
  englishGloss: string;
  cropContext: string;
  recommendedGeneric: string;
}[] = [
  {
    colloquial: 'इल्ली (Illi)',
    technicalTerm: 'Spodoptera litura / Heliothis (चने की सूंडी / फली छेदक)',
    englishGloss: 'Pod borer / Armyworm caterpillar',
    cropContext: 'Soybean / Gram / Cotton',
    recommendedGeneric: 'Emamectin Benzoate 5% SG (80g/acre) or Chlorantraniliprole 18.5% SC (60ml/acre)',
  },
  {
    colloquial: 'माहू / चेपा (Mahu / Chepa)',
    technicalTerm: 'Lipaphis erysimi (माहू कीट)',
    englishGloss: 'Mustard Aphids (sap-sucking pest)',
    cropContext: 'Mustard / Wheat',
    recommendedGeneric: 'Dimethoate 30% EC (250ml/acre) or Imidacloprid 17.8% SL (50ml/acre)',
  },
  {
    colloquial: 'उकठा (Uktha)',
    technicalTerm: 'Fusarium oxysporum (विल्ट / सूखा रोग)',
    englishGloss: 'Vascular Wilt fungus',
    cropContext: 'Gram / Cotton / Pigeon Pea',
    recommendedGeneric: 'Trichoderma viride seed treatment + Carbendazim soil drench',
  },
  {
    colloquial: 'पीलिया / पीलियो (Piliya / Peeliya)',
    technicalTerm: 'Yellow Mosaic Virus or Zinc / Iron Deficiency',
    englishGloss: 'Yellowing / Chlorosis',
    cropContext: 'Soybean / Paddy',
    recommendedGeneric: 'Chelated Zinc spray (1g/L) + Vector control (Thiamethoxam)',
  },
  {
    colloquial: 'सफेद मच्छर / मक्खी (Safed Macchar)',
    technicalTerm: 'Bemisia tabaci (सफेद मक्खी)',
    englishGloss: 'Whitefly (viral vector)',
    cropContext: 'Soybean / Cotton',
    recommendedGeneric: 'Pyriproxyfen 10% EC or Thiamethoxam 25% WG',
  },
  {
    colloquial: 'दीमक (Deemak / Seonk)',
    technicalTerm: 'Microtermes obesi (दीमक कीट)',
    englishGloss: 'Termites attacking root crown',
    cropContext: 'Wheat / Sugarcane',
    recommendedGeneric: 'Chlorpyriphos 20% EC with irrigation water (1 Liter/acre)',
  },
];

export const INITIAL_VALIDATION_METRICS: ValidationMetrics = {
  readableCaptureRate: 89.4,
  totalPhotosCaptured: 142,
  glareAlertsTriggered: 38,
  dealerBypassRate: 78.5, // 78.5% chose low-cost generic over dealer cocktail!
  chemicalCostSavedRupees: 86450,
  yieldScenarioInteractions: 312,
  scenariosSavedCount: 46,
  trustScoreAvg: 4.6,
  delayedIrrigationAdherenceRate: 84.2, // 84.2% delayed pumping when rain predicted
  dieselPumpSavingsTotalRupees: 54300,
  voiceToTextInputRatio: 86.5, // 86.5% of queries via Voice!
  weeklyRetentionSessions: 4.8,
  colloquialTermMatches: 198,
};
