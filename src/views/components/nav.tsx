import { Html } from "@elysiajs/html";
import { ChartIcon, ListIcon, WaveIcon } from "./icons";

export type NavPage = "dashboard" | "history";

const NAV_LINKS: { page: NavPage; href: string; label: string; icon: typeof ChartIcon }[] = [
  { page: "dashboard", href: "/", label: "Dashboard", icon: ChartIcon },
  { page: "history", href: "/history", label: "History", icon: ListIcon },
];

export const Nav = ({ page }: { page: NavPage }) => (
  <nav
    class="glass-panel flex h-16 items-center justify-between gap-4 rounded-[1.125rem] pr-3 pl-5"
    aria-label="Main"
  >
    <a href="/" class="flex items-center gap-2.5 rounded-lg text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      <WaveIcon size={24} />
      <span class="font-display text-[1.625rem] leading-none text-base-content">Swim Tracker</span>
    </a>

    <ul class="flex items-center gap-1.5">
      {NAV_LINKS.map((link) => {
        const active = link.page === page;
        const LinkIcon = link.icon;

        return (
          <li>
            <a
              href={link.href}
              aria-current={active ? "page" : undefined}
              class={[
                "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active
                  ? "border-primary/35 bg-primary/14 text-base-content"
                  : "border-transparent text-ink-soft hover:bg-base-content/5 hover:text-base-content",
              ]}
            >
              <LinkIcon size={17} />
              <span>{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);
