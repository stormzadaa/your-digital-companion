import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout } from "@/components/site-layout";
import { jogos } from "@/data/site-data";

export const Route = createFileRoute("/jogos")({
  head: () => ({
    meta: [
      { title: "Jogos — Lino Painel local" },
      {
        name: "description",
        content:
          "Catálogo local de jogos com busca instantânea e favoritos salvos no próprio navegador.",
      },
      { property: "og:title", content: "Jogos — Lino Painel local" },
      {
        property: "og:description",
        content: "Catálogo de jogos com busca e favoritos, tudo offline no seu computador.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JogosPage,
});

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function JogosPage() {
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<string[]>([]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? jogos.filter((j) => j.toLowerCase().includes(q)) : jogos;
    return [...filtered].sort(
      (a, b) => Number(favs.includes(b)) - Number(favs.includes(a)),
    );
  }, [query, favs]);

  return (
    <SiteLayout
      title="Jogos"
      subtitle={`${jogos.length} jogos na lista local. Clique na estrela para fixar os favoritos no topo.`}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar jogo..."
          aria-label="Buscar jogo"
          className="w-full max-w-sm rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {list.length} resultado(s)
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((jogo) => {
          const fav = favs.includes(jogo);
          return (
            <article
              key={jogo}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow hover:glow-cyan"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-black text-accent">
                {initials(jogo)}
              </span>
              <h2 className="flex-1 text-sm font-semibold leading-tight">{jogo}</h2>
              <button
                type="button"
                aria-label={fav ? `Remover ${jogo} dos favoritos` : `Favoritar ${jogo}`}
                onClick={() =>
                  setFavs((prev) =>
                    prev.includes(jogo) ? prev.filter((x) => x !== jogo) : [...prev, jogo],
                  )
                }
                className={[
                  "rounded-lg px-2 py-1 text-lg transition-colors",
                  fav ? "text-primary" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {fav ? "★" : "☆"}
              </button>
            </article>
          );
        })}
      </div>
    </SiteLayout>
  );
}
