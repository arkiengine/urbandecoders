/* Capability tiles and work cards — hover (or focus, or tap) plays the clip behind the
   poster. The video source is attached on first play, so nothing downloads
   until someone asks for it. Reduced-motion users get click-to-play only. */
(function () {
  var tiles = document.querySelectorAll('.cap[data-video], .wcard[data-video]');
  if (!tiles.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia && window.matchMedia('(hover: none)').matches;

  function video(tile) {
    var v = tile.querySelector('video');
    if (!v) {
      v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
      v.setAttribute('aria-hidden', 'true');
      v.src = tile.getAttribute('data-video');
      tile.querySelector('.cap__media, .wcard__img').appendChild(v);
    }
    return v;
  }
  function play(tile) {
    var v = video(tile);
    tile.classList.add('is-playing');
    var p = v.play();
    if (p && p.catch) p.catch(function () { tile.classList.remove('is-playing'); });
  }
  function stop(tile) {
    var v = tile.querySelector('video');
    tile.classList.remove('is-playing');
    if (v) { v.pause(); v.currentTime = 0; }
  }

  Array.prototype.forEach.call(tiles, function (tile) {
    if (!reduce && !coarse) {
      tile.addEventListener('mouseenter', function () { play(tile); });
      tile.addEventListener('mouseleave', function () { stop(tile); });
      tile.addEventListener('focusin', function () { play(tile); });
      tile.addEventListener('focusout', function () { stop(tile); });
    }
    if (tile.tagName !== 'A') tile.addEventListener('click', function () {
      if (tile.classList.contains('is-playing')) stop(tile); else play(tile);
    });
    tile.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tile.click(); }
    });
  });

  // Pause anything that scrolls off screen
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting && !en.target.matches(':hover') && !en.target.contains(document.activeElement)) stop(en.target);
      });
    }, { rootMargin: '40px' });
    Array.prototype.forEach.call(tiles, function (t) { io.observe(t); });
  }
})();
