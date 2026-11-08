import { useState } from "react";
import { PIXEL, READ } from "@/lib/fonts";
import { sfx } from "@/lib/sfx";

// A snack machine on the world map, for visitors who are tired of reading.
export const VEND_ITEMS = [
  { id: "energy", eat: "Glug glug... energy +100%. I could explore 3 rooms at once now.", label: "Energy Drink", code: "A1", color: "#7ee0c3", line: "Energy restored! You can now read 3 more projects without blinking." },
  { id: "choco", eat: "Chocolate acquired. Happiness +10.", label: "Chocolate Bar", code: "A2", color: "#8a5a3a", line: "Mood +10. Chocolate makes every portfolio look better (this one was already good)." },
  { id: "chips", eat: "*crunch* *crunch* ...okay, worth it.", label: "Masala Chips", code: "A3", color: "#ffcf6e", line: "Crunchy. Loud. Worth it. Just don't get crumbs on the keyboard." },
  { id: "coke", eat: "Ahh. Crisp. Refreshing. Iconic.", label: "Diet Coke", code: "B1", color: "#d9dde2", line: "Diet Coke again? You have a type. Respect." },
  { id: "noodles", eat: "Slurp! 2-minute noodles, 0-minute regrets.", label: "Instant Noodles", code: "B2", color: "#ff9a5a", line: "Ready in 2 minutes, just like the quick view of this portfolio." },
  { id: "nap", eat: "Zzz... *yawn* I'm back and better than ever.", label: "Power Nap", code: "B3", color: "#b49cff", line: "Zzz... 20 minutes later... Refreshed! The projects are still here, don't worry." },
];

export function ItemIcon({ id, color, size = 34 }) {
  const shapes = {
    energy: <><rect x="5" y="1" width="6" height="14" fill={color} /><rect x="5" y="1" width="6" height="2" fill="#aaa" /><rect x="7" y="6" width="2" height="4" fill="#fff" /></>,
    choco: <><rect x="2" y="4" width="12" height="9" fill={color} /><rect x="2" y="4" width="5" height="9" fill="#e8e0d0" />{[0, 1].map((r) => <rect key={r} x="8" y={6 + r * 3} width="5" height="1" fill="#5a3a20" />)}</>,
    chips: <><rect x="3" y="2" width="10" height="12" fill={color} /><rect x="3" y="2" width="10" height="2" fill="#e05a3a" /><rect x="5" y="7" width="6" height="3" fill="#e05a3a" /></>,
    coke: <><rect x="5" y="1" width="6" height="14" fill={color} /><rect x="5" y="6" width="6" height="2" fill="#c8102e" /></>,
    noodles: <><rect x="2" y="6" width="12" height="8" fill="#fff" /><rect x="2" y="6" width="12" height="2" fill={color} /><rect x="5" y="3" width="1" height="4" fill="#ffd36e" /><rect x="9" y="2" width="1" height="5" fill="#ffd36e" /></>,
    nap: <><rect x="2" y="8" width="12" height="5" fill={color} /><rect x="2" y="6" width="5" height="3" fill="#fff" /><text x="11" y="5" fontSize="5" fill="#fff" fontFamily="'VT323', monospace">z</text></>,
  };
  return <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges">{shapes[id]}</svg>;
}

