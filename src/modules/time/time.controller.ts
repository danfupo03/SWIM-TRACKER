// src/modules/time/time.controller.ts
import { Elysia } from "elysia";
import { Html } from "@elysiajs/html";
import { timeModel, timeParams, listTimesQuery } from "./time.model";
import { timeService } from "./time.service";
import { TimeRow, TimeEditRow, TimeTableBody } from "./time.views";

export const timeController = new Elysia({ prefix: "/times" })
  .use(timeModel)

  .get(
    "/",
    ({ query }) => {
      const times = timeService.findAll(query);
      return TimeTableBody({ times });
    },
    { query: listTimesQuery },
  )

  .post(
    "/",
    ({ body }) => {
      const created = timeService.create(body);
      return TimeRow({ time: created });
    },
    { body: "createTimeBody" },
  )

  .get(
    "/:id",
    ({ params, status }) => {
      const time = timeService.findById(params.id);
      if (!time) return status(404, "Time not found");

      return TimeRow({ time });
    },
    { params: timeParams },
  )

  .get(
    "/:id/edit",
    ({ params, status }) => {
      const time = timeService.findById(params.id);
      if (!time) return status(404, "Time not found");

      return TimeEditRow({ time });
    },
    { params: timeParams },
  )

  .put(
    "/:id",
    ({ params, body, status }) => {
      const updated = timeService.update(params.id, body);
      if (!updated) return status(404, "Time not found");

      return TimeRow({ time: updated });
    },
    { params: timeParams, body: "updateTimeBody" },
  )

  .delete(
    "/:id",
    ({ params, status }) => {
      const removed = timeService.remove(params.id);
      if (!removed) return status(404, "Time not found");

      return "";
    },
    { params: timeParams },
  );
