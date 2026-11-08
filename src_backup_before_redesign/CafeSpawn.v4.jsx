import { useEffect, useState, useRef } from "react";
import { Heroine, Heart, PINK } from "@/components/pixel";
import { PIXEL, READ } from "@/lib/fonts";
import { sfx } from "@/lib/sfx";

/* ─────────────────────────── menu (kcal are rough, per serving) ─────────────────────────── */
const DISHES = [
  {
    id: "pasta", label: "Pasta", sub: "slow-cooked, fast-shipped", title: "Pick your sauce",
    line: "Pasta. A person of culture, I see.",
    variants: [
      { id: "white", label: "White Sauce", sub: "creamy alfredo", color: "#f3ead2", kcal: 620, line: "White sauce. Smooth, like a clean merge." },
      { id: "red", label: "Red Sauce", sub: "tangy arrabbiata", color: "#d7332b", kcal: 480, line: "Red sauce! Spicy, like a code review at 2 AM." },
      { id: "pink", label: "Pink Sauce", sub: "the best of both", color: "#f28da6", kcal: 550, line: "Pink sauce. Excellent taste. (I may be biased.)" },
    ],
  },
  {
    id: "pizza", label: "Pizza", sub: "8 slices of happiness", title: "Pick your pizza",
    line: "Pizza! Can't go wrong. Unlike my first deployment.",
    variants: [
      { id: "margherita", label: "Margherita", sub: "classic cheese + basil", color: "#f6d365", kcal: 520, line: "Margherita. A classic that never goes out of style, like Python." },
      { id: "farmhouse", label: "Farmhouse Veggie", sub: "peppers, corn, olives", color: "#f2c14e", kcal: 560, line: "Farmhouse. A full stack of veggies. Respect." },
      { id: "paneer", label: "Paneer Tikka", sub: "smoky + spicy", color: "#f39c4a", kcal: 610, line: "Paneer Tikka. Now we're talking." },
    ],
  },
  {
    id: "sandwich", label: "Sandwich", sub: "stacked like a tech stack", title: "Pick your sandwich",
    line: "A sandwich. Efficient. You'd make a great project manager.",
    variants: [
      { id: "grilled", label: "Grilled Cheese", sub: "golden + melty", color: "#f6c945", kcal: 440, line: "Grilled cheese. Comfort food for production incidents." },
      { id: "club", label: "Veg Club", sub: "triple-decker", color: "#7bc96f", kcal: 390, line: "Triple-decker. Layered architecture, I like it." },
      { id: "bombay", label: "Bombay Masala", sub: "chutney + potato", color: "#e8a33d", kcal: 360, line: "Bombay Masala! Bold flavours, zero regrets." },
    ],
  },
];

const SEASONINGS = [
  { id: "oregano", label: "Oregano", color: "#6a8f3a", kcal: 2, line: "Oregano? Classy. You clearly read the documentation." },
  { id: "chilli", label: "Chilli Flakes", color: "#d0342c", kcal: 5, line: "Chilli flakes. Bold. Like pushing to main on a Friday." },
  { id: "parmesan", label: "Parmesan", color: "#fff4cc", kcal: 40, line: "Parmesan, huh? Expensive taste. Just like hiring me." },
  { id: "garlic", label: "Garlic Butter", color: "#ffe08a", kcal: 100, line: "Garlic butter. Hope you don't have meetings after this." },
  { id: "cheese", label: "Extra Cheese", color: "#ffd23f", kcal: 120, line: "Extra cheese. No judgement. Okay... a little judgement." },
];

const DRINKS = [
  { id: "coffee", label: "Cold Coffee", sub: "for late-night debugging", color: "#a0703c", kcal: 220, temp: "cold", line: "Cold coffee: official fuel of 3 AM debugging." },
  { id: "togo", label: "Coffee to Go", sub: "busy? take it with you", color: "#6b4226", kcal: 120, temp: "hot", line: "Coffee to go. Busy recruiter energy. I see you." },
  { id: "chai", label: "Masala Chai", sub: "fuel of every hackathon", color: "#c08a5a", kcal: 110, temp: "hot", line: "Masala chai. Correct answer." },
  { id: "lemon", label: "Iced Lemon Tea", sub: "fresh + zesty", color: "#e9c046", kcal: 90, temp: "cold", line: "Iced lemon tea. Refreshing, like a clean codebase." },
  { id: "shake", label: "Strawberry Shake", sub: "pink, obviously", color: "#ff9cc2", kcal: 350, temp: "cold", line: "Strawberry shake. Pink. Obviously. Great minds." },
  { id: "diet", label: "Diet Coke", sub: "crisp, zero sugar", color: "#3a1a10", kcal: 1, temp: "cold", line: "Diet Coke. Crisp, classic, zero regrets." },
  { id: "water", label: "Water", sub: "stay hydrated, recruiter", color: "#9fd8ff", kcal: 0, temp: "any", line: "Water. Responsible. Your doctor would be proud." },
];

const STEPS = ["dish", "variant", "season", "drink"];
const OPENING = {
  dish: "Welcome to Trashi's Café! I'm the chef today. What are you craving?",
  variant: null, // the dish line is used
  season: "Any seasoning? Choose wisely. I'm watching.",
  drink: null, // weather suggestion is used
};

/* ─────────────────────────── weather-based suggestion ─────────────────────────── */
function timeSuggestion() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { drink: "togo", icon: "☀", sky: "day", text: "Morning! Coffee to go will get you through those emails." };
  if (h >= 12 && h < 17) return { drink: "lemon", icon: "☀", sky: "day", text: "Afternoon slump? Iced lemon tea. Trust me." };
  if (h >= 17 && h < 21) return { drink: "chai", icon: "☾", sky: "dusk", text: "Evening already? That's chai o'clock." };
  return { drink: "coffee", icon: "☾", sky: "night", text: "Still awake? Debugging, are we? Cold coffee it is." };
}

function weatherSuggestion(temp, code) {
  const rain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
  const snow = code >= 71 && code <= 77;
  const t = Math.round(temp);
  if (rain) return { drink: "chai", icon: "☂", sky: "rain", text: `${t}°C and raining where you are. Rainy day = chai. That's the law.` };
  if (snow || t < 15) return { drink: "togo", icon: "❄", sky: "night", text: `Brr, ${t}°C where you are! Coffee to go, keep your hands warm.` };
  if (t >= 32) return { drink: "diet", icon: "☀", sky: "day", text: `${t}°C?! It's melting outside. Ice-cold Diet Coke, stat.` };
  if (t >= 26) return { drink: "lemon", icon: "☀", sky: "day", text: `${t}°C and sunny-ish. Iced lemon tea is the move.` };
  return { drink: "shake", icon: "⛅", sky: "day", text: `${t}°C, lovely weather. Treat yourself to a strawberry shake.` };
}

