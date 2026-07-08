# clm-handoff

A Claude Code plugin marketplace for Chef Life Media's shared ClaudeOS skills. Currently ships one skill: **`/handoff`**.

## What `/handoff` does

Run it at the end of a work session (say "handoff" / "wrap up" / "sign off"). It:

- Reconciles the current project's docs against what actually shipped this session.
- Regenerates a per-project **`HANDOFF.md`** next to that project's instructions file, with: **Status**, a **cross-system wiring map** (repo -> branch -> host/URL -> data store -> external services/IDs), **open threads / next actions**, a **changelog**, and **pointers**.
- Optionally maintains a thin workspace-wide index (if you configure a `workspaceRoot`).
- Syncs your memory store (if your setup has one).
- **Proposes** data/state cleanup and only deletes what you explicitly confirm (never auto-deletes).

The point: the next (cold) session reads `HANDOFF.md` and is productive immediately, without rediscovering how everything is wired.

## Install (each person, once)

In Claude Code:

```
/plugin marketplace add cheflamb/clm-handoff
/plugin install handoff@clm-handoff
```

Then `/handoff` is available in every session, in any folder. Updates arrive when you re-run the marketplace update (or reinstall) after we push changes here.

## Optional config

Create `.claude/handoff.json` in a project (or a parent folder) to turn on the workspace index:

```json
{
  "workspaceRoot": "/absolute/path/to/your/workspace",
  "workspaceName": "My ClaudeOS",
  "syncMemory": true
}
```

All fields are optional. With no config, `/handoff` still writes the per-project `HANDOFF.md` (fully portable); it just skips the cross-project index.

## Tip

Add a line to a project's instructions file (e.g. `CLAUDE.md`) so cold sessions auto-read the handoff:

```
> Cold start: read HANDOFF.md (next to this file) first.
```
