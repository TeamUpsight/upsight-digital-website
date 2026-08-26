(() => {
  const canvas = document.getElementById('analytics-hero-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (!window.matchMedia('(min-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let last = 0;
  const particles = Array.from({ length: 20 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00028,
    vy: (Math.random() - 0.5) * 0.00028,
    size: 2 + Math.random() * 2.5,
  }));

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (time) => {
    frame = requestAnimationFrame(draw);
    if (document.hidden || time - last < 33) return;
    last = time;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0,173,132,0.045)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 72) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 72) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      const px = p.x * width; const py = p.y * height;

      ctx.fillStyle = 'rgba(0,173,132,0.55)';
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const qx = q.x * width; const qy = q.y * height;
        const dx = px - qx; const dy = py - qy;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(0,173,132,${0.16 * (1 - dist / 150)})`;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
        }
      }
    }
  };

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  frame = requestAnimationFrame(draw);

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  }, { once: true });
})();
