// GM Masterplans Twin — MapLibre + turf, no API keys.
// Data: data/schemes.geojson (WGS84). Boundaries are indicative.

const OMT = { type: 'vector', url: 'https://tiles.openfreemap.org/planet' };
const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';
// Blueprint: monochrome blue "GIS" style built on OpenMapTiles
const BLUEPRINT = {
  version: 8, glyphs: GLYPHS, sources: { openmaptiles: OMT },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': '#061224' } },
    { id: 'park', type: 'fill', source: 'openmaptiles', 'source-layer': 'park', paint: { 'fill-color': '#0b1f3a', 'fill-opacity': 0.8 } },
    { id: 'landuse', type: 'fill', source: 'openmaptiles', 'source-layer': 'landuse', filter: ['in', 'class', 'industrial', 'commercial', 'railway'], paint: { 'fill-color': '#0a1a30' } },
    { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', paint: { 'fill-color': '#0e2f57' } },
    { id: 'waterway', type: 'line', source: 'openmaptiles', 'source-layer': 'waterway', paint: { 'line-color': '#1f5c9c', 'line-width': 1.2 } },
    { id: 'bld', type: 'fill', source: 'openmaptiles', 'source-layer': 'building', minzoom: 12, paint: { 'fill-color': '#10305a', 'fill-outline-color': '#2a63a8', 'fill-opacity': 0.9 } },
    { id: 'rail', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['==', 'class', 'rail'], paint: { 'line-color': '#7fb3ff', 'line-width': 1, 'line-dasharray': [4, 3], 'line-opacity': 0.7 } },
    { id: 'road-minor', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['in', 'class', 'minor', 'service', 'tertiary', 'path', 'track'], paint: { 'line-color': '#2f6fc0', 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.4, 16, 1.6], 'line-opacity': 0.8 } },
    { id: 'road-major', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'], paint: { 'line-color': '#4da3ff', 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.6, 12, 1.6, 16, 4] } },
    { id: 'road-label', type: 'symbol', source: 'openmaptiles', 'source-layer': 'transportation_name', minzoom: 14, layout: { 'symbol-placement': 'line', 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': 10 }, paint: { 'text-color': '#9ec5ff', 'text-halo-color': '#061224', 'text-halo-width': 1 } },
    { id: 'place-label', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', layout: { 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': ['interpolate', ['linear'], ['zoom'], 8, 10, 14, 13], 'text-transform': 'uppercase', 'text-letter-spacing': 0.08 }, paint: { 'text-color': '#bcd6ff', 'text-halo-color': '#061224', 'text-halo-width': 1.2 } }
  ]
};
const STYLES = {
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  positron: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
  fiord: 'https://tiles.openfreemap.org/styles/fiord',
  black: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  blueprint: BLUEPRINT,
  satellite: {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
      esri: {
        type: 'raster', tileSize: 256, maxzoom: 19,
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        attribution: 'Esri, Maxar, Earthstar Geographics'
      }
    },
    layers: [{ id: 'esri', type: 'raster', source: 'esri' }]
  }
};

const ACCENT = '#5ACDFF';
// per-basemap colours for our overlays
const THEME = {
  liberty:   { text: '#1c2230', halo: '#ffffff', bld: '#c9ced8' },
  positron:  { text: '#1c2230', halo: '#ffffff', bld: '#d9dde3' },
  dark:      { text: '#e6e9ef', halo: '#0b0d12', bld: '#2a3140' },
  fiord:     { text: '#e6e9ef', halo: '#0b0d12', bld: '#33415a' },
  black:     { text: '#e6e9ef', halo: '#000000', bld: '#262a33' },
  blueprint: { text: '#dbe9ff', halo: '#061224', bld: '#1b4f8c' },
  satellite: { text: '#ffffff', halo: '#0b0d12', bld: '#3a3f4b' }
};
const CAT_COLOR = {
  housing: '#f4a261', mixed: '#2a9d8f', employment: '#6c8cff',
  framework: '#c77dff', infrastructure: '#94a3b8', civic: '#e76f51'
};
const CAT_LABEL = {
  housing: 'Housing-led', mixed: 'Mixed use', employment: 'Employment',
  framework: 'Framework / MDC', infrastructure: 'Infrastructure', civic: 'Civic / health'
};
const STATUS_ORDER = ['on-site', 'consented', 'framework', 'proposed', 'at-risk', 'delivered'];
const STATUS_LABEL = {
  'on-site': 'On site', consented: 'Consented', framework: 'Framework', proposed: 'Proposed',
  'at-risk': 'At risk', delivered: 'Delivered'
};
const STAGE_LABEL = { framework: 'Framework', consent: 'Consent', start: 'On site', delivery: 'Delivered', complete: 'Complete', target: 'Target' };
const STAGE_COLOR = { framework: '#c77dff', consent: '#4FA6C8', start: '#5ACDFF', delivery: '#f4a261', complete: '#a1a4a5', target: '#464a4d' };
const PITCH_HA = 0.714; // FIFA 105×68 m

