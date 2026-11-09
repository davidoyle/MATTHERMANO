/*
 * Shows + release calendar. Pure string rendering so it runs at build time
 * (static HTML) and again in the browser (so "Upcoming" stays correct after deploy).
 */
import { shows } from "../data/shows";
import { socialById } from "../data/site";
import { tracks } from "../data/tracks";

interface Entry {
  date: string;
  kind: "Show" | "Release";
  title: string;
  detail: string;
  href?: string;
  external?: boolean;
  linkLabel?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const esc = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const entries = (): Entry[] => [
  ...shows.map<Entry>((show) => ({
    date: show.date,
    kind: "Show",
    title: show.venue,
    detail: [show.city, show.time, show.note].filter(Boolean).join(" · "),
    href: show.url,
    external: true,
    linkLabel: "Details"
  })),
  ...tracks.map<Entry>((track) => ({
    date: track.released,
    kind: "Release",
    title: track.title,
    detail: `Single · ${track.duration}`,
    href: `/track/${track.slug}/`,
    linkLabel: "Listen"
  }))
];

const isoToday = (now: Date): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

/** Month-precision dates count as the last day of that month. */
const endOf = (date: string): string => (date.length === 7 ? `${date}-31` : date);

const dateBlock = (date: string): string => {
  const [year, month, day] = date.split("-");
  return `<time class="cal__date" datetime="${date}">
    <span class="cal__mon">${MONTHS[Number(month) - 1]}</span>
    ${day ? `<span class="cal__day">${Number(day)}</span>` : ""}
    <span class="cal__yr">${year}</span>
  </time>`;
};

const row = (entry: Entry): string => `
<li class="cal__row cal__row--${entry.kind.toLowerCase()}">
  ${dateBlock(entry.date)}
  <div class="cal__body">
    <span class="tag">${entry.kind}</span>
    <h4 class="cal__title">${esc(entry.title)}</h4>
    ${entry.detail ? `<p class="cal__detail">${esc(entry.detail)}</p>` : ""}
  </div>
  ${
    entry.href
      ? `<a class="text-link cal__link" href="${entry.href}"${entry.external ? ' target="_blank" rel="noopener"' : ""}>${entry.linkLabel ?? "Details"}</a>`
      : ""
  }
</li>`;

const empty = (): string => `
<div class="cal__empty">
  <p class="cal__empty-title">No public dates on the calendar yet.</p>
  <p>When shows are booked they go up here and on Instagram. Want Matt in your room, at your venue or at a private event?</p>
  <div class="cal__empty-actions">
    <a class="btn btn--primary" href="/book/">Book a show</a>
    <a class="btn btn--ghost" href="${socialById("instagram").href}" target="_blank" rel="noopener">Follow on Instagram</a>
  </div>
</div>`;

export const renderCalendar = (now: Date): string => {
  const today = isoToday(now);
  const all = entries();
  const upcoming = all.filter((entry) => endOf(entry.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = all.filter((entry) => endOf(entry.date) < today).sort((a, b) => b.date.localeCompare(a.date));
  const years = [...new Set(past.map((entry) => entry.date.slice(0, 4)))];

  return `
<section class="cal__section" aria-labelledby="cal-upcoming">
  <h2 class="section-title" id="cal-upcoming">Upcoming</h2>
  ${upcoming.length ? `<ol class="cal__list">${upcoming.map(row).join("")}</ol>` : empty()}
</section>
<section class="cal__section" aria-labelledby="cal-past">
  <h2 class="section-title" id="cal-past">Releases &amp; past dates</h2>
  ${years
    .map(
      (year) => `
  <div class="cal__year-group">
    <h3 class="cal__year">${year}</h3>
    <ol class="cal__list">${past.filter((entry) => entry.date.startsWith(year)).map(row).join("")}</ol>
  </div>`
    )
    .join("")}
</section>`;
};
