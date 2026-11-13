# Evidence and limitations

This repository contains a non-production, anonymised proof of isolated service communication.

## Demonstrated by source and intended CI checks
- Four separately running Node.js processes connected through HTTP and a published contract shape.
- A dependent consumer that remains safely unavailable when the record provider stops.
- A UI widget loaded dynamically via a sandboxed iframe without importing widget source.
- Tenant-specific request denial using lab-only HMAC tokens.
- A negative check that a removed required contract field would be rejected.
- Mock AI routing that never silently sends restricted data to a cloud provider.

## Not demonstrated here
- A denied Git push using separately scoped credentials across distinct repositories.
- PostgreSQL schema isolation using separate runtime credentials.
- NATS JetStream event delivery, idempotency and dead-letter recovery.
- Container CPU/memory fault containment and independent image rollbacks.
- Encrypted backup, full restore, secondary VPS failover, independent release approval.
- Real OIDC authentication, tenant-aware authorisation at all business-object boundaries.

**These are acceptance gates, not completed test results.**

## Privacy
All source records are fictional. The remote hosting account, commit author, timestamps and hosting service logs remain attributable; code anonymisation does not anonymise repository ownership.
