import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { SiteLayout } from "@/components/site-layout";
import { horarios } from "@/data/site-data";

export const Route = createFileRoute("/horarios")({
  head: () => ({
    meta: [
      { title: "Horários — Lino Painel local" },
      {
        name: "description",
        content:
          "Lista completa de horários com destaque automático do próximo horário, rodando localmente no seu computador.",
      },
      { property: "og:title", content: "Horários — Lino Painel local" },
      {
        property: "og:description",
        content: "Todos os horários da lista com destaque do próximo, sem depender de internet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HorariosPage,
});

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function HorariosPage() {
  const [now, setNow] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);

  const next = useMemo(() => {
    if (now === null) return null;
    return horarios.find((h) => toMinutes(h) >= now) ?? horarios[0];
  }, [now]);

  const list = useMemo(
    () => horarios.filter((h) => h.includes(query.trim())),
    [query],
  );

  return (
    <SiteLayout
      title="Horários"
      subtitle={`${horarios.length} horários na lista. O próximo é destacado em tempo real.`}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 glow-neon">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Próximo</p>
          <p className="mt-1 text-4xl font-black text-primary tabular-nums">
            {next ?? "--:--"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Agora</p>
          <p className="mt-1 text-4xl font-black tabular-nums">
            {now === null
              ? "--:--"
              : `${String(Math.floor(now / 60)).padStart(2, "0")}:${String(now % 60).padStart(2, "0")}`}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <label
            htmlFor="busca-horario"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Buscar
          </label>
          <input
            id="busca-horario"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ex: 14:"
            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
        {list.map((h) => {
          const isNext = h === next;
          const past = now !== null && toMinutes(h) < now;
          return (
            <li
              key={h}
              className={[
                "rounded-xl border px-2 py-3 text-center text-sm font-semibold tabular-nums transition-colors",
                isNext
                  ? "border-primary bg-primary text-primary-foreground glow-neon"
                  : past
                    ? "border-border/50 bg-card/40 text-muted-foreground"
                    : "border-border bg-card text-foreground",
              ].join(" ")}
            >
              {h}
            </li>
          );
        })}
      </ul>
      {list.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Nenhum horário encontrado.</p>
      ) : null}
    </SiteLayout>
  );
}
