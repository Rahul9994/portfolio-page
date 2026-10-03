/* ==========================================================================
   Rahul Penugonda — Portfolio interactions
   ========================================================================== */
(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const LITE = root.dataset.perf === "lite"; // phones & low-power devices (decided in <head>)
  const isSmall = () => innerWidth < 720;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };

  /* ------------------------------------------------------------------------
     Icons
     ------------------------------------------------------------------------ */
  const FILLED = {
    github: '<path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>',
    linkedin: '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/>',
  };
  const STROKE = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3v.2A3 3 0 0 0 4 10a3 3 0 0 0 1 2.2A3 3 0 0 0 6 17a3 3 0 0 0 3 3 3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z"/><path d="M15 4a3 3 0 0 1 3 3v.2a3 3 0 0 1 2 2.8 3 3 0 0 1-1 2.2 3 3 0 0 1-1 4.8 3 3 0 0 1-3 3 3 3 0 0 1-3-3"/><path d="M12 7a3 3 0 0 1 3-3"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
    cloud: '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 9.5 4.5 4.5 0 0 1 17.5 18H7Z"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    network: '<rect x="9" y="2.5" width="6" height="5" rx="1"/><rect x="2.5" y="16.5" width="6" height="5" rx="1"/><rect x="15.5" y="16.5" width="6" height="5" rx="1"/><path d="M12 7.5v4.5M5.5 16.5V14h13v2.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    fork: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 11v6"/>',
    robot: '<rect x="4.5" y="8" width="15" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5M2 12v3M22 12v3"/><circle cx="12" cy="3" r="1"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>',
  };
  function icon(name, cls = "") {
    if (FILLED[name]) return `<svg viewBox="0 0 24 24" class="${cls}" fill="currentColor" aria-hidden="true">${FILLED[name]}</svg>`;
    return `<svg viewBox="0 0 24 24" class="${cls}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${STROKE[name] || ""}</svg>`;
  }

  function hydrateIcons(scope = document) {
    $$("[data-icon]", scope).forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
    $$("[data-social]", scope).forEach((el) => {
      el.innerHTML = [
        ["github", D.links.github, "GitHub"],
        ["linkedin", D.links.linkedin, "LinkedIn"],
        ["mail", "mailto:" + D.links.email, "Email"],
      ].map(([ic, href, label]) =>
        `<a class="icon-btn magnetic" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} aria-label="${label}">${icon(ic)}</a>`
      ).join("");
    });
  }

  /* ------------------------------------------------------------------------
     Smooth scroll (Lenis)
     ------------------------------------------------------------------------ */
  let lenis = null;
  function initSmoothScroll() {
    // phones already scroll natively and smoothly; JS-driven scrolling only adds latency there
    if (window.Lenis && !reduceMotion && !LITE) {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      lenis.stop();
    }
  }
  const lockScroll = (on) => {
    if (lenis) on ? lenis.stop() : lenis.start();
    document.body.style.overflow = on ? "hidden" : "";
  };
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -76, duration: 1.4 });
    else if (target === 0) scrollTo({ top: 0, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = id === "#home" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
    history.replaceState(null, "", id === "#home" ? location.pathname : id);
  });

  /* ------------------------------------------------------------------------
     Boot screen
     ------------------------------------------------------------------------ */
  function runBoot(onDone) {
    const boot = $("#boot");
    const seen = store.sget("rp-booted") === "1";
    const DURATION = reduceMotion ? 400 : seen ? 1300 : 3200;
    const ring = $(".ring-progress", boot);
    const bar = $(".boot-bar span", boot);
    const pct = $(".boot-pct", boot);
    const status = $(".boot-status", boot);
    const log = $(".boot-log", boot);
    const RING = 565.5;
    const lines = [
      ['> boot <span class="acc">rp-portfolio</span> --mode=cinematic', 0.0],
      ['> loading neural cores ........ <span class="ok">[ok]</span>', 0.14],
      ['> calibrating vision pipeline . <span class="ok">[ok]</span>', 0.3],
      ['> mounting secure enclave ..... <span class="ok">[ok]</span>', 0.46],
      [`> syncing ${D.repos.length} repositories ..... <span class="ok">[ok]</span>`, 0.62],
      [`> verifying ${D.certs.length} credentials ..... <span class="ok">[ok]</span>`, 0.76],
      ['> welcome, <span class="acc">visitor</span>.', 0.9],
    ];
    const states = [[0, "INITIALIZING"], [0.25, "LOADING MODULES"], [0.55, "COMPILING UI"], [0.88, "READY"]];
    let shown = 0;
    let done = false;
    const start = performance.now();

    scramble($(".boot-name", boot), seen ? 500 : 1100);

    function frame(now) {
      if (done) return;
      const t = clamp((now - start) / DURATION, 0, 1);
      const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      ring.style.strokeDashoffset = RING * (1 - p);
      bar.style.transform = `scaleX(${p})`;
      pct.textContent = String(Math.round(p * 100)).padStart(3, "0");
      for (let i = states.length - 1; i >= 0; i--) if (p >= states[i][0]) { status.textContent = states[i][1]; break; }
      while (shown < lines.length && t >= lines[shown][1]) {
        const div = document.createElement("div");
        div.innerHTML = lines[shown][0];
        log.appendChild(div);
        while (log.children.length > 4) log.removeChild(log.firstChild);
        shown++;
      }
      if (t >= 1) return finish();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function finish() {
      if (done) return;
      done = true;
      store.sset("rp-booted", "1");
      boot.classList.add("is-leaving");
      document.body.classList.remove("is-booting");
      setTimeout(() => {
        document.body.classList.add("is-ready");
        onDone();
      }, 120);
      setTimeout(() => boot.classList.add("is-gone"), 1300);
      removeEventListener("keydown", onKey);
    }
    const onKey = (e) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish(); };
    addEventListener("keydown", onKey);
    $(".boot-skip", boot).addEventListener("click", finish);
    setTimeout(finish, DURATION + 600); // safety net if rAF is throttled (background tab)
    boot.addEventListener("dblclick", finish);
  }

  function scramble(el, duration) {
    const target = el.dataset.scramble || el.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/";
    const start = performance.now();
    (function step(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const revealed = Math.floor(t * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " " || i < revealed) out += target[i];
        else out += chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    })(start);
  }

  /* ------------------------------------------------------------------------
     Animated background: aurora + constellation
     ------------------------------------------------------------------------ */
  const Background = (() => {
    const aur = $("#aurora");
    const st = $("#stars");
    const actx = aur.getContext("2d");
    const sctx = st.getContext("2d");
    const pointer = { x: innerWidth / 2, y: innerHeight / 3, tx: innerWidth / 2, ty: innerHeight / 3, active: false };
    let W = 0, H = 0, AW = 0, AH = 0, DPR = 1;
    let particles = [];
    let theme = root.dataset.theme;
    let running = true;
    let scrollP = 0;

    const PALETTES = {
      dark: {
        blobs: ["34,211,238", "139,92,246", "244,114,182", "59,130,246", "251,191,36"],
        alpha: [0.44, 0.52, 0.38, 0.36, 0.2],
        star: "255,255,255",
        link: "165,180,252",
        comp: "lighter",
      },
      light: {
        blobs: ["34,211,238", "167,139,250", "244,114,182", "96,165,250", "253,186,116"],
        alpha: [0.5, 0.52, 0.42, 0.45, 0.45],
        star: "79,70,229",
        link: "99,102,241",
        comp: "source-over",
      },
    };

    const blobs = [
      { x: 0.15, y: 0.2, r: 0.55, sx: 0.00011, sy: 0.00013, ax: 0.18, ay: 0.14, ph: 0 },
      { x: 0.82, y: 0.25, r: 0.6, sx: 0.00009, sy: 0.00012, ax: 0.16, ay: 0.18, ph: 2 },
      { x: 0.55, y: 0.85, r: 0.55, sx: 0.00012, sy: 0.0001, ax: 0.22, ay: 0.12, ph: 4 },
      { x: 0.35, y: 0.55, r: 0.45, sx: 0.00014, sy: 0.00009, ax: 0.2, ay: 0.2, ph: 1 },
      { x: 0.7, y: 0.6, r: 0.4, sx: 0.0001, sy: 0.00015, ax: 0.15, ay: 0.16, ph: 3, follow: true },
    ];

    function resize() {
      W = Math.max(1, innerWidth); H = Math.max(1, innerHeight);
      DPR = LITE ? 1 : Math.min(devicePixelRatio || 1, 1.5);
      // aurora renders at very low resolution; CSS upscaling gives a free, silky blur
      AW = Math.max(80, Math.round(W / 7)); AH = Math.max(60, Math.round(H / 7));
      aur.width = AW; aur.height = AH;
      st.width = Math.round(W * DPR); st.height = Math.round(H * DPR);
      sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.round(clamp((W * H) / 16000, LITE ? 18 : 28, LITE ? 30 : isSmall() ? 42 : 95));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.05 - Math.random() * 0.22,
        r: 0.6 + Math.random() * 1.6,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function drawAurora(t) {
      const pal = PALETTES[theme] || PALETTES.dark;
      actx.globalCompositeOperation = "source-over";
      actx.clearRect(0, 0, AW, AH);
      actx.globalCompositeOperation = pal.comp;
      const m = Math.max(AW, AH);
      blobs.forEach((b, i) => {
        let x = (b.x + Math.sin(t * b.sx + b.ph) * b.ax) * AW;
        let y = (b.y + Math.cos(t * b.sy + b.ph) * b.ay - scrollP * 0.25 * (i % 2 ? 1 : -1)) * AH;
        if (b.follow) {
          x = x * 0.55 + (pointer.x / W) * AW * 0.45;
          y = y * 0.55 + (pointer.y / H) * AH * 0.45;
        }
        const r = b.r * m * (1 + Math.sin(t * 0.0004 + i) * 0.08);
        const g = actx.createRadialGradient(x, y, 0, x, y, r);
        const c = pal.blobs[(i + Math.floor(scrollP * 2)) % pal.blobs.length];
        g.addColorStop(0, `rgba(${c},${pal.alpha[i]})`);
        g.addColorStop(0.55, `rgba(${c},${pal.alpha[i] * 0.35})`);
        g.addColorStop(1, `rgba(${c},0)`);
        actx.fillStyle = g;
        actx.fillRect(0, 0, AW, AH);
      });
    }

    function drawStars() {
      const pal = PALETTES[theme] || PALETTES.dark;
      sctx.clearRect(0, 0, W, H);
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const LINK = LITE ? 80 : isSmall() ? 90 : 120;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.tw += 0.03;
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22000) { const f = (1 - d2 / 22000) * 0.6; p.x += (dx / Math.sqrt(d2 + 1)) * f; p.y += (dy / Math.sqrt(d2 + 1)) * f; }
        }
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        const a = 0.35 + Math.sin(p.tw) * 0.3;
        sctx.beginPath();
        sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        sctx.fillStyle = `rgba(${pal.star},${a})`;
        sctx.fill();
      }
      // links are grouped into a few opacity buckets: one stroke() per bucket
      // instead of one per line keeps the canvas cheap
      sctx.lineWidth = 0.8;
      const buckets = [[], [], []];
      const L2 = LINK * LINK;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < L2) buckets[Math.min(2, (d / L2 * 3) | 0)].push(a.x, a.y, b.x, b.y);
        }
        if (pointer.active) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            sctx.strokeStyle = `rgba(${pal.link},${(1 - d / 180) * 0.45})`;
            sctx.beginPath(); sctx.moveTo(a.x, a.y); sctx.lineTo(pointer.x, pointer.y); sctx.stroke();
          }
        }
      }
      buckets.forEach((seg, k) => {
        if (!seg.length) return;
        sctx.strokeStyle = `rgba(${pal.link},${0.2 - k * 0.06})`;
        sctx.beginPath();
        for (let n = 0; n < seg.length; n += 4) { sctx.moveTo(seg[n], seg[n + 1]); sctx.lineTo(seg[n + 2], seg[n + 3]); }
        sctx.stroke();
      });
    }

    // Lite: draw at ~30fps and pause briefly while the user taps or scrolls,
    // so the main thread is free to respond instantly.
    let lastDraw = 0, busyUntil = 0;
    const FRAME = LITE ? 1000 / 30 : 0;
    function loop(t) {
      requestAnimationFrame(loop);
      if (!running || !innerWidth || t < busyUntil || t - lastDraw < FRAME) return;
      lastDraw = t;
      try { drawAurora(t); drawStars(); } catch (e) { resize(); }
    }
    const markBusy = (ms) => { busyUntil = performance.now() + ms; };

    function init() {
      resize();
      let rT;
      addEventListener("resize", () => {
        // mobile browsers fire resize when the URL bar slides in/out during scroll;
        // rebuilding canvases then causes stutter, so ignore small height-only changes
        if (innerWidth === W && Math.abs(innerHeight - H) < 160) return;
        clearTimeout(rT); rT = setTimeout(resize, 150);
      });
      if (LITE) {
        addEventListener("pointerdown", () => markBusy(450), { passive: true, capture: true });
        addEventListener("touchstart", () => markBusy(450), { passive: true, capture: true });
        addEventListener("scroll", () => markBusy(160), { passive: true });
      }
      addEventListener("pointermove", (e) => { pointer.tx = e.clientX; pointer.ty = e.clientY; pointer.active = e.pointerType === "mouse"; }, { passive: true });
      document.addEventListener("pointerleave", () => { pointer.active = false; });
      document.addEventListener("visibilitychange", () => { running = !document.hidden; });
      if (reduceMotion) { drawAurora(0); drawStars(); return; }
      requestAnimationFrame(loop);
    }

    return {
      init,
      setTheme(t) { theme = t; if (reduceMotion) { drawAurora(0); drawStars(); } },
      setScroll(p) { scrollP = p; },
    };
  })();

  /* ------------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------------ */
  function applyTheme(t) {
    root.dataset.theme = t;
    store.set("rp-theme", t);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = t === "light" ? "#f4f5ff" : "#05060f";
    Background.setTheme(t);
  }
  function toggleTheme(originEl) {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    if (!document.startViewTransition || reduceMotion || LITE) return applyTheme(next);
    const r = (originEl || $("#themeToggle")).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => applyTheme(next));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 900, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  }
  $("#themeToggle").addEventListener("click", (e) => toggleTheme(e.currentTarget));
  addEventListener("keydown", (e) => {
    if ((e.key === "t" || e.key === "T") && !e.ctrlKey && !e.metaKey && !e.altKey && !/input|textarea/i.test(e.target.tagName) && document.body.classList.contains("is-ready")) toggleTheme();
  });

  /* ------------------------------------------------------------------------
     Navigation, mobile menu, scroll-driven UI
     ------------------------------------------------------------------------ */
  const nav = $("#nav");
  const menuBtn = $("#menuToggle");
  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    $("#mobileMenu").setAttribute("aria-hidden", "true");
    lockScroll(false);
  }
  menuBtn.addEventListener("click", () => {
    const open = !document.body.classList.contains("menu-open");
    if (!open) return closeMenu();
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    $("#mobileMenu").setAttribute("aria-hidden", "false");
    lockScroll(true);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  function initNavSpy() {
    const links = $$(".nav-links a");
    const indicator = $(".nav-indicator");
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const setActive = (id) => {
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
      const a = map.get(id);
      if (a && indicator) {
        indicator.style.width = a.offsetWidth + "px";
        indicator.style.transform = `translateX(${a.offsetLeft}px)`;
        indicator.style.opacity = "1";
      } else if (indicator) indicator.style.opacity = "0";
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => io.observe(s));
  }

  function initScrollUI() {
    const bar = $(".scroll-progress span");
    const heroCopy = $(".hero-copy");
    const portrait = $("#portrait");
    const timelines = $$("[data-timeline]");
    let lastY = scrollY;
    let ticking = false;

    function update() {
      ticking = false;
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? y / max : 0;
      bar.style.transform = `scaleX(${p})`;
      Background.setScroll(p);

      nav.classList.toggle("is-scrolled", y > 30);
      const hide = y > lastY && y > innerHeight * 0.8 && !document.body.classList.contains("menu-open");
      nav.classList.toggle("is-hidden", hide);
      lastY = y;

      if (y < innerHeight * 1.1 && !reduceMotion) {
        const k = y / innerHeight;
        heroCopy.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        heroCopy.style.opacity = String(clamp(1 - k * 1.1, 0, 1));
        portrait.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(${1 - k * 0.08})`;
      }

      timelines.forEach((tl) => {
        const r = tl.getBoundingClientRect();
        const prog = clamp((innerHeight * 0.65 - r.top) / r.height, 0, 1);
        const line = $(".timeline-line span", tl);
        if (line) line.style.setProperty("--p", prog.toFixed(3));
      });
    }
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------------
     Reveal animations
     ------------------------------------------------------------------------ */
  function splitWords(el) {
    let i = 0;
    const wrap = (node) => {
      const w = document.createElement("span");
      w.className = "w";
      const inner = document.createElement("span");
      inner.style.setProperty("--i", i++);
      inner.appendChild(node);
      w.appendChild(inner);
      return w;
    };
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
          else frag.appendChild(wrap(document.createTextNode(part)));
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        el.replaceChild(wrap(node.cloneNode(true)), node);
      }
    });
  }

  let revealIO;
  function initReveals() {
    $$("[data-split]").forEach(splitWords);
    // auto-stagger siblings
    const parents = new Set($$("[data-reveal]").map((el) => el.parentElement));
    parents.forEach((p) => {
      $$(":scope > [data-reveal]", p).forEach((el, i) => {
        if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
      });
    });
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    observeReveals();
  }
  function observeReveals(scope = document) {
    $$("[data-reveal]:not(.is-in), [data-split]:not(.is-in), .feat:not(.is-in), .skill-card:not(.is-in), .repo-grid:not(.is-in), .cert-grid:not(.is-in)", scope).forEach((el) => revealIO.observe(el));
  }

  /* ------------------------------------------------------------------------
     Hero details: counters + role rotator
     ------------------------------------------------------------------------ */
  function animateCount(el, to, duration = 1800) {
    const decimals = +(el.dataset.decimals || 0);
    const from = 0;
    const start = performance.now();
    (function step(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = (from + (to - from) * e).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
  function initCounters() {
    $$("[data-count]").forEach((el, i) => setTimeout(() => animateCount(el, parseFloat(el.dataset.count)), 600 + i * 120));
  }

  function initRotator() {
    const el = $("#rotator");
    const phrases = [
      "intelligent vision systems.",
      "LLM-powered web apps.",
      "robots that see and decide.",
      "secure, cloud-ready software.",
      "embedded IoT security rigs.",
    ];
    if (reduceMotion) { el.textContent = phrases[0]; return; }
    let pi = 0, ci = 0, deleting = false;
    (function tick() {
      const word = phrases[pi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 28 : 55 + Math.random() * 40;
      if (!deleting && ci === word.length) { deleting = true; delay = 1900; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  /* ------------------------------------------------------------------------
     Hero orbit: skill cards travel a tilted ring around the photo, passing
     in front along the bottom and behind it at the top, where they swap skills
     ------------------------------------------------------------------------ */
  function initOrbit() {
    const portrait = $("#portrait");
    const orbiters = $$("[data-orbiter]", portrait);
    const sats = $$(".satellite", portrait);
    if (!portrait || !orbiters.length) return;

    // ring geometry, as fractions of the portrait size
    const CX = 0.5, CY = 0.55, RX = 0.52, RY = 0.25, TILT = (-12 * Math.PI) / 180;
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    const TAU = Math.PI * 2;
    const BACK = Math.PI * 1.5; // top of the ring = hidden behind the photo

    // draw the ring halves (SVG units 0–100)
    const tiltDeg = (TILT * 180) / Math.PI;
    const cx = CX * 100, cy = CY * 100, rx = RX * 100, ry = RY * 100;
    const backD = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
    const frontD = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
    $$(".ring-back path", portrait).forEach((p) => p.setAttribute("d", backD));
    $$(".ring-front path", portrait).forEach((p) => p.setAttribute("d", frontD));
    $$(".ring-tilt", portrait).forEach((g) => g.setAttribute("transform", `rotate(${tiltDeg} ${cx} ${cy})`));

    const fill = (el, set) => {
      el.innerHTML = `<span class="orb-label">${esc(set.label)}</span>
        <span class="orb-skills">${set.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</span>`;
    };
    const cards = orbiters.map((el, n) => {
      const sets = D.heroChips[n] || [];
      if (sets.length) fill(el, sets[0]);
      return { el, sets, i: 0, offset: (n * TAU) / orbiters.length + Math.PI * 0.15 };
    });
    const satOrbit = sats.map((el, n) => ({ el, offset: n * 2.1 + 0.6, speed: 1.6 + n * 0.45 }));

    let size = portrait.offsetWidth;
    addEventListener("resize", () => { size = portrait.offsetWidth; });

    const place = (el, ang, scaleMin, w, h) => {
      const ex = Math.cos(ang) * RX * size, ey = Math.sin(ang) * RY * size;
      const x = CX * size + ex * cosT - ey * sinT;
      const y = CY * size + ex * sinT + ey * cosT;
      const depth = Math.sin(ang); // +1 front (bottom), −1 back (top)
      const k = (depth + 1) / 2;
      const s = scaleMin + (1 - scaleMin) * k;
      el.style.transform = `translate3d(${(x - w / 2).toFixed(1)}px, ${(y - h / 2).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      const z = depth > 0 ? (w ? 4 : 3) : 1; // satellites (w = 0) stay under the cards
      if (el._z !== z) { el.style.zIndex = z; el._z = z; }
      el.style.opacity = (0.45 + 0.55 * k).toFixed(3);
      return depth;
    };

    const PERIOD = 18000; // ms per revolution
    let theta = 0, speed = 1, target = 1, last = performance.now();
    portrait.addEventListener("pointerenter", () => { target = 0.25; });
    portrait.addEventListener("pointerleave", () => { target = 1; });

    function frame(now) {
      const dt = Math.min(64, now - last);
      last = now;
      speed += (target - speed) * 0.05;
      theta += (dt / PERIOD) * TAU * speed;

      cards.forEach((c) => {
        const ang = (theta + c.offset) % TAU;
        const prev = c.prevAng ?? ang;
        // swap skills the moment the card crosses the hidden back point
        const crossed = prev < BACK && ang >= BACK;
        if (crossed && c.sets.length > 1) {
          c.i = (c.i + 1) % c.sets.length;
          fill(c.el, c.sets[c.i]);
          c.el.classList.add("is-swap");
          void c.el.offsetWidth;
          c.el.classList.remove("is-swap");
          c.w = 0;
        }
        c.prevAng = ang;
        if (!c.w) { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; }
        place(c.el, ang, 0.74, c.w, c.h);
      });
      satOrbit.forEach((s) => place(s.el, (theta * s.speed + s.offset) % TAU, 0.5, 0, 0));
    }

    if (reduceMotion) {
      // still layout: cards rest on either side of the photo
      cards.forEach((c, n) => { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; place(c.el, n ? Math.PI * 0.8 : Math.PI * 0.2, 0.74, c.w, c.h); });
      satOrbit.forEach((s) => (s.el.style.display = "none"));
      return;
    }
    // only animate while the hero is on screen
    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(portrait);
    (function loop(now) {
      if (!document.hidden && visible) frame(now); else last = now;
      requestAnimationFrame(loop);
    })(performance.now());
    addEventListener("resize", () => cards.forEach((c) => (c.w = 0)));
  }

  /* ------------------------------------------------------------------------
     Marquee
     ------------------------------------------------------------------------ */
  function renderMarquee() {
    const colors = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)"];
    [["#marqueeA", D.marquee[0]], ["#marqueeB", D.marquee[1]]].forEach(([sel, items]) => {
      const html = items.map((s, i) => `<span class="marquee-item" style="--c:${colors[i % colors.length]}">${esc(s)}</span>`).join("");
      $(sel).innerHTML = html + html;
    });
  }

  /* ------------------------------------------------------------------------
     Featured projects
     ------------------------------------------------------------------------ */
  function visualHTML(kind) {
    if (kind === "drone") {
      return `<div class="vis vis-drone">
        <div class="field"></div><div class="beam"></div>
        <div class="drone"><svg viewBox="0 0 90 40" aria-hidden="true">
          <path d="M14 12 L36 22 M76 12 L54 22 M36 22 h18 v8 h-18z"/>
          <ellipse class="rotor" cx="14" cy="10" rx="12" ry="2.2"/>
          <ellipse class="rotor" cx="76" cy="10" rx="12" ry="2.2"/>
          <circle cx="45" cy="33" r="3"/></svg></div>
        <span class="corner a"></span><span class="corner b"></span><span class="corner c"></span><span class="corner d"></span>
        <div class="hud tl">WAYPOINT NAV · <b>GPS LOCK</b></div>
        <div class="hud bl">● LIVE</div>
        <div class="hud br">CNN · <b>10-class leaf scan</b></div>
      </div>`;
    }
    if (kind === "galaxy") {
      const shadows = (n, spread, colors) => Array.from({ length: n }, () => {
        const a = Math.random() * Math.PI * 2, d = Math.pow(Math.random(), 0.6) * spread;
        return `${(Math.cos(a) * d).toFixed(0)}px ${(Math.sin(a) * d * 0.6).toFixed(0)}px 0 ${Math.random() < 0.15 ? 1 : 0}px ${colors[(Math.random() * colors.length) | 0]}`;
      }).join(",");
      const bars = Array.from({ length: 22 }, (_, i) => `<i style="animation-delay:${(i * 0.07).toFixed(2)}s"></i>`).join("");
      return `<div class="vis vis-galaxy">
        <span class="stars" style="box-shadow:${shadows(160, 380, ["#fff", "#a5f3fc", "#c4b5fd"])}"></span>
        <span class="stars2" style="box-shadow:${shadows(90, 300, ["#f9a8d4", "#fde68a", "#fff"])}"></span>
        <span class="ring r1"></span><span class="ring r2"></span><span class="core"></span>
        <div class="quote">&gt; “Right away, sir. Flying to <b>notes/robotics.md</b>…”</div>
        <div class="wave">${bars}</div>
      </div>`;
    }
    return "";
  }

  function renderFeatured() {
    const gh = (r) => `https://github.com/${D.github}/${r}`;
    $("#featured").innerHTML = D.featured.map((p, i) => `
      <article class="feat">
        <div class="feat-media">
          <span class="feat-index">${String(i + 1).padStart(2, "0")}</span>
          <div class="feat-media-inner">
            ${p.img
              ? `<div class="browser-bar"><i></i><i></i><i></i></div><div class="shot"><img src="${p.img}" alt="${esc(p.title)} screenshot" loading="lazy" decoding="async" /></div>`
              : visualHTML(p.visual)}
          </div>
        </div>
        <div class="feat-body">
          <p class="feat-kicker">${esc(p.kicker)}</p>
          <h3 class="feat-title">${esc(p.title)}</h3>
          <p class="feat-desc">${esc(p.desc)}</p>
          <div class="feat-metrics">${p.metrics.map(([v, l]) => `<div><b>${esc(v)}</b><small>${esc(l)}</small></div>`).join("")}</div>
          <div class="feat-tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <div class="feat-links">
            ${p.live ? `<a class="btn btn-glow btn-sm magnetic" href="${p.live}" target="_blank" rel="noopener"><span>Live demo</span>${icon("external", "ic")}</a>` : ""}
            <a class="btn btn-ghost btn-sm magnetic" href="${gh(p.repo)}" target="_blank" rel="noopener">${icon("github", "ic")}<span>Source code</span></a>
          </div>
        </div>
      </article>`).join("");
  }

  /* ------------------------------------------------------------------------
     Repositories
     ------------------------------------------------------------------------ */
  const LANG_COLORS = {
    Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
    Jupyter: "#DA5B0B", "Jupyter Notebook": "#DA5B0B", "C++": "#f34b7d", C: "#555555", Java: "#b07219",
    Batchfile: "#C1F12E", Shell: "#89e051",
  };
  const CAT_STYLE = {
    ai: { h: [262, 190], icon: "brain" },
    vision: { h: [150, 195], icon: "robot" },
    web: { h: [320, 255], icon: "code" },
    systems: { h: [205, 235], icon: "terminal" },
    learn: { h: [35, 330], icon: "book" },
    fork: { h: [45, 15], icon: "fork" },
  };
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }); } catch (e) { return d; } };
  const prettify = (name) => name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());

  let repos = D.repos.slice();
  let repoFilter = "all";
  let repoQuery = "";
  let repoExpanded = false;

  function guessCat(r) {
    if (r.fork) return "fork";
    const l = (r.language || "").toLowerCase();
    if (/python|jupyter/.test(l)) return "ai";
    if (/html|javascript|typescript|css/.test(l)) return "web";
    return "systems";
  }

  function repoCard(r) {
    const st = CAT_STYLE[r.cat] || CAT_STYLE.systems;
    const hv = hash(r.name) % 30 - 15;
    const glyph = (r.title || r.name).replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const cover = r.img
      ? `<img src="${r.img}" alt="${esc(r.title)} preview" loading="lazy" decoding="async" />`
      : `<div class="gen-cover" style="--h1:${st.h[0] + hv};--h2:${st.h[1] - hv}">
           <span class="gc-icon">${icon(st.icon)}</span>
           <span class="gc-name">${esc(r.name)}</span>
           <span class="gc-glyph">${esc(glyph)}</span>
         </div>`;
    const lang = r.lang || "Docs";
    const search = [r.name, r.title, r.desc, lang, (r.tags || []).join(" "), D.repoCats[r.cat]].join(" ").toLowerCase();
    return `
      <article class="repo tilt" data-cat="${r.cat}" data-search="${esc(search)}">
        <div class="repo-cover">
          ${cover}
          <div class="repo-badges">
            ${r.live ? '<span class="pill live">Live</span>' : ""}
            ${r.fork ? '<span class="pill fork">Fork</span>' : ""}
            ${r.stars ? `<span class="pill">★ ${r.stars}</span>` : ""}
          </div>
        </div>
        <div class="repo-body">
          <p class="repo-cat">${esc(D.repoCats[r.cat] || "Project")}</p>
          <h3 class="repo-title">${esc(r.title)}</h3>
          <p class="repo-desc">${esc(r.desc)}</p>
          <div class="repo-tags">${(r.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <div class="repo-foot">
            <span class="lang"><i style="--lc:${LANG_COLORS[lang] || "#8b949e"}"></i>${esc(lang)} · ${fmtDate(r.updated)}</span>
            <span class="repo-links">
              ${r.live ? `<a href="${r.live}" target="_blank" rel="noopener" aria-label="Open live ${esc(r.title)}">${icon("external")}Live</a>` : ""}
              <a href="https://github.com/${D.github}/${r.name}" target="_blank" rel="noopener" aria-label="View ${esc(r.title)} on GitHub">${icon("github")}Code</a>
            </span>
          </div>
        </div>
      </article>`;
  }

  function sortRepos() {
    repos.sort((a, b) => (a.fork === b.fork ? (b.updated || "").localeCompare(a.updated || "") : a.fork ? 1 : -1));
  }

  function renderRepoFilters() {
    const counts = repos.reduce((m, r) => ((m[r.cat] = (m[r.cat] || 0) + 1), m), {});
    const cats = [["all", "All", repos.length], ...Object.keys(D.repoCats).filter((k) => counts[k]).map((k) => [k, D.repoCats[k], counts[k]])];
    $("#repoFilters").innerHTML = cats.map(([k, label, n]) =>
      `<button class="chip-btn ${k === repoFilter ? "is-active" : ""}" role="tab" aria-selected="${k === repoFilter}" data-filter="${k}">${esc(label)} <small>${n}</small></button>`
    ).join("");
  }

  function renderRepos() {
    sortRepos();
    $("#repoGrid").innerHTML = repos.map(repoCard).join("");
    renderRepoFilters();
    applyRepoFilter(false);
    bindTilt($("#repoGrid"));
    $$("#repoCount, #ghRepoCount").forEach((el) => {
      if (el.id === "ghRepoCount" || document.body.classList.contains("is-ready")) el.textContent = repos.length;
      el.dataset.count = repos.length;
    });
  }

  function applyRepoFilter(animate = true) {
    const limit = isSmall() ? 6 : 9;
    const cards = $$("#repoGrid .repo");
    const filtering = repoFilter !== "all" || repoQuery;
    let shown = 0, matched = 0;
    cards.forEach((card) => {
      const match = (repoFilter === "all" || card.dataset.cat === repoFilter) && (!repoQuery || card.dataset.search.includes(repoQuery));
      if (match) matched++;
      const visible = match && (filtering || repoExpanded || matched <= limit);
      card.classList.toggle("is-hidden", !visible);
      if (visible) {
        card.style.setProperty("--i", shown++);
        if (animate) { card.style.animation = "none"; void card.offsetWidth; card.style.animation = ""; }
      }
    });
    $("#repoEmpty").hidden = matched > 0;
    const more = $("#repoMore");
    more.hidden = filtering || matched <= limit;
    more.textContent = repoExpanded ? "Show fewer" : `Show all ${matched} repositories`;
  }

  function initRepos() {
    renderRepos();
    $("#repoFilters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      repoFilter = b.dataset.filter;
      $$("#repoFilters .chip-btn").forEach((c) => { const on = c === b; c.classList.toggle("is-active", on); c.setAttribute("aria-selected", on); });
      applyRepoFilter();
    });
    let qT;
    $("#repoSearch").addEventListener("input", (e) => {
      clearTimeout(qT);
      qT = setTimeout(() => { repoQuery = e.target.value.trim().toLowerCase(); applyRepoFilter(); }, 120);
    });
    $("#repoMore").addEventListener("click", () => {
      repoExpanded = !repoExpanded;
      applyRepoFilter(repoExpanded);
      if (!repoExpanded) scrollToTarget($("#repos"));
      if (lenis) setTimeout(() => lenis.resize(), 50);
    });
    fetchLiveRepos();
  }

  // Pull the live repo list so new repos appear without editing the site.
  async function fetchLiveRepos() {
    const KEY = "rp-gh-cache";
    let data = null;
    try {
      const cached = JSON.parse(store.get(KEY) || "null");
      if (cached && Date.now() - cached.t < 60 * 60 * 1000) data = cached.d;
    } catch (e) {}
    if (!data) {
      try {
        const res = await fetch(`https://api.github.com/users/${D.github}/repos?per_page=100&sort=updated`, { headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) return;
        const json = await res.json();
        data = json.map((r) => ({ name: r.name, description: r.description, language: r.language, fork: r.fork, stars: r.stargazers_count, updated: r.pushed_at || r.updated_at, homepage: r.homepage, has_pages: r.has_pages }));
        store.set(KEY, JSON.stringify({ t: Date.now(), d: data }));
      } catch (e) { return; }
    }
    if (!Array.isArray(data) || !data.length) return;
    const known = new Map(repos.map((r) => [r.name, r]));
    data.forEach((g) => {
      const r = known.get(g.name);
      if (r) {
        r.stars = g.stars;
        if (g.updated && g.updated.slice(0, 10) > (r.updated || "")) r.updated = g.updated.slice(0, 10);
      } else {
        repos.push({
          name: g.name,
          title: prettify(g.name),
          desc: g.description || "A fresh repository — open it on GitHub to see what's cooking.",
          cat: guessCat(g),
          lang: g.language,
          updated: (g.updated || "").slice(0, 10),
          fork: g.fork,
          stars: g.stars,
          tags: [],
          live: g.homepage || (g.has_pages ? `https://${D.github.toLowerCase()}.github.io/${g.name}/` : undefined),
        });
      }
    });
    renderRepos();
    if (revealIO) observeReveals($("#repos"));
  }

  /* ------------------------------------------------------------------------
     Skills
     ------------------------------------------------------------------------ */
  function renderSkills() {
    $("#skillsGrid").innerHTML = D.skills.map((s, i) => `
      <article class="skill-card tilt" data-reveal style="--sc:${s.color};--d:${(i % 3) * 0.08}s">
        <div class="skill-head">
          <span class="skill-ic">${icon(s.icon)}</span>
          <h3>${esc(s.title)}<small>${esc(s.sub)}</small></h3>
        </div>
        <div class="skill-list">${s.items.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      </article>`).join("");
  }

  /* ------------------------------------------------------------------------
     Certificates & badges
     ------------------------------------------------------------------------ */
  const ISSUER_COLORS = {
    "Palo Alto Networks": "#fa582d", Oracle: "#c74634", Google: "#4285f4", "Google for Education": "#34a853",
    NVIDIA: "#76b900", Anthropic: "#d97757", "DeepLearning.AI": "#ff5a5f", "IBM SkillsBuild": "#0f62fe",
    Microsoft: "#00a4ef", Kaggle: "#20beff", Be10x: "#a855f7", Udemy: "#a435f0", Coursera: "#2a73cc",
    "Coursera Project Network": "#2a73cc", GeeksforGeeks: "#2f8d46",
  };
  let certFilter = "all";
  const certsOrdered = () => [...D.certs.filter((c) => c.featured), ...D.certs.filter((c) => !c.featured)];
  const certImg = (c) => ({ thumb: `assets/img/certs/${c.file}_thumb.webp`, full: `assets/img/certs/${c.file}.webp` });

  function renderBadges() {
    $("#badgeRow").innerHTML = D.badges.map((b, i) => `
      <button class="badge" type="button" data-reveal data-badge="${i}" aria-label="View badge: ${esc(b.title)}">
        <span class="badge-img"><img src="assets/img/badges/${b.file}.webp" alt="" loading="lazy" decoding="async" /></span>
        <b>${esc(b.title)}</b><small>${esc(b.sub)}</small>
        <span class="badge-shine"></span>
      </button>`).join("");
    $("#badgeRow").addEventListener("click", (e) => {
      const b = e.target.closest("[data-badge]");
      if (!b) return;
      const list = D.badges.map((x) => ({ src: `assets/img/badges/${x.file}.webp`, title: x.title, sub: x.sub }));
      Lightbox.open(list, +b.dataset.badge, b);
    });
  }

  function renderCertFilters() {
    const all = D.certs;
    const counts = all.reduce((m, c) => ((m[c.cat] = (m[c.cat] || 0) + 1), m), {});
    const opts = [["all", "All", all.length], ...Object.entries(D.certCats).map(([k, v]) => [k, v, counts[k] || 0])];
    $("#certFilters").innerHTML = opts.map(([k, l, n]) =>
      `<button class="chip-btn ${k === certFilter ? "is-active" : ""}" role="tab" aria-selected="${k === certFilter}" data-filter="${k}">${esc(l)} <small>${n}</small></button>`
    ).join("");
    $("#certCount").textContent = `${all.length} verified`;
  }

  function renderCerts() {
    const list = certsOrdered().filter((c) => certFilter === "all" || c.cat === certFilter);
    $("#certGrid").innerHTML = list.map((c, i) => `
      <button class="cert" type="button" data-cert="${i}" style="--i:${i}" aria-label="View certificate: ${esc(c.title)}">
        <span class="cert-thumb">
          ${c.featured ? `<span class="pill cert-star">★ Featured</span>` : ""}
          <img src="${certImg(c).thumb}" alt="" loading="lazy" decoding="async" />
        </span>
        <span class="cert-body">
          <span class="cert-issuer"><i style="--ic:${ISSUER_COLORS[c.issuer] || "var(--c2)"}"></i>${esc(c.issuer)}</span>
          <span class="cert-title">${esc(c.title)}</span>
          <span class="cert-date">${esc(c.date || "Completed")}</span>
        </span>
      </button>`).join("");
    bindTilt($("#certGrid"), 5);
    if (lenis) setTimeout(() => lenis.resize(), 50);
  }

  function initCerts() {
    renderBadges();
    renderCertFilters();
    renderCerts();
    $("#certFilters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b || b.dataset.filter === certFilter) return;
      certFilter = b.dataset.filter;
      $$("#certFilters .chip-btn").forEach((c) => { const on = c === b; c.classList.toggle("is-active", on); c.setAttribute("aria-selected", on); });
      renderCerts();
    });
    $("#certGrid").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cert]");
      if (!b) return;
      const list = certsOrdered().filter((c) => certFilter === "all" || c.cat === certFilter)
        .map((c) => ({ src: certImg(c).full, title: c.title, sub: [c.issuer, c.date].filter(Boolean).join(" · ") }));
      Lightbox.open(list, +b.dataset.cert, b);
    });
  }

  /* ------------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------------ */
  const Lightbox = (() => {
    const lb = $("#lightbox");
    const img = $("img", lb);
    const title = $("figcaption b", lb);
    const sub = $("figcaption span", lb);
    let items = [], idx = 0, opener = null;

    function show(i) {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.style.opacity = "0";
      const pre = new Image();
      pre.onload = pre.onerror = () => { img.src = it.src; img.alt = it.title; img.style.opacity = "1"; };
      pre.src = it.src;
      title.textContent = it.title;
      sub.textContent = `${it.sub}  ·  ${idx + 1} / ${items.length}`;
      $$(".lb-nav", lb).forEach((b) => (b.hidden = items.length < 2));
    }
    function open(list, i, from) {
      items = list; opener = from;
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add("is-open"));
      show(i);
      lockScroll(true);
      $(".lb-close", lb).focus({ preventScroll: true });
    }
    function close() {
      lb.classList.remove("is-open");
      setTimeout(() => { lb.hidden = true; img.removeAttribute("src"); }, 350);
      lockScroll(false);
      if (opener) opener.focus({ preventScroll: true });
    }
    img.style.transition = "opacity .3s";
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-nav.prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-nav.next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "Tab") {
        const f = $$("button:not([hidden])", lb);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let sx = 0, sy = 0;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
      else if (dy > 90) close();
    }, { passive: true });
    return { open };
  })();

  /* ------------------------------------------------------------------------
     Pointer effects: tilt, magnetic buttons, cursor ring
     ------------------------------------------------------------------------ */
  function bindTilt(scope = document, max = 7) {
    if (!finePointer || reduceMotion) return;
    $$(".tilt, .cert, .feat-media", scope).forEach((el) => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = "1";
      const strength = el.classList.contains("feat-media") ? 5 : max;
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transition = "transform .15s ease-out, border-color .4s, box-shadow .5s";
          el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * strength}deg) rotateY(${(px - 0.5) * strength}deg) translateY(-4px)`;
        });
      });
      el.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        el.style.transition = "transform .8s cubic-bezier(.22,1,.36,1), border-color .4s, box-shadow .5s";
        el.style.transform = "";
      });
    });
  }

  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.addEventListener("pointermove", (e) => {
      const m = e.target.closest(".magnetic");
      $$(".magnetic.is-mag").forEach((el) => { if (el !== m) { el.classList.remove("is-mag"); el.style.transform = ""; } });
      if (!m) return;
      const r = m.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      m.classList.add("is-mag");
      m.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
    }, { passive: true });
  }

  function initCursor() {
    if (!finePointer || reduceMotion) return;
    const ring = $(".cursor-ring");
    let x = -100, y = -100, rx = -100, ry = -100;
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      document.body.classList.add("has-cursor");
      const hot = e.target.closest("a, button, .tilt, input, label");
      ring.classList.toggle("is-hover", !!hot);
    }, { passive: true });
    document.addEventListener("pointerleave", () => document.body.classList.remove("has-cursor"));
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------------
     Misc
     ------------------------------------------------------------------------ */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-show"), 2200);
  }
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.links.email); toast("Email copied to clipboard ✓"); }
    catch (e) { toast(D.links.email); }
  });
  $("#year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     Boot it all up
     ------------------------------------------------------------------------ */
  hydrateIcons();
  renderMarquee();
  initOrbit();
  renderFeatured();
  renderSkills();
  initRepos();
  initCerts();
  hydrateIcons($("#featured"));
  Background.init();
  initSmoothScroll();
  initReveals();
  initNavSpy();
  initScrollUI();
  bindTilt();
  initMagnetic();
  initCursor();

  runBoot(() => {
    if (lenis) lenis.start();
    initCounters();
    setTimeout(initRotator, 700);
    // honour deep links like /#certificates after the intro
    if (location.hash && location.hash.length > 1) {
      const t = $(location.hash);
      if (t) setTimeout(() => scrollToTarget(t), 400);
    }
  });
})();
