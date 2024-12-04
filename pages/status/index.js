import useSWR from "swr";

async function fetchAPI() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: 0,
          padding: 0,
          justifyContent: "center",
          alignItems: "center",
          height: "98vh",
          width: "100%",
          borderRadius: "8px",
          background: "#f4f4f5",
          lineHeight: 0,
        }}
      >
        <h1
          style={{
            color: "#ef4444",
            fontFamily: "monospace",
            fontSize: "3rem",
          }}
        >
          Status
        </h1>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "16px",
            marginTop: "12px",
          }}
        >
          <UpdatedAt />
        </div>
      </div>
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtDateText = "...";
  let updatedAtTimeText = "...";
  let version = "...";
  let maxConnections = "...";
  let activeConnections = "...";

  if (!isLoading && data) {
    updatedAtDateText = new Date(data.updated_at).toLocaleDateString("pt-BR");
    updatedAtTimeText = new Date(data.updated_at).toLocaleTimeString("pt-BR");
    version = data.dependencies.version;
    maxConnections = data.dependencies.max_connections;
    activeConnections = data.dependencies.postgres_actconn;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "12px",
        height: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #ef4444",
          paddingInline: "16px",
          paddingBlock: "24px",
          borderRadius: "8px",
        }}
      >
        <h2>Ultima atualização</h2>
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <p>
            {updatedAtDateText} ás {updatedAtTimeText}
          </p>
        </div>
      </div>

      <div
        style={{
          gridColumn: 2,
          border: "1px solid #ef4444",
          paddingInline: "16px",
          paddingBlock: "24px",
          borderRadius: "8px",
        }}
      >
        <h2>Database</h2>
        <br />

        <h4>Versão</h4>
        <p>{version}</p>
        <br />

        <h4>Máximo de conexões</h4>
        <p>{maxConnections}</p>
        <br />

        <h4>Conexões atuais</h4>
        <p>{activeConnections}</p>
      </div>
    </div>
  );
}
