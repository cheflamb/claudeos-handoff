# ClaudeOS Handoff

A Claude Code skill that leaves a clean end-of-session handoff so the next (cold) session picks up instantly. Open source and available to anyone using Claude Code or Cowork — install it from the marketplace (see below).

## Quickstart (3 steps, ~1 minute, once per person)

Do this once in Claude Code. It's all point-and-click:

1. Type **`/plugin`** and press Enter (opens the plugin manager).
2. Choose **Add marketplace**, then paste this and confirm:
   ```
   cheflamb/claudeos-handoff
   ```
3. Find **claudeos-handoff** in the list, choose **Install**, pick **"Install for you"** - then **restart Claude Code**.

**Done.** In any project, type **`/handoff`** at the end of a work session.

> Prefer the command line? Run these one at a time instead of steps 2-3:
> ```
> /plugin marketplace add cheflamb/claudeos-handoff
> ```
> ```
> /plugin install claudeos-handoff@claudeos-handoff
> ```

---

## What `/handoff` does

Run it at the end of a work session (say "handoff" / "wrap up" / "sign off"). It:

- Reconciles the current project's docs against what actually shipped this session.
- Regenerates a per-project **`HANDOFF.md`** next to that project's instructions file, with: **Status**, a **cross-system wiring map** (repo -> branch -> host/URL -> data store -> external services/IDs), **open threads / next actions**, a **changelog**, and **pointers**.
- Optionally maintains a thin workspace-wide index (if you configure a `workspaceRoot`).
- Syncs your memory store (if your setup has one).
- **Proposes** data/state cleanup and only deletes what you explicitly confirm (never auto-deletes).

The point: the next (cold) session reads `HANDOFF.md` and is productive immediately, without rediscovering how everything is wired.

## Updating

Auto-update is on by default, so new versions arrive on their own. To refresh manually:
```
/plugin marketplace update claudeos-handoff
```

## Optional config

Create `.claude/handoff.json` in a project (or a parent folder) to turn on the cross-project workspace index:

```json
{
  "workspaceRoot": "/absolute/path/to/your/workspace",
  "workspaceName": "My ClaudeOS",
  "syncMemory": true
}
```

All fields are optional. With no config, `/handoff` still writes the per-project `HANDOFF.md` (fully portable); it just skips the workspace index.

## Session hooks (v1.2.0+)

Starting in v1.2.0, ClaudeOS Handoff closes the loop automatically: it writes the handoff on the way out and reads it back on the way in. The hooks activate after you install (or update to) v1.2.0 and restart Claude Code or Cowork — no configuration needed.

> Install and update instructions are in the Quickstart and Updating sections above; the hooks ship with the plugin, so there is nothing extra to enable.

### What the hooks do

- **SessionStart** — when a session starts, resumes, or restarts after compaction, the plugin finds the nearest `HANDOFF.md` (walking up from the working directory) and injects it as cold-start context. The new session opens already knowing where the last one left off — no manual "read HANDOFF.md first" step required.
- **PreCompact** — before the context window compacts, the plugin snapshots the session transcript to `.claude/backups/` (keeping the most recent 10), so detail is not lost to summarization. Regenerating `HANDOFF.md` remains a `/handoff` action; the backup is a safety net, not a replacement.

### Where hooks run

Hooks run in **Claude Code and Cowork only** — they do not fire in plain web or desktop chat. In chat, the skill still works and `/handoff` runs on demand, but the automatic cold-start injection will not trigger. This is expected behavior, not a bug.

## Tip

Add a line to a project's instructions file (e.g. `CLAUDE.md`) so cold sessions auto-read the handoff:

```
> Cold start: read HANDOFF.md (next to this file) first.
```
