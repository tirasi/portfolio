import { useState, useEffect, useRef } from "react";
import { LOCATIONS } from "@/data/locations";
import { ICONS } from "@/components/NodeIcon";
import PlayerCursor from "@/components/PlayerCursor";
import CornerBrackets from "@/components/CornerBrackets";
import SoundToggle from "@/components/SoundToggle";
import { VendingSprite } from "@/components/VendingMachine";
import { PIXEL, READ } from "@/lib/fonts";

export const MAP_W = 680;
const MAP_H = 420;
const OFFSET_Y = -80; // inner canvas is 580 tall; the visible band is y 80..500
export const VEND = { x: 648, y: 440 };
export const XP_PER_ROOM = 100;

const PATHS = LOCATIONS.slice(1).map((b, i) => {
  const a = LOCATIONS[i];
  const dx = (b.mapX - a.mapX) * 0.5;
  return `M${a.mapX},${a.mapY} C${a.mapX + dx},${a.mapY} ${b.mapX - dx},${b.mapY} ${b.mapX},${b.mapY}`;
});

const btn = (color) => ({
  background: "#120300", border: `2px solid ${color}`, color, fontFamily: PIXEL, fontSize: 11,
  padding: "10px 14px", cursor: "pointer", whiteSpace: "nowrap",
});

