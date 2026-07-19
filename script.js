/* ==========================================================================
   BIRTHDAY SURPRISE — SCRIPT
   Vanilla JS. No build step. Everything self-contained.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — edit these to customize without touching the logic below
   -------------------------------------------------------------------------- */
const CONFIG = {
  PASSWORD: "changeme",            // <-- set your secret word here
  HER_NAME: "My Love",             // shown on celebration page + letter
  YOUR_NAME: "Me",                 // shown as the letter's signature
  LETTER_TITLE_NAME: "You",        // shown in "My Dearest ___"
  LETTER_LINES: [
    "My love,",
    "",
    "Happy Birthday...",
    "",
    "(This is where your message will go. Replace these lines in js/script.js",
    "inside CONFIG.LETTER_LINES with whatever you want to say to her.)",
    "",
    "Every line here appears slowly, like it's being written just for you."
  ],
  // Media folders — files placed here are detected automatically (see below)
  PHOTO_FILENAMES: [],   // e.g. ["photo1.jpg", "photo2.jpg"] — leave empty to auto-try common names
  VIDEO_FILENAMES: [],   // e.g. ["clip1.mp4"]
};

/* --------------------------------------------------------------------------
   UTILITIES
   -------------------------------------------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function fileExists(url) {
  return fetch(url, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);
}

/* --------------------------------------------------------------------------
   LOADER
   -------------------------------------------------------------------------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader").classList.add("loader-hide");
  }, 900);
});

/* --------------------------------------------------------------------------
   CUSTOM CURSOR
   -------------------------------------------------------------------------- */
(function customCursor() {
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("button, a, input, .candle, .envelope, .polaroid, .video-card")) {
      ring.classList.add("cursor-hover");
    } else {
      ring.classList.remove("cursor-hover");
    }
  });
})();

/* --------------------------------------------------------------------------
   AMBIENT GOLD PARTICLE CANVAS (global background, all pages)
   -------------------------------------------------------------------------- */
