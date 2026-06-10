# Triage Labels

The engineering skills use five canonical triage roles. This repository uses
the canonical strings directly, with no repo-specific aliases.

| Canonical role | GitHub label | Meaning |
| --- | --- | --- |
| `needs-triage` | `needs-triage` | A maintainer needs to evaluate the issue. |
| `needs-info` | `needs-info` | Work is waiting for information from the reporter. |
| `ready-for-agent` | `ready-for-agent` | The issue is fully specified and an agent can implement it without additional human context. |
| `ready-for-human` | `ready-for-human` | The issue requires human implementation or judgment. |
| `wontfix` | `wontfix` | The issue will not be actioned. |

When a skill refers to a triage role, use the corresponding GitHub label from
this table. Apply only the label that represents the issue's current triage
state, removing a previous triage-state label when the state changes.

If the GitHub repository does not yet contain one of these labels, create it
before applying it rather than substituting a different label name.