export default function MapScreen({
  nearIdx, avatar, airborne, snack, visited, explored, xp, level, levelPct,
  onMapClick, onNodeClick, onVendingClick, nearVending, onOpen, onJumpStep, onBack,
  shake, hireUnlocked, onHireMe, pops = [],
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [logOpen, setLogOpen] = useState(false);
  const loc = nearIdx != null ? LOCATIONS[nearIdx] : null;
  const rooms = LOCATIONS.filter((l) => l.id !== 0);
  const done = rooms.filter((l) => explored.has(l.id)).length;

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / MAP_W, (height - 160) / MAP_H, 2));
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // click anywhere on the map -> jump there (in map coordinates)
  const handleMapClick = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const k = r.width / MAP_W;
    onMapClick({ x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k });
  };

  const bubble = airborne ? null
    : loc ? (loc.id === 0 && snack ? `Enjoy your ${snack}!` : loc.line)
    : nearVending ? "Tired? Grab a snack! (V)"
    : null;
  const bubbleShift = avatar.x < 150 ? "-18%" : avatar.x > 540 ? "-82%" : "-50%";

  return (
    <div ref={wrapperRef} className="relative w-full overflow-hidden flex flex-col justify-between" style={{ height: "100vh", background: "#0a0200" }}>
      {/* ── top bar ── */}
      <div className="relative flex justify-between items-center z-50 flex-shrink-0 gap-3 flex-wrap" style={{ padding: "10px 16px", background: "#0a0200", borderBottom: "2px solid #3a0800", minHeight: 70 }}>
        <div className="flex gap-3 items-center">
          <button onClick={onBack} style={btn("#ff4500")}>◀ CAFÉ</button>
          <div style={{ fontFamily: PIXEL, fontSize: 13, color: "#ff6a2b", textShadow: "0 0 6px #ff2200" }}>TRASHI'S WORLD</div>
        </div>

        {/* XP + level */}
        <div className="flex items-center gap-3" title={`${XP_PER_ROOM} XP per new room, +10 per vending snack`}>
          <span style={{ fontFamily: PIXEL, fontSize: 10, color: "#0a0200", background: "#ffcf6e", padding: "5px 6px" }}>LV {level}</span>
          <div style={{ width: 150, height: 14, background: "#2a0a00", border: "2px solid #5a2000", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: `${levelPct}%`, background: "linear-gradient(90deg,#ffb02e,#ffcf6e)", boxShadow: "0 0 8px #ffb02e", transition: "width .5s" }} />
          </div>
          <span style={{ fontFamily: READ, fontSize: 22, color: "#ffcf6e" }}>{xp} XP</span>
        </div>

        <div className="flex items-center gap-3">
          {/* rooms visited tracker */}
          <div className="relative">
            <button onClick={() => setLogOpen((o) => !o)} style={btn("#7dff9a")} aria-expanded={logOpen}>📜 ROOMS {done}/{rooms.length}</button>
            {logOpen && (
              <div className="quest-log reveal">
                <div style={{ fontFamily: PIXEL, fontSize: 10, color: "#7dff9a", marginBottom: 8 }}>QUEST LOG</div>
                {rooms.map((l) => {
                  const st = explored.has(l.id) ? "done" : visited.has(l.id) ? "seen" : "new";
                  return (
                    <button key={l.id} className="ql-row" onClick={() => { setLogOpen(false); onNodeClick(l.id, true); }}>
                      <span style={{ color: st === "done" ? "#7dff9a" : st === "seen" ? "#ffcf6e" : "#6a4a3a", width: 22 }}>{st === "done" ? "✓" : st === "seen" ? "◐" : "○"}</span>
                      <span style={{ color: l.color, flex: 1, textAlign: "left" }}>{l.name}</span>
                      <span style={{ color: "#8a6a50" }}>{st === "done" ? `+${XP_PER_ROOM}` : "jump ↗"}</span>
                    </button>
                  );
                })}
                <div style={{ height: 8, background: "#2a0a00", marginTop: 10 }}><div style={{ height: "100%", width: `${(done / rooms.length) * 100}%`, background: "#7dff9a" }} /></div>
                <div style={{ fontFamily: READ, fontSize: 17, color: "#8a6a50", marginTop: 6 }}>✓ explored · ◐ visited · ○ not yet</div>
              </div>
            )}
          </div>
          <SoundToggle inline />
          {hireUnlocked && <button onClick={onHireMe} className="pulse-glow" style={btn("#ffcf6e")}>★ HIRE ME</button>}
          <div style={{ textAlign: "right", minWidth: 110 }}>
            <div style={{ fontFamily: PIXEL, fontSize: 9, color: "#b37a4c" }}>AREA</div>
            <div style={{ fontFamily: PIXEL, fontSize: 11, color: loc ? loc.color : "#8a6a50", marginTop: 4 }}>{loc ? loc.name : nearVending ? "SNACK STOP" : "WANDERING"}</div>
          </div>
        </div>
      </div>

      {/* ── map ── */}
      <div className={`flex-1 flex items-center justify-center overflow-hidden relative ${shake ? "shake" : ""}`}>
        <div style={{ width: MAP_W, height: MAP_H, transform: `scale(${scale})`, flexShrink: 0 }} className="relative overflow-hidden">
          <div ref={canvasRef} onClick={handleMapClick} style={{ position: "absolute", top: OFFSET_Y, left: 0, width: MAP_W, height: 580, cursor: "crosshair" }}>
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(80,25,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(80,25,0,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 680 580">
              {PATHS.map((d, i) => <path key={"s" + i} d={d} fill="none" stroke="#1a0300" strokeWidth="7" strokeLinecap="round" />)}
              {PATHS.map((d, i) => (
                <path key={"p" + i} d={d} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8"
                  stroke={visited.has(i + 1) ? LOCATIONS[i + 1].color : "#5a2000"} style={{ transition: "stroke .6s" }} />
              ))}
            </svg>

            {LOCATIONS.slice(1).map((l) => (
              <div key={"fog-" + l.id} className="absolute pointer-events-none z-[25]"
                style={{ left: l.mapX - 64, top: l.mapY - 60, width: 128, height: 120, borderRadius: 40, background: "radial-gradient(circle, rgba(10,2,0,.92) 40%, rgba(10,2,0,0) 72%)", opacity: visited.has(l.id) ? 0 : 1, transition: "opacity .8s" }} />
            ))}

            {LOCATIONS.map((l, i) => {
              const Icon = ICONS[l.icon];
              const here = i === nearIdx;
              const isDone = explored.has(i);
              return (
                <div key={i} className="absolute flex flex-col items-center cursor-pointer z-20 map-node"
                  style={{ left: l.mapX, top: l.mapY, transform: "translate(-50%, -50%)" }}
                  onClick={(e) => { e.stopPropagation(); onNodeClick(i); }}>
                  <div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "#140300",
                    border: `2px solid ${here ? l.color : isDone ? l.color + "88" : "#5a2000"}`, boxShadow: here ? `0 0 0 3px ${l.color}55, 0 0 18px ${l.color}` : "none", transition: "box-shadow .3s, border-color .3s" }}>
                    <Icon c={l.color} />
                  </div>
                  <div style={{ marginTop: 6, fontFamily: READ, fontSize: 16, lineHeight: 1, color: here ? "#fff4e6" : l.color, background: "#0a0200",
                    border: `1px solid ${here ? l.color : "#3a0800"}`, padding: "3px 6px", maxWidth: 104, textAlign: "center" }}>
                    {visited.has(i) ? <>{isDone && "✓ "}{l.name}</> : "? ? ?"}
                  </div>
                  {i > 0 && <div style={{ position: "absolute", top: -14, right: -14, fontFamily: PIXEL, fontSize: 8, color: "#0a0200", background: l.color, padding: "2px 4px" }}>{i + 1}</div>}
                </div>
              );
            })}

            {/* vending machine */}
            <div className="absolute z-20 cursor-pointer flex flex-col items-center" style={{ left: VEND.x, top: VEND.y, transform: "translate(-50%, -100%)" }}
              onClick={(e) => { e.stopPropagation(); onVendingClick(); }} title="Vending machine (V)">
              <VendingSprite glow={nearVending} />
              <div style={{ fontFamily: READ, fontSize: 14, color: "#ff8fc8", background: "#0a0200", padding: "0 4px", marginTop: 2 }}>SNACKS</div>
            </div>

            {/* speech bubble + avatar */}
            {bubble && (
              <div key={bubble} className="absolute z-40 pointer-events-none bubble-in" style={{ left: avatar.x, top: avatar.y - 40, transform: `translate(${bubbleShift}, -100%)` }}>
                <div style={{ fontFamily: READ, fontSize: 17, color: "#fff4e6", background: "#120300", border: `2px solid ${loc ? loc.color : "#ff8fc8"}`, padding: "4px 8px", whiteSpace: "nowrap" }}>{bubble}</div>
              </div>
            )}
            {pops.map((p) => (
              <div key={p.id} className="absolute z-50 pointer-events-none xp-pop" style={{ left: p.x, top: p.y, fontFamily: PIXEL, fontSize: 11, color: p.color || "#ffcf6e", textShadow: "2px 2px 0 #000" }}>{p.text}</div>
            ))}
            <PlayerCursor x={avatar.x} y={avatar.y - (airborne?.lift || 0)} airborne={airborne ? { shadowDy: airborne.lift } : null} />
          </div>
        </div>
      </div>

      {/* ── bottom bar ── */}
      <div className="relative flex items-center justify-between z-50 gap-2 flex-shrink-0" style={{ padding: "10px 16px", background: "#0a0200", borderTop: "2px solid #3a0800", minHeight: 80 }}>
        <button onClick={() => onJumpStep(-1)} style={btn("#ff4500")}>◀ JUMP</button>
        <div className="flex flex-col items-center gap-2">
          {loc ? (
            <button onClick={onOpen} className="pulse-glow" style={{ ...btn(loc.color), fontSize: 12 }}>ENTER {loc.name} ▶</button>
          ) : nearVending ? (
            <button onClick={onVendingClick} className="pulse-glow" style={{ ...btn("#ff8fc8"), fontSize: 12 }}>USE VENDING MACHINE ▶</button>
          ) : (
            <div style={{ fontFamily: PIXEL, fontSize: 10, color: "#8a6a50", padding: "12px 0" }}>WALK OR JUMP TO A ROOM</div>
          )}
          <div className="hide-touch map-keys">
            <span className="mk">WASD</span> walk <span className="mk">SPACE</span> hop <span className="mk">CLICK</span> / <span className="mk">1-8</span> jump <span className="mk">ENTER</span> enter <span className="mk">V</span> snacks
          </div>
        </div>
        <button onClick={() => onJumpStep(1)} style={btn("#ff4500")}>JUMP ▶</button>
      </div>

      <CornerBrackets />
    </div>
  );
}
