/* Six-layer cards — each card carries a small isometric scene of the same
   city block, drawn live on a canvas, showing just that layer: context,
   massing, mobility, environment, live data, decision. Animates only while
   on screen; a single static frame under reduced motion. No libraries. */
(function () {
  var cards = document.querySelectorAll('.fcard[data-layer]');
  if (!cards.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N = 5;

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.replace(/(.)/g, '$1$1');
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rnd = mulberry32(20260927);
  var H = [];
  for (var i = 0; i < N * N; i++) H.push(0.25 + rnd() * 0.75);
  var ROADS = [2];   // grid lines that carry traffic

  var scenes = [];
  Array.prototype.forEach.call(cards, function (card) {
    var cv = card.querySelector('canvas.fcard__cv');
    if (!cv || !cv.getContext) return;
    var col = getComputedStyle(card).getPropertyValue('--c').trim() || '#2A7B9B';
    scenes.push({ card: card, cv: cv, ctx: cv.getContext('2d'), rgb: hexToRgb(col), kind: card.getAttribute('data-layer'), vis: false, t0: Math.random() * 10 });
  });

  function draw(s, t) {
    var cv = s.cv, ctx = s.ctx, dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var r = s.rgb;
    function c(a) { return 'rgba(' + r[0] + ',' + r[1] + ',' + r[2] + ',' + a + ')'; }
    var cell = Math.min(w / (N * 1.85), h / (N * 1.25));
    var cx = w / 2, cy = h * 0.36 + cell * 0.2;
    function P(x, y, z) { return [cx + (x - y) * cell * 0.866, cy + (x + y) * cell * 0.5 - (z || 0) * cell * 1.1]; }
    function poly(pts, fill, stroke) {
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
    }
    function grid(alpha) {
      ctx.lineWidth = 1; ctx.strokeStyle = c(alpha);
      for (var i = 0; i <= N; i++) {
        var a = P(i, 0), b = P(i, N), d = P(0, i), e = P(N, i);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(d[0], d[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
      }
    }
    function block(x, y, z, inset, topA, leftA, rightA) {
      var x0 = x + inset, x1 = x + 1 - inset, y0 = y + inset, y1 = y + 1 - inset;
      var t00 = P(x0, y0, z), t10 = P(x1, y0, z), t11 = P(x1, y1, z), t01 = P(x0, y1, z);
      var b10 = P(x1, y0, 0), b11 = P(x1, y1, 0), b01 = P(x0, y1, 0);
      poly([t01, t11, b11, b01], c(leftA));            // +y face (front-left)
      poly([t10, t11, b11, b10], c(rightA));           // +x face (front-right)
      poly([t00, t10, t11, t01], c(topA));
    }
    function blocks(scale, inset, topA, leftA, rightA, skip) {
      var order = [];
      for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) order.push([x, y]);
      order.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
      order.forEach(function (p) {
        if (skip && skip(p[0], p[1])) return;
        var hz = H[p[0] * N + p[1]] * (typeof scale === 'function' ? scale(p[0], p[1]) : scale);
        if (hz > 0.02) block(p[0], p[1], hz, inset, topA, leftA, rightA);
      });
    }
    var isRoad = function (x, y) { return ROADS.indexOf(x) !== -1 || ROADS.indexOf(y) !== -1; };

    switch (s.kind) {
      case 'context': {
        grid(0.28);
        // sweeping scan row
        var row = (t * 0.9) % N, ri = Math.floor(row);
        poly([P(ri, 0), P(ri + 1, 0), P(ri + 1, N), P(ri, N)], c(0.14 + 0.1 * Math.sin(t * 6)));
        // contour lines drifting over the parcels
        ctx.lineWidth = 1.2; ctx.strokeStyle = c(0.85);
        for (var k = 0; k < 4; k++) {
          ctx.beginPath();
          for (var yy = 0; yy <= N; yy += 0.25) {
            var xx = k * 1.3 + 0.3 + Math.sin(yy * 1.4 + k + t * 0.4) * 0.35;
            var q = P(xx, yy, 0.04);
            if (yy === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
          }
          ctx.stroke();
        }
        // parcel corner ticks
        ctx.fillStyle = c(0.9);
        for (var px = 0; px <= N; px++) for (var py = 0; py <= N; py++) { var pp = P(px, py); ctx.fillRect(pp[0] - 1, pp[1] - 1, 2, 2); }
        break;
      }
      case 'massing': {
        grid(0.22);
        blocks(function (x, y) { return Math.max(0.05, 0.5 + 0.5 * Math.sin(t * 1.1 - (x + y) * 0.45)); }, 0.16, 0.95, 0.35, 0.6, isRoad);
        break;
      }
      case 'mobility': {
        grid(0.16);
        blocks(0.35, 0.22, 0.28, 0.12, 0.18, isRoad);
        // roads
        ctx.lineWidth = 2; ctx.strokeStyle = c(0.55);
        ROADS.forEach(function (rd) {
          var a = P(rd + 0.5, 0), b = P(rd + 0.5, N), d = P(0, rd + 0.5), e = P(N, rd + 0.5);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(d[0], d[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
        });
        // vehicles
        for (var v = 0; v < 8; v++) {
          var u = ((t * 0.32) + v / 8) % 1, along = u * N, q2;
          if (v % 2 === 0) q2 = P(ROADS[0] + 0.5, v % 4 === 0 ? along : N - along, 0.03);
          else q2 = P(v % 4 === 1 ? along : N - along, ROADS[0] + 0.5, 0.03);
          ctx.fillStyle = c(1); ctx.shadowColor = c(0.9); ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(q2[0], q2[1], 2.4, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
        break;
      }
      case 'environment': {
        var u2 = (t * 0.18) % 1, ang = Math.PI * (1 - u2);
        var sun = [cx + Math.cos(ang) * w * 0.42, cy - cell * 1.2 - Math.sin(ang) * h * 0.34];
        // lit ground
        poly([P(0, 0), P(N, 0), P(N, N), P(0, N)], c(0.16 + 0.08 * Math.sin(ang)));
        grid(0.2);
        // shadows: dark parallelograms cast away from the sun, longer when the sun is low
        var L = 0.35 + 1.3 * (1 - Math.sin(ang)), dxs = -Math.cos(ang) * L, dys = 0.35 * L;
        for (var sx = 0; sx < N; sx++) for (var sy = 0; sy < N; sy++) {
          if (isRoad(sx, sy)) continue;
          var hz = H[sx * N + sy] * 0.8;
          var base = [P(sx + 0.16, sy + 0.16), P(sx + 0.84, sy + 0.16), P(sx + 0.84, sy + 0.84), P(sx + 0.16, sy + 0.84)];
          var sh = base.map(function (p) { return [p[0] + dxs * hz * cell, p[1] + dys * hz * cell]; });
          poly([base[1], sh[1], sh[2], sh[3], base[3], base[2]], 'rgba(0,0,0,0.78)');
        }
        blocks(0.8, 0.16, 0.9, 0.3, 0.55, isRoad);
        // sun
        ctx.fillStyle = c(1); ctx.shadowColor = c(0.9); ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(sun[0], sun[1], 5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = c(0.35); ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.arc(cx, cy - cell * 1.2, w * 0.42, Math.PI, 0); ctx.stroke(); ctx.setLineDash([]);
        break;
      }
      case 'live': {
        grid(0.18);
        blocks(0.4, 0.2, 0.3, 0.12, 0.2, isRoad);
        // data columns on a few blocks
        var picks = [[0, 0], [1, 3], [3, 1], [4, 4], [3, 3], [0, 4]];
        picks.forEach(function (p, k) {
          var hb = 0.5 + 0.9 * Math.abs(Math.sin(t * 1.4 + k * 1.7)) + 0.15 * Math.sin(t * 7 + k);
          var b = P(p[0] + 0.5, p[1] + 0.5, H[p[0] * N + p[1]] * 0.4), tp = P(p[0] + 0.5, p[1] + 0.5, H[p[0] * N + p[1]] * 0.4 + hb);
          ctx.strokeStyle = c(0.9); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke();
          ctx.fillStyle = c(1); ctx.shadowColor = c(0.9); ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(tp[0], tp[1], 2.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        });
        // sparkline along the front edge
        ctx.strokeStyle = c(0.9); ctx.lineWidth = 1.4; ctx.beginPath();
        var a0 = P(0, N + 0.4), a1 = P(N, N + 0.4);
        for (var i2 = 0; i2 <= 24; i2++) {
          var f = i2 / 24, px2 = a0[0] + (a1[0] - a0[0]) * f, py2 = a0[1] + (a1[1] - a0[1]) * f;
          var n = Math.sin(f * 9 + t * 2.2) * 0.5 + Math.sin(f * 23 - t * 3.1) * 0.3;
          py2 -= (n + 1) * cell * 0.35;
          if (i2 === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
        }
        ctx.stroke();
        break;
      }
      case 'decision': {
        grid(0.18);
        blocks(0.35, 0.2, 0.28, 0.12, 0.18, isRoad);
        var pins = [[0, 1], [3, 0], [1, 4], [4, 3]];
        pins.forEach(function (p, k) {
          var ph = ((t * 0.28) + k * 0.25) % 1;
          var dropped = Math.min(1, ph * 3.2), ease = 1 - Math.pow(1 - dropped, 3);
          var base = P(p[0] + 0.5, p[1] + 0.5, H[p[0] * N + p[1]] * 0.35);
          var lift = (1 - ease) * cell * 2.2;
          // ring after landing
          if (ph > 0.32) {
            var rr = (ph - 0.32) * cell * 2.2, ra = Math.max(0, 0.8 - (ph - 0.32) * 1.3);
            ctx.strokeStyle = c(ra); ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.ellipse(base[0], base[1], rr, rr * 0.5, 0, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.strokeStyle = c(0.95); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(base[0], base[1] - lift); ctx.lineTo(base[0], base[1] - lift - cell * 0.9); ctx.stroke();
          ctx.fillStyle = c(1); ctx.shadowColor = c(0.9); ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(base[0], base[1] - lift - cell * 0.9, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
          ctx.fillStyle = '#050506'; ctx.beginPath(); ctx.arc(base[0], base[1] - lift - cell * 0.9, 1.2, 0, Math.PI * 2); ctx.fill();
        });
        break;
      }
    }
  }

  var raf = 0, running = false, start = 0;
  function frame(now) {
    var t = (now - start) / 1000, any = false;
    scenes.forEach(function (s) { if (s.vis) { any = true; draw(s, t + s.t0); } });
    if (any && !reduce) raf = requestAnimationFrame(frame); else running = false;
  }
  function kick() {
    if (running) return;
    running = true; start = start || performance.now();
    raf = requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var s = scenes.filter(function (x) { return x.card === en.target; })[0];
        if (!s) return;
        s.vis = en.isIntersecting;
        if (s.vis) { if (reduce) draw(s, 3 + s.t0); else kick(); }
      });
    }, { rootMargin: '60px' });
    scenes.forEach(function (s) { io.observe(s.card); });
  } else {
    scenes.forEach(function (s) { s.vis = true; });
    kick();
  }
  window.addEventListener('resize', function () { if (reduce) scenes.forEach(function (s) { draw(s, 3 + s.t0); }); });
})();
