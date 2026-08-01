// ==========================================================================
// Portfolio interactions: nav, reveal-on-scroll, role rotator, scroll progress,
// custom cursor, magnetic buttons, tilt cards, glitch headers, hero pipeline
// canvas, animated metric counters, footer clock, contact form.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initPageLoader(prefersReducedMotion);
  initNavbarScroll();
  initFadeInOnScroll();
  initRoleRotator();
  initScrollProgress();
  initScrollToTop();
  initGlitchHeaders();
  initHeroMetrics();
  initProficiencyBars();
  initFooterClock();
  initScrollSpy();

  if (!prefersReducedMotion) {
    initCustomCursor();
    initMagneticButtons();
    initTiltCards();
    initPipelineCanvas();
  }
});

// --- Boot-sequence page loader --------------------------------------------------
function initPageLoader(prefersReducedMotion) {
  const loader = document.getElementById('pageLoader');
  const fill = document.getElementById('loaderProgressFill');
  const body = document.body;

  if (!loader) {
    body.classList.remove('is-loading');
    body.classList.add('is-loaded');
    return;
  }

  if (prefersReducedMotion) {
    loader.remove();
    body.classList.remove('is-loading');
    body.classList.add('is-loaded');
    return;
  }

  // Stagger each terminal line using its data-delay, then fill the progress bar.
  const lines = loader.querySelectorAll('.loader-line');
  lines.forEach((line) => {
    line.style.animationDelay = (line.getAttribute('data-delay') || '0') + 'ms';
  });

  requestAnimationFrame(() => {
    if (fill) fill.style.width = '100%';
  });

  const totalDuration = 2450; // covers the last line's delay + a short hold
  const minVisible = 600; // never flash-hide the loader on very fast loads
  const shownAt = performance.now();

  const dismiss = () => {
    const elapsed = performance.now() - shownAt;
    const wait = Math.max(0, minVisible - elapsed);
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      body.classList.remove('is-loading');
      body.classList.add('is-loaded');
      setTimeout(() => loader.remove(), 600);
    }, wait);
  };

  setTimeout(dismiss, totalDuration);
}

// --- Scrollspy: keep exactly one nav link marked active based on scroll position -
function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link[href^="#"]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  // Update immediately on click so the tapped link feels instantly responsive.
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setActive(link.getAttribute('href').slice(1));
    });
  });

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// --- Navbar shadow / compact state on scroll ---------------------------------
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Reveal sections as they enter the viewport -------------------------------
function initFadeInOnScroll() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

// --- Rotating role text in the hero terminal ----------------------------------
function initRoleRotator() {
  const roles = document.querySelectorAll('.role-text');
  if (!roles.length) return;

  let index = [...roles].findIndex((el) => el.classList.contains('is-active'));
  if (index < 0) index = 0;

  setInterval(() => {
    roles[index].classList.remove('is-active');
    index = (index + 1) % roles.length;
    roles[index].classList.add('is-active');
  }, 2600);
}

// --- Top scroll progress bar ---------------------------------------------------
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// --- Scroll-to-top button -------------------------------------------------------
function initScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('show', window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Wire up data-glitch-text so the CSS glitch pseudo-elements have content ---
function initGlitchHeaders() {
  document.querySelectorAll('.section-header[data-glitch]').forEach((el) => {
    el.setAttribute('data-glitch-text', el.textContent.trim());
  });
}

// --- Animated count-up for the hero metrics strip -------------------------------
function initHeroMetrics() {
  const metrics = document.querySelectorAll('.hero-metric-value');
  if (!metrics.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    metrics.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  metrics.forEach((el) => observer.observe(el));
}

// --- Animate the language proficiency bar fill when visible ---------------------
function initProficiencyBars() {
  const bars = document.querySelectorAll('.proficiency-fill[data-fill]');
  if (!bars.length) return;

  const fill = (el) => {
    const target = el.getAttribute('data-fill') || '0';
    requestAnimationFrame(() => {
      el.style.width = target + '%';
    });
  };

  if (!('IntersectionObserver' in window)) {
    bars.forEach(fill);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fill(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((el) => observer.observe(el));
}

// --- Footer "system clock" -------------------------------------------------------
function initFooterClock() {
  const clock = document.getElementById('footerClock');
  if (!clock) return;

  const tick = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

// --- Custom cursor (desktop / fine-pointer only) ----------------------------------
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    dot.classList.add('is-active');
    ring.classList.add('is-active');
  });

  const raf = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  const hoverables = document.querySelectorAll('a, button, .skill-card, .tech-badge, .tilt-card, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('is-active');
    ring.classList.remove('is-active');
  });
}

// --- Magnetic pull for primary buttons ---------------------------------------------
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic');
  const strength = 18;

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// --- Subtle 3D tilt on cards, following cursor position -----------------------------
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  const maxTilt = 6;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// --- Signature element: animated event-driven "pipeline" behind the hero terminal ---
function initPipelineCanvas() {
  const canvas = document.getElementById('pipelineCanvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const labels = ['C#', 'ASP.NET', 'Kafka', 'Redis', 'PostgreSQL', 'RTSP', 'Java', 'Docker'];
  let nodes = [];
  let packets = [];
  let width = 0, height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function buildNodes() {
    nodes = labels.map((label, i) => {
      const cols = 4;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const jitterX = (Math.random() - 0.5) * 40;
      const jitterY = (Math.random() - 0.5) * 40;
      return {
        label,
        x: (width / cols) * (col + 0.5) + jitterX,
        y: (height / 2) * (row + 0.5) + jitterY + height * 0.12,
      };
    });

    packets = [];
    for (let i = 0; i < 10; i++) {
      packets.push(spawnPacket());
    }
  }

  function spawnPacket() {
    const from = nodes[Math.floor(Math.random() * nodes.length)];
    let to = nodes[Math.floor(Math.random() * nodes.length)];
    let guard = 0;
    while (to === from && guard < 5) {
      to = nodes[Math.floor(Math.random() * nodes.length)];
      guard++;
    }
    return {
      from,
      to,
      t: Math.random(),
      speed: 0.0035 + Math.random() * 0.004,
      color: ['#ffd700', '#8b0000', '#3aa0ff', '#2ecc71'][Math.floor(Math.random() * 4)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // connective lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.08)';
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < width * 0.32) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.fill();

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(204, 214, 246, 0.35)';
      ctx.fillText(n.label, n.x + 8, n.y + 3);
    });

    // traveling packets
    packets.forEach((p) => {
      p.t += p.speed;
      if (p.t >= 1) {
        Object.assign(p, spawnPacket());
      }
      const x = p.from.x + (p.to.x - p.from.x) * p.t;
      const y = p.from.y + (p.to.y - p.from.y) * p.t;

      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

// --- Contact form (client-side only stub, wired to onclick in the markup) ------------
function submitForm() {
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const status = document.getElementById('form-status');

  if (!nameEl.value || !emailEl.value || !messageEl.value) {
    if (status) {
      status.textContent = '> error: all fields are required.';
      status.style.color = '#ff6b6b';
    }
    return;
  }

  if (status) {
    status.textContent = `> message queued for ngothaihoan1103@gmail.com — thanks, ${nameEl.value.split(' ')[0]}!`;
    status.style.color = '#2ecc71';
  }

  nameEl.value = '';
  emailEl.value = '';
  messageEl.value = '';
}

// Expose for the inline onclick handler
window.submitForm = submitForm;