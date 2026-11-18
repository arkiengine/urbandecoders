#!/usr/bin/env python3
"""Build the Urban Decoders blog from markdown in content/blog/.

    py tools/build_blog.py

Writes  blog.html                 (the index: search, category chips, sort)
        blog/<slug>.html          (one guide per post)

Posts are markdown with frontmatter in content/blog/. Layout only lives here;
the words live in the markdown. Chrome matches the rest of the site.
"""
from __future__ import annotations

import html
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_resources import md_to_html, slugify  # noqa: E402

SITE = Path(__file__).resolve().parent.parent
SRC = SITE / "content" / "blog"
OUT = SITE / "blog"
VER = "20261117"
BASE_URL = "https://www.urbandecoders.com"

E = html.escape

CATEGORIES = [
    ("modelling", "Modelling"),
    ("visualisation", "Visualisation"),
    ("gis", "GIS &amp; geospatial"),
    ("practice", "Practice"),
]
CAT_TITLE = dict(CATEGORIES)

# Videos on the channel that do not (yet) have a written guide.
MORE_VIDEOS: list[tuple[str, str, str, str]] = []


# --------------------------------------------------------------------------- #
# source
# --------------------------------------------------------------------------- #
def read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n")
    if not text.startswith("---\n"):
        return {"body": text}
    end = text.find("\n---\n", 3)
    meta: dict = {}
    for line in text[4:end].split("\n"):
        if not line.strip() or ":" not in line:
            continue
        k, v = line.split(":", 1)
        meta[k.strip()] = v.strip()
    meta["body"] = text[end + 5:]
    return meta


FIG = re.compile(r"^@fig\s+([^\s|]+)\s*\|\s*([^|]*?)\s*\|\s*(.+)$", re.M)


def extract_figures(md: str) -> tuple[str, list[tuple[str, str, str]]]:
    """Pull @fig lines out before the markdown pass, leaving a token behind."""
    figs: list[tuple[str, str, str]] = []

    def take(m: re.Match) -> str:
        figs.append((m.group(1), m.group(2).strip(), m.group(3).strip()))
        return "FIGTOKEN%d" % (len(figs) - 1)

    return FIG.sub(take, md), figs


def figure_html(slug: str, src: str, stamp: str, caption: str, up: str) -> str:
    """A post figure. A leading / means a shared site asset (the MCP diagrams),
    anything else is a step image in this post's own folder."""
    time = f'<span class="post-fig__t">{E(stamp)}</span>' if stamp and stamp != "-" else ""
    if src.startswith("/"):
        path, w, h = f"{up}{E(src.lstrip('/'))}", 1200, 440
    else:
        path, w, h = f"{up}assets/img/blog/{slug}/{E(src)}", 800, 450
    return (
        f'<figure class="post-fig">'
        f'<img src="{path}" alt="{E(caption)}" loading="lazy" '
        f'width="{w}" height="{h}" decoding="async">'
        f'<figcaption>{time}{E(caption)}</figcaption></figure>'
    )


def read_posts() -> list[dict]:
    posts = []
    for path in sorted(SRC.glob("*.md")):
        fm = read_frontmatter(path)
        body_md, figs = extract_figures(fm["body"])
        body, toc = md_to_html(body_md, drop_h1=True)
        slug = fm.get("slug", path.stem)
        for i, (src, stamp, cap) in enumerate(figs):
            body = body.replace(
                f"<p>FIGTOKEN{i}</p>", figure_html(slug, src, stamp, cap, "../")
            )
        posts.append({
            "slug": slug,
            "title": fm.get("title", path.stem),
            "cat": fm.get("cat", "practice"),
            "summary": fm.get("summary", ""),
            "video": fm.get("video", ""),
            "published": fm.get("published", ""),
            "duration": fm.get("duration", ""),
            "views": fm.get("views", ""),
            "tools": fm.get("tools", ""),
            "reading": fm.get("reading", ""),
            "hero": fm.get("hero", "step-01.jpg"),
            "tags": [t.strip() for t in fm.get("tags", "").split(",") if t.strip()],
            "body": body,
            "toc": toc,
        })
    posts.sort(key=lambda p: p["published"], reverse=True)
    return posts


def pretty_date(iso: str) -> str:
    try:
        d = date.fromisoformat(iso)
    except ValueError:
        return iso
    return f"{d.day} {d.strftime('%B %Y')}"


