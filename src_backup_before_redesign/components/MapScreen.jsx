"use client";
import { useState, useEffect, useRef } from "react";
import { LOCATIONS, MAP_PATHS } from "@/data/locations";
import { NODE_ICONS } from "@/components/NodeIcon";
import PlayerCursor from "@/components/PlayerCursor";
import CornerBrackets from "@/components/CornerBrackets";

function StepDots({ current, total, visited }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-[11px] h-[11px]"
          style={{
            border: "1.5px solid #8B0000",
            background:
              i === current
                ? "#ff4500"
                : visited.has(i)
                  ? "#8B0000"
                  : "#0a0200",
            boxShadow: i === current ? "0 0 0 1px #ff8c00" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function MapScreen({ current, visited, onVisitNode, onNavStep, onBack }) {
  const loc = LOCATIONS[current];
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Subtract header (65px) and footer (85px)
        const availableHeight = height - 150;
        const s = Math.min(width / 680, availableHeight / 420);
        // Limit max scale to 2.0 to allow high-DPI screens to zoom in more
        setScale(Math.min(s, 2.0));
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden flex flex-col justify-between"
      style={{ height: "100vh", background: "#0a0200", fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Top bar */}
      <div
        className="relative flex justify-between items-center px-3 z-50 flex-shrink-0"
        style={{ padding: "16px 20px", background: "#0a0200", borderBottom: "2px solid #3a0800", height: "65px" }}
      >
        <div style={{ pointerEvents: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "#120300",
                border: "2px solid #8B0000",
                color: "#ff4500",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "11px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              ◀ SPAWN
            </button>
          )}
          <div>
            <div style={{ fontSize: "14px", color: "#ff4500", textShadow: "0 0 4px #ff2200", marginTop: 4 }}>TRASHI's LIFE MAP</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "#884400" }}>AREA</div>
          <div style={{ fontSize: "14px", color: "#ff4500", textShadow: "0 0 4px #ff2200", marginTop: 4 }}>{loc.name}</div>
        </div>
      </div>

      {/* Map Canvas area (flex-1, centered) */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <div
          style={{
            width: 680,
            height: 420, // cropped height
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            flexShrink: 0,
          }}
          className="relative overflow-hidden"
        >
          {/* Internal container shifted up by 80px to center the active node region */}
          <div style={{ position: "absolute", top: -80, left: 0, width: 680, height: 580 }}>
            {/* Grid background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(60,15,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(60,15,0,0.35) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Paths SVG */}
            <svg
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              viewBox="0 0 680 580"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Shadow layer */}
              {MAP_PATHS.map((d, i) => (
                <path key={"shadow-" + i} d={d} fill="none" stroke="#1a0300" strokeWidth="7" strokeLinecap="round" />
              ))}
              {/* Dashed orange paths */}
              {MAP_PATHS.map((d, i) => (
                <path
                  key={"path-" + i}
                  d={d}
                  fill="none"
                  stroke={i < current ? "#ff8c00" : "#ff6600"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="10 8"
                />
              ))}
            </svg>

            {/* Fog patches */}
            {LOCATIONS.slice(1).map((l, i) => (
              <div
                key={"fog-" + (i + 1)}
                className="absolute pointer-events-none z-[18]"
                style={{
                  left: l.mapX - 74,
                  top: l.mapY - 66,
                  width: 148,
                  height: 130,
                  borderRadius: 6,
                  background: "#0a0200",
                  opacity: visited.has(i + 1) ? 0 : 0.75,
                  transition: "opacity 0.7s",
                }}
              />
            ))}

            {/* Location nodes */}
            {LOCATIONS.map((l, i) => {
              const Icon = NODE_ICONS[i];
              const isActive = i === current;
              const isVisited = visited.has(i) && !isActive;
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center cursor-pointer z-20 hover:brightness-125"
                  style={{ left: l.mapX, top: l.mapY, transform: "translate(-50%, -50%)" }}
                  onClick={() => onVisitNode(i)}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      border: isActive
                        ? "2px solid #ff8c00"
                        : isVisited
                          ? "2px solid #663300"
                          : "2px solid #ff4500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#140300",
                      boxShadow: isActive ? "0 0 0 3px #ff4500, 0 0 0 5px #330000" : "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <Icon />
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: "5.5px",
                      color: isActive ? "#ffcc00" : isVisited ? "#664400" : "#ff8c00",
                      textAlign: "center",
                      background: "#0a0200",
                      border: `1px solid ${isActive ? "#ff4500" : "#3a0800"}`,
                      padding: "3px 5px",
                      whiteSpace: "nowrap",
                      maxWidth: 90,
                      lineHeight: 1.7,
                    }}
                  >
                    {l.name.split(" ").slice(0, 2).join("\n")}
                    {l.name.split(" ").length > 2 && (
                      <>
                        <br />
                        {l.name.split(" ").slice(2).join(" ")}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Player cursor */}
            <PlayerCursor x={loc.mapX} y={loc.cursorY} />
          </div>
        </div>
      </div>

      {/* Nav panel */}
      <div
        className="relative flex items-center justify-between z-50 gap-2 flex-shrink-0"
        style={{ padding: "14px 20px", background: "#0a0200", borderTop: "2px solid #3a0800", height: "85px" }}
      >
        <button
          disabled={current === 0}
          onClick={() => onNavStep(-1)}
          className="disabled:opacity-30"
          style={{
            background: "#120300",
            border: "2px solid #8B0000",
            color: "#ff4500",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "12px",
            padding: "10px 16px",
            cursor: current === 0 ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ◀ PREV
        </button>

        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div style={{ fontSize: "13px", color: "#ff8c00", textShadow: "0 0 6px #ff2200", textAlign: "center" }}>
            {loc.name}
          </div>
          <StepDots current={current} total={LOCATIONS.length} visited={visited} />
        </div>

        <button
          disabled={current === LOCATIONS.length - 1}
          onClick={() => onNavStep(1)}
          className="disabled:opacity-30"
          style={{
            background: "#120300",
            border: "2px solid #8B0000",
            color: "#ff4500",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "12px",
            padding: "10px 16px",
            cursor: current === LOCATIONS.length - 1 ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          NEXT ▶
        </button>
      </div>

      <CornerBrackets />
    </div>
  );
}
