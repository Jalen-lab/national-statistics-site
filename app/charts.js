// Japan by Numbers — small SVG chart builders. No library, no network.
// Every chart is drawn from the numbers passed in, so the figures on screen
// are the figures in data.js. Colours match style.css.

const INDIGO = '#232a5e';
const VERMILION = '#c93a22';
const TEAL = '#0f766e';
const GRID = '#e3e6ee';
const MUTED = '#5b6474';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/** Line chart. points: [{x: label, y: number}]. */
export function lineChart(points, { height = 260, format = (v) => String(v), color = INDIGO, ymin = null } = {}) {
  const w = 640, h = height, padL = 46, padR = 14, padT = 30, padB = 30;
  const ys = points.map((p) => p.y);
  let lo = ymin === null ? Math.min(...ys) : ymin;
  let hi = Math.max(...ys);
  if (hi === lo) hi = lo + 1;
  const X = (i) => padL + ((w - padL - padR) * i) / (points.length - 1);
  const Y = (v) => padT + ((h - padT - padB) * (hi - v)) / (hi - lo);
  const ticks = 4;
  let grid = '';
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    const y = Y(v);
    grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="${GRID}"/>` +
      `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(Math.round(v * 10) / 10))}</text>`;
  }
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
  const dots = points.map((p, i) =>
    `<circle cx="${X(i)}" cy="${Y(p.y)}" r="4" fill="${color}"/>` +
    `<text x="${X(i)}" y="${Y(p.y) - 10}" text-anchor="middle" font-size="11" font-weight="700" fill="${INDIGO}">${esc(format(p.y))}</text>`).join('');
  const labels = points.map((p, i) =>
    `<text x="${X(i)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(p.x)}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart">${grid}` +
    `<path d="${line}" fill="none" stroke="${color}" stroke-width="2.5"/>${dots}${labels}</svg>`;
}

/** Vertical bar chart. points: [{x: label, y: number}]. */
export function barChart(points, { height = 260, format = (v) => String(v), color = INDIGO, highlightLast = false } = {}) {
  const w = 640, h = height, padL = 46, padR = 14, padT = 26, padB = 30;
  const hi = Math.max(...points.map((p) => p.y)) * 1.08;
  const bw = (w - padL - padR) / points.length;
  const Y = (v) => padT + ((h - padT - padB) * (hi - v)) / hi;
  let grid = '';
  for (let t = 0; t <= 4; t++) {
    const v = (hi * t) / 4;
    const y = Y(v);
    grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="${GRID}"/>` +
      `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(Math.round(v * 10) / 10))}</text>`;
  }
  const bars = points.map((p, i) => {
    const x = padL + bw * i + bw * 0.18;
    const bwReal = bw * 0.64;
    const fill = highlightLast && i === points.length - 1 ? VERMILION : color;
    return `<rect x="${x.toFixed(1)}" y="${Y(p.y).toFixed(1)}" width="${bwReal.toFixed(1)}" height="${(h - padB - Y(p.y)).toFixed(1)}" rx="3" fill="${fill}"/>` +
      `<text x="${(x + bwReal / 2).toFixed(1)}" y="${(Y(p.y) - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="${INDIGO}">${esc(format(p.y))}</text>` +
      `<text x="${(x + bwReal / 2).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(p.x)}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart">${grid}${bars}</svg>`;
}

/** Horizontal bars for one metric across named items. items: [{name, value}]. */
export function hbars(items, { format = (v) => String(v), highlight = null } = {}) {
  const max = Math.max(...items.map((i) => i.value));
  return items.map((i) => {
    const pct = max === 0 ? 0 : (i.value / max) * 100;
    const cls = i.name === highlight ? 'bf alt' : 'bf';
    return `<div class="bars-row"><span class="bl">${esc(i.name)}</span>` +
      `<span class="bt"><span class="${cls}" style="display:block;width:${pct.toFixed(1)}%"></span></span>` +
      `<span class="bv">${esc(format(i.value))}</span></div>`;
  }).join('');
}

export { INDIGO, VERMILION, TEAL };
