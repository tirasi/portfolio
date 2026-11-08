export const LOCATIONS = [
  {
    id: 0,
    name: "SPAWN ROOM",
    sub: "// where the adventure begins",
    icon: "⌂",
    color: "#ff4500",
    mapX: 60,
    mapY: 390,
    cursorY: 362,
    sections: [
      {
        title: "▸ WELCOME, TRAVELLER",
        body: "This is the beginning of my portfolio —\nbuilt not as a PDF but as a world\nworth exploring.\n\nUse NEXT to journey through my story,\nor click any location on the map\nto teleport directly.",
      },
      {
        title: "▸ HOW TO NAVIGATE",
        body: "NEXT / PREV — travel between locations\n\nMAP button — return to the world map\n\nClick any node — jump to that location\n\nEach location holds a different chapter\nof my story.",
      },
    ],
  },
  {
    id: 1,
    name: "EDUCATION CITADEL",
    sub: "// knowledge forged in stone",
    icon: "⚑",
    color: "#ff6600",
    mapX: 170,
    mapY: 160,
    cursorY: 132,
    sections: [
      {
        title: "▸ ACADEMIC HISTORY",
        body: "✦ [Your Degree] — [University Name]\n   [Start Year] – [End Year]\n   GPA: X.X / 10\n\n✦ [Secondary Qualification]\n   [Institution] — [Year]",
      },
      {
        title: "▸ COURSEWORK & FOCUS",
        body: "Core subjects mastered:\n\n→ [Subject 1]\n→ [Subject 2]\n→ [Subject 3]\n→ [Subject 4]",
      },
    ],
  },
  {
    id: 2,
    name: "PROJECT DUNGEON",
    sub: "// where code meets chaos",
    icon: "⚔",
    color: "#ff2200",
    mapX: 300,
    mapY: 390,
    cursorY: 362,
    sections: [
      {
        title: "▸ FEATURED QUESTS",
        body: "✦ Project Name One\n   Stack: [React / Node / etc]\n   [Brief description]\n   github.com/yourname/project\n\n✦ Project Name Two\n   Stack: [Python / Flask / etc]\n   [Brief description]",
      },
      {
        title: "▸ SIDE QUESTS",
        body: "✦ Mini Project / Experiment\n   [What you built and learned]\n\n✦ Open Source Contribution\n   [Repo name and what you added]",
      },
    ],
  },
  {
    id: 3,
    name: "ACHIEVEMENT HALL",
    sub: "// glory carved in pixel stone",
    icon: "★",
    color: "#ffaa00",
    mapX: 430,
    mapY: 160,
    cursorY: 132,
    sections: [
      {
        title: "▸ TROPHIES EARNED",
        body: "✦ [Hackathon Name] — [Year]\n   [Position / Award won]\n\n✦ [Competition / Recognition]\n   [What it was for]\n\n✦ [Academic / Professional Award]\n   [Details]",
      },
      {
        title: "▸ STATS & MILESTONES",
        body: "→ [X] projects shipped\n→ [X] GitHub contributions\n→ [X] bugs squashed\n→ [X] cups of coffee consumed",
      },
    ],
  },
  {
    id: 4,
    name: "CERTIFICATE REPOSITORY",
    sub: "// sealed scrolls of mastery",
    icon: "✦",
    color: "#ff8c00",
    mapX: 560,
    mapY: 390,
    cursorY: 362,
    sections: [
      {
        title: "▸ CERTIFIED SKILLS",
        body: "✦ [Certification Name]\n   Issued by: [Platform / Body]\n   [Month Year]  •  ID: XXXXXXX\n\n✦ [Certification Name]\n   Issued by: [Platform / Body]\n   [Month Year]",
      },
      {
        title: "▸ COURSES COMPLETED",
        body: "✦ [Course Name] — [Platform]\n   [What you learned / built]\n\n✦ [Course Name] — [Platform]\n   [What you learned / built]",
      },
    ],
  },
  {
    id: 5,
    name: "CODER'S SECTION",
    sub: "// tools of the craft",
    icon: ">_",
    color: "#00cc00",
    mapX: 635,
    mapY: 250,
    cursorY: 222,
    sections: [
      {
        title: "▸ LANGUAGES & FRAMEWORKS",
        body: "[████████░░]  JavaScript  80%\n[███████░░░]  Python      70%\n[██████░░░░]  React       60%\n[█████░░░░░]  Node.js     50%",
      },
      {
        title: "▸ TOOLS & ENVIRONMENT",
        body: "Editor:  [VS Code / Neovim / etc]\nOS:      [MacOS / Linux / Windows]\nVCS:     Git + GitHub\nDeploy:  [Vercel / AWS / etc]\nOther:   [Docker / Figma / etc]",
      },
    ],
  },
];

export const MAP_PATHS = [
  "M60,390 C80,280 140,200 170,160",
  "M170,160 C210,260 260,340 300,390",
  "M300,390 C330,280 380,210 430,160",
  "M430,160 C460,260 510,340 560,390",
  "M560,390 C575,340 600,290 635,250",
];