const GM_BOUNDS = [[-2.75, 53.33], [-1.95, 53.68]];
let initialStyle = 'black';
try { const saved = localStorage.getItem('ud-gm-style'); if (saved && saved !== 'satellite') initialStyle = saved; } catch {}
const state = {
  data: null, features: [], filtered: [], selected: null, style: initialStyle,
  borough: new Set(), status: new Set(), cat: new Set(), q: '', tour: null, gantt: false,
  year: null, playing: null, brush: null, ext: null
};

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const fmt = (n) => n == null ? '—' : n.toLocaleString('en-GB');
const isPoly = (f) => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 'YYYY' or 'YYYY-MM' → decimal year (mid-month / mid-year)
const yr = (d) => { const [y, m] = String(d).split('-').map(Number); return m ? y + (m - 0.5) / 12 : y + 0.5; };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (d) => { const [y, m] = String(d).split('-'); return m ? `${MONTHS[+m - 1]} ${y}` : y; };
const asOfYear = () => yr(state.data.meta.asOf.slice(0, 7));
// stage a scheme had reached by decimal year y (null = not started)
const stageAt = (p, y) => { let st = null; for (const e of p.timeline) { if (yr(e.date) <= y) st = e.stage; else break; } return st; };
const fmtYear = (y) => { const yy = Math.floor(y), m = Math.floor((y - yy) * 12); return `${MONTHS[m]} ${yy}`; };

