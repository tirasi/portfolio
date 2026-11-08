import { Heroine } from "@/components/pixel";
import { ItemIcon } from "@/components/VendingMachine";

// The heroine on the world map. Position is driven frame-by-frame (walking/jumping),
// so there is no CSS transition here.
export default function PlayerCursor({ x, y, airborne, holding }) {
  return (
    <>
      {/* shadow stays on the ground while she jumps */}
      <div className="absolute z-30 pointer-events-none" style={{ left: x, top: y + (airborne?.shadowDy || 0), transform: "translate(-50%, -50%)", width: 22, height: 6, background: "rgba(0,0,0,.55)", borderRadius: "50%", filter: "blur(1px)" }} />
      {holding && (
        <div className="absolute z-[31] pointer-events-none" style={{ left: x + 10, top: y - 22, transform: `translate(-50%, -50%) scale(${holding.size})`, transition: "transform .15s" }}>
          <ItemIcon id={holding.id} color={holding.color} size={18} />
        </div>
      )}
      <div className="absolute z-30 pointer-events-none" style={{ left: x, top: y, transform: "translate(-50%, -100%)" }}>
        <svg width="30" height="34" viewBox="0 0 14 16" shapeRendering="crispEdges">
          <g transform="translate(-0.5,2) scale(0.5)">
            <Heroine x={0} y={0} attack={!!airborne} />
          </g>
        </svg>
      </div>
    </>
  );
}
