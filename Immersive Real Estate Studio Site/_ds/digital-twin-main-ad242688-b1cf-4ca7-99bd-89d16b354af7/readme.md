# Urban Decoders — Design System

A dark-studio editorial design system for **Urban Decoders**, a company that
builds **architectural and masterplanning digital twins**. The brand reads like
a physical model rendered in a dark studio: a pure-black canvas, off-white
editorial serif headlines, an angular techno wordmark, and a single teal→blue
brand gradient used as atmospheric light rather than fill.

The visual system is a dark, developer-tool-meets-editorial register: confident,
considered, priced on quality. Depth is built from translucent-white hairlines
and low-opacity atmospheric glows — never drop shadows.

---

## Sources provided
- **Logos** (in `assets/`, copied from `uploads/`):
  - `ud-badge-circle.png` — teal→blue gradient circle badge with the UD monogram.
  - `ud-lockup.png` — badge + "Urban Decoders" wordmark lockup.
  - `ud-wordmark.png` — dark wordmark only (angular techno face).
  - `ud-monogram-bw.png` — black UD monogram; `ud-monogram-white.png` is a
    generated white recolour for use on the black canvas.
- **Brand brief** — a written design specification describing the dark-studio
  editorial system (canvas, type lanes, atmospheric glow depth, component
  vocabulary). No codebase or Figma file was attached; the system below is built
  from the brief + the logo assets.

> No product screenshots, code, or slide decks were provided, so UI-kit content
> is an original marketing recreation faithful to the documented system, not a
> copy of a live product surface.

---

## Font substitutions ⚠️ (please confirm / replace)
The brief's proprietary families are not licensed here, so the closest
open substitutes load from Google Fonts (`tokens/fonts.css`):

| Role | Brief spec | Substitute in use | Notes |
|---|---|---|---|
| Editorial display serif | Domaine Display / Tiempos | **Newsreader** | Hero headlines, `lineHeight: 1.0`. |
| Techno display (wordmark/eyebrows) | **Play** (the UD logo font) | **Play** | Actual brand font, loaded from Google Fonts. Not a substitute. |
| Marketing body / UI | ABC Favorit + Inter | **Inter** | Single sans lane for body + UI. |
| Code | Geist Mono | **JetBrains Mono** | No ligatures. |

The techno lane now uses **Play** — confirmed as the real UD logo font — for
eyebrows and the `Logo variant="wordmark"`.

**Ask:** if you have licensed Domaine Display / ABC Favorit / Geist Mono files,
drop them in and I'll swap the `@font-face` / `@import` and re-tune tracking.

---

## Content fundamentals (voice & copy)
- **Register:** confident, editorial, slightly literary — "priced on quality,
  not novelty." Short declarative headlines set in the serif ("The city,
  decoded.", "The twin, delivered.", "Priced on quality.").
