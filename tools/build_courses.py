#!/usr/bin/env python3
"""Build the Urban Decoders courses section.

    py tools/build_courses.py

Writes  courses.html            (index: four tracks, format, waiting list, FAQ)
        courses/<slug>.html     (one page per course: outcomes, curriculum, waiting list)

Copy lives in tools/courses_catalogue.py. This file is layout only.
"""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from courses_catalogue import COURSES, FAQ, SHARED_FORMAT  # noqa: E402

SITE = Path(__file__).resolve().parent.parent
OUT = SITE / "courses"
VER = "20261117"
BASE_URL = "https://www.urbandecoders.com"
# --- Kit (ConvertKit) waiting list -----------------------------------------
# Paste the form id from Kit: Grow -> Landing Pages & Forms -> your form ->
# Embed -> HTML. The id is the number in the snippet's action URL. Until this is
# set, the form tells visitors it is not connected and points them at email.
KIT_FORM_ID = "10207727"
KIT_ACTION = f"https://app.kit.com/forms/{KIT_FORM_ID}/subscriptions"

# Custom field keys that must exist in Kit (Grow -> Subscribers -> Custom fields)
KIT_FIELDS = ["company", "role", "track_visualisation", "track_realtime_3d",
              "track_3d_twins", "track_real_estate", "note", "consent"]

E = html.escape


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
<meta property="og:type" content="website">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{up}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="{up}assets/favicon-32.png">
<link rel="apple-touch-icon" sizes="192x192" href="{up}assets/favicon-192.png">
<link rel="stylesheet" href="{up}styles.css?v={VER}">
<link rel="stylesheet" href="{up}resources/resources.css?v={VER}">
<link rel="stylesheet" href="{up}courses/courses.css?v={VER}">
{extra}</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>"""


def nav(up: str) -> str:
    return f"""<header class="nav">
  <div class="nav__inner">
    <a class="brand" href="{up}index.html" aria-label="Urban Decoders home">
      <img class="brand__wordmark" src="{up}assets/ud-wordmark%20NEW.png" alt="Urban Decoders" width="786" height="120">
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a class="nav__link" href="{up}platform.html">Platform</a>
      <a class="nav__link" href="{up}services.html">Services</a>
      <a class="nav__link" href="{up}case-studies.html">Work</a>
      <a class="nav__link" href="{up}courses.html" aria-current="page">Courses</a>
      <a class="nav__link" href="{up}resources/">Resources</a>
      <a class="nav__link" href="{up}blog.html">Blog</a>
      <a class="nav__link" href="{up}about.html">About</a>
    </nav>
    <div class="nav__cta">
      <a class="btn btn--primary btn--sm btn--mono" href="#waitlist">Join the waiting list <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</header>"""


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
        <h4>Learn</h4>
        <ul>
          <li><a href="{up}courses.html">All courses</a></li>
{"".join(f'          <li><a href="{up}courses/{c["slug"]}.html">{c["title"]}</a></li>' + chr(10) for c in COURSES)}          <li><a href="{up}blog.html">Blog</a></li>
          <li><a href="{up}resources/">Free resources</a></li>
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
<script src="{up}js/waitlist.js?v={VER}" defer></script>
</body>
</html>"""


