/*
 * Botanical line art, generated from a handful of geometric primitives so every
 * stem, leaf and petal on the site shares the same hand.
 *
 * Output is plain SVG markup (strings), safe to use at build time or in the browser.
 * Colour is never baked in: strokes use classes that read CSS custom properties.
 *   .ln  stems and leaves   -> var(--b-line)
 *   .bl  blooms             -> var(--b-bloom)
 */

export type Pt = [number, number];

const r1 = (n: number): number => Math.round(n * 10) / 10;
const p = (v: Pt): string => `${r1(v[0])} ${r1(v[1])}`;
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const unit = (deg: number): Pt => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
const perp = (v: Pt): Pt => [-v[1], v[0]];
const len = (v: Pt): number => Math.hypot(v[0], v[1]);
const norm = (v: Pt): Pt => mul(v, 1 / (len(v) || 1));
const angleOf = (v: Pt): number => (Math.atan2(v[1], v[0]) * 180) / Math.PI;

const path = (cls: string, d: string): string => `<path class="${cls}" d="${d}"/>`;

/* ---------- curves ---------- */

const segments = (pts: Pt[], tension = 1): Array<[Pt, Pt, Pt, Pt]> => {
  const out: Array<[Pt, Pt, Pt, Pt]> = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    out.push([p1, add(p1, mul(sub(p2, p0), tension / 6)), sub(p2, mul(sub(p3, p1), tension / 6)), p2]);
  }
  return out;
};

/** Smooth open curve through points (Catmull-Rom as cubic Bezier). */
export const smooth = (pts: Pt[], tension = 1): string =>
  `M${p(pts[0])}` + segments(pts, tension).map(([, c1, c2, e]) => `C${p(c1)} ${p(c2)} ${p(e)}`).join("");

const bez = (s: [Pt, Pt, Pt, Pt], u: number): Pt => {
  const m = 1 - u;
  return [
    m * m * m * s[0][0] + 3 * m * m * u * s[1][0] + 3 * m * u * u * s[2][0] + u * u * u * s[3][0],
    m * m * m * s[0][1] + 3 * m * m * u * s[1][1] + 3 * m * u * u * s[2][1] + u * u * u * s[3][1]
  ];
};

/** Point and tangent angle at parameter t (0..1) along a smooth curve. */
const along = (pts: Pt[], t: number): { at: Pt; angle: number } => {
  const segs = segments(pts);
  const x = Math.min(Math.max(t, 0), 0.9999) * segs.length;
  const i = Math.floor(x);
  const u = x - i;
  const a = bez(segs[i], u);
  const b = bez(segs[i], Math.min(u + 0.01, 1));
  return { at: a, angle: angleOf(sub(b, a)) };
};

/* ---------- primitives ---------- */

/** Lanceolate leaf with a midrib. `bend` curls the tip sideways (fraction of length). */
export const leaf = (base: Pt, angle: number, length: number, width: number, bend = 0, rib = true): string => {
  const d = unit(angle);
  const n = perp(d);
  const at = (a: number, side: number, k: number): Pt => add(add(base, mul(d, length * a)), mul(n, side + bend * length * k));
  const tip = at(1, 0, 1);
  let s = `M${p(base)}C${p(at(0.28, width, 0.1))} ${p(at(0.72, width * 0.8, 0.55))} ${p(tip)}C${p(at(0.72, -width * 0.8, 0.55))} ${p(at(0.28, -width, 0.1))} ${p(base)}Z`;
  if (rib) s += `M${p(base)}Q${p(at(0.5, 0, 0.32))} ${p(at(0.8, 0, 0.7))}`;
  return path("ln", s);
};

/** Heart-shaped leaf (morning glory family): rounded basal lobes, drawn-out tip. */
const heartLeaf = (base: Pt, angle: number, length: number, width: number, bend = 0): string => {
  const d = unit(angle);
  const n = perp(d);
  const at = (a: number, side: number, k = 0): Pt => add(add(base, mul(d, length * a)), mul(n, side + bend * length * k));
  const outline: Array<[number, number, number]> = [
    [0.02, 0, 0],
    [-0.1, 0.28, 0],
    [-0.13, 0.66, 0],
    [0.02, 0.94, 0.05],
    [0.26, 1, 0.2],
    [0.54, 0.7, 0.45],
    [0.8, 0.3, 0.75],
    [1, 0, 1]
  ];
  const right = outline.map(([a, w, k]) => at(a, w * width, k));
  const left = outline
    .slice(0, -1)
    .reverse()
    .map(([a, w, k]) => at(a, -w * width, k));
  return path("ln", smooth([...right, ...left], 0.9) + `M${p(at(0.02, 0))}Q${p(at(0.45, 0, 0.3))} ${p(at(0.84, 0, 0.78))}`);
};

