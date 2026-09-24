const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-nav');
if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Sluit menu' : 'Open menu');
  });
}
const inquiry = document.getElementById('inquiry');
if (inquiry) {
  const option = new URLSearchParams(location.search).get('dienst');
  const values = {ontwerp:'Tuinontwerp', aanleg:'Tuinaanleg', onderhoud:'Tuinonderhoud', constructie:'Overkapping of schutting'};
  if (option && values[option]) inquiry.elements.dienst.value = values[option];
  inquiry.addEventListener('submit', event => {
    event.preventDefault();
    if (!inquiry.reportValidity()) return;
    const data = new FormData(inquiry);
    const message = `Hoi Stephan, ik wil graag mijn tuinplannen bespreken.\n\nNaam: ${data.get('naam')}\nPlaats: ${data.get('plaats')}\nOnderwerp: ${data.get('dienst')}\n\nMijn plannen: ${data.get('bericht')}`;
    const url = `https://wa.me/31640969065?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  });
}
