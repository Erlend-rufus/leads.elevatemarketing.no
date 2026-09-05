# Brief til Typeforms AI-bygger

Kopier alt under linjen inn i Typeforms AI-skjemabygger. Spørsmål 4 til 7 og
kvalifiseringsgrensene er et forslag fra Claude Code, ikke bestemt av
oppdragsgiver — rediger dem fritt før publisering. Spørsmål 1 til 3 og de to
tekniske delene (skjulte felter, avslutninger) er ikke forslag: de må stå
nøyaktig slik, ellers stopper parameterkjeden til nettsiden.

---

Lag et skjema på norsk (bokmål) for Elevate Marketing. Målgruppen er eiere og
partnere i norske regnskapsbyråer, typisk over 45 år, som klikker seg inn fra
en Facebook-annonse på mobil. Formålet er å kvalifisere leads til en gratis
tjue-minutters gjennomgang av hvordan byrået deres blir omtalt av AI-verktøy
som Google AI Mode og ChatGPT.

Tone: direkte og konkret, ingen selgende språk. Ingen utropstegn. Ingen
tankestreker. Ikke bruk ordet «GEO» noe sted i skjemaet.

**Sju spørsmål, i denne rekkefølgen:**

1. **Navn.** Kort tekst, påkrevd. Question reference: `navn`
2. **E-post.** E-postfelt, påkrevd, med e-postvalidering. Question reference: `epost`
3. **Navnet på byrået deres.** Kort tekst, påkrevd. Question reference: `selskap`
4. **Har dere egen kundebase, eller jobber dere som underleverandør for et
   annet byrå?** Flervalg, ett svar: «Egen kundebase» / «Underleverandør for
   et annet byrå». Påkrevd.
5. **Hvor lenge har byrået vært i drift?** Flervalg, ett svar: «Under 1 år» /
   «1 til 3 år» / «Mer enn 3 år». Påkrevd.
6. **Hvor mange ansatte har byrået?** Flervalg, ett svar: «1 til 5» / «6 til
   20» / «Flere enn 20». Påkrevd.
7. **Hvilken by eller region opererer byrået hovedsakelig i?** Kort tekst,
   påkrevd.

**Sju skjulte felter (Hidden Fields), nøyaktig disse navnene, alle valgfrie
og uten spørsmål tilknyttet — de fylles av nettsiden, ikke av brukeren:**

```
utm_source
utm_medium
utm_campaign
utm_content
utm_term
fbclid
gclid
```

**Kvalifiseringslogikk (Logic), to avslutninger:**

- Hvis spørsmål 5 = «Under 1 år», ELLER spørsmål 4 = «Underleverandør for et
  annet byrå» → gå til avslutning **«Ikke kvalifisert»**
- Ellers → gå til avslutning **«Kvalifisert»**

**To avslutninger, begge type «Redirect to a website», ikke «Thank you screen»:**

Kvalifisert — sett URL til nøyaktig:
```
https://leads.elevatemarketing.no/ai-synlighet/book?navn={{field:navn}}&epost={{field:epost}}&selskap={{field:selskap}}&utm_source={{hidden:utm_source}}&utm_medium={{hidden:utm_medium}}&utm_campaign={{hidden:utm_campaign}}&utm_content={{hidden:utm_content}}
```

Ikke kvalifisert — sett URL til nøyaktig:
```
https://leads.elevatemarketing.no/ai-synlighet/ikke-aktuelt
```

---

## Etter at AI-bygeren er ferdig, sjekk manuelt

1. At `question reference` på spørsmål 1, 2 og 3 faktisk ble satt til
   `navn`, `epost` og `selskap` — AI-byggeren setter ofte en automatisk
   referanse som `question_1abc2d`, og da lander ingenting riktig sted i
   URL-en. Rett i Typeform: spørsmålets innstillinger → Reference.
2. At de sju Hidden Fields er lagt til under Connect → Hidden fields, ikke
   bare nevnt i en beskrivelse.
3. At begge avslutningene er «Redirect to a website» med URL-ene over,
   limt inn nøyaktig — ingen mellomrom, ingen endret rekkefølge på
   parameterne.
4. Slå AV «Fullscreen on mobile» / tilsvarende innstilling i
   Embed-instillingene, hvis AI-byggeren har skrudd det på. Nettsidens kode
   tvinger skjemaet til å stå inline uansett, men det er greit å ha
   innstillingen riktig i Typeform også.
5. Kjør et testsvar med `Under 1 år` og bekreft at det lander på
   `/ai-synlighet/ikke-aktuelt`. Kjør ett til med `Mer enn 3 år` og
   `Egen kundebase`, og bekreft at det lander på `/ai-synlighet/book` med
   navn, e-post og selskap synlig i adressefeltet.

Når skjemaet er publisert: kopier ID-en (Share → Embed → `data-tf-live="…"`,
26 tegn) inn i `assets/js/config.js` → `typeformId`.
