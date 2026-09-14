import { Elysia, t } from "elysia";

export const timeRecord = t.Object({
  id: t.Number(),
  test: t.String(),
  time_seconds: t.Number(),
  place: t.String(),
  date: t.String(),
  season: t.String(),
});

export const createTimeBody = t.Object({
  test: t.String({ minLength: 1 }),
  time: t.String({ pattern: "^([0-9]+:)?[0-9]{1,2}(\\.[0-9]{1,2})?$" }),
  place: t.String({ minLength: 1 }),
  date: t.String(),
  season: t.String({ minLength: 1 }),
});

export const listTimesQuery = t.Object({
  season: t.Optional(t.String()),
  test: t.Optional(t.String()),
});

export const updateTimeBody = createTimeBody;

export const timeParams = t.Object({
  id: t.Numeric(),
});

export type TimeRecord = typeof timeRecord.static;
export type CreateTimeBody = typeof createTimeBody.static;
export type UpdateTimeBody = typeof updateTimeBody.static;

export const timeModel = new Elysia({ name: "time.model" }).model({
  createTimeBody,
  updateTimeBody,
  listTimesQuery,
});
