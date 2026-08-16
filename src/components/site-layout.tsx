import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Painel" },
  { to: "/horarios", label: "Horários" },
  { to: "/jogos", label: "Jogos" },
  { to: "/paginas", label: "Páginas" },
] as const;

export function SiteLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen grid-bg bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-black">
              L
            </span>
            <span className="text-lg font-black tracking-tight text-gradient-neon">
              LINO PAINEL
            </span>
          </Link>
          <nav className="ml-auto flex flex-wrap items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </main>

      <footer className="border-t border-border/60 px-5 py-6 text-center text-xs text-muted-foreground">
        Roda 100% no seu computador — sem banco de dados e sem sites externos.
      </footer>
    </div>
  );
}
