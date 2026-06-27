// Renders the job dashboard from JOBS (jobs.js) with search + filters.
(function () {
  const grid = document.getElementById('jobGrid');
  const searchInput = document.getElementById('search');
  const catWrap = document.getElementById('categoryFilters');
  const fmtWrap = document.getElementById('formatFilters');
  const statsEl = document.getElementById('stats');
  const emptyEl = document.getElementById('emptyState');
  const updatedEl = document.getElementById('updated');

  updatedEl.textContent = 'Updated ' + (window.JOBS_UPDATED || '2026');

  const state = { q: '', cat: 'All', fmt: 'All' };

  const categories = ['All', ...Array.from(new Set(JOBS.map(j => j.category)))];
  const formats = ['All', ...Array.from(new Set(JOBS.map(j => j.format)))];

  function makeChips(wrap, values, key, cls) {
    values.forEach(v => {
      const c = document.createElement('span');
      c.className = 'chip ' + cls + (state[key] === v ? ' active' : '');
      c.textContent = v;
      c.onclick = () => {
        state[key] = v;
        [...wrap.children].forEach(ch => ch.classList.remove('active'));
        c.classList.add('active');
        render();
      };
      wrap.appendChild(c);
    });
  }
  makeChips(catWrap, categories, 'cat', 'cat');
  makeChips(fmtWrap, formats, 'fmt', '');

  searchInput.addEventListener('input', e => { state.q = e.target.value.toLowerCase(); render(); });

  function matches(j) {
    if (state.cat !== 'All' && j.category !== state.cat) return false;
    if (state.fmt !== 'All' && j.format !== state.fmt) return false;
    if (state.q) {
      const hay = (j.title + ' ' + j.requirements + ' ' + j.notes + ' ' + j.whereLabel).toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  }

  var VERIFY = {
    official: { label: '✓ Official live-search page', cls: 'v-official' },
    signup: { label: '✓ Always-open application', cls: 'v-signup' },
    aggregator: { label: '~ Aggregator — check each date', cls: 'v-aggregator' },
  };

  function card(j) {
    const el = document.createElement('article');
    el.className = 'card';
    var v = VERIFY[j.verify] || VERIFY.aggregator;
    el.innerHTML =
      '<h3>' + j.title + '</h3>' +
      '<div class="pay">' + j.pay + '</div>' +
      '<div class="tags">' +
        '<span class="tag cat">' + j.category + '</span>' +
        '<span class="tag format">' + j.format + '</span>' +
        '<span class="tag verify ' + v.cls + '">' + v.label + '</span>' +
      '</div>' +
      (j.requirements ? '<div class="req">📋 ' + j.requirements + '</div>' : '') +
      (j.notes ? '<div class="notes">💡 ' + j.notes + '</div>' : '') +
      '<a class="apply" href="' + j.url + '" target="_blank" rel="noopener">Apply / Browse → ' + j.whereLabel + '</a>';
    return el;
  }

  function render() {
    const list = JOBS.filter(matches);
    grid.innerHTML = '';
    list.forEach(j => grid.appendChild(card(j)));
    emptyEl.hidden = list.length !== 0;
    statsEl.innerHTML =
      '<span><b>' + list.length + '</b> of ' + JOBS.length + ' options shown</span>' +
      '<span><b>' + categories.length + '</b> categories</span>' +
      '<span>All roles target <b>$30+/hr</b></span>';
  }

  render();
})();
