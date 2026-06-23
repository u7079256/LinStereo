/* ============================================================
   LinStereo project page — interactions (vanilla JS, no deps)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Navbar: scrolled state + mobile burger ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Comparison wipe slider ---------- */
  var SCENES = {
    a: { input: "static/images/slider_a_input.jpg", depth: "static/images/slider_a_depth.jpg" },
    b: { input: "static/images/slider_b_input.jpg", depth: "static/images/slider_b_depth.jpg" },
    c: { input: "static/images/slider_c_input.jpg", depth: "static/images/slider_c_depth.jpg" }
  };

  var cmp = document.getElementById("cmpTeaser");
  if (cmp) {
    var frame = cmp.querySelector(".cmp__frame");
    var handle = document.getElementById("cmpHandle");
    var front = document.getElementById("cmpFront");
    var back = document.getElementById("cmpBack");

    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      frame.style.setProperty("--pos", pct + "%");
      if (handle) handle.setAttribute("aria-valuenow", Math.round(pct));
    }
    function posFromEvent(clientX) {
      var r = frame.getBoundingClientRect();
      setPos(((clientX - r.left) / r.width) * 100);
    }

    var dragging = false;
    frame.addEventListener("pointerdown", function (e) {
      dragging = true;
      frame.setPointerCapture(e.pointerId);
      posFromEvent(e.clientX);
    });
    frame.addEventListener("pointermove", function (e) {
      if (dragging) posFromEvent(e.clientX);
    });
    frame.addEventListener("pointerup", function () { dragging = false; });
    frame.addEventListener("pointercancel", function () { dragging = false; });

    if (handle) {
      handle.addEventListener("keydown", function (e) {
        var cur = parseFloat(frame.style.getPropertyValue("--pos")) || 50;
        if (e.key === "ArrowLeft") { setPos(cur - 3); e.preventDefault(); }
        else if (e.key === "ArrowRight") { setPos(cur + 3); e.preventDefault(); }
      });
    }

    // Scene tabs
    var teaserTabs = document.getElementById("teaserTabs");
    if (teaserTabs) {
      teaserTabs.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab");
        if (!btn) return;
        var s = SCENES[btn.getAttribute("data-scene")];
        if (!s) return;
        front.src = s.input;
        back.src = s.depth;
        teaserTabs.querySelectorAll(".tab").forEach(function (t) {
          var on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        setPos(50);
      });
    }
    setPos(50);
  }

  /* ---------- Water-condition explorer ---------- */
  var condTabs = document.getElementById("condTabs");
  var condImg = document.getElementById("condImg");
  if (condTabs && condImg) {
    condTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (!btn) return;
      condImg.src = "static/images/cond_" + btn.getAttribute("data-cond") + ".jpg";
      condTabs.querySelectorAll(".tab").forEach(function (t) {
        var on = t === btn;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
  }

  /* ---------- BibTeX copy ---------- */
  var copyBtn = document.getElementById("copyBibtex");
  var code = document.getElementById("bibtexCode");
  if (copyBtn && code) {
    copyBtn.addEventListener("click", function () {
      var text = code.textContent;
      var done = function () {
        copyBtn.classList.add("is-done");
        var span = copyBtn.querySelector("span");
        var prev = span.textContent;
        span.textContent = "Copied!";
        setTimeout(function () { copyBtn.classList.remove("is-done"); span.textContent = prev; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text); done(); });
      } else { fallback(text); done(); }
    });
  }
  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
