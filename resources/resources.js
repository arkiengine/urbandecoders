/* Skills library — filter, search, sort, copy, TOC highlight.
   Progressive: every card is in the HTML, this only hides and reorders. */
(function () {
  'use strict';

  /* ---------------------------------------------------------- copy buttons */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var block = btn.closest('.codeblock');
    var code = block && block.querySelector('code');
    if (!code) return;
    var done = function () {
      var was = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('is-done');
      setTimeout(function () { btn.textContent = was; btn.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code.textContent).then(done, function () {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = code.textContent;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(ta);
    }
  });

  /* ------------------------------------------------------------- library */
  var grid = document.getElementById('tpl-grid');
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.tpl-card'));
    var original = cards.slice();
    var q = document.getElementById('tpl-q');
    var sort = document.getElementById('tpl-sort');
    var count = document.getElementById('tpl-count');
    var empty = document.getElementById('tpl-empty');
    var reset = document.getElementById('tpl-reset');
    var chips = Array.prototype.slice.call(document.querySelectorAll('.tpl-chips .chip[data-filter]'));
    var swchips = Array.prototype.slice.call(document.querySelectorAll('.tpl-chips .chip[data-sw]'));
    var cat = 'all';
    var sw = 'all';

    function apply() {
      var term = (q && q.value || '').trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var okCat = cat === 'all' || c.dataset.cat === cat;
        var okSw = sw === 'all' ||
          (' ' + (c.dataset.sw || '') + ' ').indexOf(' ' + sw + ' ') !== -1;
        var okTerm = !term || (c.dataset.search || '').indexOf(term) !== -1;
        var show = okCat && okSw && okTerm;
        c.hidden = !show;
        if (show) shown++;
      });
      if (count) {
        var noun = count.dataset.noun || 'skill';
        count.textContent = shown + ' ' + noun + (shown === 1 ? '' : 's');
      }
      if (empty) empty.hidden = shown !== 0;
    }

    function order() {
      var mode = sort ? sort.value : 'suggested';
      var list = original.slice();
      if (mode === 'az' || mode === 'za') {
        list.sort(function (a, b) {
          return a.dataset.title.localeCompare(b.dataset.title) * (mode === 'za' ? -1 : 1);
        });
      }
      list.forEach(function (c) { grid.appendChild(c); });
      cards = list;
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        cat = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    });

    swchips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        sw = chip.dataset.sw;
        swchips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    });

    if (q) q.addEventListener('input', apply);
    if (sort) sort.addEventListener('change', function () { order(); apply(); });
    if (reset) reset.addEventListener('click', function () {
      if (q) q.value = '';
      cat = 'all';
      sw = 'all';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === 'all')); });
      swchips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.sw === 'all')); });
      apply();
      if (q) q.focus();
    });

    /* "/" focuses the search box */
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (!q) return;
      e.preventDefault();
      q.focus();
      q.select();
    });

    /* deep link: ?cat=slug and/or ?sw=slug on the URL */
    var params = new URLSearchParams(location.search);
    var pre = params.get('cat');
    if (pre) {
      var match = chips.filter(function (c) { return c.dataset.filter === pre; })[0];
      if (match) match.click();
    }
    var presw = params.get('sw');
    if (presw) {
      var swmatch = swchips.filter(function (c) { return c.dataset.sw === presw; })[0];
      if (swmatch) {
        swmatch.click();
        /* After a frame, so the hidden cards have already shortened the page —
           scrolling before that lands short of the library. */
        var lib = document.getElementById('library');
        if (lib && !location.hash) {
          requestAnimationFrame(function () { lib.scrollIntoView(); });
        }
      }
    }

    apply();
  }

  /* --------------------------------------------------------- TOC highlight */
  var toc = document.querySelector('.tpl-toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    var targets = [];
    Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) { links[el.id] = a; targets.push(el); }
    });
    if (targets.length) {
      var seen = [];
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var id = en.target.id;
          var i = seen.indexOf(id);
          if (en.isIntersecting && i === -1) seen.push(id);
          if (!en.isIntersecting && i !== -1) seen.splice(i, 1);
        });
        Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
        if (seen.length) {
          var top = targets.filter(function (t) { return seen.indexOf(t.id) !== -1; })[0];
          if (top && links[top.id]) links[top.id].classList.add('is-active');
        }
      }, { rootMargin: '-96px 0px -70% 0px' });
      targets.forEach(function (t) { io.observe(t); });
    }
  }
})();
