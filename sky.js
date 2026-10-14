// The night sky behind the pages, as the app draws it: far-off stars that
// twinkle, and one in six a golden four-pointed sparkle. Still for anyone
// who asked their device for less motion.
(() => {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fixed positions, so the sky is the same every time.
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const stars = Array.from({ length: 90 }, (_, i) => ({
    x: random(),
    y: random(),
    r: 0.6 + random() * 1.3,
    phase: random(),
    gold: i % 6 === 0,
  }));

  const sparkle = (x, y, r) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const d = i % 2 === 0 ? r : r * 0.34;
      const px = x + Math.cos(angle) * d;
      const py = y + Math.sin(angle) * d;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  let w = 0;
  let h = 0;
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, w, h);
    const t = still ? 0 : time / 9000;
    for (const s of stars) {
      const wave = Math.sin((t + s.phase) * 2 * Math.PI);
      if (s.gold) {
        ctx.fillStyle = `rgba(255, 215, 120, ${0.55 + 0.3 * wave})`;
        sparkle(s.x * w, s.y * h, 3.2 + s.r * 2.2);
      } else {
        ctx.fillStyle = `rgba(237, 235, 255, ${0.3 + 0.22 * wave})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (!still) requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', () => {
    resize();
    if (still) draw(0);
  });
  requestAnimationFrame(draw);
})();
