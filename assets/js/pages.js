/* ==========================================================================
   Lala Rent Car — Page logic
   Beranda · Armada (filter) · Detail mobil (kalkulator) · Booking (→ WhatsApp)
   Panduan (tabs/TOC) · Kontak (status buka)
   ========================================================================== */
(function () {
  "use strict";
  const L = window.LALA;
  const C = L.config;
  const U = () => window.LalaUI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const page = document.body.dataset.page;

  /* ---------------- Shared: pricing ---------------- */
  function calc({ car, mode, days, zone, bbm }) {
    if (mode === "lepas" && !car.lepas) mode = "sopir";
    const rate = mode === "lepas" ? car.lepas : car.sopir;
    const sub = rate * days;
    const d = L.discounts.find((x) => days >= x.minDays);
    const discPct = d ? d.pct : 0;
    const disc = Math.round((sub * discPct) / 100);
    const z = L.zones.find((x) => x.id === zone) || L.zones[0];
    const zoneFee = z.fee;
    const bbmFee = mode === "sopir" && bbm ? car.bbm * days : 0;
    return {
      mode, rate, sub, discPct, discLabel: d ? d.label : "", disc, zone: z, zoneFee, bbmFee,
      total: sub - disc + zoneFee + bbmFee,
      unit: mode === "lepas" ? "24 jam" : "12 jam",
      modeLabel: mode === "lepas" ? "Lepas Kunci" : "Dengan Sopir"
    };
  }

  const tomorrowISO = () => {
    const d = new Date(Date.now() + 864e5);
    return d.toISOString().slice(0, 10);
  };
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (iso, time) => {
    if (!iso) return "-";
    const d = new Date(`${iso}T${time || "08:00"}:00`);
    return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + (time ? ` · ${time}` : "");
  };
  const endDate = (iso, time, days, mode) => {
    if (!iso) return "-";
    const start = new Date(`${iso}T${time || "08:00"}:00`);
    const hrs = mode === "lepas" ? days * 24 : (days - 1) * 24 + 12;
    const end = new Date(start.getTime() + hrs * 36e5);
    const hh = String(end.getHours()).padStart(2, "0") + ":" + String(end.getMinutes()).padStart(2, "0");
    return end.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + ` · ${hh}`;
  };
  const TIMES = Array.from({ length: 17 }, (_, i) => String(i + 6).padStart(2, "0") + ":00");

  /* ---------------- Shared: car card ---------------- */
  function carCard(c) {
    const { fmtK, ico } = U();
    const lepas = !!c.lepas;
    return `
      <article class="car-card" data-id="${c.id}" data-type="${c.type}" data-cursor="view">
        <div class="car-card__media">
          <img src="${c.img}" alt="${c.brand} ${c.name}" loading="lazy" style="object-position:${c.pos || "center"}">
          <div class="car-card__tags">
            <span class="tag">${c.type}</span>
            ${c.badge ? `<span class="tag tag--sunset">${ico("sparkles")}${c.badge}</span>` : ""}
          </div>
          <span class="plate car-card__plate">${c.plate}<small>08·29</small></span>
        </div>
        <div class="car-card__body">
          <div class="car-card__head">
            <div>
              <div class="car-card__brand">${c.brand} · ${c.year}</div>
              <h3 class="car-card__name">${c.name}</h3>
            </div>
            <span class="car-card__rating">${ico("star")} ${c.rating.toFixed(1)}</span>
          </div>
          <div class="specs">
            <span class="spec">${ico("users")}${c.seats} kursi</span>
            <span class="spec">${ico("cog")}${c.trans}</span>
            <span class="spec">${ico("fuel")}${c.fuel}</span>
          </div>
          <div class="car-card__foot">
            <div class="price">
              <small>${lepas ? "Lepas kunci mulai" : "Dengan sopir mulai"}</small>
              <strong>${fmtK(lepas ? c.lepas : c.sopir)}</strong> <span>/${lepas ? "24 jam" : "12 jam"}</span>
            </div>
            <span class="car-card__go" aria-hidden="true">${ico("arrow-up-right")}</span>
          </div>
        </div>
        <a class="car-card__link" href="mobil.html?id=${c.id}" aria-label="Lihat detail ${c.brand} ${c.name}"></a>
      </article>`;
  }

  /* ======================================================================
     BERANDA
     ====================================================================== */
  function initHome() {
    const featured = $("#featured");
    if (featured) featured.innerHTML = [...L.cars].sort((a, b) => a.popular - b.popular).slice(0, 6).map(carCard).join("");

    // Quick booking widget
    const q = $("#quick");
    if (q) {
      q.car.innerHTML = L.cars.map((c) => `<option value="${c.id}">${c.brand} ${c.name}</option>`).join("");
      q.car.value = "innova-reborn";
      q.date.min = todayISO();
      q.date.value = tomorrowISO();
      q.addEventListener("submit", (e) => {
        e.preventDefault();
        const p = new URLSearchParams({ car: q.car.value, mode: q.mode.value, date: q.date.value, dur: q.dur.value });
        location.href = "booking.html?" + p.toString();
      });
    }

    // Testimonials
    const track = $(".testi-track");
    if (track) {
      track.innerHTML = L.testimonials.map((t) => `
        <article class="testi">
          <div class="stars" aria-label="5 dari 5 bintang">${'<i data-lucide="star"></i>'.repeat(5)}</div>
          <blockquote>${t.text}</blockquote>
          <div class="testi__who">
            <span class="avatar" style="background:${t.color}">${t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
            <div><strong>${t.name}</strong><span>${t.role} · ${t.car}</span></div>
          </div>
        </article>`).join("");
      const step = () => ($(".testi", track)?.offsetWidth || 400) + 20;
      $("[data-testi-prev]")?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
      $("[data-testi-next]")?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
      // drag to scroll (desktop)
      let down = false, sx = 0, sl = 0;
      track.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = track.scrollLeft; track.style.scrollSnapType = "none"; });
      window.addEventListener("pointerup", () => { if (!down) return; down = false; track.style.scrollSnapType = ""; });
      track.addEventListener("pointermove", (e) => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
    }

    const faq = $("#home-faq");
    if (faq) U().renderFaq(faq, L.faqs.slice(0, 5));
  }

  function homeAfterReveal() {
    const { hasGsap, reduce, finePointer } = U();
    // Route line draw + steps light up
    const path = $(".route__draw");
    const steps = $$(".route .step");
    if (hasGsap && !reduce && path) {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: {
          trigger: ".route", start: "top 75%", end: "bottom 55%", scrub: 0.6,
          onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle("is-on", self.progress >= i / steps.length + 0.02))
        }
      });
      if (window.innerWidth < 900) steps.forEach((s) => ScrollTrigger.create({ trigger: s, start: "top 70%", onEnter: () => s.classList.add("is-on") }));
    } else steps.forEach((s) => s.classList.add("is-on"));

    // Service list hover preview
    const prev = $(".svc__preview");
    if (prev && finePointer && hasGsap && !reduce) {
      const img = $("img", prev);
      const xTo = gsap.quickTo(prev, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(prev, "y", { duration: 0.6, ease: "power3.out" });
      $$(".svc").forEach((row) => {
        row.addEventListener("mouseenter", () => { img.src = row.dataset.img; gsap.to(prev, { opacity: 1, scale: 1, rotate: -3, duration: 0.5, ease: "expo.out" }); });
        row.addEventListener("mouseleave", () => gsap.to(prev, { opacity: 0, scale: 0.8, rotate: 0, duration: 0.4, ease: "power3.out" }));
        row.addEventListener("mousemove", (e) => { xTo(e.clientX + 30); yTo(e.clientY - 120); });
      });
    }
  }

  /* ======================================================================
     ARMADA (katalog + filter)
     ====================================================================== */
  function initArmada() {
    const grid = $("#catalog");
    const state = { type: U().qs("type") || "Semua", q: "", sort: "popular", trans: "all", lepas: false, big: false };
    const types = ["Semua", ...Array.from(new Set(L.cars.map((c) => c.type)))];
    const chips = $("#type-chips");
    const typeIcon = { Semua: "layout-grid", "City Car": "car", Sedan: "car-front", MPV: "users", SUV: "mountain", Premium: "gem", Van: "bus" };
    chips.innerHTML = types.map((t) => {
      const n = t === "Semua" ? L.cars.length : L.cars.filter((c) => c.type === t).length;
      return `<button class="chip${t === state.type ? " is-active" : ""}" data-type="${t}" type="button">${U().ico(typeIcon[t] || "car")}${t}<span class="count">${n}</span></button>`;
    }).join("");
    grid.innerHTML = L.cars.map(carCard).join("");

    const matches = (c) => {
      if (state.type !== "Semua" && c.type !== state.type) return false;
      if (state.trans !== "all" && c.trans !== state.trans) return false;
      if (state.lepas && !c.lepas) return false;
      if (state.big && c.seats < 7) return false;
      if (state.q) {
        const hay = `${c.brand} ${c.name} ${c.type} ${c.fuel} ${c.trans}`.toLowerCase();
        if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    };
    const price = (c) => c.lepas || c.sopir;
    const sorters = {
      popular: (a, b) => a.popular - b.popular,
      cheap: (a, b) => price(a) - price(b),
      pricey: (a, b) => price(b) - price(a),
      seats: (a, b) => b.seats - a.seats
    };

    function apply(animate = true) {
      const { hasGsap, reduce } = U();
      const cards = $$(".car-card", grid);
      const flipState = animate && hasGsap && window.Flip && !reduce ? Flip.getState(cards) : null;
      const sorted = [...L.cars].sort(sorters[state.sort]);
      let shown = 0;
      sorted.forEach((c) => {
        const el = $(`.car-card[data-id="${c.id}"]`, grid);
        grid.append(el);
        const ok = matches(c);
        el.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      $("#result-count").innerHTML = `Menampilkan <b>${shown}</b> dari ${L.cars.length} unit`;
      $(".empty").classList.toggle("is-visible", shown === 0);
      if (flipState) {
        Flip.from(flipState, {
          duration: 0.75, ease: "expo.inOut", absolute: true, scale: false, nested: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out", delay: 0.15 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.4 }),
          onComplete: () => ScrollTrigger.refresh()
        });
      }
      const url = new URL(location.href);
      state.type === "Semua" ? url.searchParams.delete("type") : url.searchParams.set("type", state.type);
      history.replaceState(null, "", url);
    }

    chips.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", chips).forEach((c) => c.classList.toggle("is-active", c === b));
      state.type = b.dataset.type;
      apply();
    });
    let t;
    $("#search").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); apply(); }, 180); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; apply(); });
    $("#trans").addEventListener("change", (e) => { state.trans = e.target.value; apply(); });
    $("#f-lepas").addEventListener("change", (e) => { state.lepas = e.target.checked; apply(); });
    $("#f-big").addEventListener("change", (e) => { state.big = e.target.checked; apply(); });
    $$("[data-reset]").forEach((b) => b.addEventListener("click", () => {
      Object.assign(state, { type: "Semua", q: "", sort: "popular", trans: "all", lepas: false, big: false });
      $("#search").value = ""; $("#sort").value = "popular"; $("#trans").value = "all"; $("#f-lepas").checked = false; $("#f-big").checked = false;
      $$(".chip", chips).forEach((c) => c.classList.toggle("is-active", c.dataset.type === "Semua"));
      apply();
    }));
    apply(false);
  }

  /* ======================================================================
     DETAIL MOBIL
     ====================================================================== */
  function initDetail() {
    const { fmt, fmtK, ico, qs, carById, WA_SVG } = U();
    const car = carById(qs("id")) || L.cars[3];
    document.title = `${car.brand} ${car.name} — Sewa di Jakarta | Lala Rent Car`;
    const root = $("#detail");
    const z = L.zones;
    const hasLepas = !!car.lepas;
    const st = { mode: hasLepas ? "lepas" : "sopir", days: 1, zone: "jaksel", bbm: false, date: tomorrowISO(), time: "08:00" };

    const rateRows = (mode) => {
      const r = mode === "lepas" ? car.lepas : car.sopir;
      if (!r) return `<tr><td>${mode === "lepas" ? "Lepas Kunci" : "Dengan Sopir"}</td><td class="na">Tidak tersedia</td><td class="na">—</td><td class="na">—</td></tr>`;
      return `<tr><td>${mode === "lepas" ? "Lepas Kunci <span class='muted small'>/24 jam</span>" : "Dengan Sopir <span class='muted small'>/12 jam</span>"}</td>
        <td><strong>${fmt(r)}</strong></td><td><strong>${fmt(r * 7 * 0.9)}</strong></td><td><strong>${fmt(r * 30 * 0.8)}</strong></td></tr>`;
    };

    root.innerHTML = `
      <div class="container">
        <nav class="crumb" aria-label="Breadcrumb"><a href="index.html">Beranda</a>${ico("chevron-right")}<a href="armada.html">Armada</a>${ico("chevron-right")}<span>${car.brand} ${car.name}</span></nav>
        <div class="detail__grid">
          <div>
            <div class="gallery" data-reveal="fade">
              <div class="gallery__main" data-cursor="view">
                <span class="tag tag--ink">${car.type}</span>
                <img src="${car.gallery[0]}" alt="${car.brand} ${car.name}" style="object-position:${car.pos}" id="g-main">
                <span class="tag gallery__count">${ico("images")}<span id="g-idx">1</span>/${car.gallery.length}</span>
              </div>
              <div class="gallery__thumbs">${car.gallery.map((g, i) => `<button type="button" class="${i === 0 ? "is-active" : ""}" data-src="${g}" data-pos="${i === 0 ? car.pos : "center"}" aria-label="Foto ${i + 1}"><img src="${g}" alt="" loading="lazy" style="object-position:${i === 0 ? car.pos : "center"}"></button>`).join("")}</div>
            </div>

            <div class="detail__title">
              <div>
                <div class="car-card__brand">${car.brand} · ${car.year}</div>
                <h1 class="h1" data-split>${car.name.split(" ")[0]} <span class="serif accent">${car.name.split(" ").slice(1).join(" ") || ""}</span></h1>
              </div>
              <span class="plate plate--lg">${car.plate}<small>08·29</small></span>
            </div>
            <div class="flex wrap gap-12 items-center">
              <span class="car-card__rating">${ico("star")} ${car.rating.toFixed(1)} <span class="muted">· ${car.trips} perjalanan</span></span>
              ${car.badge ? `<span class="tag tag--sunset">${ico("sparkles")}${car.badge}</span>` : ""}
              ${hasLepas ? `<span class="tag tag--line">${ico("key-round")}Bisa lepas kunci</span>` : `<span class="tag tag--line">${ico("user-check")}Wajib dengan sopir</span>`}
            </div>
            <p class="lead mt-24">${car.blurb}</p>

            <div class="spec-grid" data-reveal="stagger">
              <div class="spec-box">${ico("users")}<div><small>Kapasitas</small><strong>${car.seats} penumpang</strong></div></div>
              <div class="spec-box">${ico("cog")}<div><small>Transmisi</small><strong>${car.trans}</strong></div></div>
              <div class="spec-box">${ico("fuel")}<div><small>Bahan bakar</small><strong>${car.fuel}</strong></div></div>
              <div class="spec-box">${ico("gauge")}<div><small>Mesin</small><strong>${car.cc}</strong></div></div>
              <div class="spec-box">${ico("luggage")}<div><small>Bagasi</small><strong>${car.bags} koper besar</strong></div></div>
              <div class="spec-box">${ico("calendar")}<div><small>Tahun</small><strong>${car.year}</strong></div></div>
            </div>

            <div class="block" data-reveal>
              <h3>Tarif sewa</h3>
              <div style="overflow-x:auto">
              <table class="rate-table">
                <thead><tr><th>Layanan</th><th>Harian</th><th>Mingguan <span style="color:var(--sunset)">-10%</span></th><th>Bulanan <span style="color:var(--sunset)">-20%</span></th></tr></thead>
                <tbody>${rateRows("lepas")}${rateRows("sopir")}</tbody>
              </table>
              </div>
              <p class="note mt-16">${ico("info")}<span>Tarif dengan sopir sudah termasuk jasa & uang makan sopir dalam kota. Belum termasuk BBM, tol, dan parkir (opsi All-in BBM tersedia).</span></p>
            </div>

            <div class="block" data-reveal>
              <h3>Sudah termasuk</h3>
              <ul class="include-list">
                <li>${ico("circle-check")}Asuransi all-risk</li>
                <li>${ico("circle-check")}Unit dicuci & disanitasi sebelum serah terima</li>
                <li>${ico("circle-check")}Bantuan darurat 24 jam</li>
                <li>${ico("circle-check")}Unit pengganti jika ada kendala teknis</li>
                <li>${ico("circle-check")}Antar-jemput gratis area Jakarta Selatan</li>
                <li class="no">${ico("circle-x")}BBM, tol & parkir (bisa ditambahkan)</li>
              </ul>
            </div>

            <div class="block" data-reveal>
              <h3>Syarat singkat</h3>
              <div class="doc-grid">
                <div class="doc"><span class="doc__icon">${ico("id-card")}</span><div><strong>Lepas kunci</strong><p>KTP, SIM A aktif, Kartu Keluarga, 1 dokumen pendukung & deposit.</p></div></div>
                <div class="doc"><span class="doc__icon">${ico("user-check")}</span><div><strong>Dengan sopir</strong><p>Cukup KTP penanggung jawab. Tanpa deposit.</p></div></div>
              </div>
              <a href="panduan.html#syarat" class="link-arrow mt-16">Lihat panduan lengkap ${ico("arrow-right")}</a>
            </div>
          </div>

          <aside class="book-card" aria-label="Kalkulator harga">
            <div>
              <div class="muted small">Mulai dari</div>
              <div class="book-card__price"><strong id="bc-rate">${fmt(hasLepas ? car.lepas : car.sopir)}</strong><span class="muted" id="bc-unit">/${hasLepas ? "24 jam" : "12 jam"}</span></div>
            </div>
            <div class="seg" role="tablist" aria-label="Jenis layanan">
              <span class="seg__thumb"></span>
              <button type="button" role="tab" data-mode="lepas" ${hasLepas ? "" : "disabled"}>Lepas Kunci<small>${hasLepas ? "setir sendiri" : "tidak tersedia"}</small></button>
              <button type="button" role="tab" data-mode="sopir">Dengan Sopir<small>12 jam/hari</small></button>
            </div>
            <div class="form-grid form-grid--2">
              <div class="field"><label for="bc-date">Tanggal mulai</label><input class="input" type="date" id="bc-date" min="${todayISO()}" value="${st.date}"></div>
              <div class="field"><label for="bc-time">Jam</label><select class="select" id="bc-time">${TIMES.map((t) => `<option${t === st.time ? " selected" : ""}>${t}</option>`).join("")}</select></div>
            </div>
            <div class="field"><span class="field__label">Durasi <em id="bc-dur-unit">hari (24 jam)</em></span>
              <div class="qty"><button type="button" data-q="-1" aria-label="Kurangi">${ico("minus")}</button><output id="bc-days">1 hari</output><button type="button" data-q="1" aria-label="Tambah">${ico("plus")}</button></div>
            </div>
            <div class="field"><label for="bc-zone">Antar / jemput unit</label><select class="select" id="bc-zone">${z.map((x) => `<option value="${x.id}"${x.id === st.zone ? " selected" : ""}>${x.label}${x.fee ? " (+" + fmtK(x.fee) + ")" : " (gratis)"}</option>`).join("")}</select></div>
            <label class="checkbox" id="bc-bbm-wrap" hidden><input type="checkbox" id="bc-bbm"><span><b>All-in BBM</b> — bensin/solar ditanggung kami (+${fmtK(car.bbm)}/hari)</span></label>
            <div class="summary" id="bc-summary"></div>
            <a class="btn btn--primary btn--lg btn--block" id="bc-go" href="booking.html" data-magnetic>Lanjut Pesan ${ico("arrow-right", "arrow")}</a>
            <a class="btn btn--wa btn--block" id="bc-wa" target="_blank" rel="noopener">${WA_SVG} Tanya unit ini via WhatsApp</a>
            <div class="trust-row"><span>${ico("shield-check")}Tanpa biaya tersembunyi</span><span>${ico("undo-2")}Reschedule gratis 1x</span></div>
          </aside>
        </div>
      </div>`;

    // Similar cars
    const sim = $("#similar");
    if (sim) sim.innerHTML = L.cars.filter((c) => c.id !== car.id).sort((a, b) => (a.type === car.type ? -1 : 0) - (b.type === car.type ? -1 : 0) || a.popular - b.popular).slice(0, 3).map(carCard).join("");

    // Gallery
    const main = $("#g-main");
    $$(".gallery__thumbs button").forEach((b, i) => b.addEventListener("click", () => {
      $$(".gallery__thumbs button").forEach((x) => x.classList.toggle("is-active", x === b));
      $("#g-idx").textContent = i + 1;
      const swap = () => { main.src = b.dataset.src; main.style.objectPosition = b.dataset.pos; };
      if (U().hasGsap && !U().reduce) gsap.timeline().to(main, { opacity: 0, scale: 1.04, duration: 0.25 }).add(swap).to(main, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
      else swap();
    }));

    // Calculator
    const seg = $(".seg");
    const thumb = $(".seg__thumb", seg);
    const moveThumb = () => {
      const active = $(`button[data-mode="${st.mode}"]`, seg);
      $$("button", seg).forEach((b) => b.classList.toggle("is-active", b === active));
      thumb.style.width = active.offsetWidth + "px";
      thumb.style.transform = `translateX(${active.offsetLeft - 5}px)`;
    };
    const update = () => {
      const r = calc({ car, ...st });
      st.mode = r.mode;
      moveThumb();
      $("#bc-rate").textContent = fmt(r.rate);
      $("#bc-unit").textContent = "/" + r.unit;
      $("#bc-days").textContent = `${st.days} hari`;
      $("#bc-dur-unit").textContent = st.mode === "lepas" ? "hari (24 jam)" : "hari (12 jam/hari)";
      $("#bc-bbm-wrap").hidden = st.mode !== "sopir";
      $("#bc-summary").innerHTML = `
        <div class="summary__row"><span>${fmt(r.rate)} × ${st.days} hari</span><span>${fmt(r.sub)}</span></div>
        ${r.disc ? `<div class="summary__row"><span>Diskon ${r.discLabel} (${r.discPct}%)</span><span style="color:var(--sunset)">− ${fmt(r.disc)}</span></div>` : ""}
        <div class="summary__row"><span>Antar / jemput</span><span>${r.zoneFee ? fmt(r.zoneFee) : "Gratis"}</span></div>
        ${r.bbmFee ? `<div class="summary__row"><span>All-in BBM</span><span>${fmt(r.bbmFee)}</span></div>` : ""}
        <div class="summary__row"><span>Selesai</span><span>${endDate(st.date, st.time, st.days, st.mode)}</span></div>
        <div class="summary__total"><span>Estimasi total</span><strong>${fmt(r.total)}</strong></div>
        ${!r.disc && st.days < 7 ? `<p class="note">${ico("percent")}<span>Sewa 7 hari hemat 10%, 30 hari hemat 20%.</span></p>` : ""}`;
      U().refreshIcons();
      const p = new URLSearchParams({ car: car.id, mode: st.mode, date: st.date, time: st.time, dur: st.days, zone: st.zone, bbm: st.bbm ? 1 : 0 });
      $("#bc-go").href = "booking.html?" + p.toString();
      $("#bc-wa").href = U().waUrl(`Halo Lala Rent Car, saya tertarik dengan *${car.brand} ${car.name}* (${r.modeLabel}) untuk tanggal ${fmtDate(st.date, st.time)} selama ${st.days} hari. Apakah unitnya tersedia?`);
    };
    seg.addEventListener("click", (e) => { const b = e.target.closest("button[data-mode]"); if (!b || b.disabled) return; st.mode = b.dataset.mode; update(); });
    $$(".qty button").forEach((b) => b.addEventListener("click", () => { st.days = Math.min(60, Math.max(1, st.days + parseInt(b.dataset.q, 10))); update(); }));
    $("#bc-date").addEventListener("change", (e) => { st.date = e.target.value; update(); });
    $("#bc-time").addEventListener("change", (e) => { st.time = e.target.value; update(); });
    $("#bc-zone").addEventListener("change", (e) => { st.zone = e.target.value; update(); });
    $("#bc-bbm").addEventListener("change", (e) => { st.bbm = e.target.checked; update(); });
    window.addEventListener("resize", moveThumb);
    update();
    requestAnimationFrame(moveThumb);
  }

  /* ======================================================================
     BOOKING (3 langkah → WhatsApp)
     ====================================================================== */
  function initBooking() {
    const { fmt, fmtK, ico, qs, carById, waUrl } = U();
    const f = $("#booking-form");
    const st = {
      step: 1,
      car: carById(qs("car")) ? qs("car") : "",
      mode: qs("mode") === "sopir" ? "sopir" : "lepas",
      date: qs("date") || tomorrowISO(),
      time: TIMES.includes(qs("time")) ? qs("time") : "08:00",
      days: Math.min(60, Math.max(1, parseInt(qs("dur") || "1", 10) || 1)),
      zone: L.zones.some((z) => z.id === qs("zone")) ? qs("zone") : "jaksel",
      bbm: qs("bbm") === "1"
    };

    // Build car picker
    $("#car-pick").innerHTML = L.cars.map((c) => `
      <label><input type="radio" name="car" value="${c.id}"${c.id === st.car ? " checked" : ""}>
        <img src="${c.img}" alt="" loading="lazy" style="object-position:${c.pos}">
        <strong>${c.brand} ${c.name}</strong><small>${c.seats} kursi · ${c.trans} · ${fmtK(c.lepas || c.sopir)}</small></label>`).join("");
    f.date.min = todayISO();
    f.date.value = st.date;
    f.time.innerHTML = TIMES.map((t) => `<option${t === st.time ? " selected" : ""}>${t}</option>`).join("");
    f.zone.innerHTML = L.zones.map((z) => `<option value="${z.id}"${z.id === st.zone ? " selected" : ""}>${z.label}${z.fee ? " (+" + fmtK(z.fee) + ")" : " (gratis)"}</option>`).join("");
    f.bbm.checked = st.bbm;

    const seg = $(".seg", f);
    const thumb = $(".seg__thumb", seg);
    const getCar = () => carById(st.car);

    function moveThumb() {
      const active = $(`button[data-mode="${st.mode}"]`, seg);
      $$("button", seg).forEach((b) => b.classList.toggle("is-active", b === active));
      if (active.offsetWidth) { thumb.style.width = active.offsetWidth + "px"; thumb.style.transform = `translateX(${active.offsetLeft - 5}px)`; }
    }

    function readForm() {
      st.car = (f.querySelector("input[name=car]:checked") || {}).value || "";
      st.date = f.date.value;
      st.time = f.time.value;
      st.zone = f.zone.value;
      st.bbm = f.bbm.checked;
    }

    function summaryHTML() {
      const car = getCar();
      if (!car) return `<p class="muted small">Pilih mobil untuk melihat estimasi harga.</p>`;
      const r = calc({ car, mode: st.mode, days: st.days, zone: st.zone, bbm: st.bbm });
      return `
        <div class="summary__row"><span>Layanan</span><span>${r.modeLabel}</span></div>
        <div class="summary__row"><span>Mulai</span><span>${fmtDate(st.date, st.time)}</span></div>
        <div class="summary__row"><span>Selesai</span><span>${endDate(st.date, st.time, st.days, r.mode)}</span></div>
        <div class="summary__row"><span>${fmt(r.rate)} × ${st.days} hari</span><span>${fmt(r.sub)}</span></div>
        ${r.disc ? `<div class="summary__row"><span>Diskon ${r.discLabel}</span><span style="color:var(--sunset)">− ${fmt(r.disc)}</span></div>` : ""}
        <div class="summary__row"><span>Antar / jemput</span><span>${r.zoneFee ? fmt(r.zoneFee) : "Gratis"}</span></div>
        ${r.bbmFee ? `<div class="summary__row"><span>All-in BBM</span><span>${fmt(r.bbmFee)}</span></div>` : ""}
        <div class="summary__total"><span>Estimasi total</span><strong>${fmt(r.total)}</strong></div>
        <div class="summary__row"><span>DP 30% untuk konfirmasi</span><span>${fmt(Math.round(r.total * 0.3 / 1000) * 1000)}</span></div>`;
    }

    function refresh() {
      readForm();
      const car = getCar();
      const lepasBtn = $('button[data-mode="lepas"]', seg);
      lepasBtn.disabled = !!car && !car.lepas;
      $("small", lepasBtn).textContent = car && !car.lepas ? "tidak tersedia" : "setir sendiri";
      if (car && !car.lepas) st.mode = "sopir";
      moveThumb();
      $("#days-out").textContent = `${st.days} hari`;
      $("#dur-unit").textContent = st.mode === "lepas" ? "hari (24 jam)" : "hari (12 jam/hari)";
      $("#bbm-wrap").hidden = st.mode !== "sopir";
      $("#addr-wrap").hidden = st.zone === "garasi";
      $("#docs-lepas").hidden = st.mode !== "lepas";
      $("#docs-sopir").hidden = st.mode !== "sopir";
      // side summary
      const side = $("#side-car");
      side.innerHTML = car
        ? `<img src="${car.img}" alt="" style="object-position:${car.pos}"><div><div class="car-card__brand">${car.brand} · ${car.type}</div><strong>${car.name}</strong></div><span class="plate">${car.plate}<small>08·29</small></span>`
        : `<div class="side-car__empty">${ico("car-front")}<span>Belum ada mobil dipilih</span></div>`;
      $("#side-summary").innerHTML = summaryHTML();
      U().refreshIcons();
    }

    function message() {
      const car = getCar();
      const r = calc({ car, mode: st.mode, days: st.days, zone: st.zone, bbm: st.bbm });
      const lines = [
        "Halo *Lala Rent Car* 👋",
        "Saya ingin memesan mobil berikut:",
        "",
        `🚗 *Mobil:* ${car.brand} ${car.name}`,
        `🧭 *Layanan:* ${r.modeLabel}${r.bbmFee ? " + All-in BBM" : ""}`,
        `📅 *Mulai:* ${fmtDate(st.date, st.time)}`,
        `⏱️ *Durasi:* ${st.days} hari (${r.unit}/hari)`,
        `📍 *Antar/jemput:* ${r.zone.label}`,
        f.address.value.trim() && st.zone !== "garasi" ? `🏠 *Alamat:* ${f.address.value.trim()}` : null,
        "",
        `👤 *Nama:* ${f.fullname.value.trim()}`,
        `📱 *No. WA:* ${f.phone.value.trim()}`,
        `🎯 *Keperluan:* ${f.purpose.value}`,
        f.notes.value.trim() ? `📝 *Catatan:* ${f.notes.value.trim()}` : null,
        "",
        `💰 *Estimasi total:* ${fmt(r.total)}`,
        `🔖 *Kode booking:* ${bookingCode}`,
        "",
        "Mohon konfirmasi ketersediaan unitnya. Terima kasih!"
      ];
      return lines.filter((x) => x !== null).join("\n");
    }

    const bookingCode = "LALA-" + Math.random().toString(36).slice(2, 6).toUpperCase();

    // Validation
    function setErr(name, bad) {
      const field = f.querySelector(`[data-field="${name}"]`);
      if (field) field.classList.toggle("has-error", bad);
      const input = f.elements[name];
      if (input && input.classList) input.classList.toggle("is-invalid", bad);
      return bad;
    }
    function validate(step) {
      readForm();
      let bad = false;
      if (step === 1) {
        bad = setErr("car", !st.car) || bad;
        bad = setErr("date", !st.date || st.date < todayISO()) || bad;
        bad = setErr("address", st.zone !== "garasi" && f.address.value.trim().length < 6) || bad;
      }
      if (step === 2) {
        bad = setErr("fullname", f.fullname.value.trim().length < 3) || bad;
        const ph = f.phone.value.replace(/[\s-]/g, "");
        bad = setErr("phone", !/^(\+62|62|0)8\d{7,12}$/.test(ph)) || bad;
        if (st.mode === "lepas") bad = setErr("docs", !f.docs.checked) || bad;
        else setErr("docs", false);
      }
      if (bad) {
        const first = f.querySelector(".has-error");
        if (first) { const top = first.getBoundingClientRect().top + window.scrollY - 120; window.__lenis ? window.__lenis.scrollTo(top) : window.scrollTo({ top, behavior: "smooth" }); }
        if (U().hasGsap && first) gsap.fromTo(first, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      }
      return !bad;
    }

    function goStep(n) {
      st.step = n;
      $$(".bstep").forEach((s) => s.classList.toggle("is-active", +s.dataset.step === n));
      const pct = n === 1 ? 0 : n === 2 ? 50 : 100;
      $(".progress__car").style.left = `calc(${pct}% - ${pct === 0 ? -14 : pct === 50 ? 27 : 112}px)`;
      $(".progress__fill").style.width = `${pct === 0 ? 12 : pct}%`;
      $$(".progress__labels span").forEach((s, i) => {
        s.classList.toggle("is-current", i + 1 === n);
        s.classList.toggle("is-done", i + 1 < n);
      });
      if (n === 3) renderReview();
      const top = $(".progress").getBoundingClientRect().top + window.scrollY - 110;
      window.__lenis ? window.__lenis.scrollTo(Math.max(0, top), { duration: 1 }) : window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      const active = $(".bstep.is-active");
      if (U().hasGsap && !U().reduce) gsap.fromTo(active.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.06 });
      requestAnimationFrame(moveThumb);
    }

    function renderReview() {
      const car = getCar();
      const r = calc({ car, mode: st.mode, days: st.days, zone: st.zone, bbm: st.bbm });
      const row = (label, val, step) => `<div class="review__row"><span>${label}</span><strong>${val}</strong><button type="button" data-goto="${step}">Ubah</button></div>`;
      $("#review").innerHTML = [
        row("Mobil", `${car.brand} ${car.name}`, 1),
        row("Layanan", r.modeLabel + (r.bbmFee ? " + All-in BBM" : ""), 1),
        row("Jadwal", `${fmtDate(st.date, st.time)} · ${st.days} hari`, 1),
        row("Antar/jemput", r.zone.label, 1),
        row("Pemesan", `${f.fullname.value.trim()} · ${f.phone.value.trim()}`, 2),
        row("Keperluan", f.purpose.value, 2)
      ].join("");
      $("#wa-preview").textContent = message().replace(/\*/g, "");
      const now = new Date();
      $("#wa-time").textContent = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + " ✓✓";
    }

    // Events
    f.addEventListener("change", (e) => {
      if (e.target.name === "car") { setErr("car", false); }
      refresh();
    });
    f.addEventListener("input", (e) => { if (e.target.classList.contains("is-invalid")) setErr(e.target.name, false); });
    seg.addEventListener("click", (e) => { const b = e.target.closest("button[data-mode]"); if (!b || b.disabled) return; st.mode = b.dataset.mode; refresh(); });
    $$(".qty button", f).forEach((b) => b.addEventListener("click", () => { st.days = Math.min(60, Math.max(1, st.days + parseInt(b.dataset.q, 10))); refresh(); }));
    $$("[data-next]").forEach((b) => b.addEventListener("click", () => { if (validate(st.step)) goStep(st.step + 1); }));
    $$("[data-prev]").forEach((b) => b.addEventListener("click", () => goStep(st.step - 1)));
    $("#review").addEventListener("click", (e) => { const b = e.target.closest("[data-goto]"); if (b) goStep(+b.dataset.goto); });

    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(1)) return goStep(1);
      if (!validate(2)) return goStep(2);
      window.open(waUrl(message()), "_blank", "noopener");
      // success state
      $$(".bstep").forEach((s) => s.classList.remove("is-active"));
      $(".progress__car").style.left = "calc(100% - 112px)";
      $(".progress__fill").style.width = "100%";
      $$(".progress__labels span").forEach((s) => { s.classList.remove("is-current"); s.classList.add("is-done"); });
      const ok = $(".success");
      $("#success-code").innerHTML = `${bookingCode}<small>KODE BOOKING</small>`;
      $("#success-name").textContent = f.fullname.value.trim().split(" ")[0];
      $("#success-wa").href = waUrl(message());
      ok.classList.add("is-visible");
      if (U().hasGsap && !U().reduce) {
        gsap.from(".success__icon", { scale: 0, rotate: -120, duration: 1.2, ease: "elastic.out(1, 0.5)" });
        gsap.from(".success > *:not(.success__icon)", { y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.2 });
      }
    });

    window.addEventListener("resize", moveThumb);
    refresh();
    goStep(1);
    if (!st.car) setTimeout(() => $("#car-pick").scrollTo?.(0, 0), 0);
  }

  /* ======================================================================
     PANDUAN (tabs + TOC)
     ====================================================================== */
  function initPanduan() {
    $$("[data-tabs]").forEach((wrap) => {
      const btns = $$(".tabs button", wrap);
      btns.forEach((b) => b.addEventListener("click", () => {
        btns.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
        $$(".tabpanel", wrap).forEach((p) => p.classList.toggle("is-active", p.id === b.dataset.tab));
        if (U().hasGsap) ScrollTrigger.refresh();
      }));
    });
    const faq = $("#full-faq");
    if (faq) U().renderFaq(faq, L.faqs);
  }
  function panduanAfter() {
    if (!U().hasGsap) return;
    const links = $$('.toc a[href^="#"]');
    links.forEach((a) => {
      const sec = $(a.getAttribute("href"));
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: "top 45%", end: "bottom 45%",
        onToggle: (self) => { if (self.isActive) links.forEach((l) => l.classList.toggle("is-active", l === a)); }
      });
    });
  }

  /* ======================================================================
     KONTAK (status buka, jam WIB)
     ====================================================================== */
  function initKontak() {
    const el = $("#open-status");
    if (!el) return;
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", hour12: false }).formatToParts(new Date());
    const wd = parts.find((p) => p.type === "weekday").value;
    const h = parseInt(parts.find((p) => p.type === "hour").value, 10);
    const weekend = wd === "Sat" || wd === "Sun";
    const open = h >= 6 && h < (weekend ? 23 : 22);
    el.innerHTML = open ? `<i></i>Garasi buka sekarang` : `<i style="background:var(--sand-2)"></i>Garasi tutup · WhatsApp tetap aktif 24 jam`;
    if (!open) el.style.cssText = "background:var(--cream);color:var(--ink-4)";
  }

  window.LalaPage = {
    init() {
      if (page === "home") initHome();
      if (page === "armada") initArmada();
      if (page === "detail") initDetail();
      if (page === "booking") initBooking();
      if (page === "panduan") initPanduan();
      if (page === "kontak") initKontak();
    },
    afterReveal() {
      if (page === "home") homeAfterReveal();
      if (page === "panduan") panduanAfter();
    }
  };
})();
