/**
 * nav.js — Navigation Module
 * Piyush Jadhav Personal Brand Website
 *
 * Handles:
 *  - Sticky header scroll behavior
 *  - Mobile hamburger menu (open/close, ESC key, scroll lock)
 *  - Active link highlighting by current page
 *  - Light / Dark theme toggle with localStorage persistence
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   STICKY HEADER — adds .is-scrolled class on scroll
───────────────────────────────────────────────────────────── */

function initStickyNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  // Run once on load in case page is already scrolled
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   MOBILE MENU — hamburger toggle, ESC key, body scroll lock
───────────────────────────────────────────────────────────── */

function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const navOverlay   = document.getElementById('nav-overlay');
  const overlayLinks = document.querySelectorAll('.nav-overlay-link');

  if (!hamburger || !navOverlay) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('is-open');
    document.body.classList.add('nav-open');

    // Move focus to first link for accessibility
    const firstLink = navOverlay.querySelector('.nav-overlay-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  function toggleMenu() {
    const isOpen = navOverlay.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  }

  // Hamburger click
  hamburger.addEventListener('click', toggleMenu);

  // ESC key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close on overlay link click (navigate)
  overlayLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on backdrop click (clicking outside the nav content area)
  navOverlay.addEventListener('click', (e) => {
    if (e.target === navOverlay) {
      closeMenu();
    }
  });

  // Keep hamburger hidden above 768px if window is resized
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navOverlay.classList.contains('is-open')) {
      closeMenu();
    }
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   ACTIVE LINK — highlights the nav link for the current page
───────────────────────────────────────────────────────────── */

function setActiveLink() {
  // Get all nav links (desktop + mobile overlay)
  const navLinks     = document.querySelectorAll('.nav-link');
  const overlayLinks = document.querySelectorAll('.nav-overlay-link');

  const currentPath = window.location.pathname;

  // Determine current page filename
  // e.g. '/about.html' → 'about.html' or '/about' → 'about'
  const filename = currentPath.split('/').pop() || 'index.html';

  function markActive(links) {
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();

      // Match homepage
      const isHome =
        (filename === '' || filename === 'index.html') &&
        (linkFile === 'index.html' || linkFile === '' || href === '/');

      // Match other pages
      const isMatch = !isHome && linkFile === filename;

      if (isHome || isMatch) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  markActive(navLinks);
  markActive(overlayLinks);
}





/* ─────────────────────────────────────────────────────────────
   INIT — runs everything on DOMContentLoaded
───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileMenu();
  setActiveLink();
});