# --------------------------------------------------------------------------- #
# the waiting-list form — shared by every page
# --------------------------------------------------------------------------- #
def waitlist(up: str, preselect: str | None = None) -> str:
    boxes = "".join(
        f"""<label class="wl-check"><input type="checkbox" name="fields[{c['field']}]" value="Yes"{' checked' if preselect == c['slug'] else ''}><span>{c['title']}</span></label>"""
        for c in COURSES
    )
    lede = ("Tell us which track you want and we will email you once it has a date and a price. "
            "Nothing is charged, nothing is committed, and the list decides what we finish first.")
    return f"""<section class="section" id="waitlist">
  <div class="wrap">
    <div class="wl">
      <div class="stack wl__intro">
        <span class="eyebrow">Waiting list</span>
        <h2 class="section-title">Be told when it opens.</h2>
        <p class="lead">{lede}</p>
        <ul class="wl__points">
          <li>No payment and no obligation.</li>
          <li>One email when a course has a date &mdash; not a drip campaign.</li>
          <li>Waiting-list members get first refusal and the launch price.</li>
          <li>Leave at any time, in one click.</li>
        </ul>
        <p class="wl__alt">Want it delivered privately to your team instead?
        <a href="{up}contact.html">Tell us about the team</a> and we will scope a workshop.</p>
      </div>

      <form class="card wl__form" id="waitlist-form" action="{KIT_ACTION}" method="POST" data-kit-form="{KIT_FORM_ID}" aria-labelledby="wl-title">
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" value="">
        <h3 id="wl-title">Join the waiting list</h3>
        <div class="wl__grid">
          <div class="field"><label for="wl-name">Full name <span class="req" aria-hidden="true">*</span></label><input id="wl-name" name="fields[first_name]" type="text" required autocomplete="name" placeholder="Your name"></div>
          <div class="field"><label for="wl-email">Email <span class="req" aria-hidden="true">*</span></label><input id="wl-email" name="email_address" type="email" required autocomplete="email" placeholder="you@practice.com"></div>
          <div class="field"><label for="wl-company">Company <span class="opt">Optional</span></label><input id="wl-company" name="fields[company]" type="text" autocomplete="organization" placeholder="Practice, developer or authority"></div>
          <div class="field"><label for="wl-role">What you do <span class="req" aria-hidden="true">*</span></label>
            <select id="wl-role" name="fields[role]" required>
              <option value="" disabled selected>Select one</option>
              <option>Architect / designer</option>
              <option>Visualiser</option>
              <option>Computational designer</option>
              <option>BIM / digital lead</option>
              <option>Developer / investor</option>
              <option>Agent / asset manager</option>
              <option>Planner / consultant</option>
              <option>Student / academic</option>
              <option>Other</option>
            </select>
          </div>
          <fieldset class="field wl__span">
            <legend>Which tracks interest you? <span class="req" aria-hidden="true">*</span></legend>
            <div class="wl__checks">{boxes}</div>
          </fieldset>
          <div class="field wl__span"><label for="wl-note">Anything we should build in? <span class="opt">Optional</span></label><textarea id="wl-note" name="fields[note]" rows="3" placeholder="The software you use, the thing you keep getting stuck on, or a team enquiry…"></textarea></div>
          <div class="field wl__span">
            <label class="wl-check wl-consent"><input type="checkbox" name="fields[consent]" value="Yes" required><span>Email me when these courses open. I can unsubscribe from any email, at any time.</span></label>
          </div>
        </div>
        <button class="btn btn--primary btn--lg btn--mono" type="submit">Join the waiting list <span class="btn__arrow" aria-hidden="true">&#8599;</span></button>
        <p class="form-status" id="waitlist-status" role="status" aria-live="polite" hidden></p>
        <p class="muted wl__small">Stored in Kit, our email platform, and used only for these courses. Never shared or sold. See how we handle your details in the <a href="{up}contact.html">contact page</a>.</p>
      </form>
    </div>
  </div>
</section>"""


# --------------------------------------------------------------------------- #
# index
# --------------------------------------------------------------------------- #
def course_card(c: dict) -> str:
    return f"""<article class="course-card card card--glow">
  <a class="course-card__shot" href="courses/{c['slug']}.html" tabindex="-1" aria-hidden="true">
    <img src="{c['hero']}" alt="" loading="lazy" width="800" height="450" decoding="async">
    <span class="course-card__no">{c['number']}</span>
  </a>
  <div class="course-card__body">
    <div class="badge-row">
      <span class="pill pill--brand"><span class="dot dot--green"></span> Waiting list</span>
      <span class="tag">{c['level']}</span>
    </div>
    <h3 class="course-card__title"><a href="courses/{c['slug']}.html">{c['title']}</a></h3>
    <p class="course-card__blurb">{c['blurb']}</p>
    <dl class="course-card__meta">
      <div><dt>Length</dt><dd>{c['length']}</dd></div>
      <div><dt>For</dt><dd>{c['audience']}</dd></div>
      <div><dt>Software</dt><dd>{c['software']}</dd></div>
    </dl>
    <div class="course-card__foot">
      <a class="btn btn--outline btn--mono btn--sm" href="courses/{c['slug']}.html">See the curriculum <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
    </div>
  </div>
</article>"""


def build_index() -> str:
    cards = "".join(course_card(c) for c in COURSES)
    fmt = "".join(
        f'<div class="fmt__item"><h3>{t}</h3><p>{d}</p></div>' for t, d in SHARED_FORMAT
    )
    faq = "".join(
        f'<details><summary>{q}<span class="plus" aria-hidden="true"></span></summary>'
        f'<div class="faq__body">{a}</div></details>' for q, a in FAQ
    )

    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Urban Decoders courses",
  "description": "Four courses on AI for visualisation, real-time 3D, urban digital twins and real estate in architecture and development.",
  "itemListElement": [%s]
}
</script>
""" % ", ".join(
        '{ "@type": "ListItem", "position": %d, "name": "%s", "url": "%s/courses/%s.html" }'
        % (i + 1, E(c["title"].replace("&amp;", "&")), BASE_URL, c["slug"])
        for i, c in enumerate(COURSES)
    )

    return f"""{head(
        "Courses — AI for visualisation, real-time 3D, twins and real estate | Urban Decoders",
        "Four practical courses on using AI in architecture and development: visualisation you "
        "can control, real-time 3D, urban digital twins, and AI for real estate and proptech. "
        "Waiting list open.",
        "courses.html", "", f"{BASE_URL}/assets/img/og-services.jpg", ld)}
{nav("")}
<main id="main">

