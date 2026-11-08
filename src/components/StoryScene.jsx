// Pixel-art scene that changes as the visitor scrolls through a zone.
// Every project zone has its own backdrop and its own version of each stage:
//   quest -> what I did -> boss -> outcome -> loot
//   stage: "scroll" | "katana" | "boss" | "trophy" | "chest"
//   p:     0..1 progress through the current section (drives the animation)
//   g:     0..1 progress through the whole page (drives parallax)
//   theme: the zone's icon key (archive, station, detective, vault, clinic, ...)
const clamp = (v) => Math.max(0, Math.min(1, v));
const FONT = "'VT323', monospace";
import { Heroine, Heart, PINK } from "@/components/pixel";

const T = ({ x, y, size = 8, fill = "#fff", anchor = "middle", children, ...rest }) => (
  <text x={x} y={y} fontSize={size} fontFamily={FONT} fill={fill} textAnchor={anchor} {...rest}>{children}</text>
);

const Sparkles = ({ pts, fill = "#fff6c8" }) =>
  pts.map(([x, y], i) => (
    <rect key={i} x={x} y={y} width="2" height="2" fill={fill} className="twinkle" style={{ animationDelay: `${i * 0.15}s` }} />
  ));

const Chips = ({ open, colors, x0 = 104, y0 = 72 }) =>
  colors.map((col, i) => (
    <rect key={i} x={x0 + i * 7} y={y0 - open * (22 + i * 5)} width="5" height="5" fill={col} opacity={open} />
  ));

/* ───────────────────────── backdrops ───────────────────────── */
function Mountains({ g }) {
  return (
    <>
      <polygon transform={`translate(${-g * 18},0)`} points="-10,82 20,52 40,68 66,40 92,66 118,46 150,70 190,58 190,120 -10,120" fill="#1a0810" />
      <polygon transform={`translate(${-g * 40},0)`} points="-10,92 30,74 60,86 90,70 130,88 170,74 200,90 200,120 -10,120" fill="#22090c" />
    </>
  );
}

function Shelves({ g }) {
  const cols = ["#3a2266", "#5a2a44", "#22335a", "#4a3a1a", "#2a4a3a"];
  return (
    <g transform={`translate(${-g * 20},0)`}>
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect x="-10" y={34 + row * 15} width="200" height="2" fill="#2a1a10" />
          {Array.from({ length: 28 }).map((_, i) => (
            <rect key={i} x={-8 + i * 7} y={24 + row * 15 + (i % 3)} width="5" height={10 - (i % 3)} fill={cols[(i + row) % 5]} opacity="0.55" />
          ))}
        </g>
      ))}
    </g>
  );
}

function Space({ g, c }) {
  return (
    <>
      {[[20, 40], [50, 60], [80, 48], [110, 70], [140, 40], [30, 80], [150, 82], [64, 30]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#fff" opacity="0.8" className="twinkle" style={{ animationDelay: `${i * 0.23}s` }} />
      ))}
      <circle cx={150 - g * 20} cy="138" r="70" fill={c} opacity="0.18" />
      <circle cx={150 - g * 20} cy="138" r="70" fill="none" stroke={c} strokeOpacity="0.4" />
      <g transform={`translate(${30 - g * 30},34)`}>
        <rect x="0" y="4" width="18" height="4" fill="#3a4a5a" />
        <rect x="6" y="0" width="6" height="12" fill="#5a6a7a" />
        <rect x="8" y="5" width="2" height="2" fill={c} />
      </g>
    </>
  );
}

function City({ g }) {
  const b = [[0, 50, 18], [20, 40, 14], [36, 58, 20], [58, 34, 16], [76, 52, 22], [100, 44, 14], [116, 60, 18], [136, 38, 24]];
  return (
    <>
      <g transform={`translate(${-g * 22},0)`}>
        {b.map(([x, y, w], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={96 - y} fill="#12101e" />
            {Array.from({ length: Math.floor((96 - y) / 7) }).map((_, r) => (
              <rect key={r} x={x + 3 + ((r + i) % 2) * 6} y={y + 4 + r * 7} width="3" height="2" fill="#ffd36e" opacity={(r + i) % 3 === 0 ? 0.7 : 0.15} />
            ))}
          </g>
        ))}
      </g>
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={(i * 23) % 160} y="0" width="1" height="6" fill="#9ab" opacity="0.35" className="rain" style={{ animationDelay: `${(i * 0.13) % 1}s` }} />
      ))}
    </>
  );
}

