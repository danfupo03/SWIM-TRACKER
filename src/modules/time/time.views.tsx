import { Html, type PropsWithChildren } from "@elysiajs/html";
import { SWIM_TESTS, TIME_PATTERN, type CreateTimeBody, type TimeRecord } from "./time.model";
import { formatDate, formatSeconds } from "./time.service";
import { AlertIcon, CloseIcon, PencilIcon, TrashIcon } from "../../views/components/icons";

export const TIME_MODAL_CONTENT_ID = "time-modal-content";
export const TIMES_CHANGED_EVENT = "times-changed";

export type TimeFormValues = Partial<CreateTimeBody>;
export type TimeFormErrors = Partial<Record<keyof CreateTimeBody, string>>;

export const toFormValues = (time: TimeRecord): TimeFormValues => ({
  test: time.test,
  time: formatSeconds(time.time_seconds),
  place: time.place,
  date: time.date,
  season: time.season,
});

export const TimeRow = ({ time }: { time: TimeRecord }) => (
  <tr id={`time-${time.id}`} data-time-id={String(time.id)} class="transition-colors hover:bg-primary/6">
    <td class="whitespace-nowrap" safe>
      {formatDate(time.date)}
    </td>
    <td class="font-semibold text-base-content" safe>
      {time.test}
    </td>
    <td class="text-right text-base font-bold text-base-content tabular-nums" safe>
      {formatSeconds(time.time_seconds)}
    </td>
    <td safe>{time.place}</td>
    <td safe>{time.season}</td>
    <td class="pr-3!">
      <div class="flex justify-end gap-1">
        <button
          type="button"
          class="btn btn-ghost btn-square size-10 text-ink-soft hover:text-base-content"
          aria-label={`Edit ${time.test} on ${formatDate(time.date)}`}
          hx-get={`/times/${time.id}/edit`}
          hx-target={`#${TIME_MODAL_CONTENT_ID}`}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-square size-10 text-ink-soft hover:text-error"
          aria-label={`Delete ${time.test} on ${formatDate(time.date)}`}
          hx-delete={`/times/${time.id}`}
          hx-target={`#time-${time.id}`}
          hx-swap="outerHTML"
          hx-confirm="Delete this time?"
        >
          <TrashIcon />
        </button>
      </div>
    </td>
  </tr>
);

export const TimeTableBody = ({ times }: { times: TimeRecord[] }) => (
  <tbody id="times-body">
    {times.map((time) => (
      <TimeRow time={time} />
    ))}
    <tr class="empty-row">
      <td colspan="6" class="py-14 text-center text-ink-muted">
        No swims to show. Add one, or change the filters.
      </td>
    </tr>
  </tbody>
);

export const TimeTable = ({ times }: { times: TimeRecord[] }) => (
  <section class="glass-panel mt-5 overflow-hidden px-2 pt-2">
    <div class="overflow-x-auto">
      <table class="table [&_td]:h-14.5 [&_td]:border-ink-soft/10 [&_td]:px-5 [&_td]:text-sm [&_td]:text-ink-soft [&_th]:px-5">
        <thead>
          <tr class="border-ink-soft/18 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">
            <th class="h-12">Date</th>
            <th>Test</th>
            <th class="text-right">Time</th>
            <th>Place</th>
            <th>Season</th>
            <th class="w-29">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <TimeTableBody times={times} />
      </table>
    </div>
  </section>
);

export const TimeCount = ({ count }: { count: number }) => (
  <span
    id="times-count"
    class="flex h-11 items-center text-sm text-ink-soft"
    aria-live="polite"
    hx-get="/times/count"
    hx-include="#time-filters"
    hx-trigger={`${TIMES_CHANGED_EVENT} from:body`}
    hx-swap="outerHTML"
  >
    {`${count} ${count === 1 ? "swim" : "swims"}`}
  </span>
);

