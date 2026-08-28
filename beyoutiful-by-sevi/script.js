/* Be.you.tiful by Sevi - de pagina werkt ook zonder dit bestand. */

/* open of dicht, uit hun eigen openingstijden */
var UREN = [[600, 1260], [600, 1200], [600, 1080], [600, 1200], [600, 1260], [540, 960], [540, 960]];
var DAGNAAM = ['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag'];
function klok(){
  var el = document.querySelectorAll('[data-klok]');
  if (!el.length) return;
  var nu = new Date(), d = (nu.getDay() + 6) % 7, m = nu.getHours()*60 + nu.getMinutes();
  var vandaag = UREN[d], open = !!vandaag && m >= vandaag[0] && m < vandaag[1];
  var tekst;
  if (open) {
    var rest = vandaag[1] - m;
    tekst = rest <= 60 ? 'Nu open, nog ' + rest + ' minuten'
                       : 'Nu open tot ' + tijd(vandaag[1]);
  } else {
    var i = (!vandaag || m >= vandaag[1]) ? 1 : 0, k = 0;
    while (k < 8 && !UREN[(d + i) % 7]) { i++; k++; }
    var v = UREN[(d + i) % 7];
    if (!v) tekst = 'Op afspraak';
    else if (i === 0) tekst = 'Vandaag open vanaf ' + tijd(v[0]);
    else if (i === 1) tekst = 'Morgen open vanaf ' + tijd(v[0]);
    else tekst = DAGNAAM[(d + i) % 7] + ' weer open vanaf ' + tijd(v[0]);
  }
  for (var j = 0; j < el.length; j++) {
    el[j].textContent = tekst;
    el[j].setAttribute('data-open', open ? 'ja' : 'nee');
  }
}
function tijd(m){ return (m/60|0) + ':' + ('0' + (m%60)).slice(-2); }
klok(); setInterval(klok, 60000);

