// Shared pixel-art sprites (heroine + heart) used by the café and story scenes.
export const PINK = "#ff8fc8";

/* ───────────────────────── heroine ───────────────────────── */
export function Heroine({ x = 20, y = 66, attack = false }) {
  return (
    <g transform={`translate(${x},${y}) scale(2)`}>
      {/* long hair (back) */}
      <rect x="1" y="1" width="9" height="9" fill="#3a1a0a" />
      {/* pink bow */}
      <rect x="7" y="-1" width="2" height="2" fill={PINK} />
      <rect x="10" y="-1" width="2" height="2" fill={PINK} />
      <rect x="9" y="0" width="1" height="1" fill="#e0559a" />
      {/* face */}
      <rect x="2" y="1" width="7" height="2" fill="#5a2a10" />
      <rect x="2" y="3" width="7" height="3" fill="#f5c5a0" />
      <rect x="3" y="3" width="2" height="1" fill="#220011" />
      <rect x="6" y="3" width="2" height="1" fill="#220011" />
      <rect x="2" y="5" width="1" height="1" fill="#ff9aa8" />
      <rect x="8" y="5" width="1" height="1" fill="#ff9aa8" />
      <rect x="5" y="5" width="1" height="1" fill="#e06070" />
      {/* hoodie with a heart */}
      <rect x="2" y="6" width="7" height="3" fill="#c2185b" />
      <rect x="5" y="7" width="1" height="1" fill={PINK} />
      <rect x="1" y="6" width="1" height="3" fill="#c2185b" />
      <rect x={attack ? 9 : 9} y={attack ? 5 : 6} width="2" height={attack ? 2 : 3} fill="#c2185b" />
      {/* pleated skirt */}
      <rect x="2" y="9" width="7" height="2" fill="#6a1b9a" />
      <rect x="3" y="10" width="1" height="1" fill="#8e3bbf" />
      <rect x="6" y="10" width="1" height="1" fill="#8e3bbf" />
      {/* legs + shoes */}
      <rect x="3" y="11" width="2" height="2" fill="#f5c5a0" />
      <rect x="6" y="11" width="2" height="2" fill="#f5c5a0" />
      <rect x="2" y="13" width="3" height="1" fill="#fff" />
      <rect x="6" y="13" width="3" height="1" fill="#fff" />
    </g>
  );
}

// outer <g> positions the heart; inner <g> takes any CSS animation class
// (a CSS transform would otherwise override the SVG translate)
export const Heart = ({ x, y, s = 1, fill = PINK, ...rest }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g {...rest}>
      <rect x="0" y="0" width="2" height="2" fill={fill} />
      <rect x="3" y="0" width="2" height="2" fill={fill} />
      <rect x="0" y="1" width="5" height="2" fill={fill} />
      <rect x="1" y="3" width="3" height="1" fill={fill} />
      <rect x="2" y="4" width="1" height="1" fill={fill} />
    </g>
  </g>
);

