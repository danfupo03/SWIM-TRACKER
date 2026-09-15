import { Html, type PropsWithChildren } from "@elysiajs/html";
import { Nav, type NavPage } from "./components/nav";

type LayoutProps = PropsWithChildren<{ title: string; page: NavPage }>;

const HTMX_CONFIG = JSON.stringify({
  responseHandling: [
    { code: "204", swap: false },
    { code: "[23]..", swap: true },
    { code: "422", swap: true, error: true },
    { code: "[45]..", swap: false, error: true },
    { code: "...", swap: false },
  ],
});

export const Layout = ({ title, page, children }: LayoutProps) => (
  <html lang="en" data-theme="lagoon">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title safe>{`${title} · Swim Tracker`}</title>
      <meta name="htmx-config" content={HTMX_CONFIG} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Manrope:wght@400;500;600;700&display=swap"
      />
      <link rel="stylesheet" href="/public/output.css" />
      <script src="https://unpkg.com/htmx.org@2.0.3"></script>
    </head>
    <body class="min-h-screen font-sans text-base-content antialiased">
      <div class="mx-auto flex max-w-300 flex-col px-4 pt-6 pb-16 md:px-8">
        <Nav page={page} />
        <main class="mt-10 md:mt-11">{children}</main>
      </div>
      <span class="fixed right-4 bottom-4 text-sm text-ink-soft">v1.0.0</span>
    </body>
  </html>
);