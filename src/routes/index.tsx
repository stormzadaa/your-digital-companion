import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { SiteLayout } from "@/components/site-layout";
import { horarios, jogos } from "@/data/site-data";
import { paginas } from "@/data/paginas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lino Painel — horários, jogos e páginas locais" },
      {
        name: "description",
        content:
          "Painel local com horários em tempo real, catálogo de jogos e todas as páginas do projeto, rodando offline no seu computador.",
      },
      { property: "og:title", content: "Lino Painel — horários, jogos e páginas locais" },
      {
        property: "og:description",
        content: "Horários em tempo real, jogos e páginas locais em um só painel offline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function toMinutes(hhmm: string) {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

function Index() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);

  const proximos = useMemo(() => {
    if (now === null) return horarios.slice(0, 6);
    const i = horarios.findIndex((h) => toMinutes(h) >= now);
    const start = i === -1 ? 0 : i;
    const slice = horarios.slice(start, start + 6);
    return slice.length === 6 ? slice : [...slice, ...horarios.slice(0, 6 - slice.length)];
  }, [now]);

  const cards = [
    {
      to: "/horarios" as const,
      label: "Horários",
      value: `${horarios.length}`,
      desc: "Lista completa com destaque do próximo horário.",
    },
    {
      to: "/jogos" as const,
      label: "Jogos",
      value: `${jogos.length}`,
      desc: "Catálogo com busca e favoritos.",
    },
    {
      to: "/paginas" as const,
      label: "Páginas",
      value: `${paginas.length}`,
      desc: "Todas as páginas locais do projeto.",
    },
  ];

  return (
    <SiteLayout
      title="Painel local"
      subtitle="Tudo roda no seu computador: sem banco de dados, sem login e sem sites externos."
    >
      <section className="mb-10 overflow-hidden rounded-3xl border border-border bg-card p-6 glow-neon sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Próximos horários
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {proximos.map((h, i) => (
            <span
              key={`${h}-${i}`}
              className={[
                "rounded-2xl border px-4 py-3 text-2xl font-black tabular-nums",
                i === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground",
              ].join(" ")}
            >
              {h}
            </span>
          ))}
        </div>
        <Link
          to="/horarios"
          className="mt-6 inline-flex rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Ver todos os horários
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:glow-cyan"
          >
            <p className="text-4xl font-black text-gradient-neon">{c.value}</p>
            <h2 className="mt-2 text-lg font-bold">{c.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </section>
    </SiteLayout>
  );
}
