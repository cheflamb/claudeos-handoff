# ClaudeOS Handoff

A Claude Code skill that leaves a clean end-of-session handoff so the next (cold) session picks up instantly. Distributed to the Chef Life Media / TWA team via this marketplace.

## Quickstart (3 steps, ~1 minute, once per person)

Do this once in Claude Code. It's all point-and-click:

1. Type **`/plugin`** and press Enter (opens the plugin manager).
2. Choose **Add marketplace**, then paste this and confirm:
   ```
   cheflamb/clm-handoff
   ```
3. Find **claudeos-handoff** in the list, choose **Install**, pick **"Install for you"** - then **restart Claude Code**.

**Done.** In any project, type **`/handoff`** at the end of a work session.

> Prefer the command line? Run these one at a time instead of steps 2-3:
> ```
> /plugin marketplace add cheflamb/clm-handoff
> ```
> ```
> /plugin install claudeos-handoff@clm-handoff
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

When we push improvements here, refresh with:
```
/plugin marketplace update clm-handoff
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

## Tip

Add a line to a project's instructions file (e.g. `CLAUDE.md`) so cold sessions auto-read the handoff:

```
> Cold start: read HANDOFF.md (next to this file) first.
```
