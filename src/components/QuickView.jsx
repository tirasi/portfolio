import { LOCATIONS, PROFILE, SKILLS } from "@/data/locations";
import { PIXEL } from "@/lib/fonts";
import { useResumeAvailable } from "@/lib/useResumeAvailable";

// Plain, fast, readable one-page view for recruiters who don't want to play.
const SANS = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const ACCENT = "#ff7a3d";

const H = ({ children }) => (
  <h2 style={{ fontFamily: PIXEL, fontSize: 12, color: ACCENT, letterSpacing: 1, margin: "34px 0 14px", borderBottom: "1px solid #3a1a0a", paddingBottom: 8 }}>
    {children}
  </h2>
);

export default function QuickView({ onPlay }) {
  const resumeOk = useResumeAvailable();
  const quests = LOCATIONS.filter((l) => l.kind === "quest");
  const citadel = LOCATIONS.find((l) => l.kind === "citadel").citadel;

  const linkBtn = (primary) => ({
    fontFamily: PIXEL, fontSize: 10, padding: "11px 14px", textDecoration: "none", cursor: "pointer",
    border: `2px solid ${ACCENT}`, background: primary ? ACCENT : "transparent", color: primary ? "#120500" : ACCENT,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0d0907", color: "#eadfd6", fontFamily: SANS }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <button onClick={onPlay} style={linkBtn(false)}>▶ PLAY THE GAME VERSION</button>
          {resumeOk && <a href={PROFILE.resume} download style={linkBtn(true)}>⬇ DOWNLOAD RESUME</a>}
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 800, margin: "36px 0 6px", color: "#fff" }}>{PROFILE.name}</h1>
        <div style={{ fontSize: 18, color: ACCENT, fontWeight: 600 }}>{PROFILE.title}</div>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "#cbbcb0", marginTop: 14 }}>{PROFILE.summary}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2" style={{ fontSize: 15, marginTop: 10 }}>
          <a href={`mailto:${PROFILE.email}`} style={{ color: "#ffb98f" }}>{PROFILE.email}</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" style={{ color: "#ffb98f" }}>LinkedIn</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" style={{ color: "#ffb98f" }}>GitHub</a>
          <a href={PROFILE.leetcode} target="_blank" rel="noreferrer" style={{ color: "#ffb98f" }}>LeetCode</a>
        </div>

        <H>EXPERIENCE & PROJECTS</H>
        {quests.map((q) => (
          <div key={q.id} style={{ marginBottom: 24, paddingLeft: 14, borderLeft: `3px solid ${q.color}` }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>{q.sub.replace("// ", "")}</div>
            <div style={{ fontSize: 15, color: "#a8978a", margin: "2px 0 8px" }}>{q.quest.role}</div>
            <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", lineHeight: 1.6, fontSize: 16 }}>
              {q.quest.did.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <div style={{ fontSize: 15, color: "#ffcf6e", marginTop: 6 }}>{q.quest.outcome}</div>
            <div style={{ fontSize: 14, color: "#a8978a", marginTop: 4 }}>{q.quest.loot.join(" · ")}</div>
          </div>
        ))}

        <H>SKILLS</H>
        {Object.entries(SKILLS).map(([k, v]) => (
          <div key={k} style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 4 }}>
            <b style={{ color: "#fff" }}>{k}:</b> {v.join(", ")}
          </div>
        ))}

        {citadel.map((sec) => (
          <div key={sec.title}>
            <H>{sec.title}</H>
            {sec.items.map((it) => (
              <div key={it.head} style={{ marginBottom: 10, fontSize: 16 }}>
                <div style={{ fontWeight: 600, color: "#fff" }}>{it.head}</div>
                <div style={{ color: "#a8978a" }}>{it.meta}{it.note ? ` · ${it.note}` : ""}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
