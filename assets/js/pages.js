/* ==========================================================================
   Lala Rent Car — Render section dari data asli (data.js)
   Armada · Cara Pesan · Layanan · Kenapa Kami · FAQ · Kontak
   ========================================================================== */
(function () {
  "use strict";
  const L = window.LALA;
  const C = L.config;
  const $ = (s, r = document) => r.querySelector(s);
  const U = () => window.LalaUI;

  /* Siluet garis untuk mobil yang belum punya foto (bukan klaim, hanya bentuk kendaraan) */
  const SILHOUETTE = {
    mpv: `<path d="M22 92 V74 Q24 64 36 62 L74 56 L108 34 Q114 30 124 30 H238 Q250 30 258 38 L284 62 Q298 64 300 74 V92"/>
          <path class="glass" d="M112 56 L132 38 H176 V56 Z M184 38 H234 Q242 38 248 46 L258 56 H184 Z"/>
          <path d="M22 92 H56 M104 92 H222 M270 92 H300"/>
          <circle cx="80" cy="92" r="20"/><circle cx="246" cy="92" r="20"/>`,
    suv: `<path d="M18 92 V68 Q20 58 34 56 L72 52 L98 28 Q104 22 116 22 H236 Q248 22 254 32 L272 54 L292 58 Q304 60 304 72 V92"/>
          <path class="glass" d="M104 52 L122 32 H174 V52 Z M182 32 H232 Q240 32 244 40 L254 52 H182 Z"/>
          <path d="M18 92 H54 M110 92 H218 M274 92 H304"/>
          <circle cx="82" cy="92" r="23"/><circle cx="246" cy="92" r="23"/>`,
    van: `<path d="M18 92 V40 Q18 22 36 20 H246 Q264 20 274 34 L298 64 Q304 70 304 80 V92"/>
          <path class="glass" d="M40 32 H84 V54 H40 Z M94 32 H140 V54 H94 Z M150 32 H196 V54 H150 Z M206 32 H250 Q260 32 266 40 L282 58 H206 Z"/>
          <path d="M18 92 H50 M106 92 H222 M278 92 H304"/>
          <circle cx="78" cy="92" r="20"/><circle cx="250" cy="92" r="20"/>`
  };
  const fallback = (body) => `
    <div class="car-fallback" aria-hidden="true">
      <svg viewBox="0 0 320 124"><line class="ground" x1="0" y1="116" x2="320" y2="116"/>${SILHOUETTE[body] || SILHOUETTE.mpv}</svg>
    </div>`;

  function carCard(c) {
    const { fmt, ico, waUrl, WA_SVG } = U();
    const full = `${c.brand} ${c.name}`;
    const msg = `Halo Lala Rent Car, saya mau pesan ${full} (${fmt(c.price)}/${c.unit}).`;
    return `
      <article class="car-card" id="car-${c.id}">
        <div class="car-card__media">
          ${c.img ? `<img src="${c.img}" alt="Foto ilustrasi ${full}" loading="lazy" style="object-position:${c.pos || "center"}">` : fallback(c.body)}
        </div>
        <p class="car-card__caption">${c.img ? `${ico("image")}Foto ilustrasi model` : `${ico("camera")}Foto unit menyusul`}</p>
        <div class="car-card__body">
          <div>
            <div class="car-card__brand">${c.brand}</div>
            <h3 class="car-card__name">${c.name}</h3>
          </div>
          <div class="car-card__price">
            <strong>${fmt(c.price)}</strong>
            <span class="plate">/ ${c.unit.toUpperCase()}</span>
          </div>
          ${c.hiaceNote ? `<ul class="car-card__notes">${L.hiaceNotes.map((n) => `<li>${ico("circle-check")}<span>${n}</span></li>`).join("")}</ul>` : ""}
          <a class="btn btn--wa btn--block" href="${waUrl(msg)}" target="_blank" rel="noopener">${WA_SVG}Pesan via WhatsApp</a>
        </div>
      </article>`;
  }

  /* ---------------- Showcase armada (hero) ---------------- */
  const pad = (n) => String(n).padStart(2, "0");
  function showcaseBody(c) {
    const { fmt, ico } = U();
    return `
      <span class="sc-line sc-brand"><span>${c.brand}</span></span>
      <span class="sc-line sc-name"><span>${c.name}</span></span>
      <span class="sc-line"><span class="sc-price">
        <strong data-price="${c.price}">${fmt(c.price)}</strong>
        <span class="plate">/ ${c.unit.toUpperCase()}</span>
        ${c.hiaceNote ? `<span class="sc-chip">${ico("fuel")}${L.hiaceNotes[0]}</span>` : ""}
      </span></span>`;
  }
  function renderShowcase() {
    $("#sc-media").innerHTML = L.cars.map((c, i) => `
      <div class="sc-slide${i === 0 ? " is-active" : ""}" data-i="${i}">
        ${c.img ? `<img src="${c.img}" alt="Foto ilustrasi ${c.brand} ${c.name}" style="object-position:${c.pos || "center"}"${i ? ' loading="lazy"' : ""}>` : fallback(c.body)}
      </div>`).join("");
    $("#sc-body").innerHTML = showcaseBody(L.cars[0]);
    $("#sc-dots").innerHTML = L.cars.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-label="${c.brand} ${c.name}" data-i="${i}"></button>`).join("");
    $("#sc-link").href = `#car-${L.cars[0].id}`;
    $("#sc-count").textContent = `01 / ${pad(L.cars.length)}`;
  }

  function renderHeroRoad() {
    $("#hero-road").innerHTML = ["mpv", "van", "suv"].map((b) =>
      `<div class="hero-car"><svg viewBox="0 0 320 124">${SILHOUETTE[b]}</svg></div>`).join("");
  }

  function initShowcase() {
    const root = $("#showcase");
    if (!root) return;
    const { hasGsap, reduce, fmt } = U();
    const slides = Array.from(root.querySelectorAll(".sc-slide"));
    const dots = Array.from(root.querySelectorAll("#sc-dots button"));
    const body = $("#sc-body");
    const link = $("#sc-link");
    const bar = $("#sc-bar");
    const DUR = 3.6;
    let idx = 0, busy = false, timer = null;
    const paused = new Set();

    const drawSilhouette = (slide) => {
      if (!hasGsap || reduce) return;
      const parts = slide.querySelectorAll(".car-fallback path:not(.ground), .car-fallback circle");
      parts.forEach((p) => { const l = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }); });
    };

    function go(next, dir = 1) {
      next = (next + slides.length) % slides.length;
      if (next === idx || busy) return;
      const prev = idx, from = L.cars[prev].price, car = L.cars[next];
      idx = next;
      dots.forEach((d, i) => d.setAttribute("aria-selected", i === idx));
      $("#sc-count").textContent = `${pad(idx + 1)} / ${pad(slides.length)}`;
      link.href = `#car-${car.id}`;
      const inS = slides[idx], outS = slides[prev];
      if (!hasGsap || reduce) {
        outS.classList.remove("is-active"); inS.classList.add("is-active");
        body.innerHTML = showcaseBody(car); U().refreshIcons();
        return restart();
      }
      busy = true;
      inS.classList.add("is-active");
      gsap.set(inS, { zIndex: 2 });
      gsap.set(outS, { zIndex: 1 });
      const img = inS.querySelector("img");
      const tl = gsap.timeline({ onComplete: () => { outS.classList.remove("is-active"); gsap.set([inS, outS], { clearProps: "zIndex,clipPath" }); busy = false; } });
      tl.fromTo(inS, { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.9, ease: "expo.inOut" }, 0);
      if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4, ease: "expo.out" }, 0);
      tl.add(() => drawSilhouette(inS), 0.2);
      // teks keluar → ganti → masuk
      tl.to(body.querySelectorAll(".sc-line > *"), { yPercent: -110, duration: 0.35, ease: "power2.in", stagger: 0.04 }, 0)
        .add(() => {
          body.innerHTML = showcaseBody(car);
          U().refreshIcons();
          const price = body.querySelector("[data-price]");
          const o = { v: from };
          gsap.to(o, { v: car.price, duration: 0.8, ease: "power2.out", onUpdate: () => { price.textContent = fmt(Math.round(o.v / 1000) * 1000); } });
          gsap.from(body.querySelectorAll(".sc-line > *"), { yPercent: 110, duration: 0.7, ease: "expo.out", stagger: 0.06 });
        }, 0.38);
      restart();
    }

    function restart() {
      if (timer) timer.kill();
      if (reduce || !hasGsap) return;
      timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: "none", onComplete: () => go(idx + 1) });
      if (paused.size) timer.pause();
    }
    const pause = (k) => { paused.add(k); if (timer) timer.pause(); };
    const resume = (k) => { paused.delete(k); if (!paused.size && timer) timer.resume(); };

    dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.i, +d.dataset.i > idx ? 1 : -1)));
    if (window.matchMedia("(hover: hover)").matches) {
      root.addEventListener("mouseenter", () => pause("hover"));
      root.addEventListener("mouseleave", () => resume("hover"));
    }
    root.addEventListener("focusin", () => pause("focus"));
    root.addEventListener("focusout", () => resume("focus"));
    document.addEventListener("visibilitychange", () => (document.hidden ? pause("tab") : resume("tab")));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => (en.isIntersecting ? resume("view") : pause("view")), { threshold: 0.2 }).observe(root);
    }

    // Swipe di HP
    let sx = null, sy = 0, swiped = false;
    root.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiped = false; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; go(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }
      sx = null;
    });

    // Klik kartu → scroll ke mobil yang sama di Armada + highlight
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (swiped) { swiped = false; return; }
      const target = document.getElementById(`car-${L.cars[idx].id}`);
      if (!target) return;
      const flash = () => { target.classList.remove("is-highlight"); void target.offsetWidth; target.classList.add("is-highlight"); };
      // Posisi layout (offsetTop tidak terpengaruh transform animasi reveal)
      let y = 0;
      for (let el = target; el; el = el.offsetParent) y += el.offsetTop;
      y -= (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 78) + 20;
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(Math.max(0, y), { duration: 1.4, onComplete: flash });
      else { window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" }); setTimeout(flash, 700); }
    });

    drawSilhouette(slides[0]);
    restart();
  }

  function init() {
    const { ico } = U();

    renderShowcase();
    renderHeroRoad();

    $("#areas").innerHTML = L.areas.map((a) => `<span class="marquee__item">${a} <i></i></span>`).join("");

    $("#car-grid").innerHTML = L.cars.map(carCard).join("");

    $("#steps").insertAdjacentHTML("beforeend", L.steps.map((s, i) => `
      <div class="step">
        <span class="step__dot">${ico(s.icon)}</span>
        <span class="step__n">Langkah 0${i + 1}</span>
        <h3>${s.title}</h3>
      </div>`).join(""));

    $("#svc-grid").innerHTML = L.services.map((s, i) => `
      <article class="svc-card">
        <div class="svc-card__media"><img src="${s.img}" alt="" loading="lazy" data-parallax="10"></div>
        <div class="svc-card__head">
          <span class="svc-card__icon">${ico(s.icon)}</span>
          <div>
            <span class="svc-card__n">0${i + 1}</span>
            <h3>${s.title}</h3>
            ${s.sub ? `<p>${s.sub}</p>` : ""}
          </div>
        </div>
      </article>`).join("");

    $("#why-grid").innerHTML = L.reasons.map((r, i) => `
      <div class="why">
        <span class="why__num">0${i + 1}</span>
        <span class="why__icon">${ico(r.icon)}</span>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
      </div>`).join("");

    $("#faq-list").innerHTML = L.faqs.map((f) => `
      <div class="faq__item">
        <button class="faq__q" type="button">${f.q}<span class="faq__icon" aria-hidden="true"></span></button>
        <div class="faq__a"><div>${f.a}</div></div>
      </div>`).join("");

    $("#contact-list").innerHTML = [
      ...C.wa.map((w) => `
        <a class="contact-item contact-item--wa" href="${U().waUrl("", w.intl)}" target="_blank" rel="noopener">
          <span class="contact-item__icon">${U().WA_SVG}</span>
          <span><small>WhatsApp</small><strong>${w.display}</strong></span>
        </a>`),
      `<div class="contact-item"><span class="contact-item__icon">${ico("map-pin")}</span><span><small>Alamat</small><strong>${C.address}</strong></span></div>`,
      `<div class="contact-item"><span class="contact-item__icon">${ico("route")}</span><span><small>Area layanan</small><strong>${C.area}</strong></span></div>`
    ].join("");
  }

  function afterReveal() {
    const { hasGsap, reduce } = U();
    initShowcase();
    const steps = Array.from(document.querySelectorAll("#steps .step"));
    const path = $(".route__draw");
    if (hasGsap && !reduce && path) {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: {
          trigger: "#steps", start: "top 75%", end: "bottom 55%", scrub: 0.6,
          onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle("is-on", self.progress >= i / steps.length + 0.02))
        }
      });
      if (window.innerWidth < 900) steps.forEach((s) => ScrollTrigger.create({ trigger: s, start: "top 75%", onEnter: () => s.classList.add("is-on") }));
      // Siluet mobil "tergambar" saat terlihat
      document.querySelectorAll("#car-grid .car-fallback svg").forEach((svg) => {
        const parts = svg.querySelectorAll("path:not(.ground), circle");
        parts.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
        gsap.to(parts, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: 0.08, scrollTrigger: { trigger: svg, start: "top 85%", once: true } });
      });
    } else steps.forEach((s) => s.classList.add("is-on"));
  }

  window.LalaPage = { init, afterReveal };
})();
