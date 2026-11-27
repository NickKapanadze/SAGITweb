(() => {
  let language = 'ka';
  let motionPaused = false;
  const motionButtons = document.querySelectorAll('.motion-toggle');
  function updateMotionLabel(){
    motionButtons.forEach(button=>{
      button.textContent=language==='en'?(motionPaused?'Resume motion':'Pause motion'):(motionPaused?'ანიმაციის გაგრძელება':'ანიმაციის შეჩერება');
      button.setAttribute('aria-pressed',String(motionPaused));
    });
  }
  try { if (localStorage.getItem('language') === 'en') language = 'en'; } catch {}
  const languageButton = document.getElementById('language');
  function applyLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-ka][data-en]').forEach(el => { el.textContent = el.dataset[language]; });
    document.title = `${document.body.dataset[language === 'ka' ? 'titleKa' : 'titleEn']} · SAGIT`;
    languageButton.textContent = language === 'ka' ? 'EN' : 'ქარ';
    languageButton.setAttribute('aria-label', language === 'ka' ? 'Switch to English' : 'ქართულ ენაზე გადართვა');
    document.querySelector('nav').setAttribute('aria-label',language === 'ka' ? 'მთავარი ნავიგაცია' : 'Main navigation');
    document.querySelector('.filter-bar')?.setAttribute('aria-label',language === 'ka' ? 'პროგრამის საფეხური' : 'Program level');
    document.dispatchEvent(new CustomEvent('sagit:language',{detail:language}));
    updateMotionLabel();
  }
  languageButton.addEventListener('click', () => { language = language === 'ka' ? 'en' : 'ka'; try { localStorage.setItem('language', language); } catch {} applyLanguage(); });
  applyLanguage();
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); nav.classList.toggle('open', open); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  matchMedia('(min-width:1001px)').addEventListener('change', closeMenu);
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(other => { const selected = other === button; other.classList.toggle('active',selected); other.setAttribute('aria-pressed',String(selected)); });
    document.querySelectorAll('[data-level]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.level !== button.dataset.filter; });
  }));
  // Open a campus destination from a school link or an older shared campus URL.
  const destination=new URL(location.href).searchParams.get('place')||location.hash.slice(1);
  const target=destination?document.getElementById(destination):null;
  if(target?.matches('.destination-detail'))target.open=true;
  window.addEventListener('hashchange',()=>{const detail=document.getElementById(location.hash.slice(1));if(detail?.matches('.destination-detail'))detail.open=true;});
  const artworks=document.querySelectorAll('.motion-art');
  if(artworks.length){
    motionButtons.forEach(button=>{button.hidden=false;button.addEventListener('click',()=>{
      motionPaused=!motionPaused;document.documentElement.dataset.motionPaused=String(motionPaused);updateMotionLabel();
    });});
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.dataset.visible=String(entry.isIntersecting);}),{threshold:.05});
      artworks.forEach(art=>observer.observe(art));
    }
    document.addEventListener('visibilitychange',()=>{document.documentElement.dataset.pageHidden=String(document.hidden);});
  }
})();
