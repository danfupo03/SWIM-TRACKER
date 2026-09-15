import { Elysia, t } from "elysia";
import type { TimeRecord } from "../time/time.model";

export const chartDataQuery = t.Object({
  test: t.String({ minLength: 1 }),
});

export const progressPoint = t.Object({
  date: t.String(),
  seconds: t.Number(),
  place: t.String(),
});

export const seasonRange = t.Object({
  season: t.String(),
  slowestSeconds: t.Number(),
  fastestSeconds: t.Number(),
});

export const seasonComparison = t.Object({
  season: t.String(),
  previousSeason: t.String(),
  improvementSeconds: t.Number(),
});

export const chartData = t.Object({
  test: t.String(),
  progress: t.Array(progressPoint),
  seasons: t.Array(seasonRange),
  seasonComparison: t.Nullable(seasonComparison),
});

export type ChartData = typeof chartData.static;
export type ProgressPoint = typeof progressPoint.static;
export type SeasonRange = typeof seasonRange.static;

export type StatsSummary = {
  totalSwims: number;
  testsSwum: number;
  personalBestsThisSeason: number;
  latestPersonalBest: TimeRecord | null;
  lastSwim: TimeRecord | null;
};

export type PersonalBest = {
  swim: TimeRecord;
  improvementSeconds: number | null;
};

export const statsModel = new Elysia({ name: "stats.model" }).model({
  chartDataQuery,
  chartData,
});
