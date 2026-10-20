import { authorizeLocalConnector, ConnectorHttpError, readConnectorBody, withConnectorSlot } from "@/lib/local-connector-auth";
import { parseSqlConnection, runSql } from "@/lib/sql-connector";
import { parseRedisConnection, runRedis } from "@/lib/redis-connector";
import { parseS3Connection, runS3 } from "@/lib/s3-connector";
import { parseMongoConnection, runMongo } from "@/lib/mongo-explorer";
import { parseFirestoreConnection, runFirestore } from "@/lib/firestore-explorer";
import { parseElasticsearchConnection, runElasticsearch } from "@/lib/elasticsearch-explorer";
import { runGrpc } from "@/lib/grpc-connector";
import { runLocalHttp } from "@/lib/local-http-client";
import { manageLocalMock } from "@/lib/local-mock-server";
export const runtime = "nodejs";
const response = (value: unknown, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "no-store, private" } });
function failure(cause: unknown) { return response({ error: cause instanceof Error ? cause.message : "The connector request failed." }, cause instanceof ConnectorHttpError ? cause.status : 502); }
export async function GET(request: Request) {
    try { authorizeLocalConnector(request); return response({ available: true, services: ["sql", "redis", "s3", "documents", "grpc", "request", "mock"], sqlEngines: ["postgresql", "mysql", "mariadb"], documentEngines: ["mongodb", "firestore", "elasticsearch"] }); }
    catch (cause) { return failure(cause); }
}
export async function POST(request: Request) {
    try {
        authorizeLocalConnector(request);
        const input = await readConnectorBody(request);
        if (input.service === "grpc") return await withConnectorSlot(async () => response(await runGrpc(input, request.signal)));
        if (input.service === "request") return await withConnectorSlot(async () => response(await runLocalHttp(input, request.signal)));
        if (input.service === "mock") return await withConnectorSlot(async () => response(await manageLocalMock(input, request.headers.get("origin")!)));
        if (input.service === "documents") return await withConnectorSlot(async () => {
            if (input.engine === "mongodb") return response(await runMongo(parseMongoConnection(input.connection), String(input.operation), input));
            if (input.engine === "firestore") return response(await runFirestore(parseFirestoreConnection(input.connection), String(input.operation), input));
            if (input.engine === "elasticsearch") return response(await runElasticsearch(parseElasticsearchConnection(input.connection), String(input.operation), input));
            throw new ConnectorHttpError("Choose MongoDB, Firestore or Elasticsearch.", 400);
        });
        if (input.service === "s3") return await withConnectorSlot(async () => response(await runS3(parseS3Connection(input.connection), String(input.operation), input)));
        if (input.service === "redis") return await withConnectorSlot(async () => response(await runRedis(parseRedisConnection(input.connection), String(input.operation), input)));
        if (input.service !== "sql") throw new ConnectorHttpError("Unsupported connector service.", 400);
        return await withConnectorSlot(async () => {
            let connection: ReturnType<typeof parseSqlConnection>;
            try { connection = parseSqlConnection(input.connection); } catch (cause) { throw new ConnectorHttpError(cause instanceof Error ? cause.message : "Invalid SQL connection settings.", 400); }
            if (input.operation === "query") {
                if (typeof input.sql !== "string" || (input.parameters !== undefined && !Array.isArray(input.parameters))) throw new ConnectorHttpError("Enter a SQL statement and a JSON array of parameters.", 400);
                return response(await runSql(connection, input.sql, input.parameters as unknown[] ?? [], input.write !== true));
            }
            if (input.operation === "databases") {
                const sql = connection.engine === "postgresql" ? "SELECT datname AS name FROM pg_database WHERE datistemplate = false ORDER BY datname" : "SELECT schema_name AS name FROM information_schema.schemata ORDER BY schema_name";
                return response(await runSql(connection, sql, [], true));
            }
            if (input.operation === "tables") {
                const sql = connection.engine === "postgresql" ? "SELECT table_schema AS schema, table_name AS name, table_type AS type FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema, table_name" : "SELECT table_schema AS `schema`, table_name AS name, table_type AS type FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name";
                return response(await runSql(connection, sql, connection.engine === "postgresql" ? [] : [connection.database], true));
            }
            if (input.operation === "columns") {
                if (typeof input.schema !== "string" || typeof input.table !== "string") throw new ConnectorHttpError("Choose a schema and table.", 400);
                const sql = connection.engine === "postgresql" ? "SELECT column_name AS name, data_type AS type, is_nullable AS nullable, column_default AS default_value FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position" : "SELECT column_name AS name, data_type AS type, is_nullable AS nullable, column_default AS default_value FROM information_schema.columns WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position";
                return response(await runSql(connection, sql, [input.schema, input.table], true));
            }
            throw new ConnectorHttpError("Unsupported SQL operation.", 400);
        });
    } catch (cause) { return failure(cause); }
}
