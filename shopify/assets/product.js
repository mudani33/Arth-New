/* ═══════════════════════════════════════════════════════════
   PRODUCT PAGE — Interactions
   ═══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ─── GALLERY ─── */
  function initGallery() {
    var slides = document.querySelectorAll('.pdp-gallery__slide');
    var thumbs = document.querySelectorAll('.pdp-gallery__thumb');
    var prevBtn = document.querySelector('.pdp-gallery__nav--prev');
    var nextBtn = document.querySelector('.pdp-gallery__nav--next');
    var currentEl = document.querySelector('.pdp-gallery__current');
    var current = 0;
    var total = slides.length;

    if (!total) return;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      slides[current].classList.remove('active');
      thumbs[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      thumbs[current].classList.add('active');
      if (currentEl) currentEl.textContent = current + 1;
      thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }

    thumbs.forEach(function(thumb, i) {
      thumb.addEventListener('click', function() { goTo(i); });
    });

    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

    // Touch swipe support
    var gallery = document.querySelector('.pdp-gallery__main');
    if (gallery) {
      var startX = 0;
      var diff = 0;
      gallery.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      gallery.addEventListener('touchmove', function(e) {
        diff = startX - e.touches[0].clientX;
      }, { passive: true });
      gallery.addEventListener('touchend', function() {
        if (Math.abs(diff) > 50) {
          if (diff > 0) goTo(current + 1);
          else goTo(current - 1);
        }
        diff = 0;
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });
  }

  /* ─── SIZE SELECTOR ─── */
  function initSizeSelector() {
    var sizeBtns = document.querySelectorAll('.pdp-size-btn');
    sizeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var parent = btn.closest('.pdp-info__option-values');
        parent.querySelectorAll('.pdp-size-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Update hidden variant input if needed
        updateVariant();
      });
    });
  }

  function updateVariant() {
    var options = [];
    document.querySelectorAll('.pdp-info__option-values').forEach(function(group) {
      var active = group.querySelector('.pdp-size-btn.active');
      if (active) options.push(active.dataset.value);
    });

    // Find matching variant (Shopify product JSON approach)
    if (window.productVariants) {
      var match = window.productVariants.find(function(v) {
        return options.every(function(opt, i) {
          return v['option' + (i + 1)] === opt;
        });
      });
      if (match) {
        document.querySelector('input[name="id"]').value = match.id;
        var addBtn = document.querySelector('.pdp-info__add-btn');
        if (match.available) {
          addBtn.disabled = false;
          addBtn.textContent = 'Add to Cart';
        } else {
          addBtn.disabled = true;
          addBtn.textContent = 'Sold Out';
        }
      }
    }
  }

  /* ─── PROVENANCE MAP ANIMATION ─── */
  function initProvenance() {
    var nodes = document.querySelectorAll('.pdp-provenance__node');
    var lineFill = document.querySelector('.pdp-provenance__line-fill');

    if (!nodes.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    nodes.forEach(function(node) {
      observer.observe(node);
    });

    // Animate the connecting line
    if (lineFill) {
      var lineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            lineFill.classList.add('animated');
          }
        });
      }, { threshold: 0.1 });

      lineObserver.observe(lineFill.parentElement);
    }
  }

  /* ─── REVEAL ANIMATIONS ─── */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function(el) { observer.observe(el); });
  }

  /* ─── INIT ─── */
  function init() {
    initGallery();
    initSizeSelector();
    initProvenance();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
