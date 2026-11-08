import { useState, useEffect } from "react";
import WorldMap from "./components/WorldMap";
import QuickView from "./components/QuickView";
import CafeSpawn, { describeOrder } from "./components/CafeSpawn";
import SoundToggle from "./components/SoundToggle";
import { PIXEL, READ } from "./lib/fonts";
import { PROFILE } from "./data/locations";
import { useResumeAvailable } from "./lib/useResumeAvailable";

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } };

// ─── CRT scanline overlay ────────────────────────────────────────────────────
const CRTOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50"
    style={{
      background:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      mixBlendMode: "multiply",
    }}
  />
);

// ─── Typewriter intro + start menu ───────────────────────────────────────────
const IntroScreen = ({ onPlay, onQuick }) => {
  const MSG = "I turned my portfolio into a video game because PDFs weren't dramatic enough.";
  const seen = safeGet("seenIntro") === "1";
  const [displayed, setDisplayed] = useState(seen ? MSG : "");
  const [ready, setReady] = useState(seen);
  const [sel, setSel] = useState(0);
  const resumeOk = useResumeAvailable();

  const options = [
    { label: "▶ PLAY", hint: "explore my world", act: onPlay },
    { label: "⚡ QUICK VIEW", hint: "plain one-page version", act: onQuick },
    ...(resumeOk ? [{ label: "⬇ RESUME PDF", hint: "download", act: () => { window.location.href = PROFILE.resume; } }] : []),
  ];

  useEffect(() => {
    if (ready) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(MSG.slice(0, i));
      if (i >= MSG.length) { clearInterval(iv); setReady(true); safeSet("seenIntro", "1"); }
    }, 40);
    return () => clearInterval(iv);
  }, [ready]);

  useEffect(() => {
    const onKey = (e) => {
      if (!ready) { setDisplayed(MSG); setReady(true); safeSet("seenIntro", "1"); return; }
      if (e.key === "ArrowDown" || e.key === "s") setSel((v) => (v + 1) % options.length);
      else if (e.key === "ArrowUp" || e.key === "w") setSel((v) => (v - 1 + options.length) % options.length);
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); options[sel].act(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[200]"
      style={{ background: "#000", padding: 24, gap: 26 }}
      onClick={!ready ? () => { setDisplayed(MSG); setReady(true); safeSet("seenIntro", "1"); } : undefined}
    >
      <CRTOverlay />
      <div style={{ background: "#0a0000", border: "2px solid #ff4500", padding: "18px 22px", maxWidth: 640, boxShadow: "4px 4px 0 #5a0000", textAlign: "center" }}>
        <p style={{ fontFamily: PIXEL, fontSize: 16, color: "#ff8c00", lineHeight: 2.1, textShadow: "0 0 6px #ff4500", margin: 0, minHeight: 140 }}>
          {displayed}<span className="blink">▌</span>
        </p>
      </div>

      {!ready && <p style={{ fontFamily: READ, fontSize: 20, color: "#8a5a3a" }}>press any key to skip</p>}

      {ready && (
        <div className="flex flex-col gap-3 reveal" style={{ minWidth: 320 }}>
          {options.map((o, i) => (
            <button
              key={o.label}
              onMouseEnter={() => setSel(i)}
              onClick={o.act}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                background: i === sel ? "#2a0800" : "#0a0000",
                border: `2px solid ${i === sel ? "#ffb02e" : "#5a1a00"}`,
                boxShadow: i === sel ? "0 0 14px #ff4500aa" : "none",
                padding: "12px 16px", cursor: "pointer", transition: "all .15s",
              }}
            >
              <span style={{ fontFamily: PIXEL, fontSize: 13, color: i === sel ? "#ffcf6e" : "#ff6a2b" }}>{o.label}</span>
              <span style={{ fontFamily: READ, fontSize: 18, color: "#b37a4c" }}>{o.hint}</span>
            </button>
          ))}
          <div style={{ fontFamily: READ, fontSize: 18, color: "#6a4a3a", textAlign: "center" }}>↑ ↓ choose · ENTER select</div>
        </div>
      )}
    </div>
  );
};

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("intro"); // intro | spawn (café) | world | quick
  const [order, setOrder] = useState(null);
  const [startZone, setStartZone] = useState(null); // a café cat can drop you straight into a project
  const [opacity, setOpacity] = useState(1);

  const go = (next, ms = 500) => {
    setOpacity(0);
    setTimeout(() => { setPhase(next); setOpacity(1); window.scrollTo(0, 0); }, ms);
  };

  return (
    <>
      {phase !== "quick" && phase !== "spawn" && <CRTOverlay />}
      <div style={{ opacity, transition: "opacity 0.5s", minHeight: "100vh" }}>
        {phase === "intro" && <IntroScreen onPlay={() => go("spawn")} onQuick={() => go("quick", 300)} />}
        {phase === "spawn" && <CafeSpawn order={order} onOrder={setOrder} onEnterWorld={(zone) => { setStartZone(typeof zone === "number" ? zone : null); go("world", 400); }} />}
        {phase === "world" && <WorldMap key={startZone ?? "map"} startZone={startZone} snack={order ? describeOrder(order) : null} onBack={() => go("spawn", 300)} onQuickView={() => go("quick", 300)} />}
        {phase === "quick" && <QuickView onPlay={() => go("spawn")} />}
      </div>
      {(phase === "intro" || phase === "spawn") && <SoundToggle />}
    </>
  );
}
