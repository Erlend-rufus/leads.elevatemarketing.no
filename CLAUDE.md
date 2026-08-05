# CLAUDE.md

Repoet huser to ting som ikke skal blandes:

1. **Elevate Marketings egen leadgen-side** (`index.html`, `takk.html`,
   `ikke-aktuell.html`, `css/`, `js/`, `fonts/`). Dette er produksjon.
2. **`/prospekt/`** — HTML-skisser av forsider vi viser fram i salgsmøter.

Netlify publiserer fra repo-roten (`publish = "."` i `netlify.toml`) uten
byggesteg. Nye filer er live så snart de er merget til produksjonsgrenen.

## Produksjonsfilene røres ikke

`index.html`, `takk.html`, `ikke-aktuell.html`, `css/site.css`, `js/geo-sb.js`,
`fonts/` og `netlify.toml` er i drift og skal ikke endres når du jobber med
skisser. Alt skissearbeid er nye filer i nye mapper under `prospekt/`.

## `/prospekt/` — salgsskisser

Én mappe per prospekt: `prospekt/<firma>-<4 tilfeldige tegn>/index.html`, som gir
`leads.elevatemarketing.no/prospekt/goproducts-a7f2/`. Suffikset hindrer at
prospekter kan gjette seg fram til hverandres skisser.

Bruk slash-kommandoen `/skisse` (se `.claude/commands/skisse.md`) for hele
arbeidsflyten: research, designplan, bygg, visuell verifisering, deploy.

### Krav som gjelder alle skisser

- **Ingen sporing.** Ingen Meta Pixel, ingen GTM, ingen konverteringsevents.
  Produksjonssidene fyrer `GEOAuditKvalifisert` og `GEOAuditMoteBooket` mot pixel
  `2054301445970035`; en skisse som fyrer events forurenser pixel-treningen.
- **Ingen delte filer.** Aldri lenk til `/css/site.css`, `/js/geo-sb.js` eller
  `/fonts/`. Hver skisse er én selvstendig `index.html` med all CSS i `<style>`
  og all JS i `<script>`. Ingen rammeverk, ingen CDN-er, ingen byggesteg.
- **Alltid noindex.** `<meta name="robots" content="noindex, nofollow">` i
  `<head>`. `_headers` setter i tillegg `X-Robots-Tag` på `/prospekt/*`, og
  `robots.txt` disallower stien for alle crawlere. Alle tre skal være på plass.
- **Aldri fabrikkerte tall, priser, sitater, sertifiseringer eller garantier.**
  Uverifisert innhold merkes med `<!-- PLACEHOLDER: erstattes med ekte innhold -->`
  og skal likevel se ferdig ut visuelt.

## Praktisk i denne kjøremiljøet

- Utgående `curl` er blokkert av nettverkspolicyen. Bruk WebFetch og WebSearch
  til å hente kundenettsider, Google-profiler og til å verifisere URL-er.
- Chromium og Playwright er forhåndsinstallert (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`).
  Kjør aldri `playwright install`.
