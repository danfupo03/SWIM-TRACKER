import { Html } from "@elysiajs/html";
import type { PersonalBest, StatsSummary } from "./stats.model";
import { formatDate, formatSeconds } from "../time/time.service";
import { ArrowUpIcon } from "../../views/components/icons";

const StatTile = ({ label, value, detail }: { label: string; value: string; detail?: string }) => (
  <div class="glass-panel flex min-h-31 flex-col justify-between gap-3.5 rounded-[1.125rem] px-5.5 py-5">
    <span class="text-[0.8125rem] font-semibold text-ink-soft">{label}</span>
    <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span class="text-4xl leading-none font-semibold tracking-tight" safe>
        {value}
      </span>
      {detail ? (
        <span class="text-[0.8125rem] text-ink-soft" safe>
          {detail}
        </span>
      ) : (
        ""
      )}
    </div>
  </div>
);

export const StatTiles = ({ summary }: { summary: StatsSummary }) => (
  <section class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
    <StatTile label="Swims logged" value={String(summary.totalSwims)} />
    <StatTile label="Tests swum" value={String(summary.testsSwum)} />
    <StatTile label="Personal bests this season" value={String(summary.personalBestsThisSeason)} />
    <StatTile
      label="Latest personal best"
      value={summary.latestPersonalBest ? formatSeconds(summary.latestPersonalBest.time_seconds) : "—"}
      detail={summary.latestPersonalBest?.test}
    />
  </section>
);

const ChartHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div class="flex flex-col gap-1">
    <h3 class="text-base font-semibold">{title}</h3>
    <p class="text-[0.8125rem] text-ink-soft">{subtitle}</p>
  </div>
);

export const ProgressCharts = ({ tests, selectedTest }: { tests: string[]; selectedTest: string }) => (
  <section class="mt-12 flex flex-col gap-4.5">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h2 class="font-display text-[2.125rem] leading-none">Progress</h2>
      <label class="flex w-full items-center gap-3 sm:w-auto">
        <span class="text-[0.8125rem] font-semibold text-ink-soft">Test</span>
        <select id="progress-test" class="select glass-field w-full sm:w-65">
          {tests.map((test) => (
            <option value={test} selected={test === selectedTest} safe>
              {test}
            </option>
          ))}
        </select>
      </label>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div class="glass-panel flex flex-col gap-4.5 px-7 pt-6 pb-5 lg:col-span-2">
        <ChartHeading title="Time over time" subtitle="Seconds · faster is higher" />
        <div class="relative h-64">
          <canvas id="progress-chart" role="img" aria-label="Progress chart"></canvas>
        </div>
        <p id="progress-hint" class="text-[0.8125rem] text-ink-muted" hidden>
          Only one swim of this test so far. Log it again to see a trend.
        </p>
      </div>

      <div class="glass-panel flex flex-col gap-4.5 px-7 pt-6 pb-5">
        <ChartHeading title="Seasons" subtitle="Slowest to fastest swim, dot marks the best" />
        <div class="relative h-52">
          <canvas id="season-chart" role="img" aria-label="Season comparison chart"></canvas>
        </div>
        <p
          id="season-summary"
          class="flex items-center gap-2 border-t border-ink-soft/10 pt-3.5 text-sm"
          aria-live="polite"
          hidden
        >
          <span id="season-summary-icon" class="flex text-primary">
            <ArrowUpIcon size={16} />
          </span>
          <span id="season-summary-text"></span>
        </p>
      </div>
    </div>
  </section>
);

const formatImprovement = (seconds: number | null) =>
  seconds === null ? "First swim" : `−${seconds.toFixed(2)}s`;

export const PersonalBestsTable = ({ bests }: { bests: PersonalBest[] }) => (
  <section class="mt-12 flex flex-col gap-4.5">
    <h2 class="font-display text-[2.125rem] leading-none">Personal bests</h2>
    <div class="glass-panel overflow-hidden px-2 pt-2">
      <div class="overflow-x-auto">
        <table class="table [&_td]:h-14.5 [&_td]:border-ink-soft/10 [&_td]:px-5 [&_td]:text-sm [&_td]:text-ink-soft [&_th]:px-5">
          <thead>
            <tr class="border-ink-soft/18 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">
              <th class="h-12">Test</th>
              <th class="text-right">Best</th>
              <th class="text-right">vs previous</th>
              <th>Date</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {bests.map(({ swim, improvementSeconds }) => (
              <tr>
                <td class="font-semibold text-base-content" safe>
                  {swim.test}
                </td>
                <td class="text-right text-base font-bold text-base-content tabular-nums">
                  {formatSeconds(swim.time_seconds)}
                </td>
                <td class={["text-right tabular-nums", improvementSeconds === null && "text-ink-muted!"]}>
                  {formatImprovement(improvementSeconds)}
                </td>
                <td class="whitespace-nowrap" safe>
                  {formatDate(swim.date)}
                </td>
                <td safe>{swim.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
