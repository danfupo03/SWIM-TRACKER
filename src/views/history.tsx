import { Html } from "@elysiajs/html";
import { Layout } from "./layout";
import { PageHeader } from "./components/page-header";
import { PlusIcon } from "./components/icons";
import { TimeFilters, TimeModal, TimeTable, TIME_MODAL_CONTENT_ID } from "../modules/time/time.views";
import type { TimeRecord } from "../modules/time/time.model";

type HistoryPageProps = {
  times: TimeRecord[];
  seasons: string[];
  tests: string[];
};

export const HistoryPage = ({ times, seasons, tests }: HistoryPageProps) => (
  <Layout title="History" page="history">
    <PageHeader title="History" subtitle="Every swim, newest first">
      <button
        type="button"
        class="btn btn-primary px-4.5 font-bold shadow-[0_8px_24px_-10px] shadow-primary/55"
        hx-get="/times/new"
        hx-target={`#${TIME_MODAL_CONTENT_ID}`}
      >
        <PlusIcon />
        Add time
      </button>
    </PageHeader>

    <TimeFilters seasons={seasons} tests={tests} count={times.length} />
    <TimeTable times={times} />
    <TimeModal />
  </Layout>
);
