#!/usr/bin/env bash
set -euo pipefail

# This uses only synthetic data and disposable credentials. Never point it at a real database.
: "${LAB_ADMIN_PASSWORD:?set LAB_ADMIN_PASSWORD for disposable PostgreSQL test database}"
db() {
  local user="$1" password="$2" query="$3"
  docker run --rm --network host -e "PGPASSWORD=${password}" postgres:16 \
    psql -h 127.0.0.1 -p 5432 -U "$user" -d labdb -X -v ON_ERROR_STOP=1 -At -c "$query"
}
db postgres "$LAB_ADMIN_PASSWORD" "
  CREATE ROLE alpha_runtime LOGIN PASSWORD 'alpha_local_demo_credential';
  CREATE ROLE beta_runtime LOGIN PASSWORD 'beta_local_demo_credential';
  CREATE SCHEMA alpha AUTHORIZATION alpha_runtime;
  CREATE SCHEMA beta AUTHORIZATION beta_runtime;
  SET ROLE alpha_runtime;
  CREATE TABLE alpha.records (id integer PRIMARY KEY);
  INSERT INTO alpha.records(id) VALUES (1);
  RESET ROLE;
  SET ROLE beta_runtime;
  CREATE TABLE beta.tasks (id integer PRIMARY KEY);
  INSERT INTO beta.tasks(id) VALUES (2);
  RESET ROLE;
" >/dev/null

positive() {
  local label="$1" user="$2" password="$3" query="$4"
  if ! db "$user" "$password" "$query" >/dev/null; then
    echo "FAIL allowed: $label"; exit 1
  fi
  echo "PASS allowed: $label"
}
negative() {
  local label="$1" user="$2" password="$3" query="$4"
  local output
  if output="$(db "$user" "$password" "$query" 2>&1)"; then
    echo "FAIL unexpectedly allowed: $label";exit 1
  fi
  if ! grep -qi 'permission denied' <<<"$output"; then
    echo "FAIL unexpected database error: $label";exit 1
  fi
  echo "PASS denied: $label"
}
positive "alpha own read" alpha_runtime alpha_local_demo_credential 'SELECT * FROM alpha.records'
positive "beta own read" beta_runtime beta_local_demo_credential 'SELECT * FROM beta.tasks'
positive "alpha own write" alpha_runtime alpha_local_demo_credential 'INSERT INTO alpha.records(id) VALUES(3)'
positive "beta own write" beta_runtime beta_local_demo_credential 'INSERT INTO beta.tasks(id) VALUES(4)'
negative "alpha cannot read beta" alpha_runtime alpha_local_demo_credential 'SELECT * FROM beta.tasks'
negative "alpha cannot write beta" alpha_runtime alpha_local_demo_credential 'INSERT INTO beta.tasks(id) VALUES(5)'
negative "beta cannot read alpha" beta_runtime beta_local_demo_credential 'SELECT * FROM alpha.records'
negative "beta cannot write alpha" beta_runtime beta_local_demo_credential 'INSERT INTO alpha.records(id) VALUES(6)'
echo 'PASS: four permitted operations, four denied cross-schema operations'
