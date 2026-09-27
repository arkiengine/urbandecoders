# GM Masterplans Twin

Static MapLibre web app mapping the large masterplan / regeneration schemes across Greater Manchester (status as of 27 Sep 2026), in the Urban Decoders house style (Inter / JetBrains Mono, gold accent). No API keys. Basemaps: OpenFreeMap Liberty, Positron, Dark, Fiord; CARTO Dark Matter ("Black"); a custom monochrome "Blueprint" GIS style built on OpenMapTiles; Esri World Imagery. 3D buildings extrude from whichever OpenMapTiles-schema source the style carries. The chosen basemap is remembered per browser.

## Run

```bash
node server.mjs
```

then open http://localhost:5181 (or any static server — it's plain HTML/JS).

## Data

`data/schemes.geojson` — one Feature per scheme, WGS84 (EPSG:4326).

- Boundaries are sourced where public geometry exists; `properties.boundary_source` and `confidence` say which:
  - `allocation-boundary` — Places for Everyone 2024 allocations shapefile (GMCA, OGL v3)
  - `statutory-boundary` / `proposed-boundary` — Mayoral Development Corporations feature service (GMCA, OGL v3, Sep 2026)
  - `land-supply-site` / `land-supply-plots` — GMCA 2025 housing / industrial / offices land supply (OGL v3); plots dissolved per scheme
  - `srf-georeferenced` — Strangeways–Cambridge (2025 SRF Fig 1.1), NOMA (2020 plot plan), First Street (2020 framework plan), Great Jackson Street (May 2018 SRF site plan), St John's (Nov 2016 SRF site plan), and Mayfield / Sister / Kampus / East Village from the Piccadilly SRF Update 2018 Appendix 1 aerial: council PDFs in `qgis/source/mcc/`, georeferenced in QGIS (similarity/affine on 2–4 GCPs, ~30 m) and auto-traced; `srf-georeferenced-partial` = Piccadilly SRF (union of study sub-areas, outer 150 ha scope not closed on the plan) and Water Street (Jul 2026 SRF Fig 1.01, red line open on the east so a concave hull of the line)
  - `osm-site` — OpenStreetMap (© OpenStreetMap contributors, ODbL): Middlewood Locks, Etihad Campus
  - `spd-georeferenced` — Crescent, Greengate, Salford Central: boundary plans from the council's framework PDFs (in `qgis/source/`) georeferenced in QGIS (GCP affine / area-constrained scale) and auto-traced from the red line; check renders in `qgis/source/pages/check_*.png`
  - `proposals-map-wms` — Broadway Green: Oldham Local Plan Proposals Map WMS (`map.oldham.gov.uk/api/GetWMSInfo`, EPSG:27700 GetMap rasters polygonised) unioned with the land-supply plots; raw tiles in `qgis/source/oldham/`
  - `boundary-indicative` — none remaining
  - `point-estimate` — centroid only
- Raw sources are in `qgis/source/`; `qgis/gm_masterplans.qgz` (EPSG:27700) holds the styled project and `qgis/gm_masterplans.gpkg` the `boundaries` + `sites` layers. Solid outline = sourced, dashed = illustrative/indicative.
- `properties`: `id`, `name`, `borough`, `category` (housing | mixed | employment | framework | infrastructure | civic), `status` (on-site | consented | framework | proposed | at-risk | delivered), `lead`, `architects`, `stated_area_ha`, `homes`, `jobs`, `commercial`, `investment`, `milestone`, `milestone_date`, `summary`, `links[]`, `images[]`, `confidence`.

### Images / renders

`python tools/fetch_images.py [scheme-id ...]` pulls up to 3 images per scheme (og:image from the dataset's source links, Wikipedia page image, Wikimedia Commons search with licence metadata), resizes to 1600 px into `assets/images/<id>/NN.jpg` and writes the `images` array with `caption`, `credit`, `source_url`, `licence`. The panel shows credit and a source link under every image. Press/developer images are © their owners (research use with attribution — clear before publishing); Commons entries carry their CC licence. Or add files by hand and list them:
   ```json
   "images": [{ "src": "assets/images/mayfield/park.jpg", "caption": "Mayfield Park", "credit": "Studio Egret West" }]
   ```

Renders are copyright of the respective practices/developers — clear usage before sharing.

## Deep links

`#<id>` selects and flies to a scheme, e.g. `index.html#old-trafford-wharfside`.

## Keys

`←/→` previous/next scheme · `Esc` close · **Tour** cycles through the filtered list.
