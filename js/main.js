/**
 * Cybersecurity Reflection Blog — Main JavaScript
 * Brian Justine D. Alcoran | BSIT
 *
 * Features: dark mode, reading progress, scroll animations,
 * active navigation, scroll-to-top, mobile menu
 */

(function () {
  'use strict';

  /* --- Theme Toggle --- */
  const THEME_KEY = 'reflection-theme';
  const themeToggle = document.querySelector('.theme-toggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* --- Reading Progress Bar --- */
  const progressBar = document.querySelector('.progress-bar');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* --- Navbar Scroll Effect --- */
  const navbar = document.querySelector('.navbar');

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* --- Mobile Navigation --- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Active Navigation Link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navAnchors = document.querySelectorAll('.nav-links a');

  navAnchors.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.split('/').pop().split('#')[0];
    const isHome = (currentPage === '' || currentPage === 'index.html') && (linkPage === '' || linkPage === 'index.html');
    const isMatch = linkPage === currentPage;

    if (isHome || isMatch) {
      link.classList.add('active');
    }

    /* Highlight nav link when scrolling to anchor sections on same page */
    if (href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              navAnchors.forEach((a) => a.classList.remove('active'));
              link.classList.add('active');
            }
          },
          { rootMargin: '-40% 0px -55% 0px' }
        );
        observer.observe(section);
      }
    }
  });

  /* --- Scroll Reveal Animations --- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* --- Scroll to Top Button --- */
  const scrollTopBtn = document.querySelector('.scroll-top');

  if (scrollTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
