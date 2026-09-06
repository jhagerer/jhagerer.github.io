/* Theme switcher for beautiful-jekyll.
 *
 * Cycles through three states: follow the system, forced light, forced dark.
 * "System" is the default and stores nothing, so a reader who never touches
 * the button always tracks their OS setting, including when they change it
 * while the page is open (CSS handles that, no listener needed).
 *
 * The button is injected rather than templated in so that no theme file has
 * to be overridden.
 */
(function () {
  'use strict';

  var MODES = ['system', 'light', 'dark'];
  var ICON = { system: 'fa-adjust', light: 'fa-sun', dark: 'fa-moon' };
  var LABEL = {
    system: 'Theme: match system. Click for light.',
    light: 'Theme: light. Click for dark.',
    dark: 'Theme: dark. Click to match system.'
  };

  var root = document.documentElement;

  function read() {
    try {
      var saved = window.localStorage.getItem('theme');
      return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function write(mode) {
    try {
      if (mode === 'system') {
        window.localStorage.removeItem('theme');
      } else {
        window.localStorage.setItem('theme', mode);
      }
    } catch (e) {
      /* Storage unavailable: the choice simply will not persist. */
    }
  }

  function apply(mode) {
    if (mode === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', mode);
    }
  }

  function render(button, mode) {
    button.innerHTML = '<i class="fas ' + ICON[mode] + '" aria-hidden="true"></i>';
    button.setAttribute('title', LABEL[mode]);
    button.setAttribute('aria-label', LABEL[mode]);
  }

  function build() {
    var nav = document.querySelector('.navbar-custom .navbar-nav');
    if (!nav) {
      return;
    }

    var mode = read();
    var item = document.createElement('li');
    item.className = 'nav-item theme-toggle-item';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    render(button, mode);

    button.addEventListener('click', function () {
      mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
      apply(mode);
      write(mode);
      render(button, mode);
    });

    item.appendChild(button);
    nav.appendChild(item);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
