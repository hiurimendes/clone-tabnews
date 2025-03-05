import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const queryPostgresVersion = await database.query("SHOW server_version;");
  const postgres_version = queryPostgresVersion.rows[0].server_version;

  const queryPostgresMaxConnection = await database.query(
    "SHOW max_connections;",
  );
  const postgresMaxConnection =
    queryPostgresMaxConnection.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const queryPostgresActiveConnection = await database.query({
    text: "select count(*)::int active_connections from pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const postgresActiveConnection =
    queryPostgresActiveConnection.rows[0].active_connections;

  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      version: postgres_version,
      max_connections: parseInt(postgresMaxConnection),
      postgres_actconn: postgresActiveConnection,
    },
  });
}
