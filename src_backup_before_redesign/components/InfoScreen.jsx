"use client";
import { LOCATIONS } from "@/data/locations";
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
              i === current ? "#ff4500" : visited.has(i) ? "#8B0000" : "#0a0200",
            boxShadow: i === current ? "0 0 0 1px #ff8c00" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function InfoScreen({ current, visited, onClose, onNav }) {
  const loc = LOCATIONS[current];

  return (
    <div
      className="absolute inset-0 z-[100] flex flex-col"
      style={{ background: "#000", fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ padding: "16px 20px", background: "#0a0200", borderBottom: "2px solid #3a0800" }}
      >
        <div>
          <div style={{ fontSize: 15, color: loc.color, textShadow: `0 0 8px ${loc.color}`, letterSpacing: 1 }}>
            {loc.name}
          </div>
          <div style={{ fontSize: "10px", color: "#884400", marginTop: 6 }}>{loc.sub}</div>
        </div>
        <div className="flex gap-4 items-center">
          <div style={{ fontSize: "10px", color: "#884400" }}>
            {current + 1} / {LOCATIONS.length}
          </div>
          <button
            onClick={onClose}
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
            ✕ MAP
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6" style={{ padding: "24px 22px" }}>
        {/* Banner */}
        <div
          style={{
            background: "#0a0200",
            border: `2px solid ${loc.color}`,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 36, color: loc.color }}>{loc.icon}</div>
          <div>
            <div style={{ fontSize: 14, color: loc.color, letterSpacing: 1 }}>{loc.name}</div>
            <div style={{ fontSize: "11px", color: "#664400", marginTop: 6 }}>{loc.sub}</div>
          </div>
        </div>

        {/* Content cards */}
        {loc.sections.map((sec, i) => (
          <div
            key={i}
            style={{ background: "#0a0200", border: "2px solid #3a0800", padding: "20px 24px" }}
          >
            <div
              style={{
                fontSize: "13px",
                color: loc.color,
                marginBottom: 12,
                letterSpacing: 1,
                borderBottom: "1px solid #2a0600",
                paddingBottom: 8,
              }}
            >
              {sec.title}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#884400",
                lineHeight: 2.2,
                whiteSpace: "pre-wrap",
              }}
            >
              {sec.body}
            </div>
          </div>
        ))}

        {/* Edit hint */}
        <div style={{ background: "#050100", border: "1px solid #2a0600", padding: "14px 18px" }}>
          <div style={{ fontSize: "9px", color: "#3a1200", lineHeight: 2 }}>
            ✎ Edit src/data/locations.js to replace placeholder text with your real info.
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div
        className="flex items-center justify-between flex-shrink-0 gap-2"
        style={{ padding: "16px 20px", background: "#0a0200", borderTop: "2px solid #3a0800" }}
      >
        <button
          disabled={current === 0}
          onClick={() => onNav(-1)}
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

        <div className="flex-1 flex justify-center">
          <StepDots current={current} total={LOCATIONS.length} visited={visited} />
        </div>

        <button
          disabled={current === LOCATIONS.length - 1}
          onClick={() => onNav(1)}
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