# --------------------------------------------------------------------------- #
# chrome
# --------------------------------------------------------------------------- #
def head(title: str, desc: str, canon: str, up: str, og: str, extra: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{BASE_URL}/{canon}">
<meta property="og:type" content="article">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{up}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="{up}assets/favicon-32.png">
<link rel="apple-touch-icon" sizes="192x192" href="{up}assets/favicon-192.png">
<link rel="stylesheet" href="{up}styles.css?v={VER}">
<link rel="stylesheet" href="{up}resources/resources.css?v={VER}">
<link rel="stylesheet" href="{up}blog/blog.css?v={VER}">
{extra}</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>"""


def nav(up: str, lang: str = "") -> str:
    return f"""<header class="nav">
  <div class="nav__inner">
    <a class="brand" href="{up}index.html" aria-label="Urban Decoders home">
      <img class="brand__wordmark" src="{up}assets/ud-wordmark%20NEW.png" alt="Urban Decoders" width="786" height="120">
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a class="nav__link" href="{up}platform.html">Platform</a>
      <a class="nav__link" href="{up}services.html">Services</a>
      <a class="nav__link" href="{up}case-studies.html">Work</a>
      <a class="nav__link" href="{up}courses.html">Courses</a>
      <a class="nav__link" href="{up}resources/">Resources</a>
      <a class="nav__link" href="{up}blog.html" aria-current="page">Blog</a>
      <a class="nav__link" href="{up}about.html">About</a>
    </nav>
    <div class="nav__cta">
      <a class="btn btn--primary btn--sm btn--mono" href="{up}contact.html">Start a twin <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
{lang}    </div>
  </div>
</header>"""


LANG = """      <div class="lang-switch" role="group" aria-label="Language / 言語">
        <a class="lang-switch__opt" href="ja/blog.html" hreflang="ja" lang="ja" aria-label="日本語 (JP)">JP</a>
        <a class="lang-switch__opt" href="blog.html" hreflang="en" lang="en" aria-label="English (EN)" aria-current="true">EN</a>
      </div>
"""


def footer(up: str) -> str:
    return f"""<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="{up}index.html" aria-label="Urban Decoders home">
          <img class="brand__wordmark" src="{up}assets/ud-wordmark%20NEW.png" alt="Urban Decoders" width="786" height="120">
        </a>
        <p>Urban digital twin studio for planning, development and design. Stockport, Greater Manchester, working across the UK and internationally.</p>
        <div class="footer__badges"><img class="nv" src="{up}assets/logos/nvidia-inception.svg" alt="NVIDIA Inception Program member" width="93" height="40" loading="lazy"><img class="epic" src="{up}assets/logos/epic-megagrants.svg" alt="Epic MegaGrants Recipient" width="46" height="48" loading="lazy"></div>
      </div>
      <div>
        <h4>Studio</h4>
        <ul>
          <li><a href="{up}platform.html">Platform</a></li>
          <li><a href="{up}services.html">Services</a></li>
          <li><a href="{up}case-studies.html">Work</a></li>
          <li><a href="{up}courses.html">Courses</a></li>
          <li><a href="{up}about.html">About</a></li>
        </ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="{up}blog.html">Blog</a></li>
          <li><a href="{up}resources/">All resources</a></li>
          <li><a href="{up}resources/skills/">Skills library</a></li>
          <li><a href="{up}resources/guides/">Guides &amp; how-tos</a></li>
          <li><a href="{up}contact.html">Book a scoping call</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:info@urbandecoders.com">info@urbandecoders.com</a></li>
          <li><span style="color:var(--ash)">45 Middle Hillgate<br>Stockport<br>Greater Manchester<br>SK1 3DG</span></li>
        </ul>
      </div>
    </div>
    <div class="footbar" aria-hidden="true"></div>
    <div class="footer__bottom">
      <p>&copy; 2026 Urban Decoders. All rights reserved.</p>
      <div class="social">
        <a href="https://www.instagram.com/urbandecoders/" target="_blank" rel="noopener" aria-label="Urban Decoders on Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://www.youtube.com/@Urban_Decoders" target="_blank" rel="noopener" aria-label="Urban Decoders on YouTube">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.77-1.77C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.83.43A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.77 1.77C4.7 18.9 12 18.9 12 18.9s7.3 0 8.83-.43a2.5 2.5 0 0 0 1.77-1.77C23 15.2 23 12 23 12ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>
<script src="{up}resources/resources.js?v={VER}" defer></script>
</body>
</html>"""


def subscribe_band(up: str) -> str:
    return f"""<section class="section">
  <div class="wrap"><div class="cta-band">
    <span class="eyebrow eyebrow--plain" style="justify-content:center; display:flex">Stay in the loop</span>
    <h2 class="section-title mt-6" style="max-width:22ch; margin-inline:auto">Learn the tools shaping tomorrow&rsquo;s cities.</h2>
    <p class="lead mx-auto center mt-6" style="margin-inline:auto">Every guide here starts life as a video on the channel. Subscribe for new workflows on digital twins, AI and real-time visualisation &mdash; and see how Urban Decoders builds them.</p>
    <div class="wrap-btns mt-7" style="justify-content:center">
      <a class="btn btn--primary btn--lg" href="https://www.youtube.com/@Urban_Decoders" target="_blank" rel="noopener">Subscribe on YouTube</a>
      <a class="btn btn--outline btn--lg" href="{up}contact.html">Work with us</a>
    </div>
  </div></div>
</section>"""


# --------------------------------------------------------------------------- #
# index
# --------------------------------------------------------------------------- #
def post_card(p: dict) -> str:
    tags = "".join(f'<span class="tag">{E(t)}</span>' for t in p["tags"][:2])
    hay = " ".join([p["title"], p["summary"], p["tools"], *p["tags"],
                    re.sub(r"&amp;", "&", CAT_TITLE[p["cat"]])]).lower()
    return f"""<article class="tpl-card post-card card card--glow" data-cat="{p['cat']}" data-title="{E(p['title'].lower())}" data-search="{E(hay)}">
  <a class="post-card__shot" href="blog/{p['slug']}.html" tabindex="-1" aria-hidden="true">
    <img src="assets/img/blog/{p['slug']}/{p['hero']}" alt="" loading="lazy" width="800" height="450" decoding="async">
    <span class="post-card__len">{E(p['duration'])}</span>
  </a>
  <div class="post-card__body">
    <div class="tpl-card__top">
      <span class="tpl-card__type">{CAT_TITLE[p['cat']]}</span>
      <span class="tpl-card__cat">{E(pretty_date(p['published']))}</span>
    </div>
    <h3 class="tpl-card__title"><a href="blog/{p['slug']}.html">{E(p['title'])}</a></h3>
    <p class="tpl-card__blurb">{E(p['summary'])}</p>
    <div class="tpl-card__foot">
      <div class="tpl-card__tags">{tags}</div>
      <a class="btn btn--outline btn--mono btn--sm" href="blog/{p['slug']}.html">Read <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</article>"""


def build_index(posts: list[dict]) -> str:
    counts = {slug: sum(1 for p in posts if p["cat"] == slug) for slug, _ in CATEGORIES}
    chips = '<button class="chip" type="button" data-filter="all" aria-pressed="true">' \
            f'<i aria-hidden="true"></i>All <span class="chip__n">{len(posts)}</span></button>'
    chips += "".join(
        f'<button class="chip" type="button" data-filter="{slug}" aria-pressed="false">'
        f'<i aria-hidden="true"></i>{title} <span class="chip__n">{counts[slug]}</span></button>'
        for slug, title in CATEGORIES if counts[slug]
    )

    cards = "".join(f"""<article class="post-more card card--glow">
  <a class="yt-facade" href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener" aria-label="Watch on YouTube: {E(title)}"><img src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="{E(title)} &mdash; video thumbnail" loading="lazy" width="480" height="360"><span class="yt-play" aria-hidden="true"></span></a>
  <div class="post-more__body">
    <div class="badge-row"><span class="tag">{tag}</span><span class="tag" style="color:var(--ash)">{views}</span></div>
    <h3>{E(title)}</h3>
  </div>
</article>""" for vid, title, tag, views in MORE_VIDEOS)

    more_section = f"""
<section class="section--tight">
  <div class="wrap">
    <div class="stack" style="max-width:52ch; margin-bottom:28px">
      <span class="eyebrow">Also on the channel</span>
      <h2 class="section-title">Not written up yet.</h2>
      <p class="lead">Video-only for now. Tell us which one you want as a guide and
      it moves up the list.</p>
    </div>
    <div class="post-morerow">{cards}</div>
  </div>
</section>
""" if MORE_VIDEOS else ""

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Urban Decoders Blog",
  "description": "Written, step-by-step guides to the AI, GIS and real-time workflows from the Urban Decoders channel.",
  "url": "%s/blog.html",
  "blogPost": [%s]
}
</script>
""" % (BASE_URL, ", ".join(
        '{ "@type": "BlogPosting", "headline": "%s", "datePublished": "%s", "url": "%s/blog/%s.html" }'
        % (E(p["title"]), p["published"], BASE_URL, p["slug"]) for p in posts))

    return f"""{head(
        "Blog — Step-by-step guides on AI, digital twins and Unreal Engine | Urban Decoders",
        "Written guides to the workflows from the Urban Decoders channel: GPT Astra in Rhino and "
        "Revit, Claude for practice, Cesium in Unreal Engine, Nano Banana Pro with Google Earth, "
        "and AI-assisted GIS mapping.",
        "blog.html", "", f"{BASE_URL}/assets/img/og-insights.jpg", ld)}
{nav("", LANG)}
<main id="main">

<section class="page-head glow-top">
  <div class="wrap stack">
    <span class="eyebrow">Blog</span>
    <h1 class="display">Decoding the tools behind the <span class="text-red">living city.</span></h1>
    <p class="lead">Every video on the Urban Decoders channel, written up as a guide you can
    actually follow &mdash; the setup, the prompts, the settings and the places each workflow
    falls over. Watch the film or read the steps; both are here.</p>
    <div class="wrap-btns mt-6">
      <a class="btn btn--primary" href="https://www.youtube.com/@Urban_Decoders" target="_blank" rel="noopener">Subscribe on YouTube
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.77-1.77C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.83.43A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.77 1.77C4.7 18.9 12 18.9 12 18.9s7.3 0 8.83-.43a2.5 2.5 0 0 0 1.77-1.77C23 15.2 23 12 23 12ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"/></svg>
      </a>
      <span class="pill pill--brand" style="align-self:center"><span class="dot dot--green"></span> 23K+ subscribers &middot; 1.9M views</span>
    </div>
  </div>
</section>

<section class="section tpl-librarysection">
  <div class="wrap">
    <div class="tpl-toolbar">
      <div class="tpl-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>
        <input type="search" id="tpl-q" placeholder="Search guides &mdash; Rhino, Cesium, Nano Banana, isochrone&hellip;" aria-label="Search guides" autocomplete="off">
      </div>
      <div class="tpl-sort">
        <label for="tpl-sort">Sort by</label>
        <select id="tpl-sort">
          <option value="suggested">Newest</option>
          <option value="az">A&ndash;Z</option>
          <option value="za">Z&ndash;A</option>
        </select>
      </div>
    </div>

    <div class="tpl-chips" role="group" aria-label="Filter by category">{chips}</div>

    <p class="tpl-count" id="tpl-count" data-noun="guide" aria-live="polite">{len(posts)} guides</p>

    <div class="grid grid--2 tpl-grid" id="tpl-grid">{"".join(post_card(p) for p in posts)}</div>
    <p class="tpl-empty" id="tpl-empty" hidden>Nothing matches that. <button class="tpl-linkbtn" type="button" id="tpl-reset">Clear the filters</button></p>
  </div>
</section>

{more_section}
{subscribe_band("")}
</main>
{footer("")}
"""


# --------------------------------------------------------------------------- #
# post
# --------------------------------------------------------------------------- #
def build_post(p: dict, posts: list[dict]) -> str:
    up = "../"
    i = posts.index(p)
    prev = posts[i - 1] if i > 0 else None
    nxt = posts[i + 1] if i < len(posts) - 1 else None
    toc = "".join(f'<li><a href="#{hid}">{txt}</a></li>' for hid, txt in p["toc"])

    rows = "".join(
        f"<div><dt>{k}</dt><dd>{E(v)}</dd></div>"
        for k, v in (("Published", pretty_date(p["published"])), ("Tools", p["tools"]),
                     ("Watch", p["duration"]), ("Reading", p["reading"])) if v
    )

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "%s",
  "description": "%s",
  "image": "%s/assets/img/blog/%s/%s",
  "url": "%s/blog/%s.html",
  "datePublished": "%s",
  "author": { "@type": "Organization", "name": "Urban Decoders" },
  "publisher": { "@type": "Organization", "name": "Urban Decoders" },
  "video": {
    "@type": "VideoObject",
    "name": "%s",
    "thumbnailUrl": "https://i.ytimg.com/vi/%s/maxresdefault.jpg",
    "uploadDate": "%s",
    "embedUrl": "https://www.youtube.com/embed/%s"
  }
}
</script>
""" % (E(p["title"]), E(p["summary"]), BASE_URL, p["slug"], p["hero"], BASE_URL, p["slug"],
       p["published"], E(p["title"]), p["video"], p["published"], p["video"])

    return f"""{head(
        f"{p['title']} — Urban Decoders",
        p["summary"], f"blog/{p['slug']}.html", up,
        f"https://i.ytimg.com/vi/{p['video']}/maxresdefault.jpg", ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head tpl-head--skill">
  <div class="wrap">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}blog.html">Blog</a><span aria-hidden="true">/</span>
      <span>{CAT_TITLE[p['cat']]}</span>
    </nav>
    <div class="tpl-skillhead">
      <div class="stack">
        <span class="eyebrow">{CAT_TITLE[p['cat']]}</span>
        <h1 class="display tpl-skilltitle">{E(p['title'])}</h1>
        <p class="lead">{E(p['summary'])}</p>
      </div>
      <dl class="tpl-meta card">{rows}</dl>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="post-video">
      <a class="yt-facade" href="https://www.youtube.com/watch?v={p['video']}" target="_blank" rel="noopener" aria-label="Watch on YouTube: {E(p['title'])}">
        <img src="https://i.ytimg.com/vi/{p['video']}/maxresdefault.jpg" alt="{E(p['title'])} &mdash; watch on YouTube" loading="lazy" width="1280" height="720">
        <span class="yt-play" aria-hidden="true"></span>
      </a>
      <p class="post-video__cap">Prefer to watch? This guide is the written version of
      <a href="https://www.youtube.com/watch?v={p['video']}" target="_blank" rel="noopener">{E(p['title'])}</a>
      &mdash; {E(p['duration'])} on the Urban Decoders channel.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="tpl-doclayout">
      <nav class="tpl-toc" aria-label="On this page">
        <p class="tpl-toc__head">On this page</p>
        <ul>{toc}</ul>
      </nav>
      <div class="tpl-doc">
        <div class="md post-body">{p['body']}</div>
      </div>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <nav class="tpl-prevnext" aria-label="More guides">
      {f'<a class="tpl-prevnext__item" href="{up}blog/{prev["slug"]}.html"><span>Newer</span><strong>{E(prev["title"])}</strong></a>' if prev else '<span></span>'}
      <a class="tpl-prevnext__all" href="{up}blog.html">All guides</a>
      {f'<a class="tpl-prevnext__item tpl-prevnext__item--next" href="{up}blog/{nxt["slug"]}.html"><span>Older</span><strong>{E(nxt["title"])}</strong></a>' if nxt else '<span></span>'}
    </nav>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="tpl-cta card card--emphasis">
      <div>
        <h2 class="section-title">Want this running on a real project?</h2>
        <p class="lead">We build these pipelines for planning, development and design teams &mdash;
        and the twins they feed. Tell us what you are working on.</p>
      </div>
      <a class="btn btn--primary btn--mono" href="{up}contact.html">Talk to the studio <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</section>

{subscribe_band(up)}
</main>
{footer(up)}
"""


# --------------------------------------------------------------------------- #
def main() -> None:
    posts = read_posts()
    if not posts:
        raise SystemExit(f"no markdown found in {SRC}")
    OUT.mkdir(parents=True, exist_ok=True)

    (SITE / "blog.html").write_text(build_index(posts), encoding="utf-8")
    print("  blog.html  (index)")
    for p in posts:
        (OUT / f"{p['slug']}.html").write_text(build_post(p, posts), encoding="utf-8")
        print(f"  blog/{p['slug']}.html")
    print(f"\n{len(posts)} posts written")


if __name__ == "__main__":
    main()
