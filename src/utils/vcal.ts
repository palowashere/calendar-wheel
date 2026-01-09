import type { CalendarComponent, VEvent } from "node-ical";

export function isVEvent(comp: CalendarComponent): comp is VEvent {
  return comp.type === "VEVENT";
}

export async function parseVCal(text: string, minDateT: Date, maxDateT: Date) {
  const { parseICS } = await import("node-ical");
  const cal = parseICS(text);
  return Object.values(cal)
    .filter(isVEvent)
    .filter((event) => event.start >= minDateT && event.end <= maxDateT)
    .map(
      (event) =>
        ({
          uid: event.uid,
          start: event.start,
          end: event.end,
          subject: event.summary,
          lane: 1,
        }),
    );
}
