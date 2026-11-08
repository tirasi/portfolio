import { useEffect, useState, useCallback } from "react";
import { Heroine, Heart, PINK } from "@/components/pixel";
import { PIXEL, READ } from "@/lib/fonts";
import { sfx } from "@/lib/sfx";

/* ─────────────────────────── menu ─────────────────────────── */
const DISHES = [
  {
    id: "pasta", label: "Pasta", sub: "slow-cooked, fast-shipped", title: "Pick your sauce",
    variants: [
      { id: "white", label: "White Sauce", sub: "creamy alfredo", color: "#f3ead2" },
      { id: "red", label: "Red Sauce", sub: "tangy arrabbiata", color: "#d7332b" },
      { id: "pink", label: "Pink Sauce", sub: "the best of both", color: "#f28da6" },
    ],
  },
  {
    id: "pizza", label: "Pizza", sub: "8 slices of happiness", title: "Pick your pizza",
    variants: [
      { id: "margherita", label: "Margherita", sub: "classic cheese + basil", color: "#f6d365" },
      { id: "farmhouse", label: "Farmhouse Veggie", sub: "peppers, corn, olives", color: "#f2c14e" },
      { id: "paneer", label: "Paneer Tikka", sub: "smoky + spicy", color: "#f39c4a" },
    ],
  },
  {
    id: "sandwich", label: "Sandwich", sub: "stacked like a tech stack", title: "Pick your sandwich",
    variants: [
      { id: "grilled", label: "Grilled Cheese", sub: "golden + melty", color: "#f6c945" },
      { id: "club", label: "Veg Club", sub: "triple-decker", color: "#7bc96f" },
      { id: "bombay", label: "Bombay Masala", sub: "chutney + potato", color: "#e8a33d" },
    ],
  },
];

const SEASONINGS = [
  { id: "oregano", label: "Oregano", color: "#6a8f3a" },
  { id: "chilli", label: "Chilli Flakes", color: "#d0342c" },
  { id: "parmesan", label: "Parmesan", color: "#fff4cc" },
  { id: "garlic", label: "Garlic Butter", color: "#ffe08a" },
  { id: "cheese", label: "Extra Cheese", color: "#ffd23f" },
];

const DRINKS = [
  { id: "coffee", label: "Cold Coffee", sub: "for late-night debugging", color: "#a0703c" },
  { id: "shake", label: "Strawberry Shake", sub: "pink, obviously", color: "#ff9cc2" },
  { id: "chai", label: "Masala Chai", sub: "fuel of every hackathon", color: "#c08a5a" },
  { id: "lemon", label: "Iced Lemon Tea", sub: "fresh + zesty", color: "#e9c046" },
  { id: "water", label: "Water", sub: "stay hydrated, recruiter", color: "#9fd8ff" },
];

const STEPS = ["dish", "variant", "season", "drink"];
const LINES = {
  dish: "Welcome to Trashi's Café! What are you craving?",
  variant: "Ooh, great choice! Now pick your favourite.",
  season: "Any seasoning? Pick as many as you like.",
  drink: "And something to sip on?",
  cooking: "Cooking it with love... (and zero bugs)",
  served: "Bon appétit! Ready to explore my world?",
};

/* ─────────────────────────── tray art ─────────────────────────── */
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

