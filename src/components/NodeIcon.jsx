// Pixel icons for each map zone. `c` is the zone's accent colour.
const Px = ({ children }) => (
  <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {children}
  </svg>
);

const SpawnIcon = ({ c }) => (
  <Px>
    {/* coffee cup for the café */}
    <rect x="5" y="1" width="1" height="3" fill="#fff" opacity="0.5" />
    <rect x="8" y="0" width="1" height="3" fill="#fff" opacity="0.5" />
    <rect x="2" y="5" width="10" height="8" fill="#fff4ea" />
    <rect x="3" y="6" width="8" height="2" fill="#7a4a2a" />
    <rect x="12" y="7" width="2" height="4" fill="#fff4ea" />
    <rect x="1" y="13" width="13" height="2" fill={c} />
    <rect x="6" y="9" width="2" height="2" fill="#ff8fc8" />
  </Px>
);

const ArchiveIcon = ({ c }) => (
  <Px>
    <rect x="3" y="1" width="10" height="14" fill="#1c1430" />
    <rect x="4" y="2" width="8" height="3" fill="#2a1f47" />
    <rect x="4" y="6" width="8" height="3" fill="#2a1f47" />
    <rect x="4" y="10" width="8" height="3" fill="#2a1f47" />
    <rect x="7" y="3" width="2" height="1" fill={c} />
    <rect x="7" y="7" width="2" height="1" fill={c} />
    <rect x="7" y="11" width="2" height="1" fill={c} />
  </Px>
);

const StationIcon = ({ c }) => (
  <Px>
    <rect x="6" y="6" width="4" height="4" fill="#0e2a33" />
    <rect x="7" y="7" width="2" height="2" fill={c} />
    <rect x="0" y="7" width="5" height="2" fill="#13404d" />
    <rect x="11" y="7" width="5" height="2" fill="#13404d" />
    <rect x="1" y="5" width="3" height="6" fill="#0e2a33" />
    <rect x="12" y="5" width="3" height="6" fill="#0e2a33" />
    <rect x="7" y="2" width="2" height="4" fill="#13404d" />
    <rect x="7" y="1" width="2" height="1" fill={c} />
  </Px>
);

const DetectiveIcon = ({ c }) => (
  <Px>
    <rect x="3" y="2" width="7" height="7" fill="#33240a" />
    <rect x="4" y="3" width="5" height="5" fill="#0a0700" />
    <rect x="5" y="4" width="2" height="2" fill={c} opacity="0.7" />
    <rect x="9" y="9" width="2" height="2" fill="#4a3410" />
    <rect x="11" y="11" width="3" height="3" fill={c} />
  </Px>
);

const VaultIcon = ({ c }) => (
  <Px>
    <rect x="1" y="2" width="14" height="12" fill="#2e2608" />
    <rect x="2" y="3" width="12" height="10" fill="#1c1704" />
    <rect x="6" y="6" width="4" height="4" fill="#3a300a" />
    <rect x="7" y="7" width="2" height="2" fill={c} />
    <rect x="3" y="4" width="1" height="1" fill={c} />
    <rect x="12" y="4" width="1" height="1" fill={c} />
    <rect x="3" y="11" width="1" height="1" fill={c} />
    <rect x="12" y="11" width="1" height="1" fill={c} />
  </Px>
);

const ClinicIcon = ({ c }) => (
  <Px>
    <rect x="2" y="2" width="12" height="12" fill="#0d2617" />
    <rect x="6" y="3" width="4" height="10" fill={c} />
    <rect x="3" y="6" width="10" height="4" fill={c} />
  </Px>
);

const CitadelIcon = ({ c }) => (
  <Px>
    <rect x="3" y="9" width="10" height="7" fill="#121e33" />
    <rect x="1" y="7" width="14" height="2" fill="#1b2b47" />
    <rect x="5" y="4" width="6" height="3" fill="#121e33" />
    <rect x="7" y="1" width="2" height="3" fill="#1b2b47" />
    <rect x="7" y="1" width="2" height="1" fill={c} />
    <rect x="6" y="11" width="4" height="5" fill="#0a1220" />
    <rect x="4" y="10" width="1" height="2" fill={c} />
    <rect x="11" y="10" width="1" height="2" fill={c} />
  </Px>
);

const TerminalIcon = ({ c }) => (
  <Px>
    <rect x="0" y="2" width="16" height="12" fill="#02100a" />
    <rect x="0" y="2" width="16" height="2" fill="#0a2a18" />
    <rect x="2" y="6" width="1" height="1" fill={c} />
    <rect x="3" y="7" width="1" height="1" fill={c} />
    <rect x="2" y="8" width="1" height="1" fill={c} />
    <rect x="5" y="8" width="4" height="1" fill={c} />
  </Px>
);

export const ICONS = {
  spawn: SpawnIcon,
  archive: ArchiveIcon,
  station: StationIcon,
  detective: DetectiveIcon,
  vault: VaultIcon,
  clinic: ClinicIcon,
  citadel: CitadelIcon,
  terminal: TerminalIcon,
};
