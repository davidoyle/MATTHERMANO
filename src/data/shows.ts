export interface Show {
  /** ISO date, e.g. "2026-12-04". */
  date: string;
  /** Set time as it should be printed, e.g. "7–9 PM". */
  time?: string;
  venue: string;
  /** Optional; printed after the time. */
  city?: string;
  note?: string;
  /** Tickets, RSVP or event page. */
  url?: string;
}

/*
 * Public dates. Add a show here and it appears on /shows/ automatically,
 * sorted by date, and moves to "Past shows" the day after it happens.
 */
export const shows: Show[] = [
  { date: "2026-12-03", time: "7–9 PM", venue: "Langley Christmas Market" },
  { date: "2026-12-06", time: "3:30–5:30 PM", venue: "Langley Christmas Market" },
  { date: "2026-12-11", time: "7–9 PM", venue: "Langley Christmas Market" },
  { date: "2026-12-14", time: "4:30–6:30 PM", venue: "Shipyards Christmas Market" },
  { date: "2026-12-20", time: "6–9 PM", venue: "Noel" },
  { date: "2026-12-22", time: "1–3 PM", venue: "Langley Christmas Market" }
];
