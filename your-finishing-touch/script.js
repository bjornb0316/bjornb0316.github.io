/* Gedeeld over alle vijf de pagina's.
   1. rekent live uit of de salon open is
   2. de setkiezer: hoe vol wil je het
   3. laat blokken binnenkomen bij het scrollen
   4. vangnet: gaat er iets stuk, dan is de pagina gewoon zichtbaar */
(function(){
  "use strict";

  /* [openminuut, sluitminuut] per weekdag; zaterdag en zondag dicht. */
  var UREN = { 0:null, 1:[660,1200], 2:[660,1140], 3:[660,960], 4:[660,1140], 5:[600,900], 6:null };
  var DAGEN = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];

  function tijd(m){
    var u = Math.floor(m/60), r = m%60;
    return (u<10?"0"+u:u) + ":" + (r<10?"0"+r:r);
  }

  function toonStatus(){
    var nu = new Date(), dag = nu.getDay(), min = nu.getHours()*60 + nu.getMinutes();
    var vandaag = UREN[dag], open = !!(vandaag && min >= vandaag[0] && min < vandaag[1]);

    var tekst = "";
    if (open) {
      tekst = "Nu in de salon, tot " + tijd(vandaag[1]);
    } else {
      var volgende = null, wanneer = "";
      if (vandaag && min < vandaag[0]) { volgende = vandaag[0]; wanneer = "vandaag"; }
      else {
        for (var i = 1; i <= 7; i++) {
          var d = (dag + i) % 7;
          if (UREN[d]) { volgende = UREN[d][0]; wanneer = (i===1) ? "morgen" : DAGEN[d]; break; }
        }
      }
      tekst = volgende === null ? "Bekijk de openingstijden"
            : "Nu gesloten, " + wanneer + " open om " + tijd(volgende);
    }

    ["", "2"].forEach(function(n){
      var t = document.getElementById("nu-tekst" + n);
      var s = document.getElementById("stip" + n);
      if (t) t.textContent = tekst;
      if (s) { if (open) s.classList.remove("dicht"); else s.classList.add("dicht"); }
    });

    var rij = document.querySelector('#urentabel tr[data-dag="' + dag + '"]');
    if (rij) rij.classList.add("vandaag");
  }

  /* De setkiezer. Vier keuzes van natuurlijk naar vol; alles komt
     regelrecht uit haar eigen behandelmenu op Treatwell. */
  var SETS = [
    ["Natuurlijk", "\u00e9\u00e9n haartje per wimper",
     "Wimperextensions one by one", "1 uur 30", "\u20ac 79,50",
     "vanaf \u20ac 21,50, in 20 tot 45 minuten",
     "E\u00e9n extension op \u00e9\u00e9n eigen wimper. De rustigste uitkomst die er staat: je ziet dat er iets is gedaan, maar niet wat."],
    ["Iets voller", "losse haartjes en waaiertjes",
     "Wimperextensions hybrid", "1 uur 30", "\u20ac 84,50",
     "vanaf \u20ac 36,50, in 30 minuten tot een uur",
     "Een mengsel van losse extensions en kleine waaiertjes. Voller dan one by one, maar nog niet dicht."],
    ["Vol", "alleen waaiertjes",
     "Wimperextensions volume", "1 uur 30", "\u20ac 90",
     "vanaf \u20ac 22,50, in 25 tot 45 minuten",
     "Alleen waaiers, waardoor de lijn dicht wordt. Dit is de volste set die er staat."],
    ["Liever niets erop", "je eigen wimpers omhoog",
     "LVL Lash Volume Lift, inclusief verven", "50 minuten", "\u20ac 52,50",
     "niet nodig; groeit gewoon uit",
     "Geen extensions. Je eigen wimpers worden omhoog gezet en meteen geverfd, dus er komt niets op te zitten."]
  ];

  function setkiezer(){
    var doos = document.getElementById("setknoppen");
    var uit  = document.getElementById("setuit");
    if (!doos || !uit) return;

    SETS.forEach(function(s, i){
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = "<b>" + s[0] + "</b><small>" + s[1] + "</small>";
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
      var s = SETS[i];
      uit.innerHTML =
        '<div class="setuit-in">' +
        '<dl class="rij">' +
          '<div><dt>De set</dt><dd>' + s[2] + '</dd></div>' +
          '<div><dt>Duur</dt><dd>' + s[3] + '</dd></div>' +
          '<div><dt>Nieuwe set</dt><dd>' + s[4] + '</dd></div>' +
        '</dl>' +
        '<p class="wat">' + s[6] + '</p>' +
        '<p class="wat"><b>Opvullen daarna:</b> ' + s[5] + '.</p>' +
        '<a class="knop knop-vol" href="afspraak.html">Kijk wanneer dit kan</a>' +
        '</div>';
    }
  }

  function beweging(){
    var blokken = document.querySelectorAll(".op");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < blokken.length; i++) blokken[i].classList.add("in");
      return;
    }
    var kijker = new IntersectionObserver(function(rijen){
      rijen.forEach(function(r){
        if (r.isIntersecting) { r.target.classList.add("in"); kijker.unobserve(r.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    for (var j = 0; j < blokken.length; j++) kijker.observe(blokken[j]);
  }

  try {
    document.documentElement.classList.add("js");
    toonStatus();
    setkiezer();
    beweging();
  } catch (e) {
    document.documentElement.classList.remove("js");
  }
})();
