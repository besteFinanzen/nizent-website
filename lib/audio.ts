import { settings } from "./settings";
import { SECTION_IDS } from "./sections";

/*
 * Sound engine for the nizent site.
 *
 * Audio graph (built once when sound is enabled):
 *
 *   music buffer source ─▶ musicFilter (lowpass) ┬─▶ musicGain ─▶ master ─▶ compressor ─▶ destination
 *                                                 └─▶ musicRev ─▶ reverb ─▶ reverbWet ─▶ master
 *
 *   UI/interaction sounds ─▶ fxBus ─▶ master   (independent of the music-bed level)
 *   master ─▶ analyser (passive tap, feeds the sound-reactive visuals)
 *
 * The background music bed is intentionally STATIC -it does not change between
 * sections (see settings.audio.music). Interaction (UI) sounds are synthesized
 * on the fly. `sfx.level()` exposes a smoothed {bass,mid,high} readout that the
 * 3D scene uses for subtle reactive glow/particles; it returns zeros when sound
 * is off or the music bed is disabled.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

let currentMoodIdx = 0;
let ambientStarted = false;
const debugNotes = 0;

// ---- graph nodes (rebuilt on each enable) ----
let reverb: ConvolverNode | null = null;
let reverbWet: GainNode | null = null;
let fxBus: GainNode | null = null;
let musicFilter: BiquadFilterNode | null = null;
let musicGain: GainNode | null = null;

let musicSrc: AudioBufferSourceNode | null = null;
let musicBuffer: AudioBuffer | null = null;

// ---- sound-analysis tap (for reactive visuals) ----
let analyser: AnalyserNode | null = null;
let freqData: Uint8Array<ArrayBuffer> | null = null;
const levelState = { bass: 0, mid: 0, high: 0 };

const M = settings.audio.music;
const FX = settings.audio.fx;
const AN = settings.audio.analysis;
const MA = settings.audio.master;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = MA.compressorThreshold;
      comp.ratio.value = MA.compressorRatio;
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    return ctx;
  } catch {
    return null;
  }
}

function makeIR(c: AudioContext, seconds = FX.reverb.seconds, decay = FX.reverb.decay): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

let noise: AudioBuffer | null = null;
function getNoise(c: AudioContext): AudioBuffer {
  if (noise) return noise;
  const len = c.sampleRate * 2;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    d[i] = last * 3.5;
  }
  noise = buf;
  return buf;
}

// ---- graph ----
function buildGraph(c: AudioContext) {
  reverb = c.createConvolver();
  reverb.buffer = makeIR(c);
  reverbWet = c.createGain();
  reverbWet.gain.value = M.reverb;
  reverb.connect(reverbWet);
  reverbWet.connect(master!);

  // analysis tap (passive) for reactive visuals
  analyser = c.createAnalyser();
  analyser.fftSize = AN.fftSize;
  analyser.smoothingTimeConstant = AN.smoothing;
  freqData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
  master!.connect(analyser);

  // interaction / UI sounds bus -independent of the music-bed level
  fxBus = c.createGain();
  fxBus.gain.value = FX.busGain;
  fxBus.connect(master!);

  // background music bed (static -same in every section)
  musicFilter = c.createBiquadFilter();
  musicFilter.type = "lowpass";
  musicFilter.frequency.value = M.cutoff;
  musicFilter.Q.value = 0.7;
  musicGain = c.createGain();
  musicGain.gain.value = 0;
  musicGain.gain.setTargetAtTime(M.gain, c.currentTime, M.fadeInSeconds);
  musicFilter.connect(musicGain);
  musicGain.connect(master!);
  const musicRev = c.createGain();
  musicRev.gain.value = M.reverbSend;
  musicFilter.connect(musicRev);
  musicRev.connect(reverb!);
}

async function loadMusic(c: AudioContext) {
  if (musicBuffer) return musicBuffer;
  const resp = await fetch(M.url);
  const arr = await resp.arrayBuffer();
  musicBuffer = await c.decodeAudioData(arr);
  return musicBuffer;
}

function startAmbient() {
  const c = ac();
  if (!c || !master || ambientStarted) return;
  ambientStarted = true;
  try {
    buildGraph(c);
    // Background music can be disabled entirely via settings.audio.music.enabled.
    if (!M.enabled) return;
    loadMusic(c)
      .then((buf) => {
        if (!ambientStarted || !buf || !musicFilter) return;
        const src = c.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        src.connect(musicFilter);
        src.start();
        musicSrc = src;
      })
      .catch(() => {
        /* music failed to load; site stays silent rather than erroring */
      });
  } catch {
    /* noop */
  }
}

function stopAmbient() {
  ambientStarted = false;
  try {
    if (ctx && musicGain) {
      musicGain.gain.setTargetAtTime(0, ctx.currentTime, M.fadeOutSeconds);
    }
    if (musicSrc) {
      try {
        musicSrc.stop(ctx ? ctx.currentTime + M.fadeOutSeconds + 0.2 : 0);
      } catch {
        /* noop */
      }
      musicSrc = null;
    }
  } catch {
    /* noop */
  }
}

// ---- public sfx API (kept compatible) ----
function tone(freq: number, dur: number, gain: number, delay = 0, type: OscillatorType = "sine") {
  if (!enabled || !ctx || !master) return;
  try {
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(fxBus ?? master);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* noop */
  }
}

