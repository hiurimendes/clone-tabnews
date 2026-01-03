import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = response.json();

  return responseBody;
}

function UpdatedAt() {
  const { data, isLoading, error } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  if (error) {
    updatedAtText = "Não foi possível carregar os dados.";
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { data, isLoading, error } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseInformation = "Carregando...";

  if (!isLoading && data) {
    databaseInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  if (error) {
    databaseInformation = "Não foi possível carregar os dados.";
  }

  return (
    <>
      <h2>Database</h2>
      <div>{databaseInformation}</div>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}
