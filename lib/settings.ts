import raw from "../settings.json";

/**
 * Application configuration.
 *
 * This is the single source of truth for non-secret, deploy-time tunables.
 * It is shared by the Next.js frontend (typed here) and by the mailer service
 * (mailer/server.js reads the same JSON file). Secret values (SMTP password)
 * are intentionally left blank here and supplied via environment variables in
 * production (see mailer/README.md and .env.example).
 *
 * Edit `settings.json` at the repo root to change any of these values.
 */
export interface NoteSpec {
  /** Oscillator frequency in Hz. */
  freq: number;
  /** Note duration in seconds. */
  dur: number;
  /** Peak gain (0..1). */
  gain: number;
  /** Delay before the note starts, in seconds. */
  delay: number;
}

export interface ChimeSpec {
  /** Overall output gain (0..1). */
  gain: number;
  /** Bell decay time in seconds. */
  dur: number;
  /** Frequency multipliers for the bell partials (1 = fundamental). */
  partials: number[];
  /** Relative gain of each partial. */
  partialGains: number[];
  /** Pentatonic scale (Hz) cycled through on successive triggers. */
  scale: number[];
}

export interface Settings {
  site: {
    /** Brand name used in copy/meta. */
    name: string;
    /** Primary domain, used for meta + CORS allow-lists. */
    domain: string;
    /** Canonical site URL (with scheme). */
    url: string;
    /** Endpoint the contact form POSTs to (mailer service). */
    contactApiUrl: string;
  };
  audio: {
    music: {
      /** Master switch for the looping background music bed. */
      enabled: boolean;
      /** Path/URL of the background music file (served from /public). */
      url: string;
      /** Music-bed output gain (0..1). */
      gain: number;
      /** Lowpass cutoff in Hz (brightness of the bed). */
      cutoff: number;
      /** Reverb wet level for the music bed (0..1). */
      reverb: number;
      /** Amount of signal sent from the bed into the reverb (0..1). */
      reverbSend: number;
      /** Fade-in time for the bed when sound is enabled, in seconds. */
      fadeInSeconds: number;
      /** Fade-out time for the bed when sound is disabled, in seconds. */
      fadeOutSeconds: number;
    };
    master: {
      /** Master output volume (compressor input gain target). */
      volume: number;
      /** Fade-in time for master when sound toggles on, in seconds. */
      fadeInSeconds: number;
      /** Fade-out time for master when sound toggles off, in seconds. */
      fadeOutSeconds: number;
      /** Dynamics compressor threshold (dB). */
      compressorThreshold: number;
      /** Dynamics compressor ratio. */
      compressorRatio: number;
    };
    fx: {
      /** Output gain of the interaction/UI sounds bus. */
      busGain: number;
      /** Reverb impulse response length (seconds) and decay exponent. */
      reverb: { seconds: number; decay: number };
      /** Hover blip. */
      hover: NoteSpec;
      /** Click confirmation (two-note chord). */
      click: NoteSpec[];
      /** Section navigation whoosh (filtered noise burst). */
      nav: { gain: number; freqFrom: number; freqTo: number; dur: number };
      /** Chord played when sound is turned on. */
      toggleOn: NoteSpec[];
      /** Chord played when sound is turned off. */
      toggleOff: NoteSpec[];
      /** Glockenspiel-style bell chime for labels/containers on hover. */
      chime: ChimeSpec;
    };
    analysis: {
      /** FFT size for the analyser tap (power of two). */
      fftSize: number;
      /** Analyser time smoothing (0..1). */
      smoothing: number;
      /** First N bins counted as "bass" energy. */
      bassEndBin: number;
      /** Bins up to here counted as "mid" energy. */
      midEndBin: number;
      /** Per-frame smoothing factor for the level() readouts (0..1). */
      levelSmoothing: number;
      /** Per-frame decay applied when audio is off (0..1). */
      levelDecayWhenOff: number;
    };
  };
  visuals: {
    particles: {
      /** Number of sound-reactive ambient particles. */
      count: number;
      /** Inner radius of the particle shell. */
      radiusMin: number;
      /** Outer radius of the particle shell. */
      radiusMax: number;
      /** Base point size (world units). */
      sizeBase: number;
      /** Extra point size added by mid-band energy. */
      sizeBoost: number;
      /** Base particle opacity. */
      opacityBase: number;
      /** Opacity added by high-band energy. */
      opacityHighGain: number;
      /** Opacity added by mid-band energy. */
      opacityMidGain: number;
      /** Slow rotation speed of the particle cloud. */
      driftSpeed: number;
    };
    cube: {
      /** Base emissive intensity of the cube pieces. */
      emissiveBase: number;
      /** Extra emissive intensity added by bass energy. */
      emissiveBoost: number;
      /** Base opacity of the cyan edge lines. */
      edgeOpacityBase: number;
      /** Extra edge opacity added by high-band energy. */
      edgeOpacityBoost: number;
    };
  };
  mail: {
    /** Recipient of contact-form emails. */
    toEmail: string;
    /** From address used in the sent mail. */
    fromEmail: string;
    /** Display name used in the sent mail. */
    fromName: string;
    /** Browser origin allowed to call the API (CORS). */
    allowedOrigin: string;
    /** Name of the hidden honeypot field used to trap bots. */
    honeypotField: string;
    /** Per-IP rate limit. */
    rateLimit: { max: number; windowMs: number };
    /** SMTP transport. Leave user/pass blank and use env vars in production. */
    smtp: { host: string; port: number; secure: boolean; user: string; pass: string };
  };
}

/** Typed, runtime configuration object derived from settings.json. */
export const settings = raw as unknown as Settings;
