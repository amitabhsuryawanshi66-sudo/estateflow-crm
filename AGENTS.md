<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

- This repo uses Next.js 16. Use Next.js 16 conventions. For route protection/request interception, prefer proxy.ts over middleware.ts unless compatibility requires otherwise.

## Project context

EstateFlow CRM is a production-style Next.js and Supabase CRM. Preserve production-quality security, maintainability, testing, and operational practices while keeping changes scoped to the requested task.

## Phase-based workflow

- Work on one focused task at a time. The operator will paste each task into Codex with its scope, constraints, expected report, and intended skill.
- Do not infer work from an external orchestration document. In particular, do not search for, read, or depend on `CONDUCTOR.md`.
- Complete only the pasted task, produce its requested report, then stop and wait for the next prompt. Do not begin a later phase or adjacent task unless explicitly requested.

## Agent skills

- Use an installed skill whenever the prompt explicitly names it.
- If a named skill does not load automatically, read `.agents/skills/<skill-name>/SKILL.md` and apply its methodology.
- Do not merely claim that a skill was used. In the requested report, name the specific `SKILL.md` methodology applied and what it changed.
- Use `tdd` for behavior-focused implementation and verification tasks, following small vertical red-green-refactor cycles.
- Use `grill-me` when important decisions remain unresolved. Resolve one blocking question at a time and provide a recommended answer.
- Use `diagnose` for reproduced failures, bugs, and debugging work.
- Use `to-prd` and `to-issues` only when explicitly asked to convert an established plan or conversation into a PRD or implementation issues.
- Use `triage` for issue categorization, specification readiness, and workflow state changes, not for implementing the issue.
- Use `zoom-out` before changing an unfamiliar subsystem so the work is grounded in its broader architecture and domain context.
- Use `improve-codebase-architecture` at explicit architecture checkpoints after meaningful code exists.
- Use `handoff` when another agent or future session needs a compact context transfer.
- Use `prototype` only for throwaway experiments used to explore behavior, state, or interface options before production implementation.
- Do not edit `.agents/skills/` during normal application work. Skill maintenance must be an explicitly requested task.

### Skill support docs

- Issues and PRDs are tracked in this repository's GitHub Issues. See `docs/agents/issue-tracker.md`.
- Triage uses the five canonical label roles documented in `docs/agents/triage-labels.md`.
- This is a single-context repository with lazy root-level domain docs and ADRs. See `docs/agents/domain.md`.
- Do not search for, read, or depend on `CONDUCTOR.md`.

## Dependency and secret safety

- Avoid unnecessary dependencies. Do not add or update packages unless the focused task requires it and the operator approves it.
- Do not run `npm install`.
- Only when dependency installation is actually required and approved, prefer `npm ci --ignore-scripts` when `package-lock.json` exists.
- Do not run normal `npm ci` unless required install scripts have been identified, explained, and explicitly approved.
- Never inspect, print, modify, expose, or commit secrets from `.env.local`.
- If `package.json` or `package-lock.json` changes unexpectedly, stop and report the change.
