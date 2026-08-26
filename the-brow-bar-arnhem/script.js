/* Gedeeld over alle vijf de pagina's.
   1. rekent live uit of de studio open is
   2. laat blokken binnenkomen bij het scrollen, zonder scroll-luisteraar
   3. vangnet: gaat er iets stuk, dan is de pagina gewoon zichtbaar */
(function(){
  "use strict";

  /* Maandag en zondag gesloten. [openminuut, sluitminuut]. */
  var UREN = { 0:null, 1:null, 2:[600,1020], 3:[720,1020], 4:[600,1020], 5:[600,1020], 6:[600,840] };
  var DAGEN = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];

  function tijd(m){
    var u = Math.floor(m/60), r = m%60;
    return (u<10?"0"+u:u) + ":" + (r<10?"0"+r:r);
  }

  function toonStatus(){
    var tekst = document.getElementById("nu-tekst");
    var stip = document.getElementById("stip");
    var nu = new Date(), dag = nu.getDay(), min = nu.getHours()*60 + nu.getMinutes();
    var vandaag = UREN[dag];

    if (tekst && stip) {
      if (vandaag && min >= vandaag[0] && min < vandaag[1]) {
        tekst.textContent = "Nu open, tot " + tijd(vandaag[1]);
        stip.classList.remove("dicht");
      } else {
        var volgende = null, wanneer = "";
        if (vandaag && min < vandaag[0]) {
          volgende = vandaag[0]; wanneer = "vandaag";
        } else {
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

  /* De hero-video staat stil voor wie beweging heeft uitgezet.
     Het posterbeeld blijft dan gewoon staan. */
  function video(){
    var v = document.getElementById("studio");
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    var poging = v.play();
    if (poging && poging.catch) poging.catch(function(){ /* browser weigert, poster blijft staan */ });
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
    video();
    beweging();
    setTimeout(function(){
      var eerste = document.querySelector(".op");
      if (eerste && !eerste.classList.contains("in")) alleszichtbaar();
    }, 1800);
  } catch (e) {
    alleszichtbaar();
  }
})();
