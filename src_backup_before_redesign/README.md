# RPG Portfolio — World Map

## File Structure

```
src/
├── app/
│   ├── globals.css          # Global styles + Tailwind
│   ├── layout.jsx           # Root layout (loads Press Start 2P font)
│   └── world/
│       └── page.jsx         # /world route → renders WorldMap
├── components/
│   ├── WorldMap.jsx         # Root stateful component (navigation logic)
│   ├── MapScreen.jsx        # The pixel map with nodes, paths, player cursor
│   ├── InfoScreen.jsx       # Full-screen location info page
│   ├── PlayerCursor.jsx     # Pixel girl avatar cursor
│   ├── NodeIcon.jsx         # All 6 pixel SVG node icons
│   ├── CRTOverlay.jsx       # Scanline effect
│   └── CornerBrackets.jsx   # Red corner bracket decoration
└── data/
    └── locations.js         # ALL your content lives here
```

## Customising Your Content

Open `src/data/locations.js` and edit each location's `sections` array:

```js
{
  id: 1,
  name: "EDUCATION CITADEL",
  sections: [
    {
      title: "▸ ACADEMIC HISTORY",
      body: "Your real degree, university, year...",
    },
    {
      title: "▸ COURSEWORK",
      body: "Your real subjects...",
    },
  ],
}
```

## Connecting the Spawn Screen

In your spawn screen component, on avatar click:

```js
// App Router
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/world");

// Pages Router
import { useRouter } from "next/router";
const router = useRouter();
router.push("/world");
```

## Install & Run

```bash
npm install
npm run dev
```
