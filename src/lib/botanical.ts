/*
 * Botanical line art, generated from a handful of geometric primitives so every
 * stem, leaf and petal on the site shares the same hand.
 *
 * Output is plain SVG markup (strings), safe to use at build time or in the browser.
 * Colour is never baked in: strokes use classes that read CSS custom properties.
 *   .ln  stems and leaves   -> var(--b-line)
 *   .bl  blooms             -> var(--b-bloom)
 *   .dt  filled accents     -> var(--b-bloom)
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

/** Deterministic PRNG so the art is identical on every build. */
const rng = (seed: number) => {
  let a = seed >>> 0;
  return (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const path = (cls: string, d: string): string => `<path class="${cls}" d="${d}"/>`;
const dot = (c: Pt, r: number): string => `<circle class="dt" cx="${r1(c[0])}" cy="${r1(c[1])}" r="${r1(r)}"/>`;

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

/** Leaf on a short stalk, growing from a point on a stem. */
const stalkedLeaf = (from: Pt, angle: number, stalk: number, length: number, width: number, bend = 0): string => {
  const base = add(from, mul(unit(angle), stalk));
  return path("ln", `M${p(from)}L${p(base)}`) + leaf(base, angle, length, width, bend);
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

const iris = (c: Pt, s: number): string => {
  const out: string[] = [];
  // standards (upright)
  out.push(petal(add(c, [0, -2]), -90, s * 0.95, s * 0.22, 0.75));
  out.push(petal(add(c, [-3, -1]), -122, s * 0.72, s * 0.2, 0.7));
  out.push(petal(add(c, [3, -1]), -58, s * 0.72, s * 0.2, 0.7));
  // falls (drooping), drawn as long recurved petals
  const fall = (sx: 1 | -1): string => {
    const o = (x: number, y: number): Pt => add(c, [sx * x * s, y * s]);
    return path(
      "bl",
      `M${p(o(0.02, 0.02))}C${p(o(0.38, -0.2))} ${p(o(0.86, -0.05))} ${p(o(0.84, 0.32))}` +
        `C${p(o(0.82, 0.6))} ${p(o(0.6, 0.72))} ${p(o(0.5, 0.58))}` +
        `C${p(o(0.4, 0.42))} ${p(o(0.26, 0.2))} ${p(o(0.02, 0.06))}Z` +
        `M${p(o(0.12, 0.03))}C${p(o(0.4, -0.04))} ${p(o(0.62, 0.12))} ${p(o(0.64, 0.38))}`
    );
  };
  out.push(fall(1), fall(-1));
  out.push(petal(add(c, [0, 3]), 92, s * 0.62, s * 0.2, 0.9));
  // beard
  for (let i = 0; i < 4; i++) {
    const y = c[1] + 8 + i * (s * 0.09);
    out.push(path("bl", `M${p([c[0] - 2.5, y])}L${p([c[0] + 2.5, y + 2])}`));
  }
  return out.join("");
};

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

const dandelion = (c: Pt, r: number, seed: number): string => {
  const rand = rng(seed);
  const out: string[] = [];
  const count = 46;
  for (let i = 0; i < count; i++) {
    if (rand() < 0.2) continue;
    const ang = (i / count) * 360 + rand() * 4;
    const reach = r * (0.88 + rand() * 0.12);
    const from = add(c, mul(unit(ang), r * 0.13));
    const to = add(c, mul(unit(ang), reach));
    out.push(path("bl", `M${p(from)}L${p(to)}`));
    out.push(pappus(to, ang, r * 0.13));
  }
  out.push(dot(c, r * 0.07));
  return out.join("");
};

const pappus = (at: Pt, angle: number, size: number): string => {
  const rays = [-46, -24, 0, 24, 46].map((o) => `M${p(at)}L${p(add(at, mul(unit(angle + o), size)))}`).join("");
  return path("bl", rays);
};

const driftingSeed = (at: Pt, angle: number, length: number): string => {
  const head = add(at, mul(unit(angle), length));
  return path("bl", `M${p(at)}L${p(head)}`) + pappus(head, angle, length * 0.42) + dot(at, 1.3);
};

/** Side-view poppy cup with ruffled rim. */
const poppy = (base: Pt, s: number, tilt: number): string => {
  const rot = (tilt * Math.PI) / 180;
  const o = (x: number, y: number): Pt => {
    const lx = x * s;
    const ly = y * s;
    return add(base, [lx * Math.cos(rot) - ly * Math.sin(rot), lx * Math.sin(rot) + ly * Math.cos(rot)]);
  };
  const out: string[] = [];
  // back petals
  out.push(path("bl", `M${p(o(-0.08, 0))}C${p(o(-0.5, -0.12))} ${p(o(-0.78, -0.62))} ${p(o(-0.5, -0.92))}Q${p(o(-0.4, -0.98))} ${p(o(-0.3, -0.9))}Q${p(o(-0.18, -1.02))} ${p(o(-0.04, -0.94))}`));
  out.push(path("bl", `M${p(o(0.08, 0))}C${p(o(0.5, -0.12))} ${p(o(0.8, -0.6))} ${p(o(0.56, -0.9))}Q${p(o(0.46, -0.99))} ${p(o(0.34, -0.92))}Q${p(o(0.2, -1.03))} ${p(o(0.06, -0.94))}`));
  // front petal, ruffled top
  out.push(
    path(
      "bl",
      `M${p(o(0, 0.02))}C${p(o(-0.52, -0.05))} ${p(o(-0.62, -0.5))} ${p(o(-0.46, -0.7))}` +
        `Q${p(o(-0.36, -0.8))} ${p(o(-0.24, -0.7))}Q${p(o(-0.12, -0.82))} ${p(o(0.0, -0.72))}Q${p(o(0.12, -0.84))} ${p(o(0.24, -0.72))}Q${p(o(0.38, -0.8))} ${p(o(0.46, -0.68))}` +
        `C${p(o(0.62, -0.48))} ${p(o(0.5, -0.04))} ${p(o(0, 0.02))}Z`
    )
  );
  // veins
  [-0.3, -0.1, 0.1, 0.3].forEach((x) => {
    out.push(path("bl", `M${p(o(x * 0.25, -0.02))}Q${p(o(x * 0.9, -0.3))} ${p(o(x * 1.05, -0.58))}`));
  });
  return out.join("");
};

/** Nodding poppy bud on a crook. */
const poppyBud = (top: Pt, s: number): string => {
  const hang = add(top, [s * 0.35, s * 0.12]);
  const d = unit(105);
  const n = perp(d);
  const at = (a: number, side: number): Pt => add(add(hang, mul(d, s * a)), mul(n, side * s));
  return (
    path("ln", `M${p(top)}Q${p(add(top, [s * 0.3, -s * 0.12]))} ${p(hang)}`) +
    path("bl", `M${p(hang)}C${p(at(0.1, 0.34))} ${p(at(0.72, 0.3))} ${p(at(0.9, 0))}C${p(at(0.72, -0.3))} ${p(at(0.1, -0.34))} ${p(hang)}Z`) +
    path("bl", `M${p(at(0.06, 0.04))}Q${p(at(0.45, 0.1))} ${p(at(0.86, 0.02))}`)
  );
};

/** Short hairs along a stem, a poppy signature. */
const hairs = (pts: Pt[], from: number, to: number, count: number, seed: number): string => {
  const rand = rng(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    const t = from + ((to - from) * i) / count;
    const { at, angle } = along(pts, t);
    const side = i % 2 ? 1 : -1;
    const start = add(at, mul(unit(angle + 90 * side), 1));
    d += `M${p(start)}L${p(add(start, mul(unit(angle + side * (70 + rand() * 20) + 180 * 0), 3 + rand() * 2)))}`;
  }
  return path("ln", d);
};

/* ---------- compositions ---------- */

export interface Art {
  viewBox: string;
  body: string;
}

export type BotanicalKind = "iris" | "moonflower" | "dandelion" | "poppy" | "eucalyptus";

const irisArt = (): Art => {
  const stem: Pt[] = [[176, 330], [170, 260], [166, 190], [162, 128]];
  const out: string[] = [path("ln", smooth(stem))];
  out.push(leaf([150, 330], -97, 205, 6.5, 0.06));
  out.push(leaf([190, 330], -78, 150, 5.5, -0.12));
  out.push(leaf([168, 330], -88, 120, 5, 0.18));
  out.push(leaf([163, 150], -100, 34, 4.5, -0.1, false));
  out.push(iris([161, 124], 58));
  return { viewBox: "0 0 300 300", body: out.join("") };
};

const moonflowerArt = (): Art => {
  const vine: Pt[] = [[60, 330], [92, 268], [70, 214], [108, 182], [146, 176]];
  const out: string[] = [path("ln", smooth(vine))];
  out.push(heartLeaf(along(vine, 0.18).at, 200, 46, 20, 0.08));
  out.push(heartLeaf(along(vine, 0.42).at, -20, 40, 17, -0.08));
  out.push(heartLeaf(along(vine, 0.63).at, 205, 30, 13, 0.06));
  out.push(tendril(along(vine, 0.5).at, 10, 36, -1));
  out.push(tendril(along(vine, 0.28).at, 175, 30, 1));
  const budStem: Pt[] = [along(vine, 0.7).at, [96, 140], [86, 108]];
  out.push(path("ln", smooth(budStem)));
  out.push(furledBud([86, 108], -100, 40));
  out.push(moonflower([204, 104], 46, -14, [146, 176]));
  return { viewBox: "0 0 300 300", body: out.join("") };
};

const dandelionArt = (): Art => {
  const stem: Pt[] = [[118, 330], [128, 250], [142, 190], [148, 140]];
  const bare: Pt[] = [[150, 330], [168, 270], [196, 230], [214, 212]];
  const out: string[] = [path("ln", smooth(stem)), path("ln", smooth(bare))];
  out.push(dot([214, 212], 2.6));
  out.push(dandelion([148, 112], 50, 7));
  out.push(driftingSeed([228, 104], -62, 18));
  out.push(driftingSeed([254, 82], -40, 15));
  out.push(driftingSeed([214, 70], -76, 13));
  out.push(leaf([122, 330], -128, 70, 7, 0.1, true));
  return { viewBox: "0 0 300 300", body: out.join("") };
};

const poppyArt = (): Art => {
  const stem: Pt[] = [[120, 330], [138, 262], [134, 200], [150, 150]];
  const budStem: Pt[] = [[176, 330], [184, 270], [204, 210], [214, 176]];
  const out: string[] = [path("ln", smooth(stem)), path("ln", smooth(budStem))];
  out.push(hairs(stem, 0.35, 0.95, 9, 3));
  out.push(hairs(budStem, 0.3, 0.95, 7, 5));
  out.push(poppy([150, 150], 64, 8));
  out.push(poppyBud([214, 176], 30));
  out.push(leaf([128, 330], -118, 64, 9, 0.12));
  return { viewBox: "0 0 300 300", body: out.join("") };
};

const eucalyptusArt = (): Art => {
  const branch: Pt[] = [[22, 300], [56, 196], [122, 122], [204, 104], [262, 140]];
  const out: string[] = [path("ln", smooth(branch))];
  const pairs = [0.16, 0.3, 0.44, 0.57, 0.69, 0.8, 0.9];
  pairs.forEach((t, i) => {
    const { at, angle } = along(branch, t);
    const size = 38 - i * 3.6;
    out.push(stalkedLeaf(at, angle - 58, 4, size, size * 0.5, 0.05));
    out.push(stalkedLeaf(at, angle + 64, 4, size * 0.9, size * 0.48, -0.05));
  });
  const tip = along(branch, 0.99).at;
  out.push(leaf(tip, 70, 16, 6, 0, false));
  // gumnut cluster
  const { at } = along(branch, 0.5);
  const nut = add(at, [6, 26]);
  out.push(path("ln", `M${p(at)}Q${p(add(at, [8, 10]))} ${p(nut)}`));
  [[0, 0], [-5.5, 4.5], [5.5, 4.5], [0, 9]].forEach(([dx, dy]) => out.push(dot(add(nut, [dx, dy]), 2.1)));
  return { viewBox: "0 0 300 300", body: out.join("") };
};

const builders: Record<BotanicalKind, () => Art> = {
  iris: irisArt,
  moonflower: moonflowerArt,
  dandelion: dandelionArt,
  poppy: poppyArt,
  eucalyptus: eucalyptusArt
};

export const botanical = (kind: BotanicalKind): Art => builders[kind]();

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
