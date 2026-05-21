/* ============================================================
   SORRISO PRIME ODONTOLOGIA — MAIN.JS
   Vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ── 1. Custom Cursor ── */
const initCursor = () => {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  };

  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  };

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
  });

  const interactiveEls = document.querySelectorAll('a, button, [data-modal], .service-card, .dot, .carousel-btn, .ba-handle');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '14px';
      cursor.style.height  = '14px';
      follower.style.width  = '48px';
      follower.style.height = '48px';
      follower.style.opacity = '0.25';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '8px';
      cursor.style.height  = '8px';
      follower.style.width  = '32px';
      follower.style.height = '32px';
      follower.style.opacity = '0.6';
    });
  });
};

/* ── 2. Header Scroll ── */
const initHeader = () => {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);

    // Não ocultar o header enquanto menu mobile estiver aberto
    const mobileMenuOpen = document.getElementById('mobile-menu')?.classList.contains('open');
    if (mobileMenuOpen) {
      header.style.transform = 'translateY(0)';
      lastScroll = y;
      return;
    }

    // Auto-hide on fast scroll down, show on scroll up
    if (y > 400) {
      if (y > lastScroll + 8) {
        header.style.transform = 'translateY(-100%)';
      } else if (lastScroll > y + 4) {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* ── 3. Smooth Scroll ── */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });

      // Fecha menu mobile se estiver aberto
      window._closeMobileMenu?.();
    });
  });
};

/* ── 4. IntersectionObserver for Scroll Reveals ── */
const initScrollReveal = () => {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
};

/* ── 5. CountUp Animation ── */
const countUp = (el, target, duration = 1800, suffix = '') => {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const value = ease * target;

    el.textContent = isDecimal
      ? value.toFixed(1)
      : Math.floor(value).toLocaleString('pt-BR');

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = Number.isInteger(target)
      ? target.toLocaleString('pt-BR') + suffix
      : target.toFixed(1) + suffix;
  };

  requestAnimationFrame(tick);
};

const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        countUp(el, target, 2000, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

/* ── 6. Testimonials Carousel ── */
const initCarousel = () => {
  const track = document.querySelector('.testimonials-track');
  const dots  = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoplayTimer = null;

  const getVisible = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const maxIndex = () => Math.max(0, cards.length - getVisible());

  const goTo = (idx) => {
    current = Math.max(0, Math.min(idx, maxIndex()));
    const cardW = cards[0].offsetWidth + 24; // gap: 1.5rem = 24px
    track.style.transform = `translateX(-${current * cardW}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  };

  const next = () => goTo(current >= maxIndex() ? 0 : current + 1);
  const prev = () => goTo(current <= 0 ? maxIndex() : current - 1);

  prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
  });

  const startAutoplay = () => {
    autoplayTimer = setInterval(next, 4500);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  const wrap = document.querySelector('.testimonials-carousel-wrap');
  wrap?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  wrap?.addEventListener('mouseleave', startAutoplay);

  // Touch swipe
  let touchStartX = 0;
  wrap?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrap?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  });

  window.addEventListener('resize', () => { goTo(0); }, { passive: true });
  goTo(0);
  startAutoplay();
};

/* ── 7. Before/After Slider ── */
const initBASliders = () => {
  document.querySelectorAll('.ba-slider-wrap').forEach(wrap => {
    const after = wrap.querySelector('.ba-after');
    const handle = wrap.querySelector('.ba-handle');
    if (!after || !handle) return;

    let dragging = false;
    let pct = 50;

    const setPos = (x) => {
      const rect = wrap.getBoundingClientRect();
      pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
      after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left     = pct + '%';
    };

    handle.addEventListener('mousedown',  () => { dragging = true; });
    handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });

    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup',  () => { dragging = false; });
    window.addEventListener('touchend', () => { dragging = false; });

    // Click anywhere on wrap
    wrap.addEventListener('click', e => setPos(e.clientX));

    setPos(wrap.getBoundingClientRect().left + wrap.offsetWidth * 0.5);
  });
};

/* ── 8. Service Modals ── */
const initServiceModals = () => {
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close')?.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    if (!document.querySelector('.modal-overlay.active')) {
      document.body.classList.remove('modal-open');
    }
  };

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.modal));
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
    modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
  });
};

/* ── 9. Mobile Menu ── */
const initMobileMenu = () => {
  const hamburger = document.getElementById('hamburger-btn');
  const menu      = document.getElementById('mobile-menu');
  const closeBtn  = document.getElementById('mm-close');
  if (!hamburger || !menu) return;

  const openMenu = () => {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Botão X dentro do overlay
  closeBtn?.addEventListener('click', closeMenu);

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  // Fecha ao clicar em qualquer link do menu mobile
  menu.querySelectorAll('.mm-link, .mm-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Expõe closeMenu para o smooth scroll usar
  window._closeMobileMenu = closeMenu;
};

/* ── 10. Back to Top ── */
const initBackToTop = () => {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/* ── 11. Cookie Banner ── */
const initCookieBanner = () => {
  const banner  = document.getElementById('cookie-banner');
  const accept  = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');
  if (!banner) return;

  if (!localStorage.getItem('sp_cookies')) {
    setTimeout(() => banner.classList.add('visible'), 1200);
  }

  const dismiss = (choice) => {
    localStorage.setItem('sp_cookies', choice);
    banner.classList.remove('visible');
  };

  accept?.addEventListener('click',  () => dismiss('accepted'));
  decline?.addEventListener('click', () => dismiss('declined'));
};

/* ── 12. Lazy Loading enhancement ── */
const initLazyImages = () => {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
};

/* ── 13. Stagger children of reveal containers ── */
const initStagger = () => {
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 0.07}s`;
    });
  });
};

/* ── 14. Active nav link on scroll ── */
const initActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        const id = section.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { passive: true });
};

/* ── 15. Google rating badge micro-interaction ── */
const initRatingHover = () => {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'scale(1.04)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = '';
  });
};

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeader();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initCarousel();
  initBASliders();
  initServiceModals();
  initMobileMenu();
  initBackToTop();
  initCookieBanner();
  initLazyImages();
  initStagger();
  initActiveNav();
  initRatingHover();
});
