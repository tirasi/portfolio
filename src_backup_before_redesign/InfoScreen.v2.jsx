import { LOCATIONS } from "@/data/locations";
import CornerBrackets from "@/components/CornerBrackets";
import Terminal from "@/components/Terminal";
import { ICONS } from "@/components/NodeIcon";
import { PIXEL, READ } from "@/lib/fonts";

const TEXT = "#f3e6d8";
const MUTED = "#c9a88a";

const Label = ({ color, children }) => (
  <div style={{ fontFamily: PIXEL, fontSize: 11, color, letterSpacing: 1, marginBottom: 8 }}>{children}</div>
);

const Card = ({ color, delay = 0, children, style }) => (
  <div
    className="reveal"
    style={{
      animationDelay: `${delay}ms`,
      background: "#0d0402",
      border: `2px solid ${color}55`,
      boxShadow: `4px 4px 0 ${color}22`,
      padding: "16px 20px",
      ...style,
    }}
  >
    {children}
  </div>
);

const Body = ({ children, style }) => (
  <div style={{ fontFamily: READ, fontSize: 22, lineHeight: 1.35, color: TEXT, whiteSpace: "pre-wrap", ...style }}>
    {children}
  </div>
);

function Quest({ loc }) {
  const q = loc.quest;
  const c = loc.color;
  return (
    <div className="quest-grid">
      <Card color={c} delay={0} style={{ gridColumn: "1 / -1" }}>
        <Label color={c}>⚑ QUEST</Label>
        <Body style={{ fontSize: 26 }}>{q.mission}</Body>
        <div style={{ fontFamily: READ, fontSize: 20, color: MUTED, marginTop: 8 }}>ROLE · {q.role}</div>
      </Card>

      <Card color={c} delay={120}>
        <Label color={c}>⚔ WHAT I DID</Label>
        {q.did.map((d, i) => (
          <Body key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ color: c }}>▸</span>
            <span>{d}</span>
          </Body>
        ))}
      </Card>

      <div className="grid gap-4 content-start">
        <Card color="#ff5a5a" delay={240}>
          <Label color="#ff7a7a">☠ BOSS DEFEATED</Label>
          <Body>{q.boss}</Body>
        </Card>
        <Card color="#ffcf6e" delay={360}>
          <Label color="#ffcf6e">★ OUTCOME</Label>
          <Body>{q.outcome}</Body>
        </Card>
      </div>

      <Card color={c} delay={480} style={{ gridColumn: "1 / -1" }}>
        <Label color={c}>✦ LOOT (TECH STACK)</Label>
        <div className="flex flex-wrap gap-2">
          {q.loot.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: READ, fontSize: 20, color: TEXT, padding: "2px 10px",
                border: `1px solid ${c}`, background: `${c}18`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {q.links?.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {q.links.map((l) => (
              <a
                key={l.url} href={l.url} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: PIXEL, fontSize: 11, color: "#0a0200", background: c,
                  padding: "10px 14px", textDecoration: "none", boxShadow: "3px 3px 0 #000",
                }}
              >
                ↗ {l.label}
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Citadel({ loc }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      {loc.citadel.map((sec, i) => (
        <Card key={sec.title} color={loc.color} delay={i * 120}>
          <Label color={loc.color}>{sec.title}</Label>
          {sec.items.map((it) => (
            <div key={it.head} style={{ marginBottom: 10 }}>
              <Body style={{ fontSize: 23 }}>{it.head}</Body>
              <div style={{ fontFamily: READ, fontSize: 19, color: MUTED }}>{it.meta}</div>
              {it.note && <div style={{ fontFamily: READ, fontSize: 20, color: "#ffcf6e" }}>{it.note}</div>}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

function Intro({ loc }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      {loc.intro.map((sec, i) => (
        <Card key={sec.title} color={loc.color} delay={i * 140}>
          <Label color={loc.color}>▸ {sec.title}</Label>
          <Body>{sec.body}</Body>
        </Card>
      ))}
    </div>
  );
}

export default function InfoScreen({ current, explored, onClose, onNav, onQuickView }) {
  const loc = LOCATIONS[current];
  const Icon = ICONS[loc.icon];
  const c = loc.color;

  return (
    <div className="absolute inset-0 z-[100] flex flex-col" style={{ backgroundColor: "#050100", backgroundImage: `radial-gradient(ellipse at top, ${c}1f, transparent 60%)` }}>
      {/* Header */}
      <div
        className="flex items-center justify-between flex-shrink-0 gap-3"
        style={{ padding: "14px 20px", background: "#0a0200", borderBottom: `2px solid ${c}66` }}
      >
        <div key={loc.id} className="zone-in flex items-center gap-4">
          <div style={{ border: `2px solid ${c}`, padding: 4, background: "#140300" }}><Icon c={c} /></div>
          <div>
            <div style={{ fontFamily: PIXEL, fontSize: 16, color: c, textShadow: `0 0 8px ${c}` }}>{loc.name}</div>
            <div style={{ fontFamily: READ, fontSize: 20, color: MUTED, marginTop: 4 }}>{loc.sub}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#120300", border: `2px solid ${c}`, color: c, fontFamily: PIXEL,
            fontSize: 11, padding: "10px 12px", cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          ✕ MAP <span style={{ fontFamily: READ, fontSize: 16, opacity: 0.7 }}>(ESC)</span>
        </button>
      </div>

      {/* Body */}
      <div key={loc.id} className="flex-1 overflow-y-auto" style={{ padding: "22px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {loc.kind === "intro" && <Intro loc={loc} />}
          {loc.kind === "quest" && <Quest loc={loc} />}
          {loc.kind === "citadel" && <Citadel loc={loc} />}
          {loc.kind === "terminal" && <Terminal color={c} onQuickView={onQuickView} />}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between flex-shrink-0 gap-2"
        style={{ padding: "12px 20px", background: "#0a0200", borderTop: `2px solid ${c}66` }}
      >
        {[-1, 1].map((dir) => {
          const disabled = dir < 0 ? current === 0 : current === LOCATIONS.length - 1;
          const label = dir < 0 ? "◀ PREV" : "NEXT ▶";
          const btnEl = (
            <button
              key={dir}
              disabled={disabled}
              onClick={() => onNav(dir)}
              className="disabled:opacity-30"
              style={{
                background: "#120300", border: `2px solid ${c}`, color: c, fontFamily: PIXEL,
                fontSize: 11, padding: "10px 14px", cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {label}
            </button>
          );
          if (dir < 0) return btnEl;
          return [
            <div key="dots" className="flex-1 flex justify-center gap-2">
              {LOCATIONS.map((l, i) => (
                <div
                  key={i}
                  title={l.name}
                  style={{
                    width: 12, height: 12,
                    border: `1.5px solid ${l.color}`,
                    background: i === current ? l.color : explored.has(i) ? `${l.color}66` : "transparent",
                    boxShadow: i === current ? `0 0 8px ${l.color}` : "none",
                  }}
                />
              ))}
            </div>,
            btnEl,
          ];
        })}
      </div>

      <CornerBrackets />
    </div>
  );
}