function playNotes(notes: { freq: number; dur: number; gain: number; delay: number }[]) {
  for (const n of notes) tone(n.freq, n.dur, n.gain, n.delay);
}

// ---- glockenspiel-style chime (labels / containers on hover) ----
let chimeIdx = 0;
let lastChime = 0;
function playChime(pitch?: number) {
  if (!enabled || !ctx || !master) return;
  try {
    // throttle so rapid mouse movement doesn't machine-gun the bell
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastChime < 70) return;
    lastChime = now;
    const c = ctx;
    const t = c.currentTime;
    const base = pitch ?? FX.chime.scale[chimeIdx % FX.chime.scale.length] ?? FX.chime.scale[0];
    chimeIdx++;
    const env = c.createGain();
    env.gain.setValueAtTime(FX.chime.gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + FX.chime.dur);
    env.connect(fxBus ?? master);
    const partials = FX.chime.partials;
    const pg = FX.chime.partialGains;
    for (let i = 0; i < partials.length; i++) {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = base * partials[i];
      const pgain = c.createGain();
      pgain.gain.value = (pg[i] ?? 1) / partials.length;
      o.connect(pgain);
      pgain.connect(env);
      o.start(t);
      o.stop(t + FX.chime.dur + 0.02);
    }
  } catch {
    /* noop */
  }
}

function enableAudio() {
  const c = ac();
  if (!c || !master) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  master.gain.setTargetAtTime(MA.volume, c.currentTime, MA.fadeInSeconds);
  startAmbient();
}

function disableAudio() {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(0, ctx.currentTime, MA.fadeOutSeconds);
  setTimeout(() => {
    if (!enabled) stopAmbient();
  }, 900);
}

export const sfx = {
  /** Whether sound is currently enabled (persisted in localStorage). */
  get enabled() {
    return enabled;
  },
  /** Read persisted preference and (if on) start the engine. */
  init() {
    if (typeof localStorage !== "undefined") {
      enabled = localStorage.getItem("nizent-sound") === "1";
    }
    if (enabled) enableAudio();
  },
  /** Toggle sound on/off; plays a confirmation chord. */
  set(v: boolean) {
    enabled = v;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nizent-sound", v ? "1" : "0");
    }
    if (v) {
      enableAudio();
      playNotes(FX.toggleOn);
    } else {
      playNotes(FX.toggleOff);
      disableAudio();
    }
  },
  /** Short blip on hover. */
  hover(pitch = FX.hover.freq) {
    tone(pitch, FX.hover.dur, FX.hover.gain);
  },
  /** Two-note confirmation on click. */
  click() {
    playNotes(FX.click);
  },
  /** Glockenspiel-style bell on hover over labels/containers; cycles a pentatonic scale. */
  chime(pitch?: number) {
    playChime(pitch);
  },
  /** Filtered-noise whoosh on section navigation. */
  nav() {
    if (!enabled || !ctx || !master) return;
    try {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = getNoise(ctx);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(FX.nav.freqFrom, t);
      lp.frequency.exponentialRampToValueAtTime(FX.nav.freqTo, t + FX.nav.dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(FX.nav.gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + FX.nav.dur + 0.03);
      src.connect(lp);
      lp.connect(g);
      g.connect(master);
      src.start(t, Math.random(), 0.4);
    } catch {
      /* noop */
    }
  },
  /**
   * Per-section hook. The music bed is static by design, so this currently has
   * no audible effect; it is kept for API compatibility and future use.
   */
  setMood(i: number) {
    currentMoodIdx = Math.max(0, Math.min(SECTION_IDS.length - 1, i));
  },
  /** Debug snapshot. */
  stats() {
    return { notes: debugNotes, mood: currentMoodIdx, running: ambientStarted };
  },
  /**
   * Smoothed 0..1 energy per band, sampled once per frame. Returns zeros when
   * sound is off or the music bed is disabled. Used by the 3D scene for subtle
   * reactive glow/particles.
   */
  level() {
    if (!analyser || !freqData || !enabled || !ambientStarted || !M.enabled) {
      levelState.bass *= AN.levelDecayWhenOff;
      levelState.mid *= AN.levelDecayWhenOff;
      levelState.high *= AN.levelDecayWhenOff;
      return { bass: levelState.bass, mid: levelState.mid, high: levelState.high };
    }
    try {
      analyser.getByteFrequencyData(freqData);
      const n = freqData.length;
      const bassEnd = AN.bassEndBin;
      const midEnd = AN.midEndBin;
      let b = 0;
      let m = 0;
      let h = 0;
      for (let i = 0; i < bassEnd; i++) b += freqData[i];
      for (let i = bassEnd; i < midEnd; i++) m += freqData[i];
      for (let i = midEnd; i < n; i++) h += freqData[i];
      b = b / (bassEnd * 255);
      m = m / ((midEnd - bassEnd) * 255);
      h = h / ((n - midEnd) * 255);
      levelState.bass = levelState.bass * (1 - AN.levelSmoothing) + b * AN.levelSmoothing;
      levelState.mid = levelState.mid * (1 - AN.levelSmoothing) + m * AN.levelSmoothing;
      levelState.high = levelState.high * (1 - AN.levelSmoothing) + h * AN.levelSmoothing;
    } catch {
      /* noop */
    }
    return { bass: levelState.bass, mid: levelState.mid, high: levelState.high };
  },
};
