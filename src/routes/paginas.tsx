import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout } from "@/components/site-layout";
import { paginas } from "@/data/paginas";

export const Route = createFileRoute("/paginas")({
  head: () => ({
    meta: [
      { title: "Todas as páginas — Lino Painel local" },
      {
        name: "description",
        content:
          "Índice de todas as páginas locais do painel, com busca por nome de arquivo e abertura direta.",
      },
      { property: "og:title", content: "Todas as páginas — Lino Painel local" },
      {
        property: "og:description",
        content: "Índice completo das páginas locais do painel, abertas direto do seu computador.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginasPage,
});

function PaginasPage() {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return paginas;
    return paginas.filter(
      (p) => p.file.toLowerCase().includes(q) || p.label.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SiteLayout
      title="Todas as páginas"
      subtitle={`${paginas.length} páginas locais do projeto. Todas abrem do seu computador, sem internet.`}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar página..."
        aria-label="Buscar página"
        className="mb-6 w-full max-w-sm rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <a
            key={p.file}
            href={`/site/${p.file}`}
            className="flex flex-col rounded-2xl border border-border bg-card p-4 transition-shadow hover:glow-neon"
          >
            <span className="text-sm font-semibold leading-tight">{p.label}</span>
            <span className="mt-2 truncate font-mono text-xs text-muted-foreground">
              {p.file}
            </span>
            <span className="mt-3 text-xs text-accent">Abrir página →</span>
          </a>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Nenhuma página encontrada.</p>
      ) : null}
    </SiteLayout>
  );
}
