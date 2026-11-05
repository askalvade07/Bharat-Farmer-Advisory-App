/**
 * Audio and Speech Service for KisanSeva
 * Supports voice prompts, dialect speech recognition, audio compression simulation,
 * and field sound effects for low-literacy farmers.
 */

class AudioSpeechService {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Speak advisory text in Hindi or English using SpeechSynthesis
   */
  public speak(text: string, lang: 'hi' | 'malvi' | 'en' | 'mr' | 'pa' = 'hi', onEnd?: () => void): void {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this environment');
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice based on language
    if (lang === 'hi' || lang === 'malvi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (lang === 'pa') {
      utterance.lang = 'pa-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.92; // Slightly measured pace for better comprehension under field noise
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Field Sound Effects using Web Audio API (Zero external asset dependencies)
   */
  public playFeedbackSound(type: 'confirm' | 'camera_shutter' | 'alert' | 'mic_start' | 'mic_stop'): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'confirm') {
        // Double pleasant chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'camera_shutter') {
        // Mechanical shutter click sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'alert') {
        // Caution 2-tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(370, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'mic_start') {
        // High ascending blip
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'mic_stop') {
        // Low descending blip
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Speech recognition listener with regional Indian fallbacks
   */
  public startSpeechRecognition(
    lang: 'hi' | 'malvi' | 'en',
    onResult: (transcript: string) => void,
    onError: (err: string) => void
  ): { stop: () => void } {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback simulation for browsers/frames without webkitSpeechRecognition
      onError('NO_SPEECH_API');
      return { stop: () => {} };
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        onResult(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        onError(event.error);
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // Already stopped
          }
        },
      };
    } catch (e) {
      onError(String(e));
      return { stop: () => {} };
    }
  }
}

export const audioSpeechService = new AudioSpeechService();