export default function VendingMachine({ onClose, onBuy, bought, onEat, onKeep }) {
  const [dropping, setDropping] = useState(null);
  const [vended, setVended] = useState(null); // the snack waiting in the tray
  const [msg, setMsg] = useState("Tired? Pick a snack. Recruiters drink for free.");

  const buy = (it) => {
    if (dropping || vended) return;
    sfx.play("vend");
    setDropping(it.id);
    setMsg("*clunk* ...");
    setTimeout(() => {
      setDropping(null);
      setVended(it);
      setMsg(it.line);
      onBuy(it);
    }, 900);
  };

  return (
    <div className="absolute inset-0 z-[400] flex items-center justify-center" style={{ background: "rgba(0,0,0,.7)", padding: 16 }} onClick={onClose}>
      <div className="vend reveal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Vending machine">
        <div className="vend-top">
          <span>SNACK-O-MATIC 3000</span>
          <button onClick={onClose} aria-label="close">X</button>
        </div>
        <div className="vend-body">
          <div className="vend-glass">
            {VEND_ITEMS.map((it) => (
              <button key={it.id} className={`vend-slot ${dropping === it.id ? "dropping" : ""}`} onClick={() => buy(it)} disabled={!!dropping}>
                <ItemIcon id={it.id} color={it.color} />
                <span className="vend-code">{it.code}</span>
                <span className="vend-name">{it.label}</span>
                {bought.has(it.id) && <span className="vend-check">✓</span>}
              </button>
            ))}
          </div>
          <div className="vend-side">
            <div className="vend-screen">{msg}</div>
            <div className="vend-coin">
              <div style={{ fontFamily: PIXEL, fontSize: 8, color: "#9a8a7a" }}>CREDIT</div>
              <div style={{ fontFamily: READ, fontSize: 22, color: "#7dff9a" }}>∞</div>
            </div>
            <div style={{ fontFamily: READ, fontSize: 17, color: "#c9b8a8", lineHeight: 1.1 }}>each snack: +10 XP for self-care</div>
          </div>
        </div>
        {vended ? (
          <div className="vend-out reveal">
            <div className="vend-out-item"><ItemIcon id={vended.id} color={vended.color} size={64} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: PIXEL, fontSize: 10, color: "#ffcf6e" }}>VENDED OUT!</div>
              <div style={{ fontFamily: READ, fontSize: 22, color: "#fffaf2", lineHeight: 1.1 }}>Your {vended.label.toLowerCase()} is ready.</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onEat(vended)} className="pulse-glow" style={{ fontFamily: PIXEL, fontSize: 10, background: "#7dff9a", color: "#0a2010", border: "2px solid #2a0a14", padding: "10px 12px", cursor: "pointer", boxShadow: "3px 3px 0 #2a0a14" }}>
                {vended.id === "nap" ? "NAP NOW 😴" : "EAT IT NOW 😋"}
              </button>
              <button onClick={() => { onKeep(vended); setVended(null); setMsg("Saved in your backpack 🎒. Snack responsibly."); }} style={{ fontFamily: READ, fontSize: 18, background: "none", color: "#fffaf2", border: "none", textDecoration: "underline", cursor: "pointer" }}>
                keep it for later
              </button>
            </div>
          </div>
        ) : (
          <div className="vend-tray">{dropping ? "▼ ▼ ▼" : "PICK A SNACK"}</div>
        )}
      </div>
    </div>
  );
}

// tiny pixel sprite for the map
export function VendingSprite({ glow }) {
  return (
    <svg viewBox="0 0 20 30" width="40" height="60" shapeRendering="crispEdges" style={{ filter: glow ? "drop-shadow(0 0 6px #7dff9a)" : "none" }}>
      <rect x="0" y="0" width="20" height="30" fill="#c2557a" />
      <rect x="0" y="0" width="20" height="3" fill="#e06a92" />
      <rect x="2" y="4" width="12" height="18" fill="#bfe8ff" opacity="0.85" />
      {[0, 1, 2].map((r) => [0, 1].map((c) => (
        <rect key={`${r}${c}`} x={3 + c * 6} y={5 + r * 6} width="4" height="4" fill={["#7ee0c3", "#ffcf6e", "#8a5a3a", "#ff9a5a", "#d9dde2", "#b49cff"][r * 2 + c]} />
      )))}
      <rect x="15" y="5" width="4" height="6" fill="#2a2a32" />
      <rect x="16" y="6" width="2" height="2" fill="#7dff9a" className="twinkle" />
      <rect x="15" y="13" width="4" height="2" fill="#ffd36e" />
      <rect x="2" y="24" width="12" height="4" fill="#2a1a20" />
      <rect x="0" y="28" width="20" height="2" fill="#7a2a4a" />
    </svg>
  );
}
