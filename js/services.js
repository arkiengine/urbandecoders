/* Consultation demo — click to drop a comment pin. Local-only, nothing stored. */
(function () {
  var box = document.getElementById('consult');
  if (!box) return;
  var statsEl = document.getElementById('consult-stats');
  var tip = document.getElementById('consult-tip');
  var form = document.getElementById('consult-form');
  var input = document.getElementById('consult-input');

  var pins = [
    { x: 27, y: 46, s: 'support', t: 'Love the riverside path — please keep the mature trees.' },
    { x: 63, y: 58, s: 'concern', t: 'Worried about parking overspill on event days.' },
    { x: 47, y: 30, s: 'idea',    t: 'Could the corner by the bridge take a small playground?' }
  ];
  var pending = null;
  var LABEL = { support: 'Support', concern: 'Concern', idea: 'Idea' };

  function renderStats() {
    var c = { support: 0, concern: 0, idea: 0 };
    pins.forEach(function (p) { c[p.s]++; });
    statsEl.innerHTML =
      '<span class="consult__stat"><b>' + pins.length + '</b> comments</span>' +
      '<span class="consult__stat" style="color:#58c98a"><b>' + c.support + '</b> support</span>' +
      '<span class="consult__stat" style="color:var(--emphasis-red-bright)"><b>' + c.concern + '</b> concerns</span>' +
      '<span class="consult__stat" style="color:var(--brand-blue)"><b>' + c.idea + '</b> ideas</span>';
  }

  function showTip(pin, el) {
    tip.innerHTML = '<span class="tag">' + LABEL[pin.s] + '</span><br>' + pin.t.replace(/</g, '&lt;');
    tip.style.opacity = '1';
    var bw = box.clientWidth;
    tip.style.left = Math.min(bw - 300, Math.max(8, el.offsetLeft + 14)) + 'px';
    tip.style.top = Math.max(8, el.offsetTop - 14 - tip.offsetHeight) + 'px';
  }
  function hideTip() { tip.style.opacity = '0'; }

  function addPin(pin) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'consult__pin consult__pin--' + pin.s;
    b.style.left = pin.x + '%';
    b.style.top = pin.y + '%';
    b.setAttribute('aria-label', LABEL[pin.s] + ' comment: ' + pin.t);
    b.addEventListener('mouseenter', function () { showTip(pin, b); });
    b.addEventListener('focus', function () { showTip(pin, b); });
    b.addEventListener('mouseleave', hideTip);
    b.addEventListener('blur', hideTip);
    b.addEventListener('click', function (e) { e.stopPropagation(); showTip(pin, b); });
    box.appendChild(b);
  }

  function closeForm() { form.style.display = 'none'; pending = null; }

  box.addEventListener('click', function (e) {
    if (form.contains(e.target) || e.target.classList.contains('consult__pin')) return;
    var r = box.getBoundingClientRect();
    pending = { x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 };
    hideTip();
    form.style.display = 'block';
    form.style.left = Math.min(r.width - 275, Math.max(8, e.clientX - r.left + 12)) + 'px';
    form.style.top = Math.min(r.height - 150, Math.max(8, e.clientY - r.top + 12)) + 'px';
    input.value = '';
    input.focus();
  });
  form.addEventListener('click', function (e) { e.stopPropagation(); });

  Array.prototype.forEach.call(form.querySelectorAll('.consult__stance'), function (btn) {
    btn.addEventListener('click', function () {
      var text = input.value.trim();
      if (!text || !pending) { input.focus(); return; }
      var pin = { x: pending.x, y: pending.y, s: btn.dataset.stance, t: text };
      pins.push(pin);
      addPin(pin);
      renderStats();
      closeForm();
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeForm(); });

  pins.forEach(addPin);
  renderStats();
})();

/* Mini masterplan configurator — a browser toy version of the Arki workflow.
   Sliders drive a seeded layout solver; the canvas renders the massing in
   isometric projection and the panel reports the recomputed numbers.
   Draws only on input — no idle animation. */
(function () {
  var scene = document.getElementById('cfg-scene');
  var canvas = document.getElementById('cfg-canvas');
  if (!scene || !canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var W = 220, D = 150;                 // plot, metres
  var PLOT = W * D;
  var seed = 7;
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var inputs = {
    far:   document.getElementById('cfg-far'),
    depth: document.getElementById('cfg-depth'),
    floor: document.getElementById('cfg-floor'),
    green: document.getElementById('cfg-green')
  };
  var outs = {
    far: document.getElementById('cfg-far-v'), depth: document.getElementById('cfg-depth-v'),
    floor: document.getElementById('cfg-floor-v'), green: document.getElementById('cfg-green-v')
  };
  var stats = {
    plot: document.getElementById('cfg-s-plot'), gfa: document.getElementById('cfg-s-gfa'),
    far: document.getElementById('cfg-s-far'), count: document.getElementById('cfg-s-count'),
    tall: document.getElementById('cfg-s-tall'), cov: document.getElementById('cfg-s-cov'),
    green: document.getElementById('cfg-s-green')
  };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-GB'); };

  var model = { buildings: [], park: null, gfa: 0 };

  function solve() {
    var rnd = mulberry32(seed);
    var far = +inputs.far.value, depth = +inputs.depth.value;
    var floorH = +inputs.floor.value, green = +inputs.green.value / 100;

    var bw = Math.min(depth * 1.35, 34);
    var setback = 8, street = 12;

    // Central park, clamped so a buildable perimeter band always survives
    var gw = Math.min(W * Math.sqrt(green), Math.max(20, W - 2 * (setback + depth + 6)));
    var gd = Math.min(D * Math.sqrt(green), Math.max(20, D - 2 * (setback + depth + 6)));
    var park = { x: -gw / 2, z: -gd / 2, w: gw, d: gd };

    // Perimeter-block layout: rows along the long edges, columns closing the ends
    var rowZ = D / 2 - setback - depth / 2;
    var colX = W / 2 - setback - bw / 2;
    var cells = [];
    for (var x = -colX; x <= colX + 0.01; x += bw + street) {
      cells.push({ x: x + (rnd() - 0.5) * 3, z: -rowZ + (rnd() - 0.5) * 2, raw: 0.65 + rnd() * 0.7 });
      cells.push({ x: x + (rnd() - 0.5) * 3, z:  rowZ + (rnd() - 0.5) * 2, raw: 0.65 + rnd() * 0.7 });
    }
    for (var z = -rowZ + depth + street; z <= rowZ - depth - street + 0.01; z += depth + street) {
      cells.push({ x: -colX + (rnd() - 0.5) * 2, z: z + (rnd() - 0.5) * 3, raw: 0.65 + rnd() * 0.7 });
      cells.push({ x:  colX + (rnd() - 0.5) * 2, z: z + (rnd() - 0.5) * 3, raw: 0.65 + rnd() * 0.7 });
    }

    var fp = bw * depth, target = far * PLOT;
    var sumRaw = 0;
    cells.forEach(function (c) { sumRaw += fp * c.raw; });
    var k = sumRaw ? target / sumRaw : 0;

    var gfa = 0, tallest = 0;
    model.buildings = cells.map(function (c) {
      var floors = Math.max(1, Math.min(34, Math.round(c.raw * k)));
      gfa += fp * floors;
      tallest = Math.max(tallest, floors);
      return { x: c.x, z: c.z, w: bw, d: depth, h: floors * floorH, floors: floors };
    });
    model.park = park;
    model.gfa = gfa;

    stats.plot.textContent = fmt(PLOT) + ' m²';
    stats.gfa.textContent = fmt(gfa) + ' m²';
    stats.far.textContent = (gfa / PLOT).toFixed(2) + ' / ' + far.toFixed(1);
    stats.count.textContent = String(model.buildings.length);
    stats.tall.textContent = tallest + ' floors · ' + Math.round(tallest * floorH) + ' m';
    stats.cov.textContent = Math.round(model.buildings.length * fp / PLOT * 100) + '%';
    stats.green.textContent = fmt(gw * gd) + ' m² · ' + Math.round(gw * gd / PLOT * 100) + '%';
  }

  var yaw = 0.5;
  function draw() {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var s = Math.min(w, h) / 340, hs = s * 0.9;
    var cx = w / 2, czy = h * 0.52;
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    function P(x, y, z) {
      var xr = x * cy + z * sy, zr = -x * sy + z * cy;
      return [cx + (xr - zr) * 0.866 * s, czy + (xr + zr) * 0.5 * s - y * hs];
    }
    function quad(a, b, c, d, fill) {
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
    }

    // plot slab
    var p1 = P(-W/2, 0, -D/2), p2 = P(W/2, 0, -D/2), p3 = P(W/2, 0, D/2), p4 = P(-W/2, 0, D/2);
    quad(p1, p2, p3, p4, 'rgba(47,138,169,0.06)');
    ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]); ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]);

    // park
    var pk = model.park;
    if (pk) {
      var g1 = P(pk.x, 0.3, pk.z), g2 = P(pk.x + pk.w, 0.3, pk.z),
          g3 = P(pk.x + pk.w, 0.3, pk.z + pk.d), g4 = P(pk.x, 0.3, pk.z + pk.d);
      quad(g1, g2, g3, g4, 'rgba(74,168,110,0.22)');
      ctx.strokeStyle = 'rgba(120,220,160,0.35)'; ctx.stroke();
    }

    // buildings, painter-sorted back to front
    var maxH = 0;
    model.buildings.forEach(function (b) { maxH = Math.max(maxH, b.h); });
    var list = model.buildings.slice().sort(function (a, b) {
      return ((a.x * cy + a.z * sy) + (-a.x * sy + a.z * cy)) - ((b.x * cy + b.z * sy) + (-b.x * sy + b.z * cy));
    });
    list.forEach(function (b) {
      var x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, z0 = b.z - b.d / 2, z1 = b.z + b.d / 2;
      var c000 = P(x0, 0, z0), c100 = P(x1, 0, z0), c110 = P(x1, 0, z1), c010 = P(x0, 0, z1);
      var t000 = P(x0, b.h, z0), t100 = P(x1, b.h, z0), t110 = P(x1, b.h, z1), t010 = P(x0, b.h, z1);
      // vertical faces with outward normals facing the viewer (nxr + nzr > 0)
      var faces = [
        { n: [0, -1], q: [c000, c100, t100, t000] },   // -z face
        { n: [1, 0],  q: [c100, c110, t110, t100] },   // +x face
        { n: [0, 1],  q: [c110, c010, t010, t110] },   // +z face
        { n: [-1, 0], q: [c010, c000, t000, t010] }    // -x face
      ];
      faces.forEach(function (f) {
        var nxr = f.n[0] * cy + f.n[1] * sy, nzr = -f.n[0] * sy + f.n[1] * cy;
        if (nxr + nzr <= 0) return;
        var lum = 96 + 70 * Math.max(0, nxr);
        quad(f.q[0], f.q[1], f.q[2], f.q[3], 'rgb(' + Math.round(lum * 0.72) + ',' + Math.round(lum * 0.95) + ',' + Math.round(lum * 1.18) + ')');
      });
      quad(t000, t100, t110, t010, 'rgb(214,235,255)');
      if (b.h === maxH && maxH > 0) {                 // tallest gets the emphasis edge
        ctx.strokeStyle = 'rgba(255,90,95,0.9)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(t000[0], t000[1]); ctx.lineTo(t100[0], t100[1]);
        ctx.lineTo(t110[0], t110[1]); ctx.lineTo(t010[0], t010[1]); ctx.closePath(); ctx.stroke();
        ctx.lineWidth = 1;
      }
    });
  }

  function update() {
    outs.far.textContent = (+inputs.far.value).toFixed(1);
    outs.depth.textContent = inputs.depth.value;
    outs.floor.textContent = (+inputs.floor.value).toFixed(1);
    outs.green.textContent = inputs.green.value;
    solve(); draw();
  }

  Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener('input', update); });
  document.getElementById('cfg-generate').addEventListener('click', function () { seed++; update(); });

  var drag = null;
  scene.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, yaw: yaw };
    scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', function (e) {
    if (!drag) return;
    yaw = drag.yaw + (e.clientX - drag.x) * 0.006;
    draw();
  });
  function end() { drag = null; }
  scene.addEventListener('pointerup', end);
  scene.addEventListener('pointercancel', end);
  scene.addEventListener('lostpointercapture', end);
  scene.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { yaw -= 0.12; draw(); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { yaw += 0.12; draw(); e.preventDefault(); }
  });
  window.addEventListener('resize', draw);

  update();
})();
