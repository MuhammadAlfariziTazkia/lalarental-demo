/* ==========================================================================
   Lala Rent Car — Shell (header, menu, footer, bar WA) + motion engine
   Depends on: data.js, lucide, gsap + ScrollTrigger, lenis
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

  /* ---------------- Helpers ---------------- */
  const fmt = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const WA_MAIN = C.wa[0].intl; // semua tombol pesan → WA 1
  const waUrl = (text, num = WA_MAIN) => `https://wa.me/${num}?text=${encodeURIComponent(text || C.waMessage)}`;
  const ico = (name, cls = "") => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ""} aria-hidden="true"></i>`;
  const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  const refreshIcons = () => { if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 1.75 } }); };

  /* ---------------- Shell ---------------- */
  const NAV = [
    ["#armada", "Armada"],
    ["#cara-pesan", "Cara Pesan"],
    ["#layanan", "Layanan"],
    ["#kenapa", "Kenapa Kami"],
    ["#faq", "FAQ"],
    ["#kontak", "Kontak"]
  ];
  const brand = (cls = "") => `
    <a href="#beranda" class="brand ${cls}" aria-label="${C.name} — ke atas">
      <img src="assets/img/logo-lala.png" alt="" width="48" height="48">
      <span class="brand__text"><span class="brand__name">${C.name}</span><span class="brand__tag">${C.area}</span></span>
    </a>`;

  function renderShell() {
    const header = document.createElement("header");
    header.className = "header";
    header.id = "header";
    header.innerHTML = `
      <div class="container">
        ${brand()}
        <nav class="nav" aria-label="Navigasi utama">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</nav>
        <div class="header__actions">
          <a class="btn btn--wa btn--sm header__wa" data-wa target="_blank" rel="noopener" aria-label="Pesan via WhatsApp">${WA_SVG}<span class="header__wa-text">Pesan via WhatsApp</span></a>
          <button class="burger" aria-label="Buka menu" aria-expanded="false" aria-controls="mmenu"><span><span></span><span></span></span></button>
        </div>
      </div>`;
    document.body.prepend(header);

    const mmenu = document.createElement("div");
    mmenu.className = "mmenu";
    mmenu.id = "mmenu";
    mmenu.innerHTML = `
      <nav aria-label="Menu">${NAV.map(([h, l], i) => `<a href="${h}"><small>0${i + 1}</small>${l}</a>`).join("")}</nav>
      <div class="mmenu__foot">
        <a class="btn btn--wa btn--lg btn--block" data-wa target="_blank" rel="noopener">${WA_SVG}Pesan via WhatsApp</a>
        <p>${C.name} · Base ${C.base}<br>WA: ${C.wa.map((w) => w.display).join(" / ")}</p>
      </div>`;
    header.after(mmenu);

    const footer = document.createElement("footer");
    footer.className = "footer grain";
    footer.innerHTML = `
      <div class="container">
        <div class="footer__top">
          <div class="footer__about">
            ${brand()}
            <p>${C.name} | ${C.tagline}.</p>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>${NAV.map(([h, l]) => `<li><a class="link-underline" href="${h}">${l}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>Kontak</h4>
            <ul class="footer__contact">
              ${C.wa.map((w) => `<li>${WA_SVG.replace("<svg", '<svg style="width:20px;height:20px;color:var(--wa)"')}<a class="link-underline" href="${waUrl("", w.intl)}" target="_blank" rel="noopener">WA: ${w.display}</a></li>`).join("")}
              <li>${ico("map-pin")}<span>Alamat: ${C.address}</span></li>
              <li>${ico("route")}<span>Melayani ${C.area}</span></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} ${C.name}</span>
          <span>Foto mobil adalah foto ilustrasi model, bukan foto unit.</span>
        </div>
      </div>
      <div class="footer__word" aria-hidden="true">lala<span>.</span></div>`;
    document.body.append(footer);
  }

  function hydrateWaLinks(root = document) {
    $$("[data-wa-icon]", root).forEach((s) => { s.outerHTML = WA_SVG; });
    $$("[data-wa]", root).forEach((a) => {
      if (a.dataset.waBound) return;
      a.href = waUrl(a.dataset.wa || "");
      a.dataset.waBound = "1";
    });
  }

  /* ---------------- Header, menu, bar WA ---------------- */
  function initHeader() {
    const header = $("#header");
    let ticking = false;
    const update = () => { header.classList.toggle("header--scrolled", window.scrollY > 40); ticking = false; };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();

    const burger = $(".burger");
    const setMenu = (open) => {
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    };
    burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    $$(".mmenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

    // Active nav link by section
    const links = $$(".nav a");
    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach((s) => io.observe(s));
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

  function initMarquee() {
    $$(".marquee").forEach((m) => {
      const track = $(".marquee__track", m);
      if (!track || m.children.length > 1) return;
      const clone = track.cloneNode(true);
      clone.removeAttribute("id");
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
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((p) => {
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
        } else if (child.nodeType === 1 && child.tagName !== "BR") walk(child);
      });
    };
    walk(el);
    el.dataset.splitDone = "1";
    return $$(".wmask > span", el);
  }
  // Setelah animasi selesai, mask dilepas supaya huruf tidak terpotong
  const release = (el) => () => el.classList.add("split-released");

  /* ---------------- Motion ---------------- */
  let lenis = null;
  function initLenis() {
    if (!reduce && window.Lenis) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      window.__lenis = lenis;
      if (hasGsap) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const target = id === "#beranda" ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === "#beranda" ? 0 : target, { offset: -70, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
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
      if (type === "stagger") {
        gsap.set(el, { opacity: 1 });
        gsap.from(el.children, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: st, clearProps: "transform,opacity" });
      } else if (type === "clip") {
        gsap.fromTo(el, { opacity: 1, clipPath: "inset(10% 10% 10% 10% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: 1.5, ease: "expo.out", scrollTrigger: st, clearProps: "clipPath" });
      } else {
        gsap.fromTo(el, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: st, clearProps: "transform" });
      }
    });

    $$("[data-split]:not([data-split-init])", root).forEach((el) => {
      el.setAttribute("data-split-init", "");
      const words = splitWords(el);
      gsap.from(words, { yPercent: 115, rotate: 4, duration: 1.2, ease: "expo.out", stagger: 0.045, scrollTrigger: { trigger: el, start: "top 88%", once: true }, onComplete: release(el) });
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
      const obj = { v: 0 };
      el.textContent = "0";
      gsap.to(obj, {
        v: end, duration: 2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top bottom", once: true },
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString("id-ID"); }
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
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
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
        ry(((e.clientX - r.left) / r.width - 0.5) * 5);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 5);
      });
      card.addEventListener("mouseleave", () => { rx(0); ry(0); });
    });
  }

  /* ---------------- Preloader (sekali per sesi) ---------------- */
  function runPreloader(done) {
    const pre = $(".preloader");
    if (!pre || doc.classList.contains("no-preloader") || !hasGsap || reduce) {
      if (pre) pre.remove();
      done();
      return;
    }
    try { sessionStorage.setItem("lala-seen", "1"); } catch (_) {}
    if (lenis) lenis.stop();
    const count = $(".preloader__count", pre);
    const obj = { v: 0 };
    gsap.timeline({ onComplete: () => { pre.remove(); if (lenis) lenis.start(); } })
      .from(".preloader__logo", { scale: 0.4, opacity: 0, rotate: -40, duration: 1, ease: "expo.out" })
      .to(obj, { v: 100, duration: 1.2, ease: "power2.inOut", onUpdate: () => { count.textContent = String(Math.round(obj.v)).padStart(3, "0"); } }, 0.1)
      .to(".preloader__road i", { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.1)
      .to(pre, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "+=0.1")
      .add(done, "-=0.55");
  }

  function heroIntro() {
    if (!hasGsap || reduce) return;
    const titles = $$("[data-hero-title]");
    const tl = gsap.timeline();
    titles.forEach((t, i) => {
      const words = splitWords(t);
      tl.from(words, { yPercent: 120, rotate: 5, duration: 1.4, ease: "expo.out", stagger: 0.06, onComplete: release(t) }, i * 0.25);
    });
    tl.from("[data-hero-fade]", { y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, clearProps: "transform,opacity" }, 0.3)
      .from("[data-hero-visual]", { y: 60, opacity: 0, duration: 1.4, ease: "expo.out", clearProps: "transform,opacity" }, 0.35)
      .from(".hero__logo", { scale: 0, rotate: -120, duration: 1.4, ease: "back.out(1.6)" }, 0.8)
      .from(".fact", { y: 20, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, clearProps: "transform,opacity" }, 0.8);
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
    runPreloader(() => {
      heroIntro();
      revealAll();
      initMagnetic();
      initTilt();
      if (window.LalaPage && typeof window.LalaPage.afterReveal === "function") window.LalaPage.afterReveal();
    });
    window.addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
  }

  window.LalaUI = { $, $$, fmt, waUrl, ico, WA_SVG, refreshIcons, hasGsap, reduce };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
