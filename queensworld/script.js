/* Gedeeld over alle vijf de pagina's.
   1. rekent live uit of de salon open is
   2. laat blokken binnenkomen bij het scrollen
   3. vangnet: gaat er iets stuk, dan is de pagina gewoon zichtbaar */
(function(){
  "use strict";

  /* Zes dagen open, alleen zondag dicht. Oneven dagen tot negen uur.
     [openminuut, sluitminuut]. */
  var UREN = { 0:null, 1:[540,1260], 2:[600,1200], 3:[540,1260], 4:[600,1200], 5:[540,1260], 6:[600,1200] };
  var DAGEN = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];

  function tijd(m){
    var u = Math.floor(m/60), r = m%60;
    return (u<10?"0"+u:u) + ":" + (r<10?"0"+r:r);
  }

  function toonStatus(){
    var tekst = document.getElementById("nu-tekst");
    var stip  = document.getElementById("stip");
    var nu = new Date(), dag = nu.getDay(), min = nu.getHours()*60 + nu.getMinutes();
    var vandaag = UREN[dag];

    if (tekst && stip) {
      if (vandaag && min >= vandaag[0] && min < vandaag[1]) {
        tekst.textContent = "Nu in de salon, tot " + tijd(vandaag[1]);
        stip.classList.remove("dicht");
      } else {
        var volgende = null, wanneer = "";
        if (vandaag && min < vandaag[0]) { volgende = vandaag[0]; wanneer = "vandaag"; }
        else {
          for (var i = 1; i <= 7; i++) {
            var d = (dag + i) % 7;
            if (UREN[d]) { volgende = UREN[d][0]; wanneer = (i===1) ? "morgen" : DAGEN[d]; break; }
          }
        }
        tekst.textContent = volgende === null
          ? "Bekijk de openingstijden"
          : "Nu gesloten, " + wanneer + " open om " + tijd(volgende);
        stip.classList.add("dicht");
      }
    }

    var rij = document.querySelector('#urentabel tr[data-dag="' + dag + '"]');
    if (rij) rij.classList.add("vandaag");
  }


  /* De klachtenkiezer in de hero. Elke regel komt uit hun eigen
     behandelmenu; de omschrijving zegt alleen wat er gebeurt. */
  var KLACHTEN = [
    ["Rugpijn", "Rugmassage bij pijn", "30 tot 50 minuten", "vanaf \u20ac 55",
     "Gericht werken op de plek waar het vastzit, niet een algemene rugmassage."],
    ["Nek en schouders", "Rugmassage bij pijn", "30 tot 50 minuten", "vanaf \u20ac 55",
     "Dezelfde behandeling, gericht op de bovenrug, nek en schouders."],
    ["Ischias", "Ischias behandeling", "30 tot 45 minuten", "vanaf \u20ac 65",
     "Op de zenuwbaan die vanuit de onderrug het been in straalt."],
    ["Bevroren schouder", "Bevroren schouder behandeling", "30 tot 45 minuten", "vanaf \u20ac 65",
     "Gericht op het weer op gang brengen van een schouder die vastzit."],
    ["Tennisarm", "Tennisarm behandeling", "30 tot 45 minuten", "vanaf \u20ac 65",
     "Op de aanhechting van de pezen bij de elleboog."],
    ["Na een operatie", "Revalidatie na een operatie", "50 minuten tot 1 uur 20", "vanaf \u20ac 100",
     "Na een heup- of kruisbandoperatie. De langste behandeling die er staat."],
    ["Na liposuctie", "Lymfedrainage na liposuctie", "30 tot 45 minuten", "vanaf \u20ac 65",
     "Om vocht af te voeren en het herstel op gang te helpen."],
    ["Slijmbeursontsteking", "Behandeling bij slijmbeursontsteking", "40 minuten", "\u20ac 85",
     "Gericht op de ontstoken slijmbeurs en het weefsel eromheen."],
    ["Vocht vasthouden", "Lymfedrainagemassage", "30 minuten tot 1 uur", "vanaf \u20ac 65",
     "Zachte, ritmische massage die het lymfestelsel op gang helpt."],
    ["Spanning en stress", "Anti-stressmassage", "55 minuten", "\u20ac 95",
     "Lichaam, hoofd en gezicht in \u00e9\u00e9n behandeling."],
    ["Sportblessure", "Sportmassage", "45 minuten", "\u20ac 85",
     "Voor herstel na inspanning of bij een blessure."],
    ["Wervelkolom", "Craniosacraaltherapie", "50 minuten", "\u20ac 85",
     "Zachte techniek langs de wervelkolom en de schedelbasis."],
    ["Buikklachten", "Viscerale massage", "40 minuten", "\u20ac 85",
     "Op de organen in de buik en het bindweefsel eromheen."],
    ["Cellulite", "Anti-cellulitemassage", "50 minuten", "vanaf \u20ac 75",
     "Werkt in kuren; hoeveel behandelingen er nodig zijn hoor je bij de intake."],
    ["Gewoon ontspannen", "Ontspanningsmassage", "45 minuten", "\u20ac 85",
     "Geen klacht nodig. De meest geboekte behandeling van de salon."]
  ];

  function kiezer(){
    var doos = document.getElementById("klachtknoppen");
    var uit  = document.getElementById("uitkomst");
    if (!doos || !uit) return;

    KLACHTEN.forEach(function(k, i){
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = k[0];
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function(){
        for (var j = 0; j < doos.children.length; j++) {
          doos.children[j].setAttribute("aria-pressed", "false");
        }
        b.setAttribute("aria-pressed", "true");
        toon(i);
      });
      doos.appendChild(b);
    });

    function toon(i){
      var k = KLACHTEN[i];
      uit.innerHTML =
        '<p class="behandeling">' + k[1] + '</p>' +
        '<p class="meta"><span>' + k[2] + '</span><b>' + k[3] + '</b></p>' +
        '<p class="wat">' + k[4] + '</p>' +
        '<a class="knop knop-vol" href="afspraak.html">Kijk wanneer er plek is</a>';
      uit.classList.remove("uitkomst-in");
      void uit.offsetWidth;
      uit.classList.add("uitkomst-in");
    }
  }

  function beweging(){
    var mag = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var doelen = document.querySelectorAll(".op");
    if (!mag || !("IntersectionObserver" in window)) {
      for (var i=0;i<doelen.length;i++) doelen[i].classList.add("in");
      return;
    }
    var kijker = new IntersectionObserver(function(items){
      items.forEach(function(item){
        if (item.isIntersecting) { item.target.classList.add("in"); kijker.unobserve(item.target); }
      });
    }, { threshold:0.1, rootMargin:"0px 0px -6% 0px" });
    for (var j=0;j<doelen.length;j++) kijker.observe(doelen[j]);
  }

  function alleszichtbaar(){
    var doelen = document.querySelectorAll(".op");
    for (var i=0;i<doelen.length;i++) doelen[i].classList.add("in");
  }

  try {
    toonStatus();
    kiezer();
    beweging();
    setTimeout(function(){
      var eerste = document.querySelector(".op");
      if (eerste && !eerste.classList.contains("in")) alleszichtbaar();
    }, 1800);
  } catch (e) { alleszichtbaar(); }
})();
