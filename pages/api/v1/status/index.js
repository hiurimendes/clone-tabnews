import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseName = process.env.POSTGRES_DB;

    const [databaseVersion, databaseMaxConnections, databaseOpenedConnections] =
      // eslint-disable-next-line no-undef
      await Promise.all([
        database.query("SHOW server_version;"),
        database.query("SHOW max_connections;"),
        database.query({
          text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1;",
          values: [databaseName],
        }),
      ]);

    const databaseVersionValue = databaseVersion.rows[0].server_version;
    const databaseMaxConnectionsValue = parseInt(
      databaseMaxConnections.rows[0].max_connections,
    );
    const databaseOpenedConnectionsValue =
      databaseOpenedConnections.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: databaseMaxConnectionsValue,
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.log(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
