"""Curate proposal imagery for schemes: stage candidate images, review contact sheets, then apply.

  python tools/curate_images.py stage candidates.json [more.json ...]
  python tools/curate_images.py apply [reject ...]

Candidates JSON: { "<scheme id>": [ { "img", "page", "kind", "caption", "credit" }, ... ] }, best first.
`kind` is one of aerial-cgi | masterplan | render | aerial-photo | photo. See docs/IMAGES.md.

stage  downloads up to 3 images per scheme, re-encodes to JPEG (max 1600 px), writes a manifest
       and contact sheets (sheetN.jpg) to the staging folder. Nothing in the app changes.
apply  copies staged images into assets/images/<id>/NN.jpg and rewrites properties.images.
       Rejects: '<id>' drops that scheme's new set (it keeps its current images), '<id>:<n>' drops one image.
       Schemes with no staged images are left untouched.

Staging folder: %TEMP%/gm-masterplans-stage, or set GM_STAGE. Needs Pillow (AVIF/WebP read support: Pillow >= 11).
"""
import io, json, os, shutil, sys, tempfile, time, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
GJ = ROOT / 'data' / 'schemes.geojson'
STAGE = Path(os.environ.get('GM_STAGE') or Path(tempfile.gettempdir()) / 'gm-masterplans-stage')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
MAX_PX, MIN_W, PER_SCHEME = 1600, 700, 3
LICENCE = 'all rights reserved — research use with attribution'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'image/avif,image/webp,image/*,*/*', 'Referer': url})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def stage(paths):
    cands = {}
    for p in paths:
        cands.update(json.load(open(p, encoding='utf-8')))
    manifest = {}
    for sid, items in cands.items():
        d = STAGE / sid
        d.mkdir(parents=True, exist_ok=True)
        for old in d.glob('*.jpg'):
            old.unlink()
        out = []
        for c in items[:PER_SCHEME]:
            try:
                im = Image.open(io.BytesIO(get(c['img'])))
                im.load()
                if im.mode not in ('RGB', 'L'):
                    im = im.convert('RGB')
                if im.width < MIN_W:
                    print(f'{sid}: too small {im.size}')
                    continue
                im.thumbnail((MAX_PX, MAX_PX))
                n = len(out) + 1
                im.save(d / f'{n:02d}.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
                out.append({**c, 'px': list(im.size), 'n': n})
            except Exception as e:
                print(f'{sid}: failed {c["img"][:90]} ({e})')
            time.sleep(0.3)
        manifest[sid] = out
        print(f'{sid:28s} {len(out)}', flush=True)
    json.dump(manifest, open(STAGE / 'manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    sheets(manifest)
    print(f'staged in {STAGE} — review sheet*.jpg, then run apply')


def sheets(manifest, per=12):
    ids = [s for s in manifest if manifest[s]]
    W, H = 300, 200
    for k in range(0, len(ids), per):
        chunk = ids[k:k + per]
        sheet = Image.new('RGB', (W * PER_SCHEME + 180, H * len(chunk)), (20, 20, 20))
        dr = ImageDraw.Draw(sheet)
        for r, sid in enumerate(chunk):
            dr.text((6, r * H + 8), sid, fill=(255, 255, 255))
            for c in manifest[sid]:
                im = Image.open(STAGE / sid / f"{c['n']:02d}.jpg")
                im.thumbnail((W - 6, H - 22))
                x = 180 + (c['n'] - 1) * W
                sheet.paste(im, (x, r * H + 18))
                dr.text((x, r * H + 4), f"{c['n']} {c['kind']}", fill=(90, 205, 255))
        sheet.save(STAGE / f'sheet{k // per}.jpg', quality=80)


def apply(reject):
    manifest = json.load(open(STAGE / 'manifest.json', encoding='utf-8'))
    drop_all = {r for r in reject if ':' not in r}
    drop_one = {tuple(r.split(':')) for r in reject if ':' in r}
    gj = json.load(open(GJ, encoding='utf-8'))
    changed = 0
    for f in gj['features']:
        p = f['properties']
        sid = p['id']
        new = [] if sid in drop_all else [c for c in manifest.get(sid, []) if (sid, str(c['n'])) not in drop_one]
        if not new:
            continue
        d = ROOT / 'assets' / 'images' / sid
        d.mkdir(parents=True, exist_ok=True)
        for old in d.glob('*.jpg'):
            old.unlink()
        imgs = []
        for i, c in enumerate(new, 1):
            shutil.copy(STAGE / sid / f"{c['n']:02d}.jpg", d / f'{i:02d}.jpg')
            imgs.append({'src': f'assets/images/{sid}/{i:02d}.jpg', 'kind': c['kind'], 'caption': c['caption'], 'credit': c['credit'],
                         'source_url': c['page'], 'licence': LICENCE, 'px': c['px']})
        p['images'] = imgs
        changed += 1
    json.dump(gj, open(GJ, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('updated', changed, 'schemes')


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ('stage', 'apply'):
        sys.exit(__doc__)
    stage(sys.argv[2:]) if sys.argv[1] == 'stage' else apply(sys.argv[2:])
