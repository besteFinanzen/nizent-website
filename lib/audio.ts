let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

let ambientStarted = false;
let ambientFilter: BiquadFilterNode | null = null;
let ambientGain: GainNode | null = null;
let padTimer: ReturnType<typeof setInterval> | null = null;

let mouseAttached = false;
let lastMove = 0;
let lastPos = { x: 0, y: 0 };
let smoothSpeed = 0;
let lastMouseSound = 0;
let currentMood = 0;

let noise: AudioBuffer | null = null;

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
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    return ctx;
  } catch {
    return null;
  }
}

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
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* noop */
  }
}

const MOOD_CUTOFFS = [500, 430, 430, 320, 430, 640];

function startAmbient() {
  const c = ac();
  if (!c || !master || ambientStarted) return;
  ambientStarted = true;
  try {
    const now = c.currentTime;

    ambientFilter = c.createBiquadFilter();
    ambientFilter.type = "lowpass";
    ambientFilter.frequency.value = MOOD_CUTOFFS[Math.max(0, currentMood)];
    ambientFilter.Q.value = 0.7;

    ambientGain = c.createGain();
    ambientGain.gain.value = 0;
    ambientGain.gain.setTargetAtTime(0.05, now, 2.5);
    ambientFilter.connect(ambientGain);
    ambientGain.connect(master);

    const oscs: OscillatorNode[] = [];
    [
      [55, 0.5],
      [82.41, 0.3],
      [110, 0.16],
    ].forEach(([f, v], i) => {
      const o = c.createOscillator();
      o.type = i === 2 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 5;
      const g = c.createGain();
      g.gain.value = v;
      o.connect(g);
      g.connect(ambientFilter!);
      o.start();
      oscs.push(o);
    });

    const lfo = c.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 110;
    lfo.connect(lfoGain);
    lfoGain.connect(ambientFilter.frequency);
    lfo.start();

    const air = c.createBufferSource();
    air.buffer = getNoise(c);
    air.loop = true;
    const airFilter = c.createBiquadFilter();
    airFilter.type = "lowpass";
    airFilter.frequency.value = 700;
    const airGain = c.createGain();
    airGain.gain.value = 0.1;
    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(ambientGain);
    air.start();

    padTimer = setInterval(() => {
      if (!ctx || !master || !enabled) return;
      try {
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = [220, 261.63, 196, 246.94][Math.floor(Math.random() * 4)];
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.011, t + 4);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 9);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + 9.5);
      } catch {
        /* noop */
      }
    }, 12000);

    return () => {
      oscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* noop */
        }
      });
      try {
        lfo.stop();
      } catch {
        /* noop */
      }
      try {
        air.stop();
      } catch {
        /* noop */
      }
    };
  } catch {
    /* noop */
  }
}

function stopAmbient() {
  if (padTimer) {
    clearInterval(padTimer);
    padTimer = null;
  }
  ambientStarted = false;
  try {
    if (ctx && ambientGain) {
      ambientGain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    }
  } catch {
    /* noop */
  }
  ambientGain = null;
  ambientFilter = null;
}

function onMouseMove(e: MouseEvent) {
  if (!enabled || !ctx || !master) return;
  const now = performance.now();
  const dt = now - lastMove;
  if (dt < 16) return;
  const dx = e.clientX - lastPos.x;
  const dy = e.clientY - lastPos.y;
  lastPos = { x: e.clientX, y: e.clientY };
  lastMove = now;
  const speed = (Math.hypot(dx, dy) / Math.max(dt, 1)) * 1000;
  smoothSpeed = smoothSpeed * 0.75 + speed * 0.25;

  if (now - lastMouseSound < 80 || smoothSpeed < 260) return;
  lastMouseSound = now;

  const vol = Math.min(0.03, (smoothSpeed - 260) / 14000);
  if (vol <= 0.002) return;

  try {
    const pan = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    const src = ctx.createBufferSource();
    src.buffer = getNoise(ctx);
    src.playbackRate.value = 0.9 + Math.random() * 0.25;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = Math.min(2600, 700 + smoothSpeed * 1.1);
    bp.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    src.connect(bp);
    bp.connect(g);
    g.connect(panner);
    panner.connect(master);
    src.start(ctx.currentTime, Math.random() * 1.5, 0.16);
  } catch {
    /* noop */
  }
}

function attachMouse() {
  if (mouseAttached || typeof window === "undefined") return;
  mouseAttached = true;
  window.addEventListener("mousemove", onMouseMove, { passive: true });
}

function enableAudio() {
  const c = ac();
  if (!c || !master) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  master.gain.setTargetAtTime(1, c.currentTime, 0.4);
  startAmbient();
  attachMouse();
}

function disableAudio() {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  setTimeout(() => {
    if (!enabled) stopAmbient();
  }, 900);
}

export const sfx = {
  get enabled() {
    return enabled;
  },
  init() {
    if (typeof localStorage !== "undefined") {
      enabled = localStorage.getItem("nizent-sound") === "1";
    }
    if (enabled) enableAudio();
  },
  set(v: boolean) {
    enabled = v;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nizent-sound", v ? "1" : "0");
    }
    if (v) {
      enableAudio();
      tone(392, 0.12, 0.03);
      tone(523.25, 0.14, 0.03, 0.09);
      tone(659.25, 0.2, 0.032, 0.18);
    } else {
      tone(523.25, 0.1, 0.025);
      tone(349.23, 0.16, 0.025, 0.08);
      disableAudio();
    }
  },
  hover(pitch = 480) {
    tone(pitch, 0.05, 0.02);
  },
  click() {
    tone(523.25, 0.06, 0.032);
    tone(784, 0.09, 0.026, 0.05);
  },
  nav() {
    if (!enabled || !ctx || !master) return;
    try {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = getNoise(ctx);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(2200, t);
      lp.frequency.exponentialRampToValueAtTime(250, t + 0.35);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.035, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      src.connect(lp);
      lp.connect(g);
      g.connect(master);
      src.start(t, Math.random(), 0.4);
    } catch {
      /* noop */
    }
  },
  setMood(i: number) {
    currentMood = i;
    if (!ctx || !ambientFilter) return;
    const cutoff = MOOD_CUTOFFS[i] ?? MOOD_CUTOFFS[0];
    try {
      ambientFilter.frequency.setTargetAtTime(cutoff, ctx.currentTime, 1.5);
    } catch {
      /* noop */
    }
  },
};