function Tray({ order, steaming }) {
  return (
    <svg viewBox="0 0 120 84" width="100%" height="100%" shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect x="4" y="66" width="112" height="10" fill="#7a4a2a" />
      <rect x="4" y="66" width="112" height="2" fill="#a86a3a" />
      <Food dish={order.dish} variant={order.variant} seasons={order.seasons} />
      <Drink id={order.drink} />
      {steaming && [30, 40, 50].map((x, i) => (
        <rect key={x} x={x} y="26" width="2" height="8" fill="#fff" opacity="0.5" className="steam" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </svg>
  );
}

/* ─────────────────────────── café backdrop ─────────────────────────── */
function CafeBackdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg,#3a1d18 0 28px,#43221b 28px 56px)" }} />
      {/* string lights */}
      <svg className="absolute left-0 right-0 top-0" width="100%" height="70" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0,2 Q25,8 50,3 T100,3" stroke="#2a120a" strokeWidth="0.4" fill="none" />
      </svg>
      <div className="absolute left-0 right-0 flex justify-around" style={{ top: 18 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bulb" style={{ width: 10, height: 12, background: ["#ffcf6e", PINK, "#9fe8ff"][i % 3], boxShadow: `0 0 14px ${["#ffcf6e", PINK, "#9fe8ff"][i % 3]}`, marginTop: (i % 2) * 10, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      {/* floor + counter */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: "24%", background: "repeating-linear-gradient(90deg,#5a3320 0 40px,#4e2c1b 40px 80px)" }} />
      <div className="absolute left-0 right-0" style={{ bottom: "24%", height: 18, background: "#8a5a32", borderTop: "4px solid #c48a52" }} />
    </div>
  );
}

function MenuBoard() {
  return (
    <div className="hide-small" style={{ background: "#1e2a22", border: "6px solid #6a3a1a", boxShadow: "4px 4px 0 #1a0a05", padding: "12px 16px", width: 260 }}>
      <div style={{ fontFamily: PIXEL, fontSize: 10, color: "#ffcf6e", marginBottom: 8 }}>★ TODAY'S SPECIALS</div>
      {[["RAG-ù Bolognese", "context included"], ["LangGraph Lasagna", "6 layers, 0 bugs"], ["Prompt-ini Pizza", "well-engineered"], ["Hallucination-free Chai", "every claim verified"]].map(([a, b]) => (
        <div key={a} style={{ fontFamily: READ, fontSize: 19, color: "#e8f5e0", lineHeight: 1.1, marginBottom: 6 }}>
          {a}<div style={{ fontSize: 16, color: "#9fbf9a" }}>— {b}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── order flow ─────────────────────────── */
const tileStyle = (selected, color = "#ffcf6e") => ({
  background: selected ? "#2a1206" : "#120804",
  border: `2px solid ${selected ? color : "#5a2a12"}`,
  boxShadow: selected ? `0 0 14px ${color}88, 3px 3px 0 #000` : "3px 3px 0 #000",
  padding: "10px 12px", cursor: "pointer", textAlign: "left", transition: "all .15s",
  display: "flex", alignItems: "center", gap: 10, width: "100%",
});

export const describeOrder = (o) => {
  const dish = DISHES.find((d) => d.id === o.dish);
  const v = dish?.variants.find((x) => x.id === o.variant);
  if (!dish || !v) return "";
  return o.dish === "pasta" ? `${v.label.toLowerCase()} pasta` : `${v.label} ${dish.id}`.toLowerCase();
};

export default function CafeSpawn({ order: saved, onOrder, onEnterWorld }) {
  const [step, setStep] = useState(saved ? "served" : "dish");
  const [order, setOrder] = useState(saved || { dish: null, variant: null, seasons: [], drink: null });
  const [cookMsg, setCookMsg] = useState("");
  const [returning] = useState(!!saved); // came back from the map with an order already placed

  const dish = DISHES.find((d) => d.id === order.dish);
  const stepIdx = STEPS.indexOf(step);

  const options =
    step === "dish" ? DISHES.map((d) => ({ id: d.id, label: d.label, sub: d.sub, art: <MiniFood dish={d.id} /> }))
    : step === "variant" ? dish.variants.map((v) => ({ id: v.id, label: v.label, sub: v.sub, swatch: v.color }))
    : step === "season" ? SEASONINGS.map((s) => ({ id: s.id, label: s.label, swatch: s.color }))
    : step === "drink" ? DRINKS.map((d) => ({ id: d.id, label: d.label, sub: d.sub, swatch: d.color }))
    : [];

  const isSelected = (id) =>
    step === "dish" ? order.dish === id
    : step === "variant" ? order.variant === id
    : step === "season" ? order.seasons.includes(id)
    : step === "drink" ? order.drink === id : false;

  const canNext = step === "dish" ? !!order.dish : step === "variant" ? !!order.variant : step === "drink" ? !!order.drink : true;

  const pick = useCallback((id) => {
    sfx.play("step");
    setOrder((o) => {
      if (step === "dish") return { ...o, dish: id, variant: o.dish === id ? o.variant : null };
      if (step === "variant") return { ...o, variant: id };
      if (step === "season") return { ...o, seasons: o.seasons.includes(id) ? o.seasons.filter((x) => x !== id) : [...o.seasons, id] };
      if (step === "drink") return { ...o, drink: id };
      return o;
    });
  }, [step]);

  const cook = useCallback(() => {
    setStep("cooking");
    const v = DISHES.find((d) => d.id === order.dish).variants.find((x) => x.id === order.variant);
    const msgs = [
      `Preparing your ${v.label.toLowerCase()}...`,
      order.seasons.length ? `Sprinkling ${order.seasons.map((s) => SEASONINGS.find((x) => x.id === s).label.toLowerCase()).join(", ")}...` : "Keeping it classic...",
      `Pouring your ${DRINKS.find((d) => d.id === order.drink).label.toLowerCase()}...`,
      "Adding a pinch of love ♥",
    ];
    msgs.forEach((m, i) => setTimeout(() => { setCookMsg(m); sfx.play("type"); }, i * 650));
    setTimeout(() => { setStep("served"); sfx.play("unlock"); onOrder?.(order); }, msgs.length * 650 + 300);
  }, [order, onOrder]);

  const next = useCallback(() => {
    if (!canNext) return;
    sfx.play("open");
    if (step === "drink") cook();
    else setStep(STEPS[stepIdx + 1]);
  }, [canNext, step, stepIdx, cook]);

  const back = useCallback(() => {
    if (stepIdx > 0) { sfx.play("back"); setStep(STEPS[stepIdx - 1]); }
  }, [stepIdx]);

  const reorder = () => { setOrder({ dish: null, variant: null, seasons: [], drink: null }); setStep("dish"); };

  // keyboard: 1-5 pick, Enter next, Backspace back
  useEffect(() => {
    const onKey = (e) => {
      if (step === "served") { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEnterWorld(); } return; }
      if (step === "cooking") return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) pick(options[n - 1].id);
      else if (e.key === "Enter") { e.preventDefault(); next(); }
      else if (e.key === "Backspace") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, options, pick, next, back, onEnterWorld]);

  const v = dish?.variants.find((x) => x.id === order.variant);
  const drink = DRINKS.find((d) => d.id === order.drink);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "100vh", background: "#2a140e" }}>
      <CafeBackdrop />

      {/* sign */}
      <div className="relative z-10 flex justify-center" style={{ paddingTop: 54 }}>
        <div style={{ background: "#1a0a05", border: "3px solid #ffcf6e", boxShadow: "0 0 18px #ffb02e88, 5px 5px 0 #000", padding: "12px 22px" }}>
          <div className="neon" style={{ fontFamily: PIXEL, fontSize: 18, color: PINK, textShadow: `0 0 10px ${PINK}` }}>☕ TRASHI'S CAFÉ</div>
        </div>
      </div>

      <div className="relative z-10 cafe-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 18px 40px" }}>
        {/* left: hostess + tray */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-end gap-3">
            <div className="bob" style={{ width: 92, height: 104 }}>
              <svg viewBox="8 21 30 34" width="92" height="104" shapeRendering="crispEdges">
                <Heroine x={12} y={26} />
                {/* apron */}
                <rect x="17" y="40" width="12" height="9" fill="#fff" opacity="0.92" />
                <rect x="22" y="42" width="2" height="2" fill={PINK} />
              </svg>
            </div>
            <div key={step} className="reveal" style={{ background: "#fff8f0", border: "3px solid #1a0a05", padding: "10px 12px", maxWidth: 270, boxShadow: "4px 4px 0 #000", position: "relative" }}>
              <div style={{ fontFamily: READ, fontSize: 21, color: "#3a1a0a", lineHeight: 1.15 }}>
                {step === "served" && returning && saved ? `Welcome back! Still enjoying your ${describeOrder(saved)}?` : LINES[step]}
              </div>
            </div>
          </div>

          <div className="cafe-tray" style={{ width: "100%", maxWidth: 400, aspectRatio: "120 / 84", background: "#1a0c06", border: "3px solid #6a3a1a", boxShadow: "inset 0 0 30px #000, 5px 5px 0 #000" }}>
            <Tray order={order} steaming={step === "cooking" || step === "served"} />
          </div>
          <div style={{ fontFamily: READ, fontSize: 19, color: "#e8c9a8", textAlign: "center", minHeight: 24 }}>
            {order.dish ? `Your tray: ${[v ? (order.dish === "pasta" ? `${v.label} Pasta` : v.label) : dish.label, ...order.seasons.map((s) => SEASONINGS.find((x) => x.id === s).label), drink?.label].filter(Boolean).join(" · ")}` : "Your tray is empty (for now)"}
          </div>
          <MenuBoard />
        </div>

        {/* right: order panel */}
        <div style={{ background: "#160a05ee", border: "3px solid #c48a52", boxShadow: "6px 6px 0 #000", padding: "18px 18px 16px", alignSelf: "start" }}>
          {step !== "cooking" && step !== "served" && (
            <>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <span style={{ fontFamily: PIXEL, fontSize: 10, color: "#c48a52" }}>ORDER #001</span>
                <span style={{ fontFamily: READ, fontSize: 18, color: "#c48a52" }}>step {stepIdx + 1} of 4</span>
              </div>
              <div className="flex gap-1" style={{ marginBottom: 14 }}>
                {STEPS.map((s, i) => <div key={s} style={{ flex: 1, height: 6, background: i <= stepIdx ? PINK : "#3a1a0a" }} />)}
              </div>
              <div key={step} className="zone-in" style={{ fontFamily: PIXEL, fontSize: 14, color: "#ffcf6e", marginBottom: 14, lineHeight: 1.5 }}>
                {step === "dish" ? "What are you craving?" : step === "variant" ? dish.title : step === "season" ? "Add seasoning (optional)" : "Pick a beverage"}
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: step === "dish" ? "repeat(auto-fit, minmax(140px, 1fr))" : "1fr" }}>
                {options.map((o, i) => {
                  const sel = isSelected(o.id);
                  return (
                    <button key={o.id} onClick={() => pick(o.id)} className="chip-pop" style={{ ...tileStyle(sel, o.swatch || "#ffcf6e"), animationDelay: `${i * 50}ms`, flexDirection: step === "dish" ? "column" : "row" }}>
                      {o.art && <div style={{ width: 96, height: 68 }}>{o.art}</div>}
                      {o.swatch && <span style={{ width: 18, height: 18, background: o.swatch, border: "2px solid #000", flexShrink: 0 }} />}
                      <span style={{ flex: 1, textAlign: step === "dish" ? "center" : "left" }}>
                        <span style={{ fontFamily: PIXEL, fontSize: 11, color: sel ? "#fff" : "#ffcf6e", display: "block" }}>{o.label}</span>
                        {o.sub && <span style={{ fontFamily: READ, fontSize: 18, color: "#c9a88a" }}>{o.sub}</span>}
                      </span>
                      <span style={{ fontFamily: READ, fontSize: 18, color: "#7a5a40" }}>{sel ? (step === "season" ? "✓" : "♥") : i + 1}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center gap-3" style={{ marginTop: 16 }}>
                <button onClick={back} disabled={stepIdx === 0} className="disabled:opacity-30" style={{ background: "transparent", border: "2px solid #7a4a2a", color: "#e8c9a8", fontFamily: PIXEL, fontSize: 10, padding: "10px 12px", cursor: "pointer" }}>◀ BACK</button>
                <button onClick={next} disabled={!canNext} className={canNext ? "pulse-glow" : "opacity-40"} style={{ background: canNext ? PINK : "#3a1a0a", border: "2px solid #000", color: "#2a0a14", fontFamily: PIXEL, fontSize: 11, padding: "11px 14px", cursor: canNext ? "pointer" : "not-allowed", boxShadow: "3px 3px 0 #000" }}>
                  {step === "drink" ? "PLACE ORDER ♥" : step === "season" ? (order.seasons.length ? "NEXT ▶" : "NO THANKS ▶") : "NEXT ▶"}
                </button>
              </div>
              <div className="hide-touch" style={{ fontFamily: READ, fontSize: 17, color: "#7a5a40", marginTop: 10, textAlign: "center" }}>keys 1–5 pick · ENTER next · BACKSPACE back</div>
            </>
          )}

          {step === "cooking" && (
            <div className="flex flex-col items-center gap-4" style={{ padding: "30px 6px" }}>
              <div style={{ fontFamily: PIXEL, fontSize: 14, color: "#ffcf6e" }}>COOKING...</div>
              <div style={{ width: "100%", height: 12, background: "#3a1a0a", border: "2px solid #000" }}>
                <div className="cook-bar" style={{ height: "100%", background: `linear-gradient(90deg, ${PINK}, #ffcf6e)` }} />
              </div>
              <div key={cookMsg} className="reveal" style={{ fontFamily: READ, fontSize: 22, color: "#f3e6d8", minHeight: 28 }}>{cookMsg}</div>
            </div>
          )}

          {step === "served" && (
            <div className="reveal">
              <div style={{ background: "#fffaf0", color: "#2a1a10", padding: "16px 18px", boxShadow: "4px 4px 0 #000", fontFamily: READ, fontSize: 20, clipPath: "polygon(0 0,100% 0,100% 100%,96% 97%,92% 100%,88% 97%,84% 100%,80% 97%,76% 100%,72% 97%,68% 100%,64% 97%,60% 100%,56% 97%,52% 100%,48% 97%,44% 100%,40% 97%,36% 100%,32% 97%,28% 100%,24% 97%,20% 100%,16% 97%,12% 100%,8% 97%,4% 100%,0 97%)" }}>
                <div style={{ fontFamily: PIXEL, fontSize: 11, textAlign: "center", marginBottom: 8 }}>TRASHI'S CAFÉ</div>
                <div style={{ textAlign: "center", fontSize: 17, color: "#7a6a5a", marginBottom: 10 }}>order #001 · table: you</div>
                {[
                  [v ? (order.dish === "pasta" ? `${v.label} Pasta` : v.label) : "", "₹0"],
                  ...order.seasons.map((s) => [`+ ${SEASONINGS.find((x) => x.id === s).label}`, "free"]),
                  [drink?.label, "₹0"],
                  ["Good vibes", "included"],
                ].map(([a, b]) => (
                  <div key={a} className="flex justify-between"><span>{a}</span><span>{b}</span></div>
                ))}
                <div style={{ borderTop: "2px dashed #b8a898", margin: "10px 0" }} />
                <div className="flex justify-between" style={{ fontSize: 22 }}><b>TOTAL</b><b>1 interview call ;)</b></div>
                <div style={{ textAlign: "center", fontSize: 17, color: "#7a6a5a", marginTop: 10 }}>thank you, come again ♥</div>
              </div>
              <div className="flex flex-col items-center gap-3" style={{ marginTop: 18 }}>
                <button onClick={onEnterWorld} className="pulse-glow" style={{ background: PINK, border: "2px solid #000", color: "#2a0a14", fontFamily: PIXEL, fontSize: 12, padding: "13px 16px", cursor: "pointer", boxShadow: "3px 3px 0 #000" }}>
                  ▶ EAT & EXPLORE MY WORLD
                </button>
                <button onClick={reorder} style={{ background: "none", border: "none", color: "#c9a88a", fontFamily: READ, fontSize: 19, cursor: "pointer", textDecoration: "underline" }}>
                  change my order
                </button>
              </div>
            </div>
          )}

          {step !== "served" && step !== "cooking" && (
            <button onClick={onEnterWorld} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#8a6a50", fontFamily: READ, fontSize: 18, cursor: "pointer", textDecoration: "underline" }}>
              not hungry? skip to the world →
            </button>
          )}
        </div>
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
