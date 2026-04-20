// javascript/package.js
// Carousel + price toggle + addons auto-fit (fixed sidebar that shrinks content if needed)

document.addEventListener('DOMContentLoaded', function () {

  // ======= HERO TYPING EFFECT =======
  const texts = [
    "Choose the perfect room for your glamping experience.",
    "A variety of glamping accommodations to suit every stay.",
    "Comfortable spaces designed for relaxation and nature lovers.",
    "Find the ideal glamping room for your next getaway."
  ];

  let index = 0;
  let charIndex = 0;
  let deleting = false;
  const textEl = document.getElementById("changingText");

  function typeEffect() {
    if (!textEl) return;
    const current = texts[index];
    textEl.textContent = current.substring(0, charIndex);

    if (!deleting && charIndex < current.length) charIndex++;
    else if (deleting && charIndex > 0) charIndex--;
    else {
      deleting = !deleting;
      if (!deleting) index = (index + 1) % texts.length;
    }
    setTimeout(typeEffect, deleting ? 60 : 100);
  }
  setTimeout(typeEffect, 800);

  /* ---------- Price toggle ---------- */
  const wrapper = document.querySelector('.wrap');
  const defaultMode = (wrapper && wrapper.dataset && wrapper.dataset.defaultMode) ? wrapper.dataset.defaultMode : 'weekdays';
  const toggles = Array.from(document.querySelectorAll('.toggle-btn'));
  function setMode(mode) {
    toggles.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    document.querySelectorAll('.price-val').forEach(el => {
      const txt = el.getAttribute('data-' + mode);
      if (txt) el.textContent = txt;
    });
  }
  toggles.forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));
  setMode(defaultMode);

  /* ---------- Carousel init (absolute slides) ---------- */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(car => {
      if (car.dataset.inited === '1') return;
      car.dataset.inited = '1';

      const images = JSON.parse(car.dataset.images || '[]');
      const slidesWrap = car.querySelector('.cslides');
      const dotsWrap = car.querySelector('.cdots');
      let idx = 0;

      // ensure slidesWrap height matches container
      function syncHeight() {
        const h = car.clientHeight || 360;
        slidesWrap.style.height = h + 'px';
      }
      syncHeight();

      slidesWrap.innerHTML = '';
      dotsWrap.innerHTML = '';

      if (!images.length) {
        const ph = document.createElement('div');
        ph.style.height = car.clientHeight ? car.clientHeight + 'px' : '260px';
        ph.style.display = 'flex';
        ph.style.alignItems = 'center';
        ph.style.justifyContent = 'center';
        ph.style.color = '#666';
        ph.textContent = 'No image';
        slidesWrap.appendChild(ph);
        return;
      }

      images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `slide ${i+1}`;
        img.style.transform = 'translateX(100%)';
        slidesWrap.appendChild(img);

        const dot = document.createElement('button');
        dot.addEventListener('click', () => show(i));
        dotsWrap.appendChild(dot);
      });

      let imgs = Array.from(slidesWrap.querySelectorAll('img'));

      function show(i) {
        if (!imgs.length) return;
        const total = imgs.length;
        idx = ((i % total) + total) % total;
        imgs.forEach((img, k) => {
          if (k === idx) {
            img.style.transform = 'translateX(0%)';
            img.style.zIndex = 50;
          } else if (k < idx) {
            img.style.transform = 'translateX(-100%)';
            img.style.zIndex = 30;
          } else {
            img.style.transform = 'translateX(100%)';
            img.style.zIndex = 30;
          }
        });
        Array.from(dotsWrap.children).forEach((d, di) => d.classList.toggle('active', di === idx));
      }

      const prev = car.querySelector('.cprev');
      const next = car.querySelector('.cnext');

      prev && prev.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
      next && next.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });

      [prev, next].forEach(b => { if (b) b.style.zIndex = 200; });

      // when images load, recalc height & show
      imgs.forEach(img => {
        img.addEventListener('load', () => {
          syncHeight();
          setTimeout(() => show(idx), 40);
        });
      });

      // ensure show first after small delay if images cached
      setTimeout(() => {
        imgs = Array.from(slidesWrap.querySelectorAll('img'));
        syncHeight();
        show(0);
      }, 80);

      window.addEventListener('resize', () => {
        syncHeight();
      });

    });
  }

  initCarousels();
  setTimeout(initCarousels, 250);

  /* ---------- Addons: make fixed and auto-fit (shrink content if necessary) ---------- */
  (function addonsAutoFit(){
    const panel = document.querySelector('.addons-panel');
    if (!panel) return;

    // Use inner container if present; otherwise the panel itself
    const inner = panel.querySelector('.addons-inner') || panel;
    const imgs = Array.from(inner.querySelectorAll('img'));

    // top offset (should match CSS top)
    const topOffset = 110;
    function availableHeight() {
      return window.innerHeight - topOffset - 20; // breathing room
    }

    // initial and minimum values
    const initial = { imgHeight: 120, gap: 18, titleSize: 16, descSize: 14 };
    const min =     { imgHeight: 60,  gap: 6,  titleSize: 13, descSize: 12  };

    // helper to apply sizes
    function applySizes(imgH, gap, titleSize, descSize){
      
      inner.style.gap = gap + 'px';
      inner.querySelectorAll('h4').forEach(h => h.style.fontSize = titleSize + 'px');
      inner.querySelectorAll('p').forEach(p => p.style.fontSize = descSize + 'px');
    }

    // attempt to fit: progressively shrink until fits or reaches min
    function tryFit(){
      // reset to initial
      applySizes(initial.imgHeight, initial.gap, initial.titleSize, initial.descSize);

      const avail = availableHeight();
      // if already fits, done
      if (inner.scrollHeight <= avail) {
        panel.style.visibility = 'visible';
        return;
      }

      let curImgH = initial.imgHeight, curGap = initial.gap, curTitle = initial.titleSize, curDesc = initial.descSize;

      for (let iter = 0; iter < 12; iter++){
        curImgH = Math.max(min.imgHeight, Math.round(curImgH * 0.92));
        curGap   = Math.max(min.gap, Math.round(curGap * 0.92));
        curTitle = Math.max(min.titleSize, Math.round(curTitle * 0.97));
        curDesc  = Math.max(min.descSize, Math.round(curDesc * 0.97));

        applySizes(curImgH, curGap, curTitle, curDesc);

        // reflow & check
        if (inner.scrollHeight <= avail) break;
      }

      // final fallback: force minimums
      if (inner.scrollHeight > avail) {
        applySizes(min.imgHeight, min.gap, min.titleSize, min.descSize);
      }

      panel.style.visibility = 'visible';
    }

    // run after short delay and on resize
    setTimeout(tryFit, 140);
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(tryFit, 120);
    });

    // when addon images load later, re-run
    imgs.forEach(img => img.addEventListener('load', () => {
      setTimeout(tryFit, 120);
    }));
  })();

});

/* =========================
   HEADER & MOBILE NAV 
========================= */
const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

/* SOLID BLACK */
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* TOGGLE MOBILE MENU */
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
  menuToggle.classList.toggle("active");
});

/* AUTO CLOSE MOBILE MENU */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    menuToggle.classList.remove("active");
  });
});
