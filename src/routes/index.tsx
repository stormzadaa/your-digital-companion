import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BetLino Local - Painel de horários e lobbies" },
      {
        name: "description",
        content:
          "Painel local BetLino: horários, lobbies e listas rodando 100% no seu computador, sem banco de dados.",
      },
      { property: "og:title", content: "BetLino Local - Painel de horários e lobbies" },
      {
        property: "og:description",
        content: "Painel local BetLino rodando no seu computador, sem banco de dados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/inicio.html");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Abrindo o painel local...</h1>
      <p className="text-muted-foreground">
        Se nada acontecer,{" "}
        <a className="underline" href="/site/inicio.html">
          clique aqui para abrir o painel
        </a>
        .
      </p>
    </main>
  );
}