<section class="page-head glow-top">
  <div class="wrap stack">
    <span class="eyebrow">Courses</span>
    <h1 class="display">Learn the workflows we <span class="text-red">actually ship.</span></h1>
    <p class="lead">Four tracks, built from the pipelines we run on client projects and teach on
    a channel with 23,000 subscribers. Not tool tours &mdash; methods, with the failure modes left
    in. All four are in production and open for the waiting list.</p>
    <div class="wrap-btns mt-6">
      <a class="btn btn--primary" href="#waitlist">Join the waiting list</a>
      <a class="btn btn--outline" href="#tracks">See the four tracks</a>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="course-note card">
      <span class="tag" style="color:var(--emphasis-red-bright)">Honest status</span>
      <p>These courses are being written now. There are no dates and no prices yet, and the
      waiting list is how we decide which one to finish first. Joining costs nothing and commits
      you to nothing &mdash; you will simply be the first to know.</p>
    </div>
  </div>
</section>

<section class="section" id="tracks">
  <div class="wrap">
    <div class="stack" style="max-width:54ch; margin-bottom:36px">
      <span class="eyebrow">Four tracks</span>
      <h2 class="section-title">Pick the one that matches your job.</h2>
      <p class="lead">They are separate tracks, not four levels. Two assume no technical
      background at all; two assume you already model.</p>
    </div>
    <div class="course-grid">{cards}</div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="stack" style="max-width:54ch; margin-bottom:32px">
      <span class="eyebrow">How they work</span>
      <h2 class="section-title">Built to fit around live projects.</h2>
    </div>
    <div class="fmt">{fmt}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="course-why card card--emphasis">
      <div class="stack">
        <span class="eyebrow">Why us</span>
        <h2 class="section-title">We teach what we use on Monday.</h2>
        <p class="lead">Urban Decoders is a working digital twin studio &mdash; an NVIDIA
        Inception member and Epic MegaGrants recipient &mdash; delivering twins for planning,
        development and design teams. Every module here comes out of a project that had a deadline
        and a client, which is also why we are candid about what does not work.</p>
      </div>
      <div class="course-why__links">
        <a class="btn btn--outline btn--mono btn--sm" href="case-studies.html">See the work</a>
        <a class="btn btn--outline btn--mono btn--sm" href="blog.html">Read the free guides</a>
      </div>
    </div>
  </div>
</section>

{waitlist("")}

<section class="section glow-top">
  <div class="wrap" style="max-width:860px">
    <div class="stack center" style="margin-bottom:40px; align-items:center">
      <span class="eyebrow eyebrow--plain">FAQ</span>
      <h2 class="section-title">Before you sign up.</h2>
    </div>
    <div class="faq">{faq}</div>
  </div>
</section>

</main>
{footer("")}
"""


# --------------------------------------------------------------------------- #
# course page
# --------------------------------------------------------------------------- #
def build_course(c: dict, courses: list[dict]) -> str:
    up = "../"
    i = courses.index(c)
    prev = courses[i - 1] if i > 0 else None
    nxt = courses[i + 1] if i < len(courses) - 1 else None

    outcomes = "".join(
        f'<div class="out__item"><h3>{t}</h3><p>{d}</p></div>' for t, d in c["outcomes"]
    )
    modules = "".join(
        f"""<li class="mod" id="m{n + 1}">
  <div class="mod__no">{n + 1:02d}</div>
  <div class="mod__body">
    <h3>{title}</h3>
    <ul>{"".join(f"<li>{l}</li>" for l in lessons)}</ul>
  </div>
