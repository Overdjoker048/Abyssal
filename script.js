/* ============================================================
   ABYSSAL — script.js
   ============================================================ */

// ── CANVAS : PARTICULES ABYSSALES ──────────────────────────
(function () {
  const canvas = document.getElementById('abyss-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], embers = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Particule (bulle montante / étoile lointaine)
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x     = Math.random() * W;
    this.y     = H + Math.random() * 200;
    this.r     = Math.random() * 1.8 + 0.3;
    this.speed = Math.random() * 0.4 + 0.08;
    this.alpha = Math.random() * 0.25 + 0.05;
    this.drift = (Math.random() - 0.5) * 0.3;
    // couleur : bleu profond ou rouge braise
    const roll = Math.random();
    if (roll < 0.6) {
      this.color = `rgba(${50 + Math.floor(Math.random()*30)}, ${60 + Math.floor(Math.random()*30)}, ${130 + Math.floor(Math.random()*80)}, ${this.alpha})`;
    } else if (roll < 0.85) {
      this.color = `rgba(${200 + Math.floor(Math.random()*55)}, ${180 + Math.floor(Math.random()*50)}, ${80 + Math.floor(Math.random()*40)}, ${this.alpha})`;
    } else {
      this.color = `rgba(${140 + Math.floor(Math.random()*60)}, ${20 + Math.floor(Math.random()*20)}, ${20 + Math.floor(Math.random()*20)}, ${this.alpha})`;
    }
  };
  Particle.prototype.update = function () {
    this.y -= this.speed;
    this.x += this.drift;
    if (this.y < -10) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  function initParticles() {
    particles = [];
    const count = Math.min(180, Math.floor((W * H) / 8000));
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.y = Math.random() * H; // distribute on start
      particles.push(p);
    }
  }

  function drawBackground() {
    // Fond dégradé abyssal
    const grad = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.85);
    grad.addColorStop(0,   'rgba(18, 10, 30, 1)');
    grad.addColorStop(0.4, 'rgba(10, 6, 20, 1)');
    grad.addColorStop(0.75,'rgba(8, 4, 14, 1)');
    grad.addColorStop(1,   'rgba(4, 2, 8, 1)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Lueur rouge centrale (braise de l'abyssal)
    const glowRed = ctx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H * 0.55, W * 0.5);
    glowRed.addColorStop(0,   'rgba(100, 15, 15, 0.18)');
    glowRed.addColorStop(0.5, 'rgba(60, 8, 8, 0.07)');
    glowRed.addColorStop(1,   'transparent');
    ctx.fillStyle = glowRed;
    ctx.fillRect(0, 0, W, H);

    // Lueur bleue haut (profondeur)
    const glowBlue = ctx.createRadialGradient(W * 0.2, H * 0.1, 0, W * 0.2, H * 0.1, W * 0.55);
    glowBlue.addColorStop(0,   'rgba(15, 20, 80, 0.2)');
    glowBlue.addColorStop(0.6, 'rgba(10, 12, 50, 0.06)');
    glowBlue.addColorStop(1,   'transparent');
    ctx.fillStyle = glowBlue;
    ctx.fillRect(0, 0, W, H);
  }

  let frame = 0;
  function animate() {
    frame++;
    drawBackground();

    // Particules
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Lignes de profondeur lentes (effet eau)
    if (frame % 3 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.025;
      for (let i = 0; i < 3; i++) {
        const yPos = ((frame * 0.15 + i * (H / 3)) % H);
        const grad2 = ctx.createLinearGradient(0, yPos, W, yPos);
        grad2.addColorStop(0, 'transparent');
        grad2.addColorStop(0.3, 'rgba(80,100,200,0.3)');
        grad2.addColorStop(0.7, 'rgba(80,100,200,0.3)');
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, yPos, W, 1.5);
      }
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', function () {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  animate();
})();


// ── NAVIGATION : SCROLL EFFECT ──────────────────────────────
(function () {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();


// ── NAVIGATION : LIEN ACTIF ──────────────────────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActive() {
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


// ── NAVIGATION : HAMBURGER MENU ──────────────────────────────
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer en cliquant un lien
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


// ── REVEAL ON SCROLL ─────────────────────────────────────────
(function () {
  const revealEls = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // délai en cascade pour les enfants d'une grille
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 80) + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { io.observe(el); });
})();


// ── LISSAGE DU SCROLL (clic sur nav) ─────────────────────────
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
