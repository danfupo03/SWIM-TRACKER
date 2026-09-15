import { Html } from "@elysiajs/html";
import { Layout } from "./layout";
import { TimeTableBody } from "../modules/time/time.views";
import type { TimeRecord } from "../modules/time/time.model";

type HomeProps = {
  times: TimeRecord[];
  seasons: string[];
  tests: string[];
};

const TESTS = [
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

export const Home = ({ times, seasons, tests }: HomeProps) => (
  <Layout>
    <div class="min-h-screen bg-linear-to-br from-blue-500 via-indigo-600 to-purple-700 p-4 md:p-8">
      <div class="max-w-6xl mx-auto space-y-6">
        <h1 class="text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
          Swim Tracker
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIDEBAR: New Time Form */}
          <section class="card bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl h-fit">
            <div class="card-body">
              <h2 class="card-title text-white mb-4">Add New Time</h2>
              <form
                class="flex flex-col gap-3"
                hx-post="/times"
                hx-target="#times-body"
                hx-swap="beforeend"
                hx-on--after-request="if(event.detail.successful) this.reset()"
              >
                <select
                  class="input input-bordered bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all"
                  name="test"
                  required
                >
                  <option class="text-base-content" value="" disabled selected>
                    Select a test
                  </option>
                  {TESTS.map((test) => (
                    <option class="text-base-content" value={test}>
                      {test}
                    </option>
                  ))}
                </select>
                <input
                  class="input input-bordered bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all"
                  name="time"
                  placeholder="1:05.32"
                  required
                />
                <input
                  class="input input-bordered bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all"
                  name="place"
                  placeholder="Pool name"
                  required
                />
                <input
                  class="input input-bordered bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all scheme-dark"
                  type="date"
                  name="date"
                  required
                />
                <input
                  class="input input-bordered bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all"
                  name="season"
                  placeholder="2026"
                  required
                />

                {/* Using DaisyUI's built-in glass class for the button */}
                <button
                  class="btn glass text-white mt-4 hover:bg-white/30"
                  type="submit"
                >
                  Save Record
                </button>
              </form>
            </div>
          </section>

          {/* MAIN CONTENT: Filters & Table */}
          <div class="lg:col-span-2 space-y-6">
            {/* Filters Card */}
            <section class="card bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <div class="card-body p-5 md:p-6">
                <form
                  hx-get="/times"
                  hx-target="#times-body"
                  hx-swap="outerHTML"
                  class="flex flex-col md:flex-row gap-4 items-end"
                >
                  <div class="form-control w-full">
                    <label class="label py-1">
                      <span class="label-text text-white/80">Season</span>
                    </label>
                    <select
                      class="select select-bordered w-full bg-white/10 border-white/20 text-white focus:bg-white/20"
                      name="season"
                    >
                      <option class="text-base-content" value="">
                        All seasons
                      </option>
                      {seasons.map((season) => (
                        <option class="text-base-content" value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div class="form-control w-full">
                    <label class="label py-1">
                      <span class="label-text text-white/80">Test</span>
                    </label>
                    <select
                      class="select select-bordered w-full bg-white/10 border-white/20 text-white focus:bg-white/20"
                      name="test"
                    >
                      <option class="text-base-content" value="">
                        All tests
                      </option>
                      {TESTS.map((test) => (
                        <option class="text-base-content" value={test}>
                          {test}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    class="btn glass text-white w-full md:w-auto hover:bg-white/30"
                    type="submit"
                  >
                    Filter
                  </button>
                </form>
              </div>
            </section>

            {/* Table Card */}
            <section class="card bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <div class="card-body p-0 py-4 md:p-6">
                <div class="px-4 md:px-0 mb-4 flex justify-between items-center">
                  <h2 class="card-title text-white">Recent Times</h2>
                </div>

                <div class="overflow-x-auto w-full">
                  <table class="table text-white w-full">
                    {/* head */}
                    <thead class="text-white/70 border-b border-white/20 text-sm">
                      <tr>
                        <th class="bg-transparent">Test</th>
                        <th class="bg-transparent">Time</th>
                        <th class="bg-transparent">Place</th>
                        <th class="bg-transparent">Date</th>
                        <th class="bg-transparent">Season</th>
                        <th class="bg-transparent"></th>
                      </tr>
                    </thead>
                    <TimeTableBody times={times} />
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);
