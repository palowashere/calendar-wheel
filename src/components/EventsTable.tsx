import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarEvent, Category } from "../types";

import { sortEvents } from "../utils/events";

interface EventsTableProps {
  events: readonly CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  categories: readonly Category[];
}

function getUidFromEvent(
  event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>,
) {
  return event.currentTarget.closest("tr")?.dataset.eventUid;
}

export function EventsTable({ events, setEvents, categories }: EventsTableProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    setEvents((events) => events.filter((event) => event.uid !== uid));
  };
  const handleChangeStart = (date: Date | null, uid: string) => {
    if (!date) return;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, start: date } : event,
      ),
    );
  };
  const handleChangeEnd = (date: Date | null, uid: string) => {
    if (!date) return;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, end: date } : event,
      ),
    );
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newText = e.target.value;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, subject: newText } : event,
      ),
    );
  };
  const handleNew = () => {
    setEvents((events) => [
      ...events,
      {
        uid: Math.random().toString(36).slice(2),
        start: new Date(),
        end: new Date(),
        subject: "",
        lane: 1,
        categoryId: categories[0]?.id || "",
      },
    ]);
  };
  const handleChangeLane = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newLane = parseInt(e.target.value, 10);
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, lane: newLane } : event,
      ),
    );
  };
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newCategoryId = e.target.value;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, categoryId: newCategoryId } : event,
      ),
    );
  };
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const event = events.find((event) => event.uid === uid);
    if (!event) {
      return;
    }
    setEvents((events) =>
      [
        ...events,
        {
          ...event,
          uid: Math.random().toString(36).slice(2),
        },
      ].sort(sortEvents),
    );
  };
  return (
    <table className="relative table-auto w-full border-collapse text-sm leading-tight [&_td]:border border-gray-400">
      <thead className="sticky top-0 bg-white">
        <tr>
          <th className="sticky w-32">Start</th>
          <th className="sticky w-32">End</th>
          <th className="sticky">Subject</th>
          <th className="sticky w-16">Lane</th>
          <th className="sticky w-32">Category</th>
          <th className="sticky gap-2 flex flex-row justify-end">
            <button
              onClick={handleNew}
              className="border border-gray-400 px-1 py-0.5"
            >
              +
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        {events.map((event) => (
          <tr key={event.uid} data-event-uid={event.uid}>
            <td className="w-32">
              <DatePicker
                selected={event.start}
                onChange={(date: Date | null) => handleChangeStart(date, event.uid)}
                dateFormat="yyyy-MM-dd"
                calendarStartDay={1}
                className="w-full border border-gray-300 px-2 py-1"
                portalId="root"
                popperClassName="z-[9999]"
              />
            </td>
            <td className="w-32">
              <DatePicker
                selected={event.end}
                onChange={(date: Date | null) => handleChangeEnd(date, event.uid)}
                dateFormat="yyyy-MM-dd"
                calendarStartDay={1}
                className="w-full border border-gray-300 px-2 py-1"
                portalId="root"
                popperClassName="z-[9999]"
              />
            </td>
            <td>
              <input
                value={event.subject}
                className="w-full"
                onChange={handleChangeText}
              />
            </td>

            <td className="w-12">
              <input
                value={event.lane ?? 1}
                type="number"
                min={1}
                onChange={handleChangeLane}
              />
            </td>
            <td className="w-32">
              <select
                value={event.categoryId}
                onChange={handleChangeCategory}
                className="w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </td>
            <td className="text-end">
              <button
                className="border border-gray-400 px-1 py-0.5"
                onClick={handleCopy}
              >
                Copy
              </button>
              <button
                className="border border-gray-400 px-1 py-0.5"
                onClick={handleDelete}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
