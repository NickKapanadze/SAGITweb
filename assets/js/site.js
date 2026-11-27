(() => {
  let language = 'ka';
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
})();
