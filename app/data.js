// Japan by Numbers — every figure below is a real published statistic.
// Sources and years travel with the numbers so the site can show them.
// Figures are rounded; see the Sources page for the full list.

// Headline indicators, 2024 unless noted.
export const HEADLINE = [
  { label: 'Population', value: '124.0m', sub: 'Total population, 2024', source: 'Statistics Bureau of Japan, Population Estimates, Oct 2024' },
  { label: 'GDP', value: '$4.03tn', sub: 'Nominal GDP, 2024', source: 'IMF World Economic Outlook, Oct 2025' },
  { label: 'GDP per person', value: '$32,481', sub: 'Nominal, 2024', source: 'IMF World Economic Outlook, Oct 2025' },
  { label: 'Unemployment', value: '2.5%', sub: 'Annual average, 2024', source: 'Statistics Bureau of Japan, Labour Force Survey, 2024' },
  { label: 'Life expectancy', value: '84.0 yrs', sub: 'At birth, 2023', source: 'World Bank, World Development Indicators, 2024' },
  { label: 'Median age', value: '49.4 yrs', sub: '2024', source: 'UN World Population Prospects, 2024' },
];

// Total population, millions. Census years 1970-2020, estimate for 2024.
export const POPULATION_SERIES = [
  { year: 1970, pop: 104.3 }, { year: 1980, pop: 117.1 }, { year: 1990, pop: 123.6 },
  { year: 2000, pop: 126.9 }, { year: 2010, pop: 128.1 }, { year: 2015, pop: 127.1 },
  { year: 2020, pop: 126.1 }, { year: 2024, pop: 124.0 },
];
export const POPULATION_SOURCE = 'Statistics Bureau of Japan, Population Census and Population Estimates';

// Age structure, 2024, share of population.
export const AGE_GROUPS = [
  { group: '0–14', share: 11.6 },
  { group: '15–64', share: 59.5 },
  { group: '65+', share: 28.9 },
];

// Population by 5-year age band, millions, 2023 (approx., rounded).
export const AGE_PYRAMID = [
  { band: '0–4', pop: 3.9 }, { band: '5–9', pop: 4.8 }, { band: '10–14', pop: 5.2 },
  { band: '15–19', pop: 5.5 }, { band: '20–24', pop: 6.2 }, { band: '25–29', pop: 6.6 },
  { band: '30–34', pop: 7.0 }, { band: '35–39', pop: 7.5 }, { band: '40–44', pop: 8.2 },
  { band: '45–49', pop: 9.0 }, { band: '50–54', pop: 8.9 }, { band: '55–59', pop: 8.0 },
  { band: '60–64', pop: 7.4 }, { band: '65–69', pop: 7.9 }, { band: '70–74', pop: 9.0 },
  { band: '75–79', pop: 8.1 }, { band: '80–84', pop: 6.2 }, { band: '85+', pop: 6.0 },
];
export const DEMOGRAPHICS = [
  { label: 'Total fertility rate', value: '1.20', detail: 'children per woman, 2023', source: 'Ministry of Health, Labour and Welfare, Vital Statistics, 2023' },
  { label: 'Births', value: '727,277', detail: 'live births, 2023 — the lowest on record', source: 'Ministry of Health, Labour and Welfare, Vital Statistics, 2023' },
  { label: 'Life expectancy, women', value: '87.1 yrs', detail: 'at birth, 2023', source: 'Ministry of Health, Labour and Welfare, 2023' },
  { label: 'Life expectancy, men', value: '81.1 yrs', detail: 'at birth, 2023', source: 'Ministry of Health, Labour and Welfare, 2023' },
  { label: 'Share aged 65+', value: '28.9%', detail: 'of the population, 2024', source: 'Statistics Bureau of Japan, Population Estimates, 2024' },
  { label: 'Share aged 75+', value: '16.3%', detail: 'of the population, 2024', source: 'Statistics Bureau of Japan, Population Estimates, 2024' },
];