/* ─────────────────────────── art ─────────────────────────── */
function Food({ dish, variant, seasons = [] }) {
  const v = DISHES.find((d) => d.id === dish)?.variants.find((x) => x.id === variant);
  const sauce = v?.color;
  const sprinkle = (seed) =>
    seasons.flatMap((sid, si) => {
      const col = SEASONINGS.find((x) => x.id === sid).color;
      return Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 61 + si * 37 + seed) % 360;
        const r = 6 + ((i * 7 + si * 5) % 14);
        return <rect key={sid + i} x={40 + Math.cos(a) * r} y={44 + Math.sin(a) * r * 0.6} width="2" height="2" fill={col} />;
      });
    });

  if (dish === "pizza") {
    return (
      <g>
        <circle cx="40" cy="46" r="26" fill="#d9a05b" />
        <circle cx="40" cy="46" r="22" fill={sauce ? "#c0392b" : "#e8b46a"} />
        {sauce && <circle cx="40" cy="46" r="20" fill={sauce} opacity="0.9" />}
        {variant === "margherita" && [[32, 40], [46, 38], [40, 54], [50, 50]].map(([x, y], i) => <rect key={i} x={x} y={y} width="4" height="3" fill="#3a8a3a" />)}
        {variant === "farmhouse" && [[30, 42], [44, 36], [48, 52], [36, 54], [52, 44]].map(([x, y], i) => <rect key={i} x={x} y={y} width="3" height="3" fill={["#3aa04a", "#ffd23f", "#2a2a2a"][i % 3]} />)}
        {variant === "paneer" && [[32, 40], [46, 40], [38, 52], [50, 50], [42, 46]].map(([x, y], i) => <rect key={i} x={x} y={y} width="4" height="4" fill="#fff4e0" stroke="#c0522a" strokeWidth="0.6" />)}
        {[0, 45, 90, 135].map((a) => <rect key={a} x="39.5" y="24" width="1" height="44" fill="#a8702a" opacity="0.6" transform={`rotate(${a} 40 46)`} />)}
        {sprinkle(3)}
      </g>
    );
  }
  if (dish === "sandwich") {
    const fill = sauce || "#7bc96f";
    return (
      <g>
        <rect x="14" y="62" width="54" height="6" fill="#d9d9d9" />
        <polygon points="16,62 40,30 64,62" fill="#e8c07a" />
        <polygon points="20,58 40,34 60,58" fill="#f5dfa8" />
        <rect x="18" y="52" width="44" height="4" fill={fill} />
        {variant === "club" && <rect x="20" y="47" width="40" height="3" fill="#e74c3c" />}
        {variant === "grilled" && <rect x="20" y="48" width="40" height="3" fill="#ffd23f" />}
        {variant === "bombay" && <rect x="20" y="48" width="40" height="3" fill="#3aa04a" />}
        <rect x="18" y="56" width="44" height="5" fill="#e8c07a" />
        {sprinkle(7)}
      </g>
    );
  }
  // pasta (also the default "empty bowl" look)
  const noodle = sauce || "#f5d78e";
  return (
    <g>
      <ellipse cx="40" cy="52" rx="30" ry="12" fill="#e8e8f0" />
      <rect x="12" y="52" width="56" height="10" fill="#e8e8f0" />
      <ellipse cx="40" cy="62" rx="28" ry="7" fill="#c8c8d8" />
      <ellipse cx="40" cy="50" rx="25" ry="8" fill={dish ? noodle : "#f0f0f6"} />
      {dish && [0, 1, 2, 3].map((i) => (
        <polyline key={i} points={`${20 + i * 4},${48 + (i % 2) * 3} ${28 + i * 5},${44 + i} ${36 + i * 4},${50 - (i % 2) * 2} ${46 + i * 3},${46 + i} ${56 + i},${50}`} fill="none" stroke="#f9e2a2" strokeWidth="1.4" opacity={sauce ? 0.7 : 1} />
      ))}
      {dish && sauce && <ellipse cx="40" cy="47" rx="12" ry="4" fill={sauce} opacity="0.9" />}
      {variant === "pink" && <Heart x={37} y={44} s={0.7} fill="#fff" />}
      {sprinkle(11)}
    </g>
  );
}

function Drink({ id }) {
  const d = DRINKS.find((x) => x.id === id);
  if (!d) return null;
  if (id === "chai") {
    return (
      <g>
        <rect x="88" y="50" width="20" height="16" fill="#f5f5f5" />
        <rect x="108" y="54" width="5" height="8" fill="none" stroke="#f5f5f5" strokeWidth="2" />
        <rect x="90" y="52" width="16" height="4" fill={d.color} />
        <rect x="85" y="66" width="26" height="3" fill="#e0e0e0" />
      </g>
    );
  }
  if (id === "togo") {
    return (
      <g>
        <polygon points="90,40 110,40 107,68 93,68" fill="#f3ead8" />
        <rect x="89" y="36" width="22" height="5" fill="#fff" />
        <rect x="92" y="34" width="16" height="3" fill="#e8e8e8" />
        <rect x="91" y="50" width="18" height="9" fill="#8a5a3a" />
        <Heart x={97.5} y={52} s={0.8} fill={PINK} />
      </g>
    );
  }
  if (id === "diet") {
    return (
      <g>
        <rect x="92" y="38" width="16" height="30" fill="#d9dde2" />
        <rect x="92" y="38" width="16" height="3" fill="#a9b0b8" />
        <rect x="92" y="46" width="16" height="12" fill="#c8102e" opacity="0.15" />
        <rect x="94" y="48" width="12" height="2" fill="#c8102e" />
        <rect x="95" y="52" width="10" height="1" fill="#555" />
        <rect x="104" y="30" width="2" height="12" fill={PINK} />
      </g>
    );
  }
  return (
    <g>
      <rect x="90" y="34" width="20" height="34" fill="#dff3ff" opacity="0.35" />
      <rect x="91" y="44" width="18" height="23" fill={d.color} />
      {id === "shake" && <rect x="91" y="40" width="18" height="5" fill="#fff" />}
      {(id === "coffee" || id === "lemon" || id === "water") && [0, 1].map((i) => <rect key={i} x={94 + i * 7} y={48 + i * 6} width="5" height="5" fill="#fff" opacity="0.6" />)}
      {id === "lemon" && <rect x="104" y="36" width="7" height="7" fill="#ffe14a" />}
      <rect x="102" y="24" width="2" height="22" fill={PINK} transform="rotate(12 103 35)" />
      {id === "shake" && <rect x="96" y="36" width="4" height="4" fill="#e0245e" />}
    </g>
  );
}

/* the customer (that's the visitor!) seen from behind the counter */
function Customer({ mood = "idle", hair = "#2a2a3a", top = "#3a6ea5", frame = 0 }) {
  return (
    <g>
      <rect x="2" y="0" width="8" height="3" fill={hair} />
      <rect x="1" y="1" width="1" height="4" fill={hair} />
      <rect x="10" y="1" width="1" height="4" fill={hair} />
      <rect x="2" y="2" width="8" height="5" fill="#e8b48a" />
      <rect x="2" y="2" width="8" height="1" fill={hair} />
      {mood === "happy" ? (
        <>
          <rect x="3" y="4" width="2" height="1" fill="#1a1a2a" />
          <rect x="7" y="4" width="2" height="1" fill="#1a1a2a" />
          <rect x="4" y="5" width="4" height="1" fill="#c0504a" />
        </>
      ) : mood === "shock" ? (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#1a1a2a" />
          <rect x="7" y="3" width="2" height="2" fill="#1a1a2a" />
          <rect x="5" y="5" width="2" height="2" fill="#7a2a2a" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="2" height="1" fill="#1a1a2a" />
          <rect x="7" y="4" width="2" height="1" fill="#1a1a2a" />
          <rect x="5" y="6" width="2" height="1" fill="#a06050" />
        </>
      )}
      <rect x="1" y="7" width="10" height="7" fill={top} />
      <rect x="5" y="7" width="2" height="3" fill="#fff" opacity="0.5" />
      <rect x="0" y="8" width="1" height="5" fill={top} />
      <rect x="11" y="8" width="1" height="5" fill={top} />
      <rect x="2" y="14" width="3" height={frame ? 5 : 6} fill="#2a2a3a" />
      <rect x="7" y="14" width="3" height={frame ? 6 : 5} fill="#2a2a3a" />
      <rect x="1" y={frame ? 19 : 20} width="4" height="1" fill="#fff" />
      <rect x="7" y={frame ? 20 : 19} width="4" height="1" fill="#fff" />
    </g>
  );
}

