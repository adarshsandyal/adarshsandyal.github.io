/* =============================================
   SCRIPT.JS — Portfolio Interactions & Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. PARTICLE CANVAS BACKGROUND
  // ============================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(139, 92, 246, ${this.opacity})`
        : `rgba(6, 182, 212, ${this.opacity})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });


  // ============================================
  // 2. NAVBAR SCROLL BEHAVIOR
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }


  // ============================================
  // 3. HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });

  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinksContainer.classList.remove('open'));
  });


  // ============================================
  // 4. TYPEWRITER EFFECT
  // ============================================
  const typewriterEl = document.getElementById('typewriter');
  const roles = [
    'Business Analyst',
    'Supply Chain Analytics Expert',
    'SQL & Python Developer',
    'Data & BI Specialist',
    'Aspiring Data Scientist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typewrite() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typewrite, 2000);
        return;
      }
    } else {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 60 : 100;
    setTimeout(typewrite, speed);
  }

  typewrite();


  // ============================================
  // 5. INTERSECTION OBSERVER — Scroll Reveals
  // ============================================
  const revealEls = document.querySelectorAll(
    '.skill-category, .timeline-card, .project-card, .highlight-card, .contact-card, .about-info-card, .edu-card'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ============================================
  // 6. SKILL BAR ANIMATION
  // ============================================
  const skillBarFills = document.querySelectorAll('.skill-bar-fill');

  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.getAttribute('data-width') + '%';
        skillBarObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  skillBarFills.forEach(bar => skillBarObserver.observe(bar));


  // ============================================
  // 7. CONTACT FORM SUBMIT
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitContactBtn');
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      setTimeout(() => {
        formSuccess.classList.add('visible');
        contactForm.reset();
        btn.innerHTML = `<span>Send Message</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>`;
        btn.disabled = false;
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1200);
    });
  }


  // ============================================
  // 8. SMOOTH SCROLL + OFFSET FOR FIXED NAV
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ============================================
  // 9. AVATAR FALLBACK (if image fails to load)
  // ============================================
  const avatarImg = document.getElementById('avatarImg');
  if (avatarImg) {
    avatarImg.addEventListener('error', () => {
      avatarImg.style.display = 'none';
      const container = avatarImg.parentElement;
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.fontSize = '6rem';
      container.innerHTML = '<span>👨‍💻</span>';
    });
  }


  // ============================================
  // 10. CURSOR GLOW EFFECT (desktop only)
  // ============================================
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }


  // ============================================
  // 11. STATS COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let count = 0;
        const step = target / 40;
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = Math.round(count) + suffix;
          if (count >= target) clearInterval(interval);
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 1 });

  statNumbers.forEach(el => counterObserver.observe(el));

});
