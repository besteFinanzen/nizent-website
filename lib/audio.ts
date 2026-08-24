let ctx: AudioContext | null = null;
let enabled = false;

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    return ctx;
  } catch {
    return null;
  }
}

function blip(freq = 520, dur = 0.07, gain = 0.06) {
  if (!enabled || typeof window === "undefined") return;
  const c = ac();
  if (!c) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  } catch {
    /* noop */
  }
}

export const sfx = {
  get enabled() {
    return enabled;
  },
  init() {
    if (typeof localStorage !== "undefined") {
      enabled = localStorage.getItem("nizent-sound") === "1";
    }
  },
  set(v: boolean) {
    enabled = v;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nizent-sound", v ? "1" : "0");
    }
    if (v) blip(720, 0.09, 0.07);
  },
  hover() {
    blip(480, 0.05, 0.03);
  },
  click() {
    blip(640, 0.07, 0.05);
  },
};
