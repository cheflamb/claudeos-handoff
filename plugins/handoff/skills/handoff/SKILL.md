---
name: handoff
description: Use at the end of a work session to leave a clean, self-contained handoff for the next (cold) session. Reconciles the current project's docs against what actually shipped, regenerates a per-project HANDOFF.md (status + cross-system wiring map + open threads + changelog + pointers), optionally updates a workspace-wide index, syncs memory if the environment has a memory convention, and PROPOSES (never auto-runs) data/state cleanup. Triggers: "handoff", "hand off", "end of session", "sign off", "wrap up the session", "leave a handoff".
---

# Handoff (end-of-session signoff)

A general-purpose, cross-project routine. It is a global tool, callable from ANY folder. It always operates on the **current** project (the session's working directory) and never drags one project's context into another. The *skill* is portable; the *artifacts* it writes are local to wherever you run it.

Goal: make the next session productive **cold**. The single highest-value output is the **cross-system wiring map** (repo -> branch -> host/URL -> data store -> external services/IDs), because that is what is most expensive to rediscover and usually lives in no single file.

## When to use
- The user says "handoff" / "wrap up" / "sign off" / "end of session".
- After finishing a meaningful chunk of work, before context is lost.

## When NOT to use
- Mid-task with no natural stopping point. Do not interrupt active work to run this.

## Hard safety rules (do not violate)
1. **Propose-only cleanup.** NEVER delete data (DB rows, external records, files) without an explicit per-item confirmation from the user. Default to a dry-run list. This is what makes the skill safe to run routinely.
2. **Never commit or push** unless the user explicitly asks. Surface uncommitted/unpushed work as findings; do not act on it.
3. **Scope to the current project only.** Do not read or mutate another project's data.
4. **Any index/roll-up is append/update, not overwrite.** Preserve other projects' rows.
5. **Verify before asserting.** Read the actual state (git status, DB, deploy API) rather than recalling it.

## Configuration (portable)
This skill has no machine-specific paths baked in. It reads optional settings from a `handoff.json` in the project's `.claude/` directory (or the nearest ancestor `.claude/`), all fields optional:

```json
{
  "workspaceRoot": "",   // absolute path where the thin cross-project index lives; omit to skip the index
  "workspaceName": "",   // label for the index header, e.g. "Acme ClaudeOS"
  "syncMemory": true     // whether to run the memory lane (see below)
}
```

If `workspaceRoot` is unset and the user has not told you their workspace root, **skip the workspace index and just write the per-project HANDOFF.md** (it is fully portable). You may offer to save a `workspaceRoot` once so future runs maintain the index.

## Process

### 1. Orient
- Determine the current project root (cwd) and its `CLAUDE.md`/instructions file (if any). The project's handoff doc is `HANDOFF.md` beside it.
- Load `handoff.json` config if present.

### 2. Fan out subagent lanes (parallel)
Dispatch one subagent per lane (in a single message so they run concurrently). In a session that already holds full context you MAY gather a lane's facts directly instead of dispatching; in a cold/resumed session, dispatch, because the subagents do the rediscovery. Each lane writes findings to a scratch file and returns a short summary.
- **Docs lane** - reconcile the project's instructions + any spec/plan/doc files against what actually shipped this session. Produce proposed doc edits + drafted content for each HANDOFF.md section.
- **Git/deploy lane** - `git status` + branch/push state for each repo touched; which commit is live on each deploy target; flag leftover placeholders (`REPLACE_WITH_*`, `TODO`, stray fences) in shipped files.
- **Data-audit lane** - enumerate stale/test data created or left this session (DB test rows, orphaned external records, temp files). Classify each SAFE-TO-DELETE vs KEEP with a reason. Proposes only; never deletes.
- **Memory lane** (only if `syncMemory` and the environment documents a memory convention in its instructions files) - update that memory store with durable cross-session facts. If no memory convention exists, skip this lane.

### 3. Write the project HANDOFF.md
Regenerate `<project>/HANDOFF.md` with these five sections, in this order (a cold reader wants status and wiring first):

```markdown
# <Project> Handoff
_Last updated: <YYYY-MM-DD> - <one-line what-just-happened>_

## 1. Status
<Live / In progress / Pending - each dated. Blunt. What works, what doesn't.>

## 2. Wiring map
| Asset | Repo @ branch | Host / URL | Data store | External services / IDs |
|---|---|---|---|---|
<one row per shipped asset - the highest-value section>

## 3. Open threads / next actions
<Numbered. Known bugs, deferred work, anything needing the human.>

## 4. Changelog (recent first)
<Dated bullets: what shipped, per session.>

## 5. Pointers
<Links to specs/plans/docs, memory references, key commits.>
```

### 4. Update the workspace index (only if workspaceRoot is known)
In `<workspaceRoot>/HANDOFF.md`, add or update ONE row for this project, leaving all other rows intact:

```markdown
# <workspaceName or "Workspace"> Handoff Index
_One row per active initiative. Open the project's own HANDOFF.md for detail. Maintained by the /handoff skill._

| Project | HANDOFF.md | Status (one line) | Updated |
|---|---|---|---|
| <name> | <relative path to project HANDOFF.md> | <one-line status> | <YYYY-MM-DD> |
```

### 5. Propose cleanup (confirm-gated)
Present the data-audit lane's SAFE-TO-DELETE list as a numbered checklist with counts and reasons. Ask the user which to delete (y/N per item, or "all"/"none"). Delete ONLY what they confirm. List KEEP items too, with why, so nothing is silently dropped.

### 6. Signoff summary
Print a tight summary: what changed this session, what is live, what is pending, what needs the human, and where the fresh session should start.

## Notes
- The per-project `HANDOFF.md` is the human-readable, git-trackable copy; the memory store (if any) is the always-auto-loaded copy. Keep both; they serve different moments.
- General tools go global; project knowledge stays folder-scoped. This skill embodies that: global skill, local artifacts.
