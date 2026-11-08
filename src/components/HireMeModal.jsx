import { PROFILE } from "@/data/locations";
import { PIXEL, READ } from "@/lib/fonts";
import { useResumeAvailable } from "@/lib/useResumeAvailable";

export default function HireMeModal({ onClose }) {
  const resumeOk = useResumeAvailable();
  const btn = (bg, fg) => ({
    fontFamily: PIXEL, fontSize: 11, padding: "12px 14px", background: bg, color: fg,
    border: "2px solid #ffcf6e", textDecoration: "none", boxShadow: "3px 3px 0 #000", display: "inline-block",
  });
  return (
    <div className="absolute inset-0 z-[400] flex items-center justify-center" style={{ background: "rgba(0,0,0,.82)", padding: 20 }} onClick={onClose}>
      <div
        className="reveal"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#120500", border: "3px solid #ffcf6e", boxShadow: "0 0 40px #ffb02e66, 8px 8px 0 #3a1500", padding: "28px 26px", maxWidth: 560, textAlign: "center" }}
      >
        <div style={{ fontFamily: PIXEL, fontSize: 18, color: "#ffcf6e", textShadow: "0 0 10px #ffb02e", lineHeight: 1.6 }}>★ QUEST COMPLETE ★</div>
        <p style={{ fontFamily: READ, fontSize: 24, color: "#f3e6d8", lineHeight: 1.3, margin: "16px 0 22px" }}>
          You explored every zone. Final boss: deciding whether to talk to me.
          <br />(Spoiler: the good ending is the one where you do.)
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href={`mailto:${PROFILE.email}`} style={btn("#ffcf6e", "#120500")}>✉ EMAIL ME</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" style={btn("transparent", "#ffcf6e")}>LINKEDIN</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" style={btn("transparent", "#ffcf6e")}>GITHUB</a>
          {resumeOk && <a href={PROFILE.resume} download style={btn("transparent", "#ffcf6e")}>⬇ RESUME</a>}
        </div>
        <button onClick={onClose} style={{ marginTop: 20, background: "none", border: "none", color: "#b37a4c", fontFamily: READ, fontSize: 20, cursor: "pointer" }}>
          keep exploring (ESC)
        </button>
      </div>
    </div>
  );
}