/** Teardrop petal from a base point. `round` widens the tip. */
export const petal = (base: Pt, angle: number, length: number, width: number, round = 0.5, cls = "bl"): string => {
  const d = unit(angle);
  const n = perp(d);
  const at = (a: number, side: number): Pt => add(add(base, mul(d, length * a)), mul(n, side));
  const tip = at(1, 0);
  return path(
    cls,
    `M${p(base)}C${p(at(0.35, width))} ${p(at(1 + round * 0.12, width * round))} ${p(tip)}C${p(at(1 + round * 0.12, -width * round))} ${p(at(0.35, -width))} ${p(base)}Z`
  );
};

/** Art Nouveau whiplash tendril: a tightening spiral. */
const tendril = (start: Pt, angle: number, length: number, dir: 1 | -1, turns = 1.4): string => {
  const pts: Pt[] = [start];
  const steps = 18;
  let heading = angle;
  let cur = start;
  for (let i = 1; i <= steps; i++) {
    const k = i / steps;
    const step = (length / steps) * (1.25 - k * 0.7);
    heading += dir * ((turns * 360) / steps) * k * k * 1.6;
    cur = add(cur, mul(unit(heading), step));
    pts.push(cur);
  }
  return path("ln", smooth(pts));
};

/* ---------- blooms ---------- */

const moonflower = (c: Pt, r: number, tilt: number, tubeTo: Pt): string => {
  const out: string[] = [];
  const squash = 0.6;
  const lobes = 5;
  const rot = (tilt * Math.PI) / 180;
  const place = (th: number, rr: number): Pt => {
    const local: Pt = [Math.cos(th) * rr, Math.sin(th) * rr * squash];
    return add(c, [local[0] * Math.cos(rot) - local[1] * Math.sin(rot), local[0] * Math.sin(rot) + local[1] * Math.cos(rot)]);
  };
  const rim: Pt[] = [];
  for (let i = 0; i <= 80; i++) {
    const th = (i / 80) * Math.PI * 2;
    rim.push(place(th, r * (1 + 0.04 * Math.cos(lobes * th))));
  }
  out.push(path("bl", smooth(rim) + "Z"));

  // throat sits a little toward the tube
  const throat = lerp(c, tubeTo, 0.1);
  out.push(`<ellipse class="bl" cx="${r1(throat[0])}" cy="${r1(throat[1])}" rx="${r1(r * 0.12)}" ry="${r1(r * 0.12 * squash)}" transform="rotate(${tilt} ${r1(throat[0])} ${r1(throat[1])})"/>`);
  for (let k = 0; k < lobes; k++) {
    const q = place((k / lobes) * Math.PI * 2, r * 1.03);
    const mid = add(lerp(q, throat, 0.5), mul(perp(norm(sub(throat, q))), r * 0.06));
    out.push(path("bl", `M${p(lerp(q, throat, 0.04))}Q${p(mid)} ${p(lerp(q, throat, 0.86))}`));
  }

  // tube: tangent to the rim silhouette, narrowing to the calyx
  const axis = angleOf(sub(c, tubeTo));
  let lo = rim[0];
  let hi = rim[0];
  let loA = Infinity;
  let hiA = -Infinity;
  rim.forEach((q) => {
    let a = angleOf(sub(q, tubeTo)) - axis;
    a = ((a + 540) % 360) - 180;
    if (a < loA) { loA = a; lo = q; }
    if (a > hiA) { hiA = a; hi = q; }
  });
  const dir = norm(sub(tubeTo, c));
  const side = perp(dir);
  const flare = (from: Pt, sd: number): string => {
    const end = add(tubeTo, mul(side, sd * r * 0.06));
    const ctrl = add(lerp(from, end, 0.62), mul(side, -sd * r * 0.16));
    return path("bl", `M${p(from)}Q${p(ctrl)} ${p(end)}`);
  };
  const sdLo = Math.sign((lo[0] - c[0]) * side[0] + (lo[1] - c[1]) * side[1]) || 1;
  out.push(flare(lo, sdLo), flare(hi, -sdLo));

  const ang = angleOf(dir);
  out.push(leaf(tubeTo, ang + 150, r * 0.3, r * 0.07, 0, false));
  out.push(leaf(tubeTo, ang - 150, r * 0.3, r * 0.07, 0, false));
  return out.join("");
};

/** Twisted, furled moonflower bud. */
const furledBud = (base: Pt, angle: number, length: number): string => {
  const d = unit(angle);
  const n = perp(d);
  const at = (a: number, side: number): Pt => add(add(base, mul(d, length * a)), mul(n, side));
  const w = length * 0.2;
  return (
    path("bl", `M${p(base)}C${p(at(0.3, w))} ${p(at(0.75, w * 0.6))} ${p(at(1, 0))}C${p(at(0.75, -w * 0.6))} ${p(at(0.3, -w))} ${p(base)}Z`) +
    path("bl", `M${p(at(0.15, -w * 0.7))}C${p(at(0.45, w * 0.6))} ${p(at(0.7, -w * 0.3))} ${p(at(0.98, 0))}`) +
    path("bl", `M${p(at(0.35, -w * 0.85))}Q${p(at(0.7, w * 0.3))} ${p(at(0.92, 0))}`)
  );
};

