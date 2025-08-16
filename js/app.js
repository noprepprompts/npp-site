(function(){
  const search = document.querySelector('#search');
  const tagsWrap = document.querySelector('.filter-tags');
  const cards = document.querySelectorAll('[data-card]');
  const tagButtons = tagsWrap ? Array.from(tagsWrap.querySelectorAll('button[data-tag]')) : [];
  function applyFilters(){
    const q = (search?.value || '').toLowerCase().trim();
    const activeTags = tagButtons.filter(b => b.classList.contains('on')).map(b => b.dataset.tag);
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const tags = (card.dataset.tags || '').split(',');
      const matchQ = !q || text.includes(q);
      const matchTags = !activeTags.length || activeTags.some(t => tags.includes(t));
      card.style.display = (matchQ && matchTags) ? '' : 'none';
    });
  }
  if(search){ search.addEventListener('input', applyFilters); }
  tagButtons.forEach(btn => btn.addEventListener('click', ()=>{ btn.classList.toggle('on'); applyFilters(); }));

  const form = document.querySelector('#subscribe-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      const note = document.querySelector('#subscribe-note');
      if(!email || !email.includes('@')){
        note.textContent = 'Please enter a valid email.';
        note.className = 'small';
        return;
      }
      note.textContent = 'Thanks! Check your inbox for a confirmation email.';
      note.className = 'small';
      form.reset();
    });
  }
})();