function Window({ x, sky }) {
  const skyCol = { day: "#7ec8ff", dusk: "#f39c6b", night: "#14143a", rain: "#5a6a7a" }[sky] || "#14143a";
  return (
    <g>
      <rect x={x} y="14" width="40" height="32" fill={skyCol} />
      {sky === "day" && <rect x={x + 26} y="18" width="8" height="8" fill="#ffe14a" />}
      {sky === "dusk" && <rect x={x + 6} y="30" width="10" height="6" fill="#ffcf6e" />}
      {sky === "night" && <><circle cx={x + 30} cy="22" r="4" fill="#fff6c8" /><rect x={x + 8} y="20" width="1" height="1" fill="#fff" /><rect x={x + 16} y="28" width="1" height="1" fill="#fff" /></>}
      {sky === "rain" && Array.from({ length: 8 }).map((_, i) => <rect key={i} x={x + 3 + i * 5} y="14" width="1" height="4" fill="#cde" className="rain-sm" style={{ animationDelay: `${i * 0.11}s` }} />)}
      <rect x={x + 19} y="14" width="2" height="32" fill="#5a3320" />
      <rect x={x} y="29" width="40" height="2" fill="#5a3320" />
      <rect x={x - 2} y="12" width="44" height="2" fill="#5a3320" />
      <rect x={x - 2} y="46" width="44" height="3" fill="#7a4a2a" />
    </g>
  );
}

function Gateway({ open }) {
  return (
    <g>
      <rect x="200" y="20" width="34" height="52" fill="#1a0a12" />
      <rect x="198" y="18" width="38" height="4" fill="#c48a52" />
      <rect x="198" y="18" width="4" height="54" fill="#c48a52" />
      <rect x="232" y="18" width="4" height="54" fill="#c48a52" />
      {open ? (
        <g className="portal">
          <ellipse cx="217" cy="46" rx="13" ry="24" fill="#ff8fc8" opacity="0.35" />
          <ellipse cx="217" cy="46" rx="9" ry="19" fill="#9fe8ff" opacity="0.45" />
          <ellipse cx="217" cy="46" rx="5" ry="12" fill="#fff" opacity="0.7" />
        </g>
      ) : (
        <rect x="205" y="26" width="24" height="46" fill="#3a1a22" />
      )}
      <rect x="203" y="8" width="28" height="9" fill="#120804" />
      <text x="217" y="15" fontSize="6" fontFamily="'VT323', monospace" fill={open ? "#9fe8ff" : "#6a4a3a"} textAnchor="middle">GATEWAY</text>
    </g>
  );
}

/* ── geometry of the dining room ──
   pos.x: 0 (left) .. 1 (right)   pos.z: 0 (at the counter) .. 1 (back wall) */
const pxOf = (x) => 14 + x * 186;
const scaleOf = (z) => 2.4 - 1.0 * z;
const feetOf = (z) => 116 - 44 * z;
export const atCounter = (p) => p.z < 0.25 && Math.abs(p.x - 0.5) < 0.3;
export const atGateway = (p) => p.z > 0.82 && p.x > 0.86;

/* ── movable stuff ──  sprites are drawn with their feet at (0,0); cx = horizontal centre */
const ITEM_KINDS = {
  table: {
    hit: [-14, -34, 62, 34],
    cx: 17, name: "table",
    lines: ["Rearranging my café? Interior designer energy.", "That table was feng shui approved, but okay."],
    draw: () => (
      <>
        <rect x="-14" y="-34" width="10" height="20" fill="#6a3a1a" />
        <rect x="-14" y="-16" width="10" height="16" fill="#5a2a12" />
        <rect x="38" y="-34" width="10" height="20" fill="#6a3a1a" />
        <rect x="38" y="-16" width="10" height="16" fill="#5a2a12" />
        <rect x="0" y="-24" width="34" height="6" fill="#c48a52" />
        <rect x="14" y="-18" width="6" height="18" fill="#7a4a2a" />
        <rect x="8" y="-2" width="18" height="2" fill="#5a2a12" />
        <rect x="12" y="-30" width="6" height="6" fill="#fff" />
        <rect x="20" y="-29" width="4" height="5" fill={PINK} />
      </>
    ),
  },
  plant: {
    hit: [-9, -44, 19, 44],
    cx: 0, name: "Basil the plant",
    lines: ["Careful with Basil! He's sensitive.", "Taking my plant for a walk? Cute."],
    draw: () => (
      <>
        <rect x="-8" y="-12" width="16" height="12" fill="#7a4a2a" />
        <rect x="-9" y="-13" width="18" height="3" fill="#9a5a32" />
        <rect x="-9" y="-34" width="6" height="22" fill="#3a8a3a" />
        <rect x="-2" y="-42" width="6" height="30" fill="#4aa04a" />
        <rect x="5" y="-30" width="5" height="18" fill="#3a8a3a" />
        <rect x="0" y="-44" width="2" height="2" fill={PINK} />
      </>
    ),
  },
  beanbag: {
    hit: [-16, -18, 32, 18],
    cx: 0, name: "beanbag",
    lines: ["The beanbag. Excellent nap strategy.", "Moving the beanbag? Planning a long stay, I see."],
    draw: () => (
      <>
        <rect x="-16" y="-12" width="32" height="12" fill={PINK} />
        <rect x="-12" y="-18" width="24" height="8" fill="#ff9fd0" />
        <rect x="-8" y="-16" width="8" height="3" fill="#ffc4e1" />
        <rect x="-16" y="-2" width="32" height="2" fill="#d0609a" />
      </>
    ),
  },
  cat: {
    hit: [-14, -18, 30, 18],
    cx: 2, name: "Byte the cat",
    lines: ["Put Byte down! He was napping.", "Byte says meow. Translation: 'hire her'."],
    draw: () => (
      <>
        <rect x="-10" y="-10" width="20" height="10" fill="#f0a050" />
        {[-6, 0, 6].map((x) => <rect key={x} x={x} y="-10" width="2" height="5" fill="#c8782a" />)}
        <rect x="6" y="-15" width="9" height="8" fill="#f0a050" />
        <rect x="6" y="-17" width="2" height="2" fill="#f0a050" />
        <rect x="13" y="-17" width="2" height="2" fill="#f0a050" />
        <rect x="8" y="-12" width="2" height="1" fill="#3a1a0a" />
        <rect x="12" y="-12" width="2" height="1" fill="#3a1a0a" />
        <rect x="10" y="-10" width="1" height="1" fill={PINK} />
        <rect x="-14" y="-6" width="5" height="2" fill="#f0a050" />
        <text x="16" y="-18" fontSize="6" fontFamily="'VT323', monospace" fill="#fff" opacity="0.8" className="twinkle">z</text>
      </>
    ),
  },
  books: {
    hit: [-11, -18, 22, 18],
    cx: 0, name: "book stack",
    lines: ["Those are my DSA notes. Handle with care.", "Reading in a café? Respect."],
    draw: () => (
      <>
        <rect x="-11" y="-6" width="22" height="6" fill="#3a6ea5" />
        <rect x="-9" y="-12" width="18" height="6" fill="#c2185b" />
        <rect x="-10" y="-18" width="20" height="6" fill="#6a1b9a" />
        <rect x="-8" y="-17" width="6" height="1" fill="#ffcf6e" />
      </>
    ),
  },
};

