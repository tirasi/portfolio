import { useEffect, useState } from "react";

// Katana-cut transition: a blade streaks across the screen, then the
// two halves of the darkness slide apart to reveal the zone.
export default function SlashTransition({ color = "#fff", onDone }) {
  // cut runs from 60% height on the left to 40% on the right
  const [angle] = useState(() => (-Math.atan((0.2 * window.innerHeight) / window.innerWidth) * 180) / Math.PI);
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="slash-wrap" aria-hidden>
      <div className="slash-half slash-top" />
      <div className="slash-half slash-bottom" />
      <div className="slash-blade" style={{ transform: `rotate(${angle}deg)`, background: `linear-gradient(90deg, transparent, #fff 20%, #fff 80%, transparent)`, boxShadow: `0 0 18px 4px ${color}, 0 0 40px 10px ${color}88` }} />
      <div className="slash-flash" />
    </div>
  );
}
