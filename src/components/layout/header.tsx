"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", href: "/" },
  { label: "Indicadores", href: "/indicadores" },
  { label: "Sobre", href: "/sobre" },
] as const;

function isActiveRoute(pathname: string, href: (typeof navigation)[number]["href"]): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/ubs/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-200 border-b border-zinc-200 bg-white">
      <div className="flex h-16 w-full items-center justify-between gap-2 px-2 sm:px-6">
        <Link
          href="/"
          aria-label="Painel SUS - Início"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-1 text-primary transition-colors hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-2"
        >
          <Image src="/logo.png" alt="" width={44} height={24} priority />
          <span className="text-lg font-bold text-primary">Painel SUS</span>
        </Link>

        <nav aria-label="Navegação principal" className="shrink-0">
          <ul className="flex items-center gap-1 sm:gap-6">
            {navigation.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-md border-b-2 px-1 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-3 ${
                      active
                        ? "border-primary font-semibold text-primary"
                        : "border-transparent font-medium text-zinc-700 hover:border-primary hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
