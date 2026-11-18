/* Course waiting list -> Kit (ConvertKit).

   The form posts to Kit's form endpoint, so no API key is ever in the browser.
   We try fetch first for an in-place result; if Kit's CORS or the network says
   no, we fall back to a normal form POST, which lands on Kit's own thank-you
   page. Without JS at all, the plain POST is what happens anyway. */
(function () {
  'use strict';

  var form = document.getElementById('waitlist-form');
  var status = document.getElementById('waitlist-status');
  if (!form || !status) return;

  var btn = form.querySelector('button[type="submit"]');
  var label = btn.innerHTML;
  var MAILTO = 'info@urbandecoders.com';
  var configured = (form.dataset.kitForm || '').indexOf('YOUR_KIT') !== 0;

  function say(msg, ok) {
    status.hidden = false;
    status.textContent = msg;
    status.className = 'form-status ' + (ok ? 'is-ok' : 'is-err');
  }

  function tracksChosen() {
    return form.querySelectorAll('.wl__checks input:checked').length > 0;
  }

  form.addEventListener('submit', function (e) {
    if (!tracksChosen()) {
      e.preventDefault();
      say('Pick at least one track so we know what to tell you about.', false);
      return;
    }
    if (!configured) {
      e.preventDefault();
      say('The list isn’t connected yet — please email ' + MAILTO + ' and we’ll add you by hand.', false);
      return;
    }
    if (!form.reportValidity()) { e.preventDefault(); return; }

    // From here we try to handle it in place; the native POST is the fallback.
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Adding you…';
    status.hidden = true;

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json().catch(function () { return {}; });
      })
      .then(function () {
        form.reset();
        say('You’re on the list. Check your inbox — if we’ve asked you to confirm, the link is in there.', true);
        btn.disabled = false;
        btn.innerHTML = label;
      })
      .catch(function () {
        // CORS, offline or a Kit error: hand it back to the browser, which
        // posts the form properly and lands on Kit's confirmation page.
        form.submit();
      });
  });
})();
