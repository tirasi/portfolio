export default function PlayerCursor({ x, y }) {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
        transition: "left 0.55s cubic-bezier(.4,0,.2,1), top 0.55s cubic-bezier(.4,0,.2,1)",
        imageRendering: "pixelated",
      }}
    >
      <svg width="22" height="28" viewBox="0 0 11 14" style={{ imageRendering: "pixelated" }}>
        {/* Hair */}
        <rect x="3" y="0" width="5" height="1" fill="#5a2a00" />
        {/* Head */}
        <rect x="2" y="1" width="7" height="4" fill="#f5c5a0" />
        {/* Eyes */}
        <rect x="3" y="2" width="2" height="1" fill="#220011" />
        <rect x="6" y="2" width="2" height="1" fill="#220011" />
        {/* Body / hoodie */}
        <rect x="3" y="4" width="5" height="4" fill="#8B0000" />
        <rect x="1" y="5" width="2" height="3" fill="#8B0000" />
        <rect x="8" y="5" width="2" height="3" fill="#8B0000" />
        {/* Legs */}
        <rect x="3" y="8" width="2" height="3" fill="#1a0a00" />
        <rect x="6" y="8" width="2" height="3" fill="#1a0a00" />
        {/* Boots */}
        <rect x="2" y="10" width="3" height="1" fill="#330000" />
        <rect x="6" y="10" width="3" height="1" fill="#330000" />
      </svg>
    </div>
  );
}
