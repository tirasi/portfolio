import { useState, useEffect } from "react";
import WorldMap from "./components/WorldMap";

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

// ─── Typewriter intro screen ─────────────────────────────────────────────────
const IntroScreen = ({ onDone }) => {
  const MSG = "I turned my portfolio into a video game because PDFs weren't dramatic enough.";
  const [displayed, setDisplayed] = useState("");
  const [ready, setReady] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(MSG.slice(0, i));
      if (i >= MSG.length) { clearInterval(iv); setReady(true); }
    }, 45);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const iv = setInterval(() => setBlink(b => !b), 600);
    return () => clearInterval(iv);
  }, [ready]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[200] cursor-pointer"
      style={{ background: "#000", padding: 24, gap: 28 }}
      onClick={ready ? onDone : undefined}
    >
      <CRTOverlay />
      {/* Corner accents */}
      {[["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]].map(([v, h]) => (
        <div key={v + h} className="absolute pointer-events-none" style={{
          [v]: 8, [h]: 8, width: 16, height: 16,
          borderTop: v === "top" ? "2px solid #ff2200" : "none", borderBottom: v === "bottom" ? "2px solid #ff2200" : "none",
          borderLeft: h === "left" ? "2px solid #ff2200" : "none", borderRight: h === "right" ? "2px solid #ff2200" : "none"
        }} />
      ))}
      <div style={{
        background: "#0a0000", border: "2px solid #ff4500", padding: "18px 22px", maxWidth: 640,
        boxShadow: "4px 4px 0 #5a0000", textAlign: "center"
      }}>
        <p style={{
          fontFamily: "'Press Start 2P',monospace", fontSize: 17, color: "#ff8c00", lineHeight: 2.2,
          textShadow: "0 0 6px #ff4500", margin: 0, minHeight: 180
        }}>
          {displayed}<span style={{ opacity: displayed.length >= MSG.length ? 1 : 1 }}>▌</span>
        </p>
      </div>
      {ready && (
        <p style={{
          fontFamily: "'Press Start 2P',monospace", fontSize: 16, color: "#8B0000",
          opacity: blink ? 1 : 0, transition: "opacity 0.2s"
        }}>
          ▶ CLICK ANYWHERE TO CONTINUE
        </p>
      )}
    </div>
  );
};

// ─── Torch ───────────────────────────────────────────────────────────────────
const Torch = ({ style }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => { const iv = setInterval(() => setFrame(f => (f + 1) % 4), 220); return () => clearInterval(iv); }, []);
  const flames = [
    <><rect x="6" y="2" width="4" height="4" fill="#ff8c00" /><rect x="4" y="4" width="8" height="4" fill="#ff4500" /><rect x="6" y="8" width="4" height="2" fill="#ff6600" /></>,
    <><rect x="7" y="0" width="2" height="4" fill="#ffcc00" /><rect x="5" y="4" width="6" height="4" fill="#ff6600" /><rect x="6" y="8" width="4" height="2" fill="#ff4500" /></>,
    <><rect x="5" y="2" width="6" height="4" fill="#ff4500" /><rect x="4" y="6" width="8" height="4" fill="#ff6600" /><rect x="5" y="10" width="6" height="2" fill="#ff8c00" /></>,
    <><rect x="6" y="1" width="4" height="3" fill="#ffcc00" /><rect x="5" y="4" width="6" height="5" fill="#ff6600" /><rect x="6" y="9" width="4" height="2" fill="#ff4500" /></>,
  ];
  return (
    <div className="absolute flex flex-col items-center" style={{ imageRendering: "pixelated", ...style }}>
      <div className="absolute" style={{
        width: 28, height: 28, borderRadius: "50%",
        background: frame % 2 === 0 ? "rgba(255,100,0,0.35)" : "rgba(255,160,0,0.25)",
        filter: "blur(6px)", top: -4, left: "50%", transform: "translateX(-50%)", transition: "background 0.2s"
      }} />
      <svg width="14" height="18" viewBox="0 0 16 20" style={{ imageRendering: "pixelated" }}>
        {flames[frame]}
        <rect x="6" y="12" width="4" height="8" fill="#8B4513" />
      </svg>
    </div>
  );
};

