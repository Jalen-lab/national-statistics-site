// Japan by Numbers — page renderers. Each view is a function of the data in
// data.js and the charts in charts.js; main.js calls one per hash route and
// wires up the controls the view declares (data-action attributes).

import {
  AGE_GROUPS, AGE_PYRAMID, COMPARE_SOURCE, COUNTRIES, DEMOGRAPHICS, ECONOMY_CARDS,
  GDP_PER_CAPITA_SERIES, GDP_SERIES, HEADLINE, INFLATION_SERIES, POPULATION_SERIES,
  POPULATION_SOURCE, PREFECTURES, PREFECTURE_SOURCE, RELEASES, UNEMPLOYMENT_SERIES,
} from './data.js';
import { barChart, hbars, lineChart } from './charts.js';

const fmtInt = (v) => v.toLocaleString('en-US');
const fmtMoney = (v) => `$${fmtInt(v)}`;

function kpis() {
  return `<div class="kpis">${HEADLINE.map((k) =>
    `<div class="kpi"><div class="v">${k.value}</div><div class="l">${k.label}</div><div class="s">${k.sub}</div></div>`).join('')}</div>`;
}

function sourceLine(text) {
  return `<p class="src">Source: ${text}</p>`;
}

export function overview() {
  return `<h1>Japan in numbers</h1>
  <p class="lede">One country, measured: how many people live in Japan, how its economy has moved since 2010, where its people live, and how it compares with the world. Every figure names its source and year.</p>
  ${kpis()}
  <div class="grid2">
    <section class="card"><h3>Population is shrinking — slowly</h3>
      ${lineChart(POPULATION_SERIES.map((p) => ({ x: String(p.year), y: p.pop })), { format: (v) => `${v}m` })}
      <p class="note">Total population peaked at 128.1 million in 2010 and stood at 124.0 million in 2024.</p>
      ${sourceLine(POPULATION_SOURCE)}
      <p><a href="#/population">Population in detail &rarr;</a></p>
    </section>
    <section class="card"><h3>The economy in one chart</h3>
      ${barChart(GDP_SERIES.map((p) => ({ x: String(p.year), y: p.gdp })), { format: (v) => `$${v}tn`, highlightLast: true })}
      <p class="note">Nominal GDP was $4.03 trillion in 2024 — the world's fourth largest, after the United States, China and Germany.</p>
      ${sourceLine('IMF World Economic Outlook, October 2025')}
      <p><a href="#/economy">Economy in detail &rarr;</a></p>
    </section>
  </div>
  <h2>Latest releases</h2>
  <div class="card">${RELEASES.map((r) =>
    `<div class="release"><div><b>${r.title}</b><br><span class="note">${r.org}</span></div><span class="when">${r.when}</span></div>`).join('')}
  </div>
  <p><a href="#/compare">See how Japan compares with nine other countries &rarr;</a></p>`;
}

export function population() {
  return `<h1>Population</h1>
  <p class="lede">Japan's population peaked in 2010 and has fallen every year since, while the share of older people keeps rising. The 2024 estimate is 124.0 million.</p>
  <section class="card"><h3>Total population, 1970–2024 (millions)</h3>
    ${lineChart(POPULATION_SERIES.map((p) => ({ x: String(p.year), y: p.pop })), { format: (v) => `${v}m` })}
    ${sourceLine(POPULATION_SOURCE)}
  </section>
  <div class="grid2">
    <section class="card"><h3>Who lives here, by age</h3>
      ${hbars(AGE_GROUPS.map((g) => ({ name: g.group, value: g.share })), { format: (v) => `${v}%`, highlight: '65+' })}
      <p class="note">Almost three in ten people in Japan are 65 or older — the highest share of any large country.</p>
      ${sourceLine('Statistics Bureau of Japan, Population Estimates, 2024')}
    </section>
    <section class="card"><h3>Births, ageing and long lives</h3>
      ${DEMOGRAPHICS.map((d) => `<p><b>${d.value}</b> — ${d.label.toLowerCase()} <span class="note">(${d.detail}; ${d.source})</span></p>`).join('')}
    </section>
  </div>
  <section class="card"><h3>Population by 5-year age band, 2023 (millions, approx.)</h3>
    ${hbars(AGE_PYRAMID.map((a) => ({ name: a.band, value: a.pop })), { format: (v) => `${v}m` })}
    ${sourceLine('Statistics Bureau of Japan, Population Estimates, 2023 (bands rounded)')}
  </section>
  <h2>Where people live</h2>
  <p class="lede">The twelve largest prefectures hold about two-thirds of the population. Search the table, or click a column heading to sort it.</p>
  <div class="toolbar"><label for="pref-search">Search</label>
    <input type="search" id="pref-search" placeholder="e.g. Osaka" data-action="pref-search">
    <span class="note" id="pref-count"></span>
  </div>
  <div class="card"><table id="pref-table">
    <thead><tr>
      <th><button data-action="pref-sort" data-key="name">Prefecture ↕</button></th>
      <th class="num"><button data-action="pref-sort" data-key="pop">Population (m) ↕</button></th>
      <th class="num"><button data-action="pref-sort" data-key="area">Area (km²) ↕</button></th>
      <th class="num"><button data-action="pref-sort" data-key="density">Density (/km²) ↕</button></th>
    </tr></thead>
    <tbody id="pref-body"></tbody>
  </table>
  ${sourceLine(PREFECTURE_SOURCE)}
  </div>`;
}