// Economy: nominal GDP in $ trillion (IMF WEO, Oct 2025).
export const GDP_SERIES = [
  { year: 2010, gdp: 5.76 }, { year: 2012, gdp: 6.27 }, { year: 2014, gdp: 4.90 },
  { year: 2016, gdp: 5.00 }, { year: 2018, gdp: 5.04 }, { year: 2020, gdp: 5.06 },
  { year: 2022, gdp: 4.26 }, { year: 2024, gdp: 4.03 },
];
export const GDP_PER_CAPITA_SERIES = [
  { year: 2010, value: 45083 }, { year: 2015, value: 34930 }, { year: 2020, value: 40182 },
  { year: 2024, value: 32481 },
];
export const UNEMPLOYMENT_SERIES = [
  { year: 2010, value: 5.1 }, { year: 2015, value: 3.4 }, { year: 2020, value: 2.8 },
  { year: 2024, value: 2.5 },
];
export const INFLATION_SERIES = [
  { year: 2010, value: -0.7 }, { year: 2015, value: 0.8 }, { year: 2020, value: 0.0 },
  { year: 2024, value: 2.7 },
];
export const ECONOMY_CARDS = [
  { label: 'Exports of goods', value: '$698bn', detail: '2024', source: 'UN Comtrade, 2024' },
  { label: 'Imports of goods', value: '$731bn', detail: '2024', source: 'UN Comtrade, 2024' },
  { label: 'General gov. gross debt', value: '255% of GDP', detail: '2024', source: 'IMF World Economic Outlook, Oct 2025' },
  { label: 'Real GDP growth', value: '-0.2%', detail: '2024', source: 'Cabinet Office, National Accounts, 2024' },
];

// Largest prefectures: population (millions, 2024 est.) and area (km2).
export const PREFECTURES = [
  { name: 'Tokyo', pop: 14.15, area: 2194 },
  { name: 'Kanagawa', pop: 9.24, area: 2416 },
  { name: 'Osaka', pop: 8.81, area: 1905 },
  { name: 'Aichi', pop: 7.48, area: 5173 },
  { name: 'Saitama', pop: 7.34, area: 3798 },
  { name: 'Chiba', pop: 6.28, area: 5157 },
  { name: 'Hyogo', pop: 5.39, area: 8401 },
  { name: 'Fukuoka', pop: 5.10, area: 4987 },
  { name: 'Hokkaido', pop: 5.09, area: 83424 },
  { name: 'Shizuoka', pop: 3.52, area: 7777 },
  { name: 'Ibaraki', pop: 2.84, area: 6097 },
  { name: 'Kyoto', pop: 2.57, area: 4613 },
];
export const PREFECTURE_SOURCE = 'Statistics Bureau of Japan, Population Estimates by prefecture, 2024; areas from the Geospatial Information Authority of Japan';

// World comparison, 2024 (IMF WEO Oct 2025; life expectancy: World Bank WDI 2024).
export const COUNTRIES = [
  { name: 'United States', pop: 340.1, gdp: 29.18, gdpPc: 85809, life: 78.4 },
  { name: 'China', pop: 1408.9, gdp: 18.74, gdpPc: 13303, life: 78.6 },
  { name: 'Germany', pop: 84.5, gdp: 4.66, gdpPc: 55726, life: 80.9 },
  { name: 'Japan', pop: 124.0, gdp: 4.03, gdpPc: 32481, life: 84.0 },
  { name: 'India', pop: 1450.9, gdp: 3.91, gdpPc: 2698, life: 67.7 },
  { name: 'United Kingdom', pop: 69.2, gdp: 3.59, gdpPc: 51810, life: 79.2 },
  { name: 'France', pop: 68.4, gdp: 3.05, gdpPc: 44632, life: 82.9 },
  { name: 'Brazil', pop: 212.0, gdp: 2.17, gdpPc: 10243, life: 76.4 },
  { name: 'Canada', pop: 40.0, gdp: 2.24, gdpPc: 55522, life: 81.8 },
  { name: 'Australia', pop: 27.0, gdp: 1.79, gdpPc: 66405, life: 83.7 },
];
export const COMPARE_SOURCE = 'IMF World Economic Outlook, October 2025; World Bank World Development Indicators, 2024';

// Recent statistical releases (real publications).
export const RELEASES = [
  { title: 'Population Estimates, October 2024', org: 'Statistics Bureau of Japan', when: 'Oct 2024' },
  { title: 'Labour Force Survey, annual average 2024', org: 'Statistics Bureau of Japan', when: 'Jan 2025' },
  { title: 'Consumer Price Index, 2024 annual average', org: 'Statistics Bureau of Japan', when: 'Jan 2025' },
  { title: 'National Accounts, 2024 (second preliminary)', org: 'Cabinet Office', when: 'Mar 2025' },
  { title: 'Vital Statistics, 2023', org: 'Ministry of Health, Labour and Welfare', when: 'Sep 2024' },
  { title: 'World Economic Outlook, October 2025', org: 'International Monetary Fund', when: 'Oct 2025' },
];
