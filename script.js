/* =============================================
   SCRIPT.JS - Portfolio Interactions & Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // THEME ENGINE (System Preference & Manual Toggle)
  // ============================================
  const themeToggle = document.getElementById('themeToggle');

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function applyTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('theme', theme);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = getCurrentTheme();
      const target = current === 'light' ? 'dark' : 'light';
      applyTheme(target, true);
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }


  // ============================================
  // 1. PARTICLE CANVAS BACKGROUND (Data Nodes & Glyphs)
  // ============================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 75;
  const DATA_GLYPHS = ['Σ', 'SQL', 'pd', 'AVG()', '42', '101', 'JOIN', 'CTE', 'NaN', 'λ', 'df', 'KPI'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.isGlyph = Math.random() < 0.22;
      this.glyph = DATA_GLYPHS[Math.floor(Math.random() * DATA_GLYPHS.length)];
      this.size = this.isGlyph ? (Math.random() * 2 + 10) : (Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.isFlame = Math.random() < 0.35;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      const light = isLightTheme();
      if (this.isGlyph) {
        ctx.font = `600 ${this.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = light
          ? `rgba(9, 9, 11, ${this.opacity * 0.45})`
          : `rgba(255, 255, 255, ${this.opacity * 0.55})`;
        ctx.fillText(this.glyph, this.x, this.y);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = light
          ? `rgba(9, 9, 11, ${this.opacity * 0.35})`
          : `rgba(255, 255, 255, ${this.opacity * 0.6})`;
        ctx.fill();
      }
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const light = isLightTheme();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 95) {
          ctx.beginPath();
          ctx.strokeStyle = light
            ? `rgba(9, 9, 11, ${0.05 * (1 - dist / 95)})`
            : `rgba(255, 255, 255, ${0.08 * (1 - dist / 95)})`;
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
    'SQL Whisperer & Query Crafter',
    'Supply Chain Optimizer',
    'Data & BI Specialist',
    'Machine Learning Practitioner',
    'Sub-22-Min 5K Runner 🏃‍♂️',
    'Coffee-to-Insights Converter ☕'
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
  // 5. INTERSECTION OBSERVER - Scroll Reveals
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
  // 7. CONTACT FORM SUBMIT (Web3Forms)
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitContactBtn');
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          formSuccess.classList.add('visible');
          formSuccess.textContent = "✅ Message sent! I'll get back to you shortly.";
          contactForm.reset();
        } else {
          formSuccess.classList.add('visible');
          formSuccess.style.color = '#f87171';
          formSuccess.textContent = "❌ Something went wrong. Please try again.";
        }
      } catch (error) {
        formSuccess.classList.add('visible');
        formSuccess.style.color = '#f87171';
        formSuccess.textContent = "❌ Network error. Please try again later.";
      } finally {
        btn.innerHTML = `<span>Send Message</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>`;
        btn.disabled = false;
        setTimeout(() => {
          formSuccess.classList.remove('visible');
          formSuccess.style.color = ''; // reset color
        }, 5000);
      }
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
  const statNumbers = document.querySelectorAll('.stat-number:not(#visitCounter)');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^([^\d]*)(\d+)(.*)$/);
        if (match) {
          const prefix = match[1] || '';
          const target = parseInt(match[2], 10);
          const suffix = match[3] || '';
          let count = 0;
          const steps = 30;
          const step = Math.max(1, Math.ceil(target / steps));
          const interval = setInterval(() => {
            count = Math.min(count + step, target);
            el.textContent = `${prefix}${count}${suffix}`;
            if (count >= target) {
              el.textContent = text;
              clearInterval(interval);
            }
          }, 35);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  statNumbers.forEach(el => counterObserver.observe(el));


  // ============================================
  // 12. PROFILE VISIT COUNTER (Live API)
  // ============================================
  const visitCounterEl = document.getElementById('visitCounter');

  if (visitCounterEl) {
    // Use a unique key for your portfolio
    const counterKey = 'adarsh-sandyal-portfolio-visits';
    const apiUrl = `https://countapi.mileshilliard.com/api/v1/hit/${counterKey}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const count = data.value || data.count || 0;
        // Animate the counter
        let current = 0;
        const step = Math.max(1, Math.floor(count / 50));
        const interval = setInterval(() => {
          current = Math.min(current + step, count);
          visitCounterEl.textContent = current.toLocaleString();
          if (current >= count) {
            visitCounterEl.textContent = count.toLocaleString();
            clearInterval(interval);
          }
        }, 20);
      })
      .catch(() => {
        // Fallback: use localStorage as a simple counter
        let localCount = parseInt(localStorage.getItem('portfolio_visits') || '0', 10);
        localCount++;
        localStorage.setItem('portfolio_visits', localCount.toString());
        visitCounterEl.textContent = localCount.toLocaleString();
      });
  }


  // ============================================
  // 13. CERTIFICATIONS FILTER (Ticker Highlight & Dim)
  // ============================================
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.ticker-cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      certCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all') {
          card.classList.remove('filtered-dim', 'filtered-match');
        } else if (cat === filter) {
          card.classList.remove('filtered-dim');
          card.classList.add('filtered-match');
        } else {
          card.classList.add('filtered-dim');
          card.classList.remove('filtered-match');
        }
      });
    });
  });

  // ============================================
  // 14. INTERACTIVE SQL CONSOLE
  // ============================================
  const queryPills = document.querySelectorAll('.query-pill');
  const sqlDisplay = document.getElementById('sqlDisplay');
  const runQueryBtn = document.getElementById('runQueryBtn');
  const outputTableWrap = document.getElementById('outputTableWrap');
  const outputRows = document.getElementById('outputRows');
  const outputTime = document.getElementById('outputTime');
  const queryStatus = document.getElementById('statusText');

  const queryPresets = {
    impact: {
      sql: `<span class="sql-keyword">SELECT</span> metric, organization, business_impact, status\n<span class="sql-keyword">FROM</span> analytics_portfolio.impact_summary\n<span class="sql-keyword">WHERE</span> candidate = <span class="sql-string">'Adarsh Sandyal'</span>\n<span class="sql-keyword">ORDER BY</span> business_value <span class="sql-keyword">DESC</span>;`,
      time: '0.038s',
      rows: '3 rows',
      headers: ['Metric', 'Organization', 'Business Impact', 'Status'],
      data: [
        ['Store Performance Model', 'Third Wave Coffee', 'Established monthly percentile targets for ~200 cafes', 'Production'],
        ['Customer Retention Lift', 'Swiggy Instamart', '+10% retention via targeted offer recommendation matrix', 'Validated'],
        ['Automated Inventory Pipeline', 'Third Wave Coffee', 'Daily automated SQL/Python ETL with 99.9% uptime', 'Active']
      ]
    },
    stack: {
      sql: `<span class="sql-keyword">SELECT</span> tool, domain, proficiency, signature_skill\n<span class="sql-keyword">FROM</span> candidate_skills\n<span class="sql-keyword">WHERE</span> proficiency >= <span class="sql-num">80</span>\n<span class="sql-keyword">ORDER BY</span> proficiency <span class="sql-keyword">DESC</span>;`,
      time: '0.024s',
      rows: '4 rows',
      headers: ['Tool', 'Domain', 'Proficiency', 'Signature Skill'],
      data: [
        ['Advanced Excel / Sheets', 'Analytics & Modeling', '95%', 'Complex financial models & automated VBA'],
        ['SQL / SnowSQL', 'Data Engineering', '90%', 'Window functions, CTEs & query indexing'],
        ['Power BI / Tableau', 'Business Intelligence', '85%', 'Executive KPI dashboards with drill-downs'],
        ['Python / Pandas', 'Data Science & ML', '80%', 'EDA, statistical tests & ML pipelines']
      ]
    },
    running: {
      sql: `<span class="sql-keyword">SELECT</span> race_event, distance, finish_time, percentile_rank\n<span class="sql-keyword">FROM</span> runner_telemetry\n<span class="sql-keyword">WHERE</span> runner = <span class="sql-string">'Adarsh Sandyal'</span>\n<span class="sql-keyword">ORDER BY</span> pace_sec_per_km <span class="sql-keyword">ASC</span>;`,
      time: '0.019s',
      rows: '3 rows',
      headers: ['Race Event', 'Distance', 'Chip Time', 'Rank / Percentile'],
      data: [
        ['Run for Rajiv 2026', '5K', '21:46', 'Rank #91 of 2,543 (Top 4%)'],
        ['JSW Steel City Run', '10K', '46:46', 'Personal Best (4:40 min/km)'],
        ['Kempegowda Run', '10K', '47:04', 'Finish Time Verified']
      ]
    },
    vitals: {
      sql: `<span class="sql-keyword">SELECT</span> vitals_key, observed_value, unit, analyst_remark\n<span class="sql-keyword">FROM</span> adarsh_daily_telemetry\n<span class="sql-keyword">GROUP BY</span> <span class="sql-num">1</span>, <span class="sql-num">2</span>, <span class="sql-num">3</span>, <span class="sql-num">4</span>;`,
      time: '0.012s',
      rows: '4 rows',
      headers: ['Telemetry Key', 'Observed Value', 'Unit', 'Analyst Remark'],
      data: [
        ['Coffee-to-Query Ratio', '3.4', 'cups / day', 'Third Wave Roasts preferred'],
        ['Null Value Tolerance', '0.00', '% tolerance', 'Extreme prejudice against dirty joins'],
        ['Favorite SQL Keyword', 'QUALIFY / CTE', 'syntax', 'Window functions are pure poetry'],
        ['Career Trajectory', 'Exponential', 'growth', 'Open to high-impact opportunities']
      ]
    }
  };

  let currentPresetKey = 'impact';

  function renderEmptyState(presetKey) {
    const preset = queryPresets[presetKey];
    if (!preset) return;

    if (sqlDisplay) sqlDisplay.innerHTML = preset.sql;
    if (outputRows) outputRows.textContent = '0 rows';
    if (outputTime) outputTime.textContent = '0.000s';
    const statusTextEl = document.getElementById('statusText');
    if (statusTextEl) statusTextEl.textContent = 'Query staged · Ready to execute';

    const statusBadge = document.getElementById('outputBadgeStatus');
    if (statusBadge) statusBadge.textContent = 'Ready to Run';

    if (outputTableWrap) {
      outputTableWrap.innerHTML = `
        <div class="console-empty-state">
          <div class="empty-icon">⚡</div>
          <div class="empty-title">Query Ready to Execute</div>
          <p class="empty-desc">Click <strong class="highlight-run">▶ Run Query</strong> or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to compile and execute against <code>snowflake://analytics_dw</code></p>
        </div>
      `;
    }
  }

  function executeQuery(presetKey) {
    const preset = queryPresets[presetKey];
    if (!preset || !outputTableWrap) return;

    // Show loading state
    if (runQueryBtn) {
      runQueryBtn.disabled = true;
      runQueryBtn.innerHTML = `
        <span class="sql-loader-spinner" style="width: 14px; height: 14px; border-width: 2px;"></span>
        <span>Running...</span>
      `;
    }

    const statusTextEl = document.getElementById('statusText');
    if (statusTextEl) statusTextEl.textContent = 'Querying partition on COMPUTE_WH...';

    outputTableWrap.innerHTML = `
      <div class="console-loading-state">
        <div class="sql-loader-spinner"></div>
        <div class="loading-msg">Executing query across partitions on Snowflake DW...</div>
        <div class="loading-submsg">Parsing AST & verifying data integrity (0 warnings)</div>
      </div>
    `;

    setTimeout(() => {
      if (sqlDisplay) sqlDisplay.innerHTML = preset.sql;
      if (outputTime) outputTime.textContent = preset.time;
      if (outputRows) outputRows.textContent = preset.rows;
      if (statusTextEl) statusTextEl.textContent = `Completed in ${preset.time} · 0 warnings · 0 NULLs`;

      const statusBadge = document.getElementById('outputBadgeStatus');
      if (statusBadge) statusBadge.textContent = '✓ 100% Precision';

      let tableHtml = '<table class="console-table"><thead><tr>';
      preset.headers.forEach(h => {
        tableHtml += `<th>${h}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      preset.data.forEach(row => {
        tableHtml += '<tr>';
        row.forEach((cell, idx) => {
          if (idx === row.length - 1) {
            tableHtml += `<td><span class="table-tag">${cell}</span></td>`;
          } else {
            tableHtml += `<td>${cell}</td>`;
          }
        });
        tableHtml += '</tr>';
      });

      tableHtml += '</tbody></table>';
      outputTableWrap.innerHTML = tableHtml;

      if (runQueryBtn) {
        runQueryBtn.disabled = false;
        runQueryBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Run Query</span>
        `;
      }
    }, 380);
  }

  queryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      queryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPresetKey = pill.getAttribute('data-query');
      renderEmptyState(currentPresetKey);
    });
  });

  if (runQueryBtn) {
    runQueryBtn.addEventListener('click', () => {
      executeQuery(currentPresetKey);
    });
  }

  // Ctrl + Enter shortcut support
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const consoleCard = document.querySelector('.sql-console-card');
      if (consoleCard) {
        executeQuery(currentPresetKey);
      }
    }
  });

  // Initial staged render (NO results table until Run Query is clicked!)
  renderEmptyState('impact');

  // ============================================
  // GLASSMORPHISM PROFILE CARD INTERACTIONS
  // ============================================
  const glassClockEl = document.getElementById('glassClockTime');
  function updateGlassClock() {
    if (!glassClockEl) return;
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const hour12 = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? 'PM' : 'AM';
    glassClockEl.textContent = `${hour12}:${m} ${ampm}`;
  }
  updateGlassClock();
  setInterval(updateGlassClock, 60000);

  const heroCopyBtn = document.getElementById('heroCopyEmailBtn');
  const heroCopyLabel = document.getElementById('heroCopyBtnLabel');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('adarshsandyal@gmail.com');
        heroCopyBtn.classList.add('copied');
        if (heroCopyLabel) heroCopyLabel.textContent = 'Copied!';
        setTimeout(() => {
          heroCopyBtn.classList.remove('copied');
          if (heroCopyLabel) heroCopyLabel.textContent = 'Copy Email';
        }, 1500);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = 'adarshsandyal@gmail.com';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        heroCopyBtn.classList.add('copied');
        if (heroCopyLabel) heroCopyLabel.textContent = 'Copied!';
        setTimeout(() => {
          heroCopyBtn.classList.remove('copied');
          if (heroCopyLabel) heroCopyLabel.textContent = 'Copy Email';
        }, 1500);
      }
    });
  }

  // ============================================
  // UNIVERSAL TICKER CONTROLS & INTERACTIONS
  // ============================================
  function setupTickerControls({ toggleId, prevId, nextId, trackSelector, viewportSelector, step = 340 }) {
    const toggleBtn = document.getElementById(toggleId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const viewports = document.querySelectorAll(viewportSelector);

    if (toggleBtn) {
      const pauseIcon = toggleBtn.querySelector('.icon-pause');
      const playIcon = toggleBtn.querySelector('.icon-play');

      toggleBtn.addEventListener('click', () => {
        const tracks = document.querySelectorAll(trackSelector);
        let anyPaused = false;
        tracks.forEach(track => {
          anyPaused = track.classList.toggle('is-paused');
        });
        if (pauseIcon && playIcon) {
          pauseIcon.style.display = anyPaused ? 'none' : 'block';
          playIcon.style.display = anyPaused ? 'block' : 'none';
        }
      });
    }

    if (prevBtn && viewports.length > 0) {
      prevBtn.addEventListener('click', () => {
        viewports.forEach(vp => vp.scrollBy({ left: -step, behavior: 'smooth' }));
      });
    }

    if (nextBtn && viewports.length > 0) {
      nextBtn.addEventListener('click', () => {
        viewports.forEach(vp => vp.scrollBy({ left: step, behavior: 'smooth' }));
      });
    }
  }

  // 1. Featured Projects Ticker
  setupTickerControls({
    toggleId: 'projTickerToggle',
    prevId: 'projTickerPrev',
    nextId: 'projTickerNext',
    trackSelector: '#projectsTickerTrack',
    viewportSelector: '#projectsTickerViewport',
    step: 380
  });

  // 2. Skills & Tech Stack Ticker
  setupTickerControls({
    toggleId: 'skillsTickerToggle',
    prevId: 'skillsTickerPrev',
    nextId: 'skillsTickerNext',
    trackSelector: '#skillsTickerTrack',
    viewportSelector: '#skillsTickerViewport',
    step: 330
  });

  // 3. Certifications Ticker (dual-lane)
  setupTickerControls({
    toggleId: 'certsTickerToggle',
    prevId: 'certsTickerPrev',
    nextId: 'certsTickerNext',
    trackSelector: '.certs-ticker-track.lane-scroll-left, .certs-ticker-track.lane-scroll-right',
    viewportSelector: '.certs-lane-viewport',
    step: 310
  });

  // 4. Running Race Ticker
  setupTickerControls({
    toggleId: 'runTickerToggle',
    prevId: 'runTickerPrev',
    nextId: 'runTickerNext',
    trackSelector: '#runningTrack',
    viewportSelector: '#runningLaneViewport',
    step: 320
  });

});
