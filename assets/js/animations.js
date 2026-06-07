/**
 * animations.js — Scroll & Interaction Animations Module
 * Piyush Jadhav Personal Brand Website — Phase 3 Full Implementation
 *
 * Modules:
 *  - initScrollReveal()  — IntersectionObserver for .reveal elements
 *  - initCounters()      — Animated stat counter (0 → target) on scroll
 *  - initTypewriter()    — Hero typewriter cycling effect
 *  - initFilterTabs()    — Project category filter tabs
 *  - initAccordion()     — Expandable accordion items (keyboard accessible)
 *  - initHoverTilt()     — Subtle card tilt on mousemove (desktop only)
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
   Adds .is-visible when elements scroll into view.
   Respects prefers-reduced-motion.
───────────────────────────────────────────────────────────── */

function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale'
  );

  if (!revealEls.length) return;

  // Instantly show everything if user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Respect delay CSS custom property set by reveal-delay-N classes
          const delay = getComputedStyle(entry.target).getPropertyValue('--reveal-delay');
          if (delay && delay.trim() !== '0ms') {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, parseFloat(delay) || 0);
          } else {
            entry.target.classList.add('is-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────────────────────────────
   STAT COUNTERS
   Looks for .stat-counter[data-target] or .impact-number spans.
   Animates value from 0 → target using easeOutQuart.
───────────────────────────────────────────────────────────── */

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const suffix = el.querySelector('.impact-suffix')?.textContent || '';
  const baseEl = el.childNodes[0]; // text node

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = isDecimal
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);

    if (baseEl && baseEl.nodeType === Node.TEXT_NODE) {
      baseEl.textContent = current;
    } else if (!suffix) {
      el.textContent = current;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  // Support both .stat-counter[data-target] and .impact-number elements
  const counterEls = document.querySelectorAll('.stat-counter[data-target], .impact-number');
  if (!counterEls.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Get numeric target
        const rawTarget = el.getAttribute('data-target') || el.textContent;
        const numericTarget = parseFloat(rawTarget.replace(/[^0-9.]/g, ''));

        if (!isNaN(numericTarget) && !prefersReduced) {
          animateCounter(el, numericTarget, 1600);
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────────────────────────────
   TYPEWRITER
   Target: #typewriter-target[data-words="word1,word2,word3"]
   Cycles through words with typing/deleting animation.
───────────────────────────────────────────────────────────── */

function initTypewriter() {
  const target = document.getElementById('typewriter-target');
  if (!target) return;

  const words = (target.getAttribute('data-words') || '')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);

  if (words.length < 2) {
    if (words.length === 1) target.textContent = words[0];
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    target.textContent = words[0];
    return;
  }

  let wordIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 60;   // ms per character typed
  const DELETE_SPEED = 35;   // ms per character deleted
  const PAUSE_AFTER  = 2000; // ms to pause after fully typing a word
  const PAUSE_BEFORE = 300;  // ms to pause before typing next word

  function tick() {
    const currentWord = words[wordIndex];

    if (isPaused) return;

    if (!isDeleting) {
      // Typing
      charIndex++;
      target.textContent = currentWord.substring(0, charIndex);

      if (charIndex === currentWord.length) {
        // Fully typed — pause then start deleting
        isPaused = true;
        setTimeout(() => {
          isPaused  = false;
          isDeleting = true;
          setTimeout(tick, DELETE_SPEED);
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);

    } else {
      // Deleting
      charIndex--;
      target.textContent = currentWord.substring(0, charIndex);

      if (charIndex === 0) {
        // Fully deleted — move to next word
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        isPaused   = true;
        setTimeout(() => {
          isPaused = false;
          setTimeout(tick, TYPE_SPEED);
        }, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start after a short initial delay
  target.textContent = '';
  setTimeout(tick, 800);
}


/* ─────────────────────────────────────────────────────────────
   FILTER TABS
   Works on the projects page:
   - .filter-tabs buttons have data-filter="category"
   - .project-card items have data-category="category"
   - Smooth fade animation on filter change
───────────────────────────────────────────────────────────── */

function initFilterTabs() {
  const filterContainer = document.getElementById('project-filter-tabs');
  if (!filterContainer) return;

  const tabs     = filterContainer.querySelectorAll('.filter-tab');
  const container = document.getElementById('projects-container');
  if (!tabs.length || !container) return;

  const allCards = container.querySelectorAll('.project-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      // Fade out all, then show matching
      allCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const matches  = filter === 'all' || category === filter;

        if (matches) {
          card.style.removeProperty('display');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // Add transition styles to cards
  allCards.forEach((card) => {
    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  });
}


/* ─────────────────────────────────────────────────────────────
   ACCORDION
   Handles both #tech-accordion and #faq-accordion.
   - Click trigger to expand/collapse
   - Keyboard: Enter/Space toggle, ArrowUp/ArrowDown navigate
   - Only one item open at a time per accordion group
   - Smooth max-height animation via CSS + JS height measurement
───────────────────────────────────────────────────────────── */

function initAccordion() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach((accordion) => {
    const items = accordion.querySelectorAll('.accordion-item');

    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');

      if (!trigger || !content) return;

      // Set initial collapsed state via inline style so CSS transition works
      content.style.maxHeight = '0px';
      content.style.overflow  = 'hidden';
      content.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all open items in this accordion
        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            closeItem(otherItem);
          }
        });

        // Toggle the clicked item
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });

      // Keyboard navigation within accordion
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = getNextItem(item, items, 1);
          if (next) next.querySelector('.accordion-trigger')?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = getNextItem(item, items, -1);
          if (prev) prev.querySelector('.accordion-trigger')?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0]?.querySelector('.accordion-trigger')?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1]?.querySelector('.accordion-trigger')?.focus();
        }
      });
    });
  });

  function openItem(item) {
    const content = item.querySelector('.accordion-content');
    const trigger = item.querySelector('.accordion-trigger');
    if (!content || !trigger) return;

    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = content.scrollHeight + 'px';
  }

  function closeItem(item) {
    const content = item.querySelector('.accordion-content');
    const trigger = item.querySelector('.accordion-trigger');
    if (!content || !trigger) return;

    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0px';
  }

  function getNextItem(currentItem, items, direction) {
    const itemsArray = Array.from(items);
    const idx = itemsArray.indexOf(currentItem);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= itemsArray.length) return null;
    return itemsArray[nextIdx];
  }
}


/* ─────────────────────────────────────────────────────────────
   SUBTLE HOVER TILT (Desktop only, cards)
   Adds a gentle 3D perspective tilt on .card-hover elements
   when the user moves their mouse — premium feel.
───────────────────────────────────────────────────────────── */

function initHoverTilt() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.card-hover');

  cards.forEach((card) => {
    card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;

      // Max 4 degrees tilt
      const tiltX = ((y - centerY) / centerY) * -4;
      const tiltY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
───────────────────────────────────────────────────────────── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navHeight = document.querySelector('.site-nav')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   ACTIVE NAV LINK HIGHLIGHT (scroll-spy)
───────────────────────────────────────────────────────────── */

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link[href]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isMatch = href && (
              href === `#${id}` ||
              href.endsWith(`#${id}`)
            );
            link.classList.toggle('is-active-section', isMatch);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}


/* ─────────────────────────────────────────────────────────────
   INIT — DOMContentLoaded
───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initTypewriter();
  initFilterTabs();
  initAccordion();
  initHoverTilt();
  initSmoothScroll();
  initScrollSpy();
});