function Bank({ g, c }) {
  return (
    <g transform={`translate(${-g * 18},0)`}>
      <polygon points="20,40 100,22 180,40" fill="#2a2208" />
      <rect x="20" y="40" width="160" height="4" fill="#3a300c" />
      {[28, 52, 76, 100, 124, 148].map((x) => (
        <g key={x}>
          <rect x={x} y="44" width="8" height="52" fill="#2a2208" />
          <rect x={x + 2} y="44" width="1" height="52" fill={c} opacity="0.25" />
        </g>
      ))}
    </g>
  );
}

function Hospital({ g, c }) {
  return (
    <g transform={`translate(${-g * 20},0)`}>
      <rect x="70" y="30" width="80" height="66" fill="#0e2016" />
      <rect x="102" y="20" width="16" height="12" fill="#0e2016" />
      <rect x="108" y="22" width="4" height="8" fill={c} />
      <rect x="105" y="25" width="10" height="2" fill={c} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={76 + (i % 6) * 12} y={40 + Math.floor(i / 6) * 14} width="6" height="6" fill="#bff5d0" opacity={i % 4 === 0 ? 0.55 : 0.12} />
      ))}
      <rect x="10" y="60" width="40" height="36" fill="#0b1a12" />
    </g>
  );
}

const BACKDROPS = { archive: Shelves, station: Space, detective: City, vault: Bank, clinic: Hospital };

/* ───────────────────────── shared boss ───────────────────────── */
function Boss({ p, c, name, uid, children }) {
  const k = clamp((p - 0.45) / 0.4);
  return (
    <g>
      <defs>
        <clipPath id={`bt-${uid}`}><polygon points="86,30 156,30 156,60 86,92" /></clipPath>
        <clipPath id={`bb-${uid}`}><polygon points="86,92 156,60 156,112 86,112" /></clipPath>
      </defs>
      <T x="120" y="44" size="9" fill="#ff7a7a" opacity={1 - k}>{name}</T>
      <g clipPath={`url(#bt-${uid})`} transform={`translate(${-6 * k},${-10 * k}) rotate(${-8 * k} 120 70)`} opacity={1 - k * 0.9}>{children}</g>
      <g clipPath={`url(#bb-${uid})`} transform={`translate(${6 * k},${8 * k})`} opacity={1 - k * 0.9}>{children}</g>
      {p > 0.4 && p < 0.95 && (
        <>
          <line x1="86" y1="94" x2="152" y2="56" stroke={c} strokeWidth="3" opacity={0.9 - k * 0.6} />
          <line x1="86" y1="94" x2="152" y2="56" stroke="#fff" strokeWidth="1" opacity={1 - k * 0.6} />
        </>
      )}
      {k > 0.85 && (
        <g className="pop-in">
          <T x="120" y="106" size="10" fill="#ffcf6e">DEFEATED!</T>
          <Heart x="146" y="98" fill={PINK} />
        </g>
      )}
    </g>
  );
}

/* ───────────────────────── generic stages (Spawn, Citadel) ───────────────────────── */
function ScrollStage({ p, c }) {
  const w = 8 + 70 * clamp(p * 1.4);
  return (
    <g>
      <rect x="62" y="54" width={w} height="40" fill="#f3dfc0" />
      {[0.9, 0.7, 0.85, 0.55, 0.75].map((f, i) => (
        <rect key={i} x="68" y={61 + i * 6} width={Math.max(0, (w - 12) * f)} height="2" fill="#7a5a30" />
      ))}
      {p > 0.6 && <Heart x={62 + w * 0.55} y="84" fill={c} />}
      <rect x="57" y="51" width="6" height="46" fill="#c08a9a" />
      <rect x={60 + w} y="51" width="6" height="46" fill="#c08a9a" />
    </g>
  );
}