// ─── Girl pixel avatar ────────────────────────────────────────────────────────
const GirlAvatar = ({ onClick, hovered, onHover, onLeave }) => {
  const [bob, setBob] = useState(0);
  useEffect(() => { const iv = setInterval(() => setBob(b => (b + 1) % 4), 420); return () => clearInterval(iv); }, []);
  return (
    <div className="relative flex flex-col items-center cursor-pointer select-none"
      onClick={onClick} onMouseEnter={onHover} onMouseLeave={onLeave}
      style={{ transform: `translateY(${bob < 2 ? 0 : 1}px)`, transition: "transform 0.4s ease" }}>
      {hovered && (
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: "0 0 30px 14px rgba(255,80,0,0.45), 0 0 60px 24px rgba(255,140,0,0.18)",
          borderRadius: "50%", zIndex: 1
        }} />
      )}
      <svg width="68" height="88" viewBox="0 0 17 22" style={{
        imageRendering: "pixelated", zIndex: 2,
        filter: hovered ? "drop-shadow(0 0 6px rgba(255,80,0,0.9))" : "none", transition: "filter 0.3s"
      }}>
        {/* Hair back */}
        <rect x="3" y="2" width="11" height="10" fill="#3a1a00" />
        <rect x="2" y="5" width="2" height="8" fill="#3a1a00" />
        <rect x="13" y="5" width="2" height="8" fill="#3a1a00" />
        <rect x="2" y="13" width="2" height="2" fill="#2a1000" />
        <rect x="13" y="13" width="2" height="2" fill="#2a1000" />
        <rect x="4" y="1" width="9" height="3" fill="#5a2a00" />
        <rect x="3" y="2" width="11" height="2" fill="#5a2a00" />
        <rect x="4" y="1" width="3" height="2" fill="#6a3300" />
        {/* Face */}
        <rect x="4" y="3" width="9" height="6" fill="#f5c5a0" />
        <rect x="5" y="5" width="2" height="2" fill={hovered ? "#ff4400" : "#220011"} />
        <rect x="10" y="5" width="2" height="2" fill={hovered ? "#ff4400" : "#220011"} />
        <rect x="5" y="5" width="1" height="1" fill="white" opacity="0.8" />
        <rect x="10" y="5" width="1" height="1" fill="white" opacity="0.8" />
        <rect x="5" y="4" width="2" height="1" fill="#220011" opacity="0.4" />
        <rect x="10" y="4" width="2" height="1" fill="#220011" opacity="0.4" />
        <rect x="8" y="7" width="1" height="1" fill="#daa080" />
        <rect x="6" y="8" width="5" height="1" fill="#e08070" />
        <rect x="7" y="8" width="3" height="1" fill="#ff9988" />
        {/* Hoodie — narrow waist */}
        <rect x="2" y="9" width="13" height="3" fill="#8B0000" />
        <rect x="5" y="9" width="7" height="2" fill="#6a0000" />
        <rect x="4" y="12" width="9" height="5" fill="#8B0000" />
        <rect x="5" y="14" width="7" height="1" fill="#6a0000" />
        <rect x="5" y="15" width="7" height="2" fill="#6a0000" />
        <rect x="7" y="9" width="1" height="4" fill="#cc2200" />
        <rect x="9" y="9" width="1" height="4" fill="#cc2200" />
        <rect x="1" y="9" width="3" height="6" fill="#8B0000" />
        <rect x="13" y="9" width="3" height="6" fill="#8B0000" />
        <rect x="1" y="14" width="3" height="1" fill="#6a0000" />
        <rect x="13" y="14" width="3" height="1" fill="#6a0000" />
        <rect x="1" y="15" width="2" height="2" fill="#f5c5a0" />
        <rect x="14" y="15" width="2" height="2" fill="#f5c5a0" />
        {/* Lower body */}
        <rect x="5" y="17" width="7" height="2" fill="#3a0000" />
        <rect x="4" y="18" width="9" height="1" fill="#4a0a00" />
        <rect x="5" y="19" width="3" height="2" fill="#1a0a00" />
        <rect x="9" y="19" width="3" height="2" fill="#1a0a00" />
        <rect x="4" y="20" width="4" height="1" fill="#330000" />
        <rect x="9" y="20" width="4" height="1" fill="#330000" />
        <rect x="5" y="20" width="1" height="1" fill="#550000" />
        <rect x="10" y="20" width="1" height="1" fill="#550000" />
      </svg>
      <div style={{ width: 32, height: 6, background: "rgba(0,0,0,0.55)", borderRadius: "50%", marginTop: 2, filter: "blur(2px)" }} />
    </div>
  );
};