const START_ITEMS = [
  { id: "t1", kind: "table", x: 0.06, z: 0.62 },
  { id: "t2", kind: "table", x: 0.5, z: 0.86 },
  { id: "plant", kind: "plant", x: 0.76, z: 0.97 },
  { id: "bean", kind: "beanbag", x: 0.3, z: 0.34 },
  { id: "cat", kind: "cat", x: 0.88, z: 0.42 },
  { id: "books", kind: "books", x: 0.22, z: 0.92 },
];

// is the visitor standing close enough to grab this item?
export const nearItem = (pos, it) => {
  const me = pxOf(pos.x) + 6 * scaleOf(pos.z);
  const them = pxOf(it.x) + ITEM_KINDS[it.kind].cx * (scaleOf(it.z) / 3);
  return Math.abs(me - them) < 26 && Math.abs(pos.z - it.z) < 0.22;
};

function ItemSprite({ it, onGrab, glow }) {
  const k = ITEM_KINDS[it.kind];
  return (
    <g
      transform={`translate(${pxOf(it.x)},${feetOf(it.z)}) scale(${scaleOf(it.z) / 3})`}
      className="movable"
      onPointerDown={(e) => onGrab(it.id, e)}
      style={{ filter: glow ? "drop-shadow(0 0 2px #ffcf6e)" : "none" }}
    >
      {/* invisible hit area so the whole object is easy to grab */}
      <rect x={k.hit[0]} y={k.hit[1]} width={k.hit[2]} height={k.hit[3]} fill="transparent" />
      {k.draw()}
    </g>
  );
}

function KitchenScene({ order, step, sky, customerMood, sprinkle, pos, frame, auto, away, items, held, onGrab, svgRef, fit }) {
  const s = 0.82; // tray scale on the counter
  const cs = scaleOf(pos.z);
  const cx = pxOf(pos.x);
  const cy = feetOf(pos.z) - 20 * cs;
  const carrying = step === "served";
  const move = auto ? "transform 1.8s linear" : "transform .14s linear";
  const heldItem = items.find((i) => i.id === held);
  const scene = [...items.filter((i) => i.id !== held), { ...pos, id: "me", kind: "me" }].sort((a, b) => b.z - a.z);

  return (
    <svg ref={svgRef} viewBox="0 0 240 150" width="100%" height="100%" preserveAspectRatio={fit ? "xMidYMax slice" : "xMidYMid meet"} shapeRendering="crispEdges" style={{ display: "block", touchAction: "none" }}>
      {/* back wall */}
      <rect width="240" height="150" fill="#3a1d18" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 20} y="0" width="10" height="72" fill="#43221b" />)}
      <Window x={14} sky={sky} />
      <Window x={70} sky={sky} />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={6 + i * 15} y={3 + (i % 2) * 3} width="3" height="3" fill={["#ffcf6e", PINK, "#9fe8ff"][i % 3]} className="bulb" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      <rect x="128" y="18" width="56" height="14" fill="#1a0a05" stroke={PINK} strokeWidth="1" />
      <text x="156" y="28" fontSize="8" fontFamily="'VT323', monospace" fill={PINK} textAnchor="middle" className="neon">TRASHI'S CAFÉ</text>
      <Gateway open={step === "served"} />

      {/* dining floor (perspective planks) */}
      <rect x="0" y="72" width="240" height="44" fill="#5a3320" />
      {[76, 82, 89, 97, 106].map((y, i) => <rect key={y} x="0" y={y} width="240" height="1" fill="#4a2818" opacity={0.6 + i * 0.08} />)}
      <rect x="0" y="72" width="240" height="2" fill="#2a120a" />
      {step === "served" && [0.62, 0.7, 0.78, 0.86].map((x, i) => (
        <text key={x} x={pxOf(x) + 10} y={feetOf(0.55 + i * 0.1) - 2} fontSize="9" fontFamily="'VT323', monospace" fill="#9fe8ff" className="twinkle" style={{ animationDelay: `${i * 0.15}s` }}>›</text>
      ))}

      {/* tables + the visitor, drawn back-to-front */}
      {scene.map((p) =>
        p.kind !== "me" ? (
          <ItemSprite key={p.id} it={p} onGrab={onGrab} glow={!held && nearItem(pos, p)} />
        ) : (
          <g key="me" style={{ transform: `translate(${cx}px, ${cy}px)`, transition: move, opacity: auto === "gone" ? 0 : 1 }}>
            <g transform={`scale(${cs})`}>
              <Customer mood={customerMood} frame={frame} />
              {carrying && (
                <g transform="translate(-2,8) scale(0.14)">
                  <rect x="0" y="66" width="120" height="10" fill="#7a4a2a" />
                  <Food dish={order.dish} variant={order.variant} seasons={order.seasons} />
                  <Drink id={order.drink} />
                </g>
              )}
              {heldItem && (
                <g transform={`translate(${6 - ITEM_KINDS[heldItem.kind].cx / 3},-1) scale(${1 / 3})`}>{ITEM_KINDS[heldItem.kind].draw()}</g>
              )}
              {away && !heldItem && (
                <g>
                  <rect x="12" y="-9" width="18" height="8" fill="#fff" />
                  <text x="21" y="-3" fontSize="6" fontFamily="'VT323', monospace" fill="#3a1a0a" textAnchor="middle">AFK</text>
                </g>
              )}
            </g>
          </g>
        )
      )}

      {/* counter */}
      <g transform="translate(0,20)">
        <rect x="0" y="84" width="240" height="6" fill="#c48a52" />
        <rect x="0" y="90" width="240" height="18" fill="#8a5a32" />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 20 + 2} y="92" width="16" height="1" fill="#a86a3a" />)}
        <rect x="4" y="70" width="26" height="15" fill="#2a2a32" />
        <rect x="7" y="72" width="20" height="6" fill="#7dff9a" opacity="0.8" />
        <text x="17" y="77" fontSize="5" fontFamily="'VT323', monospace" fill="#0a2010" textAnchor="middle">#001</text>
        <rect x="196" y="80" width="10" height="4" fill="#ffd36e" />
        <rect x="200" y="77" width="2" height="3" fill="#ffd36e" />
        {SEASONINGS.map((sz, i) => {
          const on = order.seasons.includes(sz.id);
          const tilt = sprinkle === sz.id;
          return (
            <g key={sz.id} transform={`translate(${34 + i * 7},${on ? 74 : 76}) rotate(${tilt ? -35 : 0} 3 6)`}>
              <rect x="0" y="2" width="6" height="8" fill="#e8e8f0" opacity={on ? 1 : 0.55} />
              <rect x="0" y="0" width="6" height="3" fill={sz.color} />
              {tilt && [0, 1, 2].map((k) => <rect key={k} x={-2 - k * 2} y={-2 + k * 3} width="1" height="1" fill={sz.color} />)}
            </g>
          );
        })}
        {!carrying && (
          <g transform={`translate(${120 - 60 * s},${88 - 70 * s}) scale(${s})`}>
            <Food dish={order.dish} variant={order.variant} seasons={order.seasons} />
            <Drink id={order.drink} />
            {step === "cooking" && [30, 40, 50].map((x, i) => (
              <rect key={x} x={x} y="24" width="2" height="8" fill="#fff" opacity="0.5" className="steam" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </g>
        )}
      </g>

      {/* chef's side */}
      <g transform="translate(0,18)">
        <rect x="0" y="108" width="240" height="24" fill="#2a2a32" />
        <rect x="0" y="108" width="240" height="2" fill="#4a4a56" />
        <rect x="8" y="112" width="40" height="18" fill="#1a1a22" />
        <rect x="12" y="104" width="30" height="10" fill="#9aa4b0" />
        <rect x="10" y="104" width="34" height="2" fill="#c0c8d2" />
        {step === "cooking" && [16, 26, 36].map((x, i) => <rect key={x} x={x} y="98" width="2" height="6" fill="#fff" opacity="0.5" className="steam" style={{ animationDelay: `${i * 0.25}s` }} />)}
        <rect x="184" y="110" width="48" height="22" fill="#5a2a1a" />
        <rect x="192" y="116" width="32" height="10" fill={step === "cooking" ? "#ff7a2a" : "#2a0a05"} />
        <g className={step === "cooking" ? "stir" : ""}>
          <rect x="86" y="116" width="16" height="16" fill="#c2185b" />
          <rect x="88" y="110" width="12" height="7" fill="#f5c5a0" />
        </g>
        <g className={step === "cooking" ? "stir" : ""} style={{ animationDelay: ".2s" }}>
          <rect x="138" y="116" width="16" height="16" fill="#c2185b" />
          <rect x="140" y="110" width="12" height="7" fill="#f5c5a0" />
        </g>
        <rect x="91" y="114" width="6" height="2" fill={PINK} />
        <rect x="143" y="114" width="6" height="2" fill={PINK} />
      </g>
    </svg>
  );
}

/* ─────────────────────────── chef's dialogue ─────────────────────────── */
function ChefDialogue({ text }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <div className="flex gap-3 items-start" style={{ background: "#fff8f0", border: "3px solid #1a0a05", boxShadow: "4px 4px 0 #000", padding: "10px 12px" }}>
      <div style={{ width: 54, height: 54, flexShrink: 0, background: "#ffd9ea", border: "2px solid #1a0a05" }}>
        <svg viewBox="9 22 20 14" width="50" height="50" shapeRendering="crispEdges">
          <Heroine x={12} y={26} />
          <rect x="13" y="22" width="16" height="4" fill="#fff" />
          <rect x="15" y="19" width="12" height="4" fill="#fff" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: PIXEL, fontSize: 9, color: "#c2185b", marginBottom: 4 }}>CHEF TRASHI</div>
        <div style={{ fontFamily: READ, fontSize: 21, color: "#3a1a0a", lineHeight: 1.15, minHeight: 46 }}>{shown}</div>
      </div>
    </div>
  );
}

