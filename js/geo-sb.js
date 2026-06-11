/* ==========================================================================
   GEO-audit landingsside — animasjonslag (vanilla JS, IntersectionObserver)
   Regler: spilles én gang per sidevisning (unntak: mockupen, rolig loop med
   pause), ingen scroll-jacking, siden er komplett uten denne filen.
   ========================================================================== */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function animEnabled() {
    return docEl.getAttribute('data-anim') !== 'off' && !reduced.matches;
  }

  function syncAnimClass() {
    docEl.classList.toggle('anim', animEnabled());
  }
  syncAnimClass();
  reduced.addEventListener('change', syncAnimClass);

  /* ---- A2–A5: én-gangs reveal via IntersectionObserver ------------------- */

  /* Robust «i viewport»-deteksjon: IntersectionObserver når den virker,
     med synkron rect-sjekk på load/scroll/resize som fallback. Enkelte
     innrammede miljøer leverer aldri IO-callbacks; innholdet skal aldri
     kunne bli stående skjult. Fyrer maks én gang per element. */
  function onInView(el, cb) {
    var fired = false;
    var io = null;
    function fire() {
      if (fired) return;
      fired = true;
      if (io) io.disconnect();
      window.removeEventListener('scroll', check, true);
      window.removeEventListener('resize', check);
      cb();
    }
    function check() {
      var r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight * 0.82) fire();
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) fire(); });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      io.observe(el);
    }
    window.addEventListener('scroll', check, { passive: true, capture: true });
    window.addEventListener('resize', check);
    check();
    setTimeout(check, 800);
  }

  var seen = [];
  document.querySelectorAll('.a2, .a3, .a4, .a5').forEach(function (el) {
    seen.push(el);
    onInView(el, function () { el.classList.add('in'); });
  });

  /* ---- A1: AI-mockupen — stegvis avspilling + roterende bransjer ---------- */
  /* Stedsnøytrale spørsmål (nasjonalt dekkende). Bransjene matcher annonse-
     settet for umiddelbar gjenkjenning fra annonse til side. */

  var INDUSTRIES = [
    {
      id: 'rorlegger',
      q: 'Hvilken rørlegger bør jeg bruke ved vannskade?',
      intro: 'Ved vannskade lønner det seg å velge et etablert firma med døgnvakt. Basert på kildene jeg har tilgang til, er dette aktuelle alternativer i ditt område:',
      firms: [
        ['Rørleggerfirma A', 'fremhevet for vannskade og bad'],
        ['Rørleggerfirma B', 'omtalt for service og rehabilitering'],
        ['Rørleggerfirma C', 'nevnt i flere kilder om VVS']
      ]
    },
    {
      id: 'elektriker',
      q: 'Hvilken elektriker bør jeg velge til boliginstallasjon?',
      intro: 'For boliginstallasjon bør du velge en registrert elvirksomhet med dokumentert erfaring. Dette er noen som går igjen i kildene for ditt område:',
      firms: [
        ['Elektrofirma A', 'fremhevet for boliginstallasjon og smarthus'],
        ['Elektrofirma B', 'omtalt for el-sjekk og service'],
        ['Elektrofirma C', 'nevnt i flere kilder om rehabilitering']
      ]
    },
    {
      id: 'renhold',
      q: 'Hvilket renholdsbyrå bør jeg velge til kontoret?',
      intro: 'For fast renhold av næringslokaler bør du velge et byrå med ryddige avtaler og dokumenterte rutiner. Disse går igjen i kildene for ditt område:',
      firms: [
        ['Renholdsbyrå A', 'fremhevet for kontor og næringsbygg'],
        ['Renholdsbyrå B', 'omtalt for fast renhold og vinduspuss'],
        ['Renholdsbyrå C', 'nevnt i flere kilder om byggrenhold']
      ]
    }
  ];

  var chat = document.getElementById('chat-demo');
  if (!chat) return;

  var qText = chat.querySelector('.bubble');
  var intro = chat.querySelector('.chat-intro');
  var typing = chat.querySelector('.chat-typing');
  var firmEls = chat.querySelectorAll('.chat-firms li');
  var steps = chat.querySelectorAll('[data-step]');
  var replayBtn = document.getElementById('chat-replay');

  var industryIdx = 0;
  var timers = [];
  var playing = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    playing = false;
  }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function currentIndustry() {
    return INDUSTRIES[industryIdx % INDUSTRIES.length];
  }

  function fillContent(ind) {
    qText.textContent = ind.q;
    intro.textContent = ind.intro;
    firmEls.forEach(function (li, i) {
      li.querySelector('strong').textContent = ind.firms[i][0];
      li.querySelector('span').textContent = ind.firms[i][1];
    });
  }

  // Uten animasjon: vis komplett slutttilstand
  function showStatic() {
    clearTimers();
    fillContent(currentIndustry());
    steps.forEach(function (el) { el.classList.add('on'); });
    typing.hidden = true;
    typing.classList.remove('on');
  }

  function setStep(n) {
    steps.forEach(function (el) {
      el.classList.toggle('on', Number(el.getAttribute('data-step')) <= n);
    });
  }

  function typeQuestion(text, doneCb) {
    qText.textContent = '';
    var i = 0;
    (function tick() {
      qText.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) { later(tick, 26); } else { later(doneCb, 350); }
    })();
  }

  function play() {
    if (!animEnabled()) { showStatic(); return; }
    clearTimers();
    playing = true;

    var ind = currentIndustry();
    fillContent(ind);
    setStep(0);
    typing.hidden = false;
    typing.classList.remove('on');

    later(function () {
      setStep(1);                                   // spørsmålet skrives
      typeQuestion(ind.q, function () {
        setStep(2);                                 // AI-svar-etikett + skriveindikator
        typing.classList.add('on');
        later(function () {
          typing.classList.remove('on');
          typing.hidden = true;
          setStep(3);                               // svaret bygges linje for linje
          later(function () { setStep(4); }, 700);
          later(function () { setStep(5); }, 1400);
          later(function () { setStep(6); }, 2100);
          later(function () { setStep(7); }, 3400); // kort pause, så «Ikke nevnt.»
          later(function () {                       // rolig pause, neste bransje
            playing = false;
            industryIdx += 1;
            if (animEnabled()) play();
          }, 9000);
        }, 1500);
      });
    }, 400);
  }

  // Spilles første gang når mockupen kommer i viewport
  var chatStarted = false;
  if (animEnabled()) {
    onInView(chat, function () {
      if (!chatStarted) { chatStarted = true; play(); }
    });
  } else {
    showStatic();
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      chatStarted = true;
      play();
    });
  }
})();