/* ---------- compositions ---------- */

export interface Art {
  viewBox: string;
  body: string;
}

/* ---------- ornaments ---------- */

/** Corner sprig hugging the top-left corner. Rotate/flip with CSS for other corners. */
export const cornerSprig = (): Art => {
  const stem: Pt[] = [[6, 150], [14, 86], [44, 38], [96, 12], [150, 6]];
  const out: string[] = [path("ln", smooth(stem))];
  [0.18, 0.36, 0.54, 0.72].forEach((t, i) => {
    const { at, angle } = along(stem, t);
    out.push(leaf(at, angle + 38, 26 - i * 3, 5.5 - i * 0.6, 0.08));
  });
  [0.27, 0.63].forEach((t, i) => {
    const { at, angle } = along(stem, t);
    out.push(leaf(at, angle - 140, 18 - i * 3, 4.2, -0.1));
  });
  out.push(petal([150, 6], 2, 14, 4.6, 0.6));
  out.push(tendril([6, 150], 95, 22, -1));
  return { viewBox: "0 0 160 160", body: out.join("") };
};

/** Horizontal divider: a closed bud with whiplash stems either side. */
export const divider = (): Art => {
  const out: string[] = [];
  const side = (dir: 1 | -1): void => {
    const x = (v: number): number => 200 + dir * v;
    const stem: Pt[] = [[x(4), 26], [x(46), 20], [x(96), 27], [x(140), 22]];
    out.push(path("ln", smooth(stem)));
    [0.2, 0.48, 0.74].forEach((t, i) => {
      const { at, angle } = along(stem, t);
      const a = dir === 1 ? angle : angle;
      out.push(leaf(at, a - 32 * dir * (i % 2 ? -1 : 1), 17 - i * 3.5, 4 - i * 0.6, 0.1 * dir));
    });
    out.push(tendril([x(140), 22], dir === 1 ? -10 : 190, 26, dir === 1 ? -1 : 1));
  };
  side(1);
  side(-1);
  out.push(petal([200, 26], -90, 19, 6.5, 0.4));
  out.push(path("bl", `M200 25Q197 16 200 9`));
  out.push(leaf([200, 27], -150, 12, 3.4, 0, false));
  out.push(leaf([200, 27], -30, 12, 3.4, 0, false));
  return { viewBox: "0 0 400 40", body: out.join("") };
};

/** Tiny upright sprig: stem, two leaves, a bud. Sits on each cover's title strip. */
export const sprigMark = (): Art => {
  const out: string[] = [path("ln", "M20 58Q19 40 20 18")];
  out.push(leaf([20, 46], -140, 15, 4.2, 0.08, false));
  out.push(leaf([20, 36], -40, 13, 3.8, -0.08, false));
  out.push(petal([20, 19], -90, 13, 4.6, 0.55));
  return { viewBox: "0 0 40 60", body: out.join("") };
};

/** Tall climbing moonflower vine for the home hero. */
export const heroVine = (): Art => {
  const vine: Pt[] = [[70, 640], [52, 560], [86, 470], [60, 380], [92, 290], [72, 210], [98, 150]];
  const out: string[] = [path("ln", smooth(vine))];
  const leaves: Array<[number, number, number]> = [
    [0.1, 205, 44],
    [0.22, -25, 38],
    [0.36, 200, 40],
    [0.5, -20, 32],
    [0.62, 205, 30],
    [0.76, -30, 24]
  ];
  leaves.forEach(([t, ang, size], i) => {
    out.push(heartLeaf(along(vine, t).at, ang, size, size * 0.43, i % 2 ? -0.06 : 0.06));
  });
  out.push(tendril(along(vine, 0.3).at, 10, 34, -1));
  out.push(tendril(along(vine, 0.56).at, 175, 28, 1));
  out.push(tendril(along(vine, 0.84).at, -5, 22, -1));
  out.push(moonflower([118, 92], 46, -22, [98, 150]));
  out.push(path("ln", smooth([along(vine, 0.7).at, [40, 250], [30, 214]])));
  out.push(furledBud([30, 214], -104, 34));
  return { viewBox: "0 0 180 640", body: out.join("") };
};

export const svg = (art: Art, className: string, label?: string): string =>
  `<svg class="botanical ${className}" viewBox="${art.viewBox}" ${label ? `role="img" aria-label="${label}"` : `aria-hidden="true" focusable="false"`} preserveAspectRatio="xMidYMid meet">${art.body}</svg>`;
