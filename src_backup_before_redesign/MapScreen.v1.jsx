import { useState, useEffect, useRef } from "react";
import { LOCATIONS } from "@/data/locations";
import { ICONS } from "@/components/NodeIcon";
import PlayerCursor from "@/components/PlayerCursor";
import CornerBrackets from "@/components/CornerBrackets";
import { PIXEL, READ } from "@/lib/fonts";
import SoundToggle from "@/components/SoundToggle";

const MAP_W = 680;
const MAP_H = 420;
const OFFSET_Y = -80; // inner canvas is 580 tall; shift so the node band is centred

// Curved dashed path between each consecutive pair of zones.
const PATHS = LOCATIONS.slice(1).map((b, i) => {
  const a = LOCATIONS[i];
  const dx = (b.mapX - a.mapX) * 0.5;
  return `M${a.mapX},${a.mapY} C${a.mapX + dx},${a.mapY} ${b.mapX - dx},${b.mapY} ${b.mapX},${b.mapY}`;
});

const btn = (color) => ({
  background: "#120300",
  border: `2px solid ${color}`,
  color,
  fontFamily: PIXEL,
  fontSize: 11,
  padding: "10px 14px",
  cursor: "pointer",
  whiteSpace: "nowrap",
});

export default function MapScreen({
  current, snack, visited, explored, onVisitNode, onNavStep, onOpen, onBack,
  shake, hireUnlocked, onHireMe,
}) {
  const loc = LOCATIONS[current];
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const total = LOCATIONS.length - 1; // spawn doesn't count towards XP
  const xp = [...explored].filter((i) => i !== 0).length;

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / MAP_W, (height - 160) / MAP_H, 2));
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // keep the speech bubble on-screen near the map edges
  const bubbleShift = loc.mapX < 150 ? "-18%" : loc.mapX > 540 ? "-82%" : "-50%";

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden flex flex-col justify-between"
      style={{ height: "100vh", background: "#0a0200" }}
    >
      {/* Top bar */}
      <div
        className="relative flex justify-between items-center z-50 flex-shrink-0 gap-3"
        style={{ padding: "12px 18px", background: "#0a0200", borderBottom: "2px solid #3a0800", minHeight: 70 }}
      >
        <div className="flex gap-3 items-center">
          <button onClick={onBack} style={btn("#ff4500")}>◀ CAFÉ</button>
          <div style={{ fontFamily: PIXEL, fontSize: 13, color: "#ff6a2b", textShadow: "0 0 6px #ff2200" }}>
            TRASHI'S WORLD
          </div>
        </div>

        {/* XP bar */}
        <div className="flex items-center gap-2" title="Explore every zone to finish the quest">
          <span style={{ fontFamily: PIXEL, fontSize: 10, color: "#ffcf6e" }}>XP</span>
          <div className="flex gap-[3px]">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 14, height: 14,
                  background: i < xp ? "#ffcf6e" : "#2a0a00",
                  border: "1px solid #5a2000",
                  boxShadow: i < xp ? "0 0 6px #ffb02e" : "none",
                  transition: "background .4s, box-shadow .4s",
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: READ, fontSize: 20, color: "#ffcf6e" }}>{xp}/{total}</span>
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle inline />
          {hireUnlocked && (
            <button onClick={onHireMe} className="pulse-glow" style={btn("#ffcf6e")}>★ HIRE ME</button>
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: PIXEL, fontSize: 9, color: "#b37a4c" }}>AREA</div>
            <div style={{ fontFamily: PIXEL, fontSize: 12, color: loc.color, marginTop: 4, textShadow: `0 0 6px ${loc.color}` }}>
              {loc.name}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className={`flex-1 flex items-center justify-center overflow-hidden relative ${shake ? "shake" : ""}`}>
        <div style={{ width: MAP_W, height: MAP_H, transform: `scale(${scale})`, flexShrink: 0 }} className="relative overflow-hidden">
          <div style={{ position: "absolute", top: OFFSET_Y, left: 0, width: MAP_W, height: 580 }}>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(80,25,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(80,25,0,0.3) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 680 580">
              {PATHS.map((d, i) => (
                <path key={"s" + i} d={d} fill="none" stroke="#1a0300" strokeWidth="7" strokeLinecap="round" />
              ))}
              {PATHS.map((d, i) => (
                <path
                  key={"p" + i} d={d} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8"
                  stroke={visited.has(i + 1) ? LOCATIONS[i + 1].color : "#5a2000"}
                  style={{ transition: "stroke .6s" }}
                />
              ))}
            </svg>

            {/* Fog over unvisited zones */}
            {LOCATIONS.slice(1).map((l) => (
              <div
                key={"fog-" + l.id}
                className="absolute pointer-events-none z-[25]"
                style={{
                  left: l.mapX - 64, top: l.mapY - 60, width: 128, height: 120, borderRadius: 40,
                  background: "radial-gradient(circle, rgba(10,2,0,.92) 40%, rgba(10,2,0,0) 72%)",
                  opacity: visited.has(l.id) ? 0 : 1,
                  transition: "opacity .8s",
                }}
              />
            ))}

            {LOCATIONS.map((l, i) => {
              const Icon = ICONS[l.icon];
              const active = i === current;
              const done = explored.has(i);
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center cursor-pointer z-20 map-node"
                  style={{ left: l.mapX, top: l.mapY, transform: "translate(-50%, -50%)" }}
                  onClick={() => onVisitNode(i)}
                >
                  <div
                    style={{
                      width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#140300",
                      border: `2px solid ${active ? l.color : done ? l.color + "88" : "#5a2000"}`,
                      boxShadow: active ? `0 0 0 3px ${l.color}55, 0 0 18px ${l.color}` : "none",
                      transition: "box-shadow .3s, border-color .3s",
                    }}
                  >
                    <Icon c={l.color} />
                  </div>
                  <div
                    style={{
                      marginTop: 6, fontFamily: READ, fontSize: 16, lineHeight: 1,
                      color: active ? "#fff4e6" : l.color, background: "#0a0200",
                      border: `1px solid ${active ? l.color : "#3a0800"}`, padding: "3px 6px",
                      maxWidth: 104, textAlign: "center",
                    }}
                  >
                    {visited.has(i) ? <>{done && "✓ "}{l.name}</> : "? ? ?"}
                  </div>
                </div>
              );
            })}

            {/* Speech bubble + avatar */}
            <div
              key={current}
              className="absolute z-40 pointer-events-none bubble-in"
              style={{ left: loc.mapX, top: loc.mapY - 64, transform: `translate(${bubbleShift}, -100%)` }}
            >
              <div style={{
                fontFamily: READ, fontSize: 17, color: "#fff4e6", background: "#120300",
                border: `2px solid ${loc.color}`, padding: "4px 8px", whiteSpace: "nowrap",
              }}>
                {current === 0 && snack ? `Enjoy your ${snack}! Walk with ← →` : loc.line}
              </div>
            </div>
            <PlayerCursor x={loc.mapX} y={loc.mapY - 30} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative flex items-center justify-between z-50 gap-2 flex-shrink-0"
        style={{ padding: "12px 18px", background: "#0a0200", borderTop: "2px solid #3a0800", minHeight: 80 }}
      >
        <button disabled={current === 0} onClick={() => onNavStep(-1)} className="disabled:opacity-30" style={btn("#ff4500")}>
          ◀ WALK
        </button>
        <div className="flex flex-col items-center gap-2">
          <button onClick={onOpen} className="pulse-glow" style={{ ...btn(loc.color), fontSize: 12 }}>
            ENTER {loc.name} ▶
          </button>
          <div className="hide-touch" style={{ fontFamily: READ, fontSize: 17, color: "#b37a4c" }}>
            ← → walk · ENTER explore · or click any zone
          </div>
        </div>
        <button disabled={current === LOCATIONS.length - 1} onClick={() => onNavStep(1)} className="disabled:opacity-30" style={btn("#ff4500")}>
          WALK ▶
        </button>
      </div>

      <CornerBrackets />
    </div>
  );
}
