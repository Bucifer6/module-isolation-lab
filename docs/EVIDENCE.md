# Architecture experiment evidence log

This file records **observed** results only. A blank or NOT TESTED entry is not a pass.

| Acceptance test | Status | Evidence |
|---|---|---|
| Synthetic lab automated checks on GitHub | PASS | PR #1 CI in module-isolation-lab |
| Separate alpha repository exists with standalone provider and passing CI | PASS | https://github.com/Bucifer6/component-alpha/pull/1 |
| Separate beta repository exists with standalone consumer and passing CI | PASS | https://github.com/Bucifer6/component-beta/pull/1 |
| Separate shell repository exists with standalone shell and passing CI | PASS | https://github.com/Bucifer6/component-shell/pull/1 |
| Three repositories checked out and exercised as independent processes | PASS | https://github.com/Bucifer6/module-isolation-lab/actions/runs/43420111837 |
| Provider and consumer published schema equality | PASS | Same cross-repository GitHub Action |
| Cross-tenant / anonymous HTTP access denied in synthetic lab | PASS | Same cross-repository GitHub Action |
| Provider and widget outages contained across processes | PASS | Same cross-repository GitHub Action |
| Agent-scoped Git credentials denied across sibling repositories | NOT TESTED | Issue #5; all current work was performed with an authorised admin identity |
| PostgreSQL cross-schema read/write denied using runtime roles | NOT TESTED | Issue #5 |
| Independent container release and rollback under resource limits | NOT TESTED | Issue #5 |
| Durable event bus, outbox and replay | NOT TESTED | Issue #5 |
| Encrypted backup, complete restore and recovery reconciliation | NOT TESTED | Issue #5 |
| Cross-repository CI required by every component PR | NOT TESTED | Currently separate component CI plus manually/dispatch-triggered integration workflow; not a mandatory gate for component PRs |

Synthetic test tokens and examples are not production authentication or authorisation.
Do not commit credentials, real business data or unredacted access logs. GitHub account metadata remains attributable.
