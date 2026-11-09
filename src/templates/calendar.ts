/*
 * Shows calendar. Pure string rendering so it runs at build time (static HTML)
 * and again in the browser, so past shows move down without a rebuild.
 */
import { shows, type Show } from "../data/shows";
import { socialById } from "../data/site";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const esc = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isoToday = (now: Date): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

const parts = (date: string): { year: number; month: number; day: number; weekday: string } => {
  const [year, month, day] = date.split("-").map(Number);
  // UTC so the weekday never shifts with the viewer's time zone.
  const weekday = DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return { year, month, day, weekday };
};

const row = (show: Show): string => {
  const { month, day, weekday } = parts(show.date);
  const detail = [show.time, show.city, show.note].filter(Boolean).join(" · ");
  return `
<li class="cal__row">
  <time class="cal__date" datetime="${show.date}">
    <span class="cal__wd">${weekday}</span>
    <span class="cal__day">${day}</span>
    <span class="cal__mon">${MONTHS[month - 1].slice(0, 3)}</span>
  </time>
  <div class="cal__body">
    <h3 class="cal__title">${esc(show.venue)}</h3>
    ${detail ? `<p class="cal__detail">${esc(detail)}</p>` : ""}
  </div>
  ${show.url ? `<a class="text-link cal__link" href="${show.url}" target="_blank" rel="noopener">Details</a>` : ""}
</li>`;
};

/** Groups shows under "December 2026" style headings. */
const byMonth = (list: Show[]): string => {
  const groups = new Map<string, Show[]>();
  list.forEach((show) => {
    const key = show.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), show]);
  });
  return [...groups.entries()]
    .map(([key, items]) => {
      const { year, month } = parts(`${key}-01`);
      return `
  <div class="cal__group">
    <h3 class="cal__month">${MONTHS[month - 1]} ${year}</h3>
    <ol class="cal__list">${items.map(row).join("")}</ol>
  </div>`;
    })
    .join("");
};

const empty = (): string => `
<div class="cal__empty">
  <p class="cal__empty-title">No public dates on the calendar right now.</p>
  <p>When shows are booked they go up here and on Instagram. Want Matt in your room, at your venue or at a private event?</p>
  <div class="cal__empty-actions">
    <a class="btn btn--primary" href="/book/">Book a show</a>
    <a class="btn btn--ghost" href="${socialById("instagram").href}" target="_blank" rel="noopener">Follow on Instagram</a>
  </div>
</div>`;

export const renderCalendar = (now: Date): string => {
  const today = isoToday(now);
  const upcoming = shows.filter((show) => show.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = shows.filter((show) => show.date < today).sort((a, b) => b.date.localeCompare(a.date));

  return `
<section class="cal__section" aria-labelledby="cal-upcoming">
  <h2 class="section-title" id="cal-upcoming">Upcoming</h2>
  ${upcoming.length ? byMonth(upcoming) : empty()}
</section>
${
  past.length
    ? `<section class="cal__section cal__section--past" aria-labelledby="cal-past">
  <h2 class="section-title" id="cal-past">Past shows</h2>
  ${byMonth(past)}
</section>`
    : ""
}`;
};
