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
     klassisk form-ID, begge virker. */
  typeformId: 'TYPEFORM_ID',

  /* Calendly: https://calendly.com/<calendlyKonto>/<calendlySlug> */
  calendlyKonto: 'CALENDLY_KONTO',
  calendlySlug: 'CALENDLY_SLUG',

  /* Meta Pixel-ID (bare sifre). Lastes først etter «Godta». */
  metaPixelId: 'META_PIXEL_ID',

  /* Adresse til personvernerklæringen. Lenkes fra samtykkebåndet; så lenge
     dette er en plassholder, viser båndet ingen lenke. Et utkast ligger på
     /ai-synlighet/personvern/ (se KONFIG.md punkt 4). Når du har lest det:
     personvernUrl: '/ai-synlighet/personvern/' */
  personvernUrl: 'PERSONVERN_URL'
};
