#!/usr/bin/env node
// PreCompact: back up the transcript before compaction discards detail.
import { readFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

let data = {};
try { data = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}
const tpath = data.transcript_path || "";
const trigger = data.trigger || "unknown";
const cwd = data.cwd || process.cwd(); // anchor backups to the project root, not wherever the hook happens to run
if (tpath && existsSync(tpath)) {
  const dir = join(cwd, ".claude", "backups");
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  copyFileSync(tpath, join(dir, `transcript_${trigger}_${stamp}.jsonl`));
  const backups = readdirSync(dir).filter(f => f.startsWith("transcript_")).sort();
  for (const old of backups.slice(0, -10)) unlinkSync(join(dir, old));
}
process.exit(0);
