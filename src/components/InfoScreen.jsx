import { useEffect, useRef, useState, useCallback } from "react";
import { LOCATIONS } from "@/data/locations";
import CornerBrackets from "@/components/CornerBrackets";
import Terminal from "@/components/Terminal";
import StoryScene from "@/components/StoryScene";
import { ICONS } from "@/components/NodeIcon";
import { PIXEL, READ } from "@/lib/fonts";

const TEXT = "#f3e6d8";
const MUTED = "#c9a88a";
const clamp = (v) => Math.max(0, Math.min(1, v));

const Label = ({ color, children }) => (
  <div style={{ fontFamily: PIXEL, fontSize: 12, color, letterSpacing: 1, marginBottom: 12, textShadow: `0 0 8px ${color}88` }}>{children}</div>
);
const Body = ({ children, style }) => (
  <div style={{ fontFamily: READ, fontSize: 23, lineHeight: 1.35, color: TEXT, whiteSpace: "pre-wrap", ...style }}>{children}</div>
);
const Chips = ({ items, c }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((t, i) => (
      <span key={t} className="chip-pop" style={{ animationDelay: `${i * 70}ms`, fontFamily: READ, fontSize: 21, color: TEXT, padding: "3px 11px", border: `1px solid ${c}`, background: `${c}1c`, boxShadow: `2px 2px 0 ${c}44` }}>
        {t}
      </span>
    ))}
  </div>
);

// Turn a zone into an ordered list of story sections, each tied to a scene stage.
function buildSections(loc) {
  const c = loc.color;
  if (loc.kind === "quest") {
    const q = loc.quest;
    return [
      { stage: "scroll", label: "QUEST", color: c, body: (<><Body style={{ fontSize: 30, lineHeight: 1.25 }}>{q.mission}</Body><div style={{ fontFamily: READ, fontSize: 21, color: MUTED, marginTop: 14 }}>ROLE · {q.role}</div></>) },
      { stage: "katana", label: "WHAT I DID", color: c, body: q.did.map((d, i) => (
        <Body key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}><span style={{ color: c }}>▸</span><span>{d}</span></Body>
      )) },
      { stage: "boss", label: "BOSS DEFEATED", color: "#ff6b6b", body: <Body style={{ fontSize: 26 }}>{q.boss}</Body> },
      { stage: "trophy", label: "OUTCOME", color: "#ffcf6e", body: <Body style={{ fontSize: 26 }}>{q.outcome}</Body> },
      { stage: "chest", label: "LOOT · TECH STACK", color: c, body: (
        <>
          <Chips items={q.loot} c={c} />
          {q.links?.length > 0 && (
            <div className="flex gap-3 mt-6 flex-wrap">
              {q.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="pulse-glow"
                  style={{ fontFamily: PIXEL, fontSize: 11, color: "#0a0200", background: c, padding: "12px 16px", textDecoration: "none", boxShadow: "3px 3px 0 #000" }}>
                  ↗ {l.label}
                </a>
              ))}
            </div>
          )}
        </>
      ) },
    ];
  }
  if (loc.kind === "citadel") {
    const stageFor = { EDUCATION: "scroll", TROPHIES: "trophy", CERTIFICATIONS: "chest", LEADERSHIP: "katana" };
    return loc.citadel.map((sec) => ({
      stage: stageFor[sec.title] || "scroll",
      label: sec.title,
      color: sec.title === "TROPHIES" ? "#ffcf6e" : c,
      body: sec.items.map((it) => (
        <div key={it.head} style={{ marginBottom: 14 }}>
          <Body style={{ fontSize: 25 }}>{it.head}</Body>
          <div style={{ fontFamily: READ, fontSize: 20, color: MUTED }}>{it.meta}</div>
          {it.note && <div style={{ fontFamily: READ, fontSize: 22, color: "#ffcf6e" }}>{it.note}</div>}
        </div>
      )),
    }));
  }
  // intro
  return loc.intro.map((sec, i) => ({ stage: i === 0 ? "scroll" : "katana", label: sec.title, color: c, body: <Body>{sec.body}</Body> }));
}

// Katana-shaped scroll progress bar: the blade grows as you read.
function KatanaProgress({ g, c }) {
  return (
    <div className="flex items-center" style={{ height: 14, padding: "0 20px", background: "#0a0200" }} aria-hidden>
      <div style={{ width: 26, height: 8, background: "repeating-linear-gradient(90deg,#1a0a0a 0 3px,#7a1010 3px 5px)" }} />
      <div style={{ width: 3, height: 14, background: "#c9a24a" }} />
      <div style={{ flex: 1, height: 6, position: "relative", background: "#1a0705" }}>
        <div style={{ position: "absolute", inset: 0, width: `${g * 100}%`, background: `linear-gradient(90deg,#cfd8e6,#ffffff)`, boxShadow: `0 0 8px ${c}`, clipPath: "polygon(0 0,100% 30%,100% 100%,0 100%)", transition: "width .08s linear" }} />
      </div>
    </div>
  );
}

