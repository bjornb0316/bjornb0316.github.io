/* Mooi van Marian - werkt ook zonder dit bestand. */

/* open of dicht, uit hun eigen openingstijden */
var UREN = [[720, 1200], [540, 1050], [540, 1050], [540, 1140], [540, 1050], [540, 1020], null];
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
var DIENSTEN = [{"g": "Special Customized  Facial", "n": "Kruidenpeeling", "p": "94.50", "d": "1 uur"}, {"g": "Gezichtsbehandelingen Sensai", "n": "Sensai deluxe expert treatment / exclusive anti age treatment", "p": "136.50", "d": "1 uur 30 min"}, {"g": "Gezichtsbehandelingen Sensai", "n": "Sensai facial treatment", "p": "85.50", "d": "1 uur"}, {"g": "Gezichtsbehandelingen Sensai", "n": "Sensai intensive facial treatment", "p": "98.50", "d": "1 uur 15 min"}, {"g": "Gezichtsbehandelingen Clarins", "n": "Clarins intensive cleansing facial", "p": "53.50", "d": "45 min"}, {"g": "Gezichtsbehandelingen Clarins", "n": "Clarins intensive facial", "p": "90.00", "d": "1 uur 30 min"}, {"g": "Gezichtsbehandelingen Clarins", "n": "Clarins perfect cleansing facial", "p": "78.50", "d": "1 uur"}, {"g": "Micro-needling", "n": "Micro-needling treatment", "p": "125.50", "d": "1 uur"}, {"g": "Micro-needling", "n": "Micro-needling kennismaking", "p": "103.00", "d": "1 uur"}, {"g": "Ontharen / Verven / Make - Up", "n": "Bruidsmake-up incl proef make-up en ampul", "p": "132.50", "d": "1 uur"}, {"g": "Ontharen / Verven / Make - Up", "n": "Epileren", "p": "21.00", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen armen", "p": "38.50", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen bikinilijn", "p": "36.00", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen bovenbenen", "p": "46.50", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen bovenlip en kin", "p": "25.50", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen bovenlip of kin", "p": "18.00", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen gelaat ( exclusief wenkbrauwen )", "p": "34.50", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen hele rug inclusief schouders", "p": "53.50", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen oksels", "p": "28.50", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Harsen schouders", "p": "38.00", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Hele benen harsen", "p": "59.00", "d": "1 uur"}, {"g": "Ontharen / Verven / Make - Up", "n": "Onderbenen harsen", "p": "42.00", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Wenkbrauwen verven", "p": "21.50", "d": "15 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Wenkbrauwen verven en epileren (voordeelcombinatie)", "p": "33.50", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Wimpers en wenkbrauwen verven", "p": "31.50", "d": "30 min"}, {"g": "Ontharen / Verven / Make - Up", "n": "Wimpers verven", "p": "21.50", "d": "15 min"}, {"g": "Bindweefsel Behandelingen", "n": "Bindweefsel massage gelaat 30min", "p": "48.50", "d": "30 min"}, {"g": "Pedicure", "n": "Gellak voeten", "p": "39.50", "d": "30 min"}, {"g": "Pedicure", "n": "Gellak voeten verwijderen + nieuwe kleur", "p": "45.00", "d": "45 min"}, {"g": "Pedicure", "n": "Pedicure", "p": "45.00", "d": "30 min"}, {"g": "Pedicure", "n": "Pedicure met gellak nieuw", "p": "66.50", "d": "45 min"}, {"g": "Pedicure", "n": "Pedicure extra", "p": "54.00", "d": "45 min"}, {"g": "Pedicure", "n": "Pedicure met voetmassage 15min", "p": "62.50", "d": "45 min"}, {"g": "Pedicure", "n": "Pedicure met voetmassage 30 min", "p": "78.50", "d": "1 uur"}, {"g": "Pedicure", "n": "Pedicure met nagellak", "p": "54.00", "d": "45 min"}, {"g": "Manicure / Gellak", "n": "Gellak handen nieuw", "p": "39.50", "d": "45 min"}, {"g": "Manicure / Gellak", "n": "Gellak handen verwijderen + nieuwe kleur", "p": "45.00", "d": "1 uur"}, {"g": "Manicure / Gellak", "n": "Manicure + lakken", "p": "47.50", "d": "45 min"}, {"g": "Manicure / Gellak", "n": "Manicure zonder lak", "p": "39.00", "d": "30 min"}, {"g": "Manicure / Gellak", "n": "BIAB nagels nieuw (excl. gellak)", "p": "53.50", "d": "45 min"}, {"g": "Manicure / Gellak", "n": "BIAB opvullen (excl. gellak)", "p": "62.50", "d": "1 uur"}, {"g": "Wimperlift", "n": "Wimperlift met wimpers verven", "p": "68.50", "d": "1 uur"}, {"g": "Massages", "n": "Lichaamsmassage", "p": "68.50", "d": "1 uur"}, {"g": "Massages", "n": "Rug/nek/schouder massage", "p": "45.00", "d": "30 min"}, {"g": "Massages", "n": "Hotstone massage rug/nek/schouders 30 minuten", "p": "47.50", "d": "30 min"}, {"g": "Men Treatment", "n": "Men cleansing treatment 30 minuten", "p": "42.00", "d": "30 min"}, {"g": "Men Treatment", "n": "Men cleansing facial 60 minuten", "p": "78.50", "d": "1 uur"}];
var WA = '', MAIL = 'voorburg@mooiparfumerie.nl', AANHEF = "Goedemiddag";
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
