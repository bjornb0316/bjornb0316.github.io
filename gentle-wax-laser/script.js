/* Gedeeld over alle vijf de pagina's.
   1. rekent live uit of de salon open is
   2. laat blokken binnenkomen bij het scrollen
   3. vangnet: gaat er iets stuk, dan is de pagina gewoon zichtbaar */
(function(){
  "use strict";

  /* Woensdag, donderdag en zondag dicht. Doordeweeks tot ruim acht uur.
     [openminuut, sluitminuut]. */
  var UREN = { 0:null, 1:[660,1215], 2:[660,1170], 3:null, 4:null, 5:[810,1230], 6:[780,1080] };
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
    beweging();
    setTimeout(function(){
      var eerste = document.querySelector(".op");
      if (eerste && !eerste.classList.contains("in")) alleszichtbaar();
    }, 1800);
  } catch (e) { alleszichtbaar(); }
})();
