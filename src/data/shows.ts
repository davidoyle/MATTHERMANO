export interface Show {
  /** ISO date, e.g. "2026-12-04". */
  date: string;
  /** Doors or set time as you want it printed, e.g. "8:00 PM". */
  time?: string;
  venue: string;
  city: string;
  note?: string;
  /** Tickets, RSVP or event page. */
  url?: string;
}

/*
 * Public dates. Add a show here and it appears on /shows/ automatically,
 * sorted by date, and moves to "Past" the day after it happens.
 *
 * Example:
 * { date: "2026-12-04", time: "8:00 PM", venue: "The Listening Room", city: "Vancouver, BC", url: "https://..." }
 */
export const shows: Show[] = [];
