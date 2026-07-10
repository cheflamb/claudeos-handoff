#!/usr/bin/env node
// SessionStart: inject the nearest HANDOFF.md as cold-start context.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

function findHandoff(start) {
  let dir = start;
  while (true) {
    const f = join(dir, "HANDOFF.md");
    if (existsSync(f)) return f;
    const parent = dirname(dir);
    if (parent === dir) return null; // reached filesystem root
    dir = parent;
  }
}

let data = {};
try { data = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}
const cwd = data.cwd || process.cwd();
const handoff = findHandoff(cwd);
if (handoff) {
  process.stdout.write(`## Cold-start context — ${handoff}\n\n${readFileSync(handoff, "utf8")}`);
}
process.exit(0);
