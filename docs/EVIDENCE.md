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
| Agent-scoped Git credentials denied across sibling repositories | PASS (three public components) | Three single-repository app tokens each pushed an own-repo disposable branch. GitHub denied all six sibling pushes. See drill details below. |
| PostgreSQL cross-schema read/write denied using runtime roles | PASS (disposable database only) | [GitHub Actions run 43420555267](https://github.com/Bucifer6/module-isolation-lab/actions/runs/43420555267); four permitted own-schema operations and four forbidden cross-schema operations |
| Independent container release and rollback under resource limits | NOT TESTED | Issue #5 |
| Durable event bus, outbox and replay | NOT TESTED | Issue #5 |
| Encrypted backup, complete restore and recovery reconciliation | NOT TESTED | Issue #5 |
| Cross-repository CI required by every component PR | PARTIAL | Alpha main requires the provider compatibility check. See the ruleset and test runs below. |

Synthetic test tokens and examples are not production authentication or authorisation.
Do not commit credentials, real business data or unredacted access logs. GitHub account metadata remains attributable.

## Compatibility PR and local drill results

| Check | Observed result | Evidence and scope |
|---|---|---|
| Provider PR checks pinned consumer and lab fixtures | PASS on the workflow PR | [Provider PR #2](https://github.com/Bucifer6/component-alpha/pull/2), [compatibility run](https://github.com/Bucifer6/component-alpha/actions/runs/43427669826), [standalone run](https://github.com/Bucifer6/component-alpha/actions/runs/43427669825). PR #2 passed separate agent review and merged. |
| Required v1 field renamed in schema and HTTP payload | Expected FAIL | [Disposable PR #3](https://github.com/Bucifer6/component-alpha/pull/3), [compatibility job](https://github.com/Bucifer6/component-alpha/actions/runs/43427743924/job/131893254734). Setup succeeded and the integration test step failed. PR closed without merging. |
| Local independent image replacement and rollback | PASS (local, unsigned images) | Docker 29.7.2, isolated network, memory/CPU/PID caps configured. Lab sources adapted locally to bind inside containers. Beta returned 200, then 503 on alpha outage, then 503 on incompatible alpha, then 200 after restoring the original alpha image by ID. Shell health stayed 200. Beta and shell kept their container IDs and had zero restarts. |
| Local encrypted PostgreSQL cold restore | PASS (single-host fixture) | AES-256-GCM dump, original database and volume removed, restore into a fresh isolated PostgreSQL 16 container. Modified ciphertext was rejected. Restored row, SHA-256 of attachment bytes, allowed SELECT and denied SELECT matched the source. |

Local drills did not exercise signing, registry promotion, resource saturation, independent backup storage or credentials, external object storage, or timed disaster recovery.

## Scoped Git and required-check drill

On 13 November 2026, the installation repositories API reported one assigned repository per token. Each app had Contents write and Metadata read. Each pushed to its own disposable feature branch, and GitHub denied writes to both sibling repositories. The three branches were deleted and the three successful-run tokens were revoked. An alpha token from an earlier interrupted attempt was left to expire under GitHub's one-hour lifetime.

A second run repeated all three permitted writes and six sibling denials and demonstrated three additional server denials against this central lab repository. Temporary branches were deleted and the three new tokens revoked.

Alpha `main` has active ruleset 27201783, requiring PRs and the strict `provider-consumer-v1` check. Against that branch, [the breaking test](https://github.com/Bucifer6/component-alpha/actions/runs/43431594543) failed and [the compatible control](https://github.com/Bucifer6/component-alpha/actions/runs/43431655147) passed. Both test PRs were closed unmerged. The public branch-rules endpoint returned no active ruleset entries for beta or shell `main`. Direct pushes to protected branches, bypass actors, future central repository restrictions and runner isolation remain unverified.
