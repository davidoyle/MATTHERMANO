import { renderCalendar } from "../templates/calendar";

/** Re-render with today's date so shows move from Upcoming to Past without a rebuild. */
export const initializeCalendar = (): void => {
  const root = document.querySelector<HTMLElement>("[data-calendar]");
  if (root) root.innerHTML = renderCalendar(new Date());
};
