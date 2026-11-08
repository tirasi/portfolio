import { useState, useCallback, useEffect, useRef } from "react";
import { LOCATIONS } from "@/data/locations";
import MapScreen, { VEND, XP_PER_ROOM, MAP_W } from "@/components/MapScreen";
import InfoScreen from "@/components/InfoScreen";
import HireMeModal from "@/components/HireMeModal";
import VendingMachine from "@/components/VendingMachine";
import CRTOverlay from "@/components/CRTOverlay";
import SlashTransition from "@/components/SlashTransition";
import { PIXEL, READ } from "@/lib/fonts";
import { sfx } from "@/lib/sfx";

const QUEST_IDS = LOCATIONS.filter((l) => l.id !== 0).map((l) => l.id);
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const SPEED = 190; // px per second while walking
const NEAR = 40; // how close counts as "standing on" a room
const BOUNDS = { x0: 20, x1: MAP_W - 20, y0: 110, y1: 490 };
const XP_PER_SNACK = 10;
const XP_PER_LEVEL = 200;
const STORE = "trashi-progress-v1";

const nodePos = (i) => ({ x: LOCATIONS[i].mapX, y: LOCATIONS[i].mapY + 14 });
const nearestNode = (p) => {
  let best = null, bd = Infinity;
  LOCATIONS.forEach((l, i) => {
    const d = Math.hypot(l.mapX - p.x, l.mapY + 14 - p.y);
    if (d < bd) { bd = d; best = i; }
  });
  return bd <= NEAR ? best : null;
};
const nearVend = (p) => Math.hypot(VEND.x - p.x, VEND.y - p.y) < 50;

// progress survives a page refresh (rooms explored + snacks)
const loadProgress = () => {
  try {
    const j = JSON.parse(localStorage.getItem(STORE) || "{}");
    return { explored: new Set(j.explored || []), snacks: new Set(j.snacks || []), visited: new Set([0, ...(j.visited || [])]) };
  } catch {
    return { explored: new Set(), snacks: new Set(), visited: new Set([0]) };
  }
};

