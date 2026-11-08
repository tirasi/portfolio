// Pixel-art scene that changes as the visitor scrolls through a zone.
//   stage:    which scene to show ("scroll" | "katana" | "boss" | "trophy" | "chest")
//   p:        0..1 progress through the current section (drives the animation)
//   g:        0..1 progress through the whole page (drives parallax)
const clamp = (v) => Math.max(0, Math.min(1, v));

function Hero({ x = 22, y = 68, attack = false }) {
  return (
    <g transform={`translate(${x},${y}) scale(2)`}>
      <rect x="3" y="0" width="5" height="1" fill="#5a2a00" />
      <rect x="2" y="1" width="7" height="4" fill="#f5c5a0" />
      <rect x="2" y="0" width="7" height="2" fill="#3a1a00" />
      <rect x="3" y="2" width="2" height="1" fill="#220011" />
      <rect x="6" y="2" width="2" height="1" fill="#220011" />
      <rect x="3" y="4" width="5" height="4" fill="#8B0000" />
      <rect x="1" y="5" width="2" height="3" fill="#8B0000" />
      <rect x={attack ? 9 : 8} y={attack ? 4 : 5} width="2" height="3" fill="#8B0000" />
      <rect x="3" y="8" width="2" height="3" fill="#1a0a00" />
      <rect x="6" y="8" width="2" height="3" fill="#1a0a00" />
      <rect x="0" y="5" width="1" height="5" fill="#b00000" opacity="0.8" />
    </g>
  );
}

function ScrollStage({ p, c }) {
  const w = 8 + 70 * clamp(p * 1.4);
  const lines = [0.9, 0.7, 0.85, 0.55, 0.75];
  return (
    <g>
      <rect x="62" y="54" width={w} height="40" fill="#e8d3a8" />
      <rect x="62" y="54" width={w} height="2" fill="#c9b080" />
      {lines.map((f, i) => (
        <rect key={i} x="68" y={61 + i * 6} width={Math.max(0, (w - 12) * f)} height="2" fill="#7a5a30" />
      ))}
      <rect x={62 + w * 0.55} y="84" width="6" height="6" fill={c} opacity={p > 0.6 ? 1 : 0} />
      <rect x="57" y="51" width="6" height="46" fill="#a07840" />
      <rect x={60 + w} y="51" width="6" height="46" fill="#a07840" />
      <rect x="57" y="51" width="6" height="2" fill="#5a3a10" />
      <rect x={60 + w} y="51" width="6" height="2" fill="#5a3a10" />
    </g>
  );
}

function KatanaStage({ p, c }) {
  const out = clamp(p * 1.25);
  const blade = 54 * out;
  const sheathX = 100;
  const hiltX = sheathX - blade - 16;
  return (
    <g>
      {/* sheath */}
      <rect x={sheathX} y="80" width="52" height="5" fill="#2a0c10" />
      <rect x={sheathX + 14} y="80" width="2" height="5" fill="#c9a24a" />
      <rect x={sheathX + 40} y="80" width="2" height="5" fill="#c9a24a" />
      <rect x={sheathX + 50} y="80" width="2" height="5" fill="#c9a24a" />
      {/* exposed blade */}
      <rect x={sheathX - blade} y="81" width={blade} height="3" fill="#e8f2ff" />
      <rect x={sheathX - blade} y="81" width={blade} height="1" fill="#ffffff" />
      <rect x={sheathX - blade} y="84" width={blade} height="1" fill={c} opacity="0.7" />
      {/* tsuba + hilt */}
      <rect x={hiltX + 14} y="78" width="2" height="9" fill="#c9a24a" />
      <rect x={hiltX} y="80" width="14" height="5" fill="#1a0a0a" />
      {[0, 4, 8].map((d) => <rect key={d} x={hiltX + 1 + d} y="80" width="2" height="5" fill="#6a1010" />)}
      {/* glint + slash arc when fully drawn */}
      {out > 0.92 && (
        <>
          <rect x={sheathX - blade - 2} y="77" width="2" height="11" fill="#fff" className="twinkle" />
          <path d="M70,40 Q120,55 150,100" stroke={c} strokeWidth="2" fill="none" opacity="0.9" className="slash-arc" />
          <path d="M70,40 Q120,55 150,100" stroke="#fff" strokeWidth="0.8" fill="none" className="slash-arc" />
        </>
      )}
    </g>
  );
}

function BossStage({ p, c }) {
  const k = clamp((p - 0.45) / 0.4);
  const body = (
    <g>
      <rect x="104" y="58" width="30" height="36" fill="#3a0a1e" />
      <rect x="100" y="66" width="38" height="20" fill="#3a0a1e" />
      <rect x="104" y="52" width="4" height="6" fill="#5a1030" />
      <rect x="130" y="52" width="4" height="6" fill="#5a1030" />
      <rect x="110" y="66" width="5" height="5" fill="#ff3355" className="twinkle" />
      <rect x="123" y="66" width="5" height="5" fill="#ff3355" className="twinkle" />
      <rect x="112" y="80" width="14" height="3" fill="#1a0008" />
      <rect x="114" y="83" width="2" height="2" fill="#fff" />
      <rect x="122" y="83" width="2" height="2" fill="#fff" />
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id="bossTop"><polygon points="90,40 150,40 150,62 90,90" /></clipPath>
        <clipPath id="bossBot"><polygon points="90,90 150,62 150,110 90,110" /></clipPath>
      </defs>
      <text x="119" y="46" textAnchor="middle" fontSize="9" fontFamily="'VT323', monospace" fill="#ff7a7a" opacity={1 - k}>
        BUG
      </text>
      <g clipPath="url(#bossTop)" transform={`translate(${-6 * k},${-10 * k}) rotate(${-8 * k} 120 70)`} opacity={1 - k * 0.9}>{body}</g>
      <g clipPath="url(#bossBot)" transform={`translate(${6 * k},${8 * k})`} opacity={1 - k * 0.9}>{body}</g>
      {p > 0.4 && p < 0.95 && (
        <>
          <line x1="88" y1="94" x2="150" y2="58" stroke={c} strokeWidth="3" opacity={0.9 - k * 0.6} />
          <line x1="88" y1="94" x2="150" y2="58" stroke="#fff" strokeWidth="1" opacity={1 - k * 0.6} />
        </>
      )}
      {k > 0.85 && (
        <text x="118" y="104" textAnchor="middle" fontSize="10" fontFamily="'VT323', monospace" fill="#ffcf6e" className="pop-in">
          DEFEATED!
        </text>
      )}
    </g>
  );
}

