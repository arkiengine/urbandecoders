# Architecture

A static page: `index.html`, one stylesheet and one ES module, `js/app.js`. Two libraries load from jsDelivr as globals: MapLibre GL 4.7.1 and Turf 7.1.0. There is no build step and nothing server-side.

## Where this copy sits

There are two copies of this app.

| Copy | Role |
|---|---|
| `urbandecoders/masterplans/` (this folder) | **The published app and the source of truth** for code, `timeline` data and imagery |
| `D:\Claude Apps\gm-masterplans-twin\` | The original workshop. Holds the QGIS project, raw boundary sources, `server.mjs` and the older `tools/fetch_images.py` |

They have diverged. On 28 September 2026 the workshop copy got a different, simpler timeline: `timeline` is an object `{start, end, estimated, basis}` derived from text by `tools/derive_timeline.py`, rendered by a separate `js/timeline.js`. This copy uses the richer `timeline[]` array of stage events described in [TIMELINE.md](TIMELINE.md), and curated imagery with `kind`.

**Do not copy `js/`, `css/` or `data/schemes.geojson` from the workshop over this folder.** It would replace the stage timelines and imagery. Do not run the workshop's `derive_timeline.py` against this dataset either: it overwrites `timeline` with the other shape. To bring boundary updates across from QGIS, copy only the `geometry`, `confidence`, `boundary_source` and `boundary_features` of the affected features.

## `js/app.js` sections

The module is organised top to bottom in commented sections.

| Section | Contents |
|---|---|
| Constants | Basemap styles, including the custom `BLUEPRINT` style. Per-basemap overlay colours (`THEME`). Category, status and stage colours and labels |
| State and helpers | The `state` object, DOM helpers, date helpers (`yr`, `fmtDate`, `fmtYear`, `asOfYear`) and `stageAt` |
| data | `loadData()` fetches the GeoJSON, computes area, centroid, bbox, search text and timeline span per feature, and sets the scrubber extents. `pointsFC()` and `polysFC()` build the map sources from `state.filtered` |
| map | Map creation, `addLayers()` and the overlay layer stack |
| time scrubber | `applyTimePaint()`, `setYear()`, `togglePlay()` |
| selection / fly | `highlight()`, `flyTo()`, `select()`, `closeDetail()` |
| detail panel | `timelineHTML()`, `renderDetail()`, `step()` |
| images | `renderGallery()`, `lightbox()` |
| sidebar | `buildChips()`, `applyFilters()`, `stageBadge()`, `renderList()` |
| gantt | `toggleGantt()`, `renderGantt()`, `renderBrushChip()`, `setBrush()` and the axis pointer handlers |
| tour | `toggleTour()` |
| wiring | Event listeners, keyboard shortcuts and the startup sequence |

## State

```js
state = {
  data, features, filtered,      // full GeoJSON, all features, features passing the filters
  selected,                      // selected feature or null
  style,                         // basemap key, persisted in localStorage 'ud-gm-style'
  borough, status, cat, q,       // filter chips (Sets) and search text
  brush,                         // [y0, y1] decimal years or null
  year, playing,                 // scrubber year (null = now) and playback interval
  ext,                           // {Y0, Y1} whole-dataset year extents for the scrubber and Gantt axis
  gantt, tour                    // drawer open flag, tour timer
}
```

## Data flow

Every filter change goes through one path:

```
chip / search / brush  ──►  applyFilters()
                              ├─ state.filtered
                              ├─ renderList()      sidebar + totals
                              ├─ renderGantt()     only if the drawer is open
                              ├─ refreshSources()  map GeoJSON sources
                              └─ setYear(year)     re-applied if the scrubber is active
```

`setYear()` rebuilds the map sources with a `ystage` property on every feature, swaps paint expressions, re-renders the list and moves the Gantt cursor without a full redraw.

## Map layers

`addLayers()` adds, in draw order: `bld-3d` (fill-extrusion from the basemap's OpenMapTiles source), `poly-fill`, `poly-line`, `poly-line-dash`, `poly-sel`, `pt-halo`, `pt`, `pt-sel`, `labels`.

Switching basemap calls `map.setStyle(…, { diff: false })`, which drops every custom layer. The `style.load` handler re-runs `addLayers()`, which also re-applies layer toggles, scrubber paint and the selection highlight. Any new overlay layer must be created in `addLayers()` and listed in `OUR_LAYERS`.

Colour is a paint expression, not a property on the data. Normally it matches `category`. While the scrubber is active, `applyTimePaint()` switches it to match `ystage` and adds an opacity case that fades `none`.

## Page layout

`#app` is a CSS grid: site nav, toolbar, then sidebar and map. The detail panel, scrubber, programme drawer and legends are absolutely positioned over the map. They avoid each other with sibling selectors in `css/app.css`. The drawer narrows when the detail panel is open, and the legends hide while the drawer is open.

Below 900 px the sidebar hides, panels become bottom sheets, and the scrubber moves to the bottom edge. The scrubber hides while the detail panel or drawer is open.

The site nav is duplicated from the main site's markup and `../styles.css` tokens. Update both when the site navigation changes.

## Cache-busting

`index.html` loads `css/app.css?v=N` and `js/app.js?v=N`. Bump the matching number whenever either file changes, or returning visitors may get a stale copy from cache.
