(function () {
  var box = document.getElementById('cf-gallery');
  if (!box) return;
  var stage = box.querySelector('.coverflow__stage');
  var cards = Array.prototype.slice.call(box.querySelectorAll('.cf-card'));
  if (cards.length < 2) return;

  var VISIBLE = 3;        // cards shown either side of centre
  var ANGLE   = 45;       // deg of rotateY per step out
  var DEPTH   = 190;      // px pushed back per step out
  var active  = Math.floor(cards.length / 2);
  var spacing = 0;

  function measure() { spacing = cards[0].offsetWidth * 0.56; }

  function layout() {
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], d = i - active, a = Math.abs(d), far = a > VISIBLE;
      var clamped = far ? VISIBLE : a;
      c.style.transform =
        'translate(-50%,-50%)' +
        ' translateX(' + (d * spacing) + 'px)' +
        ' translateZ(' + (-clamped * DEPTH) + 'px)' +
        ' rotateY(' + (-d * ANGLE / (1 + clamped * 0.35)) + 'deg)' +
        ' scale(' + (1 - clamped * 0.05) + ')';
      c.style.zIndex = String(100 - clamped);
      c.style.opacity = far ? '0' : String(1 - clamped * 0.16);
      c.style.filter = 'brightness(' + (1 - clamped * 0.16) + ')';
      c.style.pointerEvents = far ? 'none' : 'auto';
      c.classList.toggle('is-active', d === 0);
      c.setAttribute('aria-hidden', far ? 'true' : 'false');
    }
  }

  function go(n) {
    active = Math.max(0, Math.min(cards.length - 1, n));
    layout();
  }

  cards.forEach(function (c, i) {
    c.addEventListener('click', function () { if (i !== active) go(i); });
  });

  var prev = document.querySelector('.cf-nav--prev');
  var next = document.querySelector('.cf-nav--next');
  if (prev) prev.addEventListener('click', function () { go(active - 1); });
  if (next) next.addEventListener('click', function () { go(active + 1); });

  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(active - 1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { go(active + 1); e.preventDefault(); }
  });

  // Wheel: only claim the gesture while there are cards left to travel,
  // so the page keeps scrolling normally at either end of the gallery.
  var wheelLock = 0;
  box.addEventListener('wheel', function (e) {
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 2) return;
    var dir = d > 0 ? 1 : -1;
    if ((dir < 0 && active === 0) || (dir > 0 && active === cards.length - 1)) return;
    e.preventDefault();
    var now = e.timeStamp;
    if (now - wheelLock < 260) return;
    wheelLock = now;
    go(active + dir);
  }, { passive: false });

  var drag = null;
  box.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    drag = { x: e.clientX, from: active };
    box.classList.add('is-dragging');
    box.setPointerCapture(e.pointerId);
  });
  box.addEventListener('pointermove', function (e) {
    if (!drag) return;
    go(drag.from - Math.round((e.clientX - drag.x) / (spacing || 1)));
  });
  function endDrag() { drag = null; box.classList.remove('is-dragging'); }
  box.addEventListener('pointerup', endDrag);
  box.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', function () { measure(); layout(); });

  box.setAttribute('data-cf-ready', '');   // drops the no-JS flat-row fallback
  measure();
  layout();
})();