// ─── Dialogue bubble ──────────────────────────────────────────────────────────
const DialogueBubble = () => {
  const [dots, setDots] = useState(0);
  useEffect(() => { const iv = setInterval(() => setDots(d => (d + 1) % 4), 500); return () => clearInterval(iv); }, []);
  return (
    <div className="flex flex-col items-center mb-2">
      <div style={{
        background: "#0a0000", border: "2px solid #ff4500", padding: "12px 20px",
        boxShadow: "3px 3px 0 #7a0000", maxWidth: 420
      }}>
        <p style={{
          fontFamily: "'Press Start 2P',monospace", fontSize: 16.5, color: "#ff8c00",
          lineHeight: 1.9, textAlign: "center", textShadow: "0 0 6px #ff4500", margin: 0
        }}>
          Click here to<br />know about me{".".repeat(dots)}
        </p>
      </div>
      <div style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "14px solid #ff4500" }} />
    </div>
  );
};

// ─── Warning bar ──────────────────────────────────────────────────────────────
const WarningBar = () => (
  <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 px-3">
    <div style={{
      background: "#0a0000", border: "2px solid #ff2200", padding: "10px 20px",
      boxShadow: "2px 2px 0 #5a0000", maxWidth: 760
    }}>
      <p style={{
        fontFamily: "'Press Start 2P',monospace", fontSize: 15, color: "#ff2200",
        textAlign: "center", lineHeight: 1.9, margin: 0, textShadow: "0 0 4px #ff0000"
      }}>
        ⚠ WARNING: Excessive clicking may<br />lead to hiring decisions. ⚠
      </p>
    </div>
  </div>
);

