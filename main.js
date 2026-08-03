/* ─── Navigation ──────────────────────────────────────────────── */
const nav    = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const panel  = document.querySelector('.nav-mobile-panel');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

if (toggle && panel) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    panel.classList.toggle('open');
    document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : '';
  });

  panel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      panel.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* "Contact" nav links → smooth scroll to #contact on this page,
   or navigate to index.html#contact from other pages */
document.querySelectorAll('a[data-contact]').forEach(a => {
  a.addEventListener('click', e => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      e.preventDefault();
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
    // else: let the href="index.html#contact" navigate naturally
  });
});

/* ─── Before / After Scroll Reveal ──────────────────────────── */
function updateBAReveal() {
  document.querySelectorAll('.ba-wrapper').forEach(wrapper => {
    const wTop       = wrapper.getBoundingClientRect().top + window.scrollY;
    const scrolled   = window.scrollY - wTop;
    const scrollRoom = wrapper.offsetHeight - window.innerHeight;
    const progress   = Math.max(0, Math.min(1, scrolled / scrollRoom));

    const afterLayer = wrapper.querySelector('.ba-after-layer');
    const lineEl     = wrapper.querySelector('.ba-reveal-line');
    const hintEl     = wrapper.querySelector('.ba-hint');
    const type       = wrapper.dataset.reveal;

    if (afterLayer) {
      const pct = progress * 100;
      if (type === 'horizontal') {
        afterLayer.style.clipPath = `inset(0 0 ${(100 - pct).toFixed(2)}% 0)`;
        if (lineEl) lineEl.style.top = `${pct.toFixed(2)}%`;
      } else {
        afterLayer.style.clipPath = `inset(0 ${(100 - pct).toFixed(2)}% 0 0)`;
        if (lineEl) lineEl.style.left = `${pct.toFixed(2)}%`;
      }
    }

    if (hintEl) {
      hintEl.style.opacity = Math.max(0, 1 - progress * 4).toFixed(3);
      hintEl.style.pointerEvents = progress > 0.15 ? 'none' : '';
    }
  });
}

window.addEventListener('scroll', updateBAReveal, { passive: true });
updateBAReveal(); // initialize on load

/* ─── Smooth scroll for hash links on same page ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ─── Fade-in on scroll (optional subtle entrance) ───────────── */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => io.observe(el));
}
