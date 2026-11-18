# Data

Everything the app shows comes from `data/schemes.geojson`: a GeoJSON FeatureCollection in WGS84 (EPSG:4326), one feature per scheme. The app computes area, centroid and bounding box at load time with turf, so the file holds only sourced values.

## Top-level `meta`

| Key | Meaning |
|---|---|
| `title` | Dataset title |
| `asOf` | Status date, `YYYY-MM-DD`. Shown in the toolbar, used as "today" on every timeline, and quoted in the detail panel's provenance line |
| `crs` | Always `EPSG:4326` |
| `note` | Short provenance summary for boundaries |
| `boundariesUpdated` | Date boundaries were last refreshed |
| `timelineNote` | Short description of the `timeline` field |

## Feature properties

| Property | Type | Notes |
|---|---|---|
| `id` | string | Kebab-case, unique, stable. Used in deep links (`#id`) and image folder names. Never rename a published id |
| `name` | string | Display name |
| `borough` | string | One borough, or several joined with ` / ` (for example `Bury / Rochdale`). Borough chips match on substring |
| `category` | enum | `housing`, `mixed`, `employment`, `framework`, `infrastructure`, `civic`. Drives map colour |
| `status` | enum | `on-site`, `consented`, `framework`, `proposed`, `at-risk`, `delivered`. Status today, as of `meta.asOf` |
| `lead` | string | Lead developer, landowner or public body, and partners |
| `architects` | string or null | Masterplanner and architects |
| `stated_area_ha` | number or null | Area quoted by sources. Shown in preference to the drawn area |
| `homes`, `jobs` | number or null | Stated totals for the whole scheme |
| `commercial`, `investment` | string or null | Free text as quoted by sources |
| `milestone`, `milestone_date` | string | Latest milestone and its month (`YYYY-MM`) |
| `summary` | string or null | One or two sentences. Conflicting figures are noted here |
| `links[]` | `{label, url}` | Source links shown in the panel |
| `confidence` | enum | How the boundary was obtained. See below |
| `boundary_source` | string | Human-readable boundary provenance |
| `boundary_features` | number | Count of source features dissolved into the boundary, where relevant |
| `timeline[]` | `{date, stage, label}` | Dated stage events. See [TIMELINE.md](TIMELINE.md) |
| `images[]` | object | Scheme imagery. See [IMAGES.md](IMAGES.md) |

Computed at load and never stored: `computed_area_ha`, `area_ha`, `centroid`, `bbox`, `search`, `t0`, `t1`, and `ystage` while the year scrubber is active.

## Boundaries and `confidence`

| `confidence` | Source |
|---|---|
| `allocation-boundary` | Places for Everyone 2024 allocations shapefile (GMCA, OGL v3) |
| `statutory-boundary`, `proposed-boundary` | Mayoral Development Corporations feature service (GMCA, OGL v3, Sep 2026) |
| `land-supply-site`, `land-supply-plots` | GMCA 2025 housing, industrial and office land supply (OGL v3). Plots are dissolved per scheme |
| `srf-georeferenced` | Strategic Regeneration Framework plans from Manchester City Council PDFs, georeferenced in QGIS (similarity or affine on 2–4 control points, about 30 m) and auto-traced. Covers Strangeways–Cambridge, NOMA, First Street, Great Jackson Street, St John's, and Mayfield, Sister, Kampus and East Village from the Piccadilly SRF Update 2018 aerial |
| `srf-georeferenced-partial` | As above, but the red line is not closed on the plan. Piccadilly SRF uses the union of study sub-areas. Water Street uses a concave hull of its open red line |
| `spd-georeferenced` | Crescent, Greengate and Salford Central, from council framework PDFs georeferenced and traced in QGIS |
| `proposals-map-wms` | Broadway Green, from the Oldham Local Plan Proposals Map WMS (EPSG:27700 rasters polygonised), unioned with land-supply plots |
| `osm-site` | OpenStreetMap (ODbL): Middlewood Locks, Etihad Campus |
| `point-estimate` | No public geometry. A point at the scheme's centroid |

The map draws a dashed outline for `srf-georeferenced-partial` and the legacy values `boundary-indicative` and `srf-illustrative`. Everything else is solid.

The raw sources, georeferencing work and QGIS project (`qgis/gm_masterplans.qgz`, EPSG:27700) live in the source app at `D:\Claude Apps\gm-masterplans-twin\qgis\`, not in this website repo. See [ARCHITECTURE.md](ARCHITECTURE.md).

## Known caveats

- **Totals double count nested schemes.** Some schemes sit inside others. Mayfield, Sister, East Village Central and Kampus sit inside the Piccadilly SRF. Stockport 8, Weir Mill and Stockport Interchange sit inside the Stockport MDC. Church Wharf and Crompton Place sit inside the Bolton MDC. The sidebar totals add them all, so the unfiltered figure (about 141,000 homes, 7,200 ha) overstates the region by roughly 8,000 homes and 900 ha. Quote "130,000+ homes and 6,000+ hectares" in public.
- **Areas mix stated and drawn values.** `area_ha` is `stated_area_ha` where a source quotes one, otherwise the drawn polygon area. The panel shows both when they differ.
- **Homes and jobs are stated figures.** They are what developers and councils publish, often aspirational, and sometimes conflict between sources. Conflicts are noted in `summary`.
- **Point schemes have no area.** Twelve schemes are `point-estimate` and contribute nothing to hectare totals.
