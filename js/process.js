/* How we work — the four moves auto-advance while on screen: the track fills
   to the active step, the step glows and the others dim. Hover pauses, click
   or arrow keys select, reduced-motion users get the click behaviour only. */
(function () {
  var panel = document.querySelector('.process-panel');
  if (!panel) return;
  var steps = panel.querySelectorAll('.step');
  var fill = panel.querySelector('.process__fill');
  if (!steps.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var n = steps.length, active = 0, timer = 0, paused = false, visible = false;
  var PERIOD = 3800;

  function set(i) {
    active = (i + n) % n;
    Array.prototype.forEach.call(steps, function (s, k) {
      s.setAttribute('aria-selected', String(k === active));
      s.classList.toggle('is-active', k === active);
      s.classList.toggle('is-done', k < active);
      s.tabIndex = k === active ? 0 : -1;
    });
    if (fill) fill.style.width = (active / (n - 1) * 100) + '%';
    panel.style.setProperty('--gx', ((active + 0.5) / n * 100) + '%');
  }
  function tick() { if (!paused && visible) set(active + 1); }
  function start() { if (!timer && !reduce) timer = setInterval(tick, PERIOD); }
  function stop() { clearInterval(timer); timer = 0; }

  Array.prototype.forEach.call(steps, function (s, k) {
    s.addEventListener('click', function () { set(k); });
    s.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { set(active + 1); steps[active].focus(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { set(active - 1); steps[active].focus(); e.preventDefault(); }
      else if (e.key === 'Home') { set(0); steps[0].focus(); e.preventDefault(); }
      else if (e.key === 'End') { set(n - 1); steps[n - 1].focus(); e.preventDefault(); }
    });
  });
  panel.addEventListener('mouseenter', function () { paused = true; });
  panel.addEventListener('mouseleave', function () { paused = false; });
  panel.addEventListener('focusin', function () { paused = true; });
  panel.addEventListener('focusout', function () { paused = false; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.35 }).observe(panel);
  } else { visible = true; start(); }

  set(0);
})();
