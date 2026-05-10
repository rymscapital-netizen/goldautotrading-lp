'use strict';

/* ============================================================
   Sticky Bar — hero通過後に表示
============================================================ */
(function () {
  const bar  = document.getElementById('stickyBar');
  const hero = document.querySelector('.hero');
  if (!bar || !hero) return;

  function tick() {
    const bottom = hero.getBoundingClientRect().bottom;
    bar.classList.toggle('is-visible', bottom < 0);
  }

  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ============================================================
   Smooth Scroll — アンカーリンク
============================================================ */
(function () {
  const header = document.getElementById('header');

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 60) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   Fade-in on Scroll — IntersectionObserver
============================================================ */
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el      = entry.target;
        const parent  = el.parentElement;
        const siblings = parent ? Array.from(parent.children) : [];
        const index   = siblings.indexOf(el);
        const delay   = Math.min(index * 90, 450);

        setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================================
   Number Counter — trust bar の数値をカウントアップ
============================================================ */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var triggered = false;
  var trustBar  = document.querySelector('.trust-bar');
  if (!trustBar) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el, target, isInt, suffix) {
    var duration = 1400;
    var start    = performance.now();
    var decimals = isInt ? 0 : (String(target).split('.')[1] || '').length;

    function frame(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutCubic(progress);
      var current  = eased * target;
      var display  = isInt
        ? Math.floor(current).toString()
        : current.toFixed(decimals);

      el.textContent = display + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = (isInt ? target : target.toFixed(decimals)) + suffix;
      }
    }

    requestAnimationFrame(frame);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;
      observer.disconnect();

      document.querySelectorAll('.trust-num[data-count]').forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var isInt  = el.getAttribute('data-int') === 'true';
        animateCount(el, target, isInt, suffix);
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(trustBar);
})();

/* ============================================================
   Header shadow on scroll
============================================================ */
(function () {
  var header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.10)';
    } else {
      header.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