const ECONOMY_TABS = [
  { key: 'gdp', label: 'GDP ($tn)', series: GDP_SERIES, get: (p) => p.gdp, format: (v) => `$${v}tn`, chart: 'bar', source: 'IMF World Economic Outlook, October 2025' },
  { key: 'gdppc', label: 'GDP per person ($)', series: GDP_PER_CAPITA_SERIES, get: (p) => p.value, format: fmtMoney, chart: 'bar', source: 'IMF World Economic Outlook, October 2025' },
  { key: 'unemp', label: 'Unemployment (%)', series: UNEMPLOYMENT_SERIES, get: (p) => p.value, format: (v) => `${v}%`, chart: 'line', source: 'Statistics Bureau of Japan, Labour Force Survey' },
  { key: 'infl', label: 'Inflation (%)', series: INFLATION_SERIES, get: (p) => p.value, format: (v) => `${v}%`, chart: 'line', source: 'Statistics Bureau of Japan, Consumer Price Index' },
];

export function economy(activeTab = 'gdp') {
  const tab = ECONOMY_TABS.find((t) => t.key === activeTab) ?? ECONOMY_TABS[0];
  const points = tab.series.map((p) => ({ x: String(p.year), y: tab.get(p) }));
  const chart = tab.chart === 'bar'
    ? barChart(points, { format: tab.format, highlightLast: true })
    : lineChart(points, { format: tab.format, ymin: tab.key === 'infl' ? -1 : 0 });
  return `<h1>Economy</h1>
  <p class="lede">Japan is the world's fourth-largest economy. Nominal GDP has fallen in dollar terms since 2012 as the yen weakened, while unemployment stayed low and inflation returned in 2024.</p>
  <div class="kpis">${ECONOMY_CARDS.map((c) =>
    `<div class="kpi"><div class="v">${c.value}</div><div class="l">${c.label}</div><div class="s">${c.detail} · ${c.source}</div></div>`).join('')}</div>
  <section class="card"><h3 id="econ-title">${tab.label}, ${tab.series[0].year}–${tab.series[tab.series.length - 1].year}</h3>
    <div class="tabs" role="group" aria-label="Choose an indicator">
      ${ECONOMY_TABS.map((t) => `<button data-action="econ-tab" data-key="${t.key}" aria-pressed="${t.key === tab.key}">${t.label}</button>`).join('')}
    </div>
    <div id="econ-chart">${chart}</div>
    ${sourceLine(tab.source)}
  </section>
  <div class="callout"><b>Reading the dollar figures:</b> Japan's GDP in yen grew in 2024; in dollars it fell, because the yen was weaker against the dollar. Real GDP growth — output after inflation — was −0.2% in 2024 (Cabinet Office, National Accounts).</div>`;
}