function KatanaStage({ p, c }) {
  const out = clamp(p * 1.25);
  const blade = 54 * out;
  const sx = 100;
  const hx = sx - blade - 16;
  return (
    <g>
      <rect x={sx} y="80" width="52" height="5" fill="#5a1a3a" />
      {[14, 40, 50].map((d) => <rect key={d} x={sx + d} y="80" width="2" height="5" fill="#ffd36e" />)}
      <rect x={sx - blade} y="81" width={blade} height="3" fill="#eef4ff" />
      <rect x={sx - blade} y="81" width={blade} height="1" fill="#fff" />
      <rect x={sx - blade} y="84" width={blade} height="1" fill={c} opacity="0.7" />
      <rect x={hx + 14} y="78" width="2" height="9" fill="#ffd36e" />
      <rect x={hx} y="80" width="14" height="5" fill="#2a0a1a" />
      {[0, 4, 8].map((d) => <rect key={d} x={hx + 1 + d} y="80" width="2" height="5" fill={PINK} />)}
      {/* sakura charm on the hilt */}
      <rect x={hx - 3} y="85" width="1" height="4" fill="#ffd36e" />
      <Heart x={hx - 5} y="89" s={0.8} />
      {out > 0.92 && (
        <>
          <rect x={sx - blade - 2} y="77" width="2" height="11" fill="#fff" className="twinkle" />
          <path d="M70,40 Q120,55 150,100" stroke={c} strokeWidth="2" fill="none" className="slash-arc" />
          <path d="M70,40 Q120,55 150,100" stroke="#fff" strokeWidth="0.8" fill="none" className="slash-arc" />
        </>
      )}
    </g>
  );
}

function Trophy({ p, label }) {
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
        <rect x="106" y="80" width="22" height="7" fill="#a8702a" />
        <Heart x="114.5" y="62" fill="#ff6fae" />
        {label && <T x="117" y="86" size="7" fill="#fff1c2">{label}</T>}
      </g>
      {p > 0.5 && (
        <>
          <Sparkles pts={[[96, 50], [138, 48], [92, 72], [142, 70], [117, 40]]} />
          <Heart x="88" y="56" s={0.9} className="float-up" />
          <Heart x="144" y="60" s={0.9} className="float-up" style={{ animationDelay: ".4s" }} />
        </>
      )}
    </g>
  );
}

function Chest({ p, c, lid = "#7a4818", body = "#6a3c12", band = "#ffd36e" }) {
  const open = clamp(p * 1.4);
  return (
    <g>
      <Chips open={open} colors={["#ffcf6e", c, PINK, c]} />
      <rect x="100" y="70" width="38" height="4" fill="#fff3b0" opacity={open * 0.9} />
      <rect x="98" y="72" width="42" height="22" fill={body} />
      <rect x="98" y="72" width="42" height="3" fill={band} />
      <rect x="98" y="91" width="42" height="3" fill={band} />
      <rect x="116" y="76" width="6" height="7" fill={band} />
      <g transform={`rotate(${-75 * open} 98 72)`}>
        <rect x="98" y="62" width="42" height="10" fill={lid} />
        <rect x="98" y="62" width="42" height="2" fill={band} />
      </g>
    </g>
  );
}

const GENERIC = {
  scroll: ScrollStage,
  katana: KatanaStage,
  boss: (pr) => (
    <Boss {...pr} name="BUG" uid="gen">
      <rect x="104" y="58" width="30" height="36" fill="#3a0a1e" />
      <rect x="110" y="66" width="5" height="5" fill="#ff3355" />
      <rect x="123" y="66" width="5" height="5" fill="#ff3355" />
    </Boss>
  ),
  trophy: (pr) => <Trophy {...pr} />,
  chest: (pr) => <Chest {...pr} />,
};

/* ───────────────────────── THE ARCHIVE · text-to-SQL ───────────────────────── */
const Database = ({ x = 112, y = 58, c, glow = 0 }) => (
  <g>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={x} y={y + i * 11} width="30" height="10" fill="#2a1f47" />
        <rect x={x} y={y + i * 11} width="30" height="2" fill={c} opacity={0.4 + glow * 0.6} />
        <rect x={x + 22} y={y + 4 + i * 11} width="4" height="2" fill={glow > 0.5 ? "#7dff9a" : "#5a4a8a"} />
      </g>
    ))}
  </g>
);

