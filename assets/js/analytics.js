/* ============================================================
   SORRISO PRIME — ANALYTICS.JS
   Rastreamento de eventos customizado (sem dependências externas)
   ============================================================ */

'use strict';

const SorrisoAnalytics = (() => {
  const SESSION_KEY = 'sp_session';
  const EVENTS_KEY  = 'sp_events';

  /* ── Session ── */
  const getSession = () => {
    let s = sessionStorage.getItem(SESSION_KEY);
    if (!s) {
      s = {
        id: 'sp_' + Math.random().toString(36).slice(2) + Date.now(),
        start: new Date().toISOString(),
        referrer: document.referrer || 'direct',
        ua: navigator.userAgent.slice(0, 80),
        vw: window.innerWidth,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(s);
  };

  /* ── Store event ── */
  const track = (event, props = {}) => {
    const session = getSession();
    const entry = {
      event,
      timestamp: new Date().toISOString(),
      session_id: session.id,
      page: window.location.pathname,
      ...props,
    };

    // Append to local array (limited to 200 events)
    let events = [];
    try { events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); } catch {}
    events.push(entry);
    if (events.length > 200) events = events.slice(-200);
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); } catch {}

    // Debug in dev
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:') {
      console.debug('[Analytics]', event, props);
    }
  };

  /* ── Auto-track CTAs ── */
  const trackCTAs = () => {
    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', () => {
        track('cta_click', {
          label: el.dataset.track,
          text: el.textContent.trim().slice(0, 50),
        });
      });
    });
  };

  /* ── Track form interactions ── */
  const trackForm = () => {
    const form = document.getElementById('form-agendamento');
    if (!form) return;

    let started = false;
    form.addEventListener('input', () => {
      if (!started) {
        started = true;
        track('form_start', { form: 'agendamento' });
      }
    }, { once: false });

    form.addEventListener('submit', () => {
      track('form_submit', { form: 'agendamento' });
    });
  };

  /* ── Track WhatsApp float click ── */
  const trackWhatsApp = () => {
    document.querySelector('.whatsapp-float')?.addEventListener('click', () => {
      track('whatsapp_click', { location: 'float_button' });
    });
  };

  /* ── Track service card interactions ── */
  const trackServices = () => {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        track('service_view', {
          service: card.querySelector('.service-name')?.textContent.trim(),
        });
      });
    });
  };

  /* ── Track scroll depth ── */
  const trackScroll = () => {
    const milestones = new Set([25, 50, 75, 90]);
    window.addEventListener('scroll', () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      milestones.forEach(m => {
        if (pct >= m) { track('scroll_depth', { pct: m }); milestones.delete(m); }
      });
    }, { passive: true });
  };

  /* ── Track section visibility ── */
  const trackSections = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          track('section_view', { section: entry.target.id || entry.target.className.split(' ')[0] });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
  };

  /* ── Page view ── */
  const pageView = () => {
    const session = getSession();
    track('page_view', {
      title: document.title,
      referrer: session.referrer,
    });
  };

  /* ── Public API ── */
  const init = () => {
    pageView();
    trackCTAs();
    trackForm();
    trackWhatsApp();
    trackServices();
    trackScroll();
    trackSections();
  };

  const getEvents = () => {
    try { return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); } catch { return []; }
  };

  return { init, track, getEvents };
})();

document.addEventListener('DOMContentLoaded', () => SorrisoAnalytics.init());
window.SorrisoAnalytics = SorrisoAnalytics;
