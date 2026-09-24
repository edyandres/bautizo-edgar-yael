const dialog = document.querySelector('#preview-dialog');
document.querySelectorAll('[data-open-preview]').forEach((button) => {
  button.addEventListener('click', () => dialog.showModal());
});
document.querySelector('[data-close-preview]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dialog.open) dialog.close();
});
