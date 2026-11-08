import { useState, useEffect } from "react";
import { sfx } from "@/lib/sfx";
import { READ } from "@/lib/fonts";

// inline: sits inside a toolbar; otherwise floats bottom-right
export default function SoundToggle({ inline = false }) {
  const [on, setOn] = useState(sfx.isEnabled());
  useEffect(() => sfx.subscribe(setOn), []);
  return (
    <button
      onClick={() => { sfx.setEnabled(!on); if (!on) setTimeout(() => sfx.play("open"), 0); }}
      aria-label={on ? "Mute sound" : "Turn sound on"}
      title={on ? "Mute sound" : "Turn sound on"}
      style={{
        ...(inline ? {} : { position: "fixed", right: 12, bottom: 12, zIndex: 500 }),
        background: "#0a0200", border: "2px solid #5a2000", color: on ? "#ffcf6e" : "#8a5a3a",
        fontFamily: READ, fontSize: 18, padding: "2px 10px", cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      {on ? "🔊 on" : "🔇 off"}
    </button>
  );
}
