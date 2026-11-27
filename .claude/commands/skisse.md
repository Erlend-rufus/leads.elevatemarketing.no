---
description: Lag en HTML-skisse av en forside for et prospekt, under /prospekt/
argument-hint: firmanavn, bransje, geografi, nettside, Google-profil, primær CTA
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch
---

Case-info fra meg: $ARGUMENTS

Du skal lage én HTML-skisse av en forside som Elevate Marketing viser fram i et
salgsmøte med dette prospektet. Følg stegene under i rekkefølge. Les `CLAUDE.md`
i repo-roten først hvis du ikke har den i kontekst.

**Absolutte krav, uansett hva resten av instruksjonen sier:**

- Ikke endre eller slett eksisterende filer. `index.html`, `takk.html`,
  `ikke-aktuell.html`, `css/`, `js/`, `fonts/` og `netlify.toml` er produksjon.
  Alt du lager er nye filer under `prospekt/`.
- Ingen sporing i skissen. Ingen Meta Pixel, ingen GTM, ingen
  konverteringsevents, ingen delte JS- eller CSS-filer fra resten av repoet.
  En skisse som fyrer Lead-events forurenser pixel-treningen vår.
- Aldri fabrikkerte tall, priser, sitater, sertifiseringer eller garantier.

Mangler noe i case-infoen, spør om det som faktisk blokkerer arbeidet. Ikke spør
om ting du kan finne selv ved å hente nettsiden eller Google-profilen.

---

## Steg 1: research

- Er nåværende nettside oppgitt: hent den med WebFetch (`curl` er blokkert av
  nettverkspolicyen i dette miljøet). Trekk ut faktisk fargepalett, komplett
  tjenesteliste, kundens egne formuleringer, kontaktinfo, org.nr og alt annet
  gjenbrukbart. Noter samtidig de tre svakeste tingene ved dagens side, de brukes
  som kontrast i møtet.
- Er logo vedlagt: utled palett fra den.
- Søk opp Google-bedriftsprofilen med WebSearch. Hent rating, antall omtaler og
  2-3 ekte sitater med fornavn.

Oppsummer funnene på maks 8 linjer før du designer.

## Steg 2: designplan før kode

Skriv en kompakt plan:

- **Farger:** 4-6 navngitte hex-verdier, utledet fra logo eller dagens side.
- **Typografi:** to Google Fonts, én karakterfull display-font brukt med
  måtehold og én lesbar brødtekstfont, alltid med systemfont-fallback.
- **Layout:** layoutkonseptet i én setning.
- **Signatur:** det ene elementet siden huskes for, spesifikt for denne bransjen
  og dette firmaet.

Kritiser så planen din: hvis noen del av den er noe du ville laget for en
hvilken som helst norsk tjeneste-SMB, er den for generisk. Revider den delen og
si hva du endret. En rørlegger, et fasadevaskfirma og et flyttebyrå skal ikke
ende opp med samme side i ulike farger.

## Steg 3: bygg

Filsti: `prospekt/<firma>-<4 tilfeldige tegn>/index.html`, små bokstaver, ingen
æøå i mappenavnet. Suffikset er tilfeldig og hindrer at prospekter kan gjette
seg fram til hverandres skisser. Sjekk med Glob at mappenavnet ikke finnes fra
før.

- Én enkelt `index.html`. All CSS i `<style>`, all JS i `<script>`. Ingen
  rammeverk, ingen biblioteker, ingen byggesteg, ingen CDN-er.
