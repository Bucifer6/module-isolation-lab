# Disposable PostgreSQL role-grant test

The `database-role-boundaries` CI workflow starts a disposable PostgreSQL 16 service. It provisions two **separate non-superuser runtime roles** and two owner schemas containing fictional test rows.

The test asserts that each runtime identity can read and write only within its own schema. Four deliberately unauthorised read/write attempts across schemas must be rejected specifically as **permission denied**, not merely connection failure.

This test exercises database ACL behaviour on a throwaway instance. It **does not prove** runtime service containers use these credentials in a real deployment, migrations are restricted, or disaster recovery works. Those are later proof gates.

There are no production credentials; all passwords and records exist exclusively inside disposable test runs.
