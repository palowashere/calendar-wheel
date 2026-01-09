import { ConfigPanelProps } from "./types";
import { EventsTable } from "./EventsTable";
import { CategoriesTable } from "./CategoriesTable";

export function DataPanel({
  events,
  setEvents,
  categories,
  setCategories,
}: ConfigPanelProps) {
  return (
    <>
      <div className="overflow-y-scroll max-h-[80vh]">
        <CategoriesTable categories={categories} setCategories={setCategories} />
        <EventsTable events={events} setEvents={setEvents} categories={categories} />
      </div>
    </>
  );
}
