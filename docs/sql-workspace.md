# SQL Database Workspace

The tool at `/api-and-web-services/sql-client` supports browser-local SQLite and native PostgreSQL, MySQL and MariaDB connections. Native connections require the desktop app or an explicitly enabled local connector runtime; the browser-only deployment does not open database sockets.

SQLite runs in a local worker. Native connections use the entered host, port, database, user, password and TLS setting. TLS verifies the server certificate when enabled. Schema browsing lists databases, tables and columns. Queries accept a JSON array of bound parameters: PostgreSQL uses `$1`, `$2`; MySQL and MariaDB use `?`. History and saved query text belong to the active project. Connection credentials can be saved through the encrypted connection vault rather than plain query history.

The workspace controls, usage instructions, history, result pagination and application validation messages support the eight interface languages. SQL, parameters and result cells remain unchanged when switching languages. Arabic uses RTL interface controls with LTR query inputs, placeholder notation and result tables. Custom query and connection names stay as entered. Driver diagnostics retain their original wording when an authored translation is unavailable.

## Results and read-only mode

Results retain ordered columns, including duplicate names. Native query output is limited to 500 rows and 2 MiB. Binary values use an explicit hex/byte representation; large integers and timestamps retain their server text representation. PostgreSQL JSON/JSONB values and their arrays, and MySQL/MariaDB JSON values, stay as server text. The connector does not parse JSON into JavaScript numbers. Database-side JSON normalization still applies. SQL `NULL` remains distinct from the JSON text `null`.

The row limit affects the displayed result. Explicit writes with `RETURNING` finish before commit even when more than 500 rows are returned. Result serialization and the 2 MiB response check happen before committing transactional writes; a rejected oversized result rolls back that transaction when the connection closes. Database statements with implicit commits, such as MySQL/MariaDB DDL, follow the database's own transaction rules and cannot be rolled back by this response check.

Read-only is the default. PostgreSQL starts a read-only transaction. MySQL/MariaDB also set the connection's session transaction default to read-only, so an implicit transaction after DDL cannot silently become writable. The connection closes after the operation. Write mode is an explicit choice; database account permissions continue to apply.

MySQL documents which statements cause an [implicit commit](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html) and how [session transaction characteristics](https://dev.mysql.com/doc/refman/8.4/en/set-transaction.html) affect subsequent transactions. The project's disposable integration checks additionally prove that rejected CREATE TABLE statements leave no table behind.

## Verification

The integration scripts create/drop named fixture tables in a database named `fixture`. Run them only against disposable test databases. They require all three engine ports so a partial matrix cannot be mistaken for a complete run.

```sh
EXPANSION_PG_PORT=<postgres-fixture-port> \
EXPANSION_MYSQL_PORT=<mysql-fixture-port> \
EXPANSION_MARIADB_PORT=<mariadb-fixture-port> \
npm run test:sql-connectors:integration
```

The direct driver matrix verifies bound parameters, mixed Japanese/Arabic/emoji text, duplicate columns, row/size limits, binary/int64/microsecond timestamps, JSON/JSONB/array precision, SQL NULL versus JSON null, rejected writes/DDL and redacted authentication errors. PostgreSQL and MariaDB additionally verify that a 600-row INSERT RETURNING persists all rows while displaying 500, and that oversized returned output rolls back its insert. The verified fixtures report PostgreSQL 18.6, MySQL 8.4.11 and MariaDB 11.8.9. MariaDB uses official image digest `sha256:f16d7a344413e519dff518f27bdb221388f84b0d274c97c4fb5f2cb0dc1b34fa` with a localhost-only published port and public fixture credentials.

`npm run test:sql-production` uses the same environment variables and the owned runtime at `http://127.0.0.1:3100`. Production build 45 passes the compiled route's token/origin gates, result fidelity and read-only DDL checks for all three engines, plus PostgreSQL/MariaDB truncated-write and oversized-result rollback checks. Evidence is tracked in `docs/capability-expansion-status.json`.

Production47 browser verification additionally saved a public MariaDB connection encrypted in an isolated project, reloaded the page, loaded the record from a different selected SQL engine, and verified restoration of MariaDB/host/port/database/user/TLS settings. A bound query then returned exact int64, mixed-script and JSON values. Successful loading cleared the passphrase input. Incorrect-passphrase recovery was verified in German. The public test project's keys were cleared from page memory, the original project was restored, and the test project was moved to recoverable Deleted projects; no user connection or vault was overwritten or permanently deleted.
