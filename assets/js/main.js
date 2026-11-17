/* ==========================================================================
   Lala Rent Car — Shell (header, menu, footer, WA) + motion engine
   Depends on: data.js, lucide (icons), gsap + ScrollTrigger (+ Flip), lenis
   ========================================================================== */
(function () {
  "use strict";

  const L = window.LALA;
  const C = L.config;
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (!hasGsap) doc.classList.add("no-gsap");
  if (reduce) doc.classList.add("no-motion");
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap && window.Flip) gsap.registerPlugin(Flip);

  /* ---------------- Helpers ---------------- */
  const fmt = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const fmtK = (n) => {
    if (n >= 1e6) return "Rp " + (n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " jt";
    return "Rp " + Math.round(n / 1000) + "rb";
  };
  const waUrl = (text) => `https://wa.me/${C.wa}?text=${encodeURIComponent(text || "Halo Lala Rent Car, saya ingin bertanya tentang sewa mobil.")}`;
  const ico = (name, cls = "") => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ""} aria-hidden="true"></i>`;
  const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  const refreshIcons = () => { if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 1.75 } }); };
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const carById = (id) => L.cars.find((c) => c.id === id);

  /* ---------------- Shell markup ---------------- */
  const NAV = [
    ["index.html", "Beranda", "home"],
    ["armada.html", "Armada", "armada"],
    ["layanan.html", "Layanan", "layanan"],
    ["panduan.html", "Panduan Sewa", "panduan"],
    ["kontak.html", "Kontak", "kontak"]
  ];
  const page = document.body.dataset.page || "";
  const activeKey = page === "detail" ? "armada" : page;

  const logo = `
    <span class="logo__mark" aria-hidden="true"></span>
    <span class="logo__text"><span class="logo__name">lala</span><span class="logo__sub">Rent Car</span></span>`;

  function renderShell() {
    const navLinks = NAV.map(([href, label, key]) =>
      `<a href="${href}"${key === activeKey ? ' aria-current="page"' : ""}>${label}</a>`).join("");

    const header = document.createElement("header");
    header.className = "header" + (document.body.dataset.header === "light" ? " header--light" : "");
    header.id = "header";
    header.innerHTML = `
      <div class="container">
        <a href="index.html" class="logo" aria-label="${C.brand} — Beranda">${logo}</a>
        <nav class="nav" aria-label="Navigasi utama">${navLinks}</nav>
        <div class="header__actions">
          <a class="btn btn--ghost btn--sm header__wa" data-wa target="_blank" rel="noopener">${WA_SVG}<span>Chat Admin</span></a>
          <a class="btn btn--primary btn--sm" href="booking.html" data-magnetic>Pesan Sekarang ${ico("arrow-right", "arrow")}</a>
          <button class="burger" aria-label="Buka menu" aria-expanded="false" aria-controls="mmenu"><span class="burger__inner"><span></span><span></span></span></button>
        </div>
      </div>`;
    document.body.prepend(header);

    const mmenu = document.createElement("div");
    mmenu.className = "mmenu";
    mmenu.id = "mmenu";
    mmenu.innerHTML = `
      <nav aria-label="Menu seluler">
        ${NAV.map(([href, label, key], i) => `<a href="${href}"${key === activeKey ? ' aria-current="page"' : ""}><small>0${i + 1}</small>${label}</a>`).join("")}
        <a href="booking.html"><small>06</small>Pesan Mobil</a>
      </nav>
      <div class="mmenu__foot">
        <a class="btn btn--wa btn--lg btn--block" data-wa target="_blank" rel="noopener">${WA_SVG} Chat via WhatsApp</a>
        <p>${C.address}<br>Admin online 24 jam · ${C.waDisplay}</p>
      </div>`;
    header.after(mmenu);

    const footer = document.createElement("footer");
    footer.className = "footer grain";
    footer.innerHTML = `
      <div class="container">
        <div class="footer__top">
          <div class="footer__about">
            <a href="index.html" class="logo logo--light" aria-label="${C.brand}">${logo}</a>
            <p>Rental mobil Jakarta sejak ${C.since}. Lepas kunci atau dengan sopir, unit terawat, harga transparan, dan admin yang benar-benar membalas.</p>
            <div class="socials">
              <a href="#" aria-label="Instagram">${ico("instagram")}</a>
              <a data-wa target="_blank" rel="noopener" aria-label="WhatsApp">${WA_SVG}</a>
              <a href="mailto:${C.email}" aria-label="Email">${ico("mail")}</a>
            </div>
          </div>
          <div>
            <h4>Jelajahi</h4>
            <ul>${NAV.map(([h, l]) => `<li><a class="link-underline" href="${h}">${l}</a></li>`).join("")}<li><a class="link-underline" href="booking.html">Pesan Mobil</a></li></ul>
          </div>
          <div>
            <h4>Layanan</h4>
            <ul>${L.services.map((s) => `<li><a class="link-underline" href="layanan.html#${s.id}">${s.title}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>Hubungi</h4>
            <ul class="footer__contact">
              <li>${ico("map-pin")}<span>${C.address}</span></li>
              <li>${ico("phone")}<a href="tel:${C.phone.replace(/[^0-9+]/g, "")}">${C.phone}</a></li>
              <li>${ico("message-circle")}<a data-wa target="_blank" rel="noopener">${C.waDisplay}</a></li>
              <li>${ico("clock")}<span>Setiap hari ${C.hours[0][1]} WIB</span></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} ${C.brand}. Semua hak dilindungi.</span>
          <span>Harga dapat berubah sewaktu-waktu · <a class="link-underline" href="panduan.html#ketentuan">Syarat & Ketentuan</a></span>
        </div>
      </div>
      <div class="footer__word" aria-hidden="true">lala<span>.</span></div>`;
    document.body.append(footer);

    // Floating WhatsApp
    const wa = document.createElement("div");
    wa.className = "wa-float";
    wa.innerHTML = `
      <div class="wa-float__bubble"><strong><i></i>Admin Lala online</strong><span>Rata-rata membalas &lt; 5 menit</span></div>
      <a class="wa-float__btn" data-wa target="_blank" rel="noopener" aria-label="Chat WhatsApp">${WA_SVG}</a>`;
    document.body.append(wa);

    // Mobile bottom bar
    if (!document.body.hasAttribute("data-no-mbar")) {
      const mbar = document.createElement("div");
      mbar.className = "mbar";
      mbar.innerHTML = `
        <a class="btn btn--wa" data-wa target="_blank" rel="noopener">${WA_SVG} WhatsApp</a>
        <a class="btn btn--primary" href="booking.html">${ico("calendar-check")} Pesan</a>`;
      document.body.append(mbar);
    }

    // Cursor
    if (finePointer && !reduce) {
      const cur = document.createElement("div");
      cur.className = "cursor";
      document.body.append(cur);
    }
  }

  function hydrateWaLinks(root = document) {
    $$("[data-wa-icon]", root).forEach((s) => { s.outerHTML = WA_SVG; });
    $$("[data-wa]", root).forEach((a) => {
      if (a.dataset.waBound) return;
      a.href = waUrl(a.dataset.wa || "");
      a.dataset.waBound = "1";
    });
  }

  /* ---------------- Header / menu ---------------- */
  function initHeader() {
    const header = $("#header");
    const mbar = $(".mbar");
    const startLight = header.classList.contains("header--light");
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const scrolled = y > 40;
      header.classList.toggle("header--scrolled", scrolled);
      if (startLight) header.classList.toggle("header--light", !scrolled);
      const hide = y > 320 && y > lastY && !document.body.classList.contains("menu-open");
      header.classList.toggle("header--hidden", hide);
      document.body.classList.toggle("header-hidden", hide);
      if (mbar) mbar.classList.toggle("is-visible", y > (page === "home" ? 500 : 160));
      lastY = y;
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();

    const burger = $(".burger");
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) burger.click();
    });

    // WA bubble teaser
    const waf = $(".wa-float");
    if (waf) {
      setTimeout(() => waf.classList.add("show-bubble"), 3500);
      setTimeout(() => waf.classList.remove("show-bubble"), 9500);
    }
  }

  /* ---------------- FAQ accordion ---------------- */
  function initFaq(root = document) {
    $$(".faq__item", root).forEach((item) => {
      const btn = $(".faq__q", item);
      const panel = $(".faq__a", item);
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        const open = !item.classList.contains("is-open");
        const group = item.closest(".faq");
        if (group && group.dataset.single !== undefined) {
          $$(".faq__item.is-open", group).forEach((o) => { if (o !== item) { o.classList.remove("is-open"); $(".faq__a", o).style.height = "0px"; $(".faq__q", o).setAttribute("aria-expanded", "false"); } });
        }
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open);
        panel.style.height = open ? panel.scrollHeight + "px" : "0px";
        setTimeout(() => hasGsap && ScrollTrigger.refresh(), 650);
      });
    });
  }

  function renderFaq(container, list) {
    container.innerHTML = list.map((f) => `
      <div class="faq__item">
        <button class="faq__q" type="button">${f.q}<span class="faq__icon" aria-hidden="true"></span></button>
        <div class="faq__a"><div>${f.a}</div></div>
      </div>`).join("");
    initFaq(container);
  }

  /* ---------------- Marquee ---------------- */
  function initMarquee() {
    $$(".marquee").forEach((m) => {
      const track = $(".marquee__track", m);
      if (!track || m.children.length > 1) return;
      const clone = track.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      m.append(clone);
    });
  }

  /* ---------------- Split text ---------------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$(".wmask > span", el);
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.append(document.createTextNode(" ")); return; }
            const m = document.createElement("span");
            m.className = "wmask";
            const s = document.createElement("span");
            s.textContent = p;
            m.append(s);
            frag.append(m);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = "1";
    return $$(".wmask > span", el);
  }

  /* ---------------- Motion ---------------- */
  let lenis = null;

  function initLenis() {
    if (reduce || !window.Lenis) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    // in-page anchors
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"], a[href*=".html#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      history.replaceState(null, "", url.hash);
    });
  }

  function revealAll(root = document) {
    if (!hasGsap || reduce) {
      $$("[data-reveal]", root).forEach((el) => { el.style.opacity = 1; });
      return;
    }
    $$("[data-reveal]:not([data-revealed])", root).forEach((el) => {
      el.setAttribute("data-revealed", "");
      const type = el.dataset.reveal || "up";
      const st = { trigger: el, start: "top 88%", once: true };
      const delay = parseFloat(el.dataset.delay || 0);
      if (type === "stagger") {
        gsap.set(el, { opacity: 1 });
        gsap.from(el.children, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay, scrollTrigger: st, clearProps: "transform,opacity" });
      } else if (type === "clip") {
        gsap.fromTo(el, { opacity: 1, clipPath: "inset(12% 12% 12% 12% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.5, ease: "expo.out", delay, scrollTrigger: st });
        const img = $("img", el);
        if (img && !img.hasAttribute("data-parallax")) gsap.from(img, { scale: 1.25, duration: 1.8, ease: "expo.out", delay, scrollTrigger: st });
      } else if (type === "fade") {
        gsap.to(el, { opacity: 1, duration: 1.2, ease: "power2.out", delay, scrollTrigger: st });
      } else if (type === "left") {
        gsap.fromTo(el, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1.2, ease: "expo.out", delay, scrollTrigger: st });
      } else {
        gsap.fromTo(el, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", delay, scrollTrigger: st, clearProps: "transform" });
      }
    });

    $$("[data-split]:not([data-split-init])", root).forEach((el) => {
      if (el.hasAttribute("data-split-manual")) return;
      el.setAttribute("data-split-init", "");
      const words = splitWords(el);
      gsap.from(words, { yPercent: 115, rotate: 4, duration: 1.2, ease: "expo.out", stagger: 0.045, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });

    $$("[data-parallax]", root).forEach((el) => {
      if (el.dataset.pxBound) return;
      el.dataset.pxBound = "1";
      const v = parseFloat(el.dataset.parallax || 12);
      gsap.fromTo(el, { yPercent: -v }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    $$("[data-count]", root).forEach((el) => {
      if (el.dataset.countBound) return;
      el.dataset.countBound = "1";
      const end = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split(".")[1] || "").length;
      const obj = { v: 0 };
      el.textContent = (0).toFixed(dec);
      gsap.to(obj, {
        v: end, duration: 2.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top bottom", once: true },
        onUpdate: () => { el.textContent = obj.v.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
      });
    });
  }

  function initMagnetic(root = document) {
    if (!finePointer || reduce || !hasGsap) return;
    $$("[data-magnetic]", root).forEach((el) => {
      if (el.dataset.magBound) return;
      el.dataset.magBound = "1";
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.28);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }

  function initTilt(root = document) {
    if (!finePointer || reduce || !hasGsap) return;
    $$(".car-card", root).forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      gsap.set(card, { transformPerspective: 1000 });
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 6); rx(-py * 6);
      });
      card.addEventListener("mouseleave", () => { rx(0); ry(0); });
    });
  }

  function initCursor() {
    const cur = $(".cursor");
    if (!cur || !hasGsap) return;
    const xTo = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3.out" });
    cur.classList.add("is-hide");
    let first = true;
    window.addEventListener("mousemove", (e) => {
      if (first) { gsap.set(cur, { x: e.clientX, y: e.clientY }); cur.classList.remove("is-hide"); first = false; }
      xTo(e.clientX); yTo(e.clientY);
    }, { passive: true });
    document.addEventListener("mouseover", (e) => {
      const view = e.target.closest("[data-cursor='view']");
      const hide = e.target.closest("a, button, input, select, textarea, label, .seg, .chip");
      cur.classList.toggle("is-view", !!view);
      cur.classList.toggle("is-hide", !view && !!hide);
    });
    document.addEventListener("mouseleave", () => cur.classList.add("is-hide"));
    document.addEventListener("mouseenter", () => cur.classList.remove("is-hide"));
  }

  /* ---------------- Page transitions ---------------- */
  function initTransitions(onEntered) {
    const pt = $(".ptrans");
    const p1 = pt && $(".ptrans__panel--1", pt);
    const p2 = pt && $(".ptrans__panel--2", pt);
    const lg = pt && $(".ptrans__logo", pt);
    const entering = doc.classList.contains("is-entering");

    if (!pt || !hasGsap || reduce) {
      doc.classList.remove("is-entering");
      onEntered();
      return;
    }

    if (entering) {
      gsap.set(p2, { yPercent: 0 });
      gsap.set(p1, { yPercent: 100 });
      doc.classList.remove("is-entering");
      gsap.to(p2, {
        yPercent: -100, duration: 1, ease: "expo.inOut", delay: 0.05,
        onComplete: () => gsap.set(p2, { yPercent: 100 })
      });
      setTimeout(onEntered, 450);
    } else {
      gsap.set([p1, p2], { yPercent: 100 });
      onEntered();
    }

    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (!/\.html$/.test(url.pathname) && !url.pathname.endsWith("/")) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      try { sessionStorage.setItem("lala-nav", "1"); } catch (_) {}
      const tl = gsap.timeline({ onComplete: () => { location.href = url.href; } });
      tl.to(p1, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
        .to(p2, { yPercent: 0, duration: 0.6, ease: "expo.inOut" }, 0.1)
        .to(lg, { opacity: 1, duration: 0.3 }, 0.45);
    });

    window.addEventListener("pageshow", (e) => {
      if (e.persisted) { gsap.set([p1, p2], { yPercent: 100 }); gsap.set(lg, { opacity: 0 }); }
    });
  }

  /* ---------------- Preloader (beranda, sekali per sesi) ---------------- */
  function runPreloader(done) {
    const pre = $(".preloader");
    if (!pre || doc.classList.contains("no-preloader") || !hasGsap || reduce) {
      if (pre) pre.remove();
      done();
      return;
    }
    try { sessionStorage.setItem("lala-seen", "1"); } catch (_) {}
    if (lenis) lenis.stop();
    const letters = splitWords($(".preloader__word", pre));
    const count = $(".preloader__count", pre);
    const bar = $(".preloader__road i", pre);
    const obj = { v: 0 };
    gsap.timeline({
      onComplete: () => { pre.remove(); if (lenis) lenis.start(); }
    })
      .from(letters, { yPercent: 110, duration: 0.9, ease: "expo.out" })
      .to(obj, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { count.textContent = String(Math.round(obj.v)).padStart(3, "0"); } }, 0.1)
      .to(bar, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.1)
      .to(pre, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "+=0.15")
      .add(done, "-=0.55");
  }

  /* ---------------- Hero intro ---------------- */
  function heroIntro() {
    const title = $("[data-hero-title]");
    if (!title || !hasGsap || reduce) return;
    const words = splitWords(title);
    const tl = gsap.timeline();
    tl.from(words, { yPercent: 120, rotate: 5, duration: 1.4, ease: "expo.out", stagger: 0.06 })
      .from("[data-hero-fade]", { y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.35)
      .from(".quick", { y: 60, opacity: 0, duration: 1.3, ease: "expo.out" }, 0.55)
      .from(".hero__stat", { y: 20, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.8)
      .from(".spin-badge", { scale: 0, rotate: -90, duration: 1.4, ease: "expo.out" }, 0.6)
      .from(".hero__media img", { scale: 1.2, duration: 2.4, ease: "expo.out" }, 0);
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    renderShell();
    if (window.LalaPage && typeof window.LalaPage.init === "function") window.LalaPage.init();
    hydrateWaLinks();
    refreshIcons();
    initHeader();
    initFaq();
    initMarquee();
    initLenis();
    initCursor();

    const start = () => {
      heroIntro();
      revealAll();
      initMagnetic();
      initTilt();
      if (window.LalaPage && typeof window.LalaPage.afterReveal === "function") window.LalaPage.afterReveal();
    };

    initTransitions(() => {
      if ($(".preloader") && !doc.classList.contains("no-preloader")) runPreloader(start);
      else { const p = $(".preloader"); if (p) p.remove(); start(); }
    });

    window.addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
  }

  /* Public API for pages.js */
  window.LalaUI = {
    $, $$, fmt, fmtK, waUrl, ico, WA_SVG, qs, carById, refreshIcons, hydrateWaLinks,
    revealAll, initMagnetic, initTilt, initFaq, renderFaq, splitWords,
    get lenis() { return lenis; }, hasGsap, reduce, finePointer
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
