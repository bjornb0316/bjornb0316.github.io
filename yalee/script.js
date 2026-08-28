/* Yalee - werkt ook zonder dit bestand. */

/* open of dicht, uit hun eigen openingstijden */
var UREN = [null, null, [600, 900], [1050, 1320], [570, 1080], null, [720, 1020]];
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
var DIENSTEN = [{"g": "BROWS", "n": "Browshape only", "p": "30.00", "d": "30 min"}, {"g": "BROWS", "n": "Hybrid tint only", "p": "25.00", "d": "20 min"}, {"g": "BROWS", "n": "Browshape & Hybrid tint", "p": "45.00", "d": "45 min"}, {"g": "BROWLAMINATION", "n": "Browlamination only", "p": "55.00", "d": "30 min"}, {"g": "BROWLAMINATION", "n": "Browlamination & shape", "p": "60.00", "d": "1 uur"}, {"g": "BROWLAMINATION", "n": "Browlamination & shape & hybrid", "p": "65.00", "d": "1 uur"}, {"g": "HALAL BROWS", "n": "Halal removal", "p": "35.00", "d": "30 min"}, {"g": "HALAL BROWS", "n": "Halal removal & hybrid tint", "p": "50.00", "d": "45 min"}, {"g": "HALAL BROWS", "n": "Halal removal & lamination", "p": "65.00", "d": "1 uur"}, {"g": "HALAL BROWS", "n": "Halal removal & lamination & hybrid tint", "p": "70.00", "d": "1 uur 10 min"}, {"g": "LASH LIFT", "n": "Eyelash tint", "p": "20.00", "d": "15 min"}, {"g": "CLASSICS LASH EXTENSIONS", "n": "Classics new set", "p": "65.00", "d": "2 uur"}, {"g": "CLASSICS LASH EXTENSIONS", "n": "Classics - Refill 1 week (touch up)", "p": "30.00", "d": "50 min"}, {"g": "CLASSICS LASH EXTENSIONS", "n": "Classics -  Refill 2 weeks", "p": "40.00", "d": "1 uur 15 min"}, {"g": "CLASSICS LASH EXTENSIONS", "n": "Classics -  Refill 3 weeks", "p": "50.00", "d": "1 uur 40 min"}, {"g": "WETSET LASH EXTENSIONS", "n": "Wetset nieuw set", "p": "70.00", "d": "2 uur"}, {"g": "WETSET LASH EXTENSIONS", "n": "WETSET - Refill 1 week (touch up)", "p": "35.00", "d": "45 min"}, {"g": "WETSET LASH EXTENSIONS", "n": "WETSET -  Refill 2 weeks", "p": "45.00", "d": "1 uur 15 min"}, {"g": "WETSET LASH EXTENSIONS", "n": "WETSET -  Refill 3 weeks", "p": "55.00", "d": "1 uur 40 min"}, {"g": "LASH EXTENSIONS", "n": "HYBRID - Hybrid New Set", "p": "75.00", "d": "2 uur"}, {"g": "LASH EXTENSIONS", "n": "Eyelash removal", "p": "25.00", "d": "30 min"}, {"g": "LASH EXTENSIONS", "n": "HYBRID - HYBRID - Refill 1 week (touch up)", "p": "40.00", "d": "50 min"}, {"g": "LASH EXTENSIONS", "n": "HYBRID - HYBRID - Refill 2 weeks", "p": "50.00", "d": "1 uur 15 min"}, {"g": "LASH EXTENSIONS", "n": "HYBRID - HYBRID - Refill 3 weeks", "p": "60.00", "d": "1 uur 40 min"}, {"g": "WAX", "n": "Boven lip", "p": "7.50", "d": "10 min"}, {"g": "COMBI DEAL", "n": "Browlamination x Hybrid + korean lashlift incl. brow shape", "p": "120.00", "d": "1 uur 15 min"}, {"g": "COMBI DEAL", "n": "Browlamination x Shape + korean lashlift", "p": "110.00", "d": "1 uur 5 min"}, {"g": "COMBI DEAL", "n": "Hybrid tint x shape + Korean lashlift", "p": "100.00", "d": "1 uur 5 min"}];
var WA = '', MAIL = 'fleekybrowsnl@gmail.com', AANHEF = "Hallo Anggita en Jennifer";
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
