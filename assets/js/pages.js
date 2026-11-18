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
      <article class="car-card">
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

  function init() {
    const { ico } = U();

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
      document.querySelectorAll(".car-fallback svg").forEach((svg) => {
        const parts = svg.querySelectorAll("path:not(.ground), circle");
        parts.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
        gsap.to(parts, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: 0.08, scrollTrigger: { trigger: svg, start: "top 85%", once: true } });
      });
    } else steps.forEach((s) => s.classList.add("is-on"));
  }

  window.LalaPage = { init, afterReveal };
})();
