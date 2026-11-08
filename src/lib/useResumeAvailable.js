import { useEffect, useState } from "react";
import { PROFILE } from "@/data/locations";

// True only if public/Trashi_Sharma_Resume.pdf actually exists
// (Vite's dev server answers missing files with index.html, so check the type).
export function useResumeAvailable() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(PROFILE.resume, { method: "HEAD" })
      .then((r) => alive && setOk(r.ok && (r.headers.get("content-type") || "").includes("pdf")))
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return ok;
}
