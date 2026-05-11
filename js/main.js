(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const linksBox = document.querySelector('[data-nav-links]');
  const yearEl = document.querySelector('[data-year]');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scroll + close menu on click (mobile)
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // account for fixed header
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
      window.scrollTo({ top, behavior: 'smooth' });

      // close mobile menu
      if (linksBox && linksBox.classList.contains('is-open')) {
        linksBox.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Mobile menu toggle
  if (toggle && linksBox) {
    toggle.addEventListener('click', () => {
      const isOpen = linksBox.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const clickedInside = linksBox.contains(t) || toggle.contains(t);
      if (!clickedInside && linksBox.classList.contains('is-open')) {
        linksBox.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link on scroll
  const sections = ['#about', '#projects', '#skills', '#contact']
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  const navItems = new Map();
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (href) navItems.set(href, a);
  });

  const setActive = (id) => {
    navItems.forEach((a) => a.classList.remove('is-active'));
    const el = navItems.get(id);
    if (el) el.classList.add('is-active');
  };

  const observer = new IntersectionObserver((entries) => {
    // choose the most visible
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

    if (visible?.target?.id) setActive('#' + visible.target.id);
  }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.15, 0.35, 0.6] });

  sections.forEach((s) => observer.observe(s));
})();