(function ambientParticles() {
  const canvas = $("#particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const COUNT = window.innerWidth < 640 ? 28 : 55;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.25 + 0.05,
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y -= p.vy;
      p.x += p.vx;
      p.twinklePhase += p.twinkleSpeed;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.twinklePhase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${a})`;
      ctx.shadowColor = "rgba(212,175,55,0.8)";
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --------------------------------------------------------------------------
   PAGE NAVIGATION HELPER
   -------------------------------------------------------------------------- */
function goToPage(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);
  if (fromEl) {
    fromEl.classList.add("page-exit");
    setTimeout(() => {
      fromEl.classList.add("hidden-page");
      fromEl.classList.remove("page-exit", "active-enter");
    }, 550);
  }
  setTimeout(() => {
    toEl.classList.remove("hidden-page");
    toEl.classList.add("active-enter");
    if (window.onPageShown) window.onPageShown(toId);
  }, fromEl ? 500 : 0);
}

/* --------------------------------------------------------------------------
   PAGE 1 — PASSWORD GATE
   -------------------------------------------------------------------------- */
(function passwordGate() {
  const form = $("#passwordForm");
  const input = $("#passwordInput");
  const inputWrap = $("#inputWrap");
  const errorMsg = $("#errorMsg");
  const hintBtn = $("#hintBtn");
  const hintText = $("#hintText");

  hintBtn.addEventListener("click", () => {
    hintText.classList.toggle("show");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim().toLowerCase();
    if (val === CONFIG.PASSWORD.toLowerCase()) {
      errorMsg.classList.remove("show");
      unlockSite();
    } else {
      errorMsg.classList.add("show");
      inputWrap.classList.remove("shake");
      void inputWrap.offsetWidth; // restart animation
      inputWrap.classList.add("shake");
    }
  });

  function unlockSite() {
    // Reveal global music widget & try to start music (user gesture present)
    const widget = $("#musicWidget");
    widget.hidden = false;
    const music = $("#bgMusic");
    music.volume = 0.5;
    music.play().catch(() => {/* autoplay might still be blocked; controls remain available */});
    updatePlayIcon(true);

    goToPage("page1", "page2");
  }
})();

/* --------------------------------------------------------------------------
   MUSIC CONTROLS
   -------------------------------------------------------------------------- */
const bgMusic = $("#bgMusic");
const playPauseBtn = $("#playPauseBtn");
const muteBtn = $("#muteBtn");
const volumeSlider = $("#volumeSlider");

function updatePlayIcon(isPlaying) {
  $("#iconPlay").hidden = isPlaying;
  $("#iconPause").hidden = !isPlaying;
}
function updateMuteIcon(isMuted) {
  $("#iconVolOn").hidden = isMuted;
  $("#iconVolOff").hidden = !isMuted;
}

playPauseBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    updatePlayIcon(true);
  } else {
    bgMusic.pause();
    updatePlayIcon(false);
  }
});
muteBtn.addEventListener("click", () => {
  bgMusic.muted = !bgMusic.muted;
  updateMuteIcon(bgMusic.muted);
});
volumeSlider.addEventListener("input", (e) => {
  bgMusic.volume = parseFloat(e.target.value);
  if (bgMusic.volume === 0) { bgMusic.muted = true; updateMuteIcon(true); }
  else if (bgMusic.muted) { bgMusic.muted = false; updateMuteIcon(false); }
});

function playSfx(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {});
}

/* --------------------------------------------------------------------------
   PAGE 2 — CAKE: countdown then candles
   -------------------------------------------------------------------------- */
(function cakePage() {
  const readyTitle = $("#readyTitle");
  const cakeWrap = $("#cakeWrap");
  const countdownOverlay = $("#countdownOverlay");
  const countdownNum = $("#countdownNum");
  const tapHint = $("#tapHint");
  let countdownStarted = false;
  let candlesBlown = 0;
  const totalCandles = 3;

  cakeWrap.style.opacity = "0";
  cakeWrap.style.pointerEvents = "none";

  readyTitle.addEventListener("click", startCountdown);
  // Also auto-trigger shortly after page becomes visible, but keep title tappable for control
  function maybeAutoStart(pageId) {
    if (pageId === "page2" && !countdownStarted) {
      setTimeout(startCountdown, 900);
    }
  }
  window.onPageShown = window.onPageShown || maybeAutoStart;
  const prevHook = window.onPageShown;
  window.onPageShown = function (id) {
    prevHook(id);
  };

  function startCountdown() {
    if (countdownStarted) return;
    countdownStarted = true;
    readyTitle.style.transition = "opacity 0.6s";
    readyTitle.style.opacity = "0";

    countdownOverlay.classList.add("show");
    const seq = ["3", "2", "1"];
    let i = 0;

    function showNext() {
      countdownNum.textContent = seq[i];
      countdownNum.classList.remove("animate");
      void countdownNum.offsetWidth;
      countdownNum.classList.add("animate");
      playSfx("sfxChime");
      i++;
      if (i < seq.length) {
        setTimeout(showNext, 1000);
      } else {
        setTimeout(() => {
          countdownOverlay.classList.remove("show");
          cakeWrap.style.transition = "opacity 0.8s var(--ease-lux)";
          cakeWrap.style.opacity = "1";
          cakeWrap.style.pointerEvents = "auto";
        }, 1000);
      }
    }
    showNext();
  }

  $$(".candle").forEach((candle) => {
    candle.addEventListener("click", () => {
      if (candle.classList.contains("blown")) return;
      candle.classList.add("blown");
      spawnSmoke(candle);
      playSfx("sfxBlow");
      candlesBlown++;
      if (candlesBlown === 1) tapHint.style.opacity = "0.4";

      if (candlesBlown >= totalCandles) {
        tapHint.style.display = "none";
        launchConfetti();
        setTimeout(() => goToPage("page2", "page3"), 1600);
      }
    });
  });

  function spawnSmoke(candleEl) {
    const container = $("#smokeContainer");
    const rect = candleEl.getBoundingClientRect();
    const wrapRect = cakeWrap.getBoundingClientRect();
    const x = rect.left - wrapRect.left + rect.width / 2;
    const y = rect.top - wrapRect.top;

    for (let i = 0; i < 6; i++) {
      const puff = document.createElement("div");
      puff.className = "smoke-particle";
      puff.style.left = x + (Math.random() * 16 - 8) + "px";
      puff.style.top = y + "px";
      puff.style.animationDelay = i * 0.08 + "s";
      container.appendChild(puff);
      setTimeout(() => puff.remove(), 2000);
    }
  }
})();

/* --------------------------------------------------------------------------
   CONFETTI (lightweight canvas-based, no external dependency required —
   but will use window.confetti from canvas-confetti CDN if available)
   -------------------------------------------------------------------------- */
function launchConfetti() {
  if (window.confetti) {
    const colors = ["#d4af37", "#f4e2b8", "#151016", "#e6c9c2"];
    window.confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors });
    setTimeout(() => window.confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }), 250);
    setTimeout(() => window.confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }), 250);
  } else {
    fallbackConfetti();
  }
}

// Simple fallback confetti (DOM-based) in case CDN is unavailable / offline
function fallbackConfetti() {
  const colors = ["#d4af37", "#f4e2b8", "#e6c9c2"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.top = "-10px";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.width = "8px";
    piece.style.height = "12px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.opacity = "0.9";
    piece.style.zIndex = "7000";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.transition = `transform 2.6s linear, top 2.6s cubic-bezier(.4,0,.6,1)`;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.top = "108vh";
      piece.style.transform = `rotate(${Math.random() * 720}deg)`;
    });
    setTimeout(() => piece.remove(), 2700);
  }
}

/* --------------------------------------------------------------------------
   PAGE 3 — CELEBRATION: balloons, fairy lights, hearts, periodic confetti
   -------------------------------------------------------------------------- */
(function celebrationPage() {
  const nameHighlight = $(".name-highlight");
  if (nameHighlight) nameHighlight.textContent = CONFIG.HER_NAME;

  const balloonsContainer = $("#balloonsContainer");
  const fairyLights = $("#fairyLights");
  const heartsContainer = $("#floatingHearts");
  let started = false;
  let confettiInterval;

  function populateBalloons() {
    const count = window.innerWidth < 640 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "balloon " + (i % 2 === 0 ? "gold" : "black");
      b.style.left = Math.random() * 96 + "%";
      b.style.animationDuration = 9 + Math.random() * 8 + "s";
      b.style.animationDelay = -(Math.random() * 10) + "s";
      balloonsContainer.appendChild(b);
    }
  }

  function populateFairyLights() {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const l = document.createElement("div");
      l.className = "fairy-light";
      l.style.left = Math.random() * 100 + "%";
      l.style.top = Math.random() * 100 + "%";
      l.style.animationDelay = Math.random() * 2 + "s";
      fairyLights.appendChild(l);
    }
  }

  function spawnHeart() {
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = "❤";
    h.style.left = Math.random() * 96 + "%";
    h.style.fontSize = 12 + Math.random() * 18 + "px";
    h.style.animationDuration = 6 + Math.random() * 5 + "s";
    heartsContainer.appendChild(h);
    setTimeout(() => h.remove(), 11000);
  }

  const prevHook = window.onPageShown;
  window.onPageShown = function (id) {
    prevHook(id);
    if (id === "page3" && !started) {
      started = true;
      populateBalloons();
      populateFairyLights();
      launchConfetti();
      const heartInterval = setInterval(spawnHeart, 700);
      confettiInterval = setInterval(() => launchConfetti(), 4500);
      // Store so we could clear later if needed (not strictly necessary for a one-page flow)
    }
  };

  $("#toEnvelopeBtn").addEventListener("click", () => {
    clearInterval(confettiInterval);
    goToPage("page3", "page4");
  });
})();

/* --------------------------------------------------------------------------
   PAGE 4 — ENVELOPE
   -------------------------------------------------------------------------- */
(function envelopePage() {
  const envelope = $("#envelope");
  const starsBg = $("#starsBg");
  let starsBuilt = false;
  let opened = false;

  function buildStars() {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() * 2 + 1;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDuration = 2 + Math.random() * 3 + "s";
      starsBg.appendChild(s);
    }
  }

  const prevHook = window.onPageShown;
  window.onPageShown = function (id) {
    prevHook(id);
    if (id === "page4" && !starsBuilt) {
      starsBuilt = true;
      buildStars();
    }
  };

  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("opened");
    playSfx("sfxPage");
    setTimeout(() => goToPage("page4", "page5"), 1700);
  });
})();

/* --------------------------------------------------------------------------
   PAGE 5 — LETTER (typewriter)
   -------------------------------------------------------------------------- */
(function letterPage() {
  const letterBody = $("#letterBody");
  const letterName = $("#letterName");
  const nextBtn = $("#toGalleryBtn");
  let typed = false;

  letterName.textContent = CONFIG.LETTER_TITLE_NAME;
  $$('.typewriter-hidden.script.big')[0] && ($$('.typewriter-hidden.script.big')[0].textContent = CONFIG.YOUR_NAME + " ❤");

  const prevHook = window.onPageShown;
  window.onPageShown = function (id) {
    prevHook(id);
    if (id === "page5" && !typed) {
      typed = true;
      typewriteLetter();
    }
  };

  function typewriteLetter() {
    const lines = CONFIG.LETTER_LINES;
    let lineIndex = 0;

    function typeLine() {
      if (lineIndex >= lines.length) {
        finishLetter();
        return;
      }
      const lineText = lines[lineIndex];
      const lineEl = document.createElement("span");
      lineEl.className = "letter-line";
      lineEl.style.opacity = "1";
      letterBody.appendChild(lineEl);

      if (lineText === "") {
        lineEl.innerHTML = "&nbsp;";
        letterBody.appendChild(document.createElement("br"));
        lineIndex++;
        setTimeout(typeLine, 250);
        return;
      }

      const caret = document.createElement("span");
      caret.className = "type-caret";
      letterBody.appendChild(caret);
      letterBody.appendChild(document.createElement("br"));

      let charIndex = 0;
      const speed = 28;
      function typeChar() {
        if (charIndex < lineText.length) {
          lineEl.textContent += lineText[charIndex];
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          caret.remove();
          lineIndex++;
          setTimeout(typeLine, 200);
        }
      }
      typeChar();
    }
    typeLine();
  }

  function finishLetter() {
    setTimeout(() => {
      $$(".typewriter-hidden").forEach((el) => {
        el.style.transition = "opacity 1s";
        el.style.opacity = "1";
      });
      nextBtn.hidden = false;
      nextBtn.style.opacity = "0";
      requestAnimationFrame(() => {
        nextBtn.style.transition = "opacity 0.8s";
        nextBtn.style.opacity = "1";
      });
    }, 400);
  }

  nextBtn.addEventListener("click", () => goToPage("page5", "page6"));
})();

/* --------------------------------------------------------------------------
   PAGE 6 — MEMORIES GALLERY (auto-detect photos & videos)
   -------------------------------------------------------------------------- */
(function galleryPage() {
  const grid = $("#galleryGrid");
  const emptyMsg = $("#galleryEmpty");
  let built = false;

  // Common filename patterns to probe for, since the browser can't list a
  // directory on a static host. Users following the README naming
  // convention (photo1.jpg, photo2.jpg, video1.mp4, ...) will be picked
  // up automatically. This checks up to 40 of each, silently skipping
  // any that don't exist.
  function buildCandidateList(base, exts, max) {
    const list = [];
    for (let i = 1; i <= max; i++) {
      for (const ext of exts) {
        list.push(`${base}${i}.${ext}`);
      }
    }
    return list;
  }

  async function discoverMedia() {
    const photoNames = CONFIG.PHOTO_FILENAMES.length
      ? CONFIG.PHOTO_FILENAMES
      : buildCandidateList("photo", ["jpg", "jpeg", "png", "webp"], 40);
    const videoNames = CONFIG.VIDEO_FILENAMES.length
      ? CONFIG.VIDEO_FILENAMES
      : buildCandidateList("video", ["mp4", "webm", "mov"], 40);

    const photoChecks = photoNames.map((name) =>
      fileExists(`assets/photos/${name}`).then((ok) => (ok ? name : null))
    );
    const videoChecks = videoNames.map((name) =>
      fileExists(`assets/videos/${name}`).then((ok) => (ok ? name : null))
    );

    const [photos, videos] = await Promise.all([
      Promise.all(photoChecks),
      Promise.all(videoChecks),
    ]);

    return {
      photos: photos.filter(Boolean),
      videos: videos.filter(Boolean),
    };
  }

  function renderGallery(photos, videos) {
    if (photos.length === 0 && videos.length === 0) {
      emptyMsg.hidden = false;
      return;
    }
    emptyMsg.hidden = true;

    photos.forEach((name, i) => {
      const card = document.createElement("div");
      card.className = "polaroid";
      card.style.setProperty("--rot", (i % 2 === 0 ? "-2deg" : "2deg"));
      const img = document.createElement("img");
      img.src = `assets/photos/${name}`;
      img.loading = "lazy";
      img.alt = "A memory together";
      card.appendChild(img);
      const cap = document.createElement("div");
      cap.className = "polaroid-cap";
      cap.textContent = "❤";
      card.appendChild(cap);
      card.addEventListener("click", () => openLightbox("image", img.src));
      grid.appendChild(card);
    });

    videos.forEach((name) => {
      const card = document.createElement("div");
      card.className = "video-card";
      const vid = document.createElement("video");
      vid.src = `assets/videos/${name}`;
      vid.muted = true;
      vid.preload = "metadata";
      card.appendChild(vid);
      const badge = document.createElement("div");
      badge.className = "play-badge";
      badge.textContent = "▶";
      card.appendChild(badge);
      card.addEventListener("click", () => openLightbox("video", vid.src));
      grid.appendChild(card);
    });
  }

  function openLightbox(type, src) {
    const lightbox = $("#lightbox");
    const content = $("#lightboxContent");
    content.innerHTML = "";
    if (type === "image") {
      const img = document.createElement("img");
      img.src = src;
      content.appendChild(img);
    } else {
      const vid = document.createElement("video");
      vid.src = src;
      vid.controls = true;
      vid.autoplay = true;
      content.appendChild(vid);
    }
    lightbox.classList.add("show");
  }

  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  function closeLightbox() {
    const lightbox = $("#lightbox");
    lightbox.classList.remove("show");
    $("#lightboxContent").innerHTML = "";
  }

  const prevHook = window.onPageShown;
  window.onPageShown = function (id) {
    prevHook(id);
    if (id === "page6" && !built) {
      built = true;
      discoverMedia().then(({ photos, videos }) => renderGallery(photos, videos));
    }
  };

  $("#toEndingBtn").addEventListener("click", () => goToPage("page6", "page7"));
})();

/* --------------------------------------------------------------------------
   PAGE 7 — FINAL ENDING
   -------------------------------------------------------------------------- */
(function endingPage() {
  const prevHook = window.onPageShown;
  window.onPageShown = function (id) {
    prevHook(id);
    if (id === "page7") {
      // Soften the music for the finale
      const music = $("#bgMusic");
      const targetVol = Math.max(0.15, music.volume * 0.4);
      const startVol = music.volume;
      const steps = 30;
      let step = 0;
      const fade = setInterval(() => {
        step++;
        music.volume = startVol - (startVol - targetVol) * (step / steps);
        if (step >= steps) clearInterval(fade);
      }, 60);
    }
  };
})();

/* --------------------------------------------------------------------------
   INITIAL HOOK SETUP (no-op default so the chain above always has a base)
   -------------------------------------------------------------------------- */
if (!window.onPageShown) {
  window.onPageShown = function () {};
}
