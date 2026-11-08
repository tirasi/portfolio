import { useState, useRef, useEffect } from "react";
import { LOCATIONS, PROFILE, SKILLS } from "@/data/locations";
import { READ } from "@/lib/fonts";
import { sfx } from "@/lib/sfx";

const projects = LOCATIONS.filter((l) => l.kind === "quest");

function run(cmdRaw) {
  const cmd = cmdRaw.trim().toLowerCase();
  const [base, ...rest] = cmd.split(/\s+/);
  switch (base) {
    case "":
      return [];
    case "help":
      return [
        "available commands:",
        "  whoami      who is this person?",
        "  skills      what I work with",
        "  projects    things I've built",
        "  project <n> details of one project",
        "  awards      trophies collected",
        "  contact     how to reach me",
        "  resume      quick one-page view",
        "  clear       clear the screen",
      ];
    case "whoami":
      return [`${PROFILE.name} — ${PROFILE.title}`, "", PROFILE.summary];
    case "skills":
      return Object.entries(SKILLS).flatMap(([k, v]) => [`[${k}]`, `  ${v.join(", ")}`]);
    case "projects":
    case "ls":
      return [
        ...projects.map((p, i) => `  ${i + 1}. ${p.name.padEnd(20)} ${p.sub.replace("// ", "")}`),
        "",
        "type 'project 1' (or 2, 3...) for details",
      ];
    case "project": {
      const p = projects[Number(rest[0]) - 1];
      if (!p) return [`no project '${rest[0] ?? ""}'. try 'projects'.`];
      return [
        `${p.name} — ${p.sub.replace("// ", "")}`,
        `mission: ${p.quest.mission}`,
        ...p.quest.did.map((d) => `  ▸ ${d}`),
        `outcome: ${p.quest.outcome}`,
        `stack:   ${p.quest.loot.join(", ")}`,
      ];
    }
    case "awards":
      return LOCATIONS.find((l) => l.kind === "citadel").citadel
        .find((s) => s.title === "TROPHIES").items.map((i) => `  ${i.head} — ${i.meta}`);
    case "contact":
      return [`email:    ${PROFILE.email}`, `linkedin: ${PROFILE.linkedin}`, `github:   ${PROFILE.github}`, `leetcode: ${PROFILE.leetcode}`];
    case "resume":
      return ["__QUICKVIEW__"];
    case "sudo":
      return rest.join(" ") === "hire-me" || rest.join(" ") === "hire me"
        ? ["[sudo] permission granted.", `opening mail client... ${PROFILE.email}`, "__MAIL__"]
        : ["nice try. (hint: sudo hire-me)"];
    case "rm":
      return ["permission denied: this portfolio is load-bearing."];
    case "exit":
      return ["there is no exit. only more projects. (press ESC for the map)"];
    default:
      return [`command not found: ${base}. type 'help'.`];
  }
}

export default function Terminal({ color, onQuickView }) {
  const [lines, setLines] = useState([
    "TRASHI-OS v2.0 — type 'help' and press Enter",
    "",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const cmd = input;
    setInput("");
    setHIdx(-1);
    if (cmd.trim()) setHistory((h) => [cmd, ...h]);
    if (cmd.trim().toLowerCase() === "clear") { setLines([]); return; }
    const out = run(cmd);
    sfx.play("type");
    if (out.includes("__QUICKVIEW__")) { onQuickView?.(); return; }
    if (out.includes("__MAIL__")) window.location.href = `mailto:${PROFILE.email}`;
    setLines((l) => [...l, `trashi@portfolio:~$ ${cmd}`, ...out.filter((x) => !x.startsWith("__")), ""]);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = Math.min(hIdx + 1, history.length - 1);
      setHIdx(i); setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(i); setInput(i >= 0 ? history[i] : "");
    }
  };

  return (
    <div
      className="reveal"
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "#010805", border: `2px solid ${color}`, boxShadow: `0 0 24px ${color}33`,
        padding: "16px 18px", minHeight: 420, fontFamily: READ, fontSize: 21, color, cursor: "text",
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap", minHeight: "1.1em", textShadow: `0 0 4px ${color}88` }}>{l}</div>
      ))}
      <form onSubmit={submit} className="flex gap-2">
        <span>trashi@portfolio:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="terminal input"
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color, fontFamily: READ, fontSize: 21, caretColor: color,
          }}
        />
      </form>
      <div ref={endRef} />
      <div className="flex flex-wrap gap-2 mt-3">
        {["help", "whoami", "projects", "skills", "contact"].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => { setInput(c); inputRef.current?.focus(); }}
            style={{ background: "transparent", border: `1px solid ${color}66`, color, fontFamily: READ, fontSize: 18, padding: "0 8px", cursor: "pointer" }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
