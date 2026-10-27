(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const opener = $('#opener'), main = $('#invitacion'), openingButtons = document.querySelectorAll('[data-open]');
  const audio = $('#music'), musicButton = $('[data-music]');
  let opened = false;
  function syncMusic() {
    const playing = audio && !audio.paused;
    if (musicButton) {
      musicButton.setAttribute('aria-pressed', String(Boolean(playing)));
      musicButton.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
      musicButton.textContent = playing ? 'Ⅱ' : '♫';
    }
  }
  openingButtons.forEach(button => button.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    openingButtons.forEach(item => item.disabled = true);
    opener.classList.add('opening');
    if (audio) audio.play().then(syncMusic).catch(syncMusic);
    setTimeout(() => {
      opener.hidden = true; main.hidden = false;
      $('[data-controls]').hidden = false;
      window.scrollTo(0, 0);
      const heading = main.querySelector('h1');
      heading.setAttribute('tabindex', '-1'); heading.focus({preventScroll: true});
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000);
  }));
  if (musicButton && audio) {
    musicButton.addEventListener('click', () => {
      if (audio.paused) audio.play().then(syncMusic).catch(syncMusic); else audio.pause();
    });
    audio.addEventListener('play', syncMusic); audio.addEventListener('pause', syncMusic);
  }
  function updateCountdown() {
    const target = Date.parse(document.body.dataset.date);
    const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    document.querySelectorAll('[data-count]').forEach((el, i) => el.textContent = String(values[i]).padStart(2, '0'));
    if (seconds === 0 && $('[data-count-label]')) $('[data-count-label]').textContent = '¡Llegó el día de celebrar!';
  }
  updateCountdown(); setInterval(updateCountdown, 1000);
  const form = $('#rsvp-form');
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = $('[data-rsvp-status]');
    const name = form.elements.familia.value.trim();
    if (!name) { form.elements.familia.setCustomValidity('Escribe tu nombre o el de tu familia.'); form.reportValidity(); return; }
    const response = form.elements.asistencia.value;
    status.textContent = response === 'si'
      ? `¡Gracias, ${name}! Así se vería la confirmación para ${form.elements.personas.value} persona(s). Esta es una muestra: no se guardó ni se envió ningún mensaje.`
      : `Gracias por avisarnos, ${name}. Esta es una muestra: no se guardó ni se envió ningún mensaje.`;
    status.hidden = false; status.focus();
  });
  if (form) form.elements.familia.addEventListener('input', () => form.elements.familia.setCustomValidity(''));
  const photoDialog = $('#photo-dialog');
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    const image = button.querySelector('img'), preview = photoDialog.querySelector('img');
    preview.src = image.src; preview.alt = image.alt; photoDialog.showModal();
  }));
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  if (photoDialog) photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
  const calendar = $('[data-calendar]');
  if (calendar) calendar.addEventListener('click', () => {
    const start = new Date(document.body.dataset.date), end = new Date(start.getTime() + 4 * 3600000);
    const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const escape = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const content = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invita Lindo//Muestras//ES','BEGIN:VEVENT',
      `UID:${document.body.dataset.model}@invitalindo.com`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,
      `SUMMARY:${escape('MUESTRA · ' + document.body.dataset.title)}`,'DESCRIPTION:Invitación de demostración. No es un evento real.',`LOCATION:${escape(document.body.dataset.place)}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url = URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = `muestra-${document.body.dataset.model}.ics`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
