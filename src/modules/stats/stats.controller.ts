import { Elysia } from "elysia";
import { statsModel } from "./stats.model";
import { statsService } from "./stats.service";

export const statsController = new Elysia({ prefix: "/stats" })
  .use(statsModel)

  .get("/chart-data", ({ query }) => statsService.getChartData(query.test), {
    query: "chartDataQuery",
    response: "chartData",
  });