const ARCHIVE = {
  scroll: ({ p, c }) => {
    const q = "orders per city?";
    const n = Math.floor(q.length * clamp(p * 1.3));
    return (
      <g>
        <rect x="44" y="40" width="68" height="14" fill="#fff" />
        <rect x="48" y="54" width="4" height="3" fill="#fff" />
        <T x="47" y="50" size="7" fill="#3a1a4a" anchor="start">{q.slice(0, n)}{n < q.length ? "▌" : ""}</T>
        <Database c={c} glow={p} />
        {p > 0.8 && <Heart x="74" y="34" className="float-up" />}
      </g>
    );
  },
  katana: ({ p, c }) => {
    const lit = Math.floor(clamp(p * 1.2) * 6.99);
    const names = ["CTX", "SCH", "SQL", "VAL", "RUN", "ANS"];
    return (
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={68 + i * 26} y="46" width="16" height="10" fill={lit > i * 2 ? c : "#2a1f47"} />
            <T x={76 + i * 26} y="54" size="7" fill="#0a0200">LLM</T>
          </g>
        ))}
        {names.map((nm, i) => (
          <g key={nm}>
            <rect x={52 + i * 17} y="70" width="14" height="12" fill={i < lit ? c : "#22163a"} stroke={i === lit ? "#fff" : "none"} strokeWidth="0.6" />
            <T x={59 + i * 17} y="79" size="6" fill={i < lit ? "#0a0200" : "#8a7aaa"}>{nm}</T>
            {i < 5 && <rect x={66 + i * 17} y="75" width="3" height="1" fill={i < lit - 1 ? "#fff" : "#4a3a6a"} />}
          </g>
        ))}
        <T x="102" y="94" size="7" fill={c}>6-stage pipeline · 3 local LLMs</T>
      </g>
    );
  },
  boss: (pr) => (
    <Boss {...pr} name="BAD FALLBACK" uid="arc">
      <path d="M104,62 q14,-10 26,4 q8,14 -6,22 q-14,6 -20,-8 q-2,-10 10,-10" stroke="#ff4d6d" strokeWidth="4" fill="none" />
      <rect x="112" y="70" width="3" height="3" fill="#fff" />
      <rect x="120" y="70" width="3" height="3" fill="#fff" />
    </Boss>
  ),
  trophy: ({ p, c }) => {
    const rows = Math.floor(clamp(p * 1.4) * 3.99);
    return (
      <g>
        <rect x="66" y="50" width="76" height="10" fill={c} />
        <T x="104" y="58" size="7" fill="#0a0200">city │ orders</T>
        {[0, 1, 2].map((r) => (
          <g key={r} opacity={r < rows ? 1 : 0}>
            <rect x="66" y={61 + r * 8} width="76" height="7" fill={r % 2 ? "#1c1430" : "#241a3e"} />
            <T x="104" y={67 + r * 8} size="7" fill="#e8dcff">{["Jaipur", "Delhi", "Mumbai"][r]}  │  {[3, 2, 1][r]}</T>
          </g>
        ))}
        {p > 0.75 && <T x="104" y="102" size="9" fill="#7dff9a" className="pop-in">✓ QUERY OK</T>}
      </g>
    );
  },
  chest: ({ p, c }) => {
    const open = clamp(p * 1.4);
    return (
      <g>
        <rect x="104" y="50" width="34" height="46" fill="#1c1430" />
        <rect x="108" y="54" width="26" height="12" fill="#2a1f47" />
        <rect x="108" y="82" width="26" height="12" fill="#2a1f47" />
        <Chips open={open} colors={[c, PINK, "#ffcf6e"]} x0={86} y0={72} />
        <g transform={`translate(${-22 * open},0)`}>
          <rect x="108" y="68" width="26" height="12" fill="#3a2a66" />
          <rect x="119" y="73" width="4" height="2" fill={c} />
        </g>
      </g>
    );
  },
};

/* ───────────────────────── SPACE STATION · CosmoTrace ───────────────────────── */
const Glove = ({ x = 100, y = 48 }) => (
  <g>
    <rect x={x} y={y + 18} width="30" height="26" fill="#e8eef5" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={x + i * 7 + 1} y={y + 2 + (i === 0 ? 6 : 0)} width="6" height="18" fill="#e8eef5" />)}
    <rect x={x - 7} y={y + 22} width="8" height="12" fill="#e8eef5" />
    <rect x={x} y={y + 40} width="30" height="6" fill="#b8c4d2" />
  </g>
);