export default function InfoScreen({ current, explored, onClose, onNav, onQuickView }) {
  const loc = LOCATIONS[current];
  const Icon = ICONS[loc.icon];
  const c = loc.color;
  const sections = loc.kind === "terminal" ? [] : buildSections(loc);

  const bodyRef = useRef(null);
  const secRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);
  const [g, setG] = useState(0);
  // which section cards have been revealed, tracked per zone
  const [shownState, setShownState] = useState({ zone: current, set: new Set() });
  const shown = shownState.zone === current ? shownState.set : new Set();

  const measure = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setG(max > 0 ? clamp(el.scrollTop / max) : 0);
    const mid = el.scrollTop + el.clientHeight * 0.55;
    let idx = 0;
    secRefs.current.forEach((s, i) => { if (s && s.offsetTop <= mid) idx = i; });
    const s = secRefs.current[idx];
    if (s) {
      setActive(idx);
      setProg(clamp((mid - s.offsetTop) / Math.max(s.offsetHeight * 0.8, 1)));
    }
  }, []);

  // the scroll body is keyed by zone, so it remounts at the top; re-measure after paint
  useEffect(() => {
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [current, measure]);

  // reveal each section with a sword-slash wipe as it enters view
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const i = Number(e.target.dataset.idx);
          setShownState((prev) => {
            const base = prev.zone === current ? prev.set : new Set();
            return base.has(i) ? prev : { zone: current, set: new Set([...base, i]) };
          });
        }
      });
    }, { root, threshold: 0.2 });
    secRefs.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, [current]);

  const sec = sections[active];

  return (
    <div className="absolute inset-0 z-[100] flex flex-col" style={{ backgroundColor: "#050100" }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ background: "#0a0200", borderBottom: `2px solid ${c}66` }}>
        <div className="flex items-center justify-between gap-3" style={{ padding: "12px 20px 8px" }}>
          <div key={loc.id} className="zone-in flex items-center gap-4">
            <div style={{ border: `2px solid ${c}`, padding: 4, background: "#140300" }}><Icon c={c} /></div>
            <div>
              <div style={{ fontFamily: PIXEL, fontSize: "clamp(11px, 3vw, 16px)", color: c, textShadow: `0 0 8px ${c}` }}>{loc.name}</div>
              <div className="zone-sub" style={{ fontFamily: READ, fontSize: 20, color: MUTED, marginTop: 4 }}>{loc.sub}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#120300", border: `2px solid ${c}`, color: c, fontFamily: PIXEL, fontSize: 11, padding: "10px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>
            ✕ MAP <span style={{ fontFamily: READ, fontSize: 16, opacity: 0.7 }}>(ESC)</span>
          </button>
        </div>
        {loc.kind !== "terminal" && <KatanaProgress g={g} c={c} />}
      </div>

      {/* Body */}
      {loc.kind === "terminal" ? (
        <div className="flex-1 overflow-y-auto" style={{ padding: "22px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}><Terminal color={c} onQuickView={onQuickView} /></div>
        </div>
      ) : (
        <div key={loc.id} ref={bodyRef} onScroll={() => requestAnimationFrame(measure)} className="flex-1 overflow-y-auto story-body" style={{ position: "relative" }}>
          <div className="story-grid">
            {/* sticky scene */}
            <div className="story-scene">
              {sec && (
                <StoryScene theme={loc.icon} stage={sec.stage} p={prog} g={g} color={sec.color} label={sec.label} step={active + 1} total={sections.length} />
              )}
              <div className="scene-hint" style={{ fontFamily: READ, fontSize: 18, color: "#8a6a50", textAlign: "center", marginTop: 8 }}>
                {active === sections.length - 1 ? "← → next zone · ESC map" : "scroll ↓ to continue the story"}
              </div>
            </div>

            {/* story sections */}
            <div>
              {sections.map((s, i) => (
                <section
                  key={i}
                  data-idx={i}
                  ref={(el) => (secRefs.current[i] = el)}
                  className="story-section"
                >
                  <div className={`slash-card ${shown.has(i) ? "in" : ""} ${i % 2 ? "from-right" : ""}`}
                    style={{ "--c": s.color, background: "#0d0402", border: `2px solid ${s.color}${i === active ? "cc" : "44"}`, boxShadow: i === active ? `0 0 26px ${s.color}33, 5px 5px 0 ${s.color}22` : `5px 5px 0 ${s.color}11`, padding: "20px 22px", transition: "border-color .3s, box-shadow .3s" }}>
                    <Label color={s.color}>{String(i + 1).padStart(2, "0")} · {s.label}</Label>
                    {s.body}
                  </div>
                </section>
              ))}
              <div style={{ height: "30vh" }} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-shrink-0 gap-2" style={{ padding: "10px 20px", background: "#0a0200", borderTop: `2px solid ${c}66` }}>
        <button disabled={current === 0} onClick={() => onNav(-1)} className="disabled:opacity-30"
          style={{ background: "#120300", border: `2px solid ${c}`, color: c, fontFamily: PIXEL, fontSize: 11, padding: "10px 14px", cursor: current === 0 ? "not-allowed" : "pointer" }}>
          ◀ PREV
        </button>
        <div className="flex-1 flex justify-center gap-2">
          {LOCATIONS.map((l, i) => (
            <div key={i} title={l.name} style={{ width: 12, height: 12, border: `1.5px solid ${l.color}`, background: i === current ? l.color : explored.has(i) ? `${l.color}66` : "transparent", boxShadow: i === current ? `0 0 8px ${l.color}` : "none" }} />
          ))}
        </div>
        <button disabled={current === LOCATIONS.length - 1} onClick={() => onNav(1)} className="disabled:opacity-30"
          style={{ background: "#120300", border: `2px solid ${c}`, color: c, fontFamily: PIXEL, fontSize: 11, padding: "10px 14px", cursor: current === LOCATIONS.length - 1 ? "not-allowed" : "pointer" }}>
          NEXT ▶
        </button>
      </div>

      <CornerBrackets />
    </div>
  );
}
