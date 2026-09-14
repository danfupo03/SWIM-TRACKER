import { Html } from "@elysiajs/html";
import type { TimeRecord } from "./time.model";
import { formatSeconds } from "./time.service";

export const TimeRow = ({ time }: { time: TimeRecord }) => (
  <tr id={`time-${time.id}`}>
    <td>{time.test}</td>
    <td>{formatSeconds(time.time_seconds)}</td>
    <td>{time.place}</td>
    <td>{time.date}</td>
    <td>{time.season}</td>
    <td>
      <button
        hx-get={`/times/${time.id}/edit`}
        hx-target={`#time-${time.id}`}
        hx-swap="outerHTML"
      >
        Edit
      </button>
      <button
        hx-delete={`/times/${time.id}`}
        hx-target={`#time-${time.id}`}
        hx-swap="outerHTML"
        hx-confirm="Delete this time?"
      >
        Delete
      </button>
    </td>
  </tr>
);

export const TimeEditRow = ({ time }: { time: TimeRecord }) => (
  <tr id={`time-${time.id}`}>
    <td>
      <input name="test" value={time.test} required />
    </td>
    <td>
      <input name="time" value={formatSeconds(time.time_seconds)} required />
    </td>
    <td>
      <input name="place" value={time.place} required />
    </td>
    <td>
      <input type="date" name="date" value={time.date} required />
    </td>
    <td>
      <input name="season" value={time.season} required />
    </td>
    <td>
      <button
        hx-put={`/times/${time.id}`}
        hx-include={`#time-${time.id} input`}
        hx-target={`#time-${time.id}`}
        hx-swap="outerHTML"
      >
        Save
      </button>
      <button
        hx-get={`/times/${time.id}`}
        hx-target={`#time-${time.id}`}
        hx-swap="outerHTML"
      >
        Cancel
      </button>
    </td>
  </tr>
);

export const TimeTableBody = ({ times }: { times: TimeRecord[] }) => (
  <tbody id="times-body">
    {times.map((time) => (
      <TimeRow time={time} />
    ))}
  </tbody>
);
