# Issue Tracker: GitHub

Issues and PRDs for this repository live in GitHub Issues at
`amitabhsuryawanshi66-sudo/estateflow-crm`.

Use the connected GitHub app when it is available. Otherwise, use an
authenticated `gh` CLI from inside this clone so the repository is inferred
from `origin`.

## Conventions

- Create an issue with the GitHub issue creation tool or `gh issue create`.
- Read an issue and its comments before changing its state or specification.
- List issues with explicit state and label filters.
- Add progress or triage context as issue comments rather than replacing the
  original report.
- Apply and remove labels using the mapping in
  `docs/agents/triage-labels.md`.
- Close an issue only with a comment explaining the outcome.

## Skill Routing

- When a skill says "publish to the issue tracker", create a GitHub issue.
- When a skill says "fetch the relevant ticket", read the GitHub issue,
  including its labels and comments.
- `to-prd` publishes the PRD as a GitHub issue.
- `to-issues` creates independently actionable GitHub issues and preserves
  links between related work.
- `triage` reads and updates GitHub issues according to the configured label
  state machine.
- `diagnose`, `tdd`, `zoom-out`, `handoff`, and
  `improve-codebase-architecture` should reference relevant GitHub issue
  numbers when the task provides them, but must not infer work from unrelated
  issues.

## CLI Examples

```sh
gh issue create --title "..." --body "..."
gh issue view <number> --comments
gh issue list --state open --json number,title,body,labels,comments
gh issue comment <number> --body "..."
gh issue edit <number> --add-label "..."
gh issue edit <number> --remove-label "..."
gh issue close <number> --comment "..."
```

Do not place secrets or private environment values in issue bodies or comments.
