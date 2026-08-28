/* Maghairzijn - alles werkt ook zonder dit bestand. */

/* open of dicht, uit hun eigen openingstijden */
var UREN = [[540, 930], [540, 1020], [540, 1050], [540, 1260], [540, 1050], [540, 1020], null];
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
var DIENSTEN = [{"g": "Knippen & Verzorgen", "n": "Vrouwen - Wassen & Knippen & drogen", "p": null, "d": "30 min"}, {"g": "Knippen & Verzorgen", "n": "Vrouwen - Wassen & Knippen & föhnen", "p": null, "d": "45 min"}, {"g": "Knippen & Verzorgen", "n": "Wassen & Föhnen", "p": null, "d": "30 min"}, {"g": "Knippen & Verzorgen", "n": "Mannen - Wassen & Knippen & Stylen", "p": "40.50", "d": "30 min"}, {"g": "Knippen & Verzorgen", "n": "Mannen - Tondeuse", "p": "24.00", "d": "15 min"}, {"g": "Knippen & Verzorgen", "n": "Kind knippen TOT 13 jaar  - Knippen EXCL. wassen", "p": "29.00", "d": "30 min"}, {"g": "Kleuren", "n": "Kleuren", "p": null, "d": "1 uur 15 min"}, {"g": "Kleuren", "n": "Folies - Heel hoofd", "p": null, "d": "1 uur 45 min"}, {"g": "Kleuren", "n": "Vrouwen-folies deel van het haar- vanaf", "p": null, "d": "1 uur 35 min"}, {"g": "Kleur- & Knipcombinaties", "n": "Kleuren, knippen & drogen", "p": null, "d": "1 uur 30 min"}, {"g": "Kleur- & Knipcombinaties", "n": "Folies deel van het hoofd, knippen & drogen", "p": null, "d": "1 uur 45 min"}, {"g": "Kleur- & Knipcombinaties", "n": "Folies deel van het hoofd, knippen & föhnen", "p": null, "d": "2 uur"}, {"g": "Kleur- & Knipcombinaties", "n": "Folies heel hoofd, knippen & drogen", "p": null, "d": "2 uur 10 min"}, {"g": "Kleur- & Knipcombinaties", "n": "Folies heel hoofd, knippen & föhnen", "p": null, "d": "2 uur 10 min"}, {"g": "Keratinebehandeling", "n": "Keratinebehandeling Kort haar tot BOVEN de schouders", "p": "200.00", "d": "2 uur 40 min"}, {"g": "Keratinebehandeling", "n": "Keratinebehandeling Halflang haar tot NET OVER schouders", "p": "230.00", "d": "3 uur 10 min"}, {"g": "Keratinebehandeling", "n": "Keratinebehandeling LANG/DIK haar", "p": "290.00", "d": "3 uur 50 min"}, {"g": "Verzorging", "n": "Olaplex-behandeling", "p": null, "d": "1 uur"}, {"g": "Deelmassages", "n": "Hoofdmassage", "p": "32.50", "d": "15 min"}];
var WA = '31642441832', MAIL = '', AANHEF = "Hallo Kelly en L\u00e9onne";
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

/* menu op de telefoon */
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
/* de kop krimpt zodra je voorbij de hero bent */
(function(){
  var b = document.getElementById('bovenaan');
  if (!b) return;
  var los = function(){ b.classList.toggle('vast', window.scrollY > 120); };
  los(); window.addEventListener('scroll', los, { passive: true });
})();