const STATION = {
  scroll: ({ p }) => (
    <g>
      <Glove />
      <rect x="117" y="52" width="4" height="4" fill="#ff3355" className="twinkle" />
      {p > 0.3 && <T x="134" y="50" size="9" fill="#ff7a7a">!</T>}
      <rect x="92" y={46 + 50 * clamp(p)} width="46" height="1" fill="#2de2e6" opacity="0.8" />
      <T x="115" y="106" size="8" fill="#9fefff">where is the breach?</T>
    </g>
  ),
  katana: ({ p, c }) => {
    const n = Math.floor(clamp(p * 1.2) * 12.99);
    return (
      <g>
        <Glove />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={"x" + i} x="93" y={52 + i * 7} width="40" height="1" fill={c} opacity={i < n ? 0.9 : 0.08} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={"y" + i} x={97 + i * 7} y="48" width="1" height="46" fill={c} opacity={i + 6 < n ? 0.9 : 0.08} />
        ))}
        {n > 11 && <rect x="117" y="58" width="4" height="4" fill="#ff3355" className="twinkle" />}
        <T x="115" y="106" size="8" fill="#9fefff">44 fiber channels · 5 mm grid</T>
      </g>
    );
  },
  boss: (pr) => (
    <Boss {...pr} name="LEAK" uid="sta">
      <circle cx="118" cy="74" r="14" fill="#ff5a7a" opacity="0.85" />
      <circle cx="106" cy="80" r="9" fill="#ff7a92" opacity="0.85" />
      <circle cx="131" cy="80" r="9" fill="#ff7a92" opacity="0.85" />
      <rect x="112" y="70" width="3" height="3" fill="#2a0010" />
      <rect x="122" y="70" width="3" height="3" fill="#2a0010" />
    </Boss>
  ),
  trophy: (pr) => <Trophy {...pr} label="1ST / 450+" />,
  chest: ({ p, c }) => <Chest p={p} c={c} lid="#5a6a7a" body="#3a4a5a" band={c} />,
};

