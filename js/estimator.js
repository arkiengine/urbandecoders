/* Scope estimator — inputs map to a tier (Site / District / City), an
   indicative timeline band and the modules involved. Never a price.
   The summary is kept in localStorage so the contact form can prefill. */
(function () {
  var JA = document.documentElement.lang.indexOf('ja') === 0;
  var KEY = JA ? 'ud-estimate-ja' : 'ud-estimate';
  var S = JA ? {
    tiers: ['敷地', '地区', '都市'],
    base: ['周辺環境、ボリューム、Webビューア',
           '周辺環境、ボリューム、交通、Webビューア',
           '周辺環境、ボリューム、交通、環境、Webビューア'],
    next: ['敷地の範囲を送付（GeoJSON、DXF、またはレッドラインのPDF）',
           'GISの範囲と既存のマスタープランを送付',
           'データ一覧を送付（GIS、リアルタイムデータ、計画ポータル）'],
    lod3: 'LOD 3 のファサード', feeds: 'リアルタイムデータ', scenarios: 'シナリオ比較',
    engagement: '住民参加レイヤー', table: 'メディアテーブル制作', vr: 'VR制作',
    none: 'なし', sep: '、', locale: 'ja-JP', notes: '\n\nプロジェクトメモ：\n',
    tierN: function (n) { return '区分 ' + n + ' / 3'; },
    weeks: function (w) { return w[0] + '〜' + w[1] + '週間'; },
    summary: function (e, v) {
      return 'urbandecoders.com のスコープ試算\n' +
        '区分：' + e.tier + '（' + v.area + ' ha、約' + v.buildings + '棟、LOD ' + v.lod + '）\n' +
        '基本：' + e.base + '\n追加：' + e.added + '\n納品形態：' + v.delivery + '\n' +
        '初回ツインの目安：' + this.weeks(e.weeks);
    }
  } : {
    tiers: ['Site', 'District', 'City'],
    base: ['Context, massing, web explorer',
           'Context, massing, mobility, web explorer',
           'Context, massing, mobility, environment, web explorer'],
    next: ['Send your site boundary (GeoJSON, DXF or a red-line PDF)',
           'Send your GIS extent and any existing masterplan',
           'Send a data inventory: GIS, feeds, planning portal'],
    lod3: 'LOD 3 facades', feeds: 'Live feeds', scenarios: 'Scenario compare',
    engagement: 'Engagement layer', table: 'Media table build', vr: 'VR build',
    none: 'None yet', sep: ', ', locale: 'en-GB', notes: '\n\nProject notes:\n',
    tierN: function (n) { return 'Tier ' + n + ' of 3'; },
    weeks: function (w) { return w[0] + ' to ' + w[1] + ' weeks'; },
    summary: function (e, v) {
      return 'Scope estimate from urbandecoders.com\n' +
        'Tier: ' + e.tier + ' (' + v.area + ' ha, about ' + v.buildings + ' buildings, LOD ' + v.lod + ')\n' +
        'Base: ' + e.base + '\nAdded: ' + e.added + '\nDelivery: ' + v.delivery + '\n' +
        'Indicative first twin: ' + this.weeks(e.weeks);
    }
  };

  function estimate(v) {
    var i, n, weeks;
    if (v.area < 5) { i = 0; weeks = [3, 5]; }
    else if (v.area <= 100) { i = 1; weeks = [6, 8]; }
    else { i = 2; weeks = [10, 14]; }
    n = i + 1;
    var added = [];
    if (v.lod === '3') { weeks[0] += 2; weeks[1] += 3; added.push(S.lod3); }
    if (v.lod === '1') { weeks[0] = Math.max(2, weeks[0] - 1); weeks[1] = Math.max(3, weeks[1] - 1); }
    if (v.buildings > 1500 && n < 3) { weeks[0] += 1; weeks[1] += 2; }
    if (v.feeds) { weeks[0] += 2; weeks[1] += 2; added.push(S.feeds); }
    if (v.scenarios) { weeks[0] += 1; weeks[1] += 2; added.push(S.scenarios); }
    if (v.engagement) { weeks[0] += 2; weeks[1] += 2; added.push(S.engagement); }
    if (v.delivery === 'table') { weeks[0] += 1; weeks[1] += 1; added.push(S.table); }
    if (v.delivery === 'vr') { weeks[0] += 2; weeks[1] += 3; added.push(S.vr); }
    return { tier: S.tiers[i], n: n, weeks: weeks, base: S.base[i], added: added.length ? added.join(S.sep) : S.none, next: S.next[i] };
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
      outBld.textContent = '≈ ' + v.buildings.toLocaleString(S.locale);
      out.tier.textContent = e.tier;
      out.n.textContent = S.tierN(e.n);
      out.weeks.textContent = S.weeks(e.weeks);
      out.base.textContent = e.base;
      out.added.textContent = e.added;
      out.next.textContent = e.next;
      var summary = S.summary(e, v);
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
      msg.value = saved + S.notes;
      var svc = document.getElementById('service');
      if (svc && !svc.value) svc.value = 'Digital twin (site, district or city)';
    }
  }
})();