// ---------- data ----------
async function loadData() {
  const r = await fetch('data/schemes.geojson');
  const gj = await r.json();
  gj.features.forEach((f) => {
    const p = f.properties;
    p.computed_area_ha = isPoly(f) ? turf.area(f) / 10000 : null;
    p.area_ha = p.stated_area_ha ?? (p.computed_area_ha ? Math.round(p.computed_area_ha) : null);
    const c = turf.centroid(f).geometry.coordinates;
    p.centroid = c;
    p.bbox = isPoly(f) ? turf.bbox(f) : null;
    p.search = [p.name, p.borough, p.lead, p.architects, p.summary, p.commercial].join(' ').toLowerCase();
    p.timeline = (p.timeline || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    p.t0 = p.timeline.length ? yr(p.timeline[0].date) : null;
    p.t1 = p.timeline.length ? yr(p.timeline[p.timeline.length - 1].date) : null;
  });
  state.data = gj;
  state.features = gj.features;
  $('#asof').textContent = `${gj.features.length} schemes · status ${gj.meta.asOf}`;
  const t0 = gj.features.map((f) => f.properties.t0).filter((v) => v != null), t1 = gj.features.map((f) => f.properties.t1).filter((v) => v != null);
  state.ext = { Y0: Math.floor(Math.min(...t0)), Y1: Math.ceil(Math.max(...t1, asOfYear())) + 1 };
}

const withStage = (p) => ({ ...p, ystage: state.year == null ? '' : (stageAt(p, state.year) || 'none') });
function pointsFC() {
  return { type: 'FeatureCollection', features: state.filtered.map((f) => ({
    type: 'Feature', properties: withStage(f.properties), geometry: { type: 'Point', coordinates: f.properties.centroid }
  })) };
}
function polysFC() {
  return { type: 'FeatureCollection', features: state.filtered.filter(isPoly).map((f) => ({ ...f, properties: withStage(f.properties) })) };
}

// ---------- map ----------
const map = new maplibregl.Map({
  container: 'map', style: STYLES[initialStyle] || STYLES.black, center: [-2.245, 53.48], zoom: 10.6, pitch: 0, bearing: 0,
  maxPitch: 70, attributionControl: { compact: true }, hash: false
});
window.__map = map;
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right');

const OUR_LAYERS = ['bld-3d', 'poly-fill', 'poly-line', 'poly-line-dash', 'poly-sel', 'pt-halo', 'pt', 'pt-sel', 'labels'];
function addLayers() {
  // style.load can fire more than once per style; rebuild our overlay from scratch each time
  OUR_LAYERS.forEach((id) => map.getLayer(id) && map.removeLayer(id));
  if (!map.getSource('polys')) map.addSource('polys', { type: 'geojson', data: polysFC() });
  if (!map.getSource('points')) map.addSource('points', { type: 'geojson', data: pointsFC() });
  const catColor = ['match', ['get', 'category'], ...Object.entries(CAT_COLOR).flat(), '#888'];

  // 3D buildings from whichever OpenMapTiles-schema vector source the style carries
  const vecSrc = ['openmaptiles', 'carto'].find((id) => map.getSource(id));
  if (vecSrc && !map.getLayer('bld-3d')) {
    const labelLayer = map.getStyle().layers.find((l) => l.type === 'symbol' && l.layout?.['text-field'])?.id;
    map.addLayer({
      id: 'bld-3d', type: 'fill-extrusion', source: vecSrc, 'source-layer': 'building', minzoom: 13,
      paint: {
        'fill-extrusion-color': THEME[state.style].bld,
        'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': 0.75
      }
    }, labelLayer);
    ['building-3d', 'bld', 'building', 'building-top'].forEach((id) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', 'none'));
  }

  map.addLayer({ id: 'poly-fill', type: 'fill', source: 'polys', paint: { 'fill-color': catColor, 'fill-opacity': 0.22 } });
  const partial = ['in', ['get', 'confidence'], ['literal', ['boundary-indicative', 'srf-illustrative', 'srf-georeferenced-partial']]];
  map.addLayer({ id: 'poly-line', type: 'line', source: 'polys', filter: ['!', partial], paint: { 'line-color': catColor, 'line-width': 2 } });
  map.addLayer({ id: 'poly-line-dash', type: 'line', source: 'polys', filter: partial, paint: { 'line-color': catColor, 'line-width': 2, 'line-dasharray': [3, 2] } });
  map.addLayer({ id: 'poly-sel', type: 'line', source: 'polys', filter: ['==', ['get', 'id'], ''], paint: { 'line-color': ACCENT, 'line-width': 4 } });
  map.addLayer({
    id: 'pt-halo', type: 'circle', source: 'points',
    paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 9, 9, 14, 16], 'circle-color': catColor, 'circle-opacity': 0.25 }
  });
  map.addLayer({
    id: 'pt', type: 'circle', source: 'points',
    paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 9, 4, 14, 7], 'circle-color': catColor, 'circle-stroke-color': THEME[state.style].halo, 'circle-stroke-width': 1.5 }
  });
  map.addLayer({
    id: 'pt-sel', type: 'circle', source: 'points', filter: ['==', ['get', 'id'], ''],
    paint: { 'circle-radius': 11, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': ACCENT, 'circle-stroke-width': 3 }
  });
  map.addLayer({
    id: 'labels', type: 'symbol', source: 'points', minzoom: 10.5,
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': 11, 'text-offset': [0, 1.2], 'text-anchor': 'top', 'text-max-width': 12, 'text-optional': true },
    paint: { 'text-color': THEME[state.style].text, 'text-halo-color': THEME[state.style].halo, 'text-halo-width': 1.5 }
  });
  applyToggles();
  applyTimePaint();
  if (state.selected) highlight(state.selected.properties.id);
}

// ---------- time scrubber ----------
// when a year is set, overlays recolour by the stage reached that year; unstarted schemes fade out
const BASE_PAINT = {
  'poly-fill': { 'fill-opacity': 0.22 }, 'poly-line': { 'line-opacity': 1 }, 'poly-line-dash': { 'line-opacity': 1 },
  'pt-halo': { 'circle-opacity': 0.25 }, 'pt': { 'circle-opacity': 1, 'circle-stroke-opacity': 1 }, 'labels': { 'text-opacity': 1 }
};
function applyTimePaint() {
  if (!map.getLayer('poly-fill')) return;
  const catColor = ['match', ['get', 'category'], ...Object.entries(CAT_COLOR).flat(), '#888'];
  const stageColor = ['match', ['get', 'ystage'], ...Object.entries(STAGE_COLOR).flat(), '#555'];
  const live = state.year == null;
  const color = live ? catColor : stageColor;
  const none = ['==', ['get', 'ystage'], 'none'];
  const dim = (on, off) => (live ? on : ['case', none, off, on]);
  map.setPaintProperty('poly-fill', 'fill-color', color);
  map.setPaintProperty('poly-fill', 'fill-opacity', dim(0.22, 0.03));
  ['poly-line', 'poly-line-dash'].forEach((id) => { map.setPaintProperty(id, 'line-color', color); map.setPaintProperty(id, 'line-opacity', dim(1, 0.15)); });
  map.setPaintProperty('pt-halo', 'circle-color', color);
  map.setPaintProperty('pt-halo', 'circle-opacity', dim(0.25, 0.04));
  map.setPaintProperty('pt', 'circle-color', color);
  map.setPaintProperty('pt', 'circle-opacity', dim(1, 0.12));
  map.setPaintProperty('pt', 'circle-stroke-opacity', dim(1, 0.12));
  map.setPaintProperty('labels', 'text-opacity', dim(1, 0.2));
}

