import DefaultLayout from "interface/DefaultLayout";
import useSWR from "swr";
import { Banner, Heading, Stack } from "@primer/react";
import { Card } from "@primer/react/experimental";

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

  return (
    <Banner variant="info" layout="compact">
      <Banner.Title>Última atualização: {updatedAtText}</Banner.Title>
    </Banner>
  );
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading || !data) {
    return;
  }

  const database = data.dependencies.database;
  const openedConnections = database.opened_connections;
  const maxConnections = database.max_connections;
  const version = database.version ?? "-";

  return (
    <>
      <Heading as="h2" variant="medium">
        Database
      </Heading>
      <Stack direction={{ narrow: "vertical", regular: "horizontal" }}>
        <Stack.Item grow>
          <Card>
            <Card.Heading>Conexões abertas</Card.Heading>
            <Card.Description>{openedConnections}</Card.Description>
            <Card.Metadata>Uso neste instante</Card.Metadata>
          </Card>
        </Stack.Item>
        <Stack.Item grow>
          <Card>
            <Card.Heading>Conexões máximas</Card.Heading>
            <Card.Description>{maxConnections}</Card.Description>
            <Card.Metadata>Conexões disponíveis</Card.Metadata>
          </Card>
        </Stack.Item>
        <Stack.Item grow>
          <Card>
            <Card.Heading>PostgreSQL</Card.Heading>
            <Card.Description>{version}</Card.Description>
            <Card.Metadata>Versão do banco de dados</Card.Metadata>
          </Card>
        </Stack.Item>
      </Stack>
    </>
  );
}

export default function StatusPage() {
  return (
    <DefaultLayout contentWidth="medium" metadata={{ title: "Status" }}>
      <Stack gap="spacious">
        <Heading as="h1">Status Page</Heading>
        <UpdatedAt />
        <DatabaseStatus />
      </Stack>
    </DefaultLayout>
  );
}
