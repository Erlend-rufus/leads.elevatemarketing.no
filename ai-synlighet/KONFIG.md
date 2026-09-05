# KONFIG.md · det som må fylles inn før lansering

Alt som står åpent i ARBEIDSORDRE punkt 13, samlet på ett sted. Ingenting av
dette er gjettet i koden. Der koden trenger en verdi, står det en plassholder
i STORE_BOKSTAVER, og skriptene lar være å laste embed og pixel til den er
byttet ut. En halvferdig konfigurasjon sender derfor aldri noe til Meta og
viser en tydelig melding i skjema- og kalenderboksen i stedet for en tom flate.

**Kodeverdiene fylles inn i én fil: `assets/js/config.js`.** Resten er
innstillinger i Typeform, Calendly og Netlify.

| Plassholder      | Hvor i koden                            | Hva som skal inn |
|------------------|-----------------------------------------|------------------|
| ~~`TYPEFORM_ID`~~    | `assets/js/config.js` → `typeformId`    | **Fylt inn** 5. september: ID-en til skjemaet (punkt 1) |
| `CALENDLY_KONTO` | `assets/js/config.js` → `calendlyKonto` | Kontodelen av Calendly-adressen (punkt 2) |
| `CALENDLY_SLUG`  | `assets/js/config.js` → `calendlySlug`  | Event-delen av Calendly-adressen (punkt 2) |
| ~~`META_PIXEL_ID`~~  | `assets/js/config.js` → `metaPixelId`   | **Fylt inn** 4. september: samme pixel som roten (punkt 3) |
| ~~`PERSONVERN_URL`~~ | `assets/js/config.js` → `personvernUrl` | **Fylt inn** 4. september: utkastet er godkjent (punkt 4) |

Plassholderne gjenkjennes på formen `STORE_BOKSTAVER_MED_UNDERSTREK`. En ekte
Typeform-ID som `01KYF20M5CAMYSVACWPM3AMY4S` har ingen understrek og går fint.

---

## 1. Typeform: ID — fylt inn, ikke verifisert herfra

`typeformId` er satt til `01M1RDJV3MB42C0DW33CDCNJ4T` (5. september 2026).
`embed.typeform.com` og `form.typeform.com` er blokkert fra byggemiljøet, så
verken at ID-en løser opp, at de sju skjulte feltene faktisk er lagt til, at
`question reference` er satt riktig på `navn`/`epost`/`selskap`, eller at de
to avslutningene peker dit de skal, kunne kontrolleres herfra.

**Kjør sjekklisten nederst i `TYPEFORM-BRIEF.md` manuelt** (samme brief som
ble brukt til å bygge skjemaet) før dere stoler på skjemaet i produksjon.
Punkt 6 i denne filen tester hele kjeden på ekte telefon og fanger opp feil
her uansett, men det er raskere å fange dem nå.

**ID.** Typeform → Share → Embed → «Inline». Kodesnutten inneholder
`data-tf-live="01…"` (26 tegn). Den korte form-ID-en fra adressen
`form.typeform.com/to/xxxxxx` virker også. Lim inn i `typeformId`.

**Skjulte felter.** Skjemaet må ha Hidden Fields med nøyaktig disse navnene,
ellers slipper Typeform verdiene på gulvet. Begge ID-typene tar dem imot:

```
utm_source  utm_medium  utm_campaign  utm_content  utm_term  fbclid  gclid
```

`params.js` sender dem inn fra annonselenken. Tomme felter er greit.

**Spørsmålene.** Syv spørsmål, avgjøres av Erlend. Tre av dem må ha
question reference (spørsmålsreferanse i Typeform) satt til nøyaktig
`navn`, `epost` og `selskap`, fordi avslutningen piper dem videre til `/book`.

**To avslutninger, med «Redirect to a website»:**

