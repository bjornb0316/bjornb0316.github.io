/* Gedeeld over alle vijf de pagina's.
   1. laat blokken binnenkomen bij het scrollen
   2. vangnet: gaat er iets stuk, dan is de pagina gewoon zichtbaar

   Geen open/dicht-melding hier: haar tijden wisselen per week en ze werkt
   op aanvraag. Een balkje dat 'nu gesloten' roept zou dan meer verwarren
   dan helpen. Wat er wél staat is hoe het aanvragen gaat. */
(function(){
  "use strict";

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
    beweging();
    setTimeout(function(){
      var eerste = document.querySelector(".op");
      if (eerste && !eerste.classList.contains("in")) alleszichtbaar();
    }, 1800);
  } catch (e) { alleszichtbaar(); }
})();
