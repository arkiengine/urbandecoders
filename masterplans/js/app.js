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
const PITCH_HA = 0.714; // FIFA 105×68 m

const GM_BOUNDS = [[-2.75, 53.33], [-1.95, 53.68]];
let initialStyle = 'black';
try { const saved = localStorage.getItem('ud-gm-style'); if (saved && saved !== 'satellite') initialStyle = saved; } catch {}
const state = {
  data: null, features: [], filtered: [], selected: null, style: initialStyle,
  borough: new Set(), status: new Set(), cat: new Set(), q: '', tour: null
};

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const fmt = (n) => n == null ? '—' : n.toLocaleString('en-GB');
const isPoly = (f) => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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
  });
  state.data = gj;
  state.features = gj.features;
  $('#asof').textContent = `${gj.features.length} schemes · status ${gj.meta.asOf}`;
}

function pointsFC() {
  return { type: 'FeatureCollection', features: state.filtered.map((f) => ({
    type: 'Feature', properties: f.properties, geometry: { type: 'Point', coordinates: f.properties.centroid }
  })) };
}
function polysFC() {
  return { type: 'FeatureCollection', features: state.filtered.filter(isPoly) };
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
  if (state.selected) highlight(state.selected.properties.id);
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
  history.replaceState(null, '', '#' + id);
  if (fly) flyTo(f);
}

function closeDetail() {
  state.selected = null; highlight(null);
  $('#detail').classList.add('hidden');
  document.querySelectorAll('#list li.sel').forEach((li) => li.classList.remove('sel'));
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
  imgs.forEach((im) => {
    const fig = el('figure');
    const img = el('img'); img.src = im.src; img.alt = im.caption || p.name; img.loading = 'lazy'; img.onclick = () => lightbox(im.src);
    fig.append(img);
    const host = im.source_url ? im.source_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';
    fig.append(el('figcaption', null, `${esc(im.caption || '')}${im.credit ? `<br><span class="credit">© ${esc(im.credit)}${im.licence ? ' · ' + esc(im.licence) : ''}</span>` : ''}${im.source_url ? `<br><a class="src" href="${esc(im.source_url)}" target="_blank" rel="noopener">source: ${esc(host)} ↗</a>` : ''}`));
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
    return true;
  });
  renderList();
  refreshSources();
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
        <div><div class="name">${esc(p.name)}</div><div class="sub">${esc(p.borough)} · <span class="status ${p.status}">${STATUS_LABEL[p.status]}</span></div></div>
        <div class="meta"><b>${p.homes ? fmt(p.homes) : '—'}</b>${p.homes ? 'homes' : ''}<br>${p.area_ha ? p.area_ha + ' ha' : ''}</div>`;
      li.onclick = () => select(p.id);
      if (state.selected === f) li.classList.add('sel');
      ol.append(li);
    });
}

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
$('#detail-close').onclick = closeDetail;
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input')) return;
  if (e.key === 'Escape') closeDetail();
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); state.selected ? step(1) : select(state.filtered[0]?.properties.id); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); state.selected && step(-1); }
});

loadData().then(() => {
  $('#basemap').value = state.style;
  buildChips();
  applyFilters();
  const go = () => { const id = location.hash.slice(1); if (id) select(id); };
  if (map.isStyleLoaded() && map.getLayer('poly-fill')) { refreshSources(); go(); } else map.once('style.load', () => { refreshSources(); go(); });
});
