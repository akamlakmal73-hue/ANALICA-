(function () {
  var WA = "6281930042640";

  var track = document.querySelector(".track");
  if (!track) return;
  var cards = Array.prototype.slice.call(track.querySelectorAll(".card"));
  var prev = document.querySelector(".prev");
  var next = document.querySelector(".next");
  var dotsBox = document.querySelector(".dots");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = 0;

  function category() {
    var h = document.querySelector("h1");
    return h ? h.textContent.trim() : "Paket";
  }

  function waLink(card) {
    var nameEl = card ? card.querySelector("h2") : null;
    var priceEl = card ? card.querySelector(".price b") : null;
    var name = nameEl ? nameEl.textContent.trim() : "";
    var price = priceEl ? priceEl.textContent.trim() : "";
    var msg = "Halo Analica Creative Studio, saya mau tanya/pesan " + category();
    if (name) msg += " paket " + name;
    if (price) msg += " (" + price + ")";
    msg += ". Bisa dibantu?";
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  function wire(el, card) {
    el.setAttribute("href", waLink(card));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  }

  // Tombol "Pesan Sekarang" di tiap kartu
  cards.forEach(function (c) {
    var b = c.querySelector(".btn");
    if (b) wire(b, c);
  });

  // Tombol "Hubungi Kami" di header (pesan umum, tanpa paket)
  Array.prototype.forEach.call(document.querySelectorAll("[data-wa]"), function (a) {
    wire(a, null);
  });

  // Titik indikator
  var dots = [];
  if (dotsBox) {
    if (!dotsBox.children.length) {
      cards.forEach(function (_, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", "Paket " + (i + 1));
        dotsBox.appendChild(d);
      });
    }
    dots = Array.prototype.slice.call(dotsBox.querySelectorAll("button"));
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { go(i); });
    });
  }

  function go(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    var c = cards[i];
    var left = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
    track.scrollTo({ left: left, behavior: reduce ? "auto" : "smooth" });
  }

  function update() {
    var mid = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    cards.forEach(function (c, i) {
      var dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    current = best;
    cards.forEach(function (c, i) { c.classList.toggle("hl", i === best); });
    dots.forEach(function (d, i) {
      if (i === best) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
    if (prev) prev.disabled = best === 0;
    if (next) next.disabled = best === cards.length - 1;
  }

  if (prev) prev.addEventListener("click", function () { go(current - 1); });
  if (next) next.addEventListener("click", function () { go(current + 1); });

  track.setAttribute("tabindex", "0");
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
  });

  var ticking = false;
  track.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", update);

  // Mulai dari kartu tengah (paket yang disorot)
  var start = Math.floor((cards.length - 1) / 2);
  var c0 = cards[start];
  if (c0) {
    track.scrollLeft = c0.offsetLeft - (track.clientWidth - c0.offsetWidth) / 2;
  }
  update();
})();
