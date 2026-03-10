/* ═══════════════════════════════════════════════════════════
   ARTH ATELIER — About Page Interactions
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  var revealElements = document.querySelectorAll('.reveal');

  /* ─── NAVIGATION — Hide on scroll down, reveal on scroll up ─── */
  var lastScrollY = 0;
  var navHidden = false;
  var ticking = false;

  function updateNav() {
    var currentScrollY = window.scrollY;
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  updateNav();

  /* ─── MOBILE MENU ─── */
  var menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    menuToggle.classList.toggle('nav__menu-toggle--active', menuOpen);
    mobileMenu.classList.toggle('mobile-menu--open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  Array.prototype.forEach.call(mobileLinks, function (link) {
    link.addEventListener('click', function () {
      if (menuOpen) toggleMenu();
    });
  });

  /* ─── SCROLL REVEAL ─── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ─── NEWSLETTER FORM ─── */
  var newsletterForm = document.querySelector('.newsletter__form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('.newsletter__input');
      var submitBtn = this.querySelector('.newsletter__submit');
      var email = input.value;

      if (email) {
        submitBtn.textContent = 'Thank you';
        submitBtn.style.pointerEvents = 'none';
        input.value = '';
        input.placeholder = 'You\'re on the list';
        input.disabled = true;
      }
    });
  }

  /* ─── HERO ENTRANCE ANIMATION ─── */
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    var hero = document.querySelector('.about-hero__inner');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(25px)';
      hero.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';

      setTimeout(function () {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }, 200);
    }
  });

})();
