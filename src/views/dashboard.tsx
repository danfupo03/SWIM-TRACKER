import { Html } from "@elysiajs/html";
import { Layout } from "./layout";
import { PageHeader } from "./components/page-header";
import { PersonalBestsTable, ProgressCharts, StatTiles } from "../modules/stats/stats.views";
import type { PersonalBest, StatsSummary } from "../modules/stats/stats.model";
import { formatDate } from "../modules/time/time.service";

type DashboardPageProps = {
  summary: StatsSummary;
  personalBests: PersonalBest[];
  tests: string[];
  selectedTest: string | null;
};

export const DashboardPage = ({ summary, personalBests, tests, selectedTest }: DashboardPageProps) => {
  const { lastSwim } = summary;

  return (
    <Layout title="Dashboard" page="dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={lastSwim ? `Last swim ${formatDate(lastSwim.date)} · ${lastSwim.place}` : "No swims logged yet"}
      />

      {lastSwim && selectedTest ? (
        <>
          <StatTiles summary={summary} />
          <ProgressCharts tests={tests} selectedTest={selectedTest} />
          <PersonalBestsTable bests={personalBests} />

          <script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
          <script src="/public/js/dashboard.js"></script>
        </>
      ) : (
        <section class="glass-panel mt-8 flex flex-col items-start gap-4 px-7 py-8">
          <p class="text-ink-soft">Charts and personal bests appear here once you log your first swim.</p>
          <a href="/history" class="btn btn-primary font-bold">
            Go to History
          </a>
        </section>
      )}
    </Layout>
  );
};
