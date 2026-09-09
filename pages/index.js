import DefaultLayout from "interface/DefaultLayout";

function Home() {
  return (
    <DefaultLayout
      metadata={{
        description: "Bem-vindo ao TabNews!",
      }}
    >
      <h1>Bem-vindo ao TabNews!</h1>
    </DefaultLayout>
  );
}

export default Home;
