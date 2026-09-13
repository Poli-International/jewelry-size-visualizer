/**
 * Shareable result card wiring for the Jewelry Size Visualizer (PoliShare).
 * The shareable result is the stretching plan: current gauge, goal gauge,
 * healing speed; restore switches to the Stretching tab and recalculates.
 */
'use strict';

(function () {
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function selectedLabel(id) {
    var el = document.getElementById(id);
    if (!el || el.selectedIndex < 0) return '';
    return el.options[el.selectedIndex].text.trim();
  }

  function text(id) {
    var el = document.getElementById(id);
    return el ? el.textContent.trim() : '';
  }

  PoliShare.init({
    tool: 'jewelry-size-visualizer',
    mount: '#stretching-results',

    getState: function () {
      var cur = val('current-gauge');
      var goal = val('goal-gauge');
      if (!cur || !goal) return null;
      return { c: cur, g: goal, h: val('healing-speed') };
    },

    applyState: function (s) {
      if (!s.c || !s.g) return;
      var tab = document.querySelector('.nav-tab[data-tab="stretching"]');
      if (tab) tab.click();
      var set = function (id, v) {
        var el = document.getElementById(id);
        if (el && v) {
          el.value = v;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      set('current-gauge', s.c);
      set('goal-gauge', s.g);
      set('healing-speed', s.h);
      var btn = document.getElementById('calculate-stretching');
      if (btn) btn.click();
    },

    getCard: function () {
      var results = document.getElementById('stretching-results');
      if (!results || results.style.display === 'none') return null;
      var cur = selectedLabel('current-gauge');
      var goal = selectedLabel('goal-gauge');
      return {
        t: 'My stretch plan: ' + cur + ' to ' + goal,
        d: [
          ['Steps', text('total-steps')],
          ['Timeline', text('total-time')],
          ['Size increase', text('size-increase')],
        ],
      };
    },
  });
})();