const kcalOf = (o) => {
  const dish = DISHES.find((d) => d.id === o.dish);
  const v = dish?.variants.find((x) => x.id === o.variant);
  return (v?.kcal || 0)
    + o.seasons.reduce((t, s) => t + SEASONINGS.find((x) => x.id === s).kcal, 0)
    + (DRINKS.find((d) => d.id === o.drink)?.kcal || 0);
};

export const describeOrder = (o) => {
  const dish = DISHES.find((d) => d.id === o.dish);
  const v = dish?.variants.find((x) => x.id === o.variant);
  if (!dish || !v) return "";
  return o.dish === "pasta" ? `${v.label.toLowerCase()} pasta` : `${v.label} ${dish.id}`.toLowerCase();
};

const EMPTY = { dish: null, variant: null, seasons: [], drink: null };

export default function CafeSpawn({ order: saved, onOrder, onEnterWorld }) {
  const [step, setStep] = useState(saved ? "served" : "dish");
  const [order, setOrder] = useState(saved || EMPTY);
  const [returning] = useState(!!saved);
  const [line, setLine] = useState(saved ? `Welcome back! Still enjoying your ${describeOrder(saved)}?` : OPENING.dish);
  const [mood, setMood] = useState("idle");
  const [sprinkle, setSprinkle] = useState(null);
  const [walking, setWalking] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, z: 0.05 });
  const [frame, setFrame] = useState(0);
  const [auto, setAuto] = useState(null); // null | "walk" | "gone"
  const [items, setItems] = useState(START_ITEMS);
  const [held, setHeld] = useState(null);
  const [drag, setDrag] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const svgRef = useRef(null);
  const lineIdx = useRef({});
  const FIT_QUERY = "(min-width: 900px) and (min-aspect-ratio: 1/1)";
  const [fit, setFit] = useState(() => window.matchMedia(FIT_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(FIT_QUERY);
    const on = () => setFit(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const [suggest, setSuggest] = useState(timeSuggestion);
  const [wxState, setWxState] = useState("idle"); // idle | loading | done | failed
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const dish = DISHES.find((d) => d.id === order.dish);
  const variant = dish?.variants.find((x) => x.id === order.variant);
  const stepIdx = STEPS.indexOf(step);
  const kcal = kcalOf(order);

  const say = (text, m = "idle") => { setLine(text); setMood(m); };

  const options =
    step === "dish" ? DISHES.map((d) => ({ id: d.id, label: d.label, sub: d.sub, art: <MiniFood dish={d.id} /> }))
    : step === "variant" ? dish.variants.map((v) => ({ id: v.id, label: v.label, sub: v.sub, swatch: v.color, kcal: v.kcal }))
    : step === "season" ? SEASONINGS.map((s) => ({ id: s.id, label: s.label, swatch: s.color, kcal: s.kcal }))
    : step === "drink" ? DRINKS.map((d) => ({ id: d.id, label: d.label, sub: d.sub, swatch: d.color, kcal: d.kcal, pick: d.id === suggest.drink }))
    : [];

  const isSelected = (id) =>
    step === "dish" ? order.dish === id
    : step === "variant" ? order.variant === id
    : step === "season" ? order.seasons.includes(id)
    : step === "drink" ? order.drink === id : false;

  const canNext = step === "dish" ? !!order.dish : step === "variant" ? !!order.variant : step === "drink" ? !!order.drink : true;

  const pick = (id) => {
    sfx.play("step");
    if (step === "dish") {
      setOrder((o) => ({ ...o, dish: id, variant: o.dish === id ? o.variant : null }));
      say(DISHES.find((d) => d.id === id).line, "happy");
    } else if (step === "variant") {
      setOrder((o) => ({ ...o, variant: id }));
      say(dish.variants.find((v) => v.id === id).line, "happy");
    } else if (step === "season") {
      const removing = order.seasons.includes(id);
      const nextSeasons = removing ? order.seasons.filter((x) => x !== id) : [...order.seasons, id];
      setOrder((o) => ({ ...o, seasons: nextSeasons }));
      if (removing) say("Changed your mind? Rollback successful.");
      else if (nextSeasons.length === SEASONINGS.length) say("ALL of them?! Chaos energy. I respect it.", "shock");
      else {
        say(SEASONINGS.find((s) => s.id === id).line, id === "cheese" || id === "chilli" ? "shock" : "happy");
        setSprinkle(id);
        later(() => setSprinkle(null), 500);
      }
    } else if (step === "drink") {
      setOrder((o) => ({ ...o, drink: id }));
      const heavy = order.seasons.includes("cheese") || order.seasons.includes("garlic");
      say(id === "diet" && heavy ? "Diet Coke... after all that cheese? Bold strategy." : DRINKS.find((d) => d.id === id).line, id === "diet" && heavy ? "shock" : "happy");
    }
  };

  const cook = () => {
    setStep("cooking");
    setMood("happy");
    const msgs = [
      `Firing up the stove for your ${variant.label.toLowerCase()}...`,
      order.seasons.length ? `Sprinkling ${order.seasons.map((s) => SEASONINGS.find((x) => x.id === s).label.toLowerCase()).join(", ")}...` : "Keeping it classic. No seasoning, no drama.",
      `Pouring your ${DRINKS.find((d) => d.id === order.drink).label.toLowerCase()}...`,
      "Plating it with a pinch of love ♥",
    ];
    msgs.forEach((m, i) => later(() => { setLine(m); sfx.play("type"); }, i * 700));
    later(() => {
      setStep("served");
      sfx.play("unlock");
      onOrder?.(order);
      const total = kcalOf(order);
      say(total > 1100
        ? `Order up! That's ${total} kcal. Relax, calories on portfolio sites don't count. Your table is through the gateway!`
        : `Order up! ${total} kcal, nicely balanced, like a good tech stack. Your table is through the gateway!`, "happy");
    }, msgs.length * 700 + 300);
  };

  const next = () => {
    if (!canNext) return;
    sfx.play("open");
    if (step === "dish") { setStep("variant"); say(`${dish.title}. The ${dish.label.toLowerCase()} here is legendary.`); }
    else if (step === "variant") { setStep("season"); say(OPENING.season); }
    else if (step === "season") {
      if (!order.seasons.length) say(`Plain? Minimalist. Like my CSS should be. Now, a drink? ${suggest.text}`);
      else say(`Something to drink? ${suggest.text}`);
      setStep("drink");
    } else if (step === "drink") cook();
  };

  const back = () => {
    if (stepIdx <= 0) return;
    sfx.play("back");
    setStep(STEPS[stepIdx - 1]);
    say("Going back? Take your time. I'm not judging. (I am a little.)");
  };

  const enterGateway = () => {
    if (walking) return;
    setHeld(null);
    setPanelOpen(false);
    setWalking(true);
    sfx.play("unlock");
    say("Follow the arrows! Your table's on the other side. Enjoy ♥", "happy");
    setAuto("walk");
    setPos({ x: 0.95, z: 0.95 });
    later(() => setAuto("gone"), 1700);
    later(onEnterWorld, 2100);
  };

  // ── moving stuff ──
  const moveLine = (kind) => {
    const k = ITEM_KINDS[kind];
    const n = (lineIdx.current[kind] = (lineIdx.current[kind] ?? -1) + 1);
    say(k.lines[n % k.lines.length], kind === "cat" ? "shock" : "happy");
  };

  const toggleCarry = () => {
    if (walking) return;
    if (held) {
      const kind = items.find((i) => i.id === held).kind;
      setItems((its) => its.map((i) => (i.id === held ? { ...i, x: Math.min(1, pos.x + 0.05), z: Math.min(1, pos.z + 0.06) } : i)));
      setHeld(null);
      sfx.play("back");
      say(kind === "cat" ? "Byte has been relocated. He's unimpressed." : "Placed. Very aesthetic, actually.");
      return;
    }
    const target = items.filter((i) => nearItem(pos, i)).sort((a, b) => Math.abs(a.z - pos.z) - Math.abs(b.z - pos.z))[0];
    if (!target) { say("Nothing to pick up here. Walk closer to something!"); return; }
    setHeld(target.id);
    sfx.play("open");
    moveLine(target.kind);
  };

  const grab = (id, e) => {
    if (walking || held === id) return;
    e.preventDefault();
    setDrag(id);
    sfx.play("open");
    moveLine(items.find((i) => i.id === id).kind);
  };

  useEffect(() => {
    if (!drag) return;
    const kind = START_ITEMS.find((i) => i.id === drag).kind;
    const onMove = (e) => {
      const svg = svgRef.current;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      const z = Math.min(1, Math.max(0, (116 - p.y) / 44));
      const x = Math.min(1, Math.max(0, (p.x - ITEM_KINDS[kind].cx * (scaleOf(z) / 3) - 14) / 186));
      setItems((its) => its.map((i) => (i.id === drag ? { ...i, x, z } : i)));
    };
    const onUp = () => setDrag(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [drag]);

  // move the visitor around the dining room
  const move = (dx, dz) => {
    if (walking) return;
    const next = { x: Math.min(1, Math.max(0, pos.x + dx)), z: Math.min(1, Math.max(0, pos.z + dz)) };
    if (next.x === pos.x && next.z === pos.z) return;
    setPos(next);
    setFrame((f) => 1 - f);
    const wasHere = atCounter(pos), isHere = atCounter(next);
    const ordering = step !== "served";
    if (wasHere && !isHere && ordering) say("Could have said AFK, but okay.", "idle");
    else if (!wasHere && isHere && ordering) say("Oh, you're back! Where were we?", "happy");
    if (atGateway(next) && !atGateway(pos)) {
      if (step === "served") {
        if (held) {
          const kind = items.find((i) => i.id === held).kind;
          setHeld(null);
          say(kind === "cat" ? "You can't take Byte to my world! ...fine, I'll keep him here." : `Leave my ${ITEM_KINDS[kind].name} here, please!`, "shock");
        }
        enterGateway();
      }
      else say("Not so fast! Order first, explore later.", "shock");
    }
  };

  const reorder = () => { setOrder(EMPTY); setStep("dish"); say("A fresh order? Love that energy. What are you craving?"); };

  const checkWeather = () => {
    if (!navigator.geolocation) { setWxState("failed"); return; }
    setWxState("loading");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // rounded to ~10 km: we only need the weather, not where you are
          const lat = coords.latitude.toFixed(1), lon = coords.longitude.toFixed(1);
          const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
          const j = await r.json();
          const sug = weatherSuggestion(j.current.temperature_2m, j.current.weather_code);
          setSuggest(sug);
          setWxState("done");
          say(sug.text, "happy");
        } catch {
          setWxState("failed");
        }
      },
      () => setWxState("failed"),
      { timeout: 8000, maximumAge: 600000 }
    );
  };

  // keyboard: number keys pick, Enter next, Backspace back
  const keyRef = useRef(null);
  const onKey = (e) => {
    const dirs = { ArrowLeft: [-0.04, 0], a: [-0.04, 0], A: [-0.04, 0], ArrowRight: [0.04, 0], d: [0.04, 0], D: [0.04, 0],
      ArrowUp: [0, 0.07], w: [0, 0.07], W: [0, 0.07], ArrowDown: [0, -0.07], s: [0, -0.07], S: [0, -0.07] };
    if (dirs[e.key]) { e.preventDefault(); move(...dirs[e.key]); return; }
    if (e.key === "e" || e.key === "E") { toggleCarry(); return; }
    if (!atCounter(pos) && step !== "served" && step !== "cooking") return;
    if (step === "served") { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enterGateway(); } return; }
    if (step === "cooking") return;
    const n = Number(e.key);
    if (n >= 1 && n <= options.length) pick(options[n - 1].id);
    else if (e.key === "Enter") { e.preventDefault(); next(); }
    else if (e.key === "Backspace") back();
  };
  useEffect(() => { keyRef.current = onKey; });
  useEffect(() => {
    const h = (e) => keyRef.current?.(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const drink = DRINKS.find((d) => d.id === order.drink);
  const ticketTitle = step === "dish" ? "WHAT ARE YOU CRAVING?" : step === "variant" ? dish.title.toUpperCase() : step === "season" ? "SEASONING (OPTIONAL)" : "BEVERAGE";

  return (
    <div className={`cafe-root ${fit ? "fit" : ""}`}>
      {/* the scene: we're the chef, the visitor is across the counter */}
      <div className="cafe-stage">
        <KitchenScene order={order} step={step} sky={suggest.sky} customerMood={mood} sprinkle={sprinkle} pos={pos} frame={frame} auto={auto}
          away={!atCounter(pos) && step !== "served"} items={items} held={held} onGrab={grab} svgRef={svgRef} fit={fit} />
      </div>

      {/* chef dialogue + live bill */}
      <div className="cafe-dialogue">
        {/* movement + carry controls */}
        <div className="cafe-dpad">
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(3, 36px)" }}>
            {[["✋", "grab"], ["▲", [0, 0.07]], ["", null], ["◀", [-0.06, 0]], ["▼", [0, -0.07]], ["▶", [0.06, 0]]].map(([lbl, d], i) => (
              d ? (
                <button key={i} onClick={() => (d === "grab" ? toggleCarry() : move(...d))} aria-label={d === "grab" ? "pick up or drop" : `move ${lbl}`} title={d === "grab" ? "pick up / drop (E)" : undefined}
                  style={{ height: 32, background: d === "grab" && held ? PINK : "#2a1206", border: "2px solid #c48a52", color: d === "grab" && held ? "#2a0a14" : "#ffcf6e", fontFamily: PIXEL, fontSize: 10, cursor: "pointer", boxShadow: "2px 2px 0 #000" }}>
                  {lbl}
                </button>
              ) : <span key={i} />
            ))}
          </div>
          <div style={{ fontFamily: READ, fontSize: 17, color: "#e8c9a8", lineHeight: 1.15, maxWidth: 230 }}>
            <b style={{ color: "#ffcf6e" }}>WASD / arrows</b> walk · <b style={{ color: "#ffcf6e" }}>E</b> pick up / drop · or <b style={{ color: "#ffcf6e" }}>drag</b> the furniture. Order at the counter.
          </div>
        </div>

          <div className="flex flex-col gap-3">
            <ChefDialogue text={line} />
            <div className="flex flex-wrap items-center gap-3 hud-chip" style={{ fontFamily: READ, fontSize: 19, color: "#e8c9a8" }}>
              <span style={{ background: "#2a1206", border: "2px solid #5a2a12", padding: "2px 10px" }}>
                🔥 {kcal} kcal
              </span>
              <span style={{ background: "#2a1206", border: "2px solid #5a2a12", padding: "2px 10px" }} title="drink suggestion">
                {suggest.icon} {wxState === "done" ? "your weather" : "your local time"}
              </span>
              {step === "drink" && wxState !== "done" && (
                <button onClick={checkWeather} disabled={wxState === "loading"} style={{ background: "none", border: "none", color: "#9fe8ff", fontFamily: READ, fontSize: 19, textDecoration: "underline", cursor: "pointer" }}>
                  {wxState === "loading" ? "checking the sky..." : wxState === "failed" ? "couldn't check, using your time" : "☁ use my weather instead"}
                </button>
              )}
            </div>
            {order.dish && (
              <div className="hud-chip" style={{ fontFamily: READ, fontSize: 19, color: "#c9a88a" }}>
                On the counter: {[variant ? (order.dish === "pasta" ? `${variant.label} Pasta` : variant.label) : dish.label, ...order.seasons.map((s) => SEASONINGS.find((x) => x.id === s).label), drink?.label].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
      </div>

      {/* the order ticket */}
      <div className={`cafe-ticket ${panelOpen ? "" : "closed"}`}>
        <button className="ticket-toggle" onClick={() => setPanelOpen((o) => !o)}
          style={{ background: "#c2185b", border: "2px solid #2a1a10", color: "#fff", fontFamily: PIXEL, fontSize: 9, padding: "8px 10px", cursor: "pointer", boxShadow: "3px 3px 0 #000", marginBottom: 8 }}>
          {panelOpen ? "◀ HIDE TICKET" : "📋 TICKET ▶"}
        </button>
        {panelOpen && (
          <div className="ticket" style={{ background: "#fffaf0", color: "#2a1a10", boxShadow: "5px 5px 0 #000", padding: "16px 16px 14px", alignSelf: "start", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 70, height: 14, background: "#9aa4b0", border: "2px solid #4a4a56" }} />
            {!atCounter(pos) && step !== "served" && step !== "cooking" && (
              <div className="reveal" style={{ position: "absolute", inset: 0, zIndex: 5, background: "rgba(255,250,240,.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: PIXEL, fontSize: 11, color: "#c2185b" }}>TICKET ON HOLD</div>
                <div style={{ fontFamily: READ, fontSize: 21, color: "#3a1a0a" }}>Walk back to the counter to keep ordering.</div>
                <button onClick={() => { setPos({ x: 0.5, z: 0.05 }); say("Oh, you're back! Where were we?", "happy"); }}
                  style={{ background: "#c2185b", border: "2px solid #2a1a10", color: "#fff", fontFamily: PIXEL, fontSize: 10, padding: "10px 12px", cursor: "pointer", boxShadow: "3px 3px 0 #2a1a10" }}>
                  ↩ BACK TO THE COUNTER
                </button>
              </div>
            )}
            {step !== "cooking" && step !== "served" && (
              <>
                <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                  <span style={{ fontFamily: PIXEL, fontSize: 9 }}>TICKET #001</span>
                  <span style={{ fontFamily: READ, fontSize: 18, color: "#8a6a50" }}>step {stepIdx + 1}/4</span>
                </div>
                <div className="flex gap-1" style={{ marginBottom: 12 }}>
                  {STEPS.map((s, i) => <div key={s} style={{ flex: 1, height: 5, background: i <= stepIdx ? "#c2185b" : "#e8dccc" }} />)}
                </div>
                <div key={step} className="zone-in" style={{ fontFamily: PIXEL, fontSize: 12, color: "#c2185b", marginBottom: 12, lineHeight: 1.5 }}>{ticketTitle}</div>
                <div className="grid gap-2" style={{ gridTemplateColumns: step === "dish" ? "repeat(auto-fit, minmax(120px, 1fr))" : "1fr" }}>
                  {options.map((o, i) => {
                    const sel = isSelected(o.id);
                    return (
                      <button key={o.id} onClick={() => pick(o.id)} className="chip-pop ticket-row"
                        style={{
                          animationDelay: `${i * 40}ms`, display: "flex", alignItems: "center", gap: 10, width: "100%", cursor: "pointer",
                          flexDirection: step === "dish" ? "column" : "row", textAlign: "left", padding: step === "dish" ? "8px" : "7px 10px",
                          background: sel ? "#ffe3ef" : "#fff", border: `2px ${sel ? "solid" : "dashed"} ${sel ? "#c2185b" : "#d8c8b8"}`,
                        }}>
                        {o.art && <div style={{ width: 90, height: 62 }}>{o.art}</div>}
                        {!o.art && <span style={{ width: 16, height: 16, flexShrink: 0, border: "2px solid #2a1a10", background: sel ? "#c2185b" : "transparent", color: "#fff", fontFamily: READ, fontSize: 14, lineHeight: "12px", textAlign: "center" }}>{sel ? "✓" : ""}</span>}
                        {o.swatch && <span style={{ width: 12, height: 12, background: o.swatch, border: "1px solid #2a1a10", flexShrink: 0 }} />}
                        <span style={{ flex: 1, textAlign: step === "dish" ? "center" : "left" }}>
                          <span style={{ fontFamily: PIXEL, fontSize: 10, display: "block", color: "#2a1a10" }}>
                            {o.label}{o.pick && <span style={{ marginLeft: 6, fontFamily: READ, fontSize: 16, background: "#9fe8ff", padding: "0 5px" }}>CHEF'S PICK</span>}
                          </span>
                          {o.sub && <span style={{ fontFamily: READ, fontSize: 17, color: "#8a6a50" }}>{o.sub}</span>}
                        </span>
                        {o.kcal !== undefined && <span style={{ fontFamily: READ, fontSize: 17, color: "#8a6a50", whiteSpace: "nowrap" }}>{o.kcal} kcal</span>}
                        <span style={{ fontFamily: READ, fontSize: 16, color: "#b8a898" }}>{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center gap-3" style={{ marginTop: 14 }}>
                  <button onClick={back} disabled={stepIdx === 0} className="disabled:opacity-30" style={{ background: "transparent", border: "2px solid #2a1a10", color: "#2a1a10", fontFamily: PIXEL, fontSize: 9, padding: "9px 11px", cursor: "pointer" }}>◀ BACK</button>
                  <button onClick={next} disabled={!canNext} className={canNext ? "pulse-glow" : "opacity-40"} style={{ background: canNext ? "#c2185b" : "#d8c8b8", border: "2px solid #2a1a10", color: "#fff", fontFamily: PIXEL, fontSize: 10, padding: "10px 13px", cursor: canNext ? "pointer" : "not-allowed", boxShadow: "3px 3px 0 #2a1a10" }}>
                    {step === "drink" ? "PLACE ORDER ♥" : step === "season" ? (order.seasons.length ? "NEXT ▶" : "NO THANKS ▶") : "NEXT ▶"}
                  </button>
                </div>
                <div className="hide-touch" style={{ fontFamily: READ, fontSize: 16, color: "#a89888", marginTop: 8, textAlign: "center" }}>number keys pick · ENTER next · BACKSPACE back</div>
                <button onClick={onEnterWorld} style={{ display: "block", margin: "6px auto 0", background: "none", border: "none", color: "#8a6a50", fontFamily: READ, fontSize: 17, cursor: "pointer", textDecoration: "underline" }}>
                  not hungry? skip to the world →
                </button>
              </>
            )}

            {step === "cooking" && (
              <div className="flex flex-col items-center gap-4" style={{ padding: "26px 6px" }}>
                <div style={{ fontFamily: PIXEL, fontSize: 13, color: "#c2185b" }}>COOKING...</div>
                <div style={{ width: "100%", height: 12, background: "#e8dccc", border: "2px solid #2a1a10" }}>
                  <div className="cook-bar" style={{ height: "100%", background: `linear-gradient(90deg, ${PINK}, #ffcf6e)` }} />
                </div>
                <div style={{ fontFamily: READ, fontSize: 19, color: "#8a6a50" }}>🔥 {kcal} kcal on the way</div>
              </div>
            )}

            {step === "served" && (
              <div className="reveal" style={{ fontFamily: READ, fontSize: 20 }}>
                <div style={{ fontFamily: PIXEL, fontSize: 11, textAlign: "center", marginBottom: 6 }}>TRASHI'S CAFÉ</div>
                <div style={{ textAlign: "center", fontSize: 17, color: "#7a6a5a", marginBottom: 10 }}>ticket #001 · table: beyond the gateway</div>
                {[
                  [variant ? (order.dish === "pasta" ? `${variant.label} Pasta` : variant.label) : "", `${variant?.kcal ?? 0} kcal`],
                  ...order.seasons.map((s) => { const x = SEASONINGS.find((y) => y.id === s); return [`+ ${x.label}`, `${x.kcal} kcal`]; }),
                  [drink?.label, `${drink?.kcal ?? 0} kcal`],
                  ["Sass from the chef", "free"],
                ].map(([a, b]) => (
                  <div key={a} className="flex justify-between"><span>{a}</span><span style={{ color: "#7a6a5a" }}>{b}</span></div>
                ))}
                <div style={{ borderTop: "2px dashed #b8a898", margin: "8px 0" }} />
                <div className="flex justify-between"><span>Calories</span><b>{kcal} kcal</b></div>
                <div className="flex justify-between" style={{ fontSize: 22 }}><b>TOTAL</b><b>1 interview call ;)</b></div>
                <div className="flex flex-col items-center gap-2" style={{ marginTop: 14 }}>
                  <button onClick={enterGateway} disabled={walking} className="pulse-glow" style={{ background: "#c2185b", border: "2px solid #2a1a10", color: "#fff", fontFamily: PIXEL, fontSize: 11, padding: "12px 14px", cursor: "pointer", boxShadow: "3px 3px 0 #2a1a10" }}>
                    {walking ? "WALKING TO THE GATEWAY..." : "▶ TAKE MY TRAY TO THE GATEWAY"}
                  </button>
                  {!walking && (
                    <button onClick={reorder} style={{ background: "none", border: "none", color: "#8a6a50", fontFamily: READ, fontSize: 18, cursor: "pointer", textDecoration: "underline" }}>
                      {returning ? "order something new" : "change my order"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniFood({ dish }) {
  const variant = { pasta: "pink", pizza: "margherita", sandwich: "club" }[dish];
  return (
    <svg viewBox="8 18 66 56" width="100%" height="100%" shapeRendering="crispEdges">
      <Food dish={dish} variant={variant} />
    </svg>
  );
}
