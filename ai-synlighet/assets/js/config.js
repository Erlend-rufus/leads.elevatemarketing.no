/* =====================================================================
   KONFIGURASJON · leads.elevatemarketing.no
   Dette er det ENESTE stedet verdiene under skal fylles inn. Se KONFIG.md
   for hva hver av dem er og hvor du finner dem.

   Verdier i STORE_BOKSTAVER_MED_UNDERSTREK er plassholdere. Skriptene
   oppdager dem og lar være å laste embed eller pixel til de er byttet ut,
   så en halvferdig konfigurasjon aldri sender noe til Meta.
   ===================================================================== */
window.EM_CONFIG = {
  /* Typeform: ID-en fra Share → Embed. Live embed-ID (26 tegn) eller
     klassisk form-ID, begge virker. Fylt inn 5. september 2026. */
  typeformId: '01M1RDJV3MB42C0DW33CDCNJ4T',

  /* Calendly: https://calendly.com/<calendlyKonto>/<calendlySlug>
     Fylt inn 5. september 2026, fra den korte lenken
     calendly.com/d/d2jt-xw6-hwn/regnskapsforer-ai-synlighet. */
  calendlyKonto: 'd/d2jt-xw6-hwn',
  calendlySlug: 'regnskapsforer-ai-synlighet',

  /* Meta Pixel-ID (bare sifre). Lastes først etter «Godta». Samme pixel
     som roten av dette repoet bruker (avklart med Erlend 4. september
     2026), så kampanjen lærer inn i samme datasett. */
  metaPixelId: '2054301445970035',

  /* Adresse til personvernerklæringen. Utkastet i /ai-synlighet/personvern/
     er godkjent av Erlend 4. september 2026. */
  personvernUrl: '/ai-synlighet/personvern/'
};
