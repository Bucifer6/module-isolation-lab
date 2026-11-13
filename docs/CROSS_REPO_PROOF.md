# Cross-repository execution evidence

The GitHub Actions workflow `cross-repository-contracts` checks out `component-alpha`, `component-beta`, and `component-shell` as **distinct repositories** and launches their services from each checkout.

Acceptance cases:
1. Compare published alpha and beta contract schema;
2. Validate authorised consumer request and cross-tenant/anonymous denials;
3. Stop the alpha provider; consumer must give bounded 503;
4. Stop optional widget; shell must continue independently.

**Limits:** This proves contract/runtime compatibility for current default-branch sources; it does not prove independent Git write restrictions, database-grant isolation, signed image deployment, backup/restore, or production identity. It also does not by itself enforce compatibility of component PRs; add required reusable checks/dispatch on component changes before treating it as a merge gate.
