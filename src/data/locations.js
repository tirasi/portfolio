// All portfolio content lives here. Each location is a zone on the map.
//   kind: "intro" | "quest" | "citadel" | "terminal"
//   color: the zone's accent colour (map node, borders, headings)
//   line:  what the avatar says when standing on this zone
//
// TODO (Trashi): replace the `repo` links that point at your GitHub profile
// with each project's actual repository URL.

export const PROFILE = {
  name: "Trashi Sharma",
  title: "AI Engineer Intern · Agentic AI · LLMs · Python Backend",
  email: "trashisharma06@gmail.com",
  linkedin: "https://www.linkedin.com/in/trashi-sharma-603365346",
  github: "https://github.com/tirasi",
  leetcode: "https://leetcode.com/u/trashisharma",
  // Put your resume PDF at public/Trashi_Sharma_Resume.pdf -- the download
  // buttons appear automatically once the file exists.
  resume: "/Trashi_Sharma_Resume.pdf",
  summary:
    "Most projects stop at “it works.” I keep going until they work for the right reasons. I enjoy taking messy, open-ended problems and shaping them into systems that are clear, dependable and honest about their limits.",
};

export const SKILLS = {
  "Agentic AI & LLMs": ["LangGraph", "LangChain", "Multi-Agent Systems", "RAG", "Text-to-SQL", "Prompt Engineering", "MCP", "Ollama", "Local LLMs", "Embeddings"],
  "Machine Learning & Data": ["PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "NLP", "EDA", "PCA"],
  "Backend & Databases": ["Python", "FastAPI", "Spring Boot", "REST APIs", "SQL", "MySQL", "PostgreSQL (pgvector)", "MongoDB", "SQLite"],
  "IoT & Tools": ["ESP32", "Sensor Integration", "Git", "GitHub", "Supabase", "Firebase", "Railway", "SWI-Prolog"],
  Languages: ["Python", "Java", "JavaScript", "SQL", "C"],
};

export const LOCATIONS = [
  {
    id: 0,
    name: "THE CAFÉ",
    sub: "// every adventure starts with snacks",
    kind: "intro",
    icon: "spawn",
    color: "#ff6a2b",
    mapX: 340,
    mapY: 300,
    line: "Hi, I'm Trashi! Walk with ← →",
    intro: [
      {
        title: "WELCOME, TRAVELLER",
        body: "I'm Trashi — a CSIT student at ITER, SOA University who builds AI systems that are honest about what they don't know.\n\nEvery zone on this map is a real chapter of my work. Explore them all to finish the quest.",
      },
      {
        title: "CONTROLS",
        body: "← →  or  A D — walk between zones\nENTER  or  E — explore the zone you're standing on\nESC — back to the map\n\nOr just click any zone to teleport.",
      },
    ],
  },
  {
    id: 1,
    name: "THE ARCHIVE",
    sub: "// AI/ML Intern · Rajasthan Crime Bureau · Aug 2026",
    kind: "quest",
    icon: "archive",
    color: "#b794ff",
    mapX: 115,
    mapY: 165,
    line: "My internship! Ask a database anything.",
    quest: {
      mission: "Let people question a database in plain English — without sensitive data ever leaving the building.",
      role: "AI/ML Intern",
      did: [
        "Built a 6-stage natural-language-to-SQL agent in LangGraph that routes each stage to 1 of 3 local LLMs via Ollama.",
        "Added a self-correction loop that retries failed SQL up to 3 times, using the exact validation error as feedback.",
        "Streamed every reasoning step to a FastAPI dashboard, so failures are debugged at the exact failing stage.",
        "Designed a chunking visualizer comparing 13 text-splitting strategies for RAG.",
      ],
      boss: "A production bug that sent queries down the wrong fallback path. Tracked down and fixed.",
      loot: ["Python", "LangGraph", "Ollama", "Local LLMs", "SQL", "FastAPI", "RAG"],
      outcome: "A text-to-SQL agent that runs on local models and repairs its own broken queries.",
      links: [{ label: "VIEW CODE", url: "https://github.com/tirasi/sql_Agent" }],
    },
  },
  {
    id: 2,
    name: "SPACE STATION",
    sub: "// CosmoTrace · IoT spacesuit damage detection",
    kind: "quest",
    icon: "station",
    color: "#2de2e6",
    mapX: 565,
    mapY: 175,
    line: "We beat 450+ teams with this one!",
    quest: {
      mission: "A torn spacesuit glove can be fatal. Detecting a breach isn't enough — find exactly where it is.",
      role: "1 of 3 software members in a 6-member team",
      did: [
        "Built the first working prototype that localizes EVA glove breaches at 5 mm resolution.",
        "Used a 44-channel plastic optical fiber mesh, with a pressure sensor to confirm leaks.",
        "Developed the live 3D web view that pinpoints the breach in real time from ESP32 sensor data.",
      ],
      boss: "Turning raw readings from 44 fiber channels into one exact breach point, live.",
      loot: ["IoT", "ESP32", "Plastic Optical Fiber", "Pressure Sensor", "3D Web Visualization"],
      outcome: "★ 1st of 450+ teams — Smart India Hackathon 2026, internal round.",
      links: [{ label: "GITHUB", url: "https://github.com/tirasi" }],
    },
  },
  {
    id: 3,
    name: "DETECTIVE'S OFFICE",
    sub: "// Incident Copilot · agentic root cause analysis",
    kind: "quest",
    icon: "detective",
    color: "#ffb02e",
    mapX: 125,
    mapY: 430,
    line: "Every clue gets checked. No guessing.",
    quest: {
      mission: "When software breaks at 3 AM, find the real root cause — and never make one up.",
      role: "Builder (in progress)",
      did: [
        "Building a LangGraph agent that traces software and data-pipeline incidents to their root cause using logs and past incidents.",
        "Added a citation verifier that checks every generated claim against evidence.",
        "When the evidence isn't there, the agent answers “no known pattern” instead of guessing.",
      ],
      boss: "Teaching an AI to say “I don't know” instead of confidently guessing.",
      loot: ["Python", "LangGraph", "FastAPI", "SQLite", "SWI-Prolog", "Ollama", "RAG"],
      outcome: "Every claim is backed by evidence before it reaches a human.",
      links: [{ label: "GITHUB", url: "https://github.com/tirasi" }],
    },
  },
  {
    id: 4,
    name: "THE VAULT",
    sub: "// Banking defect analysis · mentored by a PwC partner",
    kind: "quest",
    icon: "vault",
    color: "#f2c94c",
    mapX: 335,
    mapY: 455,
    line: "Defect, or working as designed?",
    quest: {
      mission: "Sort banking UAT test observations: real defect, not a defect, working as designed, or change request?",
      role: "Team member · mentored by a PwC partner",
      did: [
        "Co-built a 2-agent system that classifies observations into 4 categories.",
        "Used pgvector semantic search over Gemini embeddings to find supporting evidence.",
        "Deployed on Railway with a Supabase backend.",
      ],
      boss: "Making the system refuse to classify when evidence is missing, instead of guessing.",
      loot: ["Multica", "Supabase", "PostgreSQL", "pgvector", "Gemini Embeddings", "MCP", "Railway"],
      outcome: "4-way classification with an honest “not enough evidence” answer.",
      links: [{ label: "GITHUB", url: "https://github.com/tirasi" }],
    },
  },
  {
    id: 5,
    name: "THE CLINIC",
    sub: "// Swasth · AI-powered healthcare platform",
    kind: "quest",
    icon: "clinic",
    color: "#4ade80",
    mapX: 515,
    mapY: 435,
    line: "Won 1st place at Akki AI Hackathon!",
    quest: {
      mission: "Connect patients, doctors, pharmacies and admins — and send every patient to the right doctor.",
      role: "Hackathon team member",
      did: [
        "Built AI symptom-based appointment routing and live triage.",
        "Added telemedicine and a doctor-verification dashboard.",
        "Served 4 user roles: patients, doctors, pharmacies and admins.",
      ],
      boss: "Routing free-text symptoms to the right specialist.",
      loot: ["Python", "LangChain", "NLP", "REST APIs", "Firebase"],
      outcome: "★ 1st place — Akki AI Hackathon.",
      links: [{ label: "GITHUB", url: "https://github.com/tirasi" }],
    },
  },
  {
    id: 6,
    name: "THE CITADEL",
    sub: "// education · certifications · trophies",
    kind: "citadel",
    icon: "citadel",
    color: "#6ea8fe",
    mapX: 335,
    mapY: 165,
    line: "9.83 CGPA. Ask me how.",
    citadel: [
      {
        title: "EDUCATION",
        items: [
          { head: "B.Tech, Computer Science & Information Technology", meta: "ITER, Siksha 'O' Anusandhan University · 2024 – 2028", note: "CGPA 9.83 / 10" },
          { head: "Class XII (CBSE) — 84%", meta: "O.P. Jindal School, Angul · 2024" },
          { head: "Class X (CBSE) — 96.4%", meta: "O.P. Jindal School, Angul · 2022" },
        ],
      },
      {
        title: "TROPHIES",
        items: [
          { head: "★ 1st of 450+ teams", meta: "Smart India Hackathon 2026, internal round · CosmoTrace" },
          { head: "★ 1st place", meta: "Akki AI Hackathon · Swasth" },
          { head: "Top 50 of 300+ teams", meta: "Smart India Hackathon 2025 · Real-time public transport tracking" },
        ],
      },
      {
        title: "CERTIFICATIONS",
        items: [{ head: "Generative AI", meta: "GeeksforGeeks" }],
      },
      {
        title: "LEADERSHIP",
        items: [
          { head: "Lead Member", meta: "Coding Ninjas (CN) and IEC clubs, ITER" },
          { head: "Head Girl (2023–2024) · House Captain (2022–2023)", meta: "O.P. Jindal School" },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "THE TERMINAL",
    sub: "// type 'help' to begin",
    kind: "terminal",
    icon: "terminal",
    color: "#39ff88",
    mapX: 610,
    mapY: 305,
    line: "Hack in. Type 'help'.",
  },
];
