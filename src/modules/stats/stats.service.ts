import { db } from "../../db/database";
import { SWIM_TESTS, type TimeRecord } from "../time/time.model";
import type { ChartData, PersonalBest, SeasonRange, StatsSummary } from "./stats.model";

function findSwimsChronological(test?: string): TimeRecord[] {
  if (test) {
    return db
      .query("SELECT * FROM times WHERE test = $test ORDER BY date ASC, id ASC")
      .all({ $test: test }) as TimeRecord[];
  }

  return db.query("SELECT * FROM times ORDER BY date ASC, id ASC").all() as TimeRecord[];
}

function findPersonalBestHistory(swims: TimeRecord[]): PersonalBest[] {
  const bestByTest = new Map<string, number>();
  const history: PersonalBest[] = [];

  for (const swim of swims) {
    const previousBest = bestByTest.get(swim.test);

    if (previousBest === undefined || swim.time_seconds < previousBest) {
      history.push({
        swim,
        improvementSeconds: previousBest === undefined ? null : previousBest - swim.time_seconds,
      });
      bestByTest.set(swim.test, swim.time_seconds);
    }
  }

  return history;
}

function currentPersonalBests(history: PersonalBest[]): PersonalBest[] {
  const byTest = new Map<string, PersonalBest>();
  for (const entry of history) byTest.set(entry.swim.test, entry);

  return [...byTest.values()];
}

function testOrder(test: string): number {
  const index = SWIM_TESTS.indexOf(test);
  return index === -1 ? SWIM_TESTS.length : index;
}

export const statsService = {
  getSummary(): StatsSummary {
    const swims = findSwimsChronological();
    const history = findPersonalBestHistory(swims);
    const bests = currentPersonalBests(history);
    const lastSwim = swims.at(-1) ?? null;

    return {
      totalSwims: swims.length,
      testsSwum: bests.length,
      personalBestsThisSeason: bests.filter((best) => best.swim.season === lastSwim?.season).length,
      latestPersonalBest: history.at(-1)?.swim ?? null,
      lastSwim,
    };
  },

  getPersonalBests(): PersonalBest[] {
    const bests = currentPersonalBests(findPersonalBestHistory(findSwimsChronological()));

    return bests.sort(
      (a, b) => testOrder(a.swim.test) - testOrder(b.swim.test) || a.swim.test.localeCompare(b.swim.test),
    );
  },

  findMostSwumTest(): string | null {
    const row = db
      .query("SELECT test FROM times GROUP BY test ORDER BY COUNT(*) DESC, test ASC LIMIT 1")
      .get() as { test: string } | null;

    return row?.test ?? null;
  },

  getChartData(test: string): ChartData {
    const swims = findSwimsChronological(test);
    const seasonsByName = new Map<string, SeasonRange>();

    for (const swim of swims) {
      const range = seasonsByName.get(swim.season);

      if (!range) {
        seasonsByName.set(swim.season, {
          season: swim.season,
          slowestSeconds: swim.time_seconds,
          fastestSeconds: swim.time_seconds,
        });
        continue;
      }

      range.slowestSeconds = Math.max(range.slowestSeconds, swim.time_seconds);
      range.fastestSeconds = Math.min(range.fastestSeconds, swim.time_seconds);
    }

    const seasons = [...seasonsByName.values()];
    const latest = seasons.at(-1);
    const previous = seasons.at(-2);

    return {
      test,
      progress: swims.map((swim) => ({ date: swim.date, seconds: swim.time_seconds, place: swim.place })),
      seasons,
      seasonComparison:
        latest && previous
          ? {
              season: latest.season,
              previousSeason: previous.season,
              improvementSeconds: previous.fastestSeconds - latest.fastestSeconds,
            }
          : null,
    };
  },
};
