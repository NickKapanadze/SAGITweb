// loading.js
// Newton's Cradle loading animation (non-interactive).
// Exposes window.NewtonCradleLoading with init(canvasOrId, options), start(), stop(), setThemeIndex(), getConfig()

(function () {
  'use strict';

  // Default configuration - easy to override via init options
  const DEFAULT_CONFIG = {
    N: 5,
    radius: 14,
    spacing: null, // computed: radius*2 + 2 if null
    stringLength: 120,
    g: 980,
    damping: 0.9995,
    dprAware: true,
    themes: [
      { name: 'Monochrome', bg:'#ffffff', bar:'#ddd', string:'#bbb', ball:'#111', highlight:'rgba(255,255,255,0.08)' },
      { name: 'Ocean',      bg:'#e9f7fb', bar:'#b8e0ef', string:'#8fc7dd', ball:'#07698b', highlight:'rgba(255,255,255,0.12)' },
      { name: 'Warm',       bg:'#fff6f0', bar:'#ffd9c7', string:'#ffb085', ball:'#b33a00', highlight:'rgba(255,255,255,0.12)' }
    ],
    initialTheme: 0,
    autoLoopEnergyThreshold: 10,
    autoNudgeIntervalMin: 450,
    autoNudgeIntervalMax: 1200,
    maxWidth: 900,
    maxHeight: 520
  };

  // Internal state
  let canvas = null;
  let ctx = null;
  let config = null;
  let dpr = 1;
  let pivots = [];
  let balls = []; // {pivotX, pivotY, angle, aVel, length, r}
  let currentColors = null;
  let themeIndex = 0;
  let last = 0;
  let running = false;
  let impulseInProgress = false;
  let autoLoopLastKickSide = 0;
  let lastAutoNudge = 0;
  let rafId = null;

  // Helpers
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function mergeConfig(userCfg) {
    const merged = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    if (!userCfg) return merged;
    for (const k of Object.keys(userCfg)) {
      merged[k] = userCfg[k];
    }
    if (!merged.spacing) merged.spacing = merged.radius * 2 + 2;
    return merged;
  }

  // Resize and layout helpers
  function computeDpr() {
    return (config.dprAware && window.devicePixelRatio) ? window.devicePixelRatio : 1;
  }

  function resizeCanvasToDisplaySize() {
    dpr = computeDpr();
    const cssW = Math.min(window.innerWidth, config.maxWidth);
    const cssH = Math.min(window.innerHeight, config.maxHeight);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    const displayW = Math.floor(cssW * dpr);
    const displayH = Math.floor(cssH * dpr);
    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }
    // scale drawing commands to logical pixels (so we can keep positions in CSS pixels)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Initialize or update pivots while preserving motion state
  function updateLayout(preserveState = true) {
    // Always recompute canvas size
    resizeCanvasToDisplaySize();
    const cw = canvas.width / dpr;
    // const ch = canvas.height / dpr; // not used currently but here if needed
    const cx = cw / 2;
    const startX = cx - ((config.N - 1) * config.spacing) / 2;
    const pivotY = 60;

    if (preserveState && balls.length === config.N) {
      // Update pivot anchors for existing balls, but preserve angle & aVel
      pivots = [];
      for (let i = 0; i < config.N; i++) {
        const px = startX + i * config.spacing;
        pivots.push({ x: px, y: pivotY });
        balls[i].pivotX = px;
        balls[i].pivotY = pivotY;
        balls[i].length = config.stringLength;
        balls[i].r = config.radius;
      }
    } else {
      // fresh initialization
      pivots = [];
      balls = [];
      for (let i = 0; i < config.N; i++) {
        const px = startX + i * config.spacing;
        pivots.push({ x: px, y: pivotY });
        balls.push({
          pivotX: px,
          pivotY: pivotY,
          angle: 0,
          aVel: 0,
          length: config.stringLength,
          r: config.radius
        });
      }
      // initial visual nudge to start motion
      if (balls.length > 0) {
        balls[0].angle = -Math.PI / 3.6;
        balls[0].aVel = 0;
      }
    }
  }

  // Theme
  function applyTheme(idx) {
    themeIndex = ((idx % config.themes.length) + config.themes.length) % config.themes.length;
    currentColors = config.themes[themeIndex];
    if (currentColors && currentColors.bg) {
      // set a CSS var so embedding page can use it if desired
      try { document.documentElement.style.setProperty('--newton-cradle-bg', currentColors.bg); } catch (e) {}
    }
  }

  // Physics
  function integrate(dt) {
    for (let i = 0; i < config.N; i++) {
      const b = balls[i];
      const angAcc = - (config.g / b.length) * Math.sin(b.angle);
      b.aVel += angAcc * dt;
      b.aVel *= Math.pow(config.damping, dt * 60);
      b.angle += b.aVel * dt;
    }
  }

  function computePositions() {
    return balls.map(b => {
      const x = b.pivotX + Math.sin(b.angle) * b.length;
      const y = b.pivotY + Math.cos(b.angle) * b.length;
      const vx = b.aVel * b.length * Math.cos(b.angle);
      return { x, y, vx };
    });
  }

  function handleCollisions() {
    const pos = computePositions();
    for (let i = 0; i < config.N - 1; i++) {
      const a = balls[i], b = balls[i + 1];
      const pa = pos[i], pb = pos[i + 1];
      const minDist = a.r + b.r;
      const dx = pb.x - pa.x;
      const relV = pb.vx - pa.vx;
      if (dx < minDist && relV < 0) {
        // swap horizontal velocities
        const newVxA = pb.vx;
        const newVxB = pa.vx;
        const cosA = Math.max(0.12, Math.cos(a.angle));
        const cosB = Math.max(0.12, Math.cos(b.angle));
        a.aVel = newVxA / (a.length * cosA);
        b.aVel = newVxB / (b.length * cosB);
        // separate them slightly to avoid sticking
        const overlap = minDist - dx;
        const push = overlap / 2 + 0.25;
        a.angle += -push / a.length;
        b.angle += push / b.length;
      }
    }
  }

  function totalEnergy() {
    let E = 0;
    for (let i = 0; i < config.N; i++) {
      const b = balls[i];
      const translationalV = Math.abs(b.aVel * b.length * Math.cos(b.angle));
      const ke = 0.5 * translationalV * translationalV;
      const pe = config.g * b.length * (1 - Math.cos(b.angle));
      E += ke + pe;
    }
    return E;
  }

  // Smooth pull used internally by auto-loop (non-interactive)
  function applySmoothPull(index, targetAngle = Math.PI / 3, pullDuration = 300) {
    if (impulseInProgress) return;
    impulseInProgress = true;
    const b = balls[index];
    const startAngle = b.angle;
    const startTime = performance.now();

    function tick(now) {
      const t = clamp((now - startTime) / pullDuration, 0, 1);
      // easeOutQuad
      const eased = 1 - (1 - t) * (1 - t);
      b.angle = startAngle + (targetAngle - startAngle) * eased;
      b.aVel = 0;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        b.aVel = 0;
        impulseInProgress = false;
      }
    }
    requestAnimationFrame(tick);
  }

  function maybeAutoLoop(now) {
    if (impulseInProgress) return;
    const E = totalEnergy();
    if (E < config.autoLoopEnergyThreshold) {
      const since = now - lastAutoNudge;
      const nextInterval = config.autoNudgeIntervalMin + Math.random() * (config.autoNudgeIntervalMax - config.autoNudgeIntervalMin);
      if (since > nextInterval) {
        const sideIndex = (autoLoopLastKickSide === 0) ? 0 : config.N - 1;
        autoLoopLastKickSide = 1 - autoLoopLastKickSide;
        const dir = (sideIndex === 0) ? -1 : 1;
        applySmoothPull(sideIndex, dir * (Math.PI / 4.2), 300);
        lastAutoNudge = now;
      }
    }
  }

  // Drawing
  function draw() {
    const cw = canvas.width / dpr;
    //const ch = canvas.height / dpr;
    ctx.clearRect(0, 0, cw, canvas.height / dpr);

    const colors = currentColors;
    // top bar
    ctx.strokeStyle = colors.bar;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const leftMost = pivots[0].x - 30;
    const rightMost = pivots[config.N - 1].x + 30;
    ctx.moveTo(leftMost, pivots[0].y - 18);
    ctx.lineTo(rightMost, pivots[0].y - 18);
    ctx.stroke();

    for (let i = 0; i < config.N; i++) {
      const b = balls[i];
      const x = b.pivotX + Math.sin(b.angle) * b.length;
      const y = b.pivotY + Math.cos(b.angle) * b.length;

      // string
      ctx.strokeStyle = colors.string;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(b.pivotX, b.pivotY - 18);
      ctx.lineTo(x, y);
      ctx.stroke();

      // ball
      ctx.fillStyle = colors.ball;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fill();

      // highlight
      ctx.fillStyle = colors.highlight;
      ctx.beginPath();
      ctx.ellipse(x - b.r * 0.35, y - b.r * 0.35, b.r * 0.35, b.r * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Main loop
  function step(now) {
    if (!running) return;
    if (!last) last = now;
    const dt = clamp((now - last) / 1000, 0.0005, 0.03);
    last = now;

    integrate(dt);
    handleCollisions();
    draw();
    maybeAutoLoop(now);

    rafId = requestAnimationFrame(step);
  }

  // Public API: init(canvasOrId, userOptions)
  function init(canvasOrId, userOptions) {
    // Resolve canvas
    if (typeof canvasOrId === 'string') {
      canvas = document.getElementById(canvasOrId);
    } else {
      canvas = canvasOrId;
    }
    if (!canvas || !canvas.getContext) {
      throw new Error('Canvas element not found or unsupported');
    }
    ctx = canvas.getContext('2d');

    // Merge config
    config = mergeConfig(userOptions);
    if (!config.spacing) config.spacing = config.radius * 2 + 2;

    // apply theme
    applyTheme(config.initialTheme);

    // prepare layout (first call builds balls)
    updateLayout(false);

    // listen for resize but preserve animation state on resize
    window.removeEventListener('resize', onWindowResize);
    window.addEventListener('resize', onWindowResize, { passive: true });

    // ensure background variable set
    if (currentColors && currentColors.bg) {
      try { document.documentElement.style.setProperty('--newton-cradle-bg', currentColors.bg); } catch (e) {}
    }

    // don't auto-start; user may want to call start()
    return {
      start,
      stop,
      setThemeIndex,
      getConfig: () => Object.assign({}, config),
      redraw: () => { draw(); }
    };
  }

  function onWindowResize() {
    // preserve angles/velocities
    updateLayout(true);
    // redraw at least once after resize so it doesn't look stale; don't restart physics
    draw();
  }

  function start() {
    if (!canvas || !ctx) {
      throw new Error('Call init(canvas, options) before start()');
    }
    if (running) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function setThemeIndex(i) {
    applyTheme(i);
    draw();
  }

  // Expose a minimal API in a single global
  window.NewtonCradleLoading = {
    init,
    start,
    stop,
    setThemeIndex,
    // For integrators who want to tweak config at runtime:
    _internal: {
      getBalls: () => balls,
      getPivots: () => pivots
    }
  };
})();