- **Person:** addresses the reader as **you** ("A model that keeps up with the
  plan"), speaks about the product in the third person ("Urban Decoders turns…").
- **Casing:** sentence case for headlines and body. **Techno eyebrows are
  UPPERCASE**, tracked +2px, and label the section ("PLATFORM", "PRICING").
- **Domain language:** planner/architect vocabulary — parcels, masterplan,
  LOD, setbacks, massing, zoning, daylight, transit, context layers.
- **No emoji.** Iconography is geometric, not illustrative. Numbers appear only
  when concrete and earned (e.g. "214 parcels at LOD 3"), never as decorative
  stat slop.
- **CTAs** are terse and imperative: "Request access", "Read the docs",
  "Open viewer", "Talk to us".

---

## Visual foundations
- **Canvas:** pure black `#000000` (`--ud-canvas`) on every page — never
  near-black. Off-white ink `#fcfdff` (`--ud-ink`) carries the read.
- **Colour:** white is the loudest colour on the canvas and the de-facto
  accent — the primary CTA is a **white rectangle with black text**, the
  brightest pixel, one per viewport. The **teal→blue gradient**
  (`--ud-brand-gradient`, `#1a5279 → #2f8aa9`) is the brand signature, used for
  the badge, glows, and the `brand` button. Six atmospheric accents
  (orange/yellow/blue/green/red + teal) appear **only** as low-opacity radial
  glows and as code-window traffic lights — never as solid buttons or fills.
- **Emphasis red:** a deep glossy crimson (`--ud-emphasis-red` `#d81f2a`, drawn
  from the 3D UD mark) is the one loud call-out — a **red rim + low-opacity
  wash** on the single most important box in a view (`<FeatureCard highlight>`),
  never a fill. Distinct from the pinkish semantic error red (`--ud-accent-red`).
- **Type:** four strict lanes — serif display (Newsreader) for hero, techno
  (Chakra Petch) for eyebrows/wordmark, sans (Inter) for body + UI, mono
  (JetBrains Mono) for code. Hierarchy comes from **family change, not weight**;
  body stays at 400. Display runs at `lineHeight: 1.0` with negative tracking.
- **Spacing:** 4px base; 96px (`section`) vertical rhythm between bands, 128px
  (`band`) on hero/footer transitions; 32px card padding. Max content 1200px.
- **Backgrounds:** flat black with a single atmospheric radial glow anchored at
  a section's top edge, falling to black within ~600px. No full-bleed gradient
  bands, no photography-led hero, no repeating texture.
- **Elevation:** no drop shadows anywhere. Surfaces step up by luminance
  (`surface-card #0a0a0c` → `elevated #101012` → `deep #06060a`) and gain a
  translucent-white hairline (`6%` soft / `14%` strong).
- **Corners:** buttons/inputs `8px`, cards/code wells/email mockups `12px`,
  larger panels `16px`, pills/avatars/dots `full`. Full-bleed bands are `0`.
- **Cards:** dark surface + hairline border, no shadow; optional teal glow wash.
  The one **white** surface is the `EmailMockup` inset — a deliberate light
  island that reads like a print pull-quote.
- **Motion / states:** restrained. Hover on the white CTA shifts to
  `surface-light #f1f7fe`; other controls use subtle `filter`/opacity shifts.
  No bounces, no infinite decorative loops. Transitions ~120ms ease. Input focus
  thickens the border to ink (no separate ring colour).
- **Transparency & blur:** the sticky nav uses a light backdrop blur; borders and
  dividers are translucent white. Imagery, where it appears, is cool and studio-lit.

---

## Iconography
- The brand is **type-and-code led, not icon-led**. There is no proprietary icon
  font in the provided sources.
- Status is communicated with the `StatusDot` primitive (8px coloured dots) and
  code chrome uses three solid traffic-light dots — the only place the semantic
  colours appear as fills.
- Where UI icons are genuinely needed, use **Lucide** (CDN,
  `https://unpkg.com/lucide-static`) at a 1.5px stroke to match the geometric,
  low-ornament tone, and flag it. None are baked into the current kit.
- **No emoji, no unicode-glyph icons** beyond the check mark used in pricing lists.
- The only brand imagery is the logo set in `assets/` — never redraw or
  reconstruct the mark; use the provided PNGs (white monogram for dark surfaces).

---

## Index / manifest

**Root**
- `styles.css` — global entry (import lines only).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`.
- `assets/` — logo lockups, badge, monograms.
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/` — reusable primitives.
- `ui_kits/marketing/` — full landing-page recreation.
- `SKILL.md` — Agent-Skill wrapper.

**Components** (`window.UrbanDecodersDesignSystem_ad2426`)
- `Button` — primary (white) · brand (teal gradient) · ghost · outline; sm/md/lg.
- `BadgePill` — neutral / brand / ghost inline pill + eyebrow.
- `StatusDot` — 8px status indicator (green/yellow/red/blue/brand, optional pulse).
- `ContributorAvatar` — 32px round avatar (image or initials).
- `FeatureCard` — feature card, optional hairline border + teal glow.
- `PricingTier` — pricing card; `featured` elevates the surface; serif price.
- `EmailMockup` — white light-island inset card.
- `CodeWindow` — code well with traffic-light chrome + language tabs.
- `TextInput` — 40px form field with label/hint/invalid states.
- `NavBar` — 64px top nav with hairline underline.
- `Footer` — global multi-column footer.
- `Logo` — brand mark: lockup / badge / monogram / wordmark.

**UI kits**
- `ui_kits/marketing/` — Urban Decoders marketing site (hero → features →
  code-story → email inset → pricing → request access → footer).

**Starting points**
- Components: Button, FeatureCard, PricingTier, CodeWindow, NavBar.
- Screens: the marketing site (`ui_kits/marketing/index.html`).

**Intentional additions** (not enumerated in the brief, added to make the kit usable):
- `Logo` — a brand-mark wrapper around the provided assets (no mark invented).
- `ContributorAvatar` — referenced in the brief's testimonials; built as a primitive.
- `Button` `brand` variant — teal-gradient CTA, for brand moments beside the white pill.

---

## Known gaps / caveats
- All four type families are **open-source substitutes** — see the table above.
- Logged-in / dashboard surfaces (twin viewer, API keys, project management) are
  **out of scope**; only the public marketing canvas is built.
- Atmospheric glow stops are rendered per-section by design judgment, not
  standardised as tokens (one `--ud-glow-brand` helper is provided).
- Pressed/active states are documented for the white CTA; other controls rely on
  hover + browser focus.