/* ───────────────────────── DETECTIVE'S OFFICE · Incident Copilot ───────────────────────── */
const DETECTIVE = {
  scroll: ({ p }) => (
    <g>
      <rect x="108" y="50" width="26" height="46" fill="#1a1a2a" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="111" y={54 + i * 10} width="20" height="7" fill="#26263a" />
          <rect x="113" y={56 + i * 10} width="3" height="2" fill={i === 2 ? "#ff3355" : "#7dff9a"} className={i === 2 ? "twinkle" : ""} />
        </g>
      ))}
      <rect x="70" y="50" width="26" height="14" fill="#111" />
      <T x="83" y="60" size="9" fill="#ff5a5a">03:00</T>
      {p > 0.4 && <T x="121" y="44" size="9" fill="#ff5a5a" className="pop-in">ALERT!</T>}
    </g>
  ),
  katana: ({ p, c }) => {
    const notes = [[70, 50], [100, 46], [130, 54], [86, 74], [122, 78]];
    const len = 220;
    return (
      <g>
        <rect x="62" y="40" width="94" height="56" fill="#5a3a1a" />
        <rect x="64" y="42" width="90" height="52" fill="#7a5226" />
        <polyline points={notes.map(([x, y]) => `${x + 6},${y + 4}`).join(" ")} fill="none" stroke="#ff3355" strokeWidth="1"
          strokeDasharray={len} strokeDashoffset={len * (1 - clamp(p * 1.3))} />
        {notes.map(([x, y], i) => (
          <g key={i} opacity={clamp(p * 1.6 - i * 0.18) > 0 ? 1 : 0.15}>
            <rect x={x} y={y} width="13" height="10" fill={i === 4 ? PINK : "#fff3b0"} />
            <rect x={x + 5} y={y - 1} width="3" height="2" fill={c} />
          </g>
        ))}
        <T x="109" y="104" size="8" fill={c}>logs → evidence → root cause</T>
      </g>
    );
  },
  boss: (pr) => (
    <Boss {...pr} name="HALLUCINATION" uid="det">
      <rect x="106" y="56" width="26" height="30" fill="#e8e4ff" />
      <rect x="102" y="62" width="34" height="20" fill="#e8e4ff" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={104 + i * 8} y="86" width="4" height="4" fill="#e8e4ff" />)}
      <rect x="111" y="64" width="4" height="5" fill="#6a2aaa" />
      <rect x="123" y="64" width="4" height="5" fill="#6a2aaa" />
      <rect x="115" y="74" width="8" height="3" fill="#6a2aaa" />
    </Boss>
  ),
  trophy: ({ p, c }) => {
    const sweep = clamp(p * 1.3);
    return (
      <g>
        <rect x="76" y="50" width="56" height="44" fill="#f3e6d8" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="82" y={56 + i * 7} width={40 - (i % 2) * 10} height="2" fill="#7a6a5a" />)}
        <g transform={`translate(${70 + sweep * 50},${52 + Math.sin(sweep * 6) * 8})`}>
          <circle cx="0" cy="0" r="8" fill="#9fdfff" opacity="0.35" stroke={c} strokeWidth="2" />
          <rect x="5" y="5" width="8" height="3" fill="#5a3a1a" transform="rotate(45 5 5)" />
        </g>
        {p > 0.75 && (
          <g className="pop-in">
            <rect x="92" y="78" width="40" height="12" fill="none" stroke="#2ecc71" strokeWidth="2" transform="rotate(-8 112 84)" />
            <T x="112" y="87" size="8" fill="#2ecc71" transform="rotate(-8 112 84)">✓ EVIDENCE</T>
          </g>
        )}
      </g>
    );
  },
  chest: ({ p, c }) => {
    const open = clamp(p * 1.4);
    return (
      <g>
        <Chips open={open} colors={[c, PINK, "#fff3b0", c]} x0={102} y0={70} />
        <rect x="96" y="70" width="46" height="26" fill="#c9a06a" />
        <rect x="96" y="66" width="18" height="5" fill="#c9a06a" />
        <g transform={`rotate(${-70 * open} 96 70)`}>
          <rect x="96" y="70" width="46" height="24" fill="#e0b880" />
          <T x="119" y="84" size="7" fill="#5a3a1a">CASE FILE</T>
        </g>
      </g>
    );
  },
};

/* ───────────────────────── THE VAULT · Banking defect analysis ───────────────────────── */
const Bins = ({ hi = -1, c }) => {
  const labels = ["DEF", "NOT", "WAD", "CR"];
  return labels.map((l, i) => (
    <g key={l}>
      <rect x={66 + i * 21} y="78" width="17" height="18" fill={i === hi ? c : "#3a300c"} />
      <rect x={66 + i * 21} y="78" width="17" height="2" fill="#ffd36e" />
      <T x={74.5 + i * 21} y="91" size="7" fill={i === hi ? "#0a0200" : "#ffd36e"}>{l}</T>
    </g>
  ));
};
const Envelope = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width="16" height="11" fill="#fff8e6" />
    <polyline points={`${x},${y} ${x + 8},${y + 6} ${x + 16},${y}`} fill="none" stroke="#c9a24a" />
  </g>
);
const Robot = ({ x, c }) => (
  <g>
    <rect x={x} y="56" width="14" height="12" fill="#5a5a6a" />
    <rect x={x + 3} y="60" width="3" height="3" fill={c} />
    <rect x={x + 8} y="60" width="3" height="3" fill={c} />
    <rect x={x + 6} y="52" width="2" height="4" fill="#8a8a9a" />
    <rect x={x + 2} y="68" width="10" height="12" fill="#4a4a5a" />
  </g>
);

