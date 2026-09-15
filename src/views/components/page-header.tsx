import { Html, type PropsWithChildren } from "@elysiajs/html";

type PageHeaderProps = PropsWithChildren<{ title: string; subtitle: string }>;

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => (
  <header class="flex flex-wrap items-end justify-between gap-6">
    <div class="flex flex-col gap-1.5">
      <h1 class="font-display text-5xl leading-none tracking-tight md:text-[3.5rem]" safe>
        {title}
      </h1>
      <p class="text-[0.9375rem] text-ink-soft" safe>
        {subtitle}
      </p>
    </div>
    {children}
  </header>
);
