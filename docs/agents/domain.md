# Domain Docs

EstateFlow CRM uses a single-context domain documentation layout.

## Before Exploring

Read these files when they exist and are relevant to the focused task:

- `CONTEXT.md` at the repository root for domain language and glossary terms.
- `docs/adr/` for architectural decisions that affect the area being changed.

If either path does not exist, proceed silently. Do not create domain docs
upfront merely to satisfy this layout. The documentation workflow creates them
lazily when domain terms or architectural decisions are actually resolved.

## Layout

```text
/
|-- CONTEXT.md
|-- docs/
|   |-- adr/
|   `-- agents/
|       |-- domain.md
|       |-- issue-tracker.md
|       `-- triage-labels.md
`-- src/
```

The absence of `CONTEXT-MAP.md` identifies this as a single-context
repository. If the repository later becomes multi-context, add a root
`CONTEXT-MAP.md`, point it to the relevant context-specific `CONTEXT.md`
files, and update this document.

## Consumer Rules

- Use the exact domain vocabulary defined in `CONTEXT.md` in issue titles,
  hypotheses, tests, refactor proposals, and handoffs.
- Do not invent synonyms for terms the glossary defines.
- Read ADRs that affect the current task before recommending or implementing
  a conflicting design.
- Surface any conflict with an ADR explicitly; do not silently override it.
- Keep exploration scoped to the task pasted by the operator. Do not infer
  adjacent phases or work from unrelated planning material.
- Do not search for, read, or depend on `CONDUCTOR.md`.