function setYear(y, { fromSlider = false } = {}) {
  state.year = y;
  const live = y == null;
  $('#timebar').classList.toggle('live', live);
  $('#legend').classList.toggle('hidden', !live);
  $('#legend-stage').classList.toggle('hidden', live);
  if (!fromSlider) $('#year').value = live ? Math.round(asOfYear() * 12) : Math.round(y * 12);
  $('#year-label').textContent = live ? `Now · ${state.data.meta.asOf}` : fmtYear(y);
  const started = live ? null : state.filtered.filter((f) => stageAt(f.properties, y)).length;
  $('#year-count').textContent = live ? '' : `${started} / ${state.filtered.length} started`;
  refreshSources();
  applyTimePaint();
  renderList();
  // move the Gantt cursor without a full re-render
  const cur = live ? null : ((y - state.ext.Y0) / (state.ext.Y1 - state.ext.Y0)) * 100;
  document.querySelectorAll('#gantt .gt-cur').forEach((c) => { c.style.left = cur == null ? '' : cur + '%'; c.classList.toggle('hidden', cur == null); });
}

function togglePlay() {
  const btn = $('#btn-play');
  if (state.playing) { clearInterval(state.playing); state.playing = null; btn.textContent = '▶'; btn.classList.remove('running'); return; }
  let y = state.year == null || state.year >= state.ext.Y1 - 1 / 12 ? state.ext.Y0 : state.year;
  btn.textContent = '■'; btn.classList.add('running');
  setYear(y);
  state.playing = setInterval(() => {
    y += 1 / 12;
    if (y >= state.ext.Y1) { togglePlay(); return; }
    setYear(y);
  }, 45);
}

function applyToggles() {
  const vis = (id, on) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
  const p = $('#lyr-polys').checked, m = $('#lyr-points').checked, l = $('#lyr-labels').checked, b = $('#lyr-3d').checked;
  ['poly-fill', 'poly-line', 'poly-line-dash', 'poly-sel'].forEach((id) => vis(id, p));
  ['pt-halo', 'pt', 'pt-sel'].forEach((id) => vis(id, m));
  vis('labels', l); vis('bld-3d', b);
}

function refreshSources() {
  map.getSource('polys')?.setData(polysFC());
  map.getSource('points')?.setData(pointsFC());
}

function setStyle(name) {
  state.style = name;
  $('#basemap').value = name;
  try { localStorage.setItem('ud-gm-style', name); } catch {}
  // diff:false forces a full style reload so 'style.load' fires and our layers are re-added
  map.setStyle(STYLES[name], { diff: false });
}

map.on('style.load', () => { addLayers(); map.resize(); });
new ResizeObserver(() => map.resize()).observe(document.getElementById('map'));
window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id && id !== state.selected?.properties.id) select(id); });
['pt', 'poly-fill'].forEach((id) => {
  map.on('click', id, (e) => { const f = e.features[0]; if (f) select(f.properties.id, { fly: id === 'pt' }); });
  map.on('mouseenter', id, () => (map.getCanvas().style.cursor = 'pointer'));
  map.on('mouseleave', id, () => (map.getCanvas().style.cursor = ''));
});
const hover = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
map.on('mousemove', 'pt', (e) => {
  const p = e.features[0].properties;
  hover.setLngLat(e.lngLat).setHTML(`<b>${esc(p.name)}</b><br>${esc(p.borough)} · ${p.homes ? fmt(+p.homes) + ' homes' : ''} ${p.area_ha ? '· ' + p.area_ha + ' ha' : ''}`).addTo(map);
});
map.on('mouseleave', 'pt', () => hover.remove());

// ---------- selection / fly ----------
function highlight(id) {
  map.getLayer('poly-sel') && map.setFilter('poly-sel', ['==', ['get', 'id'], id || '']);
  map.getLayer('pt-sel') && map.setFilter('pt-sel', ['==', ['get', 'id'], id || '']);
}

function flyTo(f) {
  const p = f.properties;
  if (p.bbox) {
    const w = map.getCanvas().clientWidth;
    const cam = map.cameraForBounds(p.bbox, { padding: { top: 70, bottom: 70, left: 40, right: Math.min(460, Math.round(w * 0.45)) }, maxZoom: 16 });
    map.flyTo({ center: cam.center, zoom: cam.zoom - 0.2, pitch: 55, bearing: -20, duration: 2200, essential: true });
  } else {
    map.flyTo({ center: p.centroid, zoom: 15.4, pitch: 58, bearing: -20, duration: 2200, essential: true });
  }
}

