(() => {
  const canvas = document.getElementById('analytics-hero-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let visible = false;
  let gridPath = new Path2D();
  let particles = [];
  let pointer = { x: 0, y: 0, active: false };

  const isMobile = () => window.innerWidth < 768;
  const particleCount = () => isMobile() ? 20 : Math.min(44, Math.max(34, Math.round(window.innerWidth / 42)));
  const connectionDistance = () => isMobile() ? 130 : 180;
  const frameInterval = () => isMobile() ? 42 : 33; // ~24fps mobile, ~30fps desktop

  const glowSprite = document.createElement('canvas');
  const glowCtx = glowSprite.getContext('2d');
  glowSprite.width = 80;
  glowSprite.height = 80;
  if (glowCtx) {
    const gradient = glowCtx.createRadialGradient(40, 40, 1, 40, 40, 39);
    gradient.addColorStop(0, 'rgba(0,173,132,.95)');
    gradient.addColorStop(.18, 'rgba(0,173,132,.55)');
    gradient.addColorStop(.55, 'rgba(0,173,132,.13)');
    gradient.addColorStop(1, 'rgba(0,173,132,0)');
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 80, 80);
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.58,
      vy: (Math.random() - 0.5) * 0.58,
      size: 2.5 + Math.random() * 4.5,
      opacity: 0.28 + Math.random() * 0.52,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function resetParticles() {
    particles = Array.from({ length: particleCount() }, makeParticle);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const oldWidth = width || rect.width;
    const oldHeight = height || rect.height;
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1 : 1.35);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Grid geometry changes only with canvas size or breakpoint.
    gridPath = new Path2D();
    const grid = isMobile() ? 56 : 60;
    for (let x = 0; x < width; x += grid) { gridPath.moveTo(x, 0); gridPath.lineTo(x, height); }
    for (let y = 0; y < height; y += grid) { gridPath.moveTo(0, y); gridPath.lineTo(width, y); }

    if (!particles.length || particles.length !== particleCount()) {
      resetParticles();
    } else if (oldWidth && oldHeight) {
      const sx = width / oldWidth;
      const sy = height / oldHeight;
      particles.forEach((p) => { p.x *= sx; p.y *= sy; });
    }
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,173,132,0.05)';
    ctx.lineWidth = 1;
    ctx.stroke(gridPath);
    ctx.restore();
  }

  function updateParticles(dt) {
    const scale = Math.min(1.8, dt / 33);
    for (const p of particles) {
      const driftX = Math.sin(elapsed * 0.0005 + p.phase) * 0.30;
      const driftY = Math.cos(elapsed * 0.0004 + p.phase) * 0.30;
      p.x += (p.vx + driftX) * scale;
      p.y += (p.vy + driftY) * scale;

      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 52000 && dist2 > 100) {
          const influence = 0.0035 * (1 - Math.sqrt(dist2) / 228);
          p.vx += dx * influence * scale;
          p.vy += dy * influence * scale;
        }
      }

      p.vx += (Math.random() - 0.5) * 0.012;
      p.vy += (Math.random() - 0.5) * 0.012;
      p.vx *= 0.992;
      p.vy *= 0.992;

      const speed = Math.hypot(p.vx, p.vy);
      const maxSpeed = isMobile() ? 0.75 : 1.05;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }
  }

  function drawConnections() {
    const maxDist = connectionDistance();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist) {
          const opacity = 0.24 * (1 - dist / maxDist);
          ctx.strokeStyle = `rgba(0,173,132,${opacity})`;
          ctx.lineWidth = isMobile() ? 0.8 : 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    if (pointer.active && !isMobile()) {
      for (const p of particles) {
        const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (dist < 210) {
          ctx.strokeStyle = `rgba(0,173,132,${0.18 * (1 - dist / 210)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const pulse = 0.86 + 0.14 * Math.sin(elapsed * 0.0027 + p.phase);
      const core = p.size * pulse;
      const glowSize = Math.max(26, core * 9);
      ctx.globalAlpha = Math.min(0.9, p.opacity * (0.72 + 0.28 * Math.sin(elapsed * 0.002 + p.phase)));
      ctx.drawImage(glowSprite, p.x - glowSize / 2, p.y - glowSize / 2, glowSize, glowSize);
      ctx.beginPath();
      ctx.arc(p.x, p.y, core, 0, Math.PI * 2);
      ctx.fillStyle = '#00AD84';
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function draw(time) {
    animationFrame = 0;
    if (!visible || document.hidden || motion.matches) return;
    animationFrame = requestAnimationFrame(draw);
    if (time - lastFrame < frameInterval()) return;
    const dt = lastFrame ? time - lastFrame : 33;
    lastFrame = time;
    elapsed = time;

    ctx.clearRect(0, 0, width, height);
    drawGrid();
    updateParticles(dt);
    drawConnections();
    drawParticles();
  }

  const onPointerMove = (event) => {
    if (isMobile()) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
  };
  const onPointerLeave = () => { pointer.active = false; };

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  function syncAnimation() {
    const shouldRun = visible && !document.hidden && !motion.matches;
    if (!shouldRun) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrame = 0;
      pointer.active = false;
      if (motion.matches) ctx.clearRect(0, 0, width, height);
    } else if (!animationFrame) {
      lastFrame = 0;
      animationFrame = requestAnimationFrame(draw);
    }
  }
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });
  visibility.observe(canvas);
  document.addEventListener('visibilitychange', syncAnimation);
  motion.addEventListener('change', syncAnimation);
  window.addEventListener('pagehide', () => { visible = false; syncAnimation(); });
  window.addEventListener('pageshow', () => {
    const rect = canvas.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < window.innerHeight;
    syncAnimation();
  });
})();
