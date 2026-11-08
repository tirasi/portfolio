"use client";
import { useState, useCallback } from "react";
import { LOCATIONS } from "@/data/locations";
import MapScreen from "@/components/MapScreen";
import InfoScreen from "@/components/InfoScreen";
import CRTOverlay from "@/components/CRTOverlay";

export default function WorldMap({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [showInfo, setShowInfo] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const flash = useCallback((cb) => {
    setFlashing(true);
    setTimeout(() => {
      cb?.();
      setTimeout(() => setFlashing(false), 500);
    }, 200);
  }, []);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
    setVisited((prev) => new Set([...prev, idx]));
  }, []);

  const visitNode = useCallback(
    (idx) => {
      if (idx === current) {
        flash(() => setShowInfo(true));
        return;
      }
      const dir = idx > current ? 1 : -1;
      let delay = 0;
      for (let i = current; i !== idx; i += dir) {
        const step = i + dir;
        setTimeout(() => goTo(step), delay);
        delay += 350;
      }
    },
    [current, flash, goTo]
  );

  const navStep = useCallback(
    (dir) => {
      const next = current + dir;
      if (next >= 0 && next < LOCATIONS.length) {
        goTo(next);
        setTimeout(() => flash(() => setShowInfo(true)), 420);
      }
    },
    [current, goTo, flash]
  );

  const closeInfo = useCallback(() => {
    flash(() => setShowInfo(false));
  }, [flash]);

  const infoNav = useCallback(
    (dir) => {
      const next = current + dir;
      if (next >= 0 && next < LOCATIONS.length) goTo(next);
    },
    [current, goTo]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <CRTOverlay />

      <MapScreen
        current={current}
        visited={visited}
        onVisitNode={visitNode}
        onNavStep={navStep}
        onBack={onBack}
      />

      {showInfo && (
        <InfoScreen
          current={current}
          visited={visited}
          onClose={closeInfo}
          onNav={infoNav}
        />
      )}

      {/* Flash overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[200]"
        style={{
          background: "#000",
          opacity: flashing ? 1 : 0,
          transition: flashing ? "opacity 0.2s" : "opacity 0.5s",
        }}
      />
    </div>
  );
}
