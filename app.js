(() => {
 'use strict';
 const cards = Array.from(document.querySelectorAll('[data-category]'));
 const filters = document.querySelectorAll('[data-filter]');
 const categoryTitles = {todos:'Amor a <em>primer vistazo.</em>',boda:'Invitaciones de <em>boda.</em>',xv:'Invitaciones de <em>XV años.</em>',cumpleanos:'Invitaciones de <em>cumpleaños.</em>',bautizo:'Invitaciones de <em>bautizo.</em>'};
 function scrollToDesigns() {
  const filtersTop = document.querySelector('.filters').getBoundingClientRect().top + window.scrollY;
  const headerHeight = document.querySelector('.site-header').offsetHeight;
  window.scrollTo({top:filtersTop-headerHeight-18,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function filterModels(category) {
  document.getElementById('colecciones-title').innerHTML = categoryTitles[category] || categoryTitles.todos;
  let count = 0;
  cards.forEach(card => {
   const show = category === 'todos' || card.dataset.category === category;
   card.hidden = !show;
   if(show) count++;
  });
  filters.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === category)));
  document.querySelector('.filter-status').textContent = `${count} ${count===1?'diseño para explorar':'diseños para explorar'}`;
 }
 filters.forEach(button => button.addEventListener('click', () => { filterModels(button.dataset.filter); scrollToDesigns(); }));
 document.querySelectorAll('[data-occasion]').forEach(button => button.addEventListener('click', () => {
  filterModels(button.dataset.occasion);
  scrollToDesigns();
 }));
 const menuButton = document.querySelector('.menu-toggle');
 const menu = document.getElementById('mobile-nav');
 function closeMenu() {menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menú');}
 menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  if (!menu.hidden) menu.style.top = `${document.querySelector('.site-header').getBoundingClientRect().bottom}px`;
  menuButton.setAttribute('aria-expanded',String(!menu.hidden));
  menuButton.setAttribute('aria-label',menu.hidden?'Abrir menú':'Cerrar menú');
 });
 menu.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', closeMenu));
 document.addEventListener('keydown', event => {if(event.key==='Escape') closeMenu();});
})();