function TrophyStage({ p }) {
  const rise = (1 - clamp(p * 1.5)) * 42;
  return (
    <g>
      <g transform={`translate(0,${rise})`}>
        <rect x="104" y="54" width="26" height="4" fill="#ffd36e" />
        <rect x="106" y="58" width="22" height="14" fill="#ffcf6e" />
        <rect x="108" y="58" width="4" height="12" fill="#fff1c2" />
        <rect x="100" y="58" width="6" height="3" fill="#ffcf6e" />
        <rect x="128" y="58" width="6" height="3" fill="#ffcf6e" />
        <rect x="100" y="61" width="3" height="6" fill="#ffcf6e" />
        <rect x="131" y="61" width="3" height="6" fill="#ffcf6e" />
        <rect x="114" y="72" width="6" height="8" fill="#e0a83a" />
        <rect x="108" y="80" width="18" height="5" fill="#a8702a" />
        <rect x="114" y="62" width="6" height="5" fill="#fff" opacity="0.8" />
      </g>
      {p > 0.5 &&
        [[96, 50], [138, 48], [92, 72], [142, 70], [117, 42]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="3" height="3" fill="#fff6c8" className="twinkle" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
    </g>
  );
}

function ChestStage({ p, c }) {
  const open = clamp(p * 1.4);
  const coins = [[106, "#ffcf6e"], [114, c], [122, "#ffcf6e"], [130, c]];
  return (
    <g>
      <rect x="98" y="88" width="42" height="8" fill="#000" opacity="0.3" />
      {coins.map(([x, col], i) => (
        <rect key={i} x={x} y={74 - open * (24 + i * 5)} width="5" height="5" fill={col} opacity={open} />
      ))}
      <rect x="100" y="70" width="38" height="4" fill="#fff3b0" opacity={open * 0.9} />
      <rect x="98" y="72" width="42" height="22" fill="#6a3c12" />
      <rect x="98" y="72" width="42" height="3" fill="#c9a24a" />
      <rect x="98" y="91" width="42" height="3" fill="#c9a24a" />
      <rect x="116" y="76" width="6" height="7" fill="#c9a24a" />
      <g transform={`rotate(${-75 * open} 98 72)`}>
        <rect x="98" y="62" width="42" height="10" fill="#7a4818" />
        <rect x="98" y="62" width="42" height="2" fill="#c9a24a" />
        <rect x="116" y="68" width="6" height="4" fill="#c9a24a" />
      </g>
    </g>
  );
}

const STAGES = { scroll: ScrollStage, katana: KatanaStage, boss: BossStage, trophy: TrophyStage, chest: ChestStage };

export default function StoryScene({ stage, p, g, color, label, step, total }) {
  const Stage = STAGES[stage] || ScrollStage;
  const c = color;
  return (
    <div className="relative w-full h-full" style={{ border: `2px solid ${c}55`, background: "#050100", overflow: "hidden" }}>
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" shapeRendering="crispEdges" style={{ display: "block" }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c} stopOpacity="0.28" />
            <stop offset="0.7" stopColor="#0a0204" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="160" height="120" fill="url(#sky)" />
        {/* stars */}
        {[[12, 10], [40, 18], [70, 8], [100, 16], [146, 12], [28, 30], [88, 28]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="1" height="1" fill="#fff" opacity="0.7" className="twinkle" style={{ animationDelay: `${i * 0.37}s` }} />
        ))}
        {/* moon */}
        <circle cx={130 - g * 6} cy="22" r="8" fill={c} opacity="0.6" />
        <circle cx={133 - g * 6} cy="19" r="7" fill="#0a0204" opacity="0.85" />
        {/* parallax mountains */}
        <polygon transform={`translate(${-g * 18},0)`} points="-10,82 20,52 40,68 66,40 92,66 118,46 150,70 190,58 190,120 -10,120" fill="#1a0810" />
        <polygon transform={`translate(${-g * 40},0)`} points="-10,92 30,74 60,86 90,70 130,88 170,74 200,90 200,120 -10,120" fill="#22090c" />
        {/* ground */}
        <rect x="0" y="96" width="160" height="24" fill="#130406" />
        <rect x="0" y="96" width="160" height="1" fill={c} opacity="0.6" />
        {/* stage props */}
        <Hero attack={stage === "boss" && p > 0.4} />
        <g key={stage} className="scene-fade">
          <Stage p={p} c={c} />
        </g>
        {/* embers */}
        {[20, 55, 90, 125, 150].map((x, i) => (
          <rect key={i} x={x} y="100" width="1" height="1" fill={c} className="ember" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 10, top: 8, fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: c, background: "#0a0200cc", padding: "5px 7px", border: `1px solid ${c}66` }}>
        STAGE {step}/{total} · {label}
      </div>
    </div>
  );
}
