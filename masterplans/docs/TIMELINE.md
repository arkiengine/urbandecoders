# Timeline, year scrubber and programme drawer

Every scheme carries a `timeline` array of dated stage events. Three views read it: the stage timeline in the detail panel, the year scrubber on the map, and the programme (Gantt) drawer.

## Event model

```json
"timeline": [
  { "date": "2019-03", "stage": "framework", "label": "Northern Gateway SRF approved by Manchester City Council" },
  { "date": "2021-03", "stage": "start",     "label": "Victoria Riverside (Red Bank) starts on site" },
  { "date": "2040",    "stage": "target",    "label": "Build-out of 15,000 homes across seven neighbourhoods" }
]
```

- **`date`** is `YYYY-MM` where the month is known, otherwise `YYYY`. The app places a month at its midpoint and a bare year at mid-year.
- **`stage`** is one of six values:

| Stage | Meaning | Colour |
|---|---|---|
| `framework` | Strategy, SRF, allocation, MDC, partner appointment | violet |
| `consent` | Application, resolution to grant, outline or reserved matters consent | teal |
| `start` | Start on site, enabling works, demolition | cyan |
| `delivery` | A phase opens, tops out or completes while the scheme continues | orange |
| `complete` | The scheme as a whole is complete | grey |
| `target` | A build-out or opening target, not a milestone | dark grey |

- **`label`** is one factual line. Write "(unverified)" or "(reported)" in the label when a source is weak, as the existing data does.
- Events dated after `meta.asOf` are expected dates. The app draws them hollow or dashed and puts a red "Today" marker between past and future.

The dataset holds 325 events from July 2002 to 2045. They were compiled in September 2026 from each scheme's summary and milestone text plus public sources. Early framework dates for smaller schemes, and all `target` years, are the least certain.

Keep events in date order in the file. The app sorts them anyway, and `tools/validate.py` warns when they are out of order.

## Stage at a given date

The core rule is in `stageAt(p, y)` in `js/app.js`. The stage a scheme has reached at decimal year `y` is the stage of the latest event dated on or before `y`. Before its first event a scheme has not started.

A scheme can move back from `delivery` to `consent` if a later consent event follows a delivered phase. That is deliberate, because it reflects multi-phase schemes. If one scheme reads oddly while scrubbing, look at its event order.

## Detail panel timeline

`timelineHTML(p)` renders a vertical list under the latest-milestone block. The kicker shows the scheme's span, for example "Timeline · 2017–2040". Past events have solid dots in the stage colour. Future events have hollow dots and muted text, after a red "Today" row.

## Year scrubber

The bar at the top-left of the map.

- Drag the slider, or press play (`P`), to step month by month across the dataset's full range. Playback runs at about one month per 45 ms.
- While a year is set, `setYear()` adds a `ystage` property to every feature in the map sources, and `applyTimePaint()` swaps the fill, line, point and label paint to match on `ystage` instead of category. Schemes that had not started fade to a faint outline. The legend switches to stage colours.
- The sidebar list shows the stage reached at that date instead of today's status, and dims unstarted schemes. The readout counts how many filtered schemes had started.
- If the programme drawer is open, a cyan cursor tracks the same date across every row.
- **Now** clears the year and restores category colours and live status.

The scrubber respects every other filter. Filtering to one borough and pressing play shows that borough's build-out alone.

## Programme drawer

Open with the **Timeline** button or `T`.

- One row per filtered scheme, sorted by first event. The bar is in the category colour, solid up to today and dashed to the scheme's last event. Markers show each event in its stage colour, and `target` events are diamonds.
- Hover a marker for its date, stage and label. Click a row to select and fly to the scheme.
- The x axis uses fixed extents from the whole dataset (`state.ext`), so it does not rescale as filters change. Tick spacing adapts to the drawer width.

## Brushing

Drag across the drawer's year axis to select a date range.

- Only schemes with at least one event inside the range stay visible on the map, in the list, in the totals and in the drawer. The range is shaded down every row.
- A chip in the drawer header shows the range. The **Timeline** button gets a cyan outline while a brush is active, even with the drawer closed.
- Clear it with the chip's ×, or with a single click on the axis.

The brush is applied inside `applyFilters()` alongside the chips and search, so it combines with them.

## Editing timelines

Edit `timeline` directly in `data/schemes.geojson`, then run:

```bash
python tools/validate.py
```

When a scheme's status changes, add the event that caused it rather than editing older ones. For example, add a `start` event when a consented scheme goes on site. Update `milestone`, `milestone_date` and `status` at the same time. See [MAINTAINING.md](MAINTAINING.md).
