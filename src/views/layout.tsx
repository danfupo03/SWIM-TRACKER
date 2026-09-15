import { Html, type PropsWithChildren } from "@elysiajs/html";

export const Layout = ({ children }: PropsWithChildren) => (
  <html lang="en" data-theme="cupcake">
    <head>
      <meta charset="utf-8" />
      <title>Swim Tracker</title>
      <script src="https://unpkg.com/htmx.org@2.0.3"></script>
      <link rel="stylesheet" href="/public/output.css" />
    </head>
    <body>{children}</body>
  </html>
);