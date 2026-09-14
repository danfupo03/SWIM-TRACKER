import { Html } from "@elysiajs/html";
import { Layout } from "./layout";
import { TimeTableBody } from "../modules/time/time.views";
import type { TimeRecord } from "../modules/time/time.model";

type HomeProps = {
  times: TimeRecord[];
  seasons: string[];
  tests: string[];
};

export const Home = ({ times, seasons, tests }: HomeProps) => (
  <Layout>
    <h1>Swim Tracker</h1>

    <section>
      <h2>New time</h2>
      <form
        hx-post="/times"
        hx-target="#times-body"
        hx-swap="beforeend"
        hx-on--after-request="if(event.detail.successful) this.reset()"
      >
        <input name="test" placeholder="100m freestyle" required />
        <input name="time" placeholder="1:05.32" required />
        <input name="place" placeholder="Pool name" required />
        <input type="date" name="date" required />
        <input name="season" placeholder="2026" required />
        <button type="submit">Save</button>
      </form>
    </section>

    <section>
      <h2>Filters</h2>
      <form hx-get="/times" hx-target="#times-body" hx-swap="outerHTML">
        <select name="season">
          <option value="">All seasons</option>
          {seasons.map((season) => (
            <option value={season}>{season}</option>
          ))}
        </select>

        <select name="test">
          <option value="">All tests</option>
          {tests.map((test) => (
            <option value={test}>{test}</option>
          ))}
        </select>

        <button type="submit">Filter</button>
      </form>
    </section>

    <section>
      <h2>Times</h2>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Time</th>
            <th>Place</th>
            <th>Date</th>
            <th>Season</th>
            <th></th>
          </tr>
        </thead>
        <TimeTableBody times={times} />
      </table>
    </section>
  </Layout>
);
