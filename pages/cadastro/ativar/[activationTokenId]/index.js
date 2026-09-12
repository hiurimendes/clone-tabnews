import { Banner } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ActivationStatus = Object.freeze({
  Loading: "loading",
  Success: "success",
  Error: "error",
});

export default function ActivateUserPage() {
  const router = useRouter();
  const activationTokenId = router.query.activationTokenId;
  const [activationStatus, setActivationStatus] = useState(
    ActivationStatus.Loading,
  );
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    if (!activationTokenId) {
      return;
    }

    sendActivationRequest();

    async function sendActivationRequest() {
      try {
        const response = await fetch(
          `/api/v1/activations/${activationTokenId}`,
          {
            method: "PATCH",
          },
        );

        const activationResponseBody = await response.json();

        if (response.status === 200) {
          console.log("User activated successfully:", activationResponseBody);
          setActivationStatus(ActivationStatus.Success);
          return;
        }

        setErrorMessage(
          `${activationResponseBody.message} ${activationResponseBody.action}`,
        );
        setActivationStatus(ActivationStatus.Error);
      } catch {
        setErrorMessage(
          "Houve uma falha de conexão com o servidor. Tente novamente mais tarde.",
        );
        setActivationStatus(ActivationStatus.Error);
      }
    }
  }, [activationTokenId]);

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Ativar cadastro",
      }}
    >
      {activationStatus === ActivationStatus.Loading && (
        <Banner variant="info">
          <Banner.Title>Verificando Token...</Banner.Title>
        </Banner>
      )}

      {activationStatus === ActivationStatus.Success && (
        <Banner variant="success">
          <Banner.Title>Conta ativada com sucesso!</Banner.Title>
          <Banner.Description>
            Sua conta foi ativada com sucesso. Você pode agora{" "}
            <a href="/login">fazer login</a>.
          </Banner.Description>
        </Banner>
      )}

      {activationStatus === ActivationStatus.Error && (
        <Banner variant="critical">
          <Banner.Title>Não foi possivel ativar seu cadastro.</Banner.Title>
          <Banner.Description>{errorMessage}</Banner.Description>
        </Banner>
      )}
    </DefaultLayout>
  );
}
