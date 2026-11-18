# Scheme imagery

Each scheme shows up to three images in the detail panel. The aim is imagery that shows the **proposal**, not the site as it stands today.

## Image record

```json
"images": [
  {
    "src": "assets/images/mayfield/01.jpg",
    "kind": "aerial-cgi",
    "caption": "Mayfield masterplan: offices and park along the Medlock, elevated CGI (2020 outline)",
    "credit": "Studio Egret West / Mayfield Partnership",
    "source_url": "https://www.architectsjournal.co.uk/…",
    "licence": "all rights reserved — research use with attribution",
    "px": [1600, 1067]
  }
]
```

| Field | Notes |
|---|---|
| `src` | Relative path, `assets/images/<id>/NN.jpg` |
| `kind` | `aerial-cgi`, `masterplan`, `render`, `aerial-photo` or `photo`. Shown as a tag before the caption |
| `caption` | One factual line: what it shows and which phase. Say so when an image covers only part of a scheme |
| `credit` | The rights holder as credited at source. Add "(via Place North West)" or similar when it came through the press |
| `source_url` | The page the image appears on, linked under the caption |
| `licence` | The CC licence for Commons images, otherwise the research-use line above |
| `px` | Stored size after resizing |

The first image is the hero: it spans the panel's full width at 16:9. Order images best first.

## What to choose

In priority order:

1. An aerial CGI or bird's-eye render of the whole masterplan.
2. The illustrative masterplan drawing, or a hero render of the key buildings.
3. A drone photo of the delivered or under-construction scheme. Use this first only when the scheme is largely built.

Avoid logos, boundary-only maps, photos of the existing site before development, interiors, headshots, images with large text banners, and anything under 1000 px wide unless nothing better exists.

Look in this order: the developer's scheme or press page, the architect or masterplanner's project page, council and Mayoral Development Corporation pages, then trade press (Place North West, Building, Architects' Journal, Construction Enquirer, BD). Trade press usually carries the developer's CGIs at full size. Place North West serves at most 1024 px.

## Current set

Curated in September 2026. 63 schemes have proposal imagery: 175 images in total, including 32 aerial CGIs and 20 masterplan drawings.

- **Older imagery kept:** Simister / Bowlee, Stakehill and Ashton Moss West have no proposal imagery outside planning PDFs.
- **Partial coverage, labelled in captions:** Victoria North shows Red Bank only. Ashton & Stalybridge MDC shows St Petersfield only. Crompton Place shows the earlier Chapman Taylor scheme, because MEPC has published nothing yet. Bolton MDC reuses Church Wharf CGIs.

## Updating imagery

`tools/curate_images.py` stages candidates outside the app, builds contact sheets for review, and only then writes into the dataset.

1. **Write a candidates file.** JSON keyed by scheme id, best image first. Each candidate has `img` (direct image URL), `page`, `kind`, `caption` and `credit`.

   ```json
   { "mayfield": [ { "img": "https://…/hero.jpg", "page": "https://…", "kind": "aerial-cgi", "caption": "…", "credit": "…" } ] }
   ```

2. **Stage.** This downloads up to three images per scheme, rejects anything under 700 px wide, re-encodes to JPEG at a maximum of 1600 px, and writes `manifest.json` and `sheetN.jpg` contact sheets to the staging folder (`%TEMP%\gm-masterplans-stage`, or `GM_STAGE`). The app is not touched.

   ```bash
   python tools/curate_images.py stage candidates.json
   ```

3. **Review the contact sheets.** Check that every image shows the proposal and is labelled with the right `kind`.

4. **Apply, with rejects.** Pass `<id>` to drop a scheme's whole new set so it keeps its current images, or `<id>:<n>` to drop one image by its number on the sheet.

   ```bash
   python tools/curate_images.py apply ashton-moss-west airport-t2:2
   ```

   This replaces `assets/images/<id>/` and the scheme's `images` array. Schemes with nothing staged are left alone.

5. **Validate and look.** Run `python tools/validate.py`, then open a few schemes in the browser.

Pillow 11 or later reads AVIF and WebP sources. Everything is stored as JPEG.

To change one image by hand, drop the file into `assets/images/<id>/` and edit the `images` array directly.

## Rights

Boundary data is open (OGL v3, ODbL). Most images are not: they are copyright of the developers, architects or visualisers named in `credit`. Images from Wikimedia Commons carry their CC licence in `licence`.

Every image shows its credit and a source link, but attribution is not permission. Before promoting the page (social posts, press, client decks), clear at least the hero images with their owners. Studios that clear their images are usually happy to be tagged and to share the page.