const VAULT = {
  scroll: ({ p, c }) => (
    <g>
      <Bins c={c} />
      <g transform={`translate(0,${Math.sin(p * 8) * 3})`}>
        <Envelope x={98} y={50} />
        <T x="106" y="46" size="10" fill="#ffd36e">?</T>
      </g>
    </g>
  ),
  katana: ({ p, c }) => {
    const t = clamp(p * 1.3);
    return (
      <g>
        <Robot x={66} c={c} />
        <Robot x={130} c={PINK} />
        <Envelope x={82 + t * 40} y={62 - Math.sin(t * Math.PI) * 14} />
        <T x="73" y="90" size="7" fill={c}>AGENT 1</T>
        <T x="137" y="90" size="7" fill={PINK}>AGENT 2</T>
        <T x="105" y="104" size="7" fill="#ffd36e">pgvector evidence search</T>
      </g>
    );
  },
  boss: (pr) => (
    <Boss {...pr} name="WRONG LABEL" uid="vlt">
      <polygon points="104,60 128,60 136,74 128,88 104,88" fill="#ff4d6d" />
      <circle cx="129" cy="74" r="2.5" fill="#2a0010" />
      <rect x="110" y="68" width="4" height="4" fill="#fff" />
      <rect x="118" y="68" width="4" height="4" fill="#fff" />
      <rect x="111" y="79" width="10" height="2" fill="#2a0010" />
    </Boss>
  ),
  trophy: ({ p, c }) => {
    const drop = clamp(p * 1.4);
    return (
      <g>
        <Bins hi={drop > 0.95 ? 0 : -1} c={c} />
        <Envelope x={67} y={40 + drop * 38} />
        {p > 0.7 && (
          <g className="pop-in">
            <T x="75" y="70" size="9" fill="#7dff9a">✓</T>
            <T x="128" y="60" size="7" fill="#ffd36e">no evidence?</T>
            <T x="128" y="68" size="7" fill="#ffd36e">→ abstain</T>
          </g>
        )}
      </g>
    );
  },
  chest: ({ p, c }) => {
    const open = clamp(p * 1.3);
    return (
      <g>
        <rect x="96" y="52" width="46" height="44" fill="#2e2608" />
        <rect x="102" y="58" width="34" height="34" fill="#ffd36e" opacity={0.25 + open * 0.6} />
        <Chips open={open} colors={["#ffcf6e", c, PINK, "#ffcf6e"]} x0={104} y0={74} />
        <g transform={`translate(${96 - 96 * (1 - open * 0.85)},0) scale(${1 - open * 0.85},1)`}>
          <circle cx="119" cy="74" r="18" fill="#6a5a2a" stroke="#ffd36e" strokeWidth="2" />
          <circle cx="119" cy="74" r="5" fill="#3a300c" stroke="#ffd36e" />
          {[0, 60, 120].map((a) => <rect key={a} x="117" y="60" width="4" height="28" fill="#ffd36e" opacity="0.6" transform={`rotate(${a + open * 180} 119 74)`} />)}
        </g>
      </g>
    );
  },
};

/* ───────────────────────── THE CLINIC · Swasth ───────────────────────── */
const Doors = ({ hi = -1, c }) =>
  ["GP", "ENT", "NEURO"].map((d, i) => (
    <g key={d}>
      <rect x={98 + i * 20} y="62" width="16" height="34" fill={i === hi ? c : "#163a26"} />
      <rect x={110 + i * 20} y="78" width="2" height="2" fill="#ffd36e" />
      <T x={106 + i * 20} y="58" size="6" fill={i === hi ? c : "#9fdfb4"}>{d}</T>
    </g>
  ));

