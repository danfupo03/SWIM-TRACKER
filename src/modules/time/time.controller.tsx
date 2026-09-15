import { Elysia, type ValidationError } from "elysia";
import { Html } from "@elysiajs/html";
import { timeModel, timeParams, listTimesQuery, type CreateTimeBody } from "./time.model";
import { timeService } from "./time.service";
import {
  TimeRow,
  TimeTableBody,
  TimeForm,
  TimeCount,
  toFormValues,
  TIME_MODAL_CONTENT_ID,
  TIMES_CHANGED_EVENT,
  type TimeFormErrors,
  type TimeFormValues,
} from "./time.views";

const FIELD_ERROR_MESSAGES: Record<keyof CreateTimeBody, string> = {
  test: "Choose a test.",
  time: "Use m:ss.hh or ss.hh, for example 1:05.32.",
  place: "Enter the pool or meet name.",
  date: "Pick the date of the swim.",
  season: "Enter a season, for example 2026.",
};

function invalidFormResponse(error: Readonly<ValidationError>, timeId?: number): Response {
  const values = (error.value ?? {}) as TimeFormValues;
  const errors: TimeFormErrors = {};

  for (const issue of error.all) {
    const field = issue.path.replace(/^\//, "") as keyof CreateTimeBody;
    if (field in FIELD_ERROR_MESSAGES) errors[field] = FIELD_ERROR_MESSAGES[field];
  }

  return new Response(String(<TimeForm timeId={timeId} values={values} errors={errors} />), {
    status: 422,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "HX-Retarget": `#${TIME_MODAL_CONTENT_ID}`,
      "HX-Reswap": "innerHTML",
    },
  });
}

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

export const timeController = new Elysia({ prefix: "/times" })
  .use(timeModel)

  .get(
    "/",
    ({ query, set }) => {
      set.headers["HX-Trigger"] = TIMES_CHANGED_EVENT;
      return <TimeTableBody times={timeService.findAll(query)} />;
    },
    { query: listTimesQuery },
  )

  .get("/count", ({ query }) => <TimeCount count={timeService.count(query)} />, {
    query: listTimesQuery,
  })

  .get("/new", () => <TimeForm values={{ date: todayIsoDate() }} />)

  .post(
    "/",
    ({ body, set }) => {
      const created = timeService.create(body);
      set.headers["HX-Trigger"] = TIMES_CHANGED_EVENT;

      return <TimeRow time={created} />;
    },
    {
      body: "createTimeBody",
      error: ({ code, error }) => {
        if (code === "VALIDATION") return invalidFormResponse(error);
      },
    },
  )

  .get(
    "/:id",
    ({ params, status }) => {
      const time = timeService.findById(params.id);
      if (!time) return status(404, "Time not found");

      return <TimeRow time={time} />;
    },
    { params: timeParams },
  )

  .get(
    "/:id/edit",
    ({ params, status }) => {
      const time = timeService.findById(params.id);
      if (!time) return status(404, "Time not found");

      return <TimeForm timeId={time.id} values={toFormValues(time)} />;
    },
    { params: timeParams },
  )

  .put(
    "/:id",
    ({ params, body, set, status }) => {
      const updated = timeService.update(params.id, body);
      if (!updated) return status(404, "Time not found");

      set.headers["HX-Trigger"] = TIMES_CHANGED_EVENT;
      return <TimeRow time={updated} />;
    },
    {
      params: timeParams,
      body: "updateTimeBody",
      error: ({ code, error, request }) => {
        if (code !== "VALIDATION") return;

        const id = Number(new URL(request.url).pathname.split("/").pop());
        return invalidFormResponse(error, Number.isInteger(id) ? id : undefined);
      },
    },
  )

  .delete(
    "/:id",
    ({ params, set, status }) => {
      const removed = timeService.remove(params.id);
      if (!removed) return status(404, "Time not found");

      set.headers["HX-Trigger"] = TIMES_CHANGED_EVENT;
      return "";
    },
    { params: timeParams },
  );
