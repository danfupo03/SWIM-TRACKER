import { Html } from "@elysiajs/html";

export const Layout = ({ children }: { children: JSX.Element }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Swim Tracker</title>
      <script src="https://unpkg.com/htmx.org@2.0.3"></script>
    </head>
    <body>{children}</body>
  </html>
);