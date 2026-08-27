/* Gedeeld over alle vijf de pagina's.
   1. rekent live uit of de salon open is
   2. bouwt op de afspraakpagina een compleet bericht uit de keuzes
   3. laat blokken binnenkomen bij het scrollen
   4. vangnet: gaat er iets stuk, dan is de pagina gewoon zichtbaar */
(function(){
  "use strict";

  var TEL = "31646255748";           /* 06 46255748 */
  var MAIL = "marjadekrosse@hotmail.com";

  /* Alleen maandag, dinsdag en woensdag, van 9:15 tot 17:00. */
  var UREN = { 0:null, 1:[555,1020], 2:[555,1020], 3:[555,1020], 4:null, 5:null, 6:null };
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

  /* De afspraakhulp. Er gaat niets naar een server: de keuzes worden
     ter plekke tot een bericht gemaakt dat Marja in één keer kan lezen.
     Zij belt terug, precies zoals ze nu ook werkt. */
  function aanvraag(){
    var doos = document.getElementById("aanvraag");
    if (!doos) return;

    var velden = ["behandeling","dagdeel","naam","telefoon","toelichting"].map(function(n){
      return document.getElementById("v-" + n);
    });
    var uitvak = document.getElementById("opbouw");
    var appKnop = document.getElementById("knop-app");
    var mailKnop = document.getElementById("knop-mail");

    function bericht(){
      var b = velden[0].value, d = velden[1].value,
          naam = velden[2].value.trim(), tel = velden[3].value.trim(),
          toe = velden[4].value.trim();

      var r = [];
      r.push("Goedendag Marja,");
      r.push("");
      r.push("Ik zou graag een afspraak maken voor: " + b + ".");
      if (d) r.push("Het liefst op " + d + ".");
      if (toe) r.push("");
      if (toe) r.push(toe);
      r.push("");
      r.push("Mijn naam is " + (naam || "…") + " en ik ben bereikbaar op " + (tel || "…") + ".");
      r.push("");
      r.push("Met vriendelijke groet,");
      r.push(naam || "…");
      return r.join("\n");
    }

    function ververs(){
      var t = bericht();
      uitvak.textContent = t;
      appKnop.href = "https://wa.me/" + TEL + "?text=" + encodeURIComponent(t);
      mailKnop.href = "mailto:" + MAIL +
        "?subject=" + encodeURIComponent("Afspraak: " + velden[0].value) +
        "&body=" + encodeURIComponent(t);
    }

    velden.forEach(function(v){
      v.addEventListener("input", ververs);
      v.addEventListener("change", ververs);
    });
    ververs();
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
    aanvraag();
    beweging();
    setTimeout(function(){
      var eerste = document.querySelector(".op");
      if (eerste && !eerste.classList.contains("in")) alleszichtbaar();
    }, 1800);
  } catch (e) {
    alleszichtbaar();
  }
})();


/* Het menu op de telefoon. Staat los van de rest, zodat een fout hier
   de pagina verder niet raakt. */
(function(){
  "use strict";
  var knop = document.querySelector(".menuknop");
  var menu = document.getElementById("menu");
  if (!knop || !menu) return;

  function zet(open){
    knop.setAttribute("aria-expanded", open ? "true" : "false");
    knop.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    menu.setAttribute("data-open", open ? "ja" : "nee");
    document.documentElement.setAttribute("data-menu", open ? "open" : "dicht");
    if (open) { var e = menu.querySelector("a"); if (e) e.focus(); }
    else { knop.focus(); }
  }

  knop.addEventListener("click", function(){
    zet(knop.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && knop.getAttribute("aria-expanded") === "true") zet(false);
  });
  // Wie het scherm draait naar een breedte waar de gewone navigatie weer
  // zichtbaar is, moet niet met een open menu blijven zitten.
  window.addEventListener("resize", function(){
    if (window.innerWidth > 1000 && knop.getAttribute("aria-expanded") === "true") zet(false);
  });
  zet(false);
})();