Kvalifisert:
```
https://leads.elevatemarketing.no/ai-synlighet/book?navn={{field:navn}}&epost={{field:epost}}&selskap={{field:selskap}}&utm_source={{hidden:utm_source}}&utm_medium={{hidden:utm_medium}}&utm_campaign={{hidden:utm_campaign}}&utm_content={{hidden:utm_content}}
```

Ikke kvalifisert:
```
https://leads.elevatemarketing.no/ai-synlighet/ikke-aktuelt
```

Logikken for hvem som er kvalifisert settes i Typeform (Logic → avslutning),
ikke i koden. Er skjemaet innstilt slik at det åpner i fullskjerm på mobil,
overstyrer koden det med `data-tf-inline-on-mobile`: alltid inline, aldri popup.

## 2. Calendly: konto, event og rekkefølgen på spørsmålene

**Oppsett steg for steg: se `CALENDLY-OPPSETT.md` i denne mappen.**

Bookingadressen til eventet ser slik ut: `https://calendly.com/<konto>/<event>`.
Kontodelen inn i `calendlyKonto`, eventdelen inn i `calendlySlug`. Har eventet
en kort adresse på formen `calendly.com/d/xxx-yyy/event`, går `d/xxx-yyy` inn
i `calendlyKonto`.

I Calendly-eventet:

- **Første egendefinerte spørsmål må være selskapsnavn.** Koden fyller det inn
  som `a1`. Ligger det et annet spørsmål først, havner selskapsnavnet feil sted.
- **Etter booking:** «Redirect to an external site» → `https://leads.elevatemarketing.no/ai-synlighet/takk`.
  Koden har i tillegg en reserve: får siden melding fra Calendly om at et møte
  er booket, og Calendlys egen videresending ikke har skjedd innen 1,5 s,
  sendes brukeren til `/takk` av koden.
- Calendlys eget GDPR-banner er skrudd av i adressen (`hide_gdpr_banner=1`),
  fordi sidene har eget samtykkebånd.
- Koden setter `primary_color=00a862` (grønnfargen) på kalenderen. Skal
  eventets egne farger vinne, fjern den linjen i `assets/js/params.js`.

## 3. Meta Pixel-ID — fylt inn

Satt til `2054301445970035`, samme pixel som roten av dette repoet (avklart
4. september 2026). Kampanjen bruker standardhendelsene `Lead` og `Schedule`,
ikke de egendefinerte hendelsene fra den gamle siden, så de to funnelene skiller
seg i Events Manager på hendelsesnavn selv om de deler datasett.

Pixelen lastes først når brukeren trykker «Godta». Hendelser: `PageView` på
alle sider, `Lead` på `/book`, `Schedule` på `/takk`, ingen på `/ikke-aktuelt`.
`Lead` og `Schedule` fyres én gang per fane, ikke på nytt ved oppdatering.

Optimaliser kampanjen mot `Lead`, ikke `Schedule` (ARBEIDSORDRE punkt 8).
Conversions API er ikke satt opp i denne koden. Settes det opp senere, må det
ligge bak det samme samtykket.

## 4. Personvernerklæring — godkjent, fylt inn

`personvernUrl` peker nå på `/ai-synlighet/personvern/`. Erlend godkjente
utkastet 4. september 2026 som det står. Det som fortsatt bør sjekkes ved
neste revisjon, ikke blokkerende for lansering:

- kontaktadressen `post@elevatemarketing.no` (fra punchlisten)
- lagringstid: teksten sier «så lenge vi følger opp henvendelsen», uten tall.
  Har dere en fast rutine, skriv den inn
- overføring ut av EØS: teksten sier «godkjent overføringsgrunnlag», uten å
  navngi ordning. Sjekk hva Typeform, Calendly, Meta og Netlify faktisk bruker
- at listen over databehandlere stemmer når Zapier eller SMS-utsending kommer

Så lenge `personvernUrl` i `assets/js/config.js` er en plassholder, viser
samtykkebåndet **ingen lenke** (en død lenke er verre enn ingen). Når utkastet
er godkjent, sett:

```js
personvernUrl: '/ai-synlighet/personvern/'
```

