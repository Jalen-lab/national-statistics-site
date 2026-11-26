// Japan by Numbers — router and controls. Hash routes, no network:
//   #/                overview
//   #/population      population, prefectures (search + sort)
//   #/economy         economy (indicator tabs)
//   #/compare         world comparison (sort + chart metric)
//   #/sources         sources and method
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { COUNTRIES, PREFECTURES } from './data.js';
import { ECONOMY_TABS, compare, economy, missing, overview, population, sources } from './views.js';
import { hbars } from './charts.js';

const app = document.getElementById('app');
const fmtInt = (v) => v.toLocaleString('en-US');
const fmtMoney = (v) => `$${fmtInt(v)}`;

// ---- state kept while the page is open ------------------------------------
let econTab = 'gdp';
let prefSort = { key: 'pop', dir: -1 };
let prefQuery = '';
let cmpSort = { key: 'gdpPc', dir: -1 };
let cmpMetric = 'gdpPc';

const CMP_LABELS = {
  gdpPc: { label: 'GDP per person, 2024 ($)', format: fmtMoney },
  gdp: { label: 'GDP, 2024 ($tn)', format: (v) => `$${v}tn` },
  pop: { label: 'Population, 2024 (millions)', format: (v) => `${v}m` },
  life: { label: 'Life expectancy, 2023 (years)', format: (v) => `${v} yrs` },
};

function sortRows(rows, key, dir) {
  return [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (typeof av === 'string') return dir * av.localeCompare(bv);
    return dir * (av - bv);
  });
}

// ---- prefecture table -------------------------------------------------------
function renderPrefectures() {
  const body = document.getElementById('pref-body');
  const count = document.getElementById('pref-count');
  if (!body) return;
  const q = prefQuery.trim().toLowerCase();
  const rows = PREFECTURES
    .map((p) => ({ ...p, density: Math.round((p.pop * 1e6) / p.area) }))
    .filter((p) => !q || p.name.toLowerCase().includes(q));
  const sorted = sortRows(rows, prefSort.key, prefSort.dir);
  body.innerHTML = sorted.map((p) =>
    `<tr><td>${p.name}</td><td class="num">${p.pop.toFixed(2)}</td>` +
    `<td class="num">${fmtInt(p.area)}</td><td class="num">${fmtInt(p.density)}</td></tr>`).join('') ||
    `<tr><td colspan="4">No prefecture matches “${prefQuery}”.</td></tr>`;
  if (count) count.textContent = `${rows.length} of ${PREFECTURES.length} prefectures shown`;
}

// ---- comparison table + chart ----------------------------------------------
function renderCompare() {
  const body = document.getElementById('cmp-body');
  const chart = document.getElementById('cmp-chart');
  if (!body) return;
  const sorted = sortRows(COUNTRIES, cmpSort.key, cmpSort.dir);
  body.innerHTML = sorted.map((c) =>
    `<tr${c.name === 'Japan' ? ' class="hl"' : ''}><td>${c.name}</td>` +
    `<td class="num">${c.pop.toFixed(1)}</td><td class="num">${c.gdp.toFixed(2)}</td>` +
    `<td class="num">${fmtInt(c.gdpPc)}</td><td class="num">${c.life.toFixed(1)}</td></tr>`).join('');
  if (chart) {
    const meta = CMP_LABELS[cmpMetric];
    const short = { 'United States': 'USA', 'United Kingdom': 'UK' };
    const items = [...COUNTRIES].sort((a, b) => b[cmpMetric] - a[cmpMetric])
      .map((c) => ({ name: short[c.name] ?? c.name, value: c[cmpMetric] }));
    chart.innerHTML = `<h3>${meta.label}</h3>` +
      hbars(items, { format: meta.format, highlight: 'Japan' });
  }
}

// ---- router ------------------------------------------------------------------
function route() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const [, page] = hash.match(/^#\/([^/?]*)/) || [];
  let html;
  if (page === '' || page === undefined) html = overview();
  else if (page === 'population') html = population();
  else if (page === 'economy') html = economy(econTab);
  else if (page === 'compare') html = compare(cmpMetric);
  else if (page === 'sources') html = sources();
  else html = missing();
  app.innerHTML = html;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const key = a.getAttribute('data-nav');
    a.classList.toggle('active', (page === '' || page === undefined ? 'overview' : page) === key);
  });
  document.title = {
    overview: 'Japan by Numbers — National Statistics',
    population: 'Population | Japan by Numbers',
    economy: 'Economy | Japan by Numbers',
    compare: 'Japan and the world | Japan by Numbers',
    sources: 'Sources & method | Japan by Numbers',
  }[page === '' || page === undefined ? 'overview' : page] ?? 'Japan by Numbers';
  renderPrefectures();
  renderCompare();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// ---- controls (one delegated listener for the whole site) --------------------
document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.getAttribute('data-action');
  if (action === 'econ-tab') {
    econTab = el.getAttribute('data-key');
    const tab = ECONOMY_TABS.find((t) => t.key === econTab);
    const points = tab.series.map((p) => ({ x: String(p.year), y: tab.get(p) }));
    document.getElementById('econ-title').textContent =
      `${tab.label}, ${tab.series[0].year}–${tab.series[tab.series.length - 1].year}`;
    document.querySelectorAll('[data-action="econ-tab"]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b === el)));
    // Rebuild the chart by re-rendering the economy view, keeping the tab.
    app.innerHTML = economy(econTab);
    renderPrefectures();
    renderCompare();
  } else if (action === 'pref-sort') {
    const key = el.getAttribute('data-key');
    prefSort = prefSort.key === key
      ? { key, dir: -prefSort.dir }
      : { key, dir: key === 'name' ? 1 : -1 };
    renderPrefectures();
  } else if (action === 'cmp-sort') {
    const key = el.getAttribute('data-key');
    cmpSort = cmpSort.key === key
      ? { key, dir: -cmpSort.dir }
      : { key, dir: key === 'name' ? 1 : -1 };
    renderCompare();
  }
});

document.addEventListener('input', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  if (el.getAttribute('data-action') === 'pref-search') {
    prefQuery = el.value;
    const pos = el.selectionStart;
    renderPrefectures();
    // Re-focus the search box after the table re-renders (the input survives:
    // renderPrefectures only rewrites the tbody, so focus is kept).
    el.focus();
    el.setSelectionRange(pos, pos);
  }
});

document.addEventListener('change', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  if (el.getAttribute('data-action') === 'cmp-metric') {
    cmpMetric = el.value;
    renderCompare();
  }
});

window.addEventListener('hashchange', route);
route();
