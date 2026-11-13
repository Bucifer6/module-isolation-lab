# Separate-repository architecture proof

This is a *synthetic experiment*. All records and sample names are fictional. GitHub account and commit metadata remain identifiable even when source files contain no business references.

The current laboratory repo is not enough to prove repository permission isolation. The three services must live in **different repositories with different write grants**.

## Required new repositories

- `component-alpha` — independently versioned record provider
- `component-beta` — contract-only consumer
- `component-shell` — shell and manifest-driven test extension

The fourth existing repository (`test`) remains an **integration-tests / coordination repository** and should not become the source of truth for any of these components.

## One-time creation from GitHub CLI (run by repository owner)

The integration available to this lab cannot create GitHub repositories. A human operator with permission can execute:

```sh
gh auth login
gh repo create component-alpha --public --description "Synthetic record provider for architecture experiment"
gh repo create component-beta --public --description "Synthetic API consumer for architecture experiment"
gh repo create component-shell --public --description "Synthetic shell and UI extension experiment"
```

These are *suggested commands*, not actions already executed. To protect privacy, create them with `--private` instead of `--public` if access control matters more than public demonstration. Use a different neutral organisation if necessary.

On new repositories: use a default branch named `main`, require PR reviews and passing checks, disable force-pushing, enable secret scanning, and restrict agent access.

## Files and dependency rules

| New repository | Move/copy from laboratory | Allowed runtime communication |
|---|---|---|
| component-alpha | `provider/server.mjs`, `provider/token.mjs`, `contracts/demo-site-v1.schema.json` | Public `/v1/demo-sites/:id` HTTP API |
| component-beta | `consumer/server.mjs`, consumer-specific tests and a *published read-only copy* of the schema | HTTP requests to alpha only; no alpha source imports |
| component-shell | `shell/server.mjs`, `widget/server.mjs`, `contracts/widget-manifest-v1.schema.json` | Fetch versioned manifest and load widget in isolated frame |
| test | Cross-module black-box tests, synthetic fixtures, interface compatibility rules | Read-only published artifacts and deployed test URLs |

Each new repository needs its own `package.json`, `.gitignore`, `.github/workflows/checks.yml` and `README.md`. Do not copy source history from private projects or commit credentials. Avoid internal network hostnames.

## Server-enforced Git negative test

Create three *different* short-lived test identities/installation tokens (one per component) and prove:
- alpha identity can push to alpha branch but is rejected when it attempts to push to beta and shell;
- beta identity can push to beta branch but is rejected when it attempts to push to alpha and shell;
- shell identity can push to shell branch but is rejected when it attempts to push to alpha and beta.

Record the 6 denied pushes and 3 permitted test pushes in `docs/EVIDENCE.md`, with credentials, personal details and account numbers redacted. Never test using a full-access owner token: a result obtained with an administrator token does not prove isolation.

**If GitHub Free/Pro account permissions cannot supply reliable per-agent restrictions, use a separate GitHub organisation with appropriate permissions or an isolated Forgejo server.** Branch protection, dependency checks and folder-only access do not substitute for server-side repository ACLs.

## Database negative test

Provision a throwaway PostgreSQL instance with separate schema owners and separate runtime roles. As `component-alpha`'s role, an attempt to read or modify beta's tables must fail with a permission error; repeat as beta against alpha. Do **not** run tests as PostgreSQL superuser. Preserve SQL output showing 4 denied operations and permitted in-domain operations.

## Release / runtime negative test

- Build and tag separate images for each repository.
- Deploy a new beta image without rebuilding or restarting alpha.
- Shut down alpha and demonstrate beta emits a bounded 503 while shell continues to serve.
- Shut down or serve an incompatible widget manifest and demonstrate shell still serves.
- Attempt to remove the `displayName` required contract field and prove CI refuses the update.
- Restore encrypted backups to an isolated installation and reconcile test objects.

## Release gate

A task is not complete until there are redacted, repeatable, independently reviewed results for the negative tests. Do not claim that the current one-repository lab demonstrates the above.

See issues #2, #3, #4 and #5 for the specific acceptance tasks.
