// Sideways navigation between the sections of the site.
// A two-finger horizontal swipe on a trackpad (or a touch swipe, or the left/right arrow keys)
// moves to the next or previous page in this order:
(function () {
  var PAGES = ["index.html", "projects.html", "future.html", "cad.html"];
  var THRESHOLD = 140;   // how far a swipe has to travel before the page changes
  var file = location.pathname.split("/").pop() || "index.html";
  var here = PAGES.indexOf(file);
  if (here === -1) return;

  var travelled = 0;
  var resetTimer = null;
  var leaving = false;
  // A trackpad keeps sending "momentum" scroll for a moment after the fingers lift.
  // Ignore swipes briefly after a page opens so one swipe moves exactly one section.
  var readyAt = Date.now() + 900;

  function go(step) {
    var target = PAGES[here + step];
    if (!target || leaving) return;
    leaving = true;
    var main = document.querySelector("main");
    if (main) main.classList.add(step > 0 ? "leave-left" : "leave-right");
    setTimeout(function () { location.href = target; }, 220);
  }

  // Leave sideways scrolling alone inside anything that scrolls sideways itself (e.g. the diagram on a phone).
  function insideSideScroller(node) {
    for (; node && node !== document.body; node = node.parentElement) {
      if (node.scrollWidth > node.clientWidth + 1) {
        var overflow = getComputedStyle(node).overflowX;
        if (overflow === "auto" || overflow === "scroll") return true;
      }
    }
    return false;
  }

  window.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;   // vertical scroll: leave it alone
    if (insideSideScroller(e.target)) return;
    e.preventDefault();                                     // stop the browser's own back/forward swipe
    if (Date.now() < readyAt) return;
    travelled += e.deltaX;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () { travelled = 0; }, 180);
    if (Math.abs(travelled) >= THRESHOLD) {
      go(travelled > 0 ? 1 : -1);
      travelled = 0;
    }
  }, { passive: false });

  // Touch screens: swipe left for the next section, right for the previous one.
  var startX = null, startY = null;
  window.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1 || insideSideScroller(e.target)) { startX = null; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });

  // If the visitor comes back with the browser's Back button, show the page again.
  window.addEventListener("pageshow", function () {
    leaving = false;
    var main = document.querySelector("main");
    if (main) main.classList.remove("leave-left", "leave-right");
  });
})();
