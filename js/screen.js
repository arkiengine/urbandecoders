/* Device screens — a still of a monitor, table or tablet with the twin playing in
   the glass. Two modes on the same block:

     .screen--css   bezel drawn in CSS, clip fills a 16:9 frame (no still needed)
     .screen--pin   <img class="screen__still"> plus
                    data-corners="x,y x,y x,y x,y"  (TL TR BR BL, % of the image)
                    The clip is corner-pinned onto that quad with a projective
                    transform, so an angled screen in a photo lines up exactly.

   data-clips="a.mp4|b.mp4|c.mp4" cross-fades through two stacked <video>
   elements, the way NCA sequences its parts. One clip loops. Nothing is fetched
   until the block scrolls into view, and it pauses when it leaves.
   Corners for a new still: open tools/screen-calibrate.html and drag the handles. */
(function () {
  var blocks = document.querySelectorAll('.screen[data-clips]');
  if (!blocks.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- projective transform: unit rect -> the four corners of the glass ------ */
  function gauss(A, b) {
    var n = 8, i, j, k;
    for (i = 0; i < n; i++) {
      var p = i;
      for (j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > Math.abs(A[p][i])) p = j;
      var t = A[i]; A[i] = A[p]; A[p] = t;
      var tb = b[i]; b[i] = b[p]; b[p] = tb;
      for (j = i + 1; j < n; j++) {
        var f = A[j][i] / A[i][i];
        for (k = i; k < n; k++) A[j][k] -= f * A[i][k];
        b[j] -= f * b[i];
      }
    }
    var out = new Array(n);
    for (i = n - 1; i >= 0; i--) {
      var s = b[i];
      for (j = i + 1; j < n; j++) s -= A[i][j] * out[j];
      out[i] = s / A[i][i];
    }
    return out;
  }
  function homography(src, dst) {
    var A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i][0], y = src[i][1], X = dst[i][0], Y = dst[i][1];
      A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.push(X);
      A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.push(Y);
    }
    return gauss(A, b);  /* [a,b,c, d,e,f, g,h] */
  }

  function corners(block) {
    var raw = (block.getAttribute('data-corners') || '').trim();
    if (!raw) return null;
    var pts = raw.split(/\s+/).map(function (p) { return p.split(',').map(parseFloat); });
    return pts.length === 4 && pts.every(function (p) { return p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]); }) ? pts : null;
  }

  function pin(block) {
    var pts = corners(block);
    var still = block.querySelector('.screen__still');
    var port = block.querySelector('.screen__port');
    if (!pts || !still || !port) return;
    var w = still.clientWidth, h = still.clientHeight;
    if (!w || !h) return;
    var ar = parseFloat(block.getAttribute('data-aspect')) || 16 / 9;
    var pw = Math.round(w), ph = Math.round(w / ar);
    port.style.width = pw + 'px';
    port.style.height = ph + 'px';
    var m = homography(
      [[0, 0], [pw, 0], [pw, ph], [0, ph]],
      pts.map(function (p) { return [p[0] / 100 * w, p[1] / 100 * h]; })
    );
    port.style.transform = 'matrix3d(' + [
      m[0], m[3], 0, m[6],
      m[1], m[4], 0, m[7],
      0, 0, 1, 0,
      m[2], m[5], 0, 1
    ].join(',') + ')';
  }

  /* --- playback -------------------------------------------------------------- */
  function wire(block) {
    var port = block.querySelector('.screen__port');
    var clips = block.getAttribute('data-clips').split('|')
      .map(function (s) { return s.trim(); }).filter(Boolean);
    if (!port || !clips.length) return;

    var one = clips.length === 1;
    var fade = parseInt(block.getAttribute('data-fade'), 10) || 700;
    var idx = 0, started = false, fading = false;

    /* The bezel takes the first clip's own ratio — videoWidth is corrected for a
       non-square pixel aspect, so a 1280x720 file flagged 479:244 reports 1413x720. */
    var sized = block.classList.contains('screen--pin');
    function fit(v) {
      if (sized || !v.videoWidth || !v.videoHeight) return;
      sized = true;
      block.style.setProperty('--screen-ar', v.videoWidth + ' / ' + v.videoHeight);
    }

    function mk() {
      var v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.loop = one; v.preload = 'none';
      v.setAttribute('aria-hidden', 'true');
      v.style.transitionDuration = fade + 'ms';
      v.addEventListener('loadedmetadata', function () { fit(v); });
      port.appendChild(v);
      return v;
    }
    var a = mk(), b = one ? null : mk(), cur = a;

    function load(v, i) { if (v && v.getAttribute('src') !== clips[i]) { v.src = clips[i]; v.load(); } }
    function go(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

    function swap() {
      if (fading || one) return;
      fading = true;
      var nxt = cur === a ? b : a;
      idx = (idx + 1) % clips.length;
      go(nxt);
      nxt.classList.add('is-on');
      cur.classList.remove('is-on');
      var old = cur; cur = nxt;
      setTimeout(function () {
        old.pause(); old.currentTime = 0;
        load(old, (idx + 1) % clips.length);
        fading = false;
      }, fade);
    }

    function onTime(e) {
      var v = e.target;
      if (v !== cur || one || fading || !isFinite(v.duration)) return;
      if (v.duration - v.currentTime <= fade / 1000 + 0.05) swap();
    }
    [a, b].forEach(function (v) {
      if (!v) return;
      v.addEventListener('timeupdate', onTime);
      v.addEventListener('ended', function (e) { if (e.target === cur) swap(); });
    });

    function start() {
      if (!started) {
        started = true;
        load(a, 0);
        if (b) load(b, 1 % clips.length);
        cur.classList.add('is-on');
      }
      go(cur);
      block.classList.add('is-playing');
    }
    function stop() {
      if (a) a.pause();
      if (b) b.pause();
      block.classList.remove('is-playing');
    }

    block.addEventListener('click', function () {
      if (block.classList.contains('is-playing')) stop(); else start();
    });
    block.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); block.click(); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { if (!reduce) start(); }
          else stop();
        });
      }, { rootMargin: '200px 0px', threshold: 0.15 }).observe(block);
    } else if (!reduce) {
      start();
    }
  }

  Array.prototype.forEach.call(blocks, function (block) {
    wire(block);
    if (!block.classList.contains('screen--pin')) return;
    var still = block.querySelector('.screen__still');
    var redo = function () { pin(block); };
    if (still) {
      if (still.complete) redo(); else still.addEventListener('load', redo);
    }
    if ('ResizeObserver' in window && still) new ResizeObserver(redo).observe(still);
    else window.addEventListener('resize', redo);
  });
})();
