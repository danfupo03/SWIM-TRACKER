import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";
import { timeController } from "./modules/time/time.controller";
import { timeService } from "./modules/time/time.service";
import { Home } from "./views/home";
import "./db/database";

const app = new Elysia()
  .use(html())
  .use(timeController)
  .get("/", () => (
    <Home
      times={timeService.findAll()}
      seasons={timeService.findSeasons()}
      tests={timeService.findTests()}
    />
  ))
  .listen(3000);

console.log(`Running at http://localhost:${app.server?.port}`);
