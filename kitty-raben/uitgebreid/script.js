/* Kitty Raben - uitgebreide versie. Alles werkt ook zonder dit bestand, de knoppen vallen dan terug op bellen en appen. */
(function(){
  var TEL = '31636107145', MAIL = 'info@kittyraben.nl';
  var traag = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heeftIO = 'IntersectionObserver' in window;
  var params = new URLSearchParams(location.search);

  /* ---------- menu ---------- */
  var knop = document.getElementById('menuknop'), nav = document.getElementById('nav');
  function zetMenu(open){
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    knop.setAttribute('aria-expanded', open);
    knop.textContent = open ? 'Sluiten' : 'Menu';
  }
  if (knop && nav){
    knop.addEventListener('click', function(){ zetMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function(e){ if (e.target.closest('a')) zetMenu(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && nav.classList.contains('open')) zetMenu(false); });
  }

  /* ---------- kop en mobiele balk ---------- */
  var kop = document.getElementById('kop'), balk = document.getElementById('mobielbalk');
  var boven = document.querySelector('.hero, .paginakop');
  if (boven && heeftIO){
    new IntersectionObserver(function(r){
      var weg = !r[0].isIntersecting;
      if (kop) kop.classList.toggle('gescrold', weg);
      if (balk) balk.classList.toggle('aan', weg);
    }, {rootMargin:'-90px 0px 0px 0px'}).observe(boven);
  } else if (balk){ balk.classList.add('aan'); if (kop) kop.classList.add('gescrold'); }

  /* ---------- onthullen ---------- */
  var items = document.querySelectorAll('.onthul');
  if (traag || !heeftIO){ items.forEach(function(el){ el.classList.add('zicht'); }); }
  else {
    var kijk = new IntersectionObserver(function(rijen){
      rijen.forEach(function(r){ if (r.isIntersecting){ r.target.classList.add('zicht'); kijk.unobserve(r.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){ kijk.observe(el); });
  }

  /* ---------- tabs op de behandelpagina volgen de scroll ---------- */
  var tabs = document.querySelectorAll('.tabs a');
  if (tabs.length && heeftIO){
    var kaart = {};
    tabs.forEach(function(t){ kaart[t.getAttribute('href').slice(1)] = t; });
    var volg = new IntersectionObserver(function(rijen){
      rijen.forEach(function(r){
        if (r.isIntersecting && kaart[r.target.id]){
          tabs.forEach(function(t){ t.classList.remove('actief'); });
          kaart[r.target.id].classList.add('actief');
        }
      });
    }, {rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.categorie').forEach(function(c){ volg.observe(c); });
  }

  /* ---------- stappen-motor (matcher en aanvraagformulieren) ---------- */
  function stappen(root, klaar){
    var lijst = [].slice.call(root.querySelectorAll('[data-stap]'));
    var balkje = root.querySelector('.voortgang span');
    var teller = root.querySelector('[data-teller]');
    var terug = root.querySelector('.terug');
    var antwoorden = {}, nu = 0;

    function toon(i){
      nu = i;
      lijst.forEach(function(s, j){ s.classList.toggle('actief', j === i); });
      if (balkje) balkje.style.width = ((i + 1) / lijst.length * 100) + '%';
      if (teller) teller.textContent = (i + 1) + ' / ' + lijst.length;
      if (terug) terug.hidden = i === 0;
      var eerste = lijst[i].querySelector('.optie, input');
      if (eerste && i > 0 && document.activeElement && root.contains(document.activeElement)) eerste.focus({preventScroll:true});
      if (root.onStap) root.onStap(i, antwoorden);
    }
    root.addEventListener('click', function(e){
      var o = e.target.closest('.optie');
      if (!o || !root.contains(o)) return;
      var stap = o.closest('[data-stap]');
      stap.querySelectorAll('.optie').forEach(function(x){ x.classList.remove('gekozen'); x.setAttribute('aria-pressed', 'false'); });
      o.classList.add('gekozen'); o.setAttribute('aria-pressed', 'true');
      antwoorden[stap.getAttribute('data-stap')] = o.getAttribute('data-waarde');
      setTimeout(function(){
        if (nu < lijst.length - 1) toon(nu + 1); else if (klaar) klaar(antwoorden);
      }, traag ? 0 : 220);
    });
    if (terug) terug.addEventListener('click', function(){ if (nu > 0) toon(nu - 1); });
    return {
      antwoorden: antwoorden,
      toon: toon,
      kies: function(naam, waarde){
        var s = root.querySelector('[data-stap="' + naam + '"]');
        if (!s) return false;
        var o = [].find.call(s.querySelectorAll('.optie'), function(x){ return x.getAttribute('data-waarde').toLowerCase().indexOf(waarde.toLowerCase()) === 0; });
        if (!o) return false;
        o.classList.add('gekozen'); antwoorden[naam] = o.getAttribute('data-waarde');
        return true;
      },
      herstart: function(){ for (var k in antwoorden) delete antwoorden[k]; root.querySelectorAll('.gekozen').forEach(function(x){ x.classList.remove('gekozen'); }); toon(0); }
    };
  }

  /* ---------- wat past bij mij ---------- */
  var matcher = document.getElementById('matcher');
  if (matcher){
    var uit = matcher.querySelector('.uitkomst');
    var m = stappen(matcher, function(a){
      var doel = a.doel, tijd = a.tijd, eerste = a.eerste === 'ja', r;
      if (doel === 'huid'){
        if (tijd === 'kort') r = ['Mini gezichtsbehandeling', '30 minuten, € 25,00', 'Reinigen, een ampul, dagverzorging en een lichte make-up. Past in een drukke dag.'];
        else if (eerste || tijd === 'lang') r = ['Volledige behandeling', '€ 45,00', 'Reinigen, peeling, massage en masker. Een goed begin: Kitty bekijkt eerst uw huid en past de behandeling daarop aan.'];
        else r = ['Gezichtsbehandeling de Luxe', '€ 69,95', 'De meest uitgebreide behandeling, met saltscrub, serum, ampul en een rubbermasker dat de huid verstevigt.'];
      } else if (doel === 'haar'){
        r = eerste ? ['Gratis intakegesprek', 'gratis en vrijblijvend', 'Eerst rustig bespreken of definitief ontharen bij u past. Vraag ook uw zorgverzekeraar naar vergoeding.']
                   : ['Definitief ontharen', '30 minuten, € 35,00', 'Elektrische epilatie in het gezicht. Ook steelwratjes en couperose zijn te behandelen.'];
      } else if (doel === 'rust'){
        r = tijd === 'kort' ? ['Massage rug en nek', '€ 19,50', 'Even de spanning eruit, zonder dat het uw hele middag kost.']
                            : ['Hotstone rug- en nekmassage', '€ 22,50', 'Warme stenen maken de spieren los. Te combineren met een gezichtsbehandeling.'];
      } else {
        r = ['Make-up', '€ 22,50', 'Voor een feest of avond uit, met make-up van LOOkX. Gaat u trouwen? Vraag naar het bruidsarrangement van € 120,00.'];
      }
      uit.querySelector('h3').textContent = r[0];
      uit.querySelector('.prijs').textContent = r[1];
      uit.querySelector('p.uitleg').textContent = r[2];
      uit.querySelector('[data-boek]').href = 'afspraak.html?beh=' + encodeURIComponent(r[0]);
      matcher.querySelectorAll('[data-stap]').forEach(function(s){ s.classList.remove('actief'); });
      matcher.querySelector('.terug').hidden = true;
      matcher.querySelector('[data-teller]').textContent = 'Advies';
      uit.classList.add('aan');
    });
    matcher.querySelector('[data-opnieuw]').addEventListener('click', function(){ uit.classList.remove('aan'); m.herstart(); });
    m.toon(0);
  }

  /* ---------- aanvraagformulieren ---------- */
  function aanvraag(form, maakBericht, voorkeuze){
    var klaar = form.parentNode.querySelector('.klaar');
    var vb = form.querySelector('.voorbeeld');
    var f = stappen(form);
    function ververs(){ if (vb) vb.textContent = maakBericht(f.antwoorden, form); }
    form.onStap = ververs;
    form.addEventListener('input', ververs);
    var start = 0;
    if (voorkeuze && f.kies(voorkeuze[0], voorkeuze[1])) start = 1;
    f.toon(start);

    var via = 'wa';
    form.querySelectorAll('[data-via]').forEach(function(b){ b.addEventListener('click', function(){ via = b.getAttribute('data-via'); }); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var naam = form.querySelector('[name=naam]'), fout = form.querySelector('.fout');
      if (!naam.value.trim()){ fout.classList.add('aan'); naam.focus(); return; }
      fout.classList.remove('aan');
      var t = maakBericht(f.antwoorden, form);
      var url = via === 'mail'
        ? 'mailto:' + MAIL + '?subject=' + encodeURIComponent(form.getAttribute('data-onderwerp')) + '&body=' + encodeURIComponent(t)
        : 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(t);
      if (via === 'mail') location.href = url; else window.open(url, '_blank', 'noopener');
      form.hidden = true;
      if (klaar){ klaar.classList.add('aan'); klaar.setAttribute('tabindex', '-1'); klaar.focus(); }
    });
    var weer = klaar && klaar.querySelector('[data-opnieuw]');
    if (weer) weer.addEventListener('click', function(){ klaar.classList.remove('aan'); form.hidden = false; f.herstart(); });
    return f;
  }

  var afspraak = document.getElementById('afspraakform');
  if (afspraak){
    aanvraag(afspraak, function(a, f){
      var r = ['Goedendag Kitty,', '', 'Ik wil graag een afspraak maken voor: ' + (a.behandeling || 'een behandeling') + '.'];
      if (a.eerste) r.push(a.eerste === 'ja' ? 'Het is mijn eerste keer bij u.' : 'Ik ben al eerder bij u geweest.');
      if (a.moment) r.push('Het liefst ' + a.moment + '.');
      var opm = f.opmerking.value.trim(), tel = f.telefoon.value.trim();
      if (opm) r.push('Goed om te weten: ' + opm);
      if (tel) r.push('U kunt mij bereiken op ' + tel + '.');
      r.push('', 'Met vriendelijke groet,', f.naam.value.trim() || '[uw naam]');
      return r.join('\n');
    }, params.get('beh') ? ['behandeling', params.get('beh')] : null);
  }

  var workshop = document.getElementById('workshopform');
  if (workshop){
    var wf = aanvraag(workshop, function(a, f){
      var r = ['Goedendag Kitty,', '', 'Wij willen graag een workshop doen: ' + (a.arrangement || 'nog te kiezen') + '.'];
      if (a.aantal) r.push('We zijn met ' + a.aantal + ' personen.');
      if (a.moment) r.push('Het liefst ' + a.moment + '.');
      var opm = f.opmerking.value.trim();
      if (opm) r.push('Goed om te weten: ' + opm);
      r.push('', 'Met vriendelijke groet,', f.naam.value.trim() || '[uw naam]');
      return r.join('\n');
    }, params.get('ws') ? ['arrangement', params.get('ws')] : null);

    /* de knop onder een arrangement kiest hem en springt naar het formulier */
    document.querySelectorAll('[data-ws]').forEach(function(b){
      b.addEventListener('click', function(e){
        e.preventDefault();
        var url = new URL(location.href); url.searchParams.set('ws', b.getAttribute('data-ws'));
        history.replaceState(null, '', url.pathname + url.search);
        workshop.querySelectorAll('[data-stap="arrangement"] .gekozen').forEach(function(x){ x.classList.remove('gekozen'); });
        if (wf.kies('arrangement', b.getAttribute('data-ws'))) wf.toon(1);
        document.getElementById('aanvragen').scrollIntoView({behavior: traag ? 'auto' : 'smooth'});
      });
    });
  }
})();
