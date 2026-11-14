// Light/dark switch. Loaded in <head> so the saved theme applies before the page paints.
(function () {
  var KEY = "theme";
  var theme = "light";
  try { theme = localStorage.getItem(KEY) === "dark" ? "dark" : "light"; } catch (e) {}
  document.documentElement.setAttribute("data-theme", theme);

  function label(btn) {
    btn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    label(btn);
    btn.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", theme);
      try { localStorage.setItem(KEY, theme); } catch (e) {}
      label(btn);
    });
  });
})();
