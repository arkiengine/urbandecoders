# Maintaining the map

## Status refresh

Run this periodically, for example quarterly or after a major planning decision.

1. For each scheme that has moved on, update `milestone`, `milestone_date` and, if needed, `status`.
2. Add the matching event to `timeline`. A scheme going on site gets a `start` event, a consent gets a `consent` event, and so on. Keep earlier events as they are.
3. Move expected events that have now happened to their real dates, and drop targets that have been superseded.
4. Set `meta.asOf` to the date of the review. The toolbar, every "Today" marker and the scrubber's "Now" read from it.
5. Check `links` still resolve and add the source for each change.

## Adding a scheme

1. Add a feature to `data/schemes.geojson`. Use a new kebab-case `id`, fill every property in [DATA.md](DATA.md), and set `confidence` and `boundary_source` honestly. Use a Point with `point-estimate` if no boundary is published.
2. Add a `timeline` with at least the framework or consent event that put it on the map, plus any target.
3. Add imagery with `tools/curate_images.py` (see [IMAGES.md](IMAGES.md)), or leave `images` empty for now. The validator warns but does not fail.
4. If the scheme sits inside an existing framework or MDC boundary, mention it in `summary`. Totals count it twice (see the caveats in [DATA.md](DATA.md)).

## Release checklist

1. Validate the data:

   ```bash
   python tools/validate.py
   ```

2. If `js/app.js` or `css/app.css` changed, bump its `?v=` number in `index.html`.
3. Preview locally (see the README). Open a polygon scheme and a point scheme. Check the detail timeline and gallery. Toggle the programme drawer, drag a brush, play the scrubber, press **Now**. Check the browser console is clean.
4. Check a phone-width view: the panels should become bottom sheets.
5. If imagery changed, confirm image rights for anything new in a hero slot.
6. Commit the `masterplans/` folder on its own and push to `main`, which deploys the site.

## Gotchas

- **Never rename an `id`.** Deep links, image folders and shared URLs depend on it.
- **Don't sync from the workshop copy.** `D:\Claude Apps\gm-masterplans-twin` has a different timeline format. See [ARCHITECTURE.md](ARCHITECTURE.md).
- **Write JSON with UTF-8 and `indent=1`.** Python's `json.dump(…, ensure_ascii=False, indent=1)` matches the existing file and keeps diffs small. Scheme names and labels contain en dashes, pound signs and curly apostrophes.
- **Basemap tiles are third-party.** OpenFreeMap, CARTO and Esri serve without keys. If one goes down, only that basemap option breaks. The default is CARTO "Black".
