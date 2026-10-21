/* Click to reveal the contact details on the Impressum page.
 *
 * The point is to keep the details out of the page source, so the strings are
 * base64 and are only decoded and written into the DOM when the reader asks
 * for them. A harvester that reads HTML without running scripts finds
 * nothing; one that runs scripts and clicks finds them, as any reader does.
 *
 * Each placeholder carries its own data-reveal payload, so this file holds no
 * contact data itself and the markup stays the single source.
 */
(function () {
  'use strict';

  function decode(value) {
    try {
      // atob gives bytes; go through percent-encoding so that the umlauts in
      // a German address survive rather than arriving as mojibake.
      return decodeURIComponent(
        Array.prototype.map
          .call(window.atob(value), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
    } catch (e) {
      return null;
    }
  }

  function reveal(holder) {
    var text = decode(holder.getAttribute('data-reveal') || '');
    if (text === null) return;

    var out = document.createElement('span');
    out.className = 'revealed';
    // Line breaks are written as \n in the payload; a postal address needs them.
    text.split('\n').forEach(function (line, i) {
      if (i) out.appendChild(document.createElement('br'));
      out.appendChild(document.createTextNode(line));
    });

    holder.replaceWith(out);
  }

  function init() {
    var holders = document.querySelectorAll('[data-reveal]');
    Array.prototype.forEach.call(holders, function (holder) {
      holder.addEventListener('click', function () {
        reveal(holder);
      });
      holder.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          reveal(holder);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
