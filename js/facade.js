(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.yt-facade[data-video]'), function (facade) {
    facade.addEventListener('click', function () {
      var v = document.createElement('video');
      v.className = 'arki-video';
      v.src = facade.dataset.video;
      v.poster = facade.querySelector('img') ? facade.querySelector('img').src : '';
      v.controls = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('aria-label', facade.getAttribute('aria-label') || 'Video');
      facade.replaceWith(v);
      v.play && v.play().catch(function () {});
    });
  });
})();
