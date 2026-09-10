/* Keeps --nav-h in step with the real header height.
 *
 * The header's height depends on the site name's size, the profile picture,
 * the tagline and the tab row, and --nav-h drives both the space above the
 * first article and the offset anchor links scroll to. Hardcoding it means
 * every header change silently invalidates it, so it is measured here instead.
 * The value in the stylesheet stays as the fallback for a reader without
 * scripting.
 *
 * The theme shortens the navbar once the page is scrolled a little, by adding
 * top-nav-short. Measuring in that state would report the shrunken height and
 * shift the article up under the reader mid-scroll, so the class is lifted for
 * the measurement and put straight back. That is one synchronous read, with no
 * paint in between. top-nav-short-permanent is a deliberate per-page setting
 * and is left alone.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var nav = null;
  /* Held in scope deliberately: an observer with no live reference can be
   * collected, and it then silently stops reporting. */
  var observer = null;

  function applyHeight(height) {
    if (height > 0) {
      root.style.setProperty('--nav-h', height + 'px');
    }
  }

  /* force: measure even while the navbar is in its scrolled, shortened state,
   * by lifting the class for one synchronous read. Used for the first run,
   * which may happen on a page loaded part-way down. */
  function measure(force) {
    if (!nav) {
      return;
    }

    var shortened = nav.classList.contains('top-nav-short');

    /* While scrolled, the observer below is firing because the theme is
     * shrinking the navbar, not because the header really changed. Measuring
     * here would report the shrunken height, and lifting the class to avoid
     * that would resize the box and call the observer straight back. Skipping
     * does neither: the value only governs space above the first article,
     * which is off screen by then, and the next measurement happens when the
     * reader returns to the top. */
    if (shortened && !force) {
      return;
    }

    if (!shortened) {
      applyHeight(Math.ceil(nav.getBoundingClientRect().height));
      return;
    }

    nav.classList.remove('top-nav-short');
    var height = Math.ceil(nav.getBoundingClientRect().height);
    nav.classList.add('top-nav-short');
    applyHeight(height);
  }

  function start() {
    nav = document.querySelector('.navbar-custom');
    if (!nav) {
      return;
    }

    measure(true);

    /* The theme transitions the navbar's padding over half a second, so its
     * height keeps changing after a viewport change. Watching the box catches
     * every step and settles on the final one; measuring once on resize would
     * capture a frame of that animation and keep it. */
    if (window.ResizeObserver) {
      observer = new window.ResizeObserver(function () {
        measure(false);
      });

      /* border-box, not the default content box. The theme animates the
       * navbar's padding, which changes the border box while leaving the
       * content box alone, so a content-box observation reports the height
       * from before the animation and never hears about the rest of it. */
      try {
        observer.observe(nav, { box: 'border-box' });
      } catch (e) {
        observer.observe(nav);
      }
    }

    /* Also re-read once the padding transition has run, which covers browsers
     * without ResizeObserver and any that ignore the box option. */
    window.addEventListener('resize', function () {
      measure(false);
      window.setTimeout(function () { measure(false); }, 700);
    });

    window.addEventListener('load', function () { measure(true); });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { measure(true); }).catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
