import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { Layout } from "./views/layout";
import "./db/database";

const app = new Elysia()
  .use(html())
  .get("/", () => Layout({ children: "<h1>Swim Tracker</h1>" }))
  .listen(3000);

console.log(`Running at http://localhost:${app.server?.port}`);
