(() => {
  const progress = document.querySelector('#progress');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('mobile-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('mobile-open');
  }));

  const canvas = document.querySelector('#starfield');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  let stars = [];
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(150, Math.floor(window.innerWidth / 8));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + .2,
      a: Math.random() * .8 + .15,
      tw: Math.random() * .02 + .003
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((star) => {
      star.a += (Math.random() - .5) * star.tw;
      star.a = Math.max(.1, Math.min(1, star.a));
      ctx.beginPath();
      ctx.fillStyle = `rgba(215, 226, 232, ${star.a})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  window.addEventListener('resize', resize);
  resize();
  draw();
})();
