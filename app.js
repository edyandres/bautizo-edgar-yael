(() => {
 'use strict';
 const models = JSON.parse(document.getElementById('model-data').textContent);
 const dialog = document.getElementById('preview-dialog');
 const frame = dialog.querySelector('iframe');
 const name = document.getElementById('preview-name');
 const link = document.getElementById('preview-link');
 const closeButton = dialog.querySelector('[data-close-preview]');
 let trigger = null;
 document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
  const model = models.find(item => item.id === button.dataset.preview);
  if (!model) return;
  trigger = button;
  name.textContent = model.name;
  frame.title = `Vista previa de ${model.name}`;
  frame.src = model.src;
  link.href = model.src;
  dialog.showModal();
  document.body.classList.add('preview-open');
  closeButton.focus();
 }));
 function closePreview() { dialog.close(); }
 closeButton.addEventListener('click', closePreview);
 dialog.addEventListener('click', event => { if(event.target === dialog) closePreview(); });
 dialog.addEventListener('close', () => {
  frame.src = 'about:blank';
  document.body.classList.remove('preview-open');
  if (trigger) trigger.focus({preventScroll:true});
 });
 const cards = Array.from(document.querySelectorAll('[data-category]'));
 const filters = document.querySelectorAll('[data-filter]');
 function filterModels(category) {
  let count = 0;
  cards.forEach(card => {
   const show = category === 'todos' || card.dataset.category === category;
   card.hidden = !show;
   if(show) count++;
  });
  filters.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === category)));
  document.querySelector('.filter-status').textContent = `${count} ${count===1?'diseño para explorar':'diseños para explorar'}`;
 }
 filters.forEach(button => button.addEventListener('click', () => filterModels(button.dataset.filter)));
 document.querySelectorAll('[data-occasion]').forEach(button => button.addEventListener('click', () => {
  filterModels(button.dataset.occasion);
  document.getElementById('colecciones').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
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
