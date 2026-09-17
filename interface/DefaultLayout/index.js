import styles from "./index.module.css";
import Head from "next/head";
import { PageLayout, Header, Text } from "@primer/react";

const contentWidthClasses = {
  small: styles.smallContent,
};

export default function DefaultLayout({
  children,
  metadata = {},
  contentWidth,
}) {
  const extraContentClassName = contentWidthClasses[contentWidth] || "";

  return (
    <>
      <Head>
        <title>
          {metadata.title ? `${metadata.title} | TabNews` : "TabNews"}
        </title>

        {metadata.description && (
          <meta
            name="description"
            value={metadata.description}
            content={metadata.description}
          />
        )}
      </Head>
      <Header>
        <Header.Item full>
          <Header.Link href="/">TabNews</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/login">Login</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/cadastro">Cadastrar</Header.Link>
        </Header.Item>
      </Header>
      <PageLayout>
        <PageLayout.Content
          width={contentWidth}
          className={extraContentClassName}
        >
          {children}
        </PageLayout.Content>
        <PageLayout.Footer divider="line">
          <Text size="small">&copy; {new Date().getFullYear()} TabNews.</Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