</li>""" for n, (title, lessons) in enumerate(c["modules"])
    )
    who = "".join(
        f'<div class="who__item"><h3>{t}</h3><p>{d}</p></div>' for t, d in c["forwhom"]
    )
    toc = "".join(
        f'<li><a href="#m{n + 1}">{n + 1:02d} &nbsp;{title}</a></li>'
        for n, (title, _) in enumerate(c["modules"])
    )

    plain = c["title"].replace("&amp;", "&")
    ld = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "%s",
  "description": "%s",
  "url": "%s/courses/%s.html",
  "courseMode": "online",
  "educationalLevel": "%s",
  "provider": { "@type": "Organization", "name": "Urban Decoders", "url": "%s" }
}
</script>
""" % (E(plain), E(c["blurb"].replace("&mdash;", "—")), BASE_URL, c["slug"],
       E(c["level"].replace("→", "to")), BASE_URL)

    return f"""{head(
        f"{plain} — Course | Urban Decoders",
        c["blurb"].replace("&mdash;", "—"), f"courses/{c['slug']}.html", up,
        f"{BASE_URL}/{c['hero']}", ld)}
{nav(up)}
<main id="main">

<section class="page-head glow-top tpl-head tpl-head--skill">
  <div class="wrap">
    <nav class="tpl-crumb" aria-label="Breadcrumb">
      <a href="{up}courses.html">Courses</a><span aria-hidden="true">/</span>
      <span>Track {c['number']}</span>
    </nav>
    <div class="tpl-skillhead">
      <div class="stack">
        <div class="badge-row"><span class="pill pill--brand"><span class="dot dot--green"></span> Waiting list open</span><span class="tag">{c['level']}</span></div>
        <h1 class="display tpl-skilltitle">{c['title']}</h1>
        <p class="lead">{c['lede']}</p>
        <div class="wrap-btns mt-6"><a class="btn btn--primary" href="#waitlist">Join the waiting list</a><a class="btn btn--outline" href="#curriculum">Jump to the curriculum</a></div>
      </div>
      <dl class="tpl-meta card">
        <div><dt>Status</dt><dd>In production</dd></div>
        <div><dt>Level</dt><dd>{c['level']}</dd></div>
        <div><dt>Length</dt><dd>{c['length']}</dd></div>
        <div><dt>Format</dt><dd>Self-paced + live Q&amp;A</dd></div>
        <div><dt>Software</dt><dd>{c['software']}</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <img class="course-hero" src="{up}{c['hero']}" alt="" width="800" height="450" loading="lazy" decoding="async">
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="stack" style="max-width:54ch; margin-bottom:32px">
      <span class="eyebrow">Outcomes</span>
      <h2 class="section-title">What you will be able to do.</h2>
    </div>
    <div class="out">{outcomes}</div>
  </div>
</section>

<section class="section" id="curriculum">
  <div class="wrap">
    <div class="tpl-doclayout">
      <nav class="tpl-toc" aria-label="Modules">
        <p class="tpl-toc__head">Curriculum</p>
        <ul>{toc}</ul>
      </nav>
      <div class="tpl-doc">
        <div class="stack" style="max-width:54ch; margin-bottom:30px">
          <span class="eyebrow">Curriculum</span>
          <h2 class="section-title">{len(c['modules'])} modules.</h2>
          <p class="lead">Draft structure. It will move as we build and test the material &mdash;
          waiting-list members get told when it changes, and get a say.</p>
        </div>
        <ol class="mods">{modules}</ol>
      </div>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="wrap">
    <div class="stack" style="max-width:54ch; margin-bottom:32px">
      <span class="eyebrow">Who it is for</span>
      <h2 class="section-title">Written for people with live projects.</h2>
    </div>
    <div class="who">{who}</div>
    <div class="course-prereq card">
      <span class="tag">Prerequisites</span>
      <p>{c['prereq']}</p>
    </div>
  </div>
</section>

{waitlist(up, preselect=c['slug'])}

<section class="section--tight">
  <div class="wrap">
    <nav class="tpl-prevnext" aria-label="Other courses">
      {f'<a class="tpl-prevnext__item" href="{up}courses/{prev["slug"]}.html"><span>Track {prev["number"]}</span><strong>{prev["title"]}</strong></a>' if prev else '<span></span>'}
      <a class="tpl-prevnext__all" href="{up}courses.html">All courses</a>
      {f'<a class="tpl-prevnext__item tpl-prevnext__item--next" href="{up}courses/{nxt["slug"]}.html"><span>Track {nxt["number"]}</span><strong>{nxt["title"]}</strong></a>' if nxt else '<span></span>'}
    </nav>
  </div>
</section>

</main>
{footer(up)}
"""


# --------------------------------------------------------------------------- #
def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (SITE / "courses.html").write_text(build_index(), encoding="utf-8")
    print("  courses.html  (index)")
    for c in COURSES:
        (OUT / f"{c['slug']}.html").write_text(build_course(c, COURSES), encoding="utf-8")
        print(f"  courses/{c['slug']}.html  ({len(c['modules'])} modules)")
    print(f"\n{len(COURSES)} courses written")


if __name__ == "__main__":
    main()
