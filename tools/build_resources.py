#!/usr/bin/env python3
"""Build the Urban Decoders free-resources section from the source skill packs and guides.

    py tools/build_resources.py

Reads   D:\\Claude Architecture Skills   (SKILL.md frontmatter, quick-reference, file tree)
Writes  resources/index.html (hub)
        resources/skills/index.html, resources/skills/<category>.html,
        resources/skills/<slug>.html
        resources/guides/index.html, resources/guides/<slug>.html
        resources/downloads/<slug>.skill  and  <slug>-example.zip

Editorial copy lives in tools/resources_catalogue.py; guides are markdown in
content/guides/. This file is layout only.
"""
from __future__ import annotations

import html
import os
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from resources_catalogue import (  # noqa: E402
    CATEGORIES, CATEGORY_ORDER, HOUSE_RULES, SITE_ROOT, SKILLS, SOFTWARE, SOURCE_ROOT,
)

CATEGORIES = sorted(CATEGORIES, key=lambda c: CATEGORY_ORDER.index(c["slug"]))
SOFTWARE_BY = {w["slug"]: w for w in SOFTWARE}

SITE = Path(SITE_ROOT)
SRC = Path(SOURCE_ROOT)
OUT = SITE / "resources"
VER = "20261116"
BASE_URL = "https://www.urbandecoders.com"

E = html.escape


# --------------------------------------------------------------------------- #
# source reading
# --------------------------------------------------------------------------- #
def read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not m:
        return {"body": text}
    fm, body = m.group(1), text[m.end():]
    out, key, buf = {}, None, []
    for line in fm.splitlines():
        km = re.match(r"^([a-zA-Z_-]+):\s*(.*)$", line)
        if km:
            if key:
                out[key] = " ".join(buf).strip()
            key = km.group(1)
            val = km.group(2).strip()
            buf = [] if val in (">-", ">", "|", "|-") else [val]
        elif key:
            buf.append(line.strip())
    if key:
        out[key] = " ".join(buf).strip()
    out["body"] = body
    return out


def human_kb(n: int) -> str:
    return f"{n / 1024:.1f} KB" if n < 1024 * 1024 else f"{n / 1048576:.1f} MB"


def plural(n: int, word: str) -> str:
    return f"{n} {word}" if n == 1 else f"{n} {word}s"


def collect(folder: str, meta: dict) -> dict:
    root = SRC / folder
    pkg_dirs = [p for p in root.iterdir() if p.is_dir()]
    if not pkg_dirs:
        raise SystemExit(f"no package folder inside {root}")
    pkg = pkg_dirs[0]
    slug = pkg.name

    fm = read_frontmatter(pkg / "SKILL.md")

    files, total = [], 0
    for p in sorted(pkg.rglob("*")):
        if p.is_file():
            size = p.stat().st_size
            total += size
            files.append((p.relative_to(pkg).as_posix(), size))

    qr = root / f"{slug}-quick-reference.md"

    # A worked example is only claimed where the pack actually ships one.
    examples = [
        p.name for p in root.iterdir()
        if p.is_file() and (p.name.startswith("example-") or p.name.endswith("-defect-key.md"))
    ]

    skillzip = root / f"{slug}.skill"
    if not skillzip.exists():
        # Newly authored skill with no packaged zip yet — build one from the folder.
        import zipfile
        with zipfile.ZipFile(skillzip, "w", zipfile.ZIP_DEFLATED) as z:
            for p in sorted(pkg.rglob("*")):
                if p.is_file():
                    z.write(p, f"{slug}/{p.relative_to(pkg).as_posix()}")
        print(f"  packaged {skillzip.name}")

    # The worked example is NOT inside the .skill (that is the installable skill
    # only), so it ships as its own zip. Rebuilt every run so it tracks edits.
    examplezip = None
    if examples:
        import zipfile
        examplezip = root / f"{slug}-example.zip"
        with zipfile.ZipFile(examplezip, "w", zipfile.ZIP_DEFLATED) as z:
            for name in sorted(examples):
                z.write(root / name, f"{slug}-example/{name}")

    return {
        **meta,
        "slug": slug,
        "folder": folder,
        "pkg": pkg,
        "name": fm.get("name", slug),
        "description": re.sub(r"\s+", " ", fm.get("description", "")).strip(),
        "files": files,
        "bytes": total,
        "qr_md": qr.read_text(encoding="utf-8", errors="replace") if qr.exists() else "",
        "has_example": bool(examples),
        "example_files": examples,
        "example_zip": examplezip,
        "example_zip_bytes": examplezip.stat().st_size if examplezip else 0,
        "zip": skillzip if skillzip.exists() else None,
        "zip_bytes": skillzip.stat().st_size if skillzip.exists() else 0,
    }


