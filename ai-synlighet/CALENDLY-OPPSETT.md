# Calendly-oppsett · steg for steg

Dette er ikke kode. Alt under gjøres i Calendly sitt eget grensesnitt, på
event-typen som skal brukes til gjennomgangen.

## 1. Opprett eller velg event-typen

- Varighet: **20 minutter** (teksten på siden sier «Tjue minutter» to steder,
  må stemme med det som faktisk bookes).
- Sted: videosamtale (Google Meet, Zoom eller tilsvarende — velg det dere
  faktisk bruker).
- Navn på event-typen er valgfritt, det vises ikke på nettsiden.

## 2. Egendefinert spørsmål — rekkefølgen er kritisk

Under **Invitee Questions** (eller «Legg til spørsmål»): legg til ett
egendefinert spørsmål, **først i listen, før eventuelle andre spørsmål**:

> Hva heter byrået deres?

Kort tekst, valgfritt om det skal være påkrevd. Nettsidens kode sender
selskapsnavnet fra Typeform inn som `a1`, som Calendly alltid mapper til det
**første** egendefinerte spørsmålet. Ligger et annet spørsmål foran dette,
havner selskapsnavnet i feil felt eller forsvinner.

Legg ikke til flere egendefinerte spørsmål før dette, eller flytt dette
øverst hvis eventet allerede har andre spørsmål.

## 3. Bekreftelse — Calendly sender selv

**Avgjort 4. september 2026: ingen Zapier, ingen SMS-utsending.** Under event-
typens **Notifications** → **Confirmation**: behold Calendlys standard
e-postbekreftelse til den som booker. Ikke koble på noen automasjon her.
Teksten på `/takk` — «Du får en bekreftelse på e-post med lenke til møtet.» —
stemmer med dette som det står, ingen endring der.

## 4. Redirect etter booking

Under event-typens **Confirmation Page** → **Redirect to an external site**,
sett URL-en til nøyaktig:

```
https://leads.elevatemarketing.no/ai-synlighet/takk
```

Nettsidens kode har i tillegg en reserve som sender brukeren videre selv om
denne redirecten skulle svikte i en app-nettleser, men sett den likevel — det
er den som normalt gjør jobben.

## 5. Ting koden allerede styrer — ikke sett dem her

Disse blir lagt til i URL-en av `assets/js/params.js` hver gang kalenderen
vises. Ikke sett dem manuelt i Calendly-innstillingene, det kan gi dobbel
eller motstridende verdi:

- `hide_gdpr_banner=1` — Calendlys eget samtykkebanner er slått av i URL-en,
  fordi nettsiden har sitt eget samtykkebånd
- `primary_color=00804c` — matcher knappefargen på nettsiden
- `name`, `email`, `a1` og alle `utm_*` — forhåndsutfylt fra det leadet skrev
  i Typeform

## 6. Finn kontodelen og event-delen til `config.js`

Åpne bookingsiden for eventet. Adressen ser slik ut:

```
https://calendly.com/<konto>/<event>
```

eller, hvis Calendly har gitt en kort lenke:

```
https://calendly.com/d/<kort-kode>/<event>
```

- Er adressen den første typen: `<konto>` inn i `calendlyKonto`, `<event>`
  inn i `calendlySlug`.
- Er den den andre typen: `d/<kort-kode>` (med skråstreken) inn i
  `calendlyKonto`, `<event>` inn i `calendlySlug`.

## 7. Test før dere sender adressen videre

1. Åpne `https://leads.elevatemarketing.no/ai-synlighet/book/?navn=Test%20Testesen&epost=test%40example.com&selskap=Testbyr%C3%A5et%20AS`
   direkte, uten å gå via Typeform.
2. Kalenderen skal vise seg inline, ingen popup, med «Test Testesen»,
   «test@example.com» og «Testbyrået AS» forhåndsutfylt der Calendly viser
   navn, e-post og det egendefinerte spørsmålet.
3. Book et testtidspunkt. Bekreft at dere lander på `/ai-synlighet/takk`, og
   at en bekreftelse kommer på e-post fra Calendly, ikke fra noe annet system.