export function compare(metric = 'gdpPc') {
  return `<h1>Japan and the world</h1>
  <p class="lede">Ten large economies, 2024. Japan has the world's fourth-largest economy, the highest life expectancy of the ten, and a middling GDP per person. Click a column heading to sort.</p>
  <div class="toolbar"><label for="cmp-metric">Chart shows</label>
    <select id="cmp-metric" data-action="cmp-metric">
      <option value="gdpPc" ${metric === 'gdpPc' ? 'selected' : ''}>GDP per person ($)</option>
      <option value="gdp" ${metric === 'gdp' ? 'selected' : ''}>GDP ($tn)</option>
      <option value="pop" ${metric === 'pop' ? 'selected' : ''}>Population (m)</option>
      <option value="life" ${metric === 'life' ? 'selected' : ''}>Life expectancy (yrs)</option>
    </select>
  </div>
  <section class="card"><div id="cmp-chart"></div>
    ${sourceLine(COMPARE_SOURCE)}
  </section>
  <div class="card"><table id="cmp-table">
    <thead><tr>
      <th><button data-action="cmp-sort" data-key="name">Country ↕</button></th>
      <th class="num"><button data-action="cmp-sort" data-key="pop">Population (m) ↕</button></th>
      <th class="num"><button data-action="cmp-sort" data-key="gdp">GDP ($tn) ↕</button></th>
      <th class="num"><button data-action="cmp-sort" data-key="gdpPc">GDP per person ($) ↕</button></th>
      <th class="num"><button data-action="cmp-sort" data-key="life">Life expectancy ↕</button></th>
    </tr></thead>
    <tbody id="cmp-body"></tbody>
  </table></div>`;
}

export function sources() {
  const all = [
    ['Statistics Bureau of Japan', 'Population Census; Population Estimates (Oct 2024); Labour Force Survey (2024); Consumer Price Index (2024 annual average)', 'Population, unemployment, prices'],
    ['Cabinet Office', 'National Accounts, 2024 (second preliminary)', 'Real GDP growth'],
    ['Ministry of Health, Labour and Welfare', 'Vital Statistics, 2023; life tables, 2023', 'Births, fertility, life expectancy'],
    ['Geospatial Information Authority of Japan', 'Prefectural areas', 'Prefecture areas'],
    ['International Monetary Fund', 'World Economic Outlook, October 2025', 'GDP, GDP per person, government debt'],
    ['World Bank', 'World Development Indicators, 2024', 'Life expectancy'],
    ['United Nations', 'World Population Prospects, 2024', 'Median age'],
    ['UN Comtrade', 'Trade statistics, 2024', 'Exports and imports of goods'],
  ];
  return `<h1>Sources &amp; method</h1>
  <p class="lede">Every figure on this site comes from a named public source. Figures are rounded for reading; percentages and densities are computed from the published figures shown.</p>
  <h2>Where each figure comes from</h2>
  <div class="card"><table>
    <thead><tr><th>Publisher</th><th>Publication</th><th>Used for</th></tr></thead>
    <tbody>${all.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>
  </table></div>
  <h2>Method notes</h2>
  <ul class="tight">
    <li><b>Years.</b> Each figure is labelled with its year. Population is the 1 October estimate (2024) or the census (1970–2020); economic figures are calendar 2024.</li>
    <li><b>Dollars.</b> GDP and trade are in US dollars at market exchange rates, as the IMF and UN Comtrade publish them. A weaker yen lowers Japan's dollar GDP even when yen GDP grows.</li>
    <li><b>Rounding.</b> Populations are shown to one decimal place in millions; age-band figures for 2023 are rounded and marked approx.</li>
    <li><b>Density.</b> Prefecture density is population divided by the prefecture's land area.</li>
    <li><b>Nothing fetched.</b> The site loads no data from the network. All figures are in its own files, so it works offline.</li>
  </ul>
  <h2>About this site</h2>
  <p>Japan by Numbers is an independent presentation of public statistics, built as a single static site. It is not affiliated with the Statistics Bureau of Japan or any government body. If a figure looks wrong, check the named publication — that is what the source lines are for.</p>`;
}

export function missing() {
  return `<h1>Page not found</h1>
  <p class="lede">There is no page at this address. Try one of the sections above, or start again from the <a href="#/">overview</a>.</p>`;
}

export { COUNTRIES, ECONOMY_TABS, PREFECTURES };
