/* Monochrome icons. All inherit currentColor. */

const wrap = (body: string, extra = ""): string =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${extra}>${body}</svg>`;

const stroke = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

export const icons = {
  instagram: wrap(`<rect x="3" y="3" width="18" height="18" rx="5" ${stroke}/><circle cx="12" cy="12" r="4.2" ${stroke}/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>`),
  tiktok: wrap(
    `<path fill="currentColor" d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>`,
    ' style="padding:1px"'
  ),
  youtube: wrap(`<rect x="2.5" y="5" width="19" height="14" rx="4" ${stroke}/><path d="M10.2 9.2v5.6l4.8-2.8z" fill="currentColor"/>`),
  soundcloud: wrap(
    `<path d="M10.5 9.2a5 5 0 0 1 8.9 2.4 2.9 2.9 0 0 1-.3 5.9h-8.6z" ${stroke}/><path d="M2.5 14.2v2.8M5.2 12.4v5M7.9 10.6v6.9" ${stroke}/>`
  ),
  spotify: wrap(`<circle cx="12" cy="12" r="9.5" ${stroke}/><path d="M7.2 9.4c3.4-1 7-.7 9.9.9M7.8 12.5c2.8-.8 5.7-.5 8 .8M8.4 15.4c2.2-.6 4.3-.4 6.1.6" ${stroke}/>`),
  mail: wrap(`<rect x="3" y="5.5" width="18" height="13" rx="1.5" ${stroke}/><path d="m3.8 6.5 8.2 6.4 8.2-6.4" ${stroke}/>`),
  play: wrap(`<path d="M8 5.6v12.8a.6.6 0 0 0 .9.5l10-6.4a.6.6 0 0 0 0-1L8.9 5.1a.6.6 0 0 0-.9.5z" fill="currentColor"/>`),
  pause: wrap(`<rect x="6.5" y="5" width="3.6" height="14" rx=".6" fill="currentColor"/><rect x="13.9" y="5" width="3.6" height="14" rx=".6" fill="currentColor"/>`),
  close: wrap(`<path d="m6 6 12 12M18 6 6 18" ${stroke}/>`),
  menu: wrap(`<path d="M4 8h16M4 16h16" ${stroke}/>`),
  arrowRight: wrap(`<path d="M4 12h15m-5-5 5 5-5 5" ${stroke}/>`),
  arrowLeft: wrap(`<path d="M20 12H5m5-5-5 5 5 5" ${stroke}/>`)
} as const;

export type IconName = keyof typeof icons;
