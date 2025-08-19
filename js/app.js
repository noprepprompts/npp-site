// No Prep Prompts — minimal JS to render Featured + Library from catalog.json
(function(){
  const byId = (id) => document.getElementById(id);

  // Fisher–Yates shuffle
  function shuffle(arr){
    const a = arr.slice(); // do not mutate original
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function cardHTML(it){
    const isFree = !!it.free;
    const badgeFree = isFree ? `<span class="badge free">FREE</span>` : "";
    const ctaText = isFree ? "Get the Free Starter Pack" : (it.product === "#" ? "Coming Soon" : "Buy on TPT");
    const ctaHref = (it.product && it.product !== "#") ? it.product : null;

    let ctaAttrs = "";
    if (isFree) {
      ctaAttrs = `href="${ctaHref}"`;
    } else if (!ctaHref) {
      ctaAttrs = `aria-disabled="true"`;
    } else {
      ctaAttrs = `href="${ctaHref}" target="_blank" rel="noopener"`;
    }

    return `
      <article class="card" id="${it.id}" data-tags="${(it.tags||[]).join(',')}">
        <h3>${it.title}</h3>
        <p>${it.subtitle}</p>
        <div class="badges">
          ${badgeFree}
          ${(it.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}
        </div>
        <p style="margin-top:10px">
          <a class="btn ${isFree ? 'accent' : 'primary'}" ${ctaAttrs}>${ctaText}</a>
        </p>
      </article>
    `;
  }

  function renderFeatured(){
    fetch('js/catalog.json').then(r=>r.json()).then(items=>{
      const featured = byId('featured');
      if(!featured) return;
      const picks = shuffle(items).slice(0, 6); // RANDOMIZE featured selection
      featured.innerHTML = picks.map(cardHTML).join('');
    });
  }

  function renderLibrary(){
    fetch('js/catalog.json').then(r=>r.json()).then(items=>{
      const grid = byId('catalog');
      const search = document.getElementById('search');
      if(!grid) return;

      function draw(list){ grid.innerHTML = list.map(cardHTML).join(''); }
      draw(items);

      if(search){
        search.addEventListener('input', ()=>{
          const q = search.value.toLowerCase().trim();
          const filtered = !q ? items : items.filter(it =>
            (it.title||'').toLowerCase().includes(q) ||
            (it.subtitle||'').toLowerCase().includes(q) ||
            (it.tags||[]).join(' ').toLowerCase().includes(q)
          );
          draw(filtered);
        });
      }
    });
  }

  // expose to inline scripts
  window.renderFeatured = renderFeatured;
  window.renderLibrary = renderLibrary;
})();