# --------------------------------------------------------------------------- #
# minimal markdown -> html (covers what the quick-reference files use)
# --------------------------------------------------------------------------- #
def inline(s: str) -> str:
    s = E(s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    # relative and in-page links stay in the tab
    s = re.sub(r"\[([^\]]+)\]\((?!https?://)([^)\s]+)\)", r'<a href="\2">\1</a>', s)
    return s


def slugify(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = re.sub(r"[^\w\s-]", "", s.lower())
    return re.sub(r"[\s_]+", "-", s).strip("-")


def md_to_html(md: str, drop_h1: bool = True) -> tuple[str, list[tuple[str, str]]]:
    """Return (html, toc) where toc is [(id, text), ...] for h2 headings."""
    lines = md.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    toc: list[tuple[str, str]] = []
    i, n = 0, len(lines)
    first_h1_seen = False

    def close(stack: list[str]) -> None:
        while stack:
            out.append(f"</{stack.pop()}>")

    liststack: list[str] = []

    while i < n:
        raw = lines[i]
        line = raw.rstrip()

        # fenced code
        if line.startswith("```"):
            close(liststack)
            lang = line[3:].strip()
            i += 1
            buf = []
            while i < n and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            code = E("\n".join(buf))
            cls = f' class="lang-{E(lang)}"' if lang else ""
            out.append(
                '<div class="codeblock"><button class="codeblock__copy" type="button" '
                'data-copy>Copy</button><pre><code%s>%s</code></pre></div>' % (cls, code)
            )
            continue

        # table
        if line.startswith("|") and i + 1 < n and re.match(r"^\|[\s:|-]+\|$", lines[i + 1].strip()):
            close(liststack)
            def cells(r: str) -> list[str]:
                return [c.strip() for c in r.strip().strip("|").split("|")]
            head = cells(line)
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append(cells(lines[i]))
                i += 1
            th = "".join(f"<th>{inline(c)}</th>" for c in head)
            body = "".join(
                "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in rows
            )
            out.append(
                f'<div class="tablewrap"><table class="mdtable"><thead><tr>{th}</tr></thead>'
                f"<tbody>{body}</tbody></table></div>"
            )
            continue

        # blockquote
        if line.startswith(">"):
            close(liststack)
            buf = []
            while i < n and lines[i].lstrip().startswith(">"):
                buf.append(lines[i].lstrip()[1:].strip())
                i += 1
            out.append(f'<blockquote class="mdquote"><p>{inline(" ".join(buf).strip())}</p></blockquote>')
            continue

        # hr
        if re.match(r"^(---|\*\*\*|___)\s*$", line):
            close(liststack)
            out.append('<hr class="divider md-hr">')
            i += 1
            continue

        # headings
        hm = re.match(r"^(#{1,4})\s+(.*)$", line)
        if hm:
            close(liststack)
            level, text = len(hm.group(1)), hm.group(2).strip()
            if level == 1:
                if drop_h1 and not first_h1_seen:
                    first_h1_seen = True
                    i += 1
                    continue
                level = 2
            hid = slugify(text)
            if level == 2:
                toc.append((hid, re.sub(r"<[^>]+>", "", inline(text))))
                out.append(f'<h2 id="{hid}" class="md-h2">{inline(text)}</h2>')
            elif level == 3:
                out.append(f'<h3 id="{hid}" class="md-h3">{inline(text)}</h3>')
            else:
                out.append(f'<h4 class="md-h4">{inline(text)}</h4>')
            i += 1
            continue

        # lists
        lm = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", raw)
        if lm:
            indent = len(lm.group(1))
            ordered = lm.group(2).endswith(".")
            want = "ol" if ordered else "ul"
            depth = indent // 2
            while len(liststack) > depth + 1:
                out.append(f"</{liststack.pop()}>")
            if len(liststack) == depth + 1 and liststack[-1] != want:
                out.append(f"</{liststack.pop()}>")
            if len(liststack) < depth + 1:
                cls = ' class="md-list"' if not liststack else ""
                out.append(f"<{want}{cls}>")
                liststack.append(want)
            text = lm.group(3).strip()
            j = i + 1
            while j < n and lines[j].strip() and not re.match(r"^(\s*)([-*]|\d+\.)\s+", lines[j]) \
                    and not lines[j].startswith(("#", "|", ">", "```")) \
                    and len(lines[j]) - len(lines[j].lstrip()) > indent:
                text += " " + lines[j].strip()
                j += 1
            out.append(f"<li>{inline(text)}</li>")
            i = j
            continue

        if not line.strip():
            close(liststack)
            i += 1
            continue

        # paragraph
        close(liststack)
        buf = [line.strip()]
        i += 1
        while i < n and lines[i].strip() and not re.match(
                r"^(#{1,4}\s|\s*([-*]|\d+\.)\s|\||>|```|---)", lines[i]):
            buf.append(lines[i].strip())
            i += 1
        out.append(f'<p>{inline(" ".join(buf))}</p>')

    close(liststack)
    return "\n".join(out), toc


# --------------------------------------------------------------------------- #
# chrome
# --------------------------------------------------------------------------- #
def head(title: str, desc: str, canon: str, up: str, extra: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{BASE_URL}/{canon}">
<meta property="og:type" content="website">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{BASE_URL}/assets/img/og-work.jpg">
<link rel="icon" href="{up}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="{up}assets/favicon-32.png">
<link rel="apple-touch-icon" sizes="192x192" href="{up}assets/favicon-192.png">
<link rel="stylesheet" href="{up}styles.css?v={VER}">
<link rel="stylesheet" href="{up}resources/resources.css?v={VER}">
{extra}</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>"""


def nav(up: str, current: bool = True) -> str:
    cur = ' aria-current="page"' if current else ""
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
      <a class="nav__link" href="{up}resources/"{cur}>Resources</a>
      <a class="nav__link" href="{up}blog.html">Blog</a>
      <a class="nav__link" href="{up}about.html">About</a>
    </nav>
    <div class="nav__cta">
      <a class="btn btn--primary btn--sm btn--mono" href="{up}contact.html">Start a twin <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</header>"""


def disclaimer() -> str:
    return """<div class="tpl-disclaimer" role="note">
  <span class="tpl-disclaimer__tag">Read first</span>
  <p>These skills assist qualified practitioners. They replace neither the architect of
  record nor the approving authority. Every figure, clause and citation they surface is
  marked for you to verify — treat an unverified output as a question, not an answer.</p>
</div>"""


def rail(up: str, active: str, counts: dict) -> str:
    items = "".join(
        '<li><a class="tpl-rail__link{act}" href="{up}resources/skills/{slug}.html">{title}'
        '<span class="tpl-rail__n">{n}</span></a></li>'.format(
            act=" is-active" if c["slug"] == active else "",
            up=up, slug=c["slug"], title=E(c["title"]), n=counts[c["slug"]],
        )
        for c in CATEGORIES
    )
    return f"""<aside class="tpl-rail" aria-label="Skill categories">
  <div class="tpl-rail__inner">
    <p class="tpl-rail__head">What you're working on</p>
    <ul class="tpl-rail__list">
      <li><a class="tpl-rail__link{' is-active' if active == 'all' else ''}" href="{up}resources/skills/">All skills<span class="tpl-rail__n">{sum(counts.values())}</span></a></li>
      {items}
    </ul>
    <p class="tpl-rail__head tpl-rail__head--spaced">Elsewhere</p>
    <ul class="tpl-rail__list">
      <li><a class="tpl-rail__link" href="{up}platform.html">Twin platform</a></li>
      <li><a class="tpl-rail__link" href="{up}contact.html">Talk to the studio</a></li>
    </ul>
  </div>
</aside>"""


def footer(up: str) -> str:
    return f"""<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="{up}index.html" aria-label="Urban Decoders home">
          <img class="brand__wordmark" src="{up}assets/ud-wordmark%20NEW.png" alt="Urban Decoders" width="786" height="120">
        </a>
        <p>Urban digital twin studio for planning, development and design. Stockport, Greater Manchester, working across the UK and internationally.</p>
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
      <div class="footer__skills">
        <h4>Free resources</h4>
        <ul>
          <li><a href="{up}resources/">All resources</a></li>
          <li><a href="{up}resources/skills/">Skills library</a></li>
          <li><a href="{up}resources/guides/">Guides &amp; how-tos</a></li>
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
    </div>
  </div>
</footer>
<script src="{up}resources/resources.js?v={VER}" defer></script>
</body>
</html>"""


# --------------------------------------------------------------------------- #
# cards
# --------------------------------------------------------------------------- #
def software_of(s: dict) -> list[dict]:
    """The software entries a skill sits beside, in SOFTWARE order, first one primary."""
    slugs = s.get("software") or ["claude"]
    unknown = [w for w in slugs if w not in SOFTWARE_BY]
    if unknown:
        raise SystemExit(f"{s['title']}: unknown software {unknown}")
    return [SOFTWARE_BY[w] for w in slugs]


def card(s: dict, up: str, cat_title: str) -> str:
    sw = software_of(s)
    tags = "".join(f'<span class="tag">{E(t)}</span>' for t in s["tags"][:2])
    swpills = "".join(
        f'<span class="tag tag--sw" data-sw="{w["slug"]}">{E(w["label"])}</span>' for w in sw[:2]
    )
    haystack = " ".join(
        [s["title"], s["blurb"], s["output"], *s["tags"], cat_title,
         *(w["title"] for w in sw)]
    ).lower()
    return f"""<article class="tpl-card card card--glow" data-cat="{s['category']}" data-sw="{" ".join(w["slug"] for w in sw)}" data-title="{E(s['title'].lower())}" data-search="{E(haystack)}">
  <div class="tpl-card__top">
    <span class="tpl-card__type">{E(s['output'])}</span>
    <span class="tpl-card__cat">{E(cat_title)}</span>
  </div>
  <h3 class="tpl-card__title"><a href="{up}resources/skills/{s['slug']}.html">{E(s['title'])}</a></h3>
  <p class="tpl-card__blurb">{E(s['blurb'])}</p>
  <div class="tpl-card__sw">{swpills}</div>
  <div class="tpl-card__foot">
    <div class="tpl-card__tags">{tags}</div>
    <a class="btn btn--outline btn--mono btn--sm" href="{up}resources/skills/{s['slug']}.html">Open <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
  </div>
</article>"""


# --------------------------------------------------------------------------- #
# pages
# --------------------------------------------------------------------------- #
def build_index(skills: list[dict], counts: dict) -> str:
    cat_title = {c["slug"]: c["title"] for c in CATEGORIES}
    up = "../../"

    cat_cards = "".join(f"""<a class="tpl-cat card card--glow" href="{up}resources/skills/{c['slug']}.html">
  <span class="tpl-cat__n">{counts[c['slug']]}</span>
  <h3 class="tpl-cat__title">{E(c['title'])}</h3>
  <p class="tpl-cat__blurb">{E(c['blurb'])}</p>
  <span class="tpl-cat__go" aria-hidden="true">&#8599;</span>
</a>""" for c in CATEGORIES)

    tabs = '<button class="chip" type="button" data-filter="all" aria-pressed="true"><i aria-hidden="true"></i>All <span class="chip__n">%d</span></button>' % len(skills)
    tabs += "".join(
        '<button class="chip" type="button" data-filter="{slug}" aria-pressed="false"><i aria-hidden="true"></i>{t} <span class="chip__n">{n}</span></button>'.format(
            slug=c["slug"], t=E(c["title"]), n=counts[c["slug"]])
        for c in CATEGORIES
    )

    swcounts = {
        w["slug"]: sum(1 for s in skills if w["slug"] in (s.get("software") or ["claude"]))
        for w in SOFTWARE
    }
    swtabs = '<button class="chip chip--sw" type="button" data-sw="all" aria-pressed="true">Any software <span class="chip__n">%d</span></button>' % len(skills)
    swtabs += "".join(
        '<button class="chip chip--sw" type="button" data-sw="{slug}" aria-pressed="false" title="{note}">{t} <span class="chip__n">{n}</span></button>'.format(
            slug=w["slug"], t=E(w["title"]), n=swcounts[w["slug"]], note=E(w["note"]))
        for w in SOFTWARE if swcounts[w["slug"]]
    )

    swlegend = "".join(
        f'<div class="tpl-swrow"><dt>{E(w["title"])} <span>{swcounts[w["slug"]]}</span></dt>'
        f"<dd>{E(w['note'])}</dd></div>"
        for w in SOFTWARE if swcounts[w["slug"]]
    )

    cards = "".join(card(s, up, cat_title[s["category"]]) for s in skills)

    rules = "".join(
        f'<div class="tpl-rule"><h3>{E(t)}</h3><p>{d}</p></div>' for t, d in HOUSE_RULES
    )

    n, ncat = len(skills), len(CATEGORIES)
    topics = ", ".join(c["title"].lower() for c in CATEGORIES[:-1]) + \
        f" and {CATEGORIES[-1]['title'].lower()}"

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Claude Skills for Architecture",
  "description": "%d installable Claude skills for architectural and urban design practice, across %d categories, from site due diligence to contract administration and digital twin handover.",
  "url": "%s/resources/skills/",
  "isPartOf": { "@type": "WebSite", "name": "Urban Decoders", "url": "%s/" },
  "publisher": { "@type": "Organization", "name": "Urban Decoders" }
}
</script>
""" % (n, ncat, BASE_URL, BASE_URL)

    return f"""{head(
        "Claude Skills for Architecture — Urban Decoders",
        f"{n} installable Claude skills for architectural and urban design practice, across "
        f"{ncat} categories: {topics}. Free to download, no account and no API key.",
        "resources/skills/", up, ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head">
  <div class="wrap stack">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}resources/">Free resources</a><span aria-hidden="true">/</span><span>Skills</span>
    </nav>
    <span class="eyebrow">Skills library</span>
    <h1 class="display">Claude skills for <span class="text-red">architecture.</span></h1>
    <p class="lead">{n} skills we built for our own practice, packaged so you can install them in
    minutes. Each one takes the material you already have — a brief, a transcript, a DXF, a tender,
    a drawing set, an IFC — and returns something you can issue. None of them invent a figure, a
    clause or a standard: what the evidence does not support stays visibly blank.</p>
    <div class="wrap-btns">
      <a class="btn btn--brand btn--mono" href="#library">Browse the library <span class="btn__arrow" aria-hidden="true">&#8595;</span></a>
      <a class="btn btn--outline btn--mono" href="#how">How to install</a>
    </div>
    <div class="statstrip">
      <div><div class="statstrip__n">{n}</div><div class="statstrip__l">Skills</div></div>
      <div><div class="statstrip__n">{ncat}</div><div class="statstrip__l">Categories</div></div>
      <div><div class="statstrip__n">RIBA 0&ndash;7</div><div class="statstrip__l">Stage coverage</div></div>
      <div><div class="statstrip__n is-red">0</div><div class="statstrip__l">Figures from memory</div></div>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">{disclaimer()}</div>
</section>

<section class="section" id="categories">
  <div class="wrap">
    <div class="stack" style="max-width:52ch; margin-bottom:40px">
      <span class="eyebrow">By the work</span>
      <h2 class="section-title">What are you working on?</h2>
      <p class="lead">{ncat} parts of the week. Pick the one you are in &mdash; or filter the
      library below by the software you already have open.</p>
    </div>
    <div class="grid grid--4 tpl-catgrid">{cat_cards}</div>
  </div>
</section>

<hr class="divider">

<section class="section" id="how">
  <div class="wrap">
    <div class="stack" style="max-width:52ch; margin-bottom:40px">
      <span class="eyebrow">Install</span>
      <h2 class="section-title">Three steps, no account.</h2>
      <p class="lead">A skill is a folder of instructions Claude reads when the conversation matches.
      No API key, no plugin, nothing to configure.</p>
    </div>
    <div class="grid grid--3">
      <div class="tpl-step card">
        <span class="tpl-step__n">01</span>
        <h3>Download the skill</h3>
        <p>Open any skill below and download its <code>.skill</code> file — a zip of the instructions
        and reference material, usually under 20&nbsp;KB.</p>
      </div>
      <div class="tpl-step card">
        <span class="tpl-step__n">02</span>
        <h3>Open it in Claude</h3>
        <p>Drop the <code>.skill</code> file into a Claude conversation and save it, or unzip the
        folder into <code>.claude/skills/</code> for Claude Code.</p>
      </div>
      <div class="tpl-step card">
        <span class="tpl-step__n">03</span>
        <h3>Put it to work</h3>
        <p>It loads itself when your conversation matches. Where a skill bundles a worked example,
        run it on that first and score the result against the defect key.</p>
      </div>
    </div>
  </div>
</section>

<section class="section tpl-librarysection" id="library">
  <div class="wrap">
    <div class="tpl-layout">
      {rail(up, "all", counts)}
      <div class="tpl-main">
        <div class="stack" style="margin-bottom:32px">
          <span class="eyebrow">The library</span>
          <h2 class="section-title">All {n} skills.</h2>
          <p class="lead">Every one shares the same discipline: a confident wrong figure is
          indistinguishable from a right one once it is in a file.</p>
        </div>

        <div class="tpl-toolbar">
          <div class="tpl-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>
            <input type="search" id="tpl-q" placeholder="Search skills — brief, DXF, tender, facade…" aria-label="Search skills" autocomplete="off">
          </div>
          <div class="tpl-sort">
            <label for="tpl-sort">Sort by</label>
            <select id="tpl-sort">
              <option value="suggested">Suggested</option>
              <option value="az">A&ndash;Z</option>
              <option value="za">Z&ndash;A</option>
            </select>
          </div>
        </div>

        <div class="tpl-filter">
          <p class="tpl-filter__label" id="tpl-filter-cat">By the work</p>
          <div class="tpl-chips" role="group" aria-labelledby="tpl-filter-cat">{tabs}</div>
        </div>
        <div class="tpl-filter">
          <p class="tpl-filter__label" id="tpl-filter-sw">By software</p>
          <div class="tpl-chips tpl-chips--sw" role="group" aria-labelledby="tpl-filter-sw">{swtabs}</div>
        </div>

        <p class="tpl-count" id="tpl-count" aria-live="polite">{n} skills</p>

        <div class="grid grid--2 tpl-grid" id="tpl-grid">{cards}</div>
        <p class="tpl-empty" id="tpl-empty" hidden>Nothing matches that. <button type="button" id="tpl-reset" class="tpl-linkbtn">Clear the filters</button></p>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<section class="section" id="software">
  <div class="wrap">
    <div class="stack" style="max-width:56ch; margin-bottom:40px">
      <span class="eyebrow">By software</span>
      <h2 class="section-title">What you need open.</h2>
      <p class="lead">Every skill names the software it sits beside, so you can filter the library
      by what is already on your machine. Most need nothing but Claude and the file you already
      have. Nothing here requires an API key.</p>
    </div>
    <dl class="tpl-swlegend">{swlegend}</dl>
  </div>
</section>

<hr class="divider">

<section class="section" id="house-rules">
  <div class="wrap">
    <div class="stack" style="max-width:56ch; margin-bottom:40px">
      <span class="eyebrow">House rules</span>
      <h2 class="section-title">The same discipline in all {n}.</h2>
      <p class="lead">Because the same failure keeps costing money: a confident wrong figure is
      indistinguishable from a right one once it is in a file. A clean-looking output is usually the
      failure mode.</p>
    </div>
    <div class="tpl-rules">{rules}</div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="tpl-cta card card--emphasis">
      <div>
        <h2 class="section-title">Want these wired into your own stack?</h2>
        <p class="lead">We build the same discipline into digital twins, Revit and Rhino pipelines and
        Unreal front ends. Tell us what the week actually looks like.</p>
      </div>
      <a class="btn btn--primary btn--mono" href="{up}contact.html">Book a scoping call <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</section>

</main>
{footer(up)}
"""


def build_category(cat: dict, skills: list[dict], counts: dict) -> str:
    up = "../../"
    cat_title = {c["slug"]: c["title"] for c in CATEGORIES}
    mine = [s for s in skills if s["category"] == cat["slug"]]
    cards = "".join(card(s, up, cat_title[s["category"]]) for s in mine)
    others = "".join(
        f'<a class="pill pill--brand" href="{up}resources/skills/{c["slug"]}.html">{E(c["title"])} <span>{counts[c["slug"]]}</span></a>'
        for c in CATEGORIES if c["slug"] != cat["slug"]
    )

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Skills library", "item": "%s/resources/skills/" },
    { "@type": "ListItem", "position": 2, "name": "%s", "item": "%s/resources/skills/%s.html" }
  ]
}
</script>
""" % (BASE_URL, E(cat["title"]), BASE_URL, cat["slug"])

    return f"""{head(
        f"{cat['title']} — Claude Skills for Architecture — Urban Decoders",
        f"{len(mine)} Claude skills for {cat['title'].lower()} in architectural practice. {cat['blurb']} "
        "Free to download, with the install line and the full quick reference on every page.",
        f"resources/skills/{cat['slug']}.html", up, ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head tpl-head--cat">
  <div class="wrap stack">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}resources/">Free resources</a><span aria-hidden="true">/</span>
      <a href="{up}resources/skills/">Skills</a><span aria-hidden="true">/</span><span>{E(cat['title'])}</span>
    </nav>
    <span class="eyebrow">{E(cat['nav'])}</span>
    <h1 class="display">{E(cat['display'][0])}<span class="text-red">{E(cat['display'][1])}</span></h1>
    <p class="lead">{E(cat['lede'])}</p>
    <p class="tpl-headcount"><strong>{len(mine)}</strong> skills in this part of the work</p>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">{disclaimer()}</div>
</section>

<section class="section tpl-librarysection">
  <div class="wrap">
    <div class="tpl-layout">
      {rail(up, cat['slug'], counts)}
      <div class="tpl-main">
        <div class="grid grid--2 tpl-grid">{cards}</div>

        <hr class="divider" style="margin-block:var(--space-8)">

        <div class="stack">
          <span class="eyebrow">Also in the library</span>
          <h2 class="section-title" style="font-size:28px">Filed elsewhere</h2>
          <div class="tpl-pillrow">{others}</div>
          <p><a class="btn btn--outline btn--mono btn--sm" href="{up}resources/skills/">Back to the library</a></p>
        </div>
      </div>
    </div>
  </div>
</section>

</main>
{footer(up)}
"""


def file_tree(files: list[tuple[str, int]]) -> str:
    rows = []
    for rel, size in files:
        parts = rel.split("/")
        depth = len(parts) - 1
        rows.append(
            f'<li class="tpl-file" style="--d:{depth}">'
            f'<span class="tpl-file__name">{E(parts[-1])}</span>'
            f'<span class="tpl-file__dir">{E("/".join(parts[:-1]) + "/") if depth else ""}</span>'
            f'<span class="tpl-file__size">{human_kb(size)}</span></li>'
        )
    return "".join(rows)


def build_skill(s: dict, skills: list[dict]) -> str:
    up = "../../"
    cat = next(c for c in CATEGORIES if c["slug"] == s["category"])
    siblings = [x for x in skills if x["category"] == s["category"]]
    idx = siblings.index(s)
    prev = siblings[idx - 1] if idx > 0 else None
    nxt = siblings[idx + 1] if idx < len(siblings) - 1 else None

    body, toc = md_to_html(s["qr_md"])
    toc_html = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in toc)

    sw = software_of(s)
    swpills = "".join(
        f'<a class="tag tag--sw" href="{up}resources/skills/?sw={w["slug"]}">{E(w["label"])}</a>'
        for w in sw
    )
    swnotes = "".join(
        f'<div class="tpl-swrow"><dt>{E(w["title"])}</dt><dd>{E(w["note"])}</dd></div>' for w in sw
    )

    dl = f"../downloads/{s['slug']}.skill"
    dirs = sorted({f.rsplit("/", 1)[0] for f, _ in s["files"] if "/" in f})
    dirnote = ", ".join(E(d) + "/" for d in dirs) if dirs else "no subfolders"

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "%s",
  "alternateName": "%s",
  "description": "%s",
  "codeSampleType": "full solution",
  "programmingLanguage": "Claude Skill",
  "url": "%s/resources/skills/%s.html",
  "author": { "@type": "Organization", "name": "Urban Decoders" },
  "license": "Proprietary",
  "isPartOf": { "@type": "CollectionPage", "name": "Claude Skills for Architecture", "url": "%s/resources/skills/" }
}
</script>
""" % (E(s["title"]), E(s["name"]), E(s["blurb"]), BASE_URL, s["slug"], BASE_URL)

    return f"""{head(
        f"{s['title']} — Claude skill for architecture — Urban Decoders",
        s["blurb"],
        f"resources/skills/{s['slug']}.html", up, ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head tpl-head--skill">
  <div class="wrap">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}resources/">Free resources</a><span aria-hidden="true">/</span>
      <a href="{up}resources/skills/">Skills</a><span aria-hidden="true">/</span>
      <a href="{up}resources/skills/{cat['slug']}.html">{E(cat['title'])}</a><span aria-hidden="true">/</span>
      <span><code>{E(s['name'])}</code></span>
    </nav>
    <div class="tpl-skillhead">
      <div class="stack">
        <span class="eyebrow">{E(s['output'])}</span>
        <h1 class="display tpl-skilltitle">{E(s['title'])}</h1>
        <p class="lead">{E(s['blurb'])}</p>
        <p class="tpl-callline">Once installed, Claude loads it on its own when the conversation
        matches. You can also call it directly with <code>/{E(s['name'])}</code>.</p>
        <div class="wrap-btns">
          <a class="btn btn--brand btn--mono" href="{dl}" download>Download .skill <span class="btn__arrow" aria-hidden="true">&#8595;</span></a>
          <a class="btn btn--outline btn--mono" href="#quick-reference">Read the quick reference</a>
        </div>
      </div>
      <dl class="tpl-meta card">
        <div><dt>Category</dt><dd><a href="{up}resources/skills/{cat['slug']}.html">{E(cat['title'])}</a></dd></div>
        <div><dt>Software</dt><dd class="tpl-meta__tags">{swpills}</dd></div>
        <div><dt>Output</dt><dd>{E(s['output'])}</dd></div>
        <div><dt>Package</dt><dd>{plural(len(s['files']), 'file')} &middot; {human_kb(s['bytes'])}</dd></div>
        <div><dt>Download</dt><dd>{human_kb(s['zip_bytes'])} zip</dd></div>
        <div><dt>Worked example</dt><dd>{f'<a href="../downloads/{s["slug"]}-example.zip" download>{plural(len(s["example_files"]), "file")} &middot; {human_kb(s["example_zip_bytes"])}</a>' if s['has_example'] else 'Not bundled'}</dd></div>
        <div><dt>Tags</dt><dd class="tpl-meta__tags">{"".join(f'<span class="tag">{E(t)}</span>' for t in s["tags"])}</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">{disclaimer()}</div>
</section>

<section class="section" id="install">
  <div class="wrap">
    <div class="tpl-twocol">
      <div>
        <span class="eyebrow">Install</span>
        <h2 class="section-title" style="margin-top:var(--space-4)">Install just this one.</h2>
        <p class="lead" style="margin-top:var(--space-4)">Two routes. Both end with Claude loading the
        skill by itself when your conversation matches.</p>
      </div>
      <div class="tpl-install">
        <div class="tpl-install__block">
          <h3><span class="tpl-install__n">A</span> Claude app, Chat or Cowork</h3>
          <ol class="md-list">
            <li>Download <code>{E(s['slug'])}.skill</code> below.</li>
            <li>Open Claude, go to <strong>Settings &rarr; Capabilities &rarr; Skills</strong> and upload the file.</li>
            <li>Start a conversation and attach your material. The skill loads itself on a match.</li>
          </ol>
          <a class="btn btn--ghost btn--mono btn--sm" href="{dl}" download>{E(s['slug'])}.skill &middot; {human_kb(s['zip_bytes'])}</a>
        </div>
        <div class="tpl-install__block">
          <h3><span class="tpl-install__n">B</span> Claude Code, in your project</h3>
          <p>Unzip the package into your skills folder, then restart Claude Code.</p>
          <div class="codeblock">
            <button class="codeblock__copy" type="button" data-copy>Copy</button>
            <pre><code>mkdir -p .claude/skills &amp;&amp; unzip {E(s['slug'])}.skill -d .claude/skills/</code></pre>
          </div>
          <p class="tpl-fine">Use <code>~/.claude/skills/</code> instead to install it for every project.</p>
        </div>
      </div>
    </div>
    <div class="tpl-swneed card">
      <div class="tpl-swneed__head">
        <span class="eyebrow">What you need open</span>
        <p>Beyond Claude itself and the material you are working from.</p>
      </div>
      <dl class="tpl-swlegend tpl-swlegend--tight">{swnotes}</dl>
    </div>
  </div>
</section>

<hr class="divider">

<section class="section" id="at-a-glance">
  <div class="wrap">
    <div class="stack" style="max-width:52ch; margin-bottom:40px">
      <span class="eyebrow">At a glance</span>
      <h2 class="section-title">What it takes, what you get.</h2>
    </div>
    <div class="grid grid--3 tpl-glance">
      <div class="card tpl-glance__box">
        <h3>It takes</h3>
        <p>{E(s['takes'])}</p>
      </div>
      <div class="card tpl-glance__box">
        <h3>You get</h3>
        <p>{s['gives'].replace('`', '')}</p>
      </div>
      <div class="card tpl-glance__box tpl-glance__box--red">
        <h3>It will not</h3>
        <p>{E(s['wont'])}</p>
      </div>
    </div>
    <div class="tpl-example">
      <span class="tag">{'Test drive' if (s['has_example'] or s.get('example_note')) else 'Design note'}</span>
      <p>{E(s['example'])}{'. ' + E(s['example_note']) if s.get('example_note') else ('. Run the skill on the example input, then score your output against the defect key &mdash; it lists what was planted and what a good run does with it.' if s['has_example'] else '. No worked example is bundled with this one yet; run it on live project material.')}</p>
      {f'<a class="btn btn--outline btn--mono btn--sm" href="../downloads/{s["slug"]}-example.zip" download>Worked example <span class="btn__arrow" aria-hidden="true">&#8595;</span></a>' if s['has_example'] else ''}
    </div>
  </div>
</section>

<hr class="divider">

<section class="section" id="quick-reference">
  <div class="wrap">
    <div class="tpl-doclayout">
      <nav class="tpl-toc" aria-label="On this page">
        <p class="tpl-toc__head">On this page</p>
        <ul>{toc_html}</ul>
        <p class="tpl-toc__head tpl-toc__head--spaced">Jump to</p>
        <ul>
          <li><a href="#install">Install</a></li>
          <li><a href="#files">Files on disk</a></li>
          <li><a href="#trigger">When it triggers</a></li>
        </ul>
      </nav>
      <div class="tpl-doc">
        <span class="eyebrow">Quick reference</span>
        <h2 class="section-title" style="margin:var(--space-4) 0 var(--space-6)">How to run it.</h2>
        <div class="md">{body}</div>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<section class="section" id="trigger">
  <div class="wrap">
    <div class="tpl-twocol">
      <div>
        <span class="eyebrow">Triggering</span>
        <h2 class="section-title" style="margin-top:var(--space-4)">When Claude reaches for it.</h2>
        <p class="lead" style="margin-top:var(--space-4)">This is the description Claude itself reads to
        decide whether the skill applies. It is worth knowing, because it tells you exactly how to
        phrase the ask — and what the skill will decline.</p>
      </div>
      <div class="tpl-triggerbox card">
        <p class="tpl-triggerbox__name"><code>{E(s['name'])}</code></p>
        <p>{E(s['description'])}</p>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<section class="section" id="files">
  <div class="wrap">
    <div class="tpl-twocol">
      <div>
        <span class="eyebrow">Package</span>
        <h2 class="section-title" style="margin-top:var(--space-4)">Files it puts on your disk.</h2>
        <p class="lead" style="margin-top:var(--space-4)">{plural(len(s['files']), 'file')}, {human_kb(s['bytes'])} unzipped,
        under <code>.claude/skills/{E(s['slug'])}/</code>. Reference material loads only when the skill
        needs it &mdash; {dirnote}.</p>
        <p><a class="btn btn--outline btn--mono btn--sm" href="{dl}" download>Download the package <span class="btn__arrow" aria-hidden="true">&#8595;</span></a></p>
      </div>
      <div class="tpl-tree card">
        <p class="tpl-tree__root"><code>.claude/skills/{E(s['slug'])}/</code></p>
        <ul class="tpl-tree__list">{file_tree(s['files'])}</ul>
      </div>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <nav class="tpl-prevnext" aria-label="More in this category">
      {f'<a class="tpl-prevnext__item" href="{up}resources/skills/{prev["slug"]}.html"><span>Previous</span><strong>{E(prev["title"])}</strong></a>' if prev else '<span></span>'}
      <a class="tpl-prevnext__all" href="{up}resources/skills/{cat['slug']}.html">All {E(cat['title'])}</a>
      {f'<a class="tpl-prevnext__item tpl-prevnext__item--next" href="{up}resources/skills/{nxt["slug"]}.html"><span>Next</span><strong>{E(nxt["title"])}</strong></a>' if nxt else '<span></span>'}
    </nav>
  </div>
</section>

</main>
{footer(up)}
"""


# --------------------------------------------------------------------------- #
# guides
# --------------------------------------------------------------------------- #
GUIDES_DIR = SITE / "content" / "guides"


def read_guides() -> list[dict]:
    """Every .md in content/guides/, newest first. Frontmatter carries the metadata."""
    out = []
    if not GUIDES_DIR.exists():
        return out
    for path in sorted(GUIDES_DIR.glob("*.md")):
        fm = read_frontmatter(path)
        body, toc = md_to_html(fm["body"], drop_h1=False)
        out.append({
            "slug": fm.get("slug", path.stem),
            "title": fm.get("title", path.stem),
            "group": fm.get("group", "Guides"),
            "summary": fm.get("summary", ""),
            "software": fm.get("software", ""),
            "level": fm.get("level", ""),
            "reading": fm.get("reading", ""),
            "diagram": fm.get("diagram", ""),
            "updated": fm.get("updated", ""),
            "body": body,
            "toc": toc,
            "path": path,
        })
    out.sort(key=lambda g: (g["group"] != "Start here", g["group"], g["title"]))
    return out


def guide_card(g: dict, up: str) -> str:
    meta = " &middot; ".join(x for x in (E(g["software"]), E(g["reading"])) if x)
    return f"""<article class="tpl-card card card--glow" data-group="{E(g['group'])}" data-search="{E((g['title'] + ' ' + g['summary'] + ' ' + g['software'] + ' ' + g['group']).lower())}">
  <div class="tpl-card__top">
    <span class="tpl-card__type">{E(g['group'])}</span>
    <span class="tpl-card__cat">{E(g['level'])}</span>
  </div>
  <h3 class="tpl-card__title"><a href="{up}resources/guides/{g['slug']}.html">{E(g['title'])}</a></h3>
  <p class="tpl-card__blurb">{E(g['summary'])}</p>
  <div class="tpl-card__foot">
    <div class="tpl-card__tags"><span class="tag">{meta}</span></div>
    <a class="btn btn--outline btn--mono btn--sm" href="{up}resources/guides/{g['slug']}.html">Read <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
  </div>
</article>"""


def build_guides_index(guides: list[dict]) -> str:
    up = "../../"
    groups: dict[str, list[dict]] = {}
    for g in guides:
        groups.setdefault(g["group"], []).append(g)

    sections = "".join(f"""
<section class="section" id="{slugify(name)}">
  <div class="wrap">
    <div class="stack" style="max-width:52ch; margin-bottom:32px">
      <span class="eyebrow">{E(name)}</span>
      <h2 class="section-title">{E(name)}.</h2>
    </div>
    <div class="grid grid--2 tpl-grid">{"".join(guide_card(g, up) for g in items)}</div>
  </div>
</section>""" for name, items in groups.items())

    return f"""{head(
        "Guides & how-tos — Urban Decoders",
        f"{len(guides)} free guides for architects and urban designers: connecting Revit, QGIS "
        "and other software to Claude with MCP, installing skills, and the setup that actually works.",
        "resources/guides/", up)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head tpl-head--cat">
  <div class="wrap stack">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}resources/">Free resources</a><span aria-hidden="true">/</span><span>Guides</span>
    </nav>
    <span class="eyebrow">Guides &amp; how-tos</span>
    <h1 class="display">Setup that actually <span class="text-red">works.</span></h1>
    <p class="lead">Installation instructions and working notes from our own machines — connecting
    design software to Claude, installing skills, and the small things that stop any of it
    working. Every config on these pages is one we run, with personal paths generalised.</p>
    <p class="tpl-headcount"><strong>{len(guides)}</strong> guides</p>
  </div>
</section>
{sections}

<section class="section--tight">
  <div class="wrap">
    <div class="tpl-cta card card--emphasis">
      <div>
        <h2 class="section-title">Something you want covered?</h2>
        <p class="lead">We write these when the setup costs us a day. Tell us which one cost you
        one and it goes on the list.</p>
      </div>
      <a class="btn btn--primary btn--mono" href="{up}contact.html">Get in touch <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</section>

</main>
{footer(up)}
"""


def diagram_fig(g: dict, up: str) -> str:
    """The connection diagram at the top of a setup guide, when one exists."""
    if not g.get("diagram"):
        return ""
    cap = (f"Claude talks to {E(g['software'])} over MCP: tool calls out, model state back. "
           f"What installs where is in the steps below.")
    svg = g["diagram"].endswith(".svg")
    dims = 'width="1200" height="440"' if svg else 'width="1600" height="686"'
    return (f'<figure class="guide-fig">'
            f'<img src="{up}assets/img/mcp/{E(g["diagram"])}" alt="{E(g["title"])} — connection diagram" '
            f'{dims} loading="eager" decoding="async">'
            f'<figcaption>{cap}</figcaption></figure>')


def build_guide(g: dict, guides: list[dict]) -> str:
    up = "../../"
    idx = guides.index(g)
    prev = guides[idx - 1] if idx > 0 else None
    nxt = guides[idx + 1] if idx < len(guides) - 1 else None
    toc_html = "".join(f'<li><a href="#{i}">{tx}</a></li>' for i, tx in g["toc"])

    meta_rows = "".join(
        f"<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>"
        for k, v in (("Software", g["software"]), ("Level", g["level"]),
                     ("Reading", g["reading"]), ("Updated", g["updated"])) if v
    )

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "%s",
  "description": "%s",
  "url": "%s/resources/guides/%s.html",
  "dateModified": "%s",
  "author": { "@type": "Organization", "name": "Urban Decoders" },
  "publisher": { "@type": "Organization", "name": "Urban Decoders" }
}
</script>
""" % (E(g["title"]), E(g["summary"]), BASE_URL, g["slug"], E(g["updated"]))

    return f"""{head(
        f"{g['title']} — Urban Decoders",
        g["summary"], f"resources/guides/{g['slug']}.html", up, ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head tpl-head--skill">
  <div class="wrap">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}resources/">Free resources</a><span aria-hidden="true">/</span>
      <a href="{up}resources/guides/">Guides</a><span aria-hidden="true">/</span>
      <span>{E(g['group'])}</span>
    </nav>
    <div class="tpl-skillhead">
      <div class="stack">
        <span class="eyebrow">{E(g['group'])}</span>
        <h1 class="display tpl-skilltitle">{E(g['title'])}</h1>
        <p class="lead">{E(g['summary'])}</p>
      </div>
      <dl class="tpl-meta card">{meta_rows}</dl>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="tpl-doclayout">
      <nav class="tpl-toc" aria-label="On this page">
        <p class="tpl-toc__head">On this page</p>
        <ul>{toc_html}</ul>
      </nav>
      <div class="tpl-doc">
        {diagram_fig(g, up)}
        <div class="md">{g['body']}</div>
      </div>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <nav class="tpl-prevnext" aria-label="More guides">
      {f'<a class="tpl-prevnext__item" href="{up}resources/guides/{prev["slug"]}.html"><span>Previous</span><strong>{E(prev["title"])}</strong></a>' if prev else '<span></span>'}
      <a class="tpl-prevnext__all" href="{up}resources/guides/">All guides</a>
      {f'<a class="tpl-prevnext__item tpl-prevnext__item--next" href="{up}resources/guides/{nxt["slug"]}.html"><span>Next</span><strong>{E(nxt["title"])}</strong></a>' if nxt else '<span></span>'}
    </nav>
  </div>
</section>

</main>
{footer(up)}
"""


# --------------------------------------------------------------------------- #
# the hub
# --------------------------------------------------------------------------- #
def build_hub(skills: list[dict], counts: dict, guides: list[dict]) -> str:
    up = "../"
    n, ncat, ng = len(skills), len(CATEGORIES), len(guides)

    cat_pills = "".join(
        f'<a class="pill pill--brand" href="{up}resources/skills/{c["slug"]}.html">{E(c["title"])} <span>{counts[c["slug"]]}</span></a>'
        for c in CATEGORIES)

    guide_groups: dict[str, int] = {}
    for g in guides:
        guide_groups[g["group"]] = guide_groups.get(g["group"], 0) + 1
    guide_pills = "".join(
        f'<a class="pill pill--brand" href="{up}resources/guides/#{slugify(gname)}">{E(gname)} <span>{c}</span></a>'
        for gname, c in guide_groups.items())

    latest = "".join(guide_card(g, up) for g in guides[:4])

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free resources — Urban Decoders",
  "description": "%d Claude skills for architectural and urban design practice, and %d setup guides. Free to download.",
  "url": "%s/resources/",
  "isPartOf": { "@type": "WebSite", "name": "Urban Decoders", "url": "%s/" },
  "publisher": { "@type": "Organization", "name": "Urban Decoders" }
}
</script>
""" % (n, ng, BASE_URL, BASE_URL)

    return f"""{head(
        "Free resources — Claude skills and setup guides for architects — Urban Decoders",
        f"{n} free Claude skills for architectural and urban design practice across {ncat} "
        f"categories, plus {ng} guides on connecting Revit, QGIS and other software to Claude. "
        "No account, no API key.",
        "resources/", up, ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head">
  <div class="wrap stack">
    <span class="eyebrow">Free resources</span>
    <h1 class="display">Everything we built for <span class="text-red">ourselves.</span></h1>
    <p class="lead">The tools and notes we use in the studio, packaged so you can use them too.
    Claude skills that take the material you already have &mdash; a brief, a transcript, a DXF, a
    tender, a drawing set, an IFC &mdash; and return something you can issue. And the setup guides
    that make any of it work. Free, no account, no API key.</p>
    <div class="statstrip">
      <div><div class="statstrip__n">{n}</div><div class="statstrip__l">Skills</div></div>
      <div><div class="statstrip__n">{ng}</div><div class="statstrip__l">Guides</div></div>
      <div><div class="statstrip__n">{n}</div><div class="statstrip__l">Worked examples</div></div>
      <div><div class="statstrip__n is-red">0</div><div class="statstrip__l">Figures from memory</div></div>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">{disclaimer()}</div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid grid--2 tpl-sections">

      <a class="tpl-section card card--glow" href="{up}resources/skills/">
        <span class="tpl-section__n">{n}</span>
        <h2 class="tpl-section__title">Skills</h2>
        <p class="tpl-section__blurb">Installable Claude skills for architectural and urban design
        practice, across {ncat} parts of the week &mdash; site and brief through to contract
        administration, carbon and digital twin handover. Each ships a worked example with defects
        planted in it, so you can score your own run before you trust it.</p>
        <span class="tpl-section__go" aria-hidden="true">&#8599;</span>
      </a>

      <a class="tpl-section card card--glow" href="{up}resources/guides/">
        <span class="tpl-section__n">{ng}</span>
        <h2 class="tpl-section__title">Guides &amp; how-tos</h2>
        <p class="tpl-section__blurb">Installation instructions and working notes &mdash; connecting
        Revit, QGIS and other design software to Claude with MCP, installing skills, and the small
        things that stop any of it working. Every config is one we run on our own machines.</p>
        <span class="tpl-section__go" aria-hidden="true">&#8599;</span>
      </a>

    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap stack">
    <span class="eyebrow">Skills by the work</span>
    <div class="tpl-pillrow">{cat_pills}</div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap stack">
    <span class="eyebrow">Guides by topic</span>
    <div class="tpl-pillrow">{guide_pills}</div>
  </div>
</section>

<hr class="divider">

<section class="section">
  <div class="wrap">
    <div class="stack" style="max-width:52ch; margin-bottom:40px">
      <span class="eyebrow">Latest guides</span>
      <h2 class="section-title">Start here.</h2>
      <p class="lead">If you have not connected software to Claude before, the first one is the
      one to read.</p>
    </div>
    <div class="grid grid--2 tpl-grid">{latest}</div>
  </div>
</section>

<hr class="divider">

<section class="section" id="house-rules">
  <div class="wrap">
    <div class="stack" style="max-width:56ch; margin-bottom:40px">
      <span class="eyebrow">House rules</span>
      <h2 class="section-title">The same discipline in all {n}.</h2>
      <p class="lead">Because the same failure keeps costing money: a confident wrong figure is
      indistinguishable from a right one once it is in a file. A clean-looking output is usually
      the failure mode.</p>
    </div>
    <div class="tpl-rules">{"".join(f'<div class="tpl-rule"><h3>{E(t)}</h3><p>{d}</p></div>' for t, d in HOUSE_RULES)}</div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="tpl-cta card card--emphasis">
      <div>
        <h2 class="section-title">Want these wired into your own stack?</h2>
        <p class="lead">We build the same discipline into digital twins, Revit and Rhino pipelines
        and Unreal front ends. Tell us what the week actually looks like.</p>
      </div>
      <a class="btn btn--primary btn--mono" href="{up}contact.html">Book a scoping call <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</section>

</main>
{footer(up)}
"""


# --------------------------------------------------------------------------- #
def main() -> None:
    order = list(SKILLS.keys())
    skills = [collect(folder, SKILLS[folder]) for folder in order]
    by_cat_order = {c["slug"]: i for i, c in enumerate(CATEGORIES)}
    skills.sort(key=lambda s: (by_cat_order[s["category"]], order.index(s["folder"])))

    counts = {c["slug"]: sum(1 for s in skills if s["category"] == c["slug"]) for c in CATEGORIES}

    guides = read_guides()

    (OUT / "skills").mkdir(parents=True, exist_ok=True)
    (OUT / "guides").mkdir(parents=True, exist_ok=True)
    (OUT / "downloads").mkdir(parents=True, exist_ok=True)

    # Category and skill pages share one folder — assert the slugs cannot collide.
    cat_slugs = {c["slug"] for c in CATEGORIES}
    skill_slugs = {s["slug"] for s in skills}
    clash = cat_slugs & skill_slugs
    if clash:
        raise SystemExit(f"slug collision between categories and skills: {sorted(clash)}")

    (OUT / "index.html").write_text(build_hub(skills, counts, guides), encoding="utf-8")
    print("  resources/index.html  (hub)")

    (OUT / "skills" / "index.html").write_text(build_index(skills, counts), encoding="utf-8")
    print("  resources/skills/index.html")

    for c in CATEGORIES:
        (OUT / "skills" / f"{c['slug']}.html").write_text(build_category(c, skills, counts), encoding="utf-8")
        print(f"  resources/skills/{c['slug']}.html  ({counts[c['slug']]} skills)")

    for s in skills:
        (OUT / "skills" / f"{s['slug']}.html").write_text(build_skill(s, skills), encoding="utf-8")
        if s["zip"]:
            shutil.copy2(s["zip"], OUT / "downloads" / f"{s['slug']}.skill")
        if s["example_zip"]:
            shutil.copy2(s["example_zip"], OUT / "downloads" / f"{s['slug']}-example.zip")
        print(f"  resources/skills/{s['slug']}.html")

    (OUT / "guides" / "index.html").write_text(build_guides_index(guides), encoding="utf-8")
    print("  resources/guides/index.html")
    for g in guides:
        (OUT / "guides" / f"{g['slug']}.html").write_text(build_guide(g, guides), encoding="utf-8")
        print(f"  resources/guides/{g['slug']}.html")

    total = 1 + 1 + len(CATEGORIES) + len(skills) + 1 + len(guides)
    print(f"\n{len(skills)} skills in {len(CATEGORIES)} categories, {len(guides)} guides, "
          f"{total} pages written to {OUT}")


if __name__ == "__main__":
    main()