const CLINIC = {
  scroll: ({ p, c }) => {
    const msg = "my head hurts...";
    const n = Math.floor(msg.length * clamp(p * 1.4));
    return (
      <g>
        <Doors c={c} />
        <rect x="40" y="44" width="52" height="12" fill="#fff" />
        <rect x="44" y="56" width="4" height="3" fill="#fff" />
        <T x="43" y="53" size="7" fill="#1a3a26" anchor="start">{msg.slice(0, n)}</T>
        <T x="128" y="108" size="8" fill="#9fdfb4">which doctor?</T>
      </g>
    );
  },
  katana: ({ p, c }) => {
    const len = 160;
    return (
      <g>
        <rect x="58" y="44" width="90" height="38" fill="#04140a" stroke="#1e5a36" />
        <polyline points="60,64 76,64 80,56 84,72 88,64 104,64 108,50 112,76 116,64 146,64" fill="none" stroke={c} strokeWidth="1.5"
          strokeDasharray={len} strokeDashoffset={len * (1 - clamp(p * 1.3))} />
        <Heart x="134" y="48" fill="#ff5a7a" className="twinkle" />
        <T x="103" y="94" size="7" fill={c}>symptoms → triage → routing</T>
      </g>
    );
  },
  boss: (pr) => (
    <Boss {...pr} name="MISROUTED" uid="cli">
      <circle cx="119" cy="74" r="13" fill="#7a3aff" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="117" y="55" width="4" height="6" fill="#9a6aff" transform={`rotate(${a} 119 74)`} />
      ))}
      <rect x="113" y="70" width="3" height="3" fill="#fff" />
      <rect x="122" y="70" width="3" height="3" fill="#fff" />
    </Boss>
  ),
  trophy: (pr) => <Trophy {...pr} label="1ST PLACE" />,
  chest: ({ p, c }) => {
    const open = clamp(p * 1.4);
    return (
      <g>
        <Chips open={open} colors={[c, "#ff5a7a", PINK, c]} />
        {open > 0.6 && <Heart x="112" y={48 - open * 6} className="float-up" fill="#ff5a7a" />}
        <rect x="98" y="72" width="42" height="22" fill="#f5f5f5" />
        <rect x="116" y="76" width="6" height="14" fill="#ff3b5c" />
        <rect x="112" y="80" width="14" height="6" fill="#ff3b5c" />
        <g transform={`rotate(${-75 * open} 98 72)`}>
          <rect x="98" y="64" width="42" height="8" fill="#e0e0e0" />
          <rect x="114" y="61" width="10" height="3" fill="#bdbdbd" />
        </g>
      </g>
    );
  },
};

const THEMES = { archive: ARCHIVE, station: STATION, detective: DETECTIVE, vault: VAULT, clinic: CLINIC };

/* ───────────────────────── scene ───────────────────────── */
export default function StoryScene({ stage, p, g, color, label, step, total, theme }) {
  const c = color;
  const Stage = THEMES[theme]?.[stage] || GENERIC[stage] || ScrollStage;
  const Backdrop = BACKDROPS[theme] || Mountains;
  const isSpace = theme === "station";

  return (
    <div className="relative w-full h-full" style={{ border: `2px solid ${c}55`, background: "#050100", overflow: "hidden" }}>
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" shapeRendering="crispEdges" style={{ display: "block" }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c} stopOpacity={isSpace ? 0.12 : 0.28} />
            <stop offset="0.7" stopColor="#0a0204" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="160" height="120" fill="url(#sky)" />
        {[[12, 10], [40, 18], [70, 8], [100, 16], [146, 12], [28, 30], [88, 28]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="1" height="1" fill="#fff" opacity="0.7" className="twinkle" style={{ animationDelay: `${i * 0.37}s` }} />
        ))}
        {!isSpace && (
          <>
            <circle cx={130 - g * 6} cy="20" r="8" fill={c} opacity="0.6" />
            <circle cx={133 - g * 6} cy="17" r="7" fill="#0a0204" opacity="0.85" />
          </>
        )}
        <Backdrop g={g} c={c} />
        {/* ground */}
        <rect x="0" y="96" width="160" height="24" fill={isSpace ? "#0e1620" : "#130406"} />
        <rect x="0" y="96" width="160" height="1" fill={c} opacity="0.6" />
        {isSpace && [10, 40, 70, 100, 130].map((x) => <rect key={x} x={x} y="100" width="20" height="1" fill={c} opacity="0.2" />)}

        <Heroine attack={stage === "boss" && p > 0.4} />
        <g key={`${theme}-${stage}`} className="scene-fade">
          <Stage p={p} c={c} />
        </g>

        {/* drifting sakura petals */}
        {[18, 48, 84, 112, 142, 64].map((x, i) => (
          <rect key={i} x={x} y="-4" width="2" height="2" fill={i % 2 ? PINK : "#ffc4e1"} className="petal" style={{ animationDelay: `${i * 0.9}s`, animationDuration: `${5 + (i % 3)}s` }} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 10, top: 8, fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: c, background: "#0a0200cc", padding: "5px 7px", border: `1px solid ${c}66` }}>
        STAGE {step}/{total} · {label}
      </div>
    </div>
  );
}
