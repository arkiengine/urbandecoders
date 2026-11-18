# Greater Manchester Masterplans

Interactive map of 66 major masterplan and regeneration schemes across Greater Manchester's ten boroughs, published at **urbandecoders.com/masterplans**. Each scheme has a sourced boundary, status, homes, jobs, lead partners, a dated stage timeline and curated proposal imagery. Status is as of `meta.asOf` in the data (currently 27 Sep 2026).

Static site: plain HTML, CSS and one ES module. No build step, no API keys, no backend.

## What it does

- **Map.** MapLibre GL with seven basemaps (OpenFreeMap Liberty, Positron, Dark, Fiord; CARTO Dark Matter as "Black"; a custom monochrome "Blueprint"; Esri imagery) and 3D buildings extruded from the basemap's OpenMapTiles source. Boundaries are coloured by category. A solid outline means a sourced red line, a dashed one a partial or illustrative boundary.
- **Sidebar.** Search, filter chips by borough, status and category, running totals, and a list sorted by homes.
- **Detail panel.** Facts, latest milestone, a vertical stage timeline, scale in football pitches, links and an image gallery led by a full-width hero.
- **Year scrubber.** A slider and play button that recolour every scheme by the stage it had reached in a given month, from 2002 to the 2040s.
- **Programme drawer.** A Gantt view of every filtered scheme. Drag across its year axis to brush a date range, which filters the map, list and totals.
- **Tour.** Flies through the filtered schemes one by one.

## Run locally

Any static server from this folder works:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. From the website repo root, the `site` preview config in `.claude/launch.json` serves the whole site on port 8765, so the app is at `/masterplans/`.

## Files

| Path | What it is |
|---|---|
| `index.html` | Page shell: site nav, toolbar, sidebar, map, detail panel, scrubber, programme drawer, legends |
| `js/app.js` | The whole app: data load, map layers, filters, detail panel, timeline, scrubber, Gantt, tour |
| `css/app.css` | House-style tokens mirrored from `../styles.css`, plus all app styling |
| `data/schemes.geojson` | The dataset, WGS84 (EPSG:4326). One feature per scheme |
| `assets/images/<id>/NN.jpg` | Scheme imagery, max 1600 px JPEG |
| `tools/validate.py` | Checks the dataset before publishing |
| `tools/curate_images.py` | Stages, reviews and applies proposal imagery |

## Documentation

- [docs/DATA.md](docs/DATA.md): dataset schema, boundary sources and confidence, known caveats
- [docs/TIMELINE.md](docs/TIMELINE.md): stage model, detail timeline, year scrubber, programme drawer and brushing
- [docs/IMAGES.md](docs/IMAGES.md): how scheme imagery is sourced, reviewed and credited, and the rights position
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how `app.js` is organised, map layers, state, and the relationship to the source app in `D:\Claude Apps`
- [docs/MAINTAINING.md](docs/MAINTAINING.md): updating schemes, adding a scheme, release checklist

## Deep links and keys

`#<id>` selects and flies to a scheme, for example `index.html#old-trafford-wharfside`.

| Key | Action |
|---|---|
| `←` `→` (or `↑` `↓`) | Previous / next scheme in the filtered list |
| `Esc` | Close the detail panel |
| `T` | Toggle the programme drawer |
| `P` | Play / pause the year scrubber |

## Rights

Boundary data is OGL v3 (GMCA, councils) or ODbL (OpenStreetMap). Most scheme imagery is copyright of the developers, architects or visualisers credited under each image, used for research with attribution. Clear image rights with the owners before promoting the page. See [docs/IMAGES.md](docs/IMAGES.md).
