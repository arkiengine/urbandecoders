"""Check data/schemes.geojson before publishing. Exits 1 if anything is wrong.

  python tools/validate.py

Checks: unique ids, enum values, timeline date format / stage / order, image files on disk and
`kind` values, and that meta.asOf is set. Standard library only. See docs/MAINTAINING.md.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATEGORY = {'housing', 'mixed', 'employment', 'framework', 'infrastructure', 'civic'}
STATUS = {'on-site', 'consented', 'framework', 'proposed', 'at-risk', 'delivered'}
STAGE = {'framework', 'consent', 'start', 'delivery', 'complete', 'target'}
KIND = {'aerial-cgi', 'masterplan', 'render', 'aerial-photo', 'photo'}
DATE = re.compile(r'^\d{4}(-(0[1-9]|1[0-2]))?$')
REQUIRED = ('id', 'name', 'borough', 'category', 'status', 'confidence', 'boundary_source')

gj = json.load(open(ROOT / 'data' / 'schemes.geojson', encoding='utf-8'))
errs, warns, seen = [], [], set()
if not re.match(r'^\d{4}-\d{2}-\d{2}$', str(gj.get('meta', {}).get('asOf', ''))):
    errs.append('meta.asOf missing or not YYYY-MM-DD')

for f in gj['features']:
    p = f['properties']
    sid = p.get('id', '?')
    for k in REQUIRED:
        if p.get(k) in (None, ''):
            errs.append(f'{sid}: missing {k}')
    if sid in seen:
        errs.append(f'{sid}: duplicate id')
    seen.add(sid)
    if p.get('category') not in CATEGORY:
        errs.append(f'{sid}: category {p.get("category")!r}')
    if p.get('status') not in STATUS:
        errs.append(f'{sid}: status {p.get("status")!r}')
    if f['geometry']['type'] not in ('Point', 'Polygon', 'MultiPolygon'):
        errs.append(f'{sid}: geometry {f["geometry"]["type"]}')

    tl = p.get('timeline')
    if not isinstance(tl, list) or not tl:
        errs.append(f'{sid}: timeline must be a non-empty list of {{date, stage, label}}')
    else:
        dates = [e.get('date', '') for e in tl]
        for e in tl:
            if not DATE.match(str(e.get('date', ''))):
                errs.append(f'{sid}: timeline date {e.get("date")!r}')
            if e.get('stage') not in STAGE:
                errs.append(f'{sid}: timeline stage {e.get("stage")!r}')
            if not e.get('label'):
                errs.append(f'{sid}: timeline event without label')
        if dates != sorted(dates):
            warns.append(f'{sid}: timeline not in date order (the app sorts it, but keep the file tidy)')

    imgs = p.get('images') or []
    if not imgs:
        warns.append(f'{sid}: no images')
    for im in imgs:
        if not (ROOT / im.get('src', '')).is_file():
            errs.append(f'{sid}: missing image file {im.get("src")}')
        if 'kind' in im and im['kind'] not in KIND:
            errs.append(f'{sid}: image kind {im["kind"]!r}')
        if not im.get('credit'):
            warns.append(f'{sid}: image without credit {im.get("src")}')

for w in warns:
    print('warn ', w)
for e in errs:
    print('ERROR', e)
print(f'{len(gj["features"])} schemes · {len(errs)} errors · {len(warns)} warnings')
sys.exit(1 if errs else 0)
