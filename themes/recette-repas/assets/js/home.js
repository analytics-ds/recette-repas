// Page d'accueil Recette & Repas — interactions

// 1. Revelation des elements au scroll
(function () {
  var els = document.querySelectorAll('.rr-home [data-reveal]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  // active le masquage initial seulement maintenant que le JS tourne
  document.body.classList.add('rr-reveal-on');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();

// 2. Menu mobile
(function () {
  var burger = document.querySelector('.rr-burger');
  var nav = document.querySelector('.rr-nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
