/* =====================================================================
   consent.js · alle fire sidene
   Meta Pixel lastes IKKE før brukeren har trykket «Godta». Ingen
   pixel-snutt i HTML-en, ingen <noscript>-beacon: da hadde det gått en
   forespørsel til Meta uten samtykke. «Bare nødvendige» laster ingenting.

   Valget lagres i localStorage under em_consent.
   Hendelser etter samtykke: PageView på alle sider. Lead på /book og
   Schedule på /takk (fra data-em-hendelse på <body>), begge deduplikert
   med en sessionStorage-vakt så en sideoppdatering ikke teller på nytt.
   ===================================================================== */
(function () {
  'use strict';

  var cfg = window.EM_CONFIG || {};
  var NOKKEL = 'em_consent';
  var GODTA = 'godta';
  var NODVENDIGE = 'nodvendige';

  function erPlassholder(v) { return !v || /^[A-Z]+(_[A-Z]+)+$/.test(String(v).trim()); }
  var PIXEL = erPlassholder(cfg.metaPixelId) ? '' : String(cfg.metaPixelId).trim();
  var HENDELSE = (document.body.getAttribute('data-em-hendelse') || '').trim();

  function les() { try { return localStorage.getItem(NOKKEL); } catch (e) { return null; } }
  function skriv(v) { try { localStorage.setItem(NOKKEL, v); } catch (e) { /* privat modus */ } }

  var lastet = false;
  function lastPixel() {
    if (lastet) return;
    lastet = true;
    if (!PIXEL) return;   /* META_PIXEL_ID mangler, se KONFIG.md */

    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');

    if (HENDELSE) {
      var vakt = 'em_evt_' + HENDELSE;
      var alt = false;
      try { alt = sessionStorage.getItem(vakt) === '1'; } catch (e) {}
      if (!alt) {
        window.fbq('track', HENDELSE);
        try { sessionStorage.setItem(vakt, '1'); } catch (e) {}
      }
    }
  }

  /* ---------- Samtykkebåndet ---------- */
  var baand = null;
  function settHoyde() {
    if (baand) document.documentElement.style.setProperty('--samtykke-h', baand.offsetHeight + 'px');
  }
  function fjernBaand() {
    if (!baand) return;
    baand.parentNode.removeChild(baand);
    baand = null;
    document.documentElement.classList.remove('samtykke-vises');
    document.documentElement.style.removeProperty('--samtykke-h');
    window.removeEventListener('resize', settHoyde);
  }
  function velg(v) {
    skriv(v);
    fjernBaand();
    if (v === GODTA) lastPixel();
  }
  function visBaand() {
    if (baand || les() === GODTA || les() === NODVENDIGE) return;
    /* Lenken rendres bare når personvernUrl faktisk er satt. En død lenke i
       et samtykkebånd er verre enn ingen lenke (punchliste punkt 1). */
    var url = erPlassholder(cfg.personvernUrl) ? '' : String(cfg.personvernUrl).trim();
    baand = document.createElement('div');
    baand.className = 'samtykke';
    baand.setAttribute('role', 'region');
    baand.setAttribute('aria-label', 'Samtykke til informasjonskapsler');
    baand.innerHTML =
      '<div class="samtykke-inn">' +
        '<p>' +
        (url
          ? '<a href="' + url.replace(/"/g, '&quot;') + '">Informasjonskapsler fra Meta måler annonsene.<span class="sr-only"> Les personvernerklæringen.</span></a>'
          : 'Informasjonskapsler fra Meta måler annonsene.') +
        '</p>' +
        '<div class="samtykke-knapper">' +
          '<button type="button" class="samtykke-knapp" data-valg="' + GODTA + '">Godta</button>' +
          '<button type="button" class="samtykke-knapp" data-valg="' + NODVENDIGE + '">Bare nødvendige</button>' +
        '</div>' +
      '</div>';
    baand.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== baand && !t.getAttribute('data-valg')) t = t.parentNode;
      if (t && t !== baand) velg(t.getAttribute('data-valg'));
    });
    document.body.appendChild(baand);
    document.documentElement.classList.add('samtykke-vises');
    settHoyde();
    window.addEventListener('resize', settHoyde);
  }

  /* På landingssiden vises båndet først når hero-sekvensen er ferdig: 6,2 s
     etter last, eller ved første scroll, det som kommer først. Ingen sporing
     fyrer før «Godta», så utsettelsen koster ingenting. Andre sider: straks. */
  function visBaandNaarKlart() {
    if (!document.getElementById('hero-demo')) { visBaand(); return; }
    var vist = false;
    var naa = function () {
      if (vist) return;
      vist = true;
      window.removeEventListener('scroll', naa);
      visBaand();
    };
    window.addEventListener('scroll', naa, { passive: true });
    setTimeout(naa, 6200);
  }

  window.EMSamtykke = {
    godta: function () { velg(GODTA); },
    bareNodvendige: function () { velg(NODVENDIGE); },
    /* Personvernsiden: fjern lagret valg og vis båndet på nytt. */
    nullstill: function () {
      try { localStorage.removeItem(NOKKEL); } catch (e) {}
      visBaand();
    },
    status: les
  };

  var valg = les();
  if (valg === GODTA) lastPixel();
  else if (valg !== NODVENDIGE) visBaandNaarKlart();
})();
