import { db } from "../../db/database";
import type { TimeRecord, CreateTimeBody, UpdateTimeBody } from "./time.model";

export function parseTimeToSeconds(input: string): number {
  const parts = input.split(":");

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Number(minutes) * 60 + Number(seconds);
  }

  return Number(parts[0]);
}

export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;

  if (minutes === 0) return remainingSeconds.toFixed(2);

  return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, "0")}`;
}

export const timeService = {
  findAll(filters: { season?: string; test?: string }): TimeRecord[] {
    let query = "SELECT * FROM times WHERE 1=1";
    const params: Record<string, string> = {};

    if (filters.season) {
      query += " AND season = $season";
      params.$season = filters.season;
    }

    if (filters.test) {
      query += " AND test = $test";
      params.$test = filters.test;
    }

    query += " ORDER BY date DESC";

    return db.query(query).all(params) as TimeRecord[];
  },

  findById(id: number): TimeRecord | null {
    const row = db
      .query("SELECT * FROM times WHERE id = $id")
      .get({ $id: id }) as TimeRecord | null;

    return row;
  },

  findSeasons(): string[] {
    const rows = db
      .query("SELECT DISTINCT season FROM times ORDER BY season DESC")
      .all() as { season: string }[];

    return rows.map((row) => row.season);
  },

  findTests(): string[] {
    const rows = db
      .query("SELECT DISTINCT test FROM times ORDER BY test ASC")
      .all() as { test: string }[];

    return rows.map((row) => row.test);
  },

  create(body: CreateTimeBody): TimeRecord {
    const timeSeconds = parseTimeToSeconds(body.time);

    const inserted = db
      .query(
        `INSERT INTO times (test, time_seconds, place, date, season)
         VALUES ($test, $timeSeconds, $place, $date, $season)
         RETURNING *`,
      )
      .get({
        $test: body.test,
        $timeSeconds: timeSeconds,
        $place: body.place,
        $date: body.date,
        $season: body.season,
      }) as TimeRecord;

    return inserted;
  },

  update(id: number, body: UpdateTimeBody): TimeRecord | null {
    const timeSeconds = parseTimeToSeconds(body.time);

    const updated = db
      .query(
        `UPDATE times
         SET test = $test,
             time_seconds = $timeSeconds,
             place = $place,
             date = $date,
             season = $season
         WHERE id = $id
         RETURNING *`,
      )
      .get({
        $id: id,
        $test: body.test,
        $timeSeconds: timeSeconds,
        $place: body.place,
        $date: body.date,
        $season: body.season,
      }) as TimeRecord | null;

    return updated;
  },

  remove(id: number): boolean {
    const deleted = db
      .query("DELETE FROM times WHERE id = $id RETURNING id")
      .get({ $id: id });

    return deleted !== null;
  },
};
