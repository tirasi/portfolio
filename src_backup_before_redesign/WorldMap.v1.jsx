import { useState, useCallback, useEffect, useRef } from "react";
import { LOCATIONS } from "@/data/locations";
import MapScreen from "@/components/MapScreen";
import InfoScreen from "@/components/InfoScreen";
import HireMeModal from "@/components/HireMeModal";
import CRTOverlay from "@/components/CRTOverlay";
import SlashTransition from "@/components/SlashTransition";
import { PIXEL, READ } from "@/lib/fonts";
import { sfx } from "@/lib/sfx";

const QUEST_IDS = LOCATIONS.filter((l) => l.id !== 0).map((l) => l.id);
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function WorldMap({ onBack, onQuickView, snack, startZone = null }) {
  // arriving with a café cat opens that project directly; otherwise start on the map
  const [current, setCurrent] = useState(startZone ?? 0);
  const [visited, setVisited] = useState(() => new Set(startZone ? [0, startZone] : [0]));
  const [explored, setExplored] = useState(() => new Set(startZone ? [startZone] : []));
  const [showInfo, setShowInfo] = useState(startZone != null);
  const [flashing, setFlashing] = useState(false);
  const [shake, setShake] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [hireOpen, setHireOpen] = useState(false);
  const [hireShown, setHireShown] = useState(false);
  const [slash, setSlash] = useState(null); // { key, color } while the katana cut plays
  const walking = useRef(false);
  const konami = useRef([]);

  const hireUnlocked = QUEST_IDS.every((id) => explored.has(id));

  const toast = useCallback((title, text, color = "#ffcf6e") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, text, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const flash = useCallback((cb) => {
    setFlashing(true);
    setTimeout(() => { cb?.(); setTimeout(() => setFlashing(false), 300); }, 180);
  }, []);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
    setVisited((prev) => new Set([...prev, idx]));
  }, []);

  const markExplored = useCallback((idx) => {
    if (explored.has(idx)) return;
    if (idx !== 0) {
      sfx.play("unlock");
      toast("ACHIEVEMENT UNLOCKED", `Entered ${LOCATIONS[idx].name}  +1 XP`, LOCATIONS[idx].color);
    }
    setExplored((prev) => new Set([...prev, idx]));
  }, [explored, toast]);

  const openInfo = useCallback(() => {
    sfx.play("open");
    setShake(true);
    setTimeout(() => setShake(false), 300);
    setSlash({ key: Date.now(), color: LOCATIONS[current].color });
    setTimeout(() => setShowInfo(true), 300); // zone appears as the cut lands
    markExplored(current);
  }, [current, markExplored]);

  // walk node-by-node along the path towards idx
  const visitNode = useCallback((idx) => {
    if (walking.current) return;
    if (idx === current) { openInfo(); return; }
    walking.current = true;
    const dir = idx > current ? 1 : -1;
    let delay = 0;
    for (let i = current; i !== idx; i += dir) {
      const step = i + dir;
      setTimeout(() => { goTo(step); sfx.play("step"); }, delay);
      delay += 320;
    }
    setTimeout(() => { walking.current = false; }, delay);
  }, [current, goTo, openInfo]);

  const navStep = useCallback((dir) => {
    const next = current + dir;
    if (next >= 0 && next < LOCATIONS.length) { goTo(next); sfx.play("step"); }
  }, [current, goTo]);

  const closeInfo = useCallback(() => {
    sfx.play("back");
    flash(() => setShowInfo(false));
    if (hireUnlocked && !hireShown) {
      setHireShown(true);
      setTimeout(() => setHireOpen(true), 700);
    }
  }, [flash, hireUnlocked, hireShown]);

  const infoNav = useCallback((dir) => {
    const next = current + dir;
    if (next >= 0 && next < LOCATIONS.length) {
      sfx.play("open");
      setSlash({ key: Date.now(), color: LOCATIONS[next].color });
      setTimeout(() => { goTo(next); markExplored(next); }, 300);
    }
  }, [current, goTo, markExplored]);

  // keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA"].includes(e.target.tagName);

      if (!typing) {
        konami.current = [...konami.current, e.key].slice(-KONAMI.length);
        if (konami.current.join() === KONAMI.join()) {
          konami.current = [];
          sfx.play("unlock");
          toast("CHEAT CODE ACCEPTED", "+∞ XP. You clearly have excellent taste.", "#ff5ad1");
        }
      }

      if (hireOpen) { if (e.key === "Escape") setHireOpen(false); return; }

      if (showInfo) {
        if (e.key === "Escape") closeInfo();
        else if (!typing && e.key === "ArrowRight") infoNav(1);
        else if (!typing && e.key === "ArrowLeft") infoNav(-1);
        return;
      }

      if (typing) return;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") navStep(1);
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") navStep(-1);
      else if (e.key === "Enter" || e.key === "e" || e.key === "E" || e.key === " ") { e.preventDefault(); openInfo(); }
      else if (e.key === "Escape") onBack?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showInfo, hireOpen, closeInfo, infoNav, navStep, openInfo, onBack, toast]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CRTOverlay />

      <MapScreen
        current={current}
        snack={snack}
        visited={visited}
        explored={explored}
        onVisitNode={visitNode}
        onNavStep={navStep}
        onOpen={openInfo}
        onBack={onBack}
        shake={shake}
        hireUnlocked={hireUnlocked}
        onHireMe={() => setHireOpen(true)}
      />

      {showInfo && (
        <InfoScreen current={current} explored={explored} onClose={closeInfo} onNav={infoNav} onQuickView={onQuickView} />
      )}

      {slash && <SlashTransition key={slash.key} color={slash.color} onDone={() => setSlash(null)} />}

      {hireOpen && <HireMeModal onClose={() => setHireOpen(false)} />}

      {/* Achievement toasts */}
      <div className="absolute z-[350] flex flex-col gap-2 pointer-events-none" style={{ top: 84, right: 16 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in"
            style={{ background: "#0d0402", border: `2px solid ${t.color}`, boxShadow: `0 0 16px ${t.color}55, 3px 3px 0 #000`, padding: "10px 14px", minWidth: 260 }}
          >
            <div style={{ fontFamily: PIXEL, fontSize: 10, color: t.color }}>🏆 {t.title}</div>
            <div style={{ fontFamily: READ, fontSize: 20, color: "#f3e6d8", marginTop: 4 }}>{t.text}</div>
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-[300]"
        style={{ background: "#000", opacity: flashing ? 1 : 0, transition: flashing ? "opacity .18s" : "opacity .35s" }}
      />
    </div>
  );
}
