import { Locale } from "date-fns";
import { enUS as dateFnsEn, fi as dateFnsFi } from "date-fns/locale";
import { Palette } from "./palettes/types";
import claude from "./palettes/claude";
import spectral from "./palettes/spectral";
import { Category } from "./types";

export const locales: Record<string, Locale> = {
  "en-US": dateFnsEn,
  fi: dateFnsFi,
};
export const palettes: Record<string, Palette> = {
  claude,
  spectral,
};
export const localeLabels = {
  "en-US": "English",
  fi: "Finnish",
};

export const defaultCategories: Category[] = [
  { id: "winter", name: "Winter", color: "#add8e6", fontColor: "#000000" },
  { id: "spring", name: "Spring", color: "#90ee90", fontColor: "#000000" },
  { id: "summer", name: "Summer", color: "#ffffe0", fontColor: "#000000" },
  { id: "fall", name: "Fall", color: "#ffdab9", fontColor: "#000000" },
];
