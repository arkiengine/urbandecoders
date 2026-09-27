/* How we work — scroll-driven. As the panel travels up the viewport the
   track fills continuously, each step lights as the fill reaches it, and
   passed steps get a tick. Click or arrow keys also select a step, until the
   next scroll takes over again. */
(function () {
  var panel = document.querySelector('.process-panel');
  if (!panel) return;
  var steps = panel.querySelectorAll('.step');
  var fill = panel.querySelector('.process__fill');
  if (!steps.length) return;
  var n = steps.length, active = -1, ticking = false;
  var mq = window.matchMedia('(max-width: 960px)');

  function setActive(i) {
    if (i === active) return;
    active = i;
    Array.prototype.forEach.call(steps, function (s, k) {
      s.setAttribute('aria-selected', String(k === active));
      s.classList.toggle('is-active', k === active);
      s.classList.toggle('is-done', k < active);
      s.tabIndex = k === active ? 0 : -1;
    });
    panel.style.setProperty('--gx', ((active + 0.5) / n * 100) + '%');
  }
  function setFill(p) {
    if (fill) fill.style.width = (p * 100).toFixed(2) + '%';
  }

  // 0 when the panel's top reaches 80% of the viewport, 1 when its bottom reaches 30%
  function progress() {
    var r = panel.getBoundingClientRect(), vh = window.innerHeight || 800;
    var start = vh * 0.8, end = vh * 0.3;
    var p = (start - r.top) / (r.height + (start - end));
    return Math.max(0, Math.min(1, p));
  }
  function update() {
    ticking = false;
    var p = progress();
    // the fill runs from the first dot to the last, so map progress onto n-1 gaps
    var f = Math.min(1, p * n / (n - 1));
    setFill(mq.matches ? 0 : f);
    setActive(Math.min(n - 1, Math.floor(p * n)));
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  Array.prototype.forEach.call(steps, function (s, k) {
    s.addEventListener('click', function () { setActive(k); setFill(k / (n - 1)); });
    s.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(n - 1, active + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, active - 1);
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      if (next === null) return;
      e.preventDefault();
      setActive(next); setFill(next / (n - 1)); steps[next].focus();
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
