import * as datefns from "date-fns";
import { CalendarEvent } from "./types";

export function loadExampleData(): CalendarEvent[] {
  const soy = datefns.startOfYear(new Date());
  return [
    {
      start: soy,
      end: datefns.addDays(soy, 2),
      subject: "New year party",
      uid: "hny",
      lane: 1,
      categoryId: "winter",
    },
    {
      start: datefns.set(soy, { month: 2, date: 13 }),
      end: datefns.set(soy, { month: 2, date: 20 }),
      subject: "Sakura \u{1F338}",
      uid: "sakura",
      lane: 1,
      categoryId: "spring",
    },
    {
      start: datefns.addMonths(soy, 5),
      end: datefns.addMonths(soy, 6),
      subject: "Summer \u{1F3D6}",
      uid: "summer",
      lane: 1,
      categoryId: "summer",
    },
    {
      start: datefns.set(soy, { month: 5, date: 20 }),
      end: datefns.set(soy, { month: 5, date: 23 }),
      subject: "June solstice",
      uid: "june-solstice",
      lane: 2,
      categoryId: "summer",
    },
    {
      start: datefns.set(soy, { month: 11, date: 21 }),
      end: datefns.set(soy, { month: 11, date: 23 }),
      subject: "December solstice",
      uid: "december-solstice",
      lane: 2,
      categoryId: "winter",
    },
    // Dark beer season
    {
      start: datefns.set(soy, { month: 8, date: 22 }),
      end: datefns.set(soy, { month: 9, date: 22 }),
      subject: "Oktoberfest",
      uid: "oktoberfest",
      lane: 1,
      categoryId: "fall",
    },
    {
      start: datefns.set(soy, { month: 11, date: 6 }),
      end: datefns.set(soy, { month: 11, date: 9 }),
      subject: "St. Nicholas Day",
      uid: "st-nicholas",
      lane: 1,
      categoryId: "winter",
    },
  ];
}
