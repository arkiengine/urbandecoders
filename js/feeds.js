(function () {
  var host = document.getElementById('live-feeds');
  if (!host) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var feeds = {
    traffic: { v: 1240, min: 900, max: 1600, step: 60, fmt: function (n) { return Math.round(n).toLocaleString('en-GB'); } },
    cctv:    { v: 38,   min: 36,  max: 42,   step: 1,  fmt: function (n) { return String(Math.round(n)); } },
    bus:     { v: 14,   min: 9,   max: 19,   step: 1,  fmt: function (n) { return String(Math.round(n)); } },
    aqi:     { v: 23,   min: 14,  max: 34,   step: 2,  fmt: function (n) { return String(Math.round(n)); } },
    foot:    { v: 2860, min: 1900, max: 3600, step: 120, fmt: function (n) { return Math.round(n).toLocaleString('en-GB'); } },
    rail:    { v: 6,    min: 3,   max: 9,    step: 1,  fmt: function (n) { return String(Math.round(n)); } }
  };
  var N = 24;
  Object.keys(feeds).forEach(function (k) {
    var f = feeds[k];
    f.el = host.querySelector('[data-feed="' + k + '"]');
    f.sp = host.querySelector('[data-spark="' + k + '"]');
    f.hist = [];
    var x = f.v;
    for (var i = 0; i < N; i++) { x = clamp(f, x + (Math.random() - 0.5) * f.step * 2); f.hist.push(x); }
    f.hist[N - 1] = f.v;
    paint(f);
  });
  function clamp(f, x) { return Math.max(f.min, Math.min(f.max, x)); }
  function paint(f) {
    if (f.el) f.el.textContent = f.fmt(f.v);
    if (!f.sp) return;
    var lo = f.min, hi = f.max, pts = [];
    for (var i = 0; i < f.hist.length; i++) {
      var px = (i / (N - 1)) * 100, py = 24 - ((f.hist[i] - lo) / (hi - lo)) * 22;
      pts.push(px.toFixed(1) + ',' + py.toFixed(1));
    }
    f.sp.setAttribute('points', pts.join(' '));
  }
  function tick() {
    Object.keys(feeds).forEach(function (k) {
      var f = feeds[k];
      // mean-reverting drift keeps values plausible
      var pull = (f.v - (f.min + f.max) / 2) * 0.08;
      f.v = clamp(f, f.v + (Math.random() - 0.5) * f.step * 2 - pull);
      f.hist.push(f.v); if (f.hist.length > N) f.hist.shift();
      paint(f);
    });
  }
  if (reduce) return;
  var timer = null;
  function start() { if (!timer) timer = setInterval(tick, 1800); }
  function stop() { clearInterval(timer); timer = null; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { rootMargin: '80px' }).observe(host);
  } else start();
})();
