# Architecture experiment evidence log

This file records **observed** results. Blank is not a failure or a pass; it means not tested.

| Acceptance test | Status | Evidence link / reproducible command |
|---|---|---|
| Synthetic lab automated checks on GitHub | PASS | PR #1 CI |
| Independent alpha repository created | NOT TESTED | Issue #2 |
| Independent beta repository created | NOT TESTED | Issue #3 |
| Independent shell repository created | NOT TESTED | Issue #4 |
| Distinct write tokens denied across sibling repos | NOT TESTED | Issue #5 |
| PostgreSQL cross-schema read/write denied | NOT TESTED | Issue #5 |
| Versioned provider/consumer release compatibility | NOT TESTED | Issue #5 |
| Independently deployed container rollback | NOT TESTED | Issue #5 |
| Recovered identity, records and files after encrypted restore | NOT TESTED | Issue #5 |
| Fault containment under explicit CPU/RAM limits | NOT TESTED | Issue #5 |

Do not store credentials, production data or unredacted account identifiers here.
