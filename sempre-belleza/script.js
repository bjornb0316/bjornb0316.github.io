/* Sempre Belleza - werkt ook zonder dit bestand. */

/* open of dicht, uit hun eigen openingstijden */
var UREN = [[540, 1020], [540, 1260], [540, 1020], [540, 1020], [540, 1020], [540, 1020], null];
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
var DIENSTEN = [{"g": "Definitief Ontharen / Laser Ontharen", "n": "Laserontharen / definitief ontharen Diode Ice Laser", "p": null, "d": "10 min"}, {"g": "Definitief Ontharen / Laser Ontharen", "n": "Combideal carbon laser & lashlift", "p": "99.95", "d": "1 uur 20 min"}, {"g": "Permanent Make-up (PMU)", "n": "Powderbrows (incl. nabehandeling)", "p": null, "d": "1 uur"}, {"g": "Permanent Make-up (PMU)", "n": "Ombre Brows (incl. nabehandeling)", "p": "275.00", "d": "1 uur"}, {"g": "Permanent Make-up (PMU)", "n": "Microblading (incl. nabehandeling)", "p": "275.00", "d": "1 uur"}, {"g": "Permanent Make-up (PMU)", "n": "Eyeliners (incl. nabehandeling)", "p": null, "d": "30 min"}, {"g": "Permanent Make-up (PMU)", "n": "Full Lips (incl. nabehandeling)", "p": "275.00", "d": "1 uur 30 min"}, {"g": "Permanent Make-up (PMU)", "n": "Tatoeages verwijderen met Picolaser", "p": null, "d": "15 min"}, {"g": "Permanent Make-up (PMU)", "n": "PMU verwijderen met Picolaser", "p": null, "d": "15 min"}, {"g": "Gezichtsbehandelingen / Laser", "n": "Plex-R/ Fibroblast laser (rimpel) behandelingen", "p": null, "d": "15 min"}, {"g": "Piercings", "n": "Piercings", "p": null, "d": "15 min"}, {"g": "Permanente Make-up Opfrissen/touch Up", "n": "PMU - Opfrissen (touch up)", "p": null, "d": "30 min"}, {"g": "Permanente Make-up Opfrissen/touch Up", "n": "MHP (Micro hair pigmentation)", "p": null, "d": "1 uur"}, {"g": "PMU & Tattoos", "n": "Tattoo workshop", "p": null, "d": "2 uur 30 min"}, {"g": "Lash Lift", "n": "Lash Lift", "p": null, "d": "45 min"}, {"g": "Epileren Met Draad", "n": "Epileren met draad", "p": null, "d": "15 min"}, {"g": "Huidverbetering", "n": "Carbon laser-peeling", "p": null, "d": "45 min"}, {"g": "Huidverbetering", "n": "Microneedling", "p": "75.00", "d": "1 uur"}, {"g": "Huidverbetering", "n": "Glycolzuurpeeling", "p": "50.00", "d": "30 min"}, {"g": "Huidverbetering", "n": "CO2 laser", "p": null, "d": "1 uur"}];
var WA = '31629364447', MAIL = 'info@sempre.nl', AANHEF = "Goedendag";
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
