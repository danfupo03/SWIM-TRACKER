import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { timeController } from "./modules/time/time.controller";
import { timeService } from "./modules/time/time.service";
import { statsController } from "./modules/stats/stats.controller";
import { statsService } from "./modules/stats/stats.service";
import { DashboardPage } from "./views/dashboard";
import { HistoryPage } from "./views/history";
import "./db/database";

const app = new Elysia()
  .use(html())
  .use(staticPlugin({ assets: "public", prefix: "/public" }))
  .use(timeController)
  .use(statsController)
  .get("/", () => (
    <DashboardPage
      summary={statsService.getSummary()}
      personalBests={statsService.getPersonalBests()}
      tests={timeService.findTests()}
      selectedTest={statsService.findMostSwumTest()}
    />
  ))
  .get("/history", () => (
    <HistoryPage
      times={timeService.findAll()}
      seasons={timeService.findSeasons()}
      tests={timeService.findTests()}
    />
  ))
  .listen(3000);

console.log(`Running at http://localhost:${app.server?.port}`);