Siden har `noindex`, samme bunntekst som de andre, og en knapp «Endre valget
ditt» som nullstiller samtykket og viser båndet på nytt.

---

## 5. SVG-versjon av logoen

Pakken hadde bare PNG (2607 × 1048, 51 og 108 KB). Sidene bruker nå
nedskalert WebP med PNG-fallback, 418 × 168 (3× av 56 px visningshøyde,
7 til 17 KB), i `assets/img/`. Kommer SVG-ene, legg `logo-ink.svg` og
`logo-white.svg` i `assets/img/` og bytt hver `<picture>`-blokk (topp og bunn
i alle fire filene, åtte steder) med én `<img>`:

```html
<img class="logo" src="assets/img/logo-ink.svg" width="418" height="168" alt="Elevate Marketing">
```

Bruk samme relative sti som PNG-en allerede står med i den filen:
`assets/img/…` i `index.html`, `../assets/img/…` i de tre undermappene.
Toppen bruker `logo-ink`, bunnen `logo-white`. Behold `width`/`height`
(bildets faktiske sideforhold), så ingenting flytter seg mens den laster.

## 6. Bekreftelse — avgjort: Calendly selv

**Avgjort 4. september 2026: Calendly sender bekreftelsen selv, ingen
Zapier-pipeline med SMS.** Sett i Calendly-eventets egne varslingsinnstillinger
(«Confirmation» → e-post til deltaker), ikke i denne koden. Setningen på
`/takk` — «Du får en bekreftelse på e-post med lenke til møtet.» — stemmer som
den står, ingen kodeendring. Oppfølging av dem som fyller ut skjemaet uten å
booke (ARBEIDSORDRE punkt 14) er fortsatt ikke løst og finnes ikke ennå;
det er en egen Zapier-jobb, ikke kode på disse sidene.

## 7. Rot eller undermappe på subdomenet

**Avgjort: undermappe.** Roten på `leads.elevatemarketing.no` er opptatt av den
eldre GEO-audit-landingssiden med `/takk` og `/ikke-aktuell`, og `/prospekt/`
holder salgsskissene. Kampanjen ligger derfor i `ai-synlighet/` i dette
repoet: `/ai-synlighet/`, `/ai-synlighet/book`, `/ai-synlighet/takk` og
`/ai-synlighet/ikke-aktuelt`. Alle stier i HTML, CSS og JS er relative, så
mappen kan flyttes som én enhet senere. Det eneste absolutte er redirect-
adressene i Typeform (punkt 1) og Calendly (punkt 2), som alt peker hit.

---

## Sjekk som ikke kunne gjøres herfra

**Radnavnene mot Brønnøysundregistrene** (ARBEIDSORDRE 11.1 ber om det).
Rad 2 er byttet til «Regnskap, lønn og rådgivning». De fire andre står som i
TEKST.md. Oppslaget mot `data.brreg.no` var blokkert fra byggemiljøet, så
kontroller disse fem selv, for eksempel på
`https://data.brreg.no/enhetsregisteret/oppslag/enheter?navn=<navn>`:

1. Autorisert regnskapsbyrå
2. Regnskap, lønn og rådgivning
3. Regnskapskontoret i sentrum
4. Økonomi og regnskap
5. Regnskapsførerselskapet

Slår ett av dem ut som et registrert navn, bytt teksten i `index.html`
(rad 1 til 5 i svarpanelet). Teksten er sladdet visuelt, men står i kilden.

## Netlify

Ingen egen konfigurasjon. Nettstedet `leads-elevatemarketing-no` publiserer
dette repoet fra roten uten byggesteg, så sidene er live på
`https://leads.elevatemarketing.no/ai-synlighet/` så snart de er merget til
produksjonsgrenen. `X-Robots-Tag: noindex` og cache-reglene for mappen ligger
i `_headers` på repo-roten (ARBEIDSORDRE punkt 9). Ikke legg mappen inn i
`robots.txt` med Disallow: det hindrer crawling, ikke indeksering.
