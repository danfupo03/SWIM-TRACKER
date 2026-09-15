import { Elysia, t } from "elysia";

export const SWIM_TESTS = [
  "50m Freestyle",
  "200m Freestyle",
  "400m Freestyle",
  "800m Freestyle",
  "50m Backstroke",
  "100m Backstroke",
  "200m Backstroke",
  "50m Breaststroke",
  "50m Butterfly",
  "100m Individual Medley (IM)",
  "200m Individual Medley (IM)",
];

export const TIME_PATTERN = "^([0-9]+:)?[0-9]{1,2}(\\.[0-9]{1,2})?$";

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
  time: t.String({ pattern: TIME_PATTERN }),
  place: t.String({ minLength: 1 }),
  date: t.String({ minLength: 1 }),
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
export type TimeFilters = typeof listTimesQuery.static;

export const timeModel = new Elysia({ name: "time.model" }).model({
  createTimeBody,
  updateTimeBody,
  listTimesQuery,
});
