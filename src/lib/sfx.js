// Tiny 8-bit sound effects via WebAudio. On by default (browsers only allow
// audio after the visitor's first click/key, which the start menu provides);
// the 🔊 button toggles it.
let enabled = true;
let ctx = null;
const listeners = new Set();

// [frequency, duration, wave]
const PRESETS = {
  step: [440, 0.05, "square"],
  open: [660, 0.12, "square"],
  back: [260, 0.08, "square"],
  unlock: [784, 0.3, "triangle"],
  type: [1200, 0.015, "square"],
};

// little melodies: [frequency, start offset, duration]
const TUNES = {
  // classic platformer "coin": B5 then E6
  coin: [[988, 0, 0.08], [1319, 0.08, 0.32]],
  // rising jump "boing"
  jump: "sweep",
  // vending machine: clunk + chime
  vend: [[180, 0, 0.12], [140, 0.12, 0.12], [1047, 0.3, 0.12], [1319, 0.42, 0.25]],
  // level up arpeggio
  levelup: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.35]],
};

function tone(freq, start, dur, wave = "square", vol = 0.05) {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
  return osc;
}

export const sfx = {
  isEnabled: () => enabled,
  setEnabled(v) {
    enabled = v;
    listeners.forEach((fn) => fn(v));
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  play(type = "step") {
    if (!enabled) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      if (type === "jump") {
        const osc = tone(280, 0, 0.22, "square", 0.045);
        osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.18);
        return;
      }
      if (TUNES[type]) {
        TUNES[type].forEach(([f, s, d]) => tone(f, s, d, "square", 0.045));
        return;
      }
      const [freq, dur, wave] = PRESETS[type] || PRESETS.step;
      const osc = tone(freq, 0, dur, wave);
      if (type === "unlock") osc.frequency.linearRampToValueAtTime(freq * 1.5, ctx.currentTime + dur);
    } catch {
      /* audio not available -- stay silent */
    }
  },
};
