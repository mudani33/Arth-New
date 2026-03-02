/* ═══════════════════════════════════════════════════════════
   ARTH ATELIER — Interactions & Animations
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM REFERENCES ─── */
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');
  const revealElements = document.querySelectorAll('.reveal');
  const productCards = document.querySelectorAll('.product-card');

  /* ═══════════════════════════════════════════════════════════
     1. SMART NAVIGATION — Hide on scroll down, reveal on scroll up
     ═══════════════════════════════════════════════════════════ */
  let lastScrollY = 0;
  let navHidden = false;
  let ticking = false;

  function updateNav() {
    const currentScrollY = window.scrollY;
    const heroHeight = hero ? hero.offsetHeight : 0;

    // Transparent nav while in hero
    if (currentScrollY < heroHeight - 100) {
      nav.classList.add('nav--transparent');
    } else {
      nav.classList.remove('nav--transparent');
    }

    // Hide/reveal on scroll direction
    if (currentScrollY > heroHeight) {
      if (currentScrollY > lastScrollY + 5 && !navHidden) {
        nav.classList.add('nav--hidden');
        navHidden = true;
      } else if (currentScrollY < lastScrollY - 5 && navHidden) {
        nav.classList.remove('nav--hidden');
        navHidden = false;
      }
    } else {
      nav.classList.remove('nav--hidden');
      navHidden = false;
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Initialize nav state
  updateNav();


  /* ═══════════════════════════════════════════════════════════
     2. MOBILE MENU TOGGLE
     ═══════════════════════════════════════════════════════════ */
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    menuToggle.classList.toggle('nav__menu-toggle--active', menuOpen);
    mobileMenu.classList.toggle('mobile-menu--open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (menuOpen) toggleMenu();
    });
  });


  /* ═══════════════════════════════════════════════════════════
     3. SCROLL-TRIGGERED REVEAL ANIMATIONS
        Uses IntersectionObserver for performance
     ═══════════════════════════════════════════════════════════ */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ═══════════════════════════════════════════════════════════
     4. PRODUCT CARD PARALLAX — Subtle cursor tracking
     ═══════════════════════════════════════════════════════════ */
  productCards.forEach(function (card) {
    var imageInner = card.querySelector('.product-card__image-inner');
    if (!imageInner) return;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;

      // Subtle parallax shift (max 8px movement)
      var moveX = (x - 0.5) * 16;
      var moveY = (y - 0.5) * 16;

      imageInner.style.transform =
        'translate(' + moveX + 'px, ' + moveY + 'px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      imageInner.style.transform = 'translate(0, 0) scale(1)';
    });
  });


  /* ═══════════════════════════════════════════════════════════
     5. QUICK-ADD SIZE BUTTON INTERACTION
     ═══════════════════════════════════════════════════════════ */
  var sizeButtons = document.querySelectorAll('.size-btn');

  sizeButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      var card = btn.closest('.product-card');
      var productName = card
        ? card.querySelector('.product-card__name').textContent
        : 'Product';
      var size = btn.textContent;

      // Visual feedback
      btn.style.background = 'var(--color-text)';
      btn.style.color = 'var(--color-white)';
      btn.style.borderColor = 'var(--color-text)';
      btn.textContent = '\u2713';

      setTimeout(function () {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.textContent = size;
      }, 1200);

      // Update cart count
      var cartCount = document.querySelector('.nav__cart-count');
      var currentCount = parseInt(cartCount.textContent) || 0;
      cartCount.textContent = currentCount + 1;
      cartCount.classList.add('nav__cart-count--visible');

      console.log('Added to cart: ' + productName + ' — Size ' + size);
    });
  });


  /* ═══════════════════════════════════════════════════════════
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════
     7. HERO SCROLL INDICATOR — Fade out as user scrolls
     ═══════════════════════════════════════════════════════════ */
  var scrollIndicator = document.getElementById('scrollIndicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', function () {
      var scrollPercent = window.scrollY / (window.innerHeight * 0.3);
      scrollIndicator.style.opacity = Math.max(0, 1 - scrollPercent);
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════
     8. HERO PARALLAX — Subtle video movement on scroll
     ═══════════════════════════════════════════════════════════ */
  var heroVideo = document.querySelector('.hero__video');

  if (heroVideo) {
    window.addEventListener('scroll', function () {
      if (window.scrollY < window.innerHeight) {
        var translateY = window.scrollY * 0.3;
        heroVideo.style.transform = 'translateY(' + translateY + 'px)';
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════
     9. NEWSLETTER FORM — Graceful handling
     ═══════════════════════════════════════════════════════════ */
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

        console.log('Newsletter signup: ' + email);
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════
     10. PAGE LOAD ANIMATION
     ═══════════════════════════════════════════════════════════ */
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Animate hero content in
    var heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
      heroContent.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';

      setTimeout(function () {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 300);
    }
  });

})();
