/* Kitty Raben - compacte versie. De site werkt ook zonder dit bestand. */
(function(){
  var TEL = '31636107145', MAIL = 'info@kittyraben.nl';

  /* menu op de telefoon */
  var knop = document.getElementById('menuknop'), nav = document.getElementById('nav');
  if (knop && nav){
    knop.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      knop.setAttribute('aria-expanded', open);
      knop.textContent = open ? 'Sluiten' : 'Menu';
    });
    nav.addEventListener('click', function(e){
      if (e.target.tagName === 'A'){ nav.classList.remove('open'); knop.setAttribute('aria-expanded', false); knop.textContent = 'Menu'; }
    });
  }

  /* kop krijgt een lijn en de mobiele balk verschijnt zodra de bovenkant uit beeld is */
  var kop = document.getElementById('kop'), balk = document.getElementById('mobielbalk');
  var boven = document.querySelector('.hero, .paginakop');
  if (boven && 'IntersectionObserver' in window){
    new IntersectionObserver(function(r){
      var weg = !r[0].isIntersecting;
      if (kop) kop.classList.toggle('gescrold', weg);
      if (balk) balk.classList.toggle('aan', weg);
    }, {rootMargin:'-80px 0px 0px 0px'}).observe(boven);
  } else if (balk){ balk.classList.add('aan'); }

  /* rustig in beeld komen */
  var items = document.querySelectorAll('.onthul');
  var traag = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (traag || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('zicht'); });
  } else {
    var kijk = new IntersectionObserver(function(rijen){
      rijen.forEach(function(r){ if (r.isIntersecting){ r.target.classList.add('zicht'); kijk.unobserve(r.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){ kijk.observe(el); });
  }

  /* afspraakformulier: stelt een bericht op voor WhatsApp of mail */
  var form = document.getElementById('afspraakform');
  if (!form) return;
  var keuze = document.getElementById('behandeling');

  /* ?beh=... uit de prijslijst voorselecteren */
  var wens = new URLSearchParams(location.search).get('beh');
  if (wens){
    var raak = [].find.call(keuze.options, function(o){ return o.text.toLowerCase().indexOf(wens.toLowerCase()) === 0; });
    if (!raak){ raak = new Option(wens); keuze.add(raak, keuze.options.length - 1); }
    keuze.value = raak.value;
  }

  function bericht(){
    var moment = form.querySelector('input[name=moment]:checked');
    var opm = form.opmerking.value.trim();
    var r = ['Goedendag Kitty,', '', 'Ik wil graag een afspraak maken voor: ' + keuze.value + '.',
             'Het liefst ' + (moment ? moment.value : 'wanneer het u uitkomt') + '.'];
    if (opm) r.push('Goed om te weten: ' + opm);
    r.push('', 'Met vriendelijke groet,', form.naam.value.trim());
    return r.join('\n');
  }

  var via = 'wa';
  form.querySelectorAll('[data-via]').forEach(function(b){
    b.addEventListener('click', function(){ via = b.getAttribute('data-via'); });
  });
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var fout = document.getElementById('naamfout');
    if (!form.naam.value.trim()){ fout.classList.add('aan'); form.naam.focus(); return; }
    fout.classList.remove('aan');
    var t = bericht();
    location.href = via === 'mail'
      ? 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Afspraak aanvragen') + '&body=' + encodeURIComponent(t)
      : 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(t);
  });
})();