const FilterSelect = ({
  label,
  name,
  allLabel,
  options,
  class: className,
}: {
  label: string;
  name: string;
  allLabel: string;
  options: string[];
  class: string;
}) => (
  <label class={["flex flex-col gap-2", className]}>
    <span class="text-[0.8125rem] font-semibold text-ink-soft">{label}</span>
    <select name={name} class="select glass-field w-full">
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option value={option} safe>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export const TimeFilters = ({ seasons, tests, count }: { seasons: string[]; tests: string[]; count: number }) => (
  <section class="glass-panel mt-8 flex flex-wrap items-end justify-between gap-5 rounded-[1.125rem] px-5.5 py-4.5">
    <form
      id="time-filters"
      class="flex w-full flex-wrap items-end gap-4 sm:w-auto"
      hx-get="/times"
      hx-target="#times-body"
      hx-swap="outerHTML"
      hx-trigger="change"
    >
      <FilterSelect label="Season" name="season" allLabel="All seasons" options={seasons} class="w-full sm:w-55" />
      <FilterSelect label="Test" name="test" allLabel="All tests" options={tests} class="w-full sm:w-75" />
    </form>
    <TimeCount count={count} />
  </section>
);

export const TimeModal = () => (
  <dialog id="time-modal" class="modal ocean-backdrop" aria-labelledby="time-modal-title">
    <div class="modal-box glass-modal relative w-[calc(100%-2rem)] max-w-135 p-0">
      <form method="dialog">
        <button class="btn btn-ghost btn-square absolute top-5.5 right-5 size-11 text-ink-soft" aria-label="Close">
          <CloseIcon size={20} />
        </button>
      </form>
      <div
        id={TIME_MODAL_CONTENT_ID}
        hx-on--after-swap="const dialog = this.closest('dialog'); if (!dialog.open) dialog.showModal()"
      ></div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button tabindex="-1">close</button>
    </form>
  </dialog>
);

const FormField = ({
  id,
  label,
  error,
  hint,
  children,
}: PropsWithChildren<{ id: string; label: string; error?: string; hint?: string }>) => (
  <div class="flex flex-col gap-2">
    <label for={id} class="text-[0.8125rem] font-semibold text-ink-soft">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-message`} class="flex items-center gap-1.5 text-[0.8125rem] text-error">
        <AlertIcon size={15} />
        <span safe>{error}</span>
      </p>
    ) : hint ? (
      <p id={`${id}-message`} class="text-xs text-ink-muted" safe>
        {hint}
      </p>
    ) : (
      ""
    )}
  </div>
);

const fieldState = (id: string, error?: string, hint?: string) => ({
  "aria-invalid": error ? "true" : undefined,
  "aria-describedby": error || hint ? `${id}-message` : undefined,
});

type TimeFormProps = {
  /** Present when editing an existing record. */
  timeId?: number;
  values?: TimeFormValues;
  errors?: TimeFormErrors;
};

export const TimeForm = ({ timeId, values = {}, errors = {} }: TimeFormProps) => {
  const isEdit = timeId !== undefined;
  const testOptions = values.test && !SWIM_TESTS.includes(values.test) ? [...SWIM_TESTS, values.test] : SWIM_TESTS;
  const timeHint = "Minutes optional: 1:05.32 or 29.56";

  const requestAttributes = isEdit
    ? { "hx-put": `/times/${timeId}`, "hx-target": `#time-${timeId}`, "hx-swap": "outerHTML" }
    : { "hx-post": "/times", "hx-target": "#times-body", "hx-swap": "afterbegin" };

  return (
    <form
      {...requestAttributes}
      hx-disabled-elt="find button[type='submit']"
      hx-on--after-request="if (event.detail.successful) this.closest('dialog').close()"
      class="flex flex-col gap-6.5 px-8 pt-7.5 pb-7"
    >
      <div class="flex flex-col gap-1.5 pr-12">
        <h2 id="time-modal-title" class="font-display text-4xl leading-none">
          {isEdit ? "Edit time" : "Add time"}
        </h2>
        <p class="text-sm text-ink-soft" safe>
          {isEdit && values.test && values.date ? `${values.test} · ${formatDate(values.date)}` : "Log a new swim"}
        </p>
      </div>

      <div class="flex flex-col gap-4.5">
        <FormField id="time-test" label="Test" error={errors.test}>
          <select
            id="time-test"
            name="test"
            class="select glass-field w-full"
            required
            autofocus={!isEdit}
            {...fieldState("time-test", errors.test)}
          >
            <option value="" disabled selected={!values.test}>
              Select a test
            </option>
            {testOptions.map((test) => (
              <option value={test} selected={test === values.test} safe>
                {test}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="time-time" label="Time" error={errors.time} hint={timeHint}>
          <input
            id="time-time"
            name="time"
            class="input glass-field w-full tabular-nums"
            value={values.time}
            placeholder="1:05.32"
            pattern={TIME_PATTERN}
            title={timeHint}
            autocomplete="off"
            required
            autofocus={isEdit}
            {...fieldState("time-time", errors.time, timeHint)}
          />
        </FormField>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="time-date" label="Date" error={errors.date}>
            <input
              id="time-date"
              type="date"
              name="date"
              class="input glass-field w-full"
              value={values.date}
              required
              {...fieldState("time-date", errors.date)}
            />
          </FormField>

          <FormField id="time-season" label="Season" error={errors.season}>
            <input
              id="time-season"
              name="season"
              class="input glass-field w-full"
              value={values.season}
              placeholder={String(new Date().getFullYear())}
              required
              {...fieldState("time-season", errors.season)}
            />
          </FormField>
        </div>

        <FormField id="time-place" label="Place" error={errors.place}>
          <input
            id="time-place"
            name="place"
            class="input glass-field w-full"
            value={values.place}
            placeholder="Pool or meet name"
            required
            {...fieldState("time-place", errors.place)}
          />
        </FormField>
      </div>

      <div class="flex items-center justify-end gap-2.5 border-t border-ink-soft/10 pt-5">
        <button
          type="button"
          class="btn btn-ghost border-ink-soft/18 text-secondary"
          onclick="this.closest('dialog').close()"
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-primary px-4.5 font-bold">
          {isEdit ? "Save changes" : "Add time"}
        </button>
      </div>
    </form>
  );
};
