/**
 * Offline-First Storage Service
 * Resilient caching for weak 4G at field edges, cracked screens, and shared devices
 */

import {
  DEFAULT_FARMER_PROFILE,
  INITIAL_DIAGNOSES,
  INITIAL_VALIDATION_METRICS,
  MOCK_IRRIGATION_ADVICE,
} from '../data/mockData';
import {
  DiseaseDiagnosis,
  FarmerProfile,
  IrrigationRecommendation,
  Language,
  SavedYieldScenario,
  Season,
  ValidationMetrics,
} from '../types';

const STORAGE_KEYS = {
  LANGUAGE: 'kisan_lang',
  SEASON: 'kisan_season',
  SUNLIGHT_MODE: 'kisan_sunlight_mode',
  PROFILE: 'kisan_farmer_profile',
  DIAGNOSES: 'kisan_diagnoses_list',
  SAVED_SCENARIOS: 'kisan_saved_scenarios',
  IRRIGATION_CACHE: 'kisan_irrigation_cache',
  OFFLINE_QUEUE: 'kisan_offline_upload_queue',
  METRICS: 'kisan_validation_metrics',
  IRRIGATION_LOGS: 'kisan_irrigation_adherence_logs',
};

export interface OfflineUploadItem {
  id: string;
  cropId: string;
  cropName: string;
  imageBlobUrl: string;
  timestamp: string;
  status: 'pending_in_queue' | 'uploading' | 'completed';
}

export const storageService = {
  getLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (stored as Language) || 'hi';
    } catch {
      return 'hi';
    }
  },

  setLanguage(lang: Language): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // Ignored
    }
  },

  getSeason(): Season {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEASON);
      return (stored as Season) || 'kharif';
    } catch {
      return 'kharif';
    }
  },

  setSeason(season: Season): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SEASON, season);
    } catch {
      // Ignored
    }
  },

  getSunlightMode(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.SUNLIGHT_MODE) === 'true';
    } catch {
      return false;
    }
  },

  setSunlightMode(active: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUNLIGHT_MODE, active ? 'true' : 'false');
    } catch {
      // Ignored
    }
  },

  getFarmerProfile(): FarmerProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : DEFAULT_FARMER_PROFILE;
    } catch {
      return DEFAULT_FARMER_PROFILE;
    }
  },

  saveFarmerProfile(profile: FarmerProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Ignored
    }
  },

  getDiagnoses(): DiseaseDiagnosis[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DIAGNOSES);
      return stored ? JSON.parse(stored) : INITIAL_DIAGNOSES;
    } catch {
      return INITIAL_DIAGNOSES;
    }
  },

  saveDiagnosis(diagnosis: DiseaseDiagnosis): void {
    try {
      const current = this.getDiagnoses();
      const updated = [diagnosis, ...current.filter((d) => d.id !== diagnosis.id)];
      localStorage.setItem(STORAGE_KEYS.DIAGNOSES, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  },

  updateAdoptionChoice(
    id: string,
    choice: 'adopted_generic' | 'bought_dealer_cocktail' | 'no_chemical'
  ): void {
    try {
      const list = this.getDiagnoses().map((item) =>
        item.id === id ? { ...item, farmerAdoptionChoice: choice } : item
      );
      localStorage.setItem(STORAGE_KEYS.DIAGNOSES, JSON.stringify(list));

      // Update validation metrics
      const metrics = this.getValidationMetrics();
      if (choice === 'adopted_generic') {
        metrics.dealerBypassRate = Math.min(
          100,
          Number((metrics.dealerBypassRate * 0.98 + 2).toFixed(1))
        );
        metrics.chemicalCostSavedRupees += 670;
      }
      this.saveValidationMetrics(metrics);
    } catch {
      // Ignored
    }
  },

  getSavedScenarios(): SavedYieldScenario[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_SCENARIOS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveScenario(scenario: SavedYieldScenario): void {
    try {
      const current = this.getSavedScenarios();
      const updated = [scenario, ...current.filter((s) => s.id !== scenario.id)];
      localStorage.setItem(STORAGE_KEYS.SAVED_SCENARIOS, JSON.stringify(updated));

      // Increment metric
      const metrics = this.getValidationMetrics();
      metrics.scenariosSavedCount += 1;
      this.saveValidationMetrics(metrics);
    } catch {
      // Ignored
    }
  },

  deleteScenario(id: string): void {
    try {
      const filtered = this.getSavedScenarios().filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_SCENARIOS, JSON.stringify(filtered));
    } catch {
      // Ignored
    }
  },

  getIrrigationCache(): IrrigationRecommendation {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.IRRIGATION_CACHE);
      return stored ? JSON.parse(stored) : MOCK_IRRIGATION_ADVICE;
    } catch {
      return MOCK_IRRIGATION_ADVICE;
    }
  },

  saveIrrigationCache(advice: IrrigationRecommendation): void {
    try {
      localStorage.setItem(STORAGE_KEYS.IRRIGATION_CACHE, JSON.stringify(advice));
    } catch {
      // Ignored
    }
  },

  getOfflineQueue(): OfflineUploadItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addToOfflineQueue(item: OfflineUploadItem): void {
    try {
      const current = this.getOfflineQueue();
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([...current, item]));
    } catch {
      // Ignored
    }
  },

  clearOfflineQueue(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    } catch {
      // Ignored
    }
  },

  getValidationMetrics(): ValidationMetrics {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.METRICS);
      return stored ? JSON.parse(stored) : INITIAL_VALIDATION_METRICS;
    } catch {
      return INITIAL_VALIDATION_METRICS;
    }
  },

  saveValidationMetrics(metrics: ValidationMetrics): void {
    try {
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
    } catch {
      // Ignored
    }
  },

  logIrrigationAdherence(adhered: boolean, reason?: string): void {
    try {
      const metrics = this.getValidationMetrics();
      if (adhered) {
        metrics.dieselPumpSavingsTotalRupees += 380;
        metrics.delayedIrrigationAdherenceRate = Math.min(
          99,
          Number((metrics.delayedIrrigationAdherenceRate * 0.95 + 5).toFixed(1))
        );
      }
      this.saveValidationMetrics(metrics);

      // Save log entry
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.IRRIGATION_LOGS) || '[]');
      logs.unshift({
        timestamp: new Date().toISOString(),
        adhered,
        reason: reason || (adhered ? 'Delayed pumping per rain alert' : 'Irrigated anyway'),
      });
      localStorage.setItem(STORAGE_KEYS.IRRIGATION_LOGS, JSON.stringify(logs.slice(0, 30)));
    } catch {
      // Ignored
    }
  },
};