/* de afspraakhulp: stelt het bericht op terwijl je kiest */
var DIENSTEN = [{"g": "Hair", "n": "Vrouwen - Wassen, knippen & drogen", "p": null, "d": "1 uur"}, {"g": "Hair", "n": "Vrouwen - Droog knippen", "p": "40.00", "d": "50 min"}, {"g": "Hair", "n": "Bruidskapsel incl. make-up", "p": "250.00", "d": "2 uur 30 min"}, {"g": "Hair", "n": "Bruidskapsel", "p": "130.00", "d": "1 uur 30 min"}, {"g": "Hair", "n": "Bruidskapsel incl. proefsessie", "p": "180.00", "d": "1 uur 30 min"}, {"g": "Hair", "n": "Vrouwen - Toner", "p": null, "d": "1 uur"}, {"g": "Manicure & Pedicure", "n": "Express Manicure without colour", "p": "28.00", "d": "30 min"}, {"g": "Manicure & Pedicure", "n": "Express Pedicure", "p": "28.00", "d": "30 min"}, {"g": "Manicure & Pedicure", "n": "Pedicure (without colour)", "p": "40.00", "d": "1 uur"}, {"g": "Manicure & Pedicure", "n": "Spa pedicure without colour", "p": "60.00", "d": "1 uur 15 min"}, {"g": "Manicure & Pedicure", "n": "Pedicure (with colour)", "p": "50.00", "d": "1 uur 15 min"}, {"g": "Manicure & Pedicure", "n": "Express Manicure", "p": null, "d": "20 min"}, {"g": "Shellac Manicures & Pedicures", "n": "Shellac Manicure", "p": null, "d": "45 min"}, {"g": "Shellac Manicures & Pedicures", "n": "Shellac Removal", "p": "15.00", "d": "20 min"}, {"g": "Shellac Manicures & Pedicures", "n": "Shellac Pedicure", "p": null, "d": "45 min"}, {"g": "Shellac Manicures & Pedicures", "n": "Shellac Spa Pedicure", "p": null, "d": "1 uur 20 min"}, {"g": "Nail Extensions", "n": "Nail Strengthening - BIAB", "p": "50.00", "d": "1 uur"}, {"g": "Nail Extensions", "n": "Acrylic Nail Extensions - New Set", "p": null, "d": "1 uur 30 min"}, {"g": "Nail Extensions", "n": "Acrylic Nail Extensions - Infill", "p": "50.00", "d": "1 uur 15 min"}, {"g": "Nail Extensions", "n": "Gel Nails - New Set", "p": null, "d": "1 uur 30 min"}, {"g": "Nail Extensions", "n": "Gel Nails - Infill", "p": "50.00", "d": "1 uur 15 min"}, {"g": "Nail Extensions", "n": "Acrylic Nail Extensions - Removal", "p": "20.00", "d": "30 min"}, {"g": "Nail Extensions", "n": "Gel Nails - Removal", "p": "18.00", "d": "30 min"}, {"g": "Nail Extensions", "n": "BIAB Removal", "p": "15.00", "d": "20 min"}, {"g": "Nail Extensions", "n": "Nail Strengthening - BIAB with removal old set", "p": "60.00", "d": "1 uur 30 min"}, {"g": "Eyebrows & Eyelashes", "n": "Eyebrow Cleansing", "p": null, "d": "15 min"}, {"g": "Eyebrows & Eyelashes", "n": "Eyebrow Threading", "p": "18.00", "d": "20 min"}, {"g": "Eyebrows & Eyelashes", "n": "Eyebrow Tint", "p": "12.00", "d": "20 min"}, {"g": "Eyebrows & Eyelashes", "n": "Lash Lift", "p": null, "d": "45 min"}, {"g": "Eyebrows & Eyelashes", "n": "Eyelash & Eyebrow Tint", "p": "25.00", "d": "30 min"}, {"g": "Eyebrows & Eyelashes", "n": "Microblading pre-advice and shaping", "p": "10.00", "d": "15 min"}, {"g": "Eyelash Extensions", "n": "Eyelash Extensions One by One - New Set", "p": "55.00", "d": "1 uur 15 min"}, {"g": "Eyelash Extensions", "n": "Eyelash Extensions - Infill One by One", "p": "40.00", "d": "55 min"}, {"g": "Eyelash Extensions", "n": "Eyelash Extensions - Removal", "p": "20.00", "d": "30 min"}, {"g": "Eyelash Extensions", "n": "Eyelash extension 2D volume - New set", "p": "65.00", "d": "1 uur 30 min"}, {"g": "Eyelash Extensions", "n": "Eyelash Extensions - Infill 2D volume", "p": "50.00", "d": "1 uur"}, {"g": "Threading", "n": "Threading - Face", "p": null, "d": "15 min"}, {"g": "Women - Waxing", "n": "Ladies waxing - Face", "p": null, "d": "15 min"}, {"g": "Make-up", "n": "Day Make Up", "p": "45.00", "d": "40 min"}, {"g": "Make-up", "n": "Night Make Up", "p": "60.00", "d": "1 uur"}, {"g": "Make-up", "n": "Bridal Make Up", "p": "150.00", "d": "2 uur"}];
var WA = '31649360086', MAIL = '', AANHEF = "Hallo Sevi";
(function(){
  var kies = document.getElementById('v-behandeling');
  if (!kies) return;
  var groep = '', el;
  for (var i = 0; i < DIENSTEN.length; i++) {
    var d = DIENSTEN[i];
    if (d.g !== groep) { groep = d.g; el = document.createElement('optgroup');
      el.label = groep.charAt(0) + groep.slice(1).toLowerCase(); kies.appendChild(el); }
    var o = document.createElement('option');
    o.value = d.n;
    o.textContent = d.n + (d.p ? '  \u00b7  \u20ac' + String(d.p).replace('.00','').replace('.',',') : '')
      + (d.d ? '  (' + d.d + ')' : '');
    (el || kies).appendChild(o);
  }
  var vooraf = new URLSearchParams(location.search).get('behandeling');
  if (vooraf) { for (var j = 0; j < kies.options.length; j++)
    if (kies.options[j].value === vooraf) { kies.selectedIndex = j; break; } }

  var vel = ['v-behandeling','v-wanneer','v-naam','v-tel'].map(function(x){ return document.getElementById(x); });
  var bericht = document.getElementById('v-bericht');

  function stel(){
    var b = vel[0].value, w = vel[1].value, n = vel[2].value.trim(), t = vel[3].value.trim();
    var r = AANHEF + ',\n\nIk zou graag een afspraak maken voor ' + b + '.';
    r += ' Het schikt mij ' + w + '.';
    if (n) r += '\n\nMijn naam is ' + n + '.';
    if (t) r += (n ? ' ' : '\n\n') + 'Je kunt mij bereiken op ' + t + '.';
    r += '\n\nHoor ik van je?';
    if (n) r += '\n\nGroet, ' + n;
    bericht.value = r;
    if (WA) document.getElementById('naar-wa').href =
      'https://wa.me/' + WA + '?text=' + encodeURIComponent(r);
    if (MAIL) document.getElementById('naar-mail').href =
      'mailto:' + MAIL + '?subject=' + encodeURIComponent('Afspraak: ' + b) +
      '&body=' + encodeURIComponent(r);
  }
  for (var k = 0; k < vel.length; k++) vel[k].addEventListener('input', stel);
  bericht.addEventListener('input', function(){
    if (WA) document.getElementById('naar-wa').href =
      'https://wa.me/' + WA + '?text=' + encodeURIComponent(bericht.value);
    if (MAIL) document.getElementById('naar-mail').href =
      'mailto:' + MAIL + '?body=' + encodeURIComponent(bericht.value);
  });
  stel();

  var kn = document.getElementById('kopieer');
  if (kn) kn.addEventListener('click', function(){
    var melden = function(){ var g = document.getElementById('gedaan');
      g.classList.add('aan'); setTimeout(function(){ g.classList.remove('aan'); }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(bericht.value).then(melden, melden);
    else { bericht.select(); document.execCommand('copy'); melden(); }
  });
})();

(function(){
  var k = document.getElementById('menuknop'), m = document.getElementById('menu');
  if (!k || !m) return;
  document.body.classList.add('js');
  k.addEventListener('click', function(){
    var open = k.getAttribute('aria-expanded') === 'true';
    k.setAttribute('aria-expanded', String(!open));
    m.classList.toggle('open', !open);
  });
})();
/* de dag van vandaag oplichten in de avondlijst */
(function(){
  var r = document.querySelectorAll('.avond-rij');
  if (!r.length) return;
  var d = (new Date().getDay() + 6) % 7;
  if (r[d]) r[d].classList.add('vandaag');
})();
