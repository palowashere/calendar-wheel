import { CalendarEvent, Category } from "../types";
import React from "react";
import { WheelStyleConfig } from "../wheelStyle";

export interface ConfigPanelProps {
  events: readonly CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  categories: readonly Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  minDate: string;
  setMinDate: React.Dispatch<React.SetStateAction<string>>;
  maxDate: string;
  setMaxDate: React.Dispatch<React.SetStateAction<string>>;
  localeName: string;
  setLocaleName: React.Dispatch<React.SetStateAction<string>>;
  paletteName: string;
  setPaletteName: React.Dispatch<React.SetStateAction<string>>;
  style: WheelStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<WheelStyleConfig>>;
  onExportPNG: () => void;
}
