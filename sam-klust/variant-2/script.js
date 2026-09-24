const menu = document.querySelector('.menu');
const mobile = document.querySelector('.mobile');
menu?.addEventListener('click', () => {
  const open = mobile.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Sluit menu' : 'Open menu');
});
const form = document.querySelector('#request');
if (form) {
  const requested = new URLSearchParams(location.search).get('werk');
  const options = {renovatie:'Renovatie', maatwerk:'Maatwerk', reparatie:'Reparatie'};
  if (options[requested]) form.elements.werk.value = options[requested];
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = `Hoi Sam, ik wil graag mijn project bespreken.\n\nNaam: ${data.get('naam')}\nPlaats: ${data.get('plaats')}\nOnderwerp: ${data.get('werk')}\nMijn plannen: ${data.get('bericht')}`;
    location.href = 'https://wa.me/31633005387?text=' + encodeURIComponent(message);
  });
}
