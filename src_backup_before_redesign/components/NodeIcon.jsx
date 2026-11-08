export function SpawnIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="8" width="14" height="7" fill="#2a0800" />
      <rect x="3" y="5" width="10" height="3" fill="#1a0500" />
      <rect x="6" y="2" width="4" height="3" fill="#3a0a00" />
      <rect x="2" y="9" width="3" height="6" fill="#1a0500" />
      <rect x="11" y="9" width="3" height="6" fill="#1a0500" />
      <rect x="6" y="10" width="4" height="5" fill="#3a0a00" />
      <rect x="4" y="6" width="2" height="2" fill="#ff4500" opacity="0.8" />
      <rect x="10" y="6" width="2" height="2" fill="#ff4500" opacity="0.8" />
    </svg>
  );
}

export function EducationIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="9" width="10" height="7" fill="#2a0800" />
      <rect x="1" y="7" width="14" height="2" fill="#3a0a00" />
      <rect x="5" y="4" width="6" height="3" fill="#2a0800" />
      <rect x="7" y="1" width="2" height="3" fill="#3a0a00" />
      <rect x="4" y="9" width="3" height="7" fill="#1a0500" />
      <rect x="9" y="9" width="3" height="7" fill="#1a0500" />
      <rect x="6" y="10" width="4" height="4" fill="#3a0a00" />
      <rect x="7" y="2" width="2" height="1" fill="#ff8c00" opacity="0.6" />
    </svg>
  );
}

export function DungeonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="0" y="0" width="16" height="16" fill="#0a0200" />
      <rect x="2" y="2" width="12" height="12" fill="#140300" />
      <rect x="4" y="0" width="2" height="3" fill="#2a0800" />
      <rect x="10" y="0" width="2" height="3" fill="#2a0800" />
      <rect x="6" y="6" width="4" height="4" fill="#2a0800" />
      <rect x="7" y="7" width="2" height="2" fill="#ff2200" opacity="0.5" />
      <rect x="2" y="7" width="3" height="2" fill="#1a0500" />
      <rect x="11" y="7" width="3" height="2" fill="#1a0500" />
    </svg>
  );
}

export function AchievementIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="8" width="10" height="8" fill="#2a0500" />
      <rect x="1" y="6" width="14" height="2" fill="#3a0a00" />
      <rect x="5" y="1" width="6" height="5" fill="#1a0300" />
      <rect x="6" y="2" width="4" height="3" fill="#ff6600" opacity="0.7" />
      <rect x="7" y="0" width="2" height="2" fill="#ffaa00" opacity="0.8" />
      <rect x="6" y="9" width="4" height="7" fill="#1a0500" />
      <rect x="4" y="13" width="8" height="2" fill="#3a0800" />
    </svg>
  );
}

export function CertificateIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="2" width="14" height="12" fill="#1a0800" />
      <rect x="2" y="3" width="12" height="10" fill="#220900" />
      <rect x="3" y="5" width="10" height="1" fill="#884400" opacity="0.8" />
      <rect x="3" y="7" width="8" height="1" fill="#884400" opacity="0.6" />
      <rect x="3" y="9" width="9" height="1" fill="#884400" opacity="0.6" />
      <rect x="3" y="11" width="6" height="1" fill="#884400" opacity="0.5" />
      <rect x="11" y="8" width="3" height="4" fill="#ff6600" opacity="0.5" />
      <rect x="0" y="1" width="16" height="2" fill="#3a0a00" />
      <rect x="0" y="13" width="16" height="2" fill="#3a0a00" />
    </svg>
  );
}

export function CoderIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="0" y="2" width="16" height="12" fill="#020a03" />
      <rect x="0" y="2" width="16" height="2" fill="#0a2a0a" />
      <rect x="2" y="6" width="3" height="1" fill="#00cc00" opacity="0.9" />
      <rect x="6" y="6" width="5" height="1" fill="#00cc00" opacity="0.7" />
      <rect x="2" y="8" width="5" height="1" fill="#00cc00" opacity="0.8" />
      <rect x="8" y="8" width="4" height="1" fill="#00cc00" opacity="0.6" />
      <rect x="2" y="10" width="4" height="1" fill="#00cc00" opacity="0.7" />
      <rect x="2" y="4" width="1" height="1" fill="#00ff00" opacity="0.8" />
    </svg>
  );
}

export const NODE_ICONS = [
  SpawnIcon,
  EducationIcon,
  DungeonIcon,
  AchievementIcon,
  CertificateIcon,
  CoderIcon,
];
