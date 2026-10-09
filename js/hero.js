/* Hero loop — plays muted behind the headline. Reduced-motion users get the
   poster; a small control lets anyone pause it. Paused while off screen. */
(function () {
  var v = document.getElementById('hero-video');
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = v.closest('.hero');
  var S = document.documentElement.lang.indexOf('ja') === 0
    ? { pause: 'ループを停止', play: 'ループを再生', pauseL: '背景動画を一時停止', playL: '背景動画を再生' }
    : { pause: 'Pause loop', play: 'Play loop', pauseL: 'Pause the background video', playL: 'Play the background video' };
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'hero__mute';
  btn.innerHTML = '<i></i><span>' + S.pause + '</span>';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', S.pauseL);
  hero.appendChild(btn);

  var userPaused = reduce;
  function set(on) {
    if (on) { v.play && v.play().catch(function () {}); }
    else { v.pause(); }
    btn.setAttribute('aria-pressed', String(!on));
    btn.querySelector('span').textContent = on ? S.pause : S.play;
    btn.setAttribute('aria-label', on ? S.pauseL : S.playL);
  }
  if (reduce) { v.removeAttribute('autoplay'); set(false); }
  btn.addEventListener('click', function () { userPaused = !userPaused; set(!userPaused); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (userPaused) return;
      if (en[0].isIntersecting) v.play && v.play().catch(function () {}); else v.pause();
    }, { rootMargin: '80px' }).observe(hero);
  }
})();
