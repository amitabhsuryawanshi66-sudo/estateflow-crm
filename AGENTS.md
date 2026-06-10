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
- When `tdd` is named, prefer behavior-focused test-driven development using small vertical red-green-refactor cycles.
- When `grill-me` is named, pressure-test the plan or design by resolving one decision at a time and provide a recommended answer for each question.
- When `improve-codebase-architecture` is named, use its domain-informed architecture review and refactoring methodology.
- Other installed skills, including `to-issues`, `zoom-out`, `handoff`, and `diagnose`, should follow their own `SKILL.md` instructions when named.
- Do not edit `.agents/skills/` during normal application work. Skill maintenance must be an explicitly requested task.

## Dependency and secret safety

- Avoid unnecessary dependencies. Do not add or update packages unless the focused task requires it and the operator approves it.
- Do not run `npm install`.
- Only when dependency installation is actually required and approved, prefer `npm ci --ignore-scripts` when `package-lock.json` exists.
- Do not run normal `npm ci` unless required install scripts have been identified, explained, and explicitly approved.
- Never inspect, print, modify, expose, or commit secrets from `.env.local`.
- If `package.json` or `package-lock.json` changes unexpectedly, stop and report the change.