function select(id, { fly = true } = {}) {
  const f = state.features.find((x) => x.properties.id === id);
  if (!f) return;
  state.selected = f;
  highlight(id);
  renderDetail(f);
  document.querySelectorAll('#list li').forEach((li) => li.classList.toggle('sel', li.dataset.id === id));
  document.querySelector(`#list li[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest' });
  document.querySelectorAll('#gantt .gt-row').forEach((r) => r.classList.toggle('sel', r.dataset.id === id));
  document.querySelector('#gantt .gt-row.sel')?.scrollIntoView({ block: 'nearest' });
  history.replaceState(null, '', '#' + id);
  if (fly) flyTo(f);
}

function closeDetail() {
  state.selected = null; highlight(null);
  $('#detail').classList.add('hidden');
  document.querySelectorAll('#list li.sel, #gantt .gt-row.sel').forEach((li) => li.classList.remove('sel'));
  history.replaceState(null, '', location.pathname);
}

// ---------- detail panel ----------
function scaleLine(ha) {
  if (!ha) return '';
  const pitches = ha / PITCH_HA;
  const n = Math.min(40, Math.round(pitches));
  const icons = '<span class="pitch"></span>'.repeat(n);
  return `<div class="scale">${icons}${pitches > 40 ? ' …' : ''} ≈ ${fmt(Math.round(pitches))} football pitches · ${(ha / 100).toFixed(2)} km²</div>`;
}

function timelineHTML(p) {
  if (!p.timeline.length) return '';
  const now = asOfYear();
  let nowDrawn = false;
  const rows = p.timeline.map((e) => {
    const future = yr(e.date) > now;
    let nowRow = '';
    if (future && !nowDrawn) { nowDrawn = true; nowRow = `<li class="tl-now"><span class="tl-dot"></span><span class="tl-d">Today</span><span class="tl-l">${esc(state.data.meta.asOf)}</span></li>`; }
    return `${nowRow}<li class="tl-ev ${e.stage}${future ? ' future' : ''}">
      <span class="tl-dot" style="--sc:${STAGE_COLOR[e.stage]}"></span>
      <span class="tl-d">${fmtDate(e.date)}</span>
      <span class="tl-l"><span class="tl-stage">${STAGE_LABEL[e.stage]}</span>${esc(e.label)}</span></li>`;
  }).join('');
  const span = p.t1 > p.t0 ? `${Math.floor(p.t0)}–${Math.floor(p.t1)}` : `${Math.floor(p.t0)}`;
  return `<div class="kicker" style="margin-top:14px">Timeline · ${span}${p.t1 > now ? ' · dashed = expected' : ''}</div><ol class="tl">${rows}</ol>`;
}

async function renderDetail(f) {
  const p = f.properties;
  const body = $('#detail-body');
  const areaV = p.stated_area_ha
    ? `${fmt(p.stated_area_ha)} ha <small>stated${p.computed_area_ha ? ` · drawn ${Math.round(p.computed_area_ha)} ha` : ''}</small>`
    : (p.computed_area_ha ? `${Math.round(p.computed_area_ha)} ha <small>drawn polygon</small>` : '—');
  body.innerHTML = `
    <div class="kicker">${esc(p.borough)} · ${CAT_LABEL[p.category] || p.category} · <span class="status ${p.status}">${STATUS_LABEL[p.status] || p.status}</span></div>
    <h2>${esc(p.name)}</h2>
    ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ''}
    <div class="milestone"><div class="d">Latest · ${esc(p.milestone_date || '')}</div>${esc(p.milestone)}</div>
    ${timelineHTML(p)}
    <div class="facts">
      <div class="fact"><div class="k">Site area</div><div class="v">${areaV}</div></div>
      <div class="fact"><div class="k">Homes</div><div class="v">${p.homes ? fmt(p.homes) : '—'}</div></div>
      <div class="fact"><div class="k">Jobs</div><div class="v">${p.jobs ? fmt(p.jobs) : '—'}</div></div>
      <div class="fact"><div class="k">Investment / GDV</div><div class="v" style="font-size:13px">${esc(p.investment || '—')}</div></div>
      <div class="fact wide"><div class="k">Lead / partners</div><div class="v">${esc(p.lead || '—')}</div></div>
      ${p.architects ? `<div class="fact wide"><div class="k">Masterplanner / architects</div><div class="v">${esc(p.architects)}</div></div>` : ''}
      ${p.commercial ? `<div class="fact wide"><div class="k">Commercial / other</div><div class="v">${esc(p.commercial)}</div></div>` : ''}
      <div class="fact wide"><div class="k">Centroid (WGS84)</div><div class="v" style="font-family:monospace;font-size:12px">${p.centroid[1].toFixed(5)}, ${p.centroid[0].toFixed(5)}</div></div>
    </div>
    ${scaleLine(p.area_ha)}
    <div class="links">${(p.links || []).map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>
    <div class="kicker" style="margin-top:12px">Images &amp; renders</div>
    <div class="gallery" id="gallery"></div>
    <div class="conf">Boundary: ${esc(p.boundary_source || '—')} · confidence: ${esc(p.confidence)}. Figures from public sources as of ${esc(state.data.meta.asOf)}; conflicting values noted in the summary.</div>
    <div class="nav"><button id="prev">← Previous</button><button id="next">Next →</button></div>`;
  $('#detail').classList.remove('hidden');
  $('#detail').scrollTop = 0;
  $('#prev').onclick = () => step(-1);
  $('#next').onclick = () => step(1);
  renderGallery(p);
}

function step(d) {
  const list = state.filtered;
  if (!list.length) return;
  const i = list.findIndex((x) => x === state.selected);
  const n = list[(i + d + list.length) % list.length];
  select(n.properties.id);
}

// ---------- images ----------
function renderGallery(p) {
  const g = $('#gallery');
  g.innerHTML = '';
  const imgs = p.images || [];
  if (!imgs.length) { g.innerHTML = '<div class="empty">No images for this scheme.</div>'; return; }
  const KIND = { 'aerial-cgi': 'Aerial CGI', masterplan: 'Masterplan', render: 'Render', 'aerial-photo': 'Aerial photo', photo: 'Photo' };
  imgs.forEach((im, i) => {
    const fig = el('figure', i === 0 ? 'hero' : null);
    const img = el('img'); img.src = im.src; img.alt = im.caption || p.name; img.loading = 'lazy'; img.onclick = () => lightbox(im.src);
    fig.append(img);
    const host = im.source_url ? im.source_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';
    fig.append(el('figcaption', null, `${im.kind ? `<span class="kind">${KIND[im.kind] || esc(im.kind)}</span>` : ''}${esc(im.caption || '')}${im.credit ? `<br><span class="credit">© ${esc(im.credit)}${im.licence ? ' · ' + esc(im.licence) : ''}</span>` : ''}${im.source_url ? `<br><a class="src" href="${esc(im.source_url)}" target="_blank" rel="noopener">source: ${esc(host)} ↗</a>` : ''}`));
    g.append(fig);
  });
}

function lightbox(src) {
  const lb = el('div'); lb.id = 'lightbox'; const img = el('img'); img.src = src; lb.append(img);
  lb.onclick = () => lb.remove(); document.body.append(lb);
}

// ---------- sidebar ----------
function buildChips() {
  const boroughs = [...new Set(state.features.map((f) => f.properties.borough))].sort();
  const mk = (host, items, set, label, sw) => {
    host.innerHTML = '';
    items.forEach((it) => {
      const c = el('button', 'chip', `${sw ? `<span class="sw" style="background:${sw(it)}"></span>` : ''}${label(it)}`);
      c.onclick = () => { set.has(it) ? set.delete(it) : set.add(it); c.classList.toggle('on'); applyFilters(); };
      host.append(c);
    });
  };
  mk($('#chips-borough'), boroughs, state.borough, (b) => b);
  mk($('#chips-status'), STATUS_ORDER, state.status, (s) => STATUS_LABEL[s]);
  mk($('#chips-cat'), Object.keys(CAT_COLOR), state.cat, (c) => CAT_LABEL[c], (c) => CAT_COLOR[c]);
}

function applyFilters() {
  state.filtered = state.features.filter((f) => {
    const p = f.properties;
    if (state.borough.size && ![...state.borough].some((b) => p.borough.includes(b))) return false;
    if (state.status.size && !state.status.has(p.status)) return false;
    if (state.cat.size && !state.cat.has(p.category)) return false;
    if (state.q && !p.search.includes(state.q)) return false;
    if (state.brush && !p.timeline.some((e) => { const t = yr(e.date); return t >= state.brush[0] && t <= state.brush[1]; })) return false;
    return true;
  });
  renderList();
  renderGantt();
  refreshSources();
  if (state.year != null) setYear(state.year);
}

function stageBadge(p) {
  if (state.year == null) return `<span class="status ${p.status}">${STATUS_LABEL[p.status]}</span>`;
  const st = stageAt(p, state.year);
  return st ? `<span class="status stg" style="--sc:${STAGE_COLOR[st]}">${STAGE_LABEL[st]}</span>` : '<span class="status none">Not started</span>';
}

function renderList() {
  const ol = $('#list'); ol.innerHTML = '';
  const homes = state.filtered.reduce((a, f) => a + (f.properties.homes || 0), 0);
  const ha = state.filtered.reduce((a, f) => a + (f.properties.area_ha || 0), 0);
  $('#totals').innerHTML = `<b>${state.filtered.length}</b> schemes · <b>${fmt(homes)}</b> homes (stated) · <b>${fmt(Math.round(ha))}</b> ha`;
  state.filtered
    .slice()
    .sort((a, b) => (b.properties.homes || 0) - (a.properties.homes || 0))
    .forEach((f) => {
      const p = f.properties;
      const li = el('li'); li.dataset.id = p.id;
      li.innerHTML = `<span class="bar" style="background:${CAT_COLOR[p.category]}"></span>
        <div><div class="name">${esc(p.name)}</div><div class="sub">${esc(p.borough)} · ${stageBadge(p)}</div></div>
        <div class="meta"><b>${p.homes ? fmt(p.homes) : '—'}</b>${p.homes ? 'homes' : ''}<br>${p.area_ha ? p.area_ha + ' ha' : ''}</div>`;
      li.onclick = () => select(p.id);
      if (state.selected === f) li.classList.add('sel');
      if (state.year != null && !stageAt(p, state.year)) li.classList.add('dim');
      ol.append(li);
    });
}

// ---------- gantt ----------
function toggleGantt(on) {
  state.gantt = on ?? !state.gantt;
  $('#gantt').classList.toggle('hidden', !state.gantt);
  $('#btn-gantt').classList.toggle('on', state.gantt);
  if (state.gantt) renderGantt();
  map.resize();
}

function renderGantt() {
  if (!state.gantt) return;
  const host = $('#gantt-rows');
  const rows = state.filtered.filter((f) => f.properties.t0 != null).slice().sort((a, b) => a.properties.t0 - b.properties.t0);
  const now = asOfYear();
  const { Y0, Y1 } = state.ext;
  const px = (y) => ((y - Y0) / (Y1 - Y0)) * 100;
  const curPos = state.year == null ? null : px(state.year);
  const cur = `<span class="gt-cur${curPos == null ? ' hidden' : ''}" style="left:${curPos ?? 0}%"></span>`;
  const brush = state.brush ? `<span class="gt-brush" style="left:${px(state.brush[0])}%;width:${px(state.brush[1]) - px(state.brush[0])}%"></span>` : '';
  const pxPerYear = ($('#gantt-axis').clientWidth || 800) / (Y1 - Y0);
  const step = [1, 2, 5, 10].find((st) => st * pxPerYear >= 44) || 10;
  let axis = '';
  for (let y = Math.ceil(Y0 / step) * step; y < Y1; y += step) axis += `<span class="gt-tick" style="left:${px(y)}%">${y}</span>`;
  $('#gantt-axis').innerHTML = axis + `<span class="gt-now" style="left:${px(now)}%"><i>today</i></span>` + brush + cur;
  renderBrushChip();
  host.innerHTML = rows.map((f) => {
    const p = f.properties;
    const done = Math.min(p.t1, now), a = px(p.t0);
    const bar = `<span class="gt-bar" style="left:${a}%;width:${Math.max(0.4, px(done) - a)}%;background:${CAT_COLOR[p.category]}"></span>` +
      (p.t1 > now ? `<span class="gt-bar future" style="left:${px(Math.max(p.t0, now))}%;width:${px(p.t1) - px(Math.max(p.t0, now))}%;border-color:${CAT_COLOR[p.category]}"></span>` : '');
    const evs = p.timeline.map((e) => `<span class="gt-ev ${e.stage}${yr(e.date) > now ? ' future' : ''}" style="left:${px(yr(e.date))}%;--sc:${STAGE_COLOR[e.stage]}" title="${esc(fmtDate(e.date))} · ${STAGE_LABEL[e.stage]} · ${esc(e.label)}"></span>`).join('');
    return `<div class="gt-row${state.selected === f ? ' sel' : ''}" data-id="${p.id}">
      <div class="gt-name"><span class="status ${p.status}">${STATUS_LABEL[p.status]}</span>${esc(p.name)}</div>
      <div class="gt-track"><span class="gt-now" style="left:${px(now)}%"></span>${brush}${bar}${evs}${cur}</div></div>`;
  }).join('');
  if (!rows.length) host.innerHTML = '<div class="empty">No schemes in the current filter.</div>';
  host.querySelectorAll('.gt-row').forEach((r) => (r.onclick = () => select(r.dataset.id)));
  host.querySelector('.gt-row.sel')?.scrollIntoView({ block: 'nearest' });
}

function renderBrushChip() {
  const c = $('#gantt-brush');
  if (!state.brush) { c.classList.add('hidden'); return; }
  c.classList.remove('hidden');
  c.querySelector('span').textContent = `${fmtYear(state.brush[0])} – ${fmtYear(state.brush[1])}`;
}

function setBrush(range) {
  state.brush = range;
  $('#btn-gantt').classList.toggle('brushed', !!range);
  applyFilters();
}

// drag on the axis to brush a year range; a plain click clears it
(() => {
  const axis = $('#gantt-axis');
  let x0 = null, ghost = null;
  const yAt = (clientX) => { const r = axis.getBoundingClientRect(); const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width)); return state.ext.Y0 + t * (state.ext.Y1 - state.ext.Y0); };
  axis.addEventListener('pointerdown', (e) => {
    x0 = e.clientX; axis.setPointerCapture(e.pointerId);
    ghost = el('span', 'gt-brush ghost'); axis.append(ghost);
  });
  axis.addEventListener('pointermove', (e) => {
    if (x0 == null || !ghost) return;
    const r = axis.getBoundingClientRect(), a = Math.min(x0, e.clientX) - r.left, w = Math.abs(e.clientX - x0);
    ghost.style.left = (a / r.width) * 100 + '%'; ghost.style.width = (w / r.width) * 100 + '%';
  });
  const end = (e) => {
    if (x0 == null) return;
    ghost?.remove(); ghost = null;
    const dx = Math.abs(e.clientX - x0);
    const range = dx < 4 ? null : [yAt(Math.min(x0, e.clientX)), yAt(Math.max(x0, e.clientX))];
    x0 = null;
    setBrush(range);
  };
  axis.addEventListener('pointerup', end);
  axis.addEventListener('pointercancel', end);
})();

// ---------- tour ----------
function toggleTour() {
  const btn = $('#btn-tour');
  if (state.tour) { clearTimeout(state.tour); state.tour = null; btn.classList.remove('running'); btn.textContent = '▶ Tour'; return; }
  if (!state.filtered.length) return;
  btn.classList.add('running'); btn.textContent = '■ Stop';
  let i = state.selected ? state.filtered.indexOf(state.selected) : -1;
  const next = () => {
    i = (i + 1) % state.filtered.length;
    select(state.filtered[i].properties.id);
    state.tour = setTimeout(next, 6500);
  };
  next();
}

// ---------- wiring ----------
$('#basemap').addEventListener('change', (e) => setStyle(e.target.value));
$('#layers').addEventListener('change', applyToggles);
$('#search').addEventListener('input', (e) => { state.q = e.target.value.trim().toLowerCase(); applyFilters(); });
$('#btn-overview').onclick = () => { closeDetail(); map.fitBounds(GM_BOUNDS, { pitch: 0, bearing: 0, padding: 40, duration: 1800 }); };
$('#btn-tour').onclick = toggleTour;
$('#btn-gantt').onclick = () => toggleGantt();
$('#gantt-close').onclick = () => toggleGantt(false);
$('#gantt-brush button').onclick = () => setBrush(null);
$('#year').addEventListener('input', (e) => { if (state.playing) togglePlay(); setYear(+e.target.value / 12, { fromSlider: true }); });
$('#btn-play').onclick = togglePlay;
$('#btn-now').onclick = () => { if (state.playing) togglePlay(); setYear(null); };
$('#detail-close').onclick = closeDetail;
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input')) return;
  if (e.key === 'Escape') closeDetail();
  if (e.key === 't' || e.key === 'T') toggleGantt();
  if (e.key === 'p' || e.key === 'P') togglePlay();
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); state.selected ? step(1) : select(state.filtered[0]?.properties.id); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); state.selected && step(-1); }
});

loadData().then(() => {
  $('#basemap').value = state.style;
  buildChips();
  $('#year').min = state.ext.Y0 * 12; $('#year').max = state.ext.Y1 * 12 - 1; $('#year').value = Math.round(asOfYear() * 12);
  $('#year-label').textContent = `Now · ${state.data.meta.asOf}`;
  applyFilters();
  const go = () => { const id = location.hash.slice(1); if (id) select(id); };
  if (map.isStyleLoaded() && map.getLayer('poly-fill')) { refreshSources(); go(); } else map.once('style.load', () => { refreshSources(); go(); });
});