export default function WorldMap({ onBack, onQuickView, snack, startZone = null }) {
  const [saved] = useState(loadProgress);
  const [avatar, setAvatar] = useState(() => nodePos(startZone ?? 0));
  const [current, setCurrent] = useState(startZone ?? 0); // last room stood on (used by the info pages)
  const [visited, setVisited] = useState(() => new Set([...saved.visited, ...(startZone ? [startZone] : [])]));
  const [explored, setExplored] = useState(() => new Set([...saved.explored, ...(startZone ? [startZone] : [])]));
  const [snacks, setSnacks] = useState(saved.snacks);
  const [showInfo, setShowInfo] = useState(startZone != null);
  const [airborne, setAirborne] = useState(null); // { lift } while mid-jump
  const [vendOpen, setVendOpen] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [shake, setShake] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [pops, setPops] = useState([]);
  const [hireOpen, setHireOpen] = useState(false);
  const [hireShown, setHireShown] = useState(false);
  const [slash, setSlash] = useState(null);
  const keys = useRef(new Set());
  const jumping = useRef(false);
  const konami = useRef([]);
  const avatarRef = useRef(avatar);
  const visitedRef = useRef(visited);
  useEffect(() => { avatarRef.current = avatar; visitedRef.current = visited; });

  const xp = [...explored].filter((i) => i !== 0).length * XP_PER_ROOM + snacks.size * XP_PER_SNACK;
  const level = 1 + Math.floor(xp / XP_PER_LEVEL);
  const levelPct = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  const hireUnlocked = QUEST_IDS.every((id) => explored.has(id));
  const nearIdx = airborne ? null : nearestNode(avatar);
  const vendNear = !airborne && nearVend(avatar);

  // save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ explored: [...explored], snacks: [...snacks], visited: [...visited] }));
    } catch { /* storage blocked: progress just won't persist */ }
  }, [explored, snacks, visited]);

  const toast = useCallback((title, text, color = "#ffcf6e") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, text, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const pop = useCallback((x, y, text, color) => {
    const id = Date.now() + Math.random();
    setPops((p) => [...p, { id, x, y, text, color }]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 1500);
  }, []);

  const flash = useCallback((cb) => {
    setFlashing(true);
    setTimeout(() => { cb?.(); setTimeout(() => setFlashing(false), 300); }, 180);
  }, []);

  // move the avatar and register any room she arrives at
  const place = useCallback((p) => {
    setAvatar(p);
    const n = nearestNode(p);
    if (n != null) {
      setCurrent(n);
      if (!visitedRef.current.has(n)) {
        setVisited((prev) => new Set([...prev, n]));
        if (n !== 0) pop(LOCATIONS[n].mapX, LOCATIONS[n].mapY - 40, "NEW ROOM!", LOCATIONS[n].color);
      }
    }
  }, [pop]);

  // ── walking: hold WASD / arrows ──
  useEffect(() => {
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = keys.current;
      if (!jumping.current && k.size && !showInfo && !vendOpen && !hireOpen) {
        let dx = 0, dy = 0;
        if (k.has("left")) dx -= 1;
        if (k.has("right")) dx += 1;
        if (k.has("up")) dy -= 1;
        if (k.has("down")) dy += 1;
        if (dx || dy) {
          const len = Math.hypot(dx, dy);
          const a = avatarRef.current;
          place({
            x: Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, a.x + (dx / len) * SPEED * dt)),
            y: Math.max(BOUNDS.y0, Math.min(BOUNDS.y1, a.y + (dy / len) * SPEED * dt)),
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [place, showInfo, vendOpen, hireOpen]);

  // ── jumping: an arc from wherever she is to anywhere ──
  const jumpTo = useCallback((target, then) => {
    if (jumping.current) return;
    jumping.current = true;
    const from = { ...avatarRef.current };
    const to = { x: Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, target.x)), y: Math.max(BOUNDS.y0, Math.min(BOUNDS.y1, target.y)) };
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const dur = Math.max(320, Math.min(900, 300 + dist * 0.9));
    const height = 26 + Math.min(70, dist * 0.18);
    const t0 = performance.now();
    sfx.play("jump");
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      setAvatar({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
      setAirborne({ lift: Math.sin(Math.PI * t) * height });
      if (t < 1) { requestAnimationFrame(step); return; }
      setAirborne(null);
      jumping.current = false;
      place(to);
      if (nearestNode(to) != null) sfx.play("coin");
      then?.();
    };
    requestAnimationFrame(step);
  }, [place]);

  const hop = () => {
    if (jumping.current) return;
    jumping.current = true;
    sfx.play("jump");
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / 380);
      setAirborne({ lift: Math.sin(Math.PI * t) * 24 });
      if (t < 1) { requestAnimationFrame(step); return; }
      setAirborne(null);
      jumping.current = false;
    };
    requestAnimationFrame(step);
  };

  const markExplored = useCallback((idx) => {
    if (explored.has(idx)) return;
    setExplored((prev) => new Set([...prev, idx]));
    if (idx === 0) return;
    const before = 1 + Math.floor(xp / XP_PER_LEVEL);
    const after = 1 + Math.floor((xp + XP_PER_ROOM) / XP_PER_LEVEL);
    sfx.play(after > before ? "levelup" : "unlock");
    toast(after > before ? `LEVEL UP! LV ${after}` : "ROOM EXPLORED", `${LOCATIONS[idx].name}  +${XP_PER_ROOM} XP`, LOCATIONS[idx].color);
  }, [explored, toast, xp]);

  const openRoom = useCallback((idx) => {
    sfx.play("open");
    setCurrent(idx);
    setShake(true);
    setTimeout(() => setShake(false), 300);
    setSlash({ key: Date.now(), color: LOCATIONS[idx].color });
    setTimeout(() => setShowInfo(true), 300);
    if (!explored.has(idx) && idx !== 0) pop(LOCATIONS[idx].mapX, LOCATIONS[idx].mapY - 40, `+${XP_PER_ROOM} XP`, "#ffcf6e");
    markExplored(idx);
  }, [markExplored, explored, pop]);

  const openHere = () => {
    if (nearIdx != null) openRoom(nearIdx);
    else if (vendNear) setVendOpen(true);
  };

  // click a room: jump to it, or enter it if she's already there
  const onNodeClick = (i, fromLog = false) => {
    if (nearIdx === i && !fromLog) { openRoom(i); return; }
    jumpTo(nodePos(i));
  };

  const jumpStep = (dir) => {
    const base = nearIdx ?? current;
    const next = (base + dir + LOCATIONS.length) % LOCATIONS.length;
    jumpTo(nodePos(next));
  };

  const onVendingClick = () => {
    if (vendNear) { setVendOpen(true); return; }
    jumpTo({ x: VEND.x - 30, y: VEND.y }, () => setVendOpen(true));
  };

  const buySnack = (it) => {
    if (!snacks.has(it.id)) {
      setSnacks((s) => new Set([...s, it.id]));
      pop(VEND.x, VEND.y - 70, `+${XP_PER_SNACK} XP`, "#7dff9a");
      const after = 1 + Math.floor((xp + XP_PER_SNACK) / XP_PER_LEVEL);
      if (after > level) { sfx.play("levelup"); toast(`LEVEL UP! LV ${after}`, "Self-care counts as XP. Obviously.", "#7dff9a"); }
    }
  };

  const closeInfo = useCallback(() => {
    sfx.play("back");
    flash(() => setShowInfo(false));
    place(nodePos(current)); // she's standing at the room she just left
    if (hireUnlocked && !hireShown) {
      setHireShown(true);
      setTimeout(() => setHireOpen(true), 700);
    }
  }, [flash, hireUnlocked, hireShown, place, current]);

  const infoNav = useCallback((dir) => {
    const next = current + dir;
    if (next >= 0 && next < LOCATIONS.length) {
      sfx.play("open");
      setSlash({ key: Date.now(), color: LOCATIONS[next].color });
      setTimeout(() => { setCurrent(next); place(nodePos(next)); markExplored(next); }, 300);
    }
  }, [current, markExplored, place]);

  // ── keyboard ──
  useEffect(() => {
    const dirOf = { ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right", ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down" };
    const down = (e) => {
      const typing = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (!typing) {
        konami.current = [...konami.current, e.key].slice(-KONAMI.length);
        if (konami.current.join() === KONAMI.join()) {
          konami.current = [];
          sfx.play("levelup");
          toast("CHEAT CODE ACCEPTED", "+∞ XP. You clearly have excellent taste.", "#ff5ad1");
        }
      }
      if (hireOpen) { if (e.key === "Escape") setHireOpen(false); return; }
      if (vendOpen) { if (e.key === "Escape") setVendOpen(false); return; }
      if (showInfo) {
        if (e.key === "Escape") closeInfo();
        else if (!typing && e.key === "ArrowRight") infoNav(1);
        else if (!typing && e.key === "ArrowLeft") infoNav(-1);
        return;
      }
      if (typing) return;
      if (dirOf[e.key]) { e.preventDefault(); keys.current.add(dirOf[e.key]); return; }
      if (e.key === " ") { e.preventDefault(); hop(); return; }
      if (e.key === "Enter" || e.key === "e" || e.key === "E") { e.preventDefault(); openHere(); return; }
      if (e.key === "v" || e.key === "V") { onVendingClick(); return; }
      const n = Number(e.key);
      if (n >= 1 && n <= LOCATIONS.length) { jumpTo(nodePos(n - 1)); return; }
      if (e.key === "Escape") onBack?.();
    };
    const up = (e) => {
      const d = dirOf[e.key];
      if (d) keys.current.delete(d);
    };
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CRTOverlay />

      <MapScreen
        current={current}
        nearIdx={nearIdx}
        avatar={avatar}
        airborne={airborne}
        snack={snack}
        visited={visited}
        explored={explored}
        xp={xp}
        level={level}
        levelPct={levelPct}
        pops={pops}
        onMapClick={(p) => jumpTo(p)}
        onNodeClick={onNodeClick}
        onVendingClick={onVendingClick}
        nearVending={vendNear}
        onOpen={openHere}
        onJumpStep={jumpStep}
        onBack={onBack}
        shake={shake}
        hireUnlocked={hireUnlocked}
        onHireMe={() => setHireOpen(true)}
      />

      {showInfo && <InfoScreen current={current} explored={explored} onClose={closeInfo} onNav={infoNav} onQuickView={onQuickView} />}
      {vendOpen && <VendingMachine onClose={() => setVendOpen(false)} onBuy={buySnack} bought={snacks} />}
      {slash && <SlashTransition key={slash.key} color={slash.color} onDone={() => setSlash(null)} />}
      {hireOpen && <HireMeModal onClose={() => setHireOpen(false)} />}

      {/* toasts */}
      <div className="absolute z-[450] flex flex-col gap-2 pointer-events-none" style={{ top: 84, right: 16 }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast-in" style={{ background: "#0d0402", border: `2px solid ${t.color}`, boxShadow: `0 0 16px ${t.color}55, 3px 3px 0 #000`, padding: "10px 14px", minWidth: 260 }}>
            <div style={{ fontFamily: PIXEL, fontSize: 10, color: t.color }}>🏆 {t.title}</div>
            <div style={{ fontFamily: READ, fontSize: 20, color: "#f3e6d8", marginTop: 4 }}>{t.text}</div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-[300]" style={{ background: "#000", opacity: flashing ? 1 : 0, transition: flashing ? "opacity .18s" : "opacity .35s" }} />
    </div>
  );
}