// ─── Main spawn screen ────────────────────────────────────────────────────────
const SpawnRoom = ({ onEnterWorld }) => {
  const [hovered, setHovered] = useState(false);
  const [ambOp, setAmbOp] = useState(0.10);
  const [blink, setBlink] = useState(true);

  useEffect(() => { const iv = setInterval(() => setAmbOp(0.07 + Math.random() * 0.08), 200); return () => clearInterval(iv); }, []);
  useEffect(() => { const iv = setInterval(() => setBlink(b => !b), 650); return () => clearInterval(iv); }, []);

  const tiles = [], bricks = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 18; c++) tiles.push({ key: `${r}-${c}`, dark: (r + c) % 2 === 0 });
  for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) bricks.push({ key: `${r}-${c}`, alt: r % 3 === 0 });

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "100vh", background: "#000" }}>
      {/* Wall */}
      <div className="absolute top-0 left-0 right-0" style={{
        height: "55%", display: "grid",
        gridTemplateColumns: "repeat(14,1fr)", gridTemplateRows: "repeat(6,1fr)", overflow: "hidden"
      }}>
        {bricks.map(b => <div key={b.key} style={{ background: b.alt ? "#190400" : "#120200", border: "1px solid #090100" }} />)}
      </div>
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "35%", display: "grid",
        gridTemplateColumns: "repeat(18,1fr)", gridTemplateRows: "repeat(6,1fr)",
        transform: "perspective(180px) rotateX(18deg)", transformOrigin: "bottom center"
      }}>
        {tiles.map(t => <div key={t.key} style={{ background: t.dark ? "#1a0000" : "#0f0000", border: "0.5px solid #250800" }} />)}
      </div>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        transition: "background 0.2s",
        background: `radial-gradient(ellipse 60% 40% at 50% 62%, rgba(255,80,0,${ambOp.toFixed(3)}) 0%, transparent 70%)`
      }} />
      {/* Status */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between z-20 pointer-events-none">
        <div style={{ background: "#0a0000", border: "2px solid #8B0000", padding: "12px 16px", boxShadow: "2px 2px 0 #3a0000" }}>
          <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 16, color: "#ff4500", margin: "0 0 8px" }}>PLAYER_01</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 15, color: "#888" }}>HP</span>
            <div style={{ display: "flex", gap: 3 }}>
              {[...Array(8)].map((_, i) => <div key={i} style={{ width: 15, height: 15, background: i < 6 ? "#ff2200" : "#3a0000", border: "0.5px solid #5a0000" }} />)}
            </div>
          </div>
        </div>
        <div style={{ background: "#0a0000", border: "2px solid #8B0000", padding: "12px 16px", textAlign: "right", boxShadow: "2px 2px 0 #3a0000" }}>
          <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 15, color: "#888", margin: "0 0 8px" }}>LOCATION</p>
          <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 16, color: "#ff8c00", margin: 0 }}>SPAWN ROOM</p>
        </div>
      </div>
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 flex justify-center z-20 pointer-events-none" style={{ marginTop: 50 }}>
        <div style={{ background: "#0a0000", border: "2px solid #ff2200", padding: "14px 28px", boxShadow: "6px 6px 0 #5a0000" }}>
          <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 19, color: "#ff4500", textShadow: "0 0 8px #ff2200", letterSpacing: 2, margin: 0 }}>⚔ PORTFOLIO ⚔</p>
        </div>
      </div>
      {/* Torches */}
      <Torch style={{ top: "18%", left: "10%", zIndex: 10 }} />
      <Torch style={{ top: "18%", right: "10%", zIndex: 10 }} />
      <Torch style={{ top: "22%", left: "28%", zIndex: 10 }} />
      <Torch style={{ top: "22%", right: "28%", zIndex: 10 }} />
      {/* Avatar center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ paddingBottom: "6%" }}>
        <DialogueBubble />
        <GirlAvatar onClick={onEnterWorld} hovered={hovered} onHover={() => setHovered(true)} onLeave={() => setHovered(false)} />
      </div>
      <WarningBar />
      {/* Press start */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-20 pointer-events-none" style={{ opacity: blink ? 1 : 0, transition: "opacity 0.2s" }}>
        <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 16, color: "#8B0000", letterSpacing: 1, margin: 0 }}>▶ CLICK AVATAR TO START ◀</p>
      </div>
      {/* Corners */}
      {[["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]].map(([v, h]) => (
        <div key={v + h} className="absolute pointer-events-none z-30" style={{
          [v]: 6, [h]: 6, width: 16, height: 16,
          borderTop: v === "top" ? "2px solid #ff2200" : "none", borderBottom: v === "bottom" ? "2px solid #ff2200" : "none",
          borderLeft: h === "left" ? "2px solid #ff2200" : "none", borderRight: h === "right" ? "2px solid #ff2200" : "none"
        }} />
      ))}
    </div>
  );
};

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("intro"); // intro | fade | spawn | world
  const [opacity, setOpacity] = useState(1);

  const handleIntroDone = () => {
    setOpacity(0);
    setTimeout(() => { setPhase("spawn"); setOpacity(1); }, 900);
  };
  const handleEnterWorld = () => {
    setOpacity(0);
    setTimeout(() => { setPhase("world"); setOpacity(1); }, 600);
  };
  const handleBack = () => {
    setOpacity(0);
    setTimeout(() => { setPhase("spawn"); setOpacity(1); }, 400);
  };

  return (
    <>
      <CRTOverlay />
      <div style={{ opacity, transition: "opacity 0.8s", minHeight: "100vh" }}>
        {phase === "intro" && <IntroScreen onDone={handleIntroDone} />}
        {phase === "spawn" && <SpawnRoom onEnterWorld={handleEnterWorld} />}
        {phase === "world" && <WorldMap onBack={handleBack} />}
      </div>
    </>
  );
}
