// No Prep Prompts — minimal JS to render Featured + Library from catalog.json
(function(){
  const byId = (id) => document.getElementById(id);
  const TPT_FALLBACK = "https://www.teacherspayteachers.com/store/no-prep-prompts";

  function cardHTML(it){
    const isFree = !!it.free;
    const badgeFree = isFree ? `<span class="badge free">FREE</span>` : "";
    const ctaText = isFree ? "Get Free Pack" : "Buy on TPT";
    const ctaHref = isFree ? "subscribe.html#freepack" : (it.product || TPT_FALLBACK);

    return `
      <article class="card" id="${it.id}" data-tags="${(it.tags||[]).join(',')}">
        <h3>${it.title}</h3>
        <p>${it.subtitle}</p>
        <div class="badges">
          ${badgeFree}
          ${(it.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}
        </div>
        <p style="margin-top:10px">
          <a class="btn ${isFree ? 'accent' : 'primary'}" href="${ctaHref}" ${isFree ? '' : 'target="_blank" rel="noopener"'}>${ctaText}</a>
        </p>
      </article>
    `;
  }

  function renderFeatured(){
    fetch('js/catalog.json').then(r=>r.json()).then(items=>{
      const featured = byId('featured');
      if(!featured) return;
      featured.innerHTML = items.slice(0,6).map(cardHTML).join('');
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
