/* Six-layer fan — cards sit in a stacked pile until the section scrolls
   into view, then spread to their fanned positions. One scroll-progress
   number drives every card's rotate and translate through --fan. */
(function () {
  var wrap = document.querySelector('.fan-wrap');
  if (!wrap) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var mq = window.matchMedia('(max-width: 860px)');
  var ticking = false;

  function update() {
    ticking = false;
    if (mq.matches) { wrap.style.setProperty('--fan', '1'); return; }
    var r = wrap.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    var p = (vh - r.top) / (vh * 0.7);
    p = Math.max(0, Math.min(1, p));
    p = 1 - Math.pow(1 - p, 3);   // ease out
    wrap.style.setProperty('--fan', p.toFixed(3));
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