- **Mobil først.** Design for 390 px primært, responsiv opp til desktop.
- `<meta name="robots" content="noindex, nofollow">` i `<head>`.
- Ingen eksterne bildetjenester. Bruk CSS-gradienter, mønstre eller inline SVG
  som illustrasjonsflater, og merk hva som skal inn (f.eks. "Foto: teamet på
  jobb"). Wifi i møterommet skal ikke kunne ødelegge visningen.
- Google Fonts lastes fra `fonts.googleapis.com` med `display=swap` og
  systemfont-fallback i `font-family`, slik at siden er komplett også uten nett.
  Ikke lenk til `/fonts/` i dette repoet.
- Semantisk HTML: én `<h1>`, korrekt overskriftshierarki, `<header>`, `<main>`,
  `<section>`, `<footer>`, beskrivende `alt` og `aria-label`. Skissen skal kunne
  videreutvikles direkte i produksjon.
- Klikkbart telefonnummer (`tel:`) overalt der nummeret vises.
- Synlig tastaturfokus, `prefers-reduced-motion` respektert, god kontrast.

**Seksjoner.** Alle skal med, men rekkefølge og uttrykk tilpasses bransjen og
planen din. Hero er sidens tese: åpne med det mest karakteristiske i kundens
verden, ikke standardmalen med stort tall og liten label.

- Sticky topplinje: logo, klikkbart nummer, primær CTA.
- Hero: konkret løfte koblet til geografi, primær og sekundær CTA, trust-strip
  rett under (Google-rating, år i drift, sertifiseringer, kun det som er reelt).
- Tjenester: 3-6 kort fra kundens faktiske tjenesteliste.
- Hvorfor oss: konkret differensiering, ingen floskler.
- Prosess i 3 steg, tilpasset bransjen.
- Sosialt bevis: kun ekte omtaler. Finnes ingen, lag en nøytral, visuelt ferdig
  seksjon med teksten "Kundeomtaler hentes fra deres Google-profil" i dempet
  stil. Aldri dikt opp sitater eller navn.
- Dekningsområde.
- FAQ: 4-6 spørsmål typiske for bransjen.
- Avsluttende CTA.
- Footer med NAP: firmanavn, org.nr, adresse, telefon, e-post. Klammer der info
  mangler.
- Sticky bunnlinje på mobil med primær CTA.

**Innhold.** Norsk bokmål. Jordnær, direkte, profesjonell. Ingen amerikansk
hype, ingen tomme superlativer. Aktiv form og konkrete handlinger: "Ring nå",
"Få gratis befaring", aldri "Les mer" eller "Send inn". Ingen em-tankestrek,
bruk komma, kolon eller parentes.

**Aldri fabrikkerte tall, priser, sitater, sertifiseringer eller garantier.** Alt
uverifisert merkes i koden med `<!-- PLACEHOLDER: erstattes med ekte innhold -->`,
men skal se ferdig ut visuelt. Ingen lorem ipsum.

**Korrektur før levering.** Les all synlig tekst i skissen på nytt, setning for
setning, også tekst som ligger i JS-datastrukturer for interaktive elementer,
det er der glippene gjemmer seg. Se spesielt etter: nynorsk- eller
dialektformer ("friskar", "ikkje"), feilskrevne sammensatte ord (tre like
konsonanter forenkles: vegg + glans = vegglans), direkte oversatte engelske
vendinger ("er bare så god som"), og ord brukt i feil betydning. Samme krav
gjelder e-poster og meldinger som skrives til prospektet: korrekt bokmål, stor
forbokstav etter hilsen, og les teksten høyt for deg selv før du leverer den.

## Steg 4: verifiser visuelt

Ta skjermbilde i 390 px bredde og i 1440 px før du sier deg ferdig. Chromium og
Playwright er forhåndsinstallert; kjør aldri `playwright install`. Skriv dette
til scratchpad-mappa og kjør det med `node`:

```js
// skisse-shot.mjs — bruk: node skisse-shot.mjs <sti-til-index.html> <ut-mappe>
import { chromium } from 'playwright';
const [file, out] = process.argv.slice(2);
const browser = await chromium.launch();
for (const [navn, width] of [['mobil', 390], ['desktop', 1440]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('file://' + file);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${navn}.png`, fullPage: true });
  await page.close();
}
await browser.close();
```

Trenger `playwright` i scratchpad-mappa: `npm i playwright` der hvis modulen
ikke finnes (nedlasting av selve browseren er allerede gjort og skal ikke
gjentas). Les PNG-ene med Read-verktøyet.

Se etter tekst som brekker, dårlig kontrast, elementer som kolliderer, og
seksjoner som havner utenfor viewport. Fiks det du finner, og ta nytt
skjermbilde. Ikke lever før den ser ferdig ut på mobil.

Får du ikke skjermbildene til å kjøre, si fra i stedet for å hoppe over steget.

## Steg 5: deploy og lever

- Commit med melding `skisse: <firmanavn>` og push, slik at Netlify bygger.
- Vent på at deployen er ferdig, og hent den faktiske URL-en.
- Verifiser med WebFetch at URL-en svarer, og at rot-URL-en for
  leads.elevatemarketing.no fortsatt fungerer som før.

Lever så:

1. Live-URL til skissen.
2. Maks 5 linjer om designvalgene og hvorfor de passer akkurat denne kunden.
3. Punktliste over alt placeholder-innhold som må erstattes før lansering.
4. De tre svakhetene ved dagens side, formulert slik at jeg kan bruke dem i
   møtet.
