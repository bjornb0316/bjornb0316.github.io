# Kitty Raben, schoonheidsspecialiste in Didam

Twee varianten, zelfde merk en fotografie, verschil in omvang.

| | Compact (`/kitty-raben/`) | Uitgebreid (`/kitty-raben/uitgebreid/`) |
|---|---|---|
| Pagina's | 2: home, behandelingen en prijzen | 5: home, behandelingen, workshops, over Kitty, afspraak |
| Afspraak | Eén formulier onderaan de home, stelt een WhatsApp- of mailbericht op | Stappenformulier (behandeling, eerste keer, moment, gegevens) met voorbeeld van het bericht |
| Extra | Prijslijst met snelmenu, workshops op de prijspagina | "Wat past bij mij?" keuzehulp, aparte workshop-aanvraag, FAQ, sticky tabs in de prijslijst |
| Beweging | Alleen rustig in beeld komen | Hero met woorden die opkomen en een zakkende foto, beeld bij hover op de keuzerijen |

Beide varianten verwijzen in de voorstelregel naar elkaar, zodat je ze naast elkaar kunt laten zien.

## Structuur

```
kitty-raben/
  index.html, behandelingen.html, stijl.css, script.js   compacte versie
  uitgebreid/                                             uitgebreide versie
  img/                                                    gedeelde WebP-beelden
```

## Beelden

- `kitty.webp`: haar eigen portret (Facebook), opgeschaald naar 1200px.
- `xminerals.webp`: productfoto van haar Facebookpagina.
- De rest is gegenereerd met Higgsfield (soul_2 en gpt_image_2_5), gezichtsloos of zonder dat het Kitty of haar praktijk claimt te zijn.
  Vervang ze door eigen foto's van de behandelkamer zodra die er zijn; `praktijk.webp` en `hero-*.webp` eerst.

## Bronnen van de inhoud

Teksten, behandelingen en prijzen komen van kittyraben.nl (prijslijst en welkomsttekst) en de workshopinformatie van haar oude pagina.
Merknamen: Mineral Care, Jericho, LOOkX, Gelamour (kittyraben.nl) en Xminerals (Facebook). Er staan geen verzonnen reviews op de site.

## Voor livegang nalopen met Kitty

- Kloppen de prijzen nog (de lijst op kittyraben.nl is oud)?
- Werkt ze nog met Jericho en Mineral Care, of vooral met Xminerals?
- WhatsApp op 06 36107145: staat WhatsApp aan op dat nummer?
- Mailadres: de site gebruikt info@kittyraben.nl, Facebook noemt facebook@kittyraben.nl.
- Vaste lijn 0316 221662 nog in gebruik?
- Openingstijden zijn niet bekend; de formulieren vragen daarom een voorkeur (overdag, avond, zaterdag).
- De voorstelregel bovenaan en `noindex` weghalen bij livegang.
- JSON-LD staat alleen op beide homepagina's; `url` bijwerken naar het definitieve domein.
