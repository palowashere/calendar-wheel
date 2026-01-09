import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  fontColor: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CalendarEventSchema = z.object({
  end: z.coerce.date(),
  start: z.coerce.date(),
  subject: z.string(),
  uid: z.string(),
  lane: z.number(),
  categoryId: z.string(),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
