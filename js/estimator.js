/* Scope estimator — inputs map to a tier (Site / District / City), an
   indicative timeline band and the modules involved. Never a price.
   The summary is kept in localStorage so the contact form can prefill. */
(function () {
  var KEY = 'ud-estimate';

  function estimate(v) {
    var tier, n, weeks, base, next;
    if (v.area < 5) {
      tier = 'Site'; n = 1; weeks = [3, 5];
      base = 'Context, massing, web explorer';
      next = 'Send your site boundary (GeoJSON, DXF or a red-line PDF)';
    } else if (v.area <= 100) {
      tier = 'District'; n = 2; weeks = [6, 8];
      base = 'Context, massing, mobility, web explorer';
      next = 'Send your GIS extent and any existing masterplan';
    } else {
      tier = 'City'; n = 3; weeks = [10, 14];
      base = 'Context, massing, mobility, environment, web explorer';
      next = 'Send a data inventory: GIS, feeds, planning portal';
    }
    var added = [];
    if (v.lod === '3') { weeks[0] += 2; weeks[1] += 3; added.push('LOD 3 facades'); }
    if (v.lod === '1') { weeks[0] = Math.max(2, weeks[0] - 1); weeks[1] = Math.max(3, weeks[1] - 1); }
    if (v.buildings > 1500 && n < 3) { weeks[0] += 1; weeks[1] += 2; }
    if (v.feeds) { weeks[0] += 2; weeks[1] += 2; added.push('Live feeds'); }
    if (v.scenarios) { weeks[0] += 1; weeks[1] += 2; added.push('Scenario compare'); }
    if (v.engagement) { weeks[0] += 2; weeks[1] += 2; added.push('Engagement layer'); }
    if (v.delivery === 'table') { weeks[0] += 1; weeks[1] += 1; added.push('Media table build'); }
    if (v.delivery === 'vr') { weeks[0] += 2; weeks[1] += 3; added.push('VR build'); }
    return { tier: tier, n: n, weeks: weeks, base: base, added: added.length ? added.join(', ') : 'None yet', next: next };
  }

  var form = document.getElementById('est');
  if (form) {
    var area = document.getElementById('est-area'), bld = document.getElementById('est-bld');
    var outArea = document.getElementById('est-area-v'), outBld = document.getElementById('est-bld-v');
    var out = {
      tier: document.getElementById('est-tier'), n: document.getElementById('est-tier-n'),
      weeks: document.getElementById('est-weeks'), base: document.getElementById('est-base'),
      added: document.getElementById('est-added'), next: document.getElementById('est-next')
    };
    var segs = form.querySelectorAll('.seg');

    function segVal(key) {
      var b = form.querySelector('.seg[data-key="' + key + '"] button[aria-pressed="true"]');
      return b ? b.getAttribute('data-val') : '';
    }
    function values() {
      return {
        area: +area.value, buildings: +bld.value, lod: segVal('lod'),
        feeds: segVal('feeds') === 'yes', scenarios: segVal('scenarios') === 'yes',
        engagement: segVal('engagement') === 'yes', delivery: segVal('delivery')
      };
    }
    function render() {
      var v = values(), e = estimate(v);
      outArea.textContent = v.area + ' ha';
      outBld.textContent = '≈ ' + v.buildings.toLocaleString('en-GB');
      out.tier.textContent = e.tier;
      out.n.textContent = 'Tier ' + e.n + ' of 3';
      out.weeks.textContent = e.weeks[0] + ' to ' + e.weeks[1] + ' weeks';
      out.base.textContent = e.base;
      out.added.textContent = e.added;
      out.next.textContent = e.next;
      var summary = 'Scope estimate from urbandecoders.com\n' +
        'Tier: ' + e.tier + ' (' + v.area + ' ha, about ' + v.buildings + ' buildings, LOD ' + v.lod + ')\n' +
        'Base: ' + e.base + '\nAdded: ' + e.added + '\nDelivery: ' + v.delivery + '\n' +
        'Indicative first twin: ' + e.weeks[0] + ' to ' + e.weeks[1] + ' weeks';
      try { localStorage.setItem(KEY, summary); } catch (err) {}
    }
    area.addEventListener('input', render);
    bld.addEventListener('input', render);
    Array.prototype.forEach.call(segs, function (seg) {
      Array.prototype.forEach.call(seg.querySelectorAll('button'), function (b) {
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(seg.querySelectorAll('button'), function (o) { o.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          render();
        });
      });
    });
    render();
  }

  /* Contact form: prefill the brief with the last estimate, once, if empty */
  var msg = document.getElementById('message');
  if (msg && !msg.value) {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (err) {}
    if (saved && (location.hash === '#estimate' || document.referrer.indexOf(location.host) !== -1)) {
      msg.value = saved + '\n\nProject notes:\n';
      var svc = document.getElementById('service');
      if (svc && !svc.value) svc.value = 'Digital twin (site, district or city)';
    }
  }
})();